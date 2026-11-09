import { describe, it, expect } from 'vitest'
import { SHOP_URL } from './shopUrl'
import kb from '../data/knowledge_base.json'
import faqs from '../data/faqs.json'
import howto from '../data/howto.json'
import forbidden from '../data/forbidden-claims.json'
import news from '../data/news.json'
import packages from '../data/packages.json'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { normalizeQuery, expandQuery, rankKnowledge, prefersShopKnowledge } from './chatbotMatch'

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
    // KB-001 A.15 shop — 「在哪」 alone routes to the office address, so the store phrasings are pinned
    ['商城在哪裡買', 'shop-platform'],
    ['安購商城在哪裡', 'shop-platform'],
    ['智管家商城是什麼', 'shop-platform'],
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
    ['智管家商城是什麼', 'shop-platform'],
    ['要去哪裡買東西', 'shop-platform'],
    ['商城網址', 'shop-platform'],
    // KB-001 A.17 / UM-001 A.16 sync: the device-data steps, the product lines and the terms-still-say-安購 question must be reachable
    ['設備數據怎麼看', 'howto-devicedata'],
    ['哪一台耗電', 'howto-devicedata'],
    ['有哪些產品線', 'product-lines'],
    ['服務條款為什麼寫安購商城', 'shop-platform'],
    ['為什麼手機沒有語音', 'voice-control'],
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
  // 禁句清單不再硬寫在這裡——三個 surface（網站問答、LINE、後端語音知識庫）
  // 共用 src/data/forbidden-claims.json，並以 /forbidden-claims.json 對外提供。
  // 改禁句改那一份，這裡只負責執行。來源：ENGO-KB-001 §0.2。
  const rules = (forbidden as any).rules as Array<any>
  const banned = rules.filter((r) => r.kind === 'banned_phrase').flatMap((r) => r.phrases as string[])

  for (const phrase of banned) {
    it(`does not contain "${phrase}"`, () => {
      expect(text.includes(phrase)).toBe(false)
    })
  }
  for (const rule of rules.filter((r: any) => r.kind === 'requires_denial')) {
    it(`every entry that mentions ${rule.id} also carries the denial`, () => {
      const mention = new RegExp(rule.mention, 'i')
      const deny = new RegExp(rule.deny, 'i')
      const all = [...(kb as any).general, ...(kb as any).products, ...(kb as any).catalog, ...(faqs as any[])]
      for (const e of all) {
        for (const loc of ['zh', 'zhCN', 'en', 'ja', 'fr', 'es']) {
          const t = e.answer?.[loc] ?? e.features?.[loc] ?? e.description?.[loc] ?? ''
          if (typeof t === 'string' && mention.test(t)) {
            expect(t, `${rule.id} · ${e.id ?? e.category}/${loc}`).toMatch(deny)
          }
        }
      }
    })
  }
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
  it('2026-09-27 (PR #44 / UM-001 A.15): the floor plan is 開發中 (not in 3.2.2, planned tablet-only), device data is on all three, the phone names 倉儲 as 庫存 under 更多', () => {
    const g = (kb as any).general
    for (const id of ['engo-interfaces', 'floorplan-inventory']) {
      const zh = g.find((e: any) => e.id === id).answer.zh as string
      expect(zh, id).toMatch(/庫存/)
      expect(zh, id).toMatch(/更多/)
      expect(zh, id).toMatch(/設備數據/)
      expect(zh, id).toMatch(/開發中/)
      expect(zh, id).not.toMatch(/用電統計也是平板專屬|平面圖即時視圖、用電統計/)
    }
    expect(g.find((e: any) => e.id === 'floorplan-inventory').answer.zh).toMatch(/版面切換/)
    const faq29 = (faqs as any[]).find((f) => f.id === 29).answer.zh as string
    expect(faq29).toMatch(/設備數據/)
    expect(faq29).toMatch(/平面圖即時視圖開發中/)
    const faq38 = (faqs as any[]).find((f) => f.id === 38).answer.zh as string
    expect(faq38).toMatch(/開發中/)
    expect(faq38).not.toMatch(/平板專屬功能，手機 App 沒有/)
    // nothing on the site may present the floor plan as a shipped feature
    const texts: Array<[string, string]> = [
      ...g.map((e: any) => [e.id, e.answer?.zh ?? ''] as [string, string]),
      ...(kb as any).products.map((e: any) => [e.id, e.features?.zh ?? ''] as [string, string]),
      ...(faqs as any[]).map((f) => [String(f.id), f.answer.zh] as [string, string]),
      ['llms.txt', readFileSync(resolve(process.cwd(), 'public/llms.txt'), 'utf-8')],
    ]
    for (const [id, zh] of texts) if (zh.includes('平面圖即時視圖')) expect(zh, id).toMatch(/開發中/)
    const vue = readFileSync(resolve(process.cwd(), 'src/views/product.vue'), 'utf-8')
    expect(vue).toContain("product.interfaces.rows.floorplan")
    expect(vue).toContain("product.interfaces.rows.deviceData")
    expect(vue).toMatch(/floorplan: null/)
  })
  it('the store entry follows KB-001 A.15: same store, new version, never 合併/轉移/收購; orders go to the store; five product lines', () => {
    const e = (kb as any).general.find((x: any) => x.id === 'shop-platform')
    for (const loc of ['zh', 'zhCN', 'en', 'ja', 'fr', 'es']) {
      expect(e.answer[loc], loc).toContain('https://shoph5.smtengo.com/')
      expect(e.answer[loc], loc).toContain('/product#shop')
    }
    expect(e.answer.zh).toMatch(/新版本/)
    expect(e.answer.zh).not.toMatch(/合併|轉移|收購|\/\/h5\.smtengo\.com/)
    const faq45 = (faqs as any[]).find((f) => f.id === 45).answer.zh as string
    expect(faq45).toMatch(/^五條/)
    expect(faq45).toMatch(/智管家商城/)
  })
  it('UM-001 A.16 / KB-001 A.17 sync (2026-09-29): account deletion is 請洽客服確認 everywhere (KB-001 §10.1 #7 undecided); low-stock threshold lives in the 告警 tab; top-right icons are 設備數據 not 用電統計; device data has an entry path and a bot entry', () => {
    const locs = ['zh', 'zhCN', 'en', 'ja', 'fr', 'es']
    const g = (kb as any).general
    // §10.1 #7: no source confirms a grace period, so no surface may promise one or call deletion unrecoverable
    const deletion = [g.find((e: any) => e.id === 'data-privacy').answer, (faqs as any[]).find((f) => f.id === 35).answer]
    for (const a of deletion) {
      expect(a.zh).toMatch(/請洽客服確認/)
      for (const loc of locs) expect(a[loc], loc).not.toMatch(/還原帳號|还原账号|取消、還原|restored within|restaurable|restaurar durante|復元できます/)
    }
    const howtoText = JSON.stringify(howto)
    expect(howtoText).not.toMatch(/永久刪除帳號|無法復原|安全量|用電統計/)
    const wh = (howto as any).modules.find((m: any) => m.id === 'warehouse')
    expect(wh.tips.map((t: any) => t.zh).join('')).toMatch(/「告警」分頁[\s\S]*「庫存不足」/)
    const home3 = (howto as any).modules.find((m: any) => m.id === 'home').steps[2]
    expect(home3.body.zh).toMatch(/版面切換、設備數據、手動更新、新增裝置/)
    expect(home3.body.zh).toMatch(/手機[\s\S]*☰/)
    const dd = (howto as any).modules.find((m: any) => m.id === 'devicedata')
    expect(dd.steps[0].body.zh).toMatch(/平板：首頁右上角的第二顆圖示[\s\S]*手機：從裝置頁進入/)
    expect((howto as any).meta.updated).toBe('2026-11-09')   // moved from 2026-11-05 by the UM-001 A.24 sync
    const bot = (kb as any).howto.find((e: any) => e.id === 'howto-devicedata')
    expect(bot.answer.zh).toContain('(/tutorial#howto-devicedata)')
    expect(bot.answer.zh).toMatch(/第二顆圖示/)
    // every howto module has a bot entry whose steps mirror howto.json (the two must move together)
    for (const m of (howto as any).modules) {
      const e = (kb as any).howto.find((x: any) => x.id === `howto-${m.id}`)
      expect(e, m.id).toBeDefined()
      for (const st of m.steps) expect(e.answer.zh, `${m.id}/${st.title.zh}`).toContain(st.body.zh)
    }
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
  it('UM-001 A.17-A.20 / UM-002 A.5 / WEB-001 A.6 sync (2026-11-05): six pairing modes incl. ESP, voice on by default from 3.6.x, floor plan still not in 3.6.2, announcements under 訊息 (no 公布欄 menu), withdrawn images gone, pickup is a button not a code', () => {
    const locs = ['zh', 'zhCN', 'en', 'ja', 'fr', 'es']
    const g = (kb as any).general
    const gen = (id: string) => g.find((e: any) => e.id === id).answer
    const fq = (id: number) => (faqs as any[]).find((f) => f.id === id).answer
    const mod = (id: string) => (howto as any).modules.find((m: any) => m.id === id)
    // §5 / A.17 ①: six pairing modes, 「ESP 配網」 is its own tab and 「AP 配網」 is ecosystem devices only
    const dev = mod('device')
    expect(dev.summary.zh).toMatch(/六種/)
    expect(dev.summary.zh).not.toMatch(/五種/)
    expect(dev.steps.map((s: any) => s.title.zh).join('|')).toMatch(/AP 配網（生態系裝置[\s\S]*ESP 配網/)
    expect(dev.steps.find((s: any) => /AP 配網/.test(s.title.zh)).body.zh).toMatch(/五個節點的進程點線圖/)
    expect((kb as any).howto.find((e: any) => e.id === 'howto-device').answer.zh).toContain('ESP 配網')
    for (const loc of locs) {
      expect(gen('device-pairing')[loc], loc).toMatch(/ESP/)
      expect(gen('device-pairing')[loc], loc).not.toMatch(/五種|五种|Five methods|cinco métodos|Cinq méthodes|5 つの方式/)
      expect(fq(1)[loc], loc).toMatch(/ESP/)
      expect(fq(52)[loc], loc).toMatch(/ESP/)
    }
    // §8.1 / A.17 ③: voice is on by default from 3.6.x, but the activation method is still referred to a person (KB-001 §4, no wake word)
    for (const loc of locs) {
      expect(gen('voice-control')[loc], loc).toMatch(/3\.6\.x/)
      expect(fq(31)[loc], loc).toMatch(/3\.6\.x/)
    }
    expect(gen('voice-control').zh).toMatch(/請洽專人/)
    // §1.1 / §6.1 (rechecked 2026-10-18): 3.6.2 still has no floor plan
    for (const [id, a] of [['engo-interfaces', gen('engo-interfaces')], ['floorplan-inventory', gen('floorplan-inventory')], ['faq 38', fq(38)]] as Array<[string, any]>) {
      for (const loc of locs) {
        expect(a[loc], `${id} ${loc}`).toMatch(/3\.6\.2/)
        expect(a[loc], `${id} ${loc}`).not.toMatch(/3\.2\.2/)
      }
    }
    // §9.2 / A.19 nav list: announcements sit under 訊息; there is no 公布欄 menu to point at
    expect(JSON.stringify(howto)).not.toMatch(/公布欄|bulletin/)
    expect(JSON.stringify([gen('property-management'), fq(40)])).not.toMatch(/公布欄|公布栏|bulletin|掲示板|tableau d'affichage|tablón/)
    expect(mod('service').steps[0].body.zh).toMatch(/左側欄的工單/)
    expect(mod('service').steps[0].body.zh).not.toMatch(/報修 →/)
    // A.20: the announcement-detail template shot is withdrawn everywhere; every how-to image exists on disk
    expect(JSON.stringify(howto)).not.toMatch(/announce-detail/)
    expect(existsSync(resolve(process.cwd(), 'public/images/howto/community/03-announce-detail.png'))).toBe(false)
    expect(existsSync(resolve(process.cwd(), 'public/images/screens/09-announcement-tablet.png'))).toBe(false)
    for (const m of (howto as any).modules) for (const s of m.steps) if (s.image) expect(existsSync(resolve(process.cwd(), 'public' + s.image)), s.image).toBe(true)
    for (const f of ['index.vue', 'product.vue']) expect(readFileSync(resolve(process.cwd(), 'src/views', f), 'utf-8'), f).not.toContain('09-announcement-tablet')
    // §9.2 / A.17 ②: the locale blurbs say 開櫃取件 (button), never "enter the code"
    for (const loc of ['zh', 'zhCN', 'en', 'ja']) {
      const src = readFileSync(resolve(process.cwd(), `src/locale/${loc}.ts`), 'utf-8')
      expect(src, loc).not.toMatch(/輸碼|输码|entering the code|コードを入力/)
    }
    expect(readFileSync(resolve(process.cwd(), 'src/locale/zh.ts'), 'utf-8')).toContain('按「開櫃取件」即可開櫃')
  })
  it('UM-001 A.21-A.24 sync (2026-11-09): 訊息 has four tabs (告警, 電鈴紀錄), §6.5 device control pages reachable, provenance moved to 3.11.0', () => {
    const locs = ['zh', 'zhCN', 'en', 'ja', 'fr', 'es']
    const mod = (id: string) => (howto as any).modules.find((m: any) => m.id === id)
    const gen = (id: string) => (kb as any).general.find((e: any) => e.id === id)
    // A.21 / §9.3: the 訊息 page tabs are 公告／告警／操作紀錄／電鈴紀錄; the old 「通知」 tab is gone, and the old "three kinds" claim with it
    const community = JSON.stringify(mod('community')) + JSON.stringify((kb as any).howto.find((e: any) => e.id === 'howto-community')) + readFileSync(resolve(process.cwd(), 'public/llms.txt'), 'utf-8')
    expect(community).toMatch(/公告[、，／]?[^"]*告警[^"]*操作紀錄[^"]*電鈴紀錄/)
    expect(community).toContain('電鈴紀錄')
    expect(community).not.toMatch(/三類訊息|Three kinds of messages|系統消息|System messages/)
    expect(community).not.toMatch(/訊息[^。"]{0,12}「通知」分頁|Messages[^."]{0,30}通知 tab/)
    const steps = mod('community').steps.map((s: any) => s.title.zh + s.body.zh).join('')
    expect(steps).toMatch(/原本的「通知」分頁已更名為「告警」/)
    expect(steps).toMatch(/查看分機資訊/)
    expect(steps).not.toMatch(/查看攝影機、解鎖開門/)
    // Shop (商城) 「通知」 pages are a different product and keep their name
    expect(JSON.stringify(mod('shopnotify'))).toContain('「通知」頁')
    // Product feedback 2026-11-09: the 通知 page's 電鈴通知 tab is the doorbell settings and dial keypad; the history is the 電鈴紀錄 tab on 訊息
    expect(steps).toMatch(/電鈴通知（電鈴設定與撥號鍵盤）/)
    expect(steps).toMatch(/門口電鈴的歷史紀錄請到訊息的「電鈴紀錄」分頁看/)
    expect(community).not.toMatch(/含未接|missed ones included|來電紀錄/)
    // A.24 / §6.5 and A.22 ④: the new answer exists in all six locales, mentions Matter ACs on the dial panel, and is reachable from natural questions
    const dc = gen('device-control-pages')
    for (const loc of locs) expect(dc.answer[loc], loc).toMatch(/3\.11\.0/)
    expect(dc.answer.zh).toMatch(/第三方 Matter 冷氣也會自動接上這個轉盤式面板/)
    expect(top('冷氣控制頁有什麼').item.id).toBe('device-control-pages')
    expect(top('燈的控制頁可以調什麼').item.id).toBe('device-control-pages')
    expect(top('各種裝置的控制頁有什麼').item.id).toBe('device-control-pages')
    expect(mod('home').steps.map((s: any) => s.title.zh).join('|')).toMatch(/各種裝置的控制頁有什麼/)
    // 無線情境按鍵 vs 無線開關 and the gear stay distinct, and nothing leaks the retired air purifier or a door lock
    expect(dc.answer.zh).toMatch(/無線情境按鍵[\s\S]*無線開關/)
    expect(JSON.stringify(dc)).not.toMatch(/空氣清淨機|門鎖|Alexa/)
    // A.22 provenance: the how-to no longer calls 3.6.2 the whole current app, and the pin is 2026-11-09
    expect((howto as any).meta.generatedFor.zh).toMatch(/3\.6\.2 為底[\s\S]*3\.11\.0/)
    expect((howto as any).meta.generatedFor.en).toMatch(/Based on enGo 3\.6\.2[\s\S]*3\.11\.0/)
    expect((howto as any).meta.updated).toBe('2026-11-09')
    // every howto module still has a bot entry mirroring its steps
    for (const m of (howto as any).modules.filter((x: any) => ['home', 'community'].includes(x.id))) {
      const e = (kb as any).howto.find((x: any) => x.id === `howto-${m.id}`)
      for (const st of m.steps) expect(e.answer.zh, `${m.id}/${st.title.zh}`).toContain(st.body.zh)
    }
  })
  it('product feedback 2026-11-09: no standby photo wall, 電鈴通知 is settings/dial pad, the menu is 設置, no Shop push into 訊息', () => {
    const root = process.cwd()
    const read = (p: string) => readFileSync(resolve(root, p), 'utf-8')
    const viewFiles = readdirSync(resolve(root, 'src/views')).filter((f) => f.endsWith('.vue')).map((f) => `src/views/${f}`)
    const sources = [
      'src/data/knowledge_base.json', 'src/data/faqs.json', 'src/data/howto.json', 'src/data/news.json', 'src/data/packages.json',
      'src/locale/zh.ts', 'src/locale/zhCN.ts', 'src/locale/en.ts', 'src/locale/ja.ts', 'public/llms.txt', ...viewFiles
    ]
    // (a) the standby photo wall was never a product feature (forbidden-claims files mirror a product-owned source and are exempt)
    const photoWall = /相片牆|相片墙|photo ?wall|フォトウォール|mur de photos|muro de fotos/i
    for (const f of sources) expect(read(f), f).not.toMatch(photoWall)
    expect((kb as any).general.some((e: any) => e.id === 'photo-wall')).toBe(false)
    expect((faqs as any[]).some((f) => f.id === 33)).toBe(false)
    // (b) the app's settings menu is 設置; no copy navigates via 「設定 →」. Allow-list: the Japanese verb 設定 in 「動作を設定→名前を付けて…」 (scene-building step order, FAQ 36), which is not a menu.
    for (const f of sources) expect(read(f), f).not.toMatch(/(?<!動作を)設定\s*(→|->|＞|>)/)
    // (c) the 電鈴通知 tab never shows call records
    for (const f of sources) expect(read(f), f).not.toMatch(/電鈴通知[^。；]{0,12}來電/)
    // (d) no Shop push into the enGo 訊息 page
    for (const f of sources) {
      expect(read(f), f).not.toMatch(/推播到[^。；]{0,12}訊息|推播到[^。；]{0,12}讯息|pushed to the (enGo app|Messages)|arrive as 商城消息/)
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
          // 外部連結只准兩個去處：我們自己的 YouTube 頻道，以及自家商城。
          // 商城網址一律取自 SHOP_URL 這個唯一來源——2026-09-27 商城換站
          // （h5.smtengo.com → shoph5.smtengo.com）時，硬編在測試裡的網址
          // 會變成第二個真相，改一邊漏一邊。
          const ok = routes.includes(path)
            || /^https:\/\/(www\.)?youtube\.com\//.test(href)
            || href === SHOP_URL
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

describe('shop detail questions ask the Shop KB first', () => {
  const shopFirst = (q: string) => {
    const query = expandQuery(normalizeQuery(q))
    const best = rankKnowledge(kb as any, query)[0]
    return prefersShopKnowledge(query, best ? (best.item.id ?? null) : null)
  }

  it('sends refund, stock, card and franchise questions to Shop even when shop-platform matched', () => {
    for (const q of [
      '商城退款多久會入帳',
      '商城缺貨怎麼辦',
      '商城的到貨通知怎麼用',
      '刷卡要銀行驗證但視窗沒出來',
      '訂單還沒付款可以繼續付款嗎',
      '商城可以用 ATM 付款嗎',
      '加盟店的撥款匯到哪裡',
      'how long does a shop refund take',
    ]) expect(shopFirst(q), q).toBe(true)
  })

  it('sends stock, shipping and explicitly named shop app questions to Shop', () => {
    for (const q of [
      '商品缺貨什麼時候補',
      '賣完了可以通知我嗎',
      '運費多少',
      '商城有App嗎',
      '商城App在哪裡下載',
      'iPhone可以用商城App嗎',
      'enGo Shop app',
      'is this sold out',
    ]) expect(shopFirst(q), q).toBe(true)
  })

  it('sends shop payment, shipping and order-change wording to Shop (re-probe after Shop #535)', () => {
    for (const q of [
      '滿多少免運',
      '有LINE Pay嗎',
      '可以用街口付款嗎',
      '可以貨到付款嗎',
      '付款後可以改地址嗎',
      '重複扣款怎麼辦',
      '商品保固多久',
      '商城客服電話多少',
      '商城帳號怎麼刪除',
      '商城怎麼改手機號碼',
    ]) expect(shopFirst(q), q).toBe(true)
  })

  it('keeps enGo service, warranty, hours and account questions local unless the shop is named', () => {
    for (const q of ['客服電話多少', '客服時間', '營業時間', '設備保固多久', '帳號怎麼刪除', '怎麼改手機號碼', '公司地址'])
      expect(shopFirst(q), q).toBe(false)
  })

  it('keeps shared app and community words local without a shop detail question', () => {
    for (const q of [
      'App在哪裡下載',
      'iPhone 可以用嗎',
      'Android 平板可以用嗎',
      '智管家商城是什麼',
      '公告在哪裡看',
      '社區 通知',
    ]) expect(shopFirst(q), q).toBe(false)
  })

  it('ranks app downloads above address while keeping location questions on address', () => {
    for (const q of ['App在哪裡下載', 'app要去哪下載'])
      expect(top(q).item.id, q).toBe('app-download')
    for (const q of ['公司在哪裡', '地址在哪'])
      expect(top(q).item.id, q).toBe('address')
  })

  it('keeps the local answer for what-is-the-shop and enGo HMS questions', () => {
    expect(top('智管家商城是什麼').item.id).toBe('shop-platform')
    for (const q of ['智管家商城是什麼', '安購商城還在嗎', '公告在哪裡看', '斷網可以用嗎', '平面圖可以看嗎'])
      expect(shopFirst(q), q).toBe(false)
  })

  it('treats shared words like 庫存 and 通知 as HMS unless the shop is named', () => {
    expect(prefersShopKnowledge('倉儲 庫存怎麼記', 'howto-warehouse')).toBe(false)
    expect(prefersShopKnowledge('商城 庫存', 'howto-warehouse')).toBe(true)
    expect(prefersShopKnowledge('社區 通知', 'howto-community')).toBe(false)
  })

  it('keeps HMS inventory and parcel questions that share shop words local (review 2026-11-08)', () => {
    // 庫存管理 reminders use 補貨/缺貨; building parcels use 到貨. Only the shop named
    // (商城, 商品…) or a sold-out word sends them to Shop.
    for (const q of ['濾芯快用完要補貨怎麼設提醒', '庫存缺貨提醒怎麼設', '包裹到貨會通知我嗎'])
      expect(shopFirst(q), q).toBe(false)
    expect(shopFirst('商品缺貨什麼時候補')).toBe(true)
  })

  it('matches English shop terms as whole words only', () => {
    // 'app' must not fire on Apple, 'ios' on studios, 'order' on border.
    expect(prefersShopKnowledge('商城有賣apple充電器嗎', 'homekit-siri')).toBe(false)
    expect(prefersShopKnowledge('shop studios', 'cases')).toBe(false)
    expect(prefersShopKnowledge('border 商城', 'cases')).toBe(false)
    expect(prefersShopKnowledge('商城app在哪裡下載', 'app-download')).toBe(true)
  })

  it('gives the store-name boost only to app questions', () => {
    expect(expandQuery(normalizeQuery('App在哪裡下載'))).toContain('google play')
    expect(expandQuery(normalizeQuery('使用手冊在哪裡下載'))).not.toContain('google play')
  })

  it('tells visitors about the Android enGo Shop app without claiming an iPhone listing', () => {
    const zh = (kb as any).general.find((i: any) => i.id === 'shop-platform').answer.zh as string
    expect(zh).toContain('play.google.com/store/apps/details?id=com.smtengo.engo.shop')
    expect(zh).toContain('iPhone 版即將推出')
    expect(zh).not.toContain('apps.apple.com')
  })
})
