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
  // Solution pages are titled from src/data/solutions.json, not seo.* (checked below).
  const pairs = Object.entries(ROUTES as Record<string, Record<string, [string, string]>>)
    .filter(([route]) => !route.startsWith('/solutions/'))
    .flatMap(([route, langs]) => Object.entries(langs).map(([lang, [title, desc]]) => ({ route, lang, title, desc })))

  it('covers every route in all three shell locales', () => {
    expect(pairs.length).toBe(Object.keys(ROUTES).filter((r) => !r.startsWith('/solutions/')).length * 3)
    for (const { lang } of pairs) expect(Object.keys(LOCALES)).toContain(lang)
  })

  it.each(pairs)('$lang $route title', ({ route, lang, title }) => {
    expect(rawMessageIn(LOCALES[lang], `seo.${seoKey(route)}.title`)).toBe(title)
  })

  it.each(pairs)('$lang $route description', ({ route, lang, desc }) => {
    expect(rawMessageIn(LOCALES[lang], `seo.${seoKey(route)}.description`)).toBe(desc)
  })
})

describe('solution shells match the runtime title (facelift 2026-11-24)', () => {
  it('every solution has a shell per locale titled "<area> · <product> | enGo"', async () => {
    const solutions = (await import('../data/solutions.json')).default.solutions as any[]
    const { pickField } = await import('../composables/useLocaleText')
    for (const s of solutions) for (const lang of ['zh', 'zhCN', 'en']) {
      const [title] = (ROUTES as any)[`/solutions/${s.id}`][lang]
      expect(title).toBe(`${pickField(lang, s.area)}${s.product ? ' · ' + s.product : ''} | enGo`)
    }
  })
})
