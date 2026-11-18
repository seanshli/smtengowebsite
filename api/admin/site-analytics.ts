import type { VercelRequest, VercelResponse } from '@vercel/node'
import { authenticate } from '../../lib/session.js'
import { supabaseAdmin as supabase } from '../../lib/supabase-admin.js'
import { fetchAllPages } from '../../lib/fetch-all.js'
import { aggregateSiteEvents, type SiteEventRow } from '../../lib/site-events.js'

// Aggregated behaviour events for the admin dashboard. Rows carry no personal
// data (event, page, section, label, locale), so every authenticated admin may
// read them; the chatbot log stays superuser-only because it holds free text.
export default async function handler(req: VercelRequest, res: VercelResponse) {
    const user = await authenticate(req, supabase)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

    const days = Math.min(Math.max(parseInt(String(req.query.days ?? '30'), 10) || 30, 1), 365)
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

    try {
        // Page through the window: one query is silently capped at PostgREST max_rows (1000 by default).
        // Oldest first, so rows inserted while we page cannot shift the offsets.
        let rows: SiteEventRow[], truncated: boolean
        try {
            ;({ rows, truncated } = await fetchAllPages<SiteEventRow>((from, to) =>
                supabase
                    .from('site_events')
                    .select('event, page, section, label, locale, created_at')
                    .gte('created_at', since)
                    .order('created_at', { ascending: true })
                    .order('id', { ascending: true })
                    .range(from, to) as any))
        } catch (error: any) {
            if (error?.code === '42P01' || error?.code === 'PGRST205' || /site_events/.test(error?.message || '')) {
                // Table not created yet: tell the UI, do not error.
                return res.status(200).json({ window: { days, since }, tableMissing: true })
            }
            throw error
        }
        return res.status(200).json({ window: { days, since }, tableMissing: false, truncated, rowsRead: rows.length, ...aggregateSiteEvents(rows) })
    } catch (err) {
        console.error('site-analytics error:', err)
        return res.status(500).json({ error: 'Could not load site analytics' })
    }
}
