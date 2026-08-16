import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import { authenticate } from '../../lib/session.js'
import { supabaseAdmin as supabase } from '../../lib/supabase-admin.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const currentUser = await authenticate(req, supabase)
    if (!currentUser) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    if (currentUser.role !== 'superuser') {
        return res.status(403).json({ error: 'Forbidden: Superuser access required' })
    }

    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('backend_members')
                .select('id, username, name, role, created_at')
                .order('created_at', { ascending: false })

            if (error) throw error
            return res.status(200).json(data)
        } catch (err: any) {
            return res.status(500).json({ error: err.message })
        }
    }

    if (req.method === 'POST') {
        const { username, password, name, role } = req.body
        if (!username || !password || !role) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            const { data, error } = await supabase
                .from('backend_members')
                .insert([{ username, password: hashedPassword, name, role }])
                .select()

            if (error) throw error
            return res.status(201).json(data[0])
        } catch (err: any) {
            return res.status(500).json({ error: err.message })
        }
    }

    if (req.method === 'DELETE') {
        const { id } = req.query
        if (!id) return res.status(400).json({ error: 'Missing ID' })

        try {
            const { error } = await supabase
                .from('backend_members')
                .delete()
                .eq('id', id)

            if (error) throw error
            return res.status(200).json({ success: true })
        } catch (err: any) {
            return res.status(500).json({ error: err.message })
        }
    }

    return res.status(405).json({ error: 'Method not allowed' })
}
