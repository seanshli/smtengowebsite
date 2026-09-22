#!/usr/bin/env node
// 產生 public/knowledge-base.md —— 給機器（網站問答機器人、外部 LLM）抓取的
// 單檔知識庫。
//
// ## 為什麼是產生而不是手寫
//
// 同樣的內容已經存在 src/data/howto.json 與 src/data/faqs.json，網站頁面直接
// 用它們渲染。若另外手寫一份 markdown，兩邊遲早分岔——而且分岔時外表看不出來，
// 機器人會照著舊的答。所以這支從 JSON 產出，由 prebuild 自動跑。
//
// 用法：node scripts/gen-knowledge-md.mjs
// 產物：public/knowledge-base.md（隨 vite 複製進 dist，對外 /knowledge-base.md）

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://www.smtengo.com'
const OUT = resolve(ROOT, 'public/knowledge-base.md')

const read = (p) => JSON.parse(readFileSync(resolve(ROOT, p), 'utf-8'))
const howto = read('src/data/howto.json')
const faqs = read('src/data/faqs.json')

// 圖片在頁面上是站內絕對路徑；抓取者可能不在本站，所以補上網域。
const abs = (u) => (u && u.startsWith('/') ? SITE + u : u)

const L = ['zh', 'en']
const LABEL = { zh: '繁體中文', en: 'English' }

const out = []
const w = (s = '') => out.push(s)

w('# enGo 知識庫與操作指南 / enGo Knowledge Base & How-to Guides')
w()
w('| | |')
w('|---|---|')
w(`| 產生時間 Generated | ${new Date().toISOString().slice(0, 10)} |`)
w(`| 對應 App 版本 App version | ${howto.meta.generatedFor.zh} / ${howto.meta.generatedFor.en} |`)
w(`| 內容最後查核 Content verified | ${howto.meta.updated} |`)
w(`| 正式網址 Canonical | ${SITE}/knowledge-base.md |`)
w(`| 對應頁面 Rendered page | ${SITE}/tutorial#howto |`)
w(`| 產生方式 Source of truth | src/data/howto.json、src/data/faqs.json（由 scripts/gen-knowledge-md.mjs 產生，請勿手改本檔） |`)
w()
w('## 給機器的使用規則 / Rules for machines')
w()
w('1. **只用本檔的內容回答。** 本檔沒寫的，不要推論、不要類比其他品牌的智慧家庭產品。')
w('2. **不確定就轉人工**，並附客服資訊（見文末）。「這部分我幫您轉給專人確認」比猜錯好。')
w('3. 語言跟隨提問者。中文一律用**台灣繁體中文**。')
w('4. 標記「圖待補 / screenshots pending」的模組，其文字步驟仍為現行有效；只是尚無現行版本的截圖。')
w('5. 本檔的截圖皆為實機擷取，未經修圖。')
w()
w('1. **Answer only from this document.** Do not infer, and do not draw analogies to other smart-home brands.')
w('2. **Escalate when unsure**, with the contact details at the end.')
w('3. Match the asker’s language. Chinese replies use Traditional Chinese (Taiwan).')
w('4. Modules marked "screenshots pending" still have valid written steps; only the screenshots are missing.')
w('5. All screenshots are captured from a real device and are not retouched.')
w()
w('---')
w()

// ── 操作指南
w('# Part 1 — 操作指南（依功能模組）/ How-to Guides by Module')
w()
w(`> ${howto.meta.note.zh}`)
w('>')
w(`> ${howto.meta.note.en}`)
w()
for (const m of howto.modules) {
  w(`## ${m.id} — ${m.title.zh} / ${m.title.en}`)
  w()
  w(`- 深連結 Deep link: ${SITE}/tutorial#howto-${m.id}`)
  if (m.imagesPending) w('- ⚠ 圖待補 / screenshots pending')
  w()
  for (const lang of L) {
    w(`### ${LABEL[lang]}`)
    w()
    w(m.summary[lang])
    w()
    m.steps.forEach((s, i) => {
      w(`**${i + 1}. ${s.title[lang]}**`)
      w()
      w(s.body[lang])
      w()
      if (s.image) {
        w(`![${s.title[lang]}](${abs(s.image)})`)
        w()
      }
    })
    if (m.tips?.length) {
      w(lang === 'zh' ? '**小提醒**' : '**Tips**')
      w()
      for (const t of m.tips) w(`- ${t[lang]}`)
      w()
    }
  }
  w('---')
  w()
}

// ── FAQ
w('# Part 2 — 常見問題 / FAQ')
w()
w(`共 ${faqs.length} 題。原始資料含 zh / zhCN / en / fr / ja / es 六語系；本檔僅列繁中與英文，其餘語系請取 \`src/data/faqs.json\`。`)
w()
const byCat = new Map()
for (const f of faqs) {
  if (!byCat.has(f.category)) byCat.set(f.category, [])
  byCat.get(f.category).push(f)
}
const CAT = {
  setup: '安裝設定 / Setup', features: '功能 / Features', products: '產品 / Products',
  services: '服務 / Services', safety: '安全 / Safety', energy: '節能 / Energy',
  maintenance: '維護 / Maintenance', warranty: '保固 / Warranty',
  compatibility: '相容性 / Compatibility', tutorials: '教學 / Tutorials',
}
for (const [cat, items] of byCat) {
  w(`## ${CAT[cat] ?? cat}`)
  w()
  for (const f of items) {
    w(`### #${f.id} ${f.question.zh}`)
    w()
    w(f.answer.zh)
    w()
    w(`**EN — ${f.question.en}**`)
    w()
    w(f.answer.en)
    w()
  }
  w('---')
  w()
}

// ── 客服
w('# 客服與轉接 / Contact & Escalation')
w()
w('| 管道 Channel | 資訊 |')
w('|---|---|')
w('| 電話 Phone | **02-27510218**（+886-2-27510218） |')
w('| 服務時間 Hours | 週一至週五 09:00–18:00（Mon–Fri, UTC+8） |')
w(`| 網站 Web | ${SITE}/contact |`)
w()
w('> 產品頁是 `/product`（**單數**）。`/products` 不存在，會 404。')
w()

writeFileSync(OUT, out.join('\n'), 'utf-8')
const kb = (Buffer.byteLength(out.join('\n'), 'utf-8') / 1024).toFixed(1)
console.log(`✅ public/knowledge-base.md  ${kb} KB  `
  + `(${howto.modules.length} modules / ${howto.modules.reduce((n, m) => n + m.steps.length, 0)} steps / ${faqs.length} FAQs)`)
