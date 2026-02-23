import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { keyword, locale, matchFound } = req.body

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
            return res.status(500).json({ error: error.message })
        }

        return res.status(200).json({ success: true, data })
    } catch (err: any) {
        console.error('Server error:', err)
        return res.status(500).json({ error: err.message })
    }
}
