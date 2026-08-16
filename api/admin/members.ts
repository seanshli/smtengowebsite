import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    // In a real app, we'd use JWT. For now, we'll use a simple approach:
    // The token is the user ID (not secure, but for "establishing" it's a start)
    // Actually, let's look up the user by ID and check if they are a superuser.

    const { data: currentUser, error: authError } = await supabase
        .from('backend_members')
        .select('*')
        .eq('id', token) // Simplified token-as-id for this stage
        .single()

    if (authError || !currentUser || currentUser.role !== 'superuser') {
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
