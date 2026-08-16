import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { rateLimit } from './_ratelimit'

// 203.0.113.0/24 and 198.51.100.0/24 are reserved documentation ranges.
const req = (ip: string) => ({ headers: { 'x-forwarded-for': ip } }) as any

const RULE = { limit: 3, windowMs: 60_000, bucket: 'test' }

describe('rateLimit', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('allows up to the limit, then blocks', () => {
    const client = req('203.0.113.5')
    for (let i = 0; i < RULE.limit; i++) {
      expect(rateLimit(client, RULE).allowed).toBe(true)
    }
    const blocked = rateLimit(client, RULE)
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfter).toBeGreaterThan(0)
  })

  it('counts each client separately', () => {
    const a = req('203.0.113.10')
    const b = req('203.0.113.11')
    for (let i = 0; i < RULE.limit; i++) rateLimit(a, { ...RULE, bucket: 'sep' })
    expect(rateLimit(a, { ...RULE, bucket: 'sep' }).allowed).toBe(false)
    // b must be unaffected by a's exhaustion
    expect(rateLimit(b, { ...RULE, bucket: 'sep' }).allowed).toBe(true)
  })

  it('keeps buckets independent, so one endpoint cannot exhaust another', () => {
    const client = req('203.0.113.20')
    for (let i = 0; i < RULE.limit; i++) rateLimit(client, { ...RULE, bucket: 'one' })
    expect(rateLimit(client, { ...RULE, bucket: 'one' }).allowed).toBe(false)
    expect(rateLimit(client, { ...RULE, bucket: 'two' }).allowed).toBe(true)
  })

  it('lets the window slide so legitimate users recover', () => {
    const client = req('203.0.113.30')
    for (let i = 0; i < RULE.limit; i++) rateLimit(client, { ...RULE, bucket: 'slide' })
    expect(rateLimit(client, { ...RULE, bucket: 'slide' }).allowed).toBe(false)

    vi.advanceTimersByTime(RULE.windowMs + 1)
    expect(rateLimit(client, { ...RULE, bucket: 'slide' }).allowed).toBe(true)
  })

  it('still answers when no client address is present', () => {
    const anon = { headers: {} } as any
    expect(rateLimit(anon, { ...RULE, bucket: 'anon' }).allowed).toBe(true)
  })

  it('keys on the first hop of x-forwarded-for', () => {
    const spoofed = req('203.0.113.40, 198.51.100.7')
    for (let i = 0; i < RULE.limit; i++) rateLimit(spoofed, { ...RULE, bucket: 'hop' })
    expect(rateLimit(req('203.0.113.40'), { ...RULE, bucket: 'hop' }).allowed).toBe(false)
  })
})
