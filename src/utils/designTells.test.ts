import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

// Design review 2026-09-22 (taste skill, redesign-preserve). These are the
// template tells we removed; the test keeps them from creeping back.
const views = resolve(__dirname, '../views')
const templateOf = (file: string) => {
    const src = readFileSync(resolve(views, file), 'utf-8')
    const m = /<template>([\s\S]*?)<\/template>\s*<script/.exec(src)
    return m ? m[1] : ''
}
const pages = readdirSync(views).filter((f) => f.endsWith('.vue'))

describe('page templates carry no template tells', () => {
    it('no per-page "brandJournal" eyebrow above the page title', () => {
        for (const f of pages) expect(templateOf(f), f).not.toMatch(/\$t\('brandJournal'\)/)
    })
    it('home has no scroll cue and no em/en dash in visible copy', () => {
        const t = templateOf('index.vue')
        expect(t).not.toMatch(/↓/)
        expect(t).not.toMatch(/[—–]/)
        expect(t).not.toMatch(/ed-news-jump/)
    })
    it('home shows the real product screens and links every primary action to a route', () => {
        const t = templateOf('index.vue')
        expect(t).toContain('/images/screens/01-home-tablet.png')
        expect(t).toContain('/images/screens/07-home-phone.png')
        expect(t).toContain('to="/contact"')
        expect(t).toContain('to="/product"')
        expect(t).toContain('to="/cases"')
    })
    it('home never renders the shared case illustration as proof', () => {
        const src = readFileSync(resolve(views, 'index.vue'), 'utf-8')
        expect(src).toMatch(/case-home\.jpg/)   // the filter that excludes it must exist
        expect(templateOf('index.vue')).not.toMatch(/case-home\.jpg/)
    })
})
