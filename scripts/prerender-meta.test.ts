import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { buildHtml, jsonLdFor } from './prerender-meta.mjs'
// @ts-expect-error -- plain .mjs build script, no type declarations for these exports
import { ROUTES, PREFIXES, LANGS } from './prerender-meta.mjs'
import { LOCALE_PREFIXES } from '../src/utils/localePaths'
import { zhCNLocale } from '../src/locale/zhCN'
import { traditionalIn } from '../src/locale/scriptPurity'
import { rawMessageIn } from '../src/utils/rawMessage'

// Minimal stand-in for index.html: the tags the prerenderer rewrites, in the
// order they appear in the real shell.
const TEMPLATE = `<!doctype html>
<html lang="zh-Hant">
<head>
  <title>x</title>
  <meta name="description" content="x" />
  <meta property="og:title" content="x" />
  <meta property="og:url" content="x" />
  <link rel="canonical" href="https://www.smtengo.com/" />
  <meta property="og:locale" content="zh_TW" />
  <meta property="og:description" content="x" />
  <meta name="twitter:title" content="x" />
  <meta name="twitter:image" content="x" />
</head>
<body><div id="app"></div></body>
</html>`

const count = (html: string, re: RegExp) => (html.match(re) ?? []).length

describe('prerender crawlable fallback content', () => {
  it('zh /product shell has exactly one h1 and a nav to every route', () => {
    const html = buildHtml(TEMPLATE, '/product', 'zh')
    expect(count(html, /<h1>/g)).toBe(1)
    expect(html).toContain('<h1>產品介紹</h1>')
    expect(html).toContain('href="/tutorial"')
    expect(html).toContain('<div id="app"><!--prerender:fallback-->')
    expect(html).toContain('href="https://apps.apple.com/app/id6680188565"')
    expect(html).toContain('href="https://shoph5.smtengo.com/"')
    expect(html).toContain('href="/knowledge-base.md"')
  })
  it('en /product shell prefixes nav hrefs with /en and links the root as /en', () => {
    const html = buildHtml(TEMPLATE, '/product', 'en')
    expect(html).toContain('href="/en/tutorial"')
    expect(html).toContain('<a href="/en">')
    expect(html).not.toContain('href="/tutorial"')
    expect(html).toContain('<h1>Products</h1>')
  })
  it('is idempotent: a second pass over a generated shell leaves one fallback block and one style', () => {
    const first = buildHtml(TEMPLATE, '/product', 'zh')
    const second = buildHtml(first, '/contact', 'en')
    expect(count(second, /<!--prerender:fallback-->/g)).toBe(1)
    expect(count(second, /<!--\/prerender:fallback-->/g)).toBe(1)
    expect(count(second, /<style data-prerender>/g)).toBe(1)
    expect(count(second, /<h1>/g)).toBe(1)
    expect(second).toContain('<h1>Contact Us</h1>')
    expect(second).not.toContain('<h1>產品介紹</h1>')
  })
  it('never mentions Tuya, 塗鴉 or Alexa', () => {
    for (const lang of ['zh', 'en']) {
      const html = buildHtml(TEMPLATE, '/', lang)
      const block = html.slice(html.indexOf('<!--prerender:fallback-->'), html.indexOf('<!--/prerender:fallback-->'))
      expect(block.length).toBeGreaterThan(100)
      expect(block).not.toMatch(/Tuya|塗鴉|Alexa/i)
    }
  })
})

describe('prerender structured data (AI-SEO)', () => {
  it('/tutorial shells carry a FAQPage and a HowTo list, in the shell language', () => {
    const zh = buildHtml(TEMPLATE, '/tutorial', 'zh')
    expect(count(zh, /<script[^>]*data-prerender/g)).toBe(2)
    expect(zh).toContain('"@type":"FAQPage"')
    expect(zh).toContain('"@type":"HowTo"')
    expect(zh).toContain('#howto-device')
    const en = buildHtml(TEMPLATE, '/tutorial', 'en')
    expect(en).toContain('https://www.smtengo.com/en/tutorial#howto-device')
    // markdown never leaks into schema text
    expect(zh).not.toMatch(/data-prerender>[^<]*\]\(/)
  })
  it('the app appears as a MobileApplication on / and /product with both store URLs and the listed name', () => {
    for (const route of ['/', '/product']) {
      const blocks = jsonLdFor(route, 'en')
      const app = blocks.find((b: any) => b['@type'] === 'MobileApplication') as any
      expect(app.name).toBe('enGo智慧管家')
      expect(app.installUrl).toEqual(expect.arrayContaining(['https://apps.apple.com/app/id6680188565', 'https://play.google.com/store/apps/details?id=tw.smtengo.engohome.android']))
    }
    expect(jsonLdFor('/cases', 'zh')).toEqual([])
  })
  it('enGo 安購商城 appears as an OnlineStore on / and /product (own site, owned by the company), and the product meta names it', () => {
    for (const route of ['/', '/product']) for (const lang of ['zh', 'en']) {
      const store = jsonLdFor(route, lang).find((b: any) => b['@type'] === 'OnlineStore') as any
      expect(store.url).toBe('https://shoph5.smtengo.com/')
      expect(store.name).toBe(lang === 'en' ? 'enGo Shop' : 'enGo 安購商城')
      expect(store.parentOrganization.name).toBe(lang === 'en' ? 'Smart enGo Home Technology Corp.' : '智管家科技股份有限公司')
      expect(store.description).not.toMatch(/合併|轉移|收購/)
    }
    expect(jsonLdFor('/cases', 'zh').find((b: any) => b['@type'] === 'OnlineStore')).toBeUndefined()
    const html = buildHtml(TEMPLATE, '/product', 'zh')
    expect(html).toMatch(/<title>[^<]*enGo 商城/)
    expect(count(html, /"@type":"OnlineStore"/g)).toBe(1)
  })
  it('the postbuild pass does not duplicate structured data', () => {
    const first = buildHtml(TEMPLATE, '/tutorial', 'zh')
    const second = buildHtml(first, '/', 'zh')
    expect(count(second, /<script[^>]*data-prerender/g)).toBe(2)   // only the home page's MobileApplication + OnlineStore
    expect(second).not.toContain('FAQPage')
  })
})

describe('prerender buildHtml', () => {
  it('adds exactly one twitter:description on a fresh template', () => {
    const html = buildHtml(TEMPLATE, '/product', 'en')
    expect(count(html, /twitter:description/g)).toBe(1)
    expect(html).toContain('<html lang="en"')
    expect(html).toContain('href="https://www.smtengo.com/en/product"')
  })

  it('is idempotent: the postbuild pass re-reading a generated shell does not duplicate meta', () => {
    // First pass writes dist/index.html; second pass (npm postbuild) reads it back.
    const first = buildHtml(TEMPLATE, '/', 'zh')
    const second = buildHtml(first, '/contact', 'zh')
    expect(count(second, /twitter:description/g)).toBe(1)
    expect(count(second, /rel="canonical"/g)).toBe(1)
    expect(count(second, /hreflang="zh-Hant"/g)).toBe(1)
    expect(count(second, /hreflang="en"/g)).toBe(1)
    expect(count(second, /hreflang="x-default"/g)).toBe(1)
    // and the second route's own meta won, not the home page's
    expect(second).toContain('href="https://www.smtengo.com/contact"')
    expect(second).not.toContain('twitter:description content="enGo理家')
  })
})

describe('brand: enGo is the official name (Sean, 2026-11-09)', () => {
  // 智管家 stays only in the legal entity (智管家科技股份有限公司), the enGo 安購商城
  // product name and the App Store listing name. The unsupported 「第一品牌」
  // superlative is gone from every title.
  const files = ['index.html', 'scripts/prerender-meta.mjs', 'src/locale/zh.ts', 'src/locale/zhCN.ts', 'src/locale/en.ts', 'src/utils/seo.ts']
  it.each(files)('%s has no 「第一品牌」 claim and no "enGo智管家" brand in titles', async (f) => {
    const { readFileSync } = await import('node:fs')
    const src = readFileSync(f, 'utf-8')
    expect(src).not.toMatch(/第一品牌/)
    expect(src).not.toMatch(/Leading AIot/)
    expect(src).not.toMatch(/title[^\n]*enGo ?智管家/i)
  })
  it('every zh and en route title carries the enGo brand', () => {
    for (const route of ['/', '/product', '/packages', '/contact']) {
      for (const loc of ['zh', 'en'] as const) {
        const html = buildHtml(TEMPLATE, route, loc)
        expect(html, `${loc} ${route}`).toMatch(/<title>[^<]*enGo/)
      }
    }
  })
})

// ---- /zh-cn: Simplified Chinese gets its own indexable URLs (2026-11-11) -------------------------------
const BASE = 'https://www.smtengo.com'
const routes = Object.keys(ROUTES as Record<string, unknown>)
const urlOf = (route: string, lang: 'zh' | 'zhCN' | 'en') =>
  BASE + LOCALE_PREFIXES[lang] + (route === '/' && LOCALE_PREFIXES[lang] ? '' : route)
const linkTags = (html: string) => [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)" \/>/g)].map((m) => [m[1], m[2]])

describe('/zh-cn shells', () => {
  it('prerender prefixes match the router/util prefixes, and every locale has a shell', () => {
    expect(PREFIXES).toEqual(LOCALE_PREFIXES)
    expect([...LANGS].sort()).toEqual(['en', 'zh', 'zhCN'])
  })

  it.each(routes)('%s: zh, zh-cn and en shells exist, are self-canonical and carry the full 4-entry hreflang set', (route) => {
    for (const lang of ['zh', 'zhCN', 'en'] as const) {
      const html = buildHtml(TEMPLATE, route, lang)
      expect(count(html, /rel="canonical"/g)).toBe(1)
      expect(html).toContain(`<link rel="canonical" href="${urlOf(route, lang)}" />`)
      expect(linkTags(html)).toEqual([
        ['zh-Hant', urlOf(route, 'zh')],
        ['zh-Hans', urlOf(route, 'zhCN')],
        ['en', urlOf(route, 'en')],
        ['x-default', urlOf(route, 'zh')]
      ])
      expect(html).toContain(`<meta property="og:url" content="${urlOf(route, lang)}" />`)
    }
  })

  it('declares html lang zh-Hans and og:locale zh_CN (script subtags, like the zh-Hant / en shells)', () => {
    const html = buildHtml(TEMPLATE, '/product', 'zhCN')
    expect(html).toContain('<html lang="zh-Hans"')
    expect(html).toContain('<meta property="og:locale" content="zh_CN" />')
    expect(html).toContain('<main class="pf" lang="zh-Hans">')
    expect(buildHtml(TEMPLATE, '/product', 'zh')).toContain('<html lang="zh-Hant"')
    expect(buildHtml(TEMPLATE, '/product', 'zh')).toContain('content="zh_TW"')
  })

  it('fallback content is Simplified and links stay inside /zh-cn', () => {
    const html = buildHtml(TEMPLATE, '/product', 'zhCN')
    expect(count(html, /<h1>/g)).toBe(1)
    expect(html).toContain('<h1>产品介绍</h1>')
    expect(html).toContain('href="/zh-cn/tutorial"')
    expect(html).toContain('<a href="/zh-cn">')
    expect(html).not.toContain('href="/tutorial"')
    expect(html).not.toContain('href="/en/')
    const block = html.slice(html.indexOf('<!--prerender:fallback-->'), html.indexOf('<!--/prerender:fallback-->'))
    expect(traditionalIn(block)).toEqual([])
  })

  it.each(routes)('%s: zh-cn title and description come from the zhCN locale and are free of Traditional-only characters', (route) => {
    const key = route === '/' ? 'home' : route.slice(1)
    const [title, desc] = (ROUTES as any)[route].zhCN as [string, string]
    expect(rawMessageIn(zhCNLocale, `seo.${key}.title`)).toBe(title)
    expect(rawMessageIn(zhCNLocale, `seo.${key}.description`)).toBe(desc)
    expect(traditionalIn(title + desc)).toEqual([])
    const html = buildHtml(TEMPLATE, route, 'zhCN')
    expect(html).toContain(`<title>${title.replace(/&/g, '&amp;')}</title>`)
  })

  it('structured data on /zh-cn shells is Simplified and points at /zh-cn', () => {
    const blocks = jsonLdFor('/product', 'zhCN') as any[]
    const store = blocks.find((b) => b['@type'] === 'OnlineStore')
    expect(store.name).toBe('enGo 安购商城')
    expect(store.sameAs).toEqual([`${BASE}/zh-cn/product#shop`])
    expect(traditionalIn(JSON.stringify(blocks))).toEqual([])
    const tut = buildHtml(TEMPLATE, '/tutorial', 'zhCN')
    expect(tut).toContain(`${BASE}/zh-cn/tutorial#howto-device`)
  })

  it('the postbuild re-read of a generated zh-cn shell does not duplicate hreflang or leak the previous route', () => {
    const first = buildHtml(TEMPLATE, '/', 'zhCN')
    const second = buildHtml(first, '/contact', 'zhCN')
    expect(count(second, /hreflang=/g)).toBe(4)
    expect(count(second, /rel="canonical"/g)).toBe(1)
    expect(second).toContain(`href="${BASE}/zh-cn/contact"`)
  })
})

describe('sitemap.xml lists /zh-cn', () => {
  const xml = readFileSync(resolve(__dirname, '../public/sitemap.xml'), 'utf-8')
  const entries = xml.split('<url>').slice(1).map((b) => ({
    loc: /<loc>(.*?)<\/loc>/.exec(b)![1],
    alts: [...b.matchAll(/<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)"\/>/g)].map((m) => [m[1], m[2]])
  }))

  it.each(routes)('%s: each language URL appears exactly once, each with the 4 alternates', (route) => {
    for (const lang of ['zh', 'zhCN', 'en'] as const) {
      const loc = urlOf(route, lang)
      const hits = entries.filter((e) => e.loc === loc)
      expect(hits.length, loc).toBe(1)
      expect(hits[0].alts).toEqual([
        ['zh-Hant', urlOf(route, 'zh')],
        ['zh-Hans', urlOf(route, 'zhCN')],
        ['en', urlOf(route, 'en')],
        ['x-default', urlOf(route, 'zh')]
      ])
    }
  })

  it('has no duplicate <loc> and no uppercase /zh-CN URL', () => {
    const locs = entries.map((e) => e.loc)
    expect(new Set(locs).size).toBe(locs.length)
    expect(locs.filter((l) => /zh-cn/i.test(l)).every((l) => l.includes('/zh-cn'))).toBe(true)
  })
})

describe('vercel.json and llms.txt', () => {
  const vercel = JSON.parse(readFileSync(resolve(__dirname, '../vercel.json'), 'utf-8'))
  it('has a rewrite to the static shell for every /en shell route that has one, mirrored for /zh-cn', () => {
    const rewrites = vercel.rewrites.map((r: any) => [r.source, r.destination])
    const en = rewrites.filter(([s]: string[]) => s === '/en' || s.startsWith('/en/'))
    expect(en.length).toBeGreaterThan(5)
    for (const [src, dest] of en) {
      const z = src.replace(/^\/en/, '/zh-cn')
      expect(rewrites).toContainEqual([z, dest.replace(/^\/en/, '/zh-cn')])
    }
  })
  it('301-redirects /zh-hans to /zh-cn and leaves the host redirects alone', () => {
    const red = vercel.redirects
    expect(red).toContainEqual({ source: '/zh-hans', destination: '/zh-cn', permanent: true })
    expect(red).toContainEqual({ source: '/zh-hans/:path*', destination: '/zh-cn/:path*', permanent: true })
    expect(red.filter((r: any) => r.has?.[0]?.type === 'host').map((r: any) => r.has[0].value)).toEqual(['web.smtengo.com', 'w2.smtengo.com'])
  })
  it('llms.txt points to the Simplified Chinese version under /zh-cn', () => {
    expect(readFileSync(resolve(__dirname, '../public/llms.txt'), 'utf-8')).toContain('https://www.smtengo.com/zh-cn')
  })
})
