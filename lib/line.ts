// LINE Messaging API helpers for the 智管家 official account bot.
//
// Pure functions (signature check, language detection, markdown → LINE text)
// live here so they can be unit-tested; the network calls are thin wrappers
// around fetch. The bot answers from the same knowledge base as the website
// chatbot (see lib/chatbot-answer.ts), so keeping KB-001 in sync on the site
// keeps LINE in sync too.

import { createHmac, timingSafeEqual } from 'node:crypto'

export const SITE_ORIGIN = 'https://www.smtengo.com'
export const LINE_REPLY_URL = 'https://api.line.me/v2/bot/message/reply'
/** LINE rejects text messages above 5000 characters. Keep a margin for the ellipsis. */
export const LINE_TEXT_LIMIT = 4800

export type LineLocale = 'zh' | 'en' | 'ja' | 'zhCN'

/**
 * LINE signs every webhook body with HMAC-SHA256(channel secret) and sends the
 * base64 digest in `x-line-signature`. Compare in constant time.
 */
export function verifyLineSignature(rawBody: string | Buffer, signature: string | undefined, secret: string | undefined): boolean {
  if (!signature || !secret) return false
  const expected = Buffer.from(createHmac('sha256', secret).update(rawBody).digest('base64'))
  const given = Buffer.from(signature)
  return expected.length === given.length && timingSafeEqual(expected, given)
}

// Characters that only exist in the simplified script. Traditional text never
// contains them, so one hit is enough to pick zhCN.
const SIMPLIFIED_ONLY = /[这说们时间电门开关网络设备联动为应无与谁请问对么样护]/

/** Pick the answer language from the script the person typed in. */
export function detectLocale(text: string): LineLocale {
  if (/[぀-ヿ]/.test(text)) return 'ja'
  if (/[一-鿿]/.test(text)) return SIMPLIFIED_ONLY.test(text) ? 'zhCN' : 'zh'
  // Latin letters and nothing CJK: English. Anything else falls back to zh.
  return /[a-z]/i.test(text) && !/[^\x00-\x7f]/.test(text) ? 'en' : 'zh'
}

/** Absolute URL for a site-relative link so it is tappable inside LINE. */
export const absoluteUrl = (href: string, origin = SITE_ORIGIN): string =>
  /^https?:\/\//.test(href) ? href : `${origin}${href.startsWith('/') ? '' : '/'}${href}`

/**
 * The knowledge base is written in the website chatbot's markdown-ish dialect
 * (bold, links, horizontal rules). LINE text messages are plain, so flatten it:
 * links become "label: url" (LINE auto-links bare URLs), bold markers go, rules
 * become a blank line.
 */
export function toLineText(markdown: string, locale: LineLocale = 'zh', origin = SITE_ORIGIN): string {
  if (!markdown) return ''
  const colon = locale === 'en' ? ': ' : '：'
  let out = markdown
    .replace(/\r\n/g, '\n')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) =>
      /^(https?:\/\/|\/)/.test(href) ? `${label}${colon}${absoluteUrl(href, origin)}` : label
    )
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/^\s*---+\s*$/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  if (out.length > LINE_TEXT_LIMIT) out = out.slice(0, LINE_TEXT_LIMIT).trimEnd() + '…'
  return out
}

export interface LineTextMessage { type: 'text'; text: string }

/** Reply to a webhook event. Returns the HTTP status LINE answered with. */
export async function replyToLine(replyToken: string, texts: string[], accessToken: string, fetchImpl: typeof fetch = fetch): Promise<number> {
  const messages: LineTextMessage[] = texts
    .filter((t) => t && t.trim())
    .slice(0, 5)
    .map((text) => ({ type: 'text', text }))
  if (!messages.length) return 0
  const res = await fetchImpl(LINE_REPLY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ replyToken, messages }),
  })
  if (!res.ok) {
    let detail = ''
    try { detail = (await res.text()).slice(0, 300) } catch { /* ignore */ }
    console.error('LINE reply failed', res.status, detail)
  }
  return res.status
}
