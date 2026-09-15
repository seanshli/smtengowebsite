import { describe, expect, it } from 'vitest'
import { buildHtml } from './prerender-meta.mjs'

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
