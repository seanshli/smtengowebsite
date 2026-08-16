import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
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

        // Return user info and a "token" (using user ID as token for simplicity as discussed)
        return res.status(200).json({
            token: user.id,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role
            }
        })
    } catch (err: any) {
        return res.status(500).json({ error: err.message })
    }
}
