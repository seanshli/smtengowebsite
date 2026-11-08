// Chatbot intent matching — pure functions over knowledge_base.json so the
// KB can be tested without mounting the component (see chatbotMatch.test.ts).

// --- Intent matching helpers ---------------------------------------------
// Synonyms: maps common user phrasings to canonical KB keywords. Keeps the
// KB keyword arrays lean while still catching how real people actually ask.
export const SYNONYMS: Record<string, string[]> = {
  // Pricing
  '多少錢': ['價格', '費用', 'price'],
  '多少': ['價格', 'price'],
  '費用': ['價格', 'pricing'],
  '報價': ['價格', 'quote'],
  'cost': ['price', 'pricing'],
  'how much': ['price', 'cost'],
  'cuanto': ['price', 'precio'],
  // Hours
  '幾點': ['hours', '時間', '營業'],
  '幾點開門': ['營業', 'open', 'hours'],
  '開門時間': ['營業', 'open', 'hours'],
  '什麼時候': ['when', 'hours'],
  'when open': ['hours', 'open'],
  // Location
  '怎麼去': ['address', '地址'],
  '在哪': ['address', '地址', 'location'],
  '怎麼走': ['address', '地址'],
  // LINE
  '加好友': ['line', 'add'],
  '加line': ['line', 'add', '好友'],
  '加入line': ['line'],
  // Shop (KB-001 A.15) — 「商城在哪」 must reach the store entry, not the office address
  '商城在哪': ['智管家商城', '商城網址', '安購商城', '線上購物', '買東西', '網購', '商城', '購物'],
  '商城哪裡': ['智管家商城', '商城網址', '安購商城', '線上購物', '買東西', '網購', '商城', '購物'],
  '哪裡買': ['智管家商城', '商城網址', '安購商城', '線上購物', '買東西', '網購', '商城', '購物'],
  // Product discovery
  '買什麼': ['product', 'packages'],
  '有什麼產品': ['product', 'catalog'],
  '推薦': ['product', 'packages', 'recommend'],
  // Contact
  '找人': ['contact', '客服'],
  '怎麼聯絡': ['contact', '聯絡'],
  'reach you': ['contact'],
  // KB-001 §8 network — how people actually ask about "offline"
  '斷網': ['網路', 'offline'],
  '断网': ['網路', 'offline'],
  '沒網路': ['網路', 'offline'],
  '沒有網路': ['網路', 'offline'],
  '斷線': ['網路', 'offline'],
  'no internet': ['offline', '網路'],
  'no wifi': ['offline', '網路'],
  // KB-001 §4 voice — privacy phrasings
  '語音': ['語音操作'],
  '语音': ['語音操作'],
  'voice': ['語音操作'],
  '偷聽': ['語音', '錄音'],
  '會不會錄音': ['語音', '錄音'],
  '監聽': ['語音', '錄音'],
  // KB-001 §3 door lock
  '密碼鎖': ['門鎖'],
  '指紋鎖': ['門鎖'],
  '電子鎖': ['門鎖'],
  'smart lock': ['door lock'],
  // KB-001 §2 / §1 app
  // 「App在哪裡下載」 also contains 在哪 (→ address, 19 points) and answered with the
  // office address (2026-11-08 probe); the store names lift app-download above it.
  '下載': ['app', 'download', 'app store', 'google play'],
  '下载': ['app', 'download', 'app store', 'google play'],
  '哪裡下載': ['app', 'download'],
  // how-to (KB-001 §9.2.1) — 「公告在哪」 must reach the community module, not the office address
  '公告在哪': ['社區公告', '公布欄怎麼看'],
  '公告哪裡': ['社區公告', '公布欄怎麼看'],
  // KB-001 §8 data — '在哪' alone routes to the address entry, so be specific
  '存在哪': ['資料儲存位置', 'privacy'],
  '國外': ['資料儲存位置', 'privacy'],
  '境外': ['資料儲存位置', 'privacy'],
  // KB-001 §8 account
  '搬家': ['登出', '換住戶'],
  '搬走': ['登出', '換住戶'],
  '退租': ['登出', '換住戶'],
}

// --- Shop detail questions go to the Shop KB first ---------------------------
// The local `shop-platform` entry answers "what is the shop"; its keywords
// (商城, shop, 訂閱…) also catch detail questions whose answer lives only in
// Shop's own KB (lib/shop-knowledge.ts): refunds, stock, card payment, 3D
// verification, 到貨通知, 加盟店 payouts. Those ask Shop first and keep the
// local answer as the fallback when Shop has nothing or is down.
// Never about enGo HMS, so they always prefer the shop:
const SHOP_ONLY_TERMS = [
  '退款', '退貨', '退货', '鑑賞期', '鉴赏期', '到貨通知', '到货通知', '接單生產', '接单生产',
  '繼續付款', '继续付款', '待付款', '刷卡', '3d驗證', '3d验证', '3d 驗證', '銀行驗證', '银行验证',
  '購物車', '购物车', '結帳', '结帐', '结账', '加盟店', '直營店', '直营店', '撥款', '拨款',
  // Stock and shipping words only ever mean the shop (HMS inventory says 低庫存),
  // yet without the shop named they lost to 營業時間 / 方案 entries (2026-11-08 probe:
  // 「商品缺貨什麼時候補」→ hours, 「運費多少」→ packages, 「賣完了可以通知我嗎」→ community).
  '缺貨', '缺货', '補貨', '补货', '賣完', '卖完', '售完', '到貨', '到货', '運費', '运费',
  'engo shop',
  'refund', 'checkout', 'restock', 'out of stock', 'sold out', 'shipping fee',
]
// Shop topics that can also mean an enGo HMS feature (home inventory, building
// notices), so they prefer the shop only when nothing else local matched or the
// question names the shop:
const SHOP_DETAIL_TERMS = [
  '付款', '信用卡', '訂單', '订单', '下單', '下单', '庫存', '库存',
  '發票', '发票', '載具', '團購', '团购', '加盟', '通知',
  // App questions mean the enGo智慧管家 app unless the shop is named; with 商城 they
  // mean the separate enGo Shop app (Shop article shop-app-download: Android live,
  // iPhone coming). Before this, 「商城App在哪裡下載」 answered with the office address.
  'app', '下載', '下载', 'iphone', 'android', 'ios',
  'payment', 'credit card', 'order', 'invoice',
]
const SHOP_CONTEXT_TERMS = ['商城', 'shop', '安購', '安购']

/** True when a (normalized) question should be answered from Shop's KB before the local one. */
export const prefersShopKnowledge = (query: string, bestLocalId: string | null): boolean => {
  const q = query.toLowerCase()
  if (SHOP_ONLY_TERMS.some((t) => q.includes(t))) return true
  if (!SHOP_DETAIL_TERMS.some((t) => q.includes(t))) return false
  return bestLocalId === null || bestLocalId === 'shop-platform' || SHOP_CONTEXT_TERMS.some((t) => q.includes(t))
}

// Normalize a query: lowercase, strip punctuation, collapse whitespace,
// convert full-width digits to half-width.
export const normalizeQuery = (q: string): string => {
  return q
    .toLowerCase()
    .replace(/[？?！!，,。、；;：:()\[\]【】「」『』"'`~]/g, ' ')
    .replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xFEE0))
    .replace(/\s+/g, ' ')
    .trim()
}

// Expand a query with synonyms: appends canonical terms so downstream matching
// can find KB entries keyed on the canonical form.
export const expandQuery = (q: string): string => {
  let expanded = q
  for (const [phrase, canon] of Object.entries(SYNONYMS)) {
    if (q.includes(phrase.toLowerCase())) {
      expanded += ' ' + canon.join(' ')
    }
  }
  return expanded
}

// Score an item against a (normalized+expanded) query. Longer keywords score
// higher — they're more specific. Also score weak reverse match (keyword
// contains a short query) at lower weight.
export const scoreItem = (query: string, keywords: string[]): number => {
  let score = 0
  for (const k of keywords) {
    const kw = k.toLowerCase()
    if (!kw) continue
    if (query.includes(kw)) {
      // Longer keyword = more specific hit. Clamp so single-char words still
      // score something but can't dominate.
      score += Math.max(2, Math.min(kw.length, 12))
    } else if (kw.length >= 4 && query.length >= 2 && kw.includes(query)) {
      // Reverse partial match for short user queries like "line"
      score += 1
    }
  }
  return score
}

export const KB_CATEGORIES = ['general', 'catalog', 'products', 'packages', 'tutorials', 'cases', 'youtube', 'faqs', 'howto'] as const

export interface Scored { item: any; cat: string; score: number }

// Score every item across every category and return them best-first.
export const rankKnowledge = (kb: Record<string, any[] | undefined>, query: string): Scored[] => {
  const scored: Scored[] = []
  for (const cat of KB_CATEGORIES) {
    const items = kb[cat]
    if (!items) continue
    for (const item of items) {
      const score = scoreItem(query, item.keywords || [])
      if (score > 0) scored.push({ item, cat, score })
    }
  }
  scored.sort((a, b) => b.score - a.score)
  return scored
}
