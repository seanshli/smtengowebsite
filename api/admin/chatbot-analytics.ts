import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

type LogRow = {
    id?: number
    keyword: string | null
    locale: string | null
    match_found: boolean | null
    created_at: string
}

type Counter = Record<string, number>

function bump(counter: Counter, key: string) {
    counter[key] = (counter[key] || 0) + 1
}

function topN(counter: Counter, n: number): Array<{ keyword: string; count: number }> {
    return Object.entries(counter)
        .map(([keyword, count]) => ({ keyword, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, n)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Auth — same pattern as submissions.ts
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const userId = authHeader.split(' ')[1]
    const { data: user, error: authError } = await supabase
        .from('backend_members')
        .select('*')
        .eq('id', userId)
        .single()

    if (authError || !user) {
        return res.status(401).json({ error: 'Unauthorized' })
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

        // --- Aggregations ---------------------------------------------------
        const total = rows.length
        let matched = 0

        const byLocale: Record<string, { total: number; matched: number }> = {}
        const topKeywords: Counter = {}
        const topUnmatched: Counter = {}

        for (const r of rows) {
            const kwRaw = (r.keyword || '').trim()
            const kw = kwRaw.toLowerCase()
            const loc = r.locale || 'unknown'
            const hit = !!r.match_found

            if (hit) matched += 1

            if (!byLocale[loc]) byLocale[loc] = { total: 0, matched: 0 }
            byLocale[loc].total += 1
            if (hit) byLocale[loc].matched += 1

            if (kw) {
                bump(topKeywords, kw)
                if (!hit) bump(topUnmatched, kw)
            }
        }

        const matchRate = total > 0 ? matched / total : 0

        const byLocaleOut = Object.entries(byLocale)
            .map(([locale, v]) => ({
                locale,
                total: v.total,
                matched: v.matched,
                matchRate: v.total > 0 ? v.matched / v.total : 0,
            }))
            .sort((a, b) => b.total - a.total)

        const recent = rows.slice(0, limit).map((r) => ({
            id: r.id,
            keyword: r.keyword,
            locale: r.locale,
            matchFound: !!r.match_found,
            createdAt: r.created_at,
        }))

        return res.status(200).json({
            window: { days, since },
            totals: {
                queries: total,
                matched,
                unmatched: total - matched,
                matchRate,
            },
            byLocale: byLocaleOut,
            topKeywords: topN(topKeywords, 25),
            topUnmatched: topN(topUnmatched, 25),
            recent,
        })
    } catch (err: any) {
        console.error('chatbot-analytics error:', err)
        return res.status(500).json({ error: err.message })
    }
}
