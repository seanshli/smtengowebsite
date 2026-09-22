import type { VercelRequest, VercelResponse } from '@vercel/node'
import { authenticate } from '../../lib/session.js'
import { supabaseAdmin as supabase } from '../../lib/supabase-admin.js'
import { aggregateChatbotRows, type LogRow } from '../../lib/analytics-events.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const user = await authenticate(req, supabase)
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    // Chatbot logs are free text typed by visitors and routinely contain
    // personal details, so they get the same superuser-only gate as
    // api/admin/submissions.ts.
    if (user.role !== 'superuser') {
        return res.status(403).json({ error: 'Forbidden: Superuser access required' })
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    // Optional query params:
    //   ?days=30      limit window (default 90)
    //   ?limit=200    cap on recent-queries list (default 200, max 1000)
    const days = Math.min(Math.max(parseInt(String(req.query.days ?? '90'), 10) || 90, 1), 365)
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? '200'), 10) || 200, 1), 1000)

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

    try {
        // Pull everything in window — table is append-only and light, so this is fine for now.
        // If volume grows past ~50k/month we switch to paginated aggregation via SQL view.
        const { data, error } = await supabase
            .from('chatbot_analytics')
            .select('id, keyword, locale, match_found, created_at')
            .gte('created_at', since)
            .order('created_at', { ascending: false })

        if (error) throw error

        const rows: LogRow[] = (data || []) as LogRow[]
        // howto:<module> / kb:<entry> event rows are split out inside the aggregator so
        // the chatbot totals and match rate only count questions visitors typed.
        return res.status(200).json({ window: { days, since }, ...aggregateChatbotRows(rows, limit) })
    } catch (err: any) {
        console.error('chatbot-analytics error:', err)
        return res.status(500).json({ error: 'Could not load analytics' })
    }
}
