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
                .select('id, username, name, role, email, phone, created_at')
                .order('created_at', { ascending: false })

            if (error) throw error
            return res.status(200).json(data)
        } catch (err: any) {
            // Log the real error; callers get a generic message so table and
            // constraint names are not disclosed.
            console.error('admin/members:', err)
            return res.status(500).json({ error: 'Could not complete member operation' })
        }
    }

    if (req.method === 'POST') {
        const { username, password, name, role, email, phone } = req.body
        if (!username || !password || !role) {
            return res.status(400).json({ error: 'Missing required fields' })
        }
        if (typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' })
        }

        // A member row had no way to reach the person it belonged to, so a
        // forgotten password meant deleting and recreating the account. At
        // least one contact route is required; which one is the caller's call.
        const cleanEmail = typeof email === 'string' ? email.trim() : ''
        const cleanPhone = typeof phone === 'string' ? phone.trim() : ''
        if (!cleanEmail && !cleanPhone) {
            return res.status(400).json({ error: 'An email address or phone number is required' })
        }
        if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return res.status(400).json({ error: 'Invalid email address' })
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            const { data, error } = await supabase
                .from('backend_members')
                .insert([{
                    username,
                    password: hashedPassword,
                    name,
                    role,
                    email: cleanEmail || null,
                    phone: cleanPhone || null
                }])
                .select()

            if (error) throw error
            return res.status(201).json(data[0])
        } catch (err: any) {
            // Log the real error; callers get a generic message so table and
            // constraint names are not disclosed.
            console.error('admin/members:', err)
            return res.status(500).json({ error: 'Could not complete member operation' })
        }
    }

    // Password reset. There is no email or phone on a backend_members row, so
    // a member who forgets their password has no self-service path -- without
    // this a superuser's only recourse was deleting and recreating the account.
    // Only the password is updatable here: narrowing it the same way
    // api/admin/submissions.ts does keeps role escalation out of this endpoint.
    if (req.method === 'PUT') {
        const { id } = req.query
        const { password } = req.body || {}
        if (!id) return res.status(400).json({ error: 'Missing ID' })
        if (typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' })
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            const { error } = await supabase
                .from('backend_members')
                .update({ password: hashedPassword })
                .eq('id', id)

            if (error) throw error
            return res.status(200).json({ success: true })
        } catch (err: any) {
            console.error('admin/members:', err)
            return res.status(500).json({ error: 'Could not complete member operation' })
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
            // Log the real error; callers get a generic message so table and
            // constraint names are not disclosed.
            console.error('admin/members:', err)
            return res.status(500).json({ error: 'Could not complete member operation' })
        }
    }

    return res.status(405).json({ error: 'Method not allowed' })
}
