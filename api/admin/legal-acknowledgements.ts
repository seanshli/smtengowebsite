import type { VercelRequest, VercelResponse } from '@vercel/node'
import { authenticate } from '../../lib/session.js'
import { supabaseAdmin as supabase } from '../../lib/supabase-admin.js'
import { AUDIENCES } from '../../lib/legal-ack.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const user = await authenticate(req, supabase)
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    // Rows carry names, emails and phone numbers of customers and partners:
    // same superuser-only gate as chatbot-analytics and submissions.
    if (user.role !== 'superuser') {
        return res.status(403).json({ error: 'Forbidden: Superuser access required' })
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    // ?days=365 (1..3650)  ?limit=200 (1..1000)  ?audience=<one of AUDIENCES>
    const days = Math.min(Math.max(parseInt(String(req.query.days ?? '365'), 10) || 365, 1), 3650)
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? '200'), 10) || 200, 1), 1000)
    const audience = typeof req.query.audience === 'string' ? req.query.audience : ''
    if (audience && !(AUDIENCES as readonly string[]).includes(audience)) {
        return res.status(400).json({ error: 'Invalid audience' })
    }

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

    try {
        let query = supabase
            .from('legal_acknowledgements')
            .select('id, created_at, audience, name, organization, email, phone, documents, versions, note, locale')
            .gte('created_at', since)
            .order('created_at', { ascending: false })
            .limit(limit)
        if (audience) query = query.eq('audience', audience)

        const { data, error } = await query
        if (error) throw error

        const rows = data || []
        return res.status(200).json({ window: { days, since }, total: rows.length, rows })
    } catch (err: any) {
        console.error('legal-acknowledgements error:', err?.message || 'unknown')
        return res.status(500).json({ error: 'Could not load acknowledgements' })
    }
}
