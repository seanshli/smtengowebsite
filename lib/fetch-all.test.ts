import { describe, it, expect } from 'vitest'
import { fetchAllPages } from './fetch-all'

// A fake table that, like PostgREST, never returns more than `serverCap` rows per request.
const table = (n: number, serverCap: number) => async (from: number, to: number) => ({
    data: Array.from({ length: n }, (_, i) => i).slice(from, Math.min(to + 1, from + serverCap)),
    error: null,
})

describe('fetchAllPages', () => {
    it('reads past a 1000-row server cap to completeness', async () => {
        const { rows, truncated } = await fetchAllPages(table(2500, 1000))
        expect(rows).toHaveLength(2500)
        expect(truncated).toBe(false)
    })
    it('still completes when the server cap is below the page size', async () => {
        const { rows } = await fetchAllPages(table(1234, 500), { pageSize: 1000 })
        expect(rows).toHaveLength(1234)
    })
    it('flags truncation at maxRows', async () => {
        const { rows, truncated } = await fetchAllPages(table(5000, 1000), { maxRows: 2500 })
        expect(rows).toHaveLength(2500)
        expect(truncated).toBe(true)
    })
    it('handles an empty table and propagates errors', async () => {
        expect((await fetchAllPages(table(0, 1000))).rows).toEqual([])
        await expect(fetchAllPages(async () => ({ data: null, error: new Error('boom') }))).rejects.toThrow('boom')
    })
})
