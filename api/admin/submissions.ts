import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { authenticate } from '../../lib/session'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const user = await authenticate(req, supabase)
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('contact_submissions')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            return res.status(200).json(data)
        } catch (err: any) {
            console.error('Fetch error:', err)
            return res.status(500).json({ error: err.message })
        }
    }

    if (req.method === 'PUT') {
        const { id, ...updates } = req.body
        if (!id) {
            return res.status(400).json({ error: 'Missing submission ID' })
        }

        try {
            const { data, error } = await supabase
                .from('contact_submissions')
                .update(updates)
                .eq('id', id)
                .select()

            if (error) throw error
            return res.status(200).json(data[0])
        } catch (err: any) {
            console.error('Update error:', err)
            return res.status(500).json({ error: err.message })
        }
    }

    if (req.method === 'DELETE') {
        const { id } = req.query
        if (!id) {
            return res.status(400).json({ error: 'Missing submission ID' })
        }

        try {
            const { error } = await supabase
                .from('contact_submissions')
                .delete()
                .eq('id', id)

            if (error) throw error
            return res.status(200).json({ success: true })
        } catch (err: any) {
            console.error('Delete error:', err)
            return res.status(500).json({ error: err.message })
        }
    }

    return res.status(405).json({ error: 'Method not allowed' })
}
