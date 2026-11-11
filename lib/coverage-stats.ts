// Pure statistics for the chatbot coverage trend. No I/O, no clock: every
// function is deterministic so it can be tested with fixed fixtures.

/** Below this many questions a cell is shown as "insufficient data", never as a percentage. */
export const MIN_CELL_N = 5
const Z95 = 1.959963984540054

export type Interval = { lo: number; hi: number }

/** Wilson score interval for a binomial proportion (95%). Returns null when n = 0. */
export function wilson95(k: number, n: number): Interval | null {
    if (!(n > 0) || k < 0 || k > n) return null
    const p = k / n
    const z2 = Z95 * Z95
    const denom = 1 + z2 / n
    const centre = (p + z2 / (2 * n)) / denom
    const half = (Z95 * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denom
    return { lo: Math.max(0, centre - half), hi: Math.min(1, centre + half) }
}

/** Monday 00:00 UTC of the week containing `iso`, as YYYY-MM-DD. Null for an unparseable date. */
export function weekStartUtc(iso: string): string | null {
    const t = Date.parse(iso)
    if (Number.isNaN(t)) return null
    const d = new Date(t)
    const dow = (d.getUTCDay() + 6) % 7 // Monday = 0
    const monday = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - dow)
    return new Date(monday).toISOString().slice(0, 10)
}

export type Cell = {
    total: number
    matched: number
    /** null when the cell has fewer than MIN_CELL_N questions */
    rate: number | null
    ci: Interval | null
    insufficient: boolean
}

export function makeCell(matched: number, total: number): Cell {
    const insufficient = total < MIN_CELL_N
    return {
        total,
        matched,
        rate: insufficient ? null : matched / total,
        ci: insufficient ? null : wilson95(matched, total),
        insufficient,
    }
}

export type CoverageRow = { locale: string | null; match_found: boolean | null; created_at: string }
export type WeekCoverage = Cell & { weekStart: string; byLocale: Record<string, Cell> }

const addDays = (ymd: string, n: number) => {
    const [y, m, d] = ymd.split('-').map(Number)
    return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10)
}

/**
 * Weekly match rate with Wilson 95% CI, overall and per locale. Weeks between
 * the first and last observed week are filled in (empty weeks have total 0 and
 * read as insufficient) so a gap in traffic is visible rather than interpolated.
 */
export function weeklyCoverage(rows: CoverageRow[]): WeekCoverage[] {
    const acc = new Map<string, { total: number; matched: number; loc: Map<string, { total: number; matched: number }> }>()
    for (const r of rows) {
        const wk = weekStartUtc(r.created_at)
        if (!wk) continue
        const loc = r.locale || 'unknown'
        const hit = r.match_found ? 1 : 0
        let w = acc.get(wk)
        if (!w) { w = { total: 0, matched: 0, loc: new Map() }; acc.set(wk, w) }
        w.total += 1
        w.matched += hit
        const l = w.loc.get(loc) || { total: 0, matched: 0 }
        l.total += 1
        l.matched += hit
        w.loc.set(loc, l)
    }
    if (acc.size === 0) return []
    const weeks = [...acc.keys()].sort()
    const out: WeekCoverage[] = []
    for (let wk = weeks[0]; wk <= weeks[weeks.length - 1]; wk = addDays(wk, 7)) {
        const w = acc.get(wk)
        const byLocale: Record<string, Cell> = {}
        for (const [loc, v] of [...(w?.loc ?? [])].sort((a, b) => a[0].localeCompare(b[0]))) byLocale[loc] = makeCell(v.matched, v.total)
        out.push({ weekStart: wk, ...makeCell(w?.matched ?? 0, w?.total ?? 0), byLocale })
    }
    return out
}
