import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, join } from 'node:path'

// Sean's content rulings of 2026-11-10. They apply to everything a visitor reads, so the scan covers
// the locale files, the data files, the views/components/layout templates, llms.txt, the prerender
// shells and index.html. Search-synonym lists (the KB `keywords` arrays, chatbotMatch.ts, line-bot.ts),
// the controlled legal documents under public/ and the forbidden-claims lint list are NOT customer copy.
const root = resolve(__dirname, '../..')
const read = (p: string) => readFileSync(resolve(root, p), 'utf-8')
const walk = (dir: string): string[] =>
  readdirSync(resolve(root, dir)).flatMap((n) => {
    const rel = join(dir, n)
    return statSync(resolve(root, rel)).isDirectory() ? walk(rel) : [rel]
  })

const stripKeywords = (raw: string): string => {
  const data = JSON.parse(raw)
  const drop = (o: any): any =>
    Array.isArray(o) ? o.map(drop) : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).filter(([k]) => k !== 'keywords').map(([k, v]) => [k, drop(v)])) : o
  return JSON.stringify(drop(data))
}

const COPY: Record<string, string> = {}
for (const f of ['zh', 'zhCN', 'en', 'ja', 'fr', 'es']) COPY[`src/locale/${f}.ts`] = read(`src/locale/${f}.ts`)
for (const f of ['cases', 'packages', 'howto', 'faqs', 'news', 'knowledge_base', 'tutorials', 'legal'])
  COPY[`src/data/${f}.json`] = stripKeywords(read(`src/data/${f}.json`))
for (const f of [...walk('src/views'), ...walk('src/components'), ...walk('src/layout')].filter((p) => p.endsWith('.vue'))) COPY[f] = read(f)
for (const f of ['public/llms.txt', 'scripts/prerender-meta.mjs', 'index.html']) COPY[f] = read(f)

describe('content rulings 2026-11-10', () => {
  it('安購 / 安购 appears only inside the store full name 「enGo 安購商城」 / 「enGo 安购商城」', () => {
    for (const [f, text] of Object.entries(COPY)) {
      const rest = text.replace(/enGo 安購商城/g, '').replace(/enGo 安购商城/g, '')
      expect(rest, f).not.toMatch(/安購|安购/)
    }
  })
  it('the old store name 智管家商城 is gone from customer copy', () => {
    for (const [f, text] of Object.entries(COPY)) expect(text, f).not.toMatch(/智管家商城/)
  })
  it('no surface quotes the top package price (99,999)', () => {
    for (const [f, text] of Object.entries(COPY)) expect(text, f).not.toMatch(/99,?999/)
    const pkg = JSON.parse(read('src/data/packages.json')).main_packages.find((p: any) => p.id === 'luxury')
    expect(pkg.price).toEqual({ zh: '洽詢', zhCN: '洽询', en: 'Contact us', ja: 'お問い合わせ', fr: 'Sur demande', es: 'Consultar' })
  })
  it('case records carry no contract/budget amounts and no HomeKit/Siri integration claims', () => {
    const text = COPY['src/data/cases.json']
    expect(text).not.toMatch(/預算|预算|完工金額|完工金额|予算|\bBudget\b|Actual completion|Final cost/i)
    expect(text).not.toMatch(/Hey Siri/i)
    expect(text).not.toMatch(/Homekit ?(整合|居家整合|統合|integration|intégration)|HomeKit ?(整合|居家整合|統合|Integration|Intégration)/i)
    expect(text).not.toMatch(/Siri ?(語音聲控|Voice Control Integration)|整合 Siri/)
  })
  it('the team bio says 24 patents everywhere', () => {
    const team = read('src/views/team.vue')
    expect(team).not.toMatch(/二十七項|二十七项|27-patent|27 patents/)
    expect(team).toMatch(/二十四項專利/)
    expect(team).toMatch(/24-patent/)
  })
  it('store short/long names follow the ruling in every locale', () => {
    expect(COPY['src/locale/zh.ts']).toContain("mallTitle: 'enGo 商城'")
    expect(COPY['src/locale/zhCN.ts']).toContain("mallTitle: 'enGo 商城'")
    for (const l of ['en', 'ja', 'fr', 'es']) expect(COPY[`src/locale/${l}.ts`], l).toContain("mallTitle: 'enGo Shop'")
  })
})
