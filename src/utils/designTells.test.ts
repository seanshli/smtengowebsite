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

describe('palette B holds (design review 2026-09-22, D2): no warm-cream or gold hex anywhere in src', () => {
    const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
        d.isDirectory() ? walk(resolve(dir, d.name)) : /\.(vue|scss|ts)$/.test(d.name) && !d.name.endsWith('.test.ts') ? [resolve(dir, d.name)] : [])
    const files = walk(resolve(__dirname, '..'))
    const banned = /#(fefbf6|fdf5ec|f9f3eb|fff7ee|efe7de|e3d9cf|ece3d9|c7b763|faf8f5)\b/i
    it('retired warm hexes are gone', () => {
        for (const f of files) expect(readFileSync(f, 'utf-8'), f).not.toMatch(banned)
    })
})

describe('AI-SEO entry points exist', () => {
    const pub = resolve(__dirname, '../../public')
    it('llms.txt points AI agents at the knowledge base and the store links', () => {
        const t = readFileSync(resolve(pub, 'llms.txt'), 'utf-8')
        expect(t).toContain('https://www.smtengo.com/knowledge-base.md')
        expect(t).toContain('id6680188565')
        expect(t).toContain('tw.smtengo.engohome.android')
        expect(t).not.toMatch(/Tuya|塗鴉|Alexa/)
    })
    it('robots.txt welcomes AI crawlers and hides admin + api', () => {
        const r = readFileSync(resolve(pub, 'robots.txt'), 'utf-8')
        for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) expect(r).toContain(`User-agent: ${bot}`)
        expect(r).toContain('Disallow: /admin/')
        expect(r).toContain('Sitemap: https://www.smtengo.com/sitemap.xml')
    })
})

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
