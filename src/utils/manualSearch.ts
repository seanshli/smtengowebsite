// Client-side search over the 商城使用手冊 index (src/data/manual-index.json,
// built by scripts/gen-manual-index.mjs). Pure so it can be tested without
// mounting /tutorial.

export interface ManualSection { id: string; level: number; heading: string; text: string }
export interface ManualEntry {
  id: string
  file: string
  title: Record<string, string>
  html: string
  sections: ManualSection[]
}
export interface ManualHit {
  manualId: string
  manualTitle: Record<string, string>
  heading: string
  url: string
  snippet: string
  score: number
}

const CJK = /[㐀-鿿]/

/** Query terms: whitespace-separated; a long CJK run also contributes its 2-char pieces. */
export function queryTerms(query: string): { whole: string[]; parts: string[] } {
  const whole = query
    .toLowerCase()
    .replace(/[？?！!，,。、；;：:()（）「」『』"'`]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
  const parts: string[] = []
  for (const w of whole) {
    if (CJK.test(w) && w.length > 2) for (let i = 0; i + 2 <= w.length; i++) parts.push(w.slice(i, i + 2))
  }
  return { whole, parts }
}

const snippetAround = (text: string, term: string | undefined, width = 70) => {
  const i = term ? text.toLowerCase().indexOf(term) : -1
  if (i < 0) return text.slice(0, width * 2) + (text.length > width * 2 ? '…' : '')
  const start = Math.max(0, i - width)
  return (start > 0 ? '…' : '') + text.slice(start, i + width) + (i + width < text.length ? '…' : '')
}

/**
 * Rank manual sections for a question. A whole term in the heading counts
 * most, in the text less; 2-char pieces of a long Chinese phrase give partial
 * credit so 「到貨通知怎麼用」 still finds the 到貨通知 section.
 */
export function searchManuals(manuals: ManualEntry[], query: string, limit = 8): ManualHit[] {
  const { whole, parts } = queryTerms(query)
  if (!whole.length) return []
  const hits: ManualHit[] = []
  for (const m of manuals) {
    for (const s of m.sections) {
      const head = s.heading.toLowerCase()
      const text = s.text.toLowerCase()
      let score = 0
      let firstMatch: string | undefined
      for (const t of whole) {
        if (head.includes(t)) { score += 6; firstMatch ??= t }
        if (text.includes(t)) { score += 3; firstMatch ??= t }
      }
      if (parts.length) {
        // A piece in the heading counts double: headings name the topic.
        let partScore = 0
        for (const p of parts) {
          if (head.includes(p)) partScore += 2
          else if (text.includes(p)) partScore += 1
          else continue
          firstMatch ??= p
        }
        score += (partScore / parts.length) * 3
      }
      // Partial 2-char overlap alone is noise unless most of the phrase is there.
      if (score >= 2) {
        hits.push({
          manualId: m.id,
          manualTitle: m.title,
          heading: s.heading,
          url: `${m.html}#${encodeURIComponent(s.id)}`,
          snippet: snippetAround(s.text, firstMatch),
          score,
        })
      }
    }
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit)
}
