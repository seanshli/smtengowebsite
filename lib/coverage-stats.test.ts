import { describe, it, expect } from 'vitest'
import { wilson95, weekStartUtc, makeCell, weeklyCoverage, MIN_CELL_N } from './coverage-stats'

describe('wilson95', () => {
    it('matches reference values (8/10, 0/10, 10/10)', () => {
        const a = wilson95(8, 10)!
        expect(a.lo).toBeCloseTo(0.4902, 3)
        expect(a.hi).toBeCloseTo(0.9433, 3)
        const z = wilson95(0, 10)!
        expect(z.lo).toBe(0)
        expect(z.hi).toBeCloseTo(0.2775, 3)
        const f = wilson95(10, 10)!
        expect(f.lo).toBeCloseTo(0.7225, 3)
        expect(f.hi).toBeCloseTo(1, 10)
    })
    it('narrows as n grows and always contains the point estimate', () => {
        const small = wilson95(5, 10)!, big = wilson95(500, 1000)!
        expect(big.hi - big.lo).toBeLessThan(small.hi - small.lo)
        expect(big.lo).toBeLessThan(0.5)
        expect(big.hi).toBeGreaterThan(0.5)
    })
    it('rejects impossible input', () => {
        expect(wilson95(0, 0)).toBeNull()
        expect(wilson95(3, 2)).toBeNull()
        expect(wilson95(-1, 5)).toBeNull()
    })
})

describe('weekStartUtc', () => {
    it('maps any day to its Monday (UTC)', () => {
        expect(weekStartUtc('2026-11-09T00:00:00Z')).toBe('2026-11-09') // Monday
        expect(weekStartUtc('2026-11-15T23:59:59Z')).toBe('2026-11-09') // Sunday
        expect(weekStartUtc('2026-11-16T00:00:00Z')).toBe('2026-11-16')
        expect(weekStartUtc('2026-01-01T12:00:00Z')).toBe('2025-12-29') // across year end
    })
    it('returns null for garbage', () => expect(weekStartUtc('nope')).toBeNull())
})

describe('makeCell', () => {
    it('suppresses rate and CI under the minimum n', () => {
        const c = makeCell(3, MIN_CELL_N - 1)
        expect(c).toMatchObject({ insufficient: true, rate: null, ci: null })
    })
    it('reports rate and CI at the minimum n', () => {
        const c = makeCell(4, MIN_CELL_N)
        expect(c.insufficient).toBe(false)
        expect(c.rate).toBeCloseTo(0.8)
        expect(c.ci).not.toBeNull()
    })
})

describe('weeklyCoverage', () => {
    const r = (created_at: string, match_found: boolean, locale: string | null = 'zh') => ({ created_at, match_found, locale })
    const rows = [
        // week of 2026-11-02: zh 5 (4 hit), en 2 (1 hit)
        ...['02', '03', '04', '05'].map((d) => r(`2026-11-${d}T10:00:00Z`, true)),
        r('2026-11-06T10:00:00Z', false),
        r('2026-11-07T10:00:00Z', true, 'en'), r('2026-11-08T10:00:00Z', false, 'en'),
        // week of 2026-11-16 (11-09 week is empty): one null-locale miss
        r('2026-11-17T10:00:00Z', false, null),
    ]
    const out = weeklyCoverage(rows)
    it('buckets by Monday and fills the empty week between', () => {
        expect(out.map((w) => [w.weekStart, w.total])).toEqual([['2026-11-02', 7], ['2026-11-09', 0], ['2026-11-16', 1]])
    })
    it('computes overall and per-locale cells with the n<5 rule', () => {
        expect(out[0].matched).toBe(5)
        expect(out[0].rate).toBeCloseTo(5 / 7)
        expect(out[0].byLocale.zh).toMatchObject({ total: 5, matched: 4, insufficient: false })
        expect(out[0].byLocale.en).toMatchObject({ total: 2, insufficient: true, rate: null })
        expect(out[1].insufficient).toBe(true)
        expect(out[2].byLocale.unknown.total).toBe(1)
    })
    it('is empty for no rows and skips bad dates', () => {
        expect(weeklyCoverage([])).toEqual([])
        expect(weeklyCoverage([r('bad', true)])).toEqual([])
    })
})
