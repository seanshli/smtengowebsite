// 產生 src/data/manual-index.json —— /tutorial「商城使用手冊」搜尋用的索引。
//
// 手冊本體在 Shop repo（docs/user-guide），建置出的單檔 HTML／PDF 複製到
// public/manuals/ 後執行本腳本：逐一讀 HTML，把每個 h2／h3 標題與其下的文字
// 切成一節（含 pandoc 產生的錨點 id），搜尋結果直接連到 /manuals/<檔>.html#<id>。
// 索引與 HTML 一起提交；scripts/gen-manual-index.test.ts 會檢查兩者一致。
//
// 用法：node scripts/gen-manual-index.mjs

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'src/data/manual-index.json')

// 對外公開的三本手冊（平台端為內部文件，不放官網）。
export const MANUALS = [
  {
    id: 'customer',
    file: 'shop-customer',
    title: { zh: '顧客端使用手冊', en: 'Customer manual' },
    audience: { zh: '住戶與一般買家：註冊、購物、付款、訂閱、退款、通知', en: 'Residents and shoppers: sign-up, shopping, payment, subscriptions, refunds, notifications' },
  },
  {
    id: 'merchant',
    file: 'shop-merchant',
    title: { zh: '商家端使用手冊', en: 'Merchant manual' },
    audience: { zh: '商家與品牌總部：商品、庫存、訂單、售後、結算撥款、團隊權限', en: 'Merchants and brand HQ: products, stock, orders, after-sales, settlement, team roles' },
  },
  {
    id: 'franchise',
    file: 'shop-franchise',
    title: { zh: '加盟店端使用手冊', en: 'Franchise store manual' },
    audience: { zh: '加盟店負責人與財務：加盟主資料、銀行帳戶、撥款、退款歸屬', en: 'Franchise owners and finance staff: franchisee details, bank account, payouts, refunds' },
  },
]

const SECTION_TEXT_MAX = 700

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')

const toText = (html) =>
  decode(
    html
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<img[^>]*>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    // Inline tags leave spaces around CJK words (「 登入 」); drop those.
    .replace(/ (?=[\u3000-\u303f\u4e00-\u9fff\uff00-\uffef])|(?<=[\u3000-\u303f\u4e00-\u9fff\uff00-\uffef]) /g, '')
    .trim()

/** Split one pandoc HTML document into {id, level, heading, text} sections. */
export function sectionsFromHtml(html) {
  const body = (/<body[^>]*>([\s\S]*)<\/body>/i.exec(html) || [undefined, html])[1]
    .replace(/<footer class="doc-meta">[\s\S]*?<\/footer>/i, '')
  const re = /<h([23])\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/gi
  const heads = []
  let m
  while ((m = re.exec(body))) heads.push({ level: Number(m[1]), id: m[2], heading: toText(m[3]), start: m.index, end: re.lastIndex })
  return heads
    .map((h, i) => {
      const text = toText(body.slice(h.end, i + 1 < heads.length ? heads[i + 1].start : body.length))
      return { id: h.id, level: h.level, heading: h.heading, text: text.slice(0, SECTION_TEXT_MAX) }
    })
    // 修訂紀錄與目錄不是內容，不進索引。
    .filter((s) => !/^(文件修訂紀錄|目錄)$/.test(s.heading))
}

/** "智管家商城_使用手冊_顧客端 · v2.0 · 2026 年 11 月" from the doc-meta footer. */
export function docMetaFromHtml(html) {
  const m = /<footer class="doc-meta">([\s\S]*?)<\/footer>/i.exec(html)
  // Keep the label verbatim ("… · v2.0 · 2026 年 11 月"): no CJK space squashing.
  return m ? decode(m[1].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim() : null
}

export function buildIndex(readHtml) {
  return MANUALS.map((man) => {
    const html = readHtml(man.file)
    const meta = docMetaFromHtml(html)
    const ver = meta ? /v(\d+(?:\.\d+)*)/.exec(meta) : null
    return {
      ...man,
      html: `/manuals/${man.file}.html`,
      pdf: `/manuals/${man.file}.pdf`,
      docMeta: meta,
      version: ver ? ver[1] : null,
      sections: sectionsFromHtml(html),
    }
  })
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const index = buildIndex((file) => readFileSync(resolve(ROOT, 'public/manuals', `${file}.html`), 'utf8'))
  writeFileSync(OUT, JSON.stringify({ manuals: index }, null, 2) + '\n')
  for (const m of index) console.log(`✅ ${m.file}: v${m.version} · ${m.sections.length} sections`)
}
