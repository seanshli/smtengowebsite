import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import { signSession, isConfigured } from '../../lib/session.js'
import { rateLimit } from '../../lib/ratelimit.js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    // Slow down password guessing before doing any database or bcrypt work.
    const limit = rateLimit(req, { limit: 10, windowMs: 15 * 60 * 1000, bucket: 'login' })
    if (!limit.allowed) {
        res.setHeader('Retry-After', String(limit.retryAfter))
        return res.status(429).json({ error: 'Too many attempts. Please try again later.' })
    }

    // Fail closed: without a secret we cannot issue a token anyone could trust.
    if (!isConfigured()) {
        console.error('AUTH_SECRET is missing or shorter than 32 chars — refusing to issue sessions')
        return res.status(503).json({ error: 'Authentication is not configured' })
    }

    const { username, password } = req.body

    try {
        const { data: user, error } = await supabase
            .from('backend_members')
            .select('*')
            .eq('username', username)
            .single()

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid username or password' })
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid username or password' })
        }

        return res.status(200).json({
            token: signSession(user.id),
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role
            }
        })
    } catch (err: any) {
        console.error('admin/auth:', err)
        return res.status(500).json({ error: 'Internal error' })
    }
}
