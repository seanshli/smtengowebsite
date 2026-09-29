import { describe, it, expect, vi } from 'vitest'
import { createHmac } from 'node:crypto'
import { verifyLineSignature, detectLocale, toLineText, absoluteUrl, replyToLine, LINE_TEXT_LIMIT } from './line'

const sign = (body: string, secret: string) => createHmac('sha256', secret).update(body).digest('base64')

describe('verifyLineSignature', () => {
  const secret = 'test-channel-secret'
  const body = '{"events":[]}'

  it('accepts the digest LINE would send', () => {
    expect(verifyLineSignature(body, sign(body, secret), secret)).toBe(true)
    expect(verifyLineSignature(Buffer.from(body), sign(body, secret), secret)).toBe(true)
  })

  it('rejects a tampered body, a wrong secret, or no signature at all', () => {
    expect(verifyLineSignature(body + ' ', sign(body, secret), secret)).toBe(false)
    expect(verifyLineSignature(body, sign(body, 'other'), secret)).toBe(false)
    expect(verifyLineSignature(body, undefined, secret)).toBe(false)
    expect(verifyLineSignature(body, sign(body, secret), '')).toBe(false)
    expect(verifyLineSignature(body, 'short', secret)).toBe(false)
  })
})

describe('detectLocale', () => {
  it('reads the script the person typed in', () => {
    expect(detectLocale('斷網可以用嗎')).toBe('zh')
    expect(detectLocale('断网可以用吗')).toBe('zhCN')
    expect(detectLocale('这个怎么用')).toBe('zhCN')
    expect(detectLocale('works offline?')).toBe('en')
    expect(detectLocale('オフライン時は？')).toBe('ja')
    expect(detectLocale('enGo 平板多少錢')).toBe('zh')
  })

  it('falls back to Traditional Chinese for anything unrecognisable', () => {
    expect(detectLocale('???')).toBe('zh')
    expect(detectLocale('123')).toBe('zh')
  })
})

describe('toLineText', () => {
  it('flattens bold, links and rules into plain text with tappable URLs', () => {
    const md = '**智管家商城**\n\n🔗 [前往智管家商城](https://shoph5.smtengo.com/)\n\n---\n\n🔗 [產品介紹](/product#shop)'
    const out = toLineText(md, 'zh')
    expect(out).toBe('智管家商城\n\n🔗 前往智管家商城：https://shoph5.smtengo.com/\n\n🔗 產品介紹：https://www.smtengo.com/product#shop')
    expect(out).not.toMatch(/\*\*|\]\(|---/)
  })

  it('uses an ASCII colon for English answers', () => {
    expect(toLineText('[Open store](https://shoph5.smtengo.com/)', 'en')).toBe('Open store: https://shoph5.smtengo.com/')
  })

  it('drops link markup whose target is not http(s) or site-relative', () => {
    expect(toLineText('[x](javascript:alert)')).toBe('x')
    expect(toLineText('[x](mailto:a@b.c)')).toBe('x')
  })

  it('strips headings and blockquote markers', () => {
    expect(toLineText('### 標題\n> 引言\n內文')).toBe('標題\n引言\n內文')
  })

  it('stays under the LINE text limit', () => {
    const out = toLineText('a'.repeat(LINE_TEXT_LIMIT + 500))
    expect(out.length).toBeLessThanOrEqual(LINE_TEXT_LIMIT + 1)
    expect(out.endsWith('…')).toBe(true)
  })

  it('makes relative links absolute on the www host', () => {
    expect(absoluteUrl('/tutorial#howto-home')).toBe('https://www.smtengo.com/tutorial#howto-home')
    expect(absoluteUrl('https://shoph5.smtengo.com/')).toBe('https://shoph5.smtengo.com/')
  })
})

describe('replyToLine', () => {
  it('posts at most five text messages with the bearer token', async () => {
    const fetchImpl = vi.fn(async () => ({ ok: true, status: 200, text: async () => '' })) as any
    const status = await replyToLine('tok', ['a', '', 'b', 'c', 'd', 'e', 'f'], 'access', fetchImpl)
    expect(status).toBe(200)
    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe('https://api.line.me/v2/bot/message/reply')
    expect(init.headers.Authorization).toBe('Bearer access')
    const body = JSON.parse(init.body)
    expect(body.replyToken).toBe('tok')
    expect(body.messages.map((m: any) => m.text)).toEqual(['a', 'b', 'c', 'd', 'e'])
  })

  it('sends nothing when there is no text', async () => {
    const fetchImpl = vi.fn() as any
    expect(await replyToLine('tok', ['', '  '], 'access', fetchImpl)).toBe(0)
    expect(fetchImpl).not.toHaveBeenCalled()
  })
})
