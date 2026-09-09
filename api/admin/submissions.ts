import type { VercelRequest, VercelResponse } from '@vercel/node'
import { authenticate } from '../../lib/session.js'
import { supabaseAdmin as supabase } from '../../lib/supabase-admin.js'
import { redactSubmission } from '../../lib/redact.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const user = await authenticate(req, supabase)
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    // Operators triage the queue; superusers see the customer's actual contact
    // details. Read is allowed for both but redacted for operators, status and
    // notes are editable by both, and deleting a customer record stays
    // superuser-only.
    const isSuperuser = user.role === 'superuser'

    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('contact_submissions')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            // Redact before the response is built, not in the UI: whatever is
            // sent reaches the browser's network tab regardless of what renders.
            return res.status(200).json(isSuperuser ? data : (data || []).map(redactSubmission))
        } catch (err: any) {
            console.error('Fetch error:', err)
            return res.status(500).json({ error: 'Could not load submissions' })
        }
    }

    if (req.method === 'PUT') {
        const { id } = req.body || {}
        if (!id) {
            return res.status(400).json({ error: 'Missing submission ID' })
        }

        // Whitelist. Spreading req.body into .update() let any authenticated
        // staff member write any column, including ones the UI never exposes
        // (email, phone, message, created_at). These two are what the admin
        // dashboard actually edits.
        const EDITABLE = ['status', 'notes'] as const
        const updates: Record<string, unknown> = {}
        for (const field of EDITABLE) {
            if (field in (req.body || {})) updates[field] = req.body[field]
        }
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No editable fields supplied' })
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
            return res.status(500).json({ error: 'Could not update submission' })
        }
    }

    if (req.method === 'DELETE') {
        if (!isSuperuser) {
            return res.status(403).json({ error: 'Forbidden: Superuser access required' })
        }
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
            return res.status(500).json({ error: 'Could not delete submission' })
        }
    }

    return res.status(405).json({ error: 'Method not allowed' })
}
