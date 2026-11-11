import { describe, expect, it } from 'vitest'
import { rawMessageIn } from './rawMessage'
import { zhLocale } from '../locale/zh'
import { zhCNLocale } from '../locale/zhCN'
import { enLocale } from '../locale/en'
// @ts-expect-error -- plain .mjs build script, no type declarations
import { ROUTES } from '../../scripts/prerender-meta.mjs'

// The prerendered shell sets <title>/description for crawlers, then seo.ts
// overwrites both from seo.* after hydration. When they differ, Google may index
// either (found 2026-11-05: /product shell vs runtime title). The shell strings
// are the source of truth; the locale files must match them exactly.
const LOCALES: Record<string, any> = { zh: zhLocale, zhCN: zhCNLocale, en: enLocale }
const seoKey = (route: string) => (route === '/' ? 'home' : route.slice(1))

describe('prerendered shells and runtime seo.* agree', () => {
  const pairs = Object.entries(ROUTES as Record<string, Record<string, [string, string]>>)
    .flatMap(([route, langs]) => Object.entries(langs).map(([lang, [title, desc]]) => ({ route, lang, title, desc })))

  it('covers every route in all three shell locales', () => {
    expect(pairs.length).toBe(Object.keys(ROUTES).length * 3)
    for (const { lang } of pairs) expect(Object.keys(LOCALES)).toContain(lang)
  })

  it.each(pairs)('$lang $route title', ({ route, lang, title }) => {
    expect(rawMessageIn(LOCALES[lang], `seo.${seoKey(route)}.title`)).toBe(title)
  })

  it.each(pairs)('$lang $route description', ({ route, lang, desc }) => {
    expect(rawMessageIn(LOCALES[lang], `seo.${seoKey(route)}.description`)).toBe(desc)
  })
})
