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
    // hex form, and the rgb triplets Sass would compile to the same colours (rgba(199,183,99,.x) → #c7b763xx)
    const banned = /#(fefbf6|fdf5ec|f9f3eb|fff7ee|efe7de|e3d9cf|ece3d9|c7b763|faf8f5)\b|rgba?\(\s*(199,\s*183,\s*99|254,\s*251,\s*246|253,\s*245,\s*236|249,\s*243,\s*235)/i
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

describe('router links are absolute (QA 2026-09-22: a relative to="product?…" 404ed from /cases/:id)', () => {
    const files = [...readdirSync(resolve(__dirname, '../layout')).map((f) => resolve(__dirname, '../layout', f)), ...pages.map((f) => resolve(views, f))]
        .filter((f) => f.endsWith('.vue'))
    it('every static router-link "to" starts with / or #', () => {
        for (const f of files) {
            const src = readFileSync(f, 'utf-8')
            for (const m of src.matchAll(/<router-link[^>]*\sto="([^"{][^"]*)"/g)) {
                expect(m[1], `${f}: to="${m[1]}"`).toMatch(/^[/#]/)
            }
        }
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
        expect(t).toContain('/images/screens/10-scenes-tablet.png')
        expect(t).not.toMatch(/07-home-phone|hm-phone/)
        expect(t).toContain('to="/contact"')
        expect(t).toContain('to="/product"')
        expect(t).toContain('to="/cases"')
    })
    it('home names no development project (Sean 2026-09-24): the community photo caption is generic', () => {
        const t = templateOf('index.vue')
        expect(t).not.toMatch(/bmsCase\.title/)
        expect(t).toContain('T.bmsPhotoCap')
    })
    it('no decorative 01/02/03 counters or kicker pills (craft floor, design pass 2026-09-25)', () => {
        for (const f of ['coreValue.vue', 'mission.vue', 'vision.vue', 'enviro.vue', 'product.vue']) {
            const tpl = templateOf(f)
            expect(tpl, f).not.toMatch(/padStart\(2, '0'\)/)
            expect(tpl, f).not.toMatch(/tf-num|-plate-num|-block-num|-pillar-num|-card-num/)
            expect(tpl, f).not.toMatch(/class="(?:ev|cv|msn|vsn)-kicker"/)
        }
        expect(templateOf('product.vue')).not.toMatch(/class="tag[ "]/)
        expect(templateOf('vision.vue')).not.toMatch(/business-model-icon|b2b2c\.svg/)
    })
    it('browser surfaces are themed and the consent card stays a card', () => {
        const surfaces = readFileSync(resolve(process.cwd(), 'src/css/base/_surfaces.scss'), 'utf-8')
        expect(surfaces).toMatch(/::selection/)
        expect(surfaces).toMatch(/caret-color/)
        expect(surfaces).toMatch(/:focus-visible/)
        expect(readFileSync(resolve(process.cwd(), 'src/css/main.scss'), 'utf-8')).toMatch(/base\/surfaces/)
        const cookie = readFileSync(resolve(process.cwd(), 'src/css/components/_cookie.scss'), 'utf-8')
        expect(cookie).toMatch(/width: min\(440px/)
        expect(cookie).not.toMatch(/80vw/)
    })
    it('the contact form labels every field (no placeholder-as-label)', () => {
        const tpl = templateOf('contact.vue')
        for (const id of ['cf-name', 'cf-phone', 'cf-email', 'cf-city', 'cf-address', 'cf-interest', 'cf-message']) {
            expect(tpl, id).toContain(`for="${id}"`)
            expect(tpl, id).toContain(`id="${id}"`)
        }
        expect(tpl).not.toMatch(/:placeholder="`\$\{\$t\('name'\)/)
    })
    it('home never renders the shared case illustration as proof', () => {
        const src = readFileSync(resolve(views, 'index.vue'), 'utf-8')
        expect(src).toMatch(/case-home\.jpg/)   // the filter that excludes it must exist
        expect(templateOf('index.vue')).not.toMatch(/case-home\.jpg/)
    })
})

describe('no em-dash or en-dash in user-visible copy (polish/no-dashes, 2026-09-25)', () => {
    // Blank out a matched span while preserving every '\n' inside it, so line
    // numbers computed from the cleaned string still line up with the original file.
    const blank = (m: string) => m.replace(/[^\n]/g, ' ')

    const stripComments = (src: string, isVue: boolean) => {
        let s = src
        if (isVue) s = s.replace(/<!--[\s\S]*?-->/g, blank)
        s = s.replace(/\/\*[\s\S]*?\*\//g, blank)
        // strip // line comments, but not the "//" inside "http://" or "https://"
        s = s.replace(/(?<!:)\/\/.*$/gm, blank)
        return s
    }

    const root = resolve(__dirname, '../..')
    const localeDir = resolve(__dirname, '../locale')
    const componentsDir = resolve(__dirname, '../components')
    const dataDir = resolve(__dirname, '../data')
    const pub = resolve(root, 'public')

    // Only the data files in the polish/no-dashes scope; other src/data/*.json
    // files (packages.json, tutorials.json) were never part of the cleanup.
    const dataFiles = ['faqs.json', 'knowledge_base.json', 'howto.json', 'news.json', 'cases.json']

    const targets: string[] = [
        ...readdirSync(localeDir).filter((f) => f.endsWith('.ts')).map((f) => resolve(localeDir, f)),
        ...pages.map((f) => resolve(views, f)),
        ...readdirSync(componentsDir).filter((f) => f.endsWith('.vue')).map((f) => resolve(componentsDir, f)),
        ...dataFiles.map((f) => resolve(dataDir, f)),
        resolve(pub, 'llms.txt'),
        resolve(process.cwd(), 'scripts/prerender-meta.mjs'),
        resolve(process.cwd(), 'scripts/gen-knowledge-md.mjs'),
    ]

    it('every target file is free of U+2014 (—) and U+2013 (–) outside comments', () => {
        const failures: string[] = []
        for (const f of targets) {
            const raw = readFileSync(f, 'utf-8')
            const isVue = f.endsWith('.vue')
            const isJsonOrTxt = f.endsWith('.json') || f.endsWith('.txt')
            // JSON/plain-text files have no comment syntax; stripping "//" there
            // would corrupt URLs inside string values, so only strip for .ts/.vue.
            let cleaned = isJsonOrTxt ? raw : stripComments(raw, isVue)
            if (f.endsWith('product.vue')) {
                // the "not supported" table-cell glyph is allowed to keep its em-dash
                cleaned = cleaned.replace(/>[—–]</g, '> <')
            }
            for (const m of cleaned.matchAll(/[—–]/g)) {
                const line = cleaned.slice(0, m.index).split('\n').length
                failures.push(`${f.replace(root + '/', '')}:${line}`)
            }
        }
        expect(failures, failures.join('\n')).toEqual([])
    })
})
