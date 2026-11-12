// Supabase/PostgREST caps every response at the project's `max_rows` (1000 by
// default), and `.limit(n)` cannot raise it, so a single query silently returns
// a partial result. This walks the table page by page until a page comes back
// empty, and reports `truncated` when it stops at `maxRows` instead.

export const PAGE_SIZE = 1000
export const MAX_ROWS = 50000

export type PageResult<T> = { data: T[] | null; error: unknown }

export async function fetchAllPages<T>(
    fetchPage: (from: number, to: number) => PromiseLike<PageResult<T>>,
    opts: { pageSize?: number; maxRows?: number } = {},
): Promise<{ rows: T[]; truncated: boolean }> {
    const pageSize = opts.pageSize ?? PAGE_SIZE
    const maxRows = opts.maxRows ?? MAX_ROWS
    const rows: T[] = []
    let from = 0
    for (;;) {
        const { data, error } = await fetchPage(from, from + pageSize - 1)
        if (error) throw error
        const page = data ?? []
        // Do not stop on a short page: a server-side max_rows below pageSize would look like "done".
        if (page.length === 0) return { rows, truncated: false }
        rows.push(...page)
        from += page.length // advance by what arrived, not by pageSize, so a lower server cap skips nothing
        if (rows.length >= maxRows) return { rows: rows.slice(0, maxRows), truncated: true }
    }
}
