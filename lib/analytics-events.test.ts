import { describe, it, expect } from 'vitest'
import { aggregateChatbotRows, HOWTO_PREFIX, ANSWER_PREFIX } from './analytics-events'

const row = (keyword: string, match_found = true, locale = 'zh') =>
    ({ keyword, locale, match_found, created_at: '2026-09-22T00:00:00Z' })

describe('aggregateChatbotRows keeps events out of the chatbot statistics', () => {
    const rows = [
        row('配網失敗'), row('配網失敗'), row('門鎖可以嗎', false), row('hola', false, 'es'),
        row(`${HOWTO_PREFIX}device`), row(`${HOWTO_PREFIX}device`), row(`${HOWTO_PREFIX}scene`),
        row(`${ANSWER_PREFIX}device-pairing`), row(`${ANSWER_PREFIX}device-pairing`), row(`${ANSWER_PREFIX}door-lock`),
    ]
    const out = aggregateChatbotRows(rows, 10)

    it('counts only typed questions in totals, match rate and per-locale figures', () => {
        expect(out.totals).toEqual({ queries: 4, matched: 2, unmatched: 2, matchRate: 0.5 })
        expect(out.byLocale.map((l) => [l.locale, l.total])).toEqual([['zh', 3], ['es', 1]])
        expect(out.recent).toHaveLength(4)
        expect(out.recent.every((r) => !r.keyword!.includes(':'))).toBe(true)
    })
    it('ranks how-to opens by module id without the prefix', () => {
        expect(out.howtoOpens).toEqual([{ keyword: 'device', count: 2 }, { keyword: 'scene', count: 1 }])
    })
    it('ranks answering entries by id without the prefix', () => {
        expect(out.topAnswers).toEqual([{ keyword: 'device-pairing', count: 2 }, { keyword: 'door-lock', count: 1 }])
    })
    it('keeps the typed-question rankings unchanged', () => {
        expect(out.topKeywords[0]).toEqual({ keyword: '配網失敗', count: 2 })
        expect(out.topUnmatched.map((k) => k.keyword).sort()).toEqual(['hola', '門鎖可以嗎'])
    })
    it('handles an empty window', () => {
        const e = aggregateChatbotRows([])
        expect(e.totals.matchRate).toBe(0)
        expect(e.howtoOpens).toEqual([])
    })
})
