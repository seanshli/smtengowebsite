import { describe, it, expect, beforeAll } from 'vitest'

// Exercises the real signing code, not a copy of it. AUTH_SECRET has to be set
// before the module is imported because it reads the secret at load time.
let signSession: (id: string) => string
let authenticate: (req: any, supabase: any) => Promise<any>
let isConfigured: () => boolean

const UID = '11111111-2222-3333-4444-555555555555'

// Stands in for Supabase: .from().select().eq().single() resolving to one row.
const fakeDb = (row: any) => ({
  from: () => ({
    select: () => ({
      eq: () => ({ single: async () => ({ data: row, error: row ? null : new Error('no rows') }) })
    })
  })
})

const bearer = (token: string) => ({ headers: { authorization: `Bearer ${token}` } })

beforeAll(async () => {
  process.env.AUTH_SECRET = 'test-secret-at-least-32-characters-long'
  const mod = await import('./_session')
  signSession = mod.signSession
  authenticate = mod.authenticate as any
  isConfigured = mod.isConfigured
})

describe('admin session token', () => {
  const user = { id: UID, username: 'tester', name: 'Tester', role: 'superuser' }
  const db = fakeDb(user)

  it('accepts a token it just issued', async () => {
    expect(isConfigured()).toBe(true)
    await expect(authenticate(bearer(signSession(UID)), db)).resolves.toMatchObject({ id: UID })
  })

  it('rejects a bare user id — the old token format', async () => {
    await expect(authenticate(bearer(UID), db)).resolves.toBeNull()
  })

  it('rejects a forged payload with a self-made signature', async () => {
    const forged = Buffer.from(JSON.stringify({ sub: UID, exp: 9999999999 })).toString('base64url')
    await expect(authenticate(bearer(`${forged}.${forged}`), db)).resolves.toBeNull()
  })

  it('rejects a valid signature transplanted onto another payload', async () => {
    const signature = signSession(UID).split('.')[1]
    const otherPayload = Buffer.from(
      JSON.stringify({ sub: 'attacker', exp: 9999999999 })
    ).toString('base64url')
    await expect(authenticate(bearer(`${otherPayload}.${signature}`), db)).resolves.toBeNull()
  })

  it('rejects an expired token', async () => {
    const stale = Buffer.from(
      JSON.stringify({ sub: UID, exp: Math.floor(Date.now() / 1000) - 1 })
    ).toString('base64url')
    const token = signSession(UID).replace(/^[^.]+/, stale)
    await expect(authenticate(bearer(token), db)).resolves.toBeNull()
  })

  it('rejects malformed input and a missing header', async () => {
    for (const bad of ['', '.', '....', 'no-dot']) {
      await expect(authenticate(bearer(bad), db)).resolves.toBeNull()
    }
    await expect(authenticate({ headers: {} }, db)).resolves.toBeNull()
  })

  it('rejects a signed token whose user row is gone', async () => {
    await expect(authenticate(bearer(signSession(UID)), fakeDb(null))).resolves.toBeNull()
  })
})
