// Turns a visitor question into one text answer, using exactly the ranking the
// website chatbot uses (src/utils/chatbotMatch.ts) over the same
// knowledge_base.json. Shared by the LINE bot so both channels give the same
// answer to the same question; the Vue chatbot keeps its own richer rendering
// (video embeds, catalog cards) in src/components/Chatbot.vue.

import { normalizeQuery, expandQuery, rankKnowledge } from '../src/utils/chatbotMatch.js'

export interface AnswerStrings {
  found_video: string
  found_info: string
  specs: string
  features: string
  no_match: string
}

export interface ComposedAnswer {
  /** Markdown-ish text in the chatbot dialect (bold, [label](href)). */
  text: string
  matched: boolean
  id: string | null
  cat: string | null
}

type Localized = Record<string, string> | string | undefined

const pick = (v: Localized, locale: string): string => {
  if (!v) return ''
  if (typeof v === 'string') return v
  return v[locale] || v.zh || Object.values(v)[0] || ''
}

const absolute = (link: string, origin: string) => (link.startsWith('http') ? link : `${origin}${link}`)

export function composeAnswer(
  kb: Record<string, any[] | undefined>,
  rawQuery: string,
  locale: string,
  strings: AnswerStrings,
  origin = 'https://www.smtengo.com',
): ComposedAnswer {
  const query = expandQuery(normalizeQuery(rawQuery || ''))
  const scored = query ? rankKnowledge(kb, query) : []
  if (!scored.length) return { text: strings.no_match, matched: false, id: null, cat: null }

  const best = scored[0]
  const item: any = best.item
  const id: string | null = item.id ?? item.title ?? null

  // Same compound-intent rule as the site: a close second text answer from a
  // different entry is appended ("hours and address" answers both).
  const second = scored.length > 1 &&
    scored[1].item.id !== item.id &&
    scored[1].score >= best.score * 0.6 &&
    item.answer && scored[1].item.answer
    ? scored[1].item
    : null

  let text = ''
  switch (best.cat) {
    case 'youtube':
      text = `${strings.found_video} ${item.title}\n${item.url}`
      break
    case 'catalog':
      text = `**${pick(item.name, locale)}**\n\n${pick(item.description, locale)}\n\n${strings.found_info}\n${origin}/product`
      break
    case 'products': {
      text = `**${pick(item.name, locale)}**\n\n${strings.specs}: ${pick(item.specs, locale)}\n${strings.features}: ${pick(item.features, locale)}`
      if (item.link) text += `\n\n${strings.found_info}\n${absolute(item.link, origin)}`
      break
    }
    default:
      if (item.answer) {
        text = pick(item.answer, locale)
        if (second) text += '\n\n---\n\n' + pick(second.answer, locale)
      } else if (item.link) {
        text = `${strings.found_info}\n${absolute(item.link, origin)}`
      } else {
        return { text: strings.no_match, matched: false, id: null, cat: null }
      }
  }
  return { text, matched: true, id, cat: best.cat }
}
