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
    ['配網一直在轉 卡住了', 'device-pairing'],
    // how-to modules (KB-001 A.8 §0.1 second source) must be reachable from natural questions
    ['怎麼新增房間', 'howto-household'],
    ['怎麼把家人加進來', 'howto-household'],
    ['邀請碼外流怎麼辦', 'howto-household'],
    ['情境怎麼建立', 'howto-scene'],
    ['公設怎麼預約', 'howto-reservation'],
    ['公告在哪裡看', 'howto-community'],
    ['倉儲怎麼用', 'howto-warehouse'],
    ['App 主題怎麼改深色', 'howto-settings'],
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
    ['解鎖開門是什麼', 'unlock-door-button'],
    ['通知頁的解鎖開門按鈕', 'unlock-door-button'],
    ['手機上找不到倉儲', 'floorplan-inventory'],
    ['手機有平面圖嗎', 'floorplan-inventory'],
    ['手機找不到設定', 'engo-interfaces'],
    ['平板電池充不進去', 'tablet-hardware'],
    ['平板開不了機', 'tablet-hardware'],
    ['485轉換器斷網還能用嗎', 'network-required'],
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
    // 2026-09-22 KB-001 A.7/A.8 (app 3.2.2+489): the Settings page no longer has a 語音助理 item,
    // and scene creation starts with the trigger, not the name — both old scripts are retired.
    '語音助理', '语音助理', 'Voice Assistant', '命名後儲存', '命名后储存', '選裝置、命名', '选装置、命名',
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
  it('the offline answer follows KB-001 A.10 (2026-09-22 product test): 485 converter now works on the same home network, IR remote keys and scenes do not, and the at-home premise is stated', () => {
    const zh = (kb as any).general.find((e: any) => e.id === 'network-required').answer.zh as string
    expect(zh).toMatch(/窗簾、部分感測器與開關類/)
    expect(zh).toMatch(/485 轉換器[\s\S]*仍可直接控制/)
    expect(zh).toMatch(/紅外遙控器按鍵[\s\S]*仍需連網/)
    expect(zh).toMatch(/情境（一鍵模式，含手動與自動化）[\s\S]*需要連網/)
    expect(zh).toMatch(/同一個家用網路/)
    expect(zh).not.toMatch(/開發中|米多力.*仍需連網/)
    const faq6 = (faqs as any[]).find((f) => f.id === 6).answer.zh as string
    expect(faq6).toMatch(/窗簾、部分感測器與開關類/)
    expect(faq6).toMatch(/485 轉換器/)
    expect(faq6).toMatch(/紅外遙控器按鍵/)
    expect(faq6).not.toMatch(/開發中|仍需連網才能控制/)
    // nothing on the site may still say MEDOLE needs the internet (retired by A.10)
    for (const f of faqs as any[]) expect(f.answer.zh, String(f.id)).not.toMatch(/米多力系列目前需連網/)
    const llms = readFileSync(resolve(process.cwd(), 'public/llms.txt'), 'utf-8')
    expect(llms).toMatch(/485 轉換器/)
    expect(llms).not.toMatch(/米多力系列與 enGo 自有裝置需要連網/)
  })
  it('KB-001 A.12 (2026-09-23 iPhone check): floor plan and energy statistics are tablet-only; the phone names 倉儲 as 庫存 under 更多', () => {
    const g = (kb as any).general
    for (const id of ['engo-interfaces', 'floorplan-inventory']) {
      const zh = g.find((e: any) => e.id === id).answer.zh as string
      expect(zh, id).toMatch(/庫存/)
      expect(zh, id).toMatch(/更多/)
      expect(zh, id).toMatch(/用電統計/)
    }
    expect(g.find((e: any) => e.id === 'floorplan-inventory').answer.zh).toMatch(/平板專屬/)
    expect((faqs as any[]).find((f) => f.id === 29).answer.zh).toMatch(/平面圖即時視圖與用電統計為平板專屬/)
    expect((faqs as any[]).find((f) => f.id === 38).answer.zh).toMatch(/平板專屬功能，手機 App 沒有/)
    expect((faqs as any[]).find((f) => f.id === 39).answer.zh).toMatch(/「庫存」/)
    const vue = readFileSync(resolve(process.cwd(), 'src/views/product.vue'), 'utf-8')
    expect(vue).toContain("product.interfaces.rows.floorplan")
  })
  it('KB-001 A.13 §10.1 #11: the 解鎖開門 button is never explained by the bot, only handed to a person; tablet hardware questions are handed off too', () => {
    const g = (kb as any).general
    const u = g.find((e: any) => e.id === 'unlock-door-button')
    for (const loc of ['zh', 'zhCN', 'en', 'ja', 'fr', 'es']) {
      expect(u.answer[loc], loc).toContain('02-27510218')
      expect(u.answer[loc], loc).toContain('/contact')
    }
    expect(u.answer.zh).not.toMatch(/社區大門|門鎖|大門|門口機/)
    const h = g.find((e: any) => e.id === 'tablet-hardware')
    for (const loc of ['zh', 'zhCN', 'en', 'ja', 'fr', 'es']) expect(h.answer[loc], loc).toContain('02-27510218')
  })
  it('pairing help follows KB-001 A.8 §3: three causes in order, the 30-second Device-discovery warning, and the how-to deep link', () => {
    const e = (kb as any).general.find((x: any) => x.id === 'device-pairing')
    const zh = e.answer.zh as string
    expect(zh).toMatch(/5GHz Wi-Fi[\s\S]*配網模式[\s\S]*離路由器太遠/)
    expect(zh).toMatch(/不會告訴您失敗/)
    expect(zh).toMatch(/等約 30 秒/)
    expect(zh).toContain('(/tutorial#howto-device)')
    for (const loc of ['zhCN', 'en', 'ja', 'fr', 'es']) {
      expect(e.answer[loc], loc).toMatch(/30/)
      expect(e.answer[loc], loc).toContain('/tutorial#howto-device')
    }
  })
  it('voice activation is referred to a person (KB-001 A.8 §4): no Settings path is described', () => {
    const zh = (kb as any).general.find((x: any) => x.id === 'voice-control').answer.zh as string
    expect(zh).toMatch(/請洽專人/)
    expect(zh).not.toMatch(/設定\s*[→>]/)
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
          // 錨點（/tutorial#howto-scene）是既有做法——header/footer 的「常見問題」就是
          // /tutorial#faq。比對路由時先去掉 #fragment，否則每加一個深連結就會誤判。
          const path = href.split('#')[0] || href
          const ok = routes.includes(path) || /^https:\/\/(www\.)?youtube\.com\//.test(href)
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
    // the pre-2026-09 bundles (自動新「聲」活 = tablet + EAP-01 air purifier) no longer exist
    for (const loc of Object.keys(bp)) expect(bp[loc], `builder-proposal ${loc}`).not.toMatch(/自動新|自动新|Smart voice living|スマート音声生活|Vie connectée par la voix|Vida de voz/)
    const f48 = (faqs as any[]).find((f) => f.id === 48).answer.zh as string
    expect(f48).toContain('定價列在套裝方案頁')
    expect(f48).toContain('依需求報價')
  })
})
