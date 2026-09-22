import type { VercelRequest, VercelResponse } from '@vercel/node'
import { authenticate } from '../../lib/session.js'
import { supabaseAdmin as supabase } from '../../lib/supabase-admin.js'
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
        const { data, error } = await supabase
            .from('site_events')
            .select('event, page, section, label, locale, created_at')
            .gte('created_at', since)
            .order('created_at', { ascending: false })
            .limit(20000)
        if (error) {
            if (error.code === '42P01' || error.code === 'PGRST205' || /site_events/.test(error.message || '')) {
                // Table not created yet: tell the UI, do not error.
                return res.status(200).json({ window: { days, since }, tableMissing: true })
            }
            throw error
        }
        return res.status(200).json({ window: { days, since }, tableMissing: false, ...aggregateSiteEvents((data || []) as SiteEventRow[]) })
    } catch (err) {
        console.error('site-analytics error:', err)
        return res.status(500).json({ error: 'Could not load site analytics' })
    }
}
