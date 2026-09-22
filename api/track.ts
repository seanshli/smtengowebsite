import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { rateLimit } from '../lib/ratelimit.js'
import { sanitizeEvents } from '../lib/site-events.js'

// Anonymous write endpoint for the site's own behaviour events (see
// src/utils/siteTracking.ts). Anon key on purpose: RLS allows INSERT only, so a
// bug here still cannot read anything back. The table is created by
// supabase_site_events.sql; until it exists this endpoint answers 202 with
// reason "table_missing" and the browser stops sending for that page load.
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '')

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    // sendBeacon can only send a Blob; Vercel leaves the body as a string then.
    let body: any = req.body
    if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = null } }

    const limit = rateLimit(req, { limit: 120, windowMs: 60 * 1000, bucket: 'track' })
    if (!limit.allowed) {
        res.setHeader('Retry-After', String(limit.retryAfter))
        return res.status(429).json({ error: 'Too many requests' })
    }

    const rows = sanitizeEvents(body?.events)
    if (!rows.length) return res.status(400).json({ error: 'No valid events' })

    try {
        const { error } = await supabase.from('site_events').insert(rows)
        if (error) {
            // 42P01 = relation does not exist (Postgres); PostgREST reports PGRST205 for an unknown table.
            if (error.code === '42P01' || error.code === 'PGRST205' || /site_events/.test(error.message || '')) {
                return res.status(202).json({ stored: false, reason: 'table_missing' })
            }
            console.error('site_events insert error:', error)
            return res.status(500).json({ error: 'Could not record events' })
        }
        return res.status(204).end()
    } catch (err) {
        console.error('track error:', err)
        return res.status(500).json({ error: 'Internal error' })
    }
}
