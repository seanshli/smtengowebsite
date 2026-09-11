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
  '開門': ['營業', 'open', 'hours'],
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
  '下載': ['app', 'download'],
  '下载': ['app', 'download'],
  '哪裡下載': ['app', 'download'],
  // KB-001 §8 data — '在哪' alone routes to the address entry, so be specific
  '存在哪': ['資料儲存位置', 'privacy'],
  '國外': ['資料儲存位置', 'privacy'],
  '境外': ['資料儲存位置', 'privacy'],
  // KB-001 §8 account
  '搬家': ['登出', '換住戶'],
  '搬走': ['登出', '換住戶'],
  '退租': ['登出', '換住戶'],
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

export const KB_CATEGORIES = ['general', 'catalog', 'products', 'packages', 'tutorials', 'cases', 'youtube', 'faqs'] as const

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
