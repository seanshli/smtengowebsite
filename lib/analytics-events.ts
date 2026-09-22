// chatbot_analytics is the site's only append-only event table, and the anon
// write endpoint (api/chatbot-query.ts) is the only way the browser can reach
// it. Rather than add columns we cannot migrate from the website repo, two
// event kinds ride in the `keyword` column behind a prefix and are split back
// out here before any chatbot statistics are computed:
//
//   howto:<module>   a visitor opened a how-to module on /tutorial
//   kb:<entry-id>    the chatbot answered with this knowledge-base entry
//
// Everything else in the column is free text a visitor typed into the chatbot.
export const HOWTO_PREFIX = 'howto:'
export const ANSWER_PREFIX = 'kb:'

export type LogRow = {
    id?: number
    keyword: string | null
    locale: string | null
    match_found: boolean | null
    created_at: string
}

export type Ranked = Array<{ keyword: string; count: number }>

type Counter = Record<string, number>

const bump = (c: Counter, k: string) => { c[k] = (c[k] || 0) + 1 }

export const topN = (c: Counter, n: number): Ranked =>
    Object.entries(c)
        .map(([keyword, count]) => ({ keyword, count }))
        .sort((a, b) => b.count - a.count || a.keyword.localeCompare(b.keyword))
        .slice(0, n)

export const isHowtoEvent = (kw: string) => kw.startsWith(HOWTO_PREFIX)
export const isAnswerEvent = (kw: string) => kw.startsWith(ANSWER_PREFIX)

export function aggregateChatbotRows(rows: LogRow[], limit = 200) {
    let total = 0
    let matched = 0
    const byLocale: Record<string, { total: number; matched: number }> = {}
    const topKeywords: Counter = {}
    const topUnmatched: Counter = {}
    const howtoOpens: Counter = {}
    const topAnswers: Counter = {}
    const recentRows: LogRow[] = []

    for (const r of rows) {
        const kwRaw = (r.keyword || '').trim()
        if (isHowtoEvent(kwRaw)) { bump(howtoOpens, kwRaw.slice(HOWTO_PREFIX.length)); continue }
        if (isAnswerEvent(kwRaw)) { bump(topAnswers, kwRaw.slice(ANSWER_PREFIX.length)); continue }

        const kw = kwRaw.toLowerCase()
        const loc = r.locale || 'unknown'
        const hit = !!r.match_found
        total += 1
        if (hit) matched += 1
        if (!byLocale[loc]) byLocale[loc] = { total: 0, matched: 0 }
        byLocale[loc].total += 1
        if (hit) byLocale[loc].matched += 1
        if (kw) {
            bump(topKeywords, kw)
            if (!hit) bump(topUnmatched, kw)
        }
        if (recentRows.length < limit) recentRows.push(r)
    }

    return {
        totals: { queries: total, matched, unmatched: total - matched, matchRate: total > 0 ? matched / total : 0 },
        byLocale: Object.entries(byLocale)
            .map(([locale, v]) => ({ locale, total: v.total, matched: v.matched, matchRate: v.total > 0 ? v.matched / v.total : 0 }))
            .sort((a, b) => b.total - a.total),
        topKeywords: topN(topKeywords, 25),
        topUnmatched: topN(topUnmatched, 25),
        howtoOpens: topN(howtoOpens, 25),
        topAnswers: topN(topAnswers, 25),
        recent: recentRows.map((r) => ({ id: r.id, keyword: r.keyword, locale: r.locale, matchFound: !!r.match_found, createdAt: r.created_at })),
    }
}
