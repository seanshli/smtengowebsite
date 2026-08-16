import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { rateLimit } from './_ratelimit'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    // Anonymous write endpoint — cap it so the analytics table cannot be filled
    // by a script. Generous, since a real chat session fires several of these.
    const limit = rateLimit(req, { limit: 60, windowMs: 60 * 1000, bucket: 'chatbot' })
    if (!limit.allowed) {
        res.setHeader('Retry-After', String(limit.retryAfter))
        return res.status(429).json({ error: 'Too many requests' })
    }

    const { keyword, locale, matchFound } = req.body || {}

    if (typeof keyword !== 'string' || keyword.length > 500) {
        return res.status(400).json({ error: 'Invalid keyword' })
    }

    try {
        const { data, error } = await supabase
            .from('chatbot_analytics')
            .insert([
                {
                    keyword,
                    locale,
                    match_found: matchFound,
                    created_at: new Date().toISOString()
                }
            ])

        if (error) {
            console.error('Supabase error:', error)
            return res.status(500).json({ error: 'Could not record query' })
        }

        return res.status(200).json({ success: true, data })
    } catch (err: any) {
        console.error('Server error:', err)
        return res.status(500).json({ error: 'Internal error' })
    }
}
