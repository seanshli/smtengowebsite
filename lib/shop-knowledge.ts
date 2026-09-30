// 商城問題的後援：問答與 LINE 在本地知識庫沒命中時，改問 Shop 的公開知識 API。
//
// 為什麼不把商城內容複製一份進 knowledge_base.json：
// Shop 的 docs/KNOWLEDGE_API.md 明講這支端點就是為官網準備的，目的正是
// 「without keeping a second copy of the content ... an answer on the 官網
// cannot drift from what a customer is told inside the shop」。複製過來就是
// 再造一個會漂的真相——而商城的退貨、鑑賞期這類內容帶法條，漂掉會出事。
//
// 2026-09-30 實測：公開、免金鑰、`access-control-allow-origin: *`（瀏覽器可直呼，
// 不必經我們自己的 /api 代理）。語意比對連英文問句都接得住
// （"how do I cancel my subscription" → subscription-pause-cancel），
// **但內容只有繁中**，所以非中文語系要加一句說明，不能假裝是原生譯文。

export const SHOP_KNOWLEDGE_ENDPOINT = 'https://shoph5.smtengo.com/api/knowledge/ask'

export interface ShopAnswer {
  slug: string
  title: string
  category: string
  excerpt: string
  articleUrl?: string
  actions?: Array<{ label: string; url: string }>
}

/** 非中文語系的提示：內容是繁中，附上原文連結讓對方自己看。 */
const ZH_ONLY_NOTE: Record<string, string> = {
  en: '(The shop help centre is currently in Traditional Chinese.)',
  ja: '（ショップのヘルプは現在、繁体字中国語のみです。）',
  fr: "(Le centre d'aide de la boutique est actuellement en chinois traditionnel.)",
  es: '(El centro de ayuda de la tienda está actualmente en chino tradicional.)',
}

/**
 * 問 Shop 的知識庫。**任何失敗都回 null**，呼叫端維持原本的「找不到」流程——
 * 客服對話等不起，也不該因為別的服務掛了就整個壞掉。
 */
export async function askShopKnowledge(
  question: string,
  opts: { locale?: string; limit?: number; timeoutMs?: number; fetchImpl?: typeof fetch } = {},
): Promise<{ text: string; slugs: string[] } | null> {
  const q = (question || '').trim()
  if (!q) return null
  const { locale = 'zh', limit = 2, timeoutMs = 4000, fetchImpl = fetch } = opts

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    // API 上限 200 字；超過就截，不要讓對方回 400。
    const url = `${SHOP_KNOWLEDGE_ENDPOINT}?q=${encodeURIComponent(q.slice(0, 200))}&limit=${limit}`
    const res = await fetchImpl(url, { signal: ctrl.signal, headers: { accept: 'application/json' } })
    if (!res.ok) return null
    const data: any = await res.json()
    const answers: ShopAnswer[] = Array.isArray(data?.answers) ? data.answers : []
    if (!answers.length) return null

    const parts = answers.map((a) => {
      let s = `**${a.title}**\n\n${a.excerpt}`
      if (a.articleUrl) s += `\n\n${a.articleUrl}`
      return s
    })
    const note = locale !== 'zh' && locale !== 'zhCN' ? ZH_ONLY_NOTE[locale] : undefined
    return {
      text: (note ? note + '\n\n' : '') + parts.join('\n\n---\n\n'),
      slugs: answers.map((a) => a.slug),
    }
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}
