import { describe, it, expect } from 'vitest'
import kb from '../data/knowledge_base.json'
import faqs from '../data/faqs.json'
import news from '../data/news.json'
import packages from '../data/packages.json'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { normalizeQuery, expandQuery, rankKnowledge } from './chatbotMatch'

const top = (q: string) => rankKnowledge(kb as any, expandQuery(normalizeQuery(q)))[0]

describe('chatbot routes KB-001 questions to the right entry', () => {
  const cases: Array<[string, string]> = [
    ['斷網可以用嗎', 'network-required'],
    ['沒有網路還能控制嗎', 'network-required'],
    ['可以控制門鎖嗎', 'door-lock'],
    ['有支援指紋鎖嗎', 'door-lock'],
    ['手機可以語音嗎', 'voice-control'],
    ['平板會不會偷聽錄音', 'voice-control'],
    ['Siri 可以用嗎', 'homekit-siri'],
    ['支援 Apple HomeKit 嗎', 'homekit-siri'],
    ['相片牆半夜會很亮嗎', 'photo-wall'],
    ['App 叫什麼名字 哪裡下載', 'app-download'],
    ['iPhone 和平板功能一樣嗎', 'engo-interfaces'],
    ['怎麼報修', 'property-management'],
    ['配網失敗 連不上', 'device-pairing'],
    ['資料存在哪裡 會傳到國外嗎', 'data-privacy'],
    ['搬家要怎麼處理帳號', 'data-privacy'],
    ['支援哪些家電', 'compatibility'],
    ['米多力斷網還能控制嗎', 'network-required'],
    ['Matter 網關可以接 Google Home 嗎', 'homekit-siri'],
    ['App Store 上的名稱是什麼 哪裡下載', 'app-download'],
    // the chatbot's quick-question chips (zh) must land on the intended entry
    ['enGo 是什麼', 'what-is-engo'],
    ['App 下載', 'app-download'],
    ['支援哪些裝置', 'compatibility'],
    ['語音操作', 'voice-control'],
    ['斷網怎麼辦', 'network-required'],
  ]
  for (const [q, id] of cases) {
    it(`"${q}" → ${id}`, () => {
      const best = top(q)
      expect(best, `no match for "${q}"`).toBeDefined()
      expect(best.item.id).toBe(id)
    })
  }
})

describe('no §0.2 claim survives in the KB or the /tutorial FAQ', () => {
  // Customer-visible text only — keywords are routing terms (e.g. 喚醒詞 must
  // route to the voice entry precisely so the bot can say it is unconfirmed).
  const textOf = (e: any) =>
    ['answer', 'specs', 'features', 'description', 'name', 'question']
      .flatMap((k) => (e[k] && typeof e[k] === 'object' ? Object.values(e[k]) : e[k] ? [e[k]] : []))
      .join('\n')
  const newsText = (news as any[]).map((n) => [n.title, n.summary].flatMap((o) => Object.values(o ?? {})).join('\n')).join('\n')
  const text = [...Object.values(kb as any).flat(), ...(faqs as any[])].map(textOf).join('\n') + '\n' + newsText
  const banned = [
    '嘿 Siri', '嘿！Siri', 'Hey Siri', 'Hey Siri', 'Dis Siri',
    '已整合 Apple HomeKit', 'integrates with Apple HomeKit',
    '離線時仍可運作', 'continue to work offline',
    '食譜', '音響系統', '門鎖及', 'locks, and water',
    '喚醒詞', 'wake word,', 'T1 平板', '10.1吋',
    // 2026-09-11 project-side verification: no Alexa integration exists; HomeKit is
    // per-device Matter sharing, not "enGo integrates HomeKit"; scenes are fully
    // online-only ("not fully supported" reads as "partly works").
    'Alexa', '一鍵控制全家', '一句話就能控制全家', '透過 Matter 網關接入', '已整合 HomeKit',
    '無法完全支援', 'not yet fully supported',
    // 2026-09-15 owner ruling: no component/platform vendor names in customer text.
    'Tuya', 'TUYA', '塗鴉', '涂鸦',
    // 2026-09-15: com.engo.life / App Store id6743929358 ("engo智管家") is a different app;
    // ours is tw.smtengo.engohome.android / id6680188565, named enGo智慧管家 on both stores.
    'com.engo.life', 'id6743929358', 'engo智管家',
    // 2026-09-15: EAP-01 air purifier discontinued — no trace in customer text
    'EAP-01', 'EAP-T01', '空氣清淨機', '空气清净机', 'air purifier', 'Air Purifier',
  ]
  for (const phrase of banned) {
    it(`does not contain "${phrase}"`, () => {
      expect(text.includes(phrase)).toBe(false)
    })
  }
  it('every entry that says 門鎖 also says it is not supported', () => {
    const all = [...(kb as any).general, ...(kb as any).products, ...(kb as any).catalog]
    for (const e of all) {
      const zh = e.answer?.zh ?? e.features?.zh ?? e.description?.zh ?? ''
      if (zh.includes('門鎖')) expect(zh, e.id).toMatch(/不在.*支援|不支援|不在支援範圍/)
    }
    for (const f of faqs as any[]) {
      if (f.answer.zh.includes('門鎖')) expect(f.answer.zh, String(f.id)).toMatch(/不在.*支援|不支援|不在支援範圍/)
    }
  })
  it('the offline answer is split by device type (curtains/sensors/switches vs MEDOLE / enGo-native), per the 2026-09-11 code check', () => {
    const zh = (kb as any).general.find((e: any) => e.id === 'network-required').answer.zh as string
    expect(zh).toMatch(/窗簾、部分感測器與開關類/)
    expect(zh).toMatch(/米多力.*仍需連網/)
    expect(zh).toMatch(/情境（一鍵模式）目前需要連網/)
    const faq6 = (faqs as any[]).find((f) => f.id === 6).answer.zh as string
    expect(faq6).toMatch(/窗簾、部分感測器與開關類/)
    expect(faq6).toMatch(/米多力.*仍需連網/)
  })
  it('the app is enGo智慧管家 on both stores (verified 2026-09-15): App Store id6680188565, Google Play tw.smtengo.engohome.android', () => {
    for (const s of [(kb as any).general.find((e: any) => e.id === 'app-download').answer.zh, (faqs as any[]).find((f) => f.id === 30).answer.zh]) {
      expect(s).toContain('enGo智慧管家')
      expect(s).toContain('apps.apple.com/app/id6680188565')
      expect(s).toContain('id=tw.smtengo.engohome.android')
    }
    const vue = readFileSync(resolve(process.cwd(), 'src/views/product.vue'), 'utf-8')
    expect(vue).toContain('apps.apple.com/app/id6680188565')
    expect(vue).toContain('id=tw.smtengo.engohome.android')
    for (const f of ['app-store-zh-tw.svg', 'app-store-en.svg', 'google-play-en.png']) {
      expect(existsSync(resolve(process.cwd(), 'public/images/badges', f)), f).toBe(true)
    }
  })
  it('the /packages catalog sells no door lock and the tablet card carries no unverified hardware spec table', () => {
    const cat = (packages as any).catalog as any[]
    expect(cat.some((c) => /門鎖|Smart Lock|门锁/.test(JSON.stringify(c.name)))).toBe(false)
    expect(cat.find((c) => c.id === 'tablet_t1').specs).toBeUndefined()
  })
  it('the product JSON-LD claims no Alexa and no whole-home one-tap control', () => {
    const src = readFileSync(resolve(process.cwd(), 'src/utils/productSchema.ts'), 'utf-8')
    expect(src).not.toMatch(/Alexa/)
    expect(src).not.toMatch(/一鍵控制全家|MEDOLE/)
  })
  it('every FAQ has six locales, a known category, and well-formed links to real routes or our YouTube channel', () => {
    const cats = ['setup', 'features', 'products', 'services', 'safety', 'energy', 'maintenance', 'warranty', 'compatibility', 'tutorials', 'showroom']
    const routes = ['/product', '/product?jump=oxygen', '/product?jump=packages', '/tutorial', '/contact', '/packages', '/enviro', '/ecosystem', '/brandStory', '/cases', '/cases/23', '/cases/24']
    const ids = new Set<number>()
    for (const f of faqs as any[]) {
      expect(ids.has(f.id), `duplicate id ${f.id}`).toBe(false); ids.add(f.id)
      expect(cats, `category ${f.category} on #${f.id}`).toContain(f.category)
      for (const loc of ['zh', 'zhCN', 'en', 'ja', 'fr', 'es']) {
        expect(f.question[loc], `#${f.id} question ${loc}`).toBeTruthy()
        expect(f.answer[loc], `#${f.id} answer ${loc}`).toBeTruthy()
        for (const m of String(f.answer[loc]).matchAll(/\]\(([^)\s]+)\)/g)) {
          const href = m[1]
          const ok = routes.includes(href) || /^https:\/\/(www\.)?youtube\.com\//.test(href)
          expect(ok, `#${f.id} ${loc} links to ${href}`).toBe(true)
        }
      }
    }
    for (const gone of [3, 8, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]) expect(ids.has(gone), `#${gone} removed`).toBe(false)
    for (const here of [37, 40, 42, 44, 45, 46, 47, 48, 49]) expect(ids.has(here), `#${here} present`).toBe(true)
  })
  it('solution pricing goes to a person: the developer answer quotes no figures, FAQ 48 points to list prices + a quote', () => {
    const bp = (kb as any).general.find((e: any) => e.id === 'builder-proposal').answer
    for (const loc of Object.keys(bp)) expect(bp[loc], `builder-proposal ${loc}`).not.toMatch(/NT\$|[0-9]{2},[0-9]{3}/)
    const f48 = (faqs as any[]).find((f) => f.id === 48).answer.zh as string
    expect(f48).toContain('定價列在套裝方案頁')
    expect(f48).toContain('依需求報價')
  })
})
