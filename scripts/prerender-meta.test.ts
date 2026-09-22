import { describe, expect, it } from 'vitest'
import { buildHtml, jsonLdFor } from './prerender-meta.mjs'

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
<body></body>
</html>`

const count = (html: string, re: RegExp) => (html.match(re) ?? []).length

describe('prerender structured data (AI-SEO)', () => {
  it('/tutorial shells carry a FAQPage and a HowTo list, in the shell language', () => {
    const zh = buildHtml(TEMPLATE, '/tutorial', 'zh')
    expect(count(zh, /data-prerender/g)).toBe(2)
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
  it('the postbuild pass does not duplicate structured data', () => {
    const first = buildHtml(TEMPLATE, '/tutorial', 'zh')
    const second = buildHtml(first, '/', 'zh')
    expect(count(second, /data-prerender/g)).toBe(1)   // only the home page's MobileApplication
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
