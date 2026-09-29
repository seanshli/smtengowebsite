import { describe, it, expect, vi } from 'vitest'
import kb from '../src/data/knowledge_base.json'
import { composeAnswer } from './chatbot-answer'
import { LINE_STRINGS, shouldAnswer, cleanQuestion, processLineEvents, type LineEvent } from './line-bot'
import { SHOP_URL } from '../src/utils/shopUrl'

const zh = LINE_STRINGS.zh
const ask = (q: string, locale = 'zh') => composeAnswer(kb as any, q, locale, LINE_STRINGS[locale as 'zh'])

describe('composeAnswer gives LINE the same answers as the website chatbot', () => {
  it('routes KB-001 questions to the same entries the site test pins', () => {
    expect(ask('斷網可以用嗎').id).toBe('network-required')
    expect(ask('智管家商城是什麼').id).toBe('shop-platform')
    expect(ask('怎麼新增房間').id).toBe('howto-household')
    expect(ask('平面圖可以看嗎').id).toBe('floorplan-inventory')
  })

  it('carries the shop facts the KB-001 A.15 wording requires', () => {
    const a = ask('安購商城還在嗎')
    expect(a.matched).toBe(true)
    expect(a.text).toContain(SHOP_URL)
    expect(a.text).toContain('新版本')
    expect(a.text).not.toMatch(/合併|轉移|收購/)
  })

  it('marks the floor plan as in development, never as available', () => {
    const a = ask('平面圖即時視圖怎麼用')
    expect(a.text).toContain('開發中')
  })

  it('answers in the language of the question when the entry has it', () => {
    const en = ask('does it work offline', 'en')
    expect(en.matched).toBe(true)
    expect(en.text).toMatch(/[a-z]{4,}/i)
    expect(en.text).not.toContain('斷網')
  })

  it('falls back to the escalation text when nothing matches', () => {
    const a = ask('qwertyuiop zxcvbnm')
    expect(a.matched).toBe(false)
    expect(a.text).toBe(zh.no_match)
    expect(zh.no_match).toContain('02-27510218')
  })

  it('handles link-only and video entries with a tappable URL', () => {
    const video = composeAnswer({ youtube: [{ title: '平板系統介紹', keywords: ['平板介紹'], url: 'https://www.youtube.com/watch?v=abc' }] }, '平板介紹', 'zh', zh)
    expect(video.text).toBe(`${zh.found_video} 平板系統介紹\nhttps://www.youtube.com/watch?v=abc`)
    const link = composeAnswer({ faqs: [{ id: 'contact_page', keywords: ['聯絡'], link: '/contact' }] }, '聯絡', 'zh', zh)
    expect(link.text).toBe(`${zh.found_info}\nhttps://www.smtengo.com/contact`)
  })

  it('stitches a close second answer for compound questions, like the site does', () => {
    const mini = {
      general: [
        { id: 'hours', keywords: ['營業'], answer: { zh: '週一至週五 09:00-18:00' } },
        { id: 'address', keywords: ['地址'], answer: { zh: '台北市中山區八德路二段 325 號 3 樓' } },
      ],
    }
    const a = composeAnswer(mini, '營業時間跟地址', 'zh', zh)
    expect(a.matched).toBe(true)
    expect(a.text).toContain('09:00-18:00')
    expect(a.text).toContain('---')
    expect(a.text).toContain('八德路')
  })
})

describe('shouldAnswer', () => {
  const msg = (text: string, source: LineEvent['source'] = { type: 'user' }): LineEvent =>
    ({ type: 'message', replyToken: 'r', source, message: { type: 'text', text } })

  it('answers every text message in a 1:1 chat', () => {
    expect(shouldAnswer(msg('斷網可以用嗎'))).toBe(true)
  })

  it('only answers in groups when addressed', () => {
    expect(shouldAnswer(msg('大家晚安', { type: 'group' }))).toBe(false)
    expect(shouldAnswer(msg('enGo 斷網可以用嗎', { type: 'group' }))).toBe(true)
    expect(shouldAnswer(msg('智管家商城怎麼進', { type: 'room' }))).toBe(true)
    expect(shouldAnswer(msg('@enGo智管家 怎麼配網', { type: 'group' }))).toBe(true)
  })

  it('ignores stickers, images, empty text and events without a reply token', () => {
    expect(shouldAnswer({ type: 'message', replyToken: 'r', message: { type: 'sticker' } })).toBe(false)
    expect(shouldAnswer(msg('   '))).toBe(false)
    expect(shouldAnswer({ type: 'message', message: { type: 'text', text: 'hi' } })).toBe(false)
    expect(shouldAnswer({ type: 'unfollow' })).toBe(false)
  })

  it('strips the leading mention before searching', () => {
    expect(cleanQuestion('@enGo智管家 怎麼配網')).toBe('怎麼配網')
    expect(cleanQuestion('怎麼配網')).toBe('怎麼配網')
  })
})

describe('processLineEvents', () => {
  it('replies with plain text and logs the query plus the answering entry', async () => {
    const reply = vi.fn(async () => 200)
    const log = vi.fn(async () => undefined)
    const events: LineEvent[] = [
      { type: 'message', replyToken: 'r1', source: { type: 'user' }, message: { type: 'text', text: '智管家商城是什麼' } },
    ]
    const out = await processLineEvents(events, { reply, log })
    expect(out).toEqual([{ event: 'message', locale: 'zh', matched: true, id: 'shop-platform', replied: true }])
    const [token, texts] = reply.mock.calls[0] as any
    expect(token).toBe('r1')
    expect(texts[0]).toContain(SHOP_URL)
    expect(texts[0]).not.toMatch(/\*\*|\]\(/)
    expect(log.mock.calls).toEqual([
      ['智管家商城是什麼', 'line-zh', true],
      ['kb:shop-platform', 'line-zh', true],
    ])
  })

  it('welcomes a new follower and skips what it cannot answer', async () => {
    const reply = vi.fn(async () => 200)
    const out = await processLineEvents([
      { type: 'follow', replyToken: 'f' },
      { type: 'message', replyToken: 'x', source: { type: 'group' }, message: { type: 'text', text: '午餐吃什麼' } },
      { type: 'unfollow' },
    ], { reply })
    expect(reply).toHaveBeenCalledTimes(1)
    expect((reply.mock.calls[0] as any)[1][0]).toBe(LINE_STRINGS.zh.welcome)
    expect(out.map((h) => h.replied)).toEqual([true, false, false])
  })

  it('keeps going when one reply fails and never lets logging break the bot', async () => {
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => {})
    const reply = vi.fn(async (token: string) => { if (token === 'bad') throw new Error('boom'); return 200 })
    const log = vi.fn(async () => { throw new Error('db down') })
    const out = await processLineEvents([
      { type: 'message', replyToken: 'bad', source: { type: 'user' }, message: { type: 'text', text: '斷網' } },
      { type: 'message', replyToken: 'ok', source: { type: 'user' }, message: { type: 'text', text: '斷網' } },
    ], { reply, log })
    expect(out[0].replied).toBe(false)
    expect(out[1].replied).toBe(true)
    expect(quiet).toHaveBeenCalled()
    quiet.mockRestore()
  })
})
