import { describe, expect, it } from 'vitest'
import { hashIp, validateAcknowledgement } from './legal-ack'

const base = {
  audience: 'shop_buyer',
  name: '  王小明 ',
  email: 'ming@example.com',
  documents: ['terms', 'privacy'],
  versions: { terms: '2026-10-01' },
  accepted: true
}

describe('validateAcknowledgement', () => {
  it('accepts a valid shop_buyer row and cleans it', () => {
    const r = validateAcknowledgement(base)
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.row.name).toBe('王小明')
      expect(r.row.organization).toBeNull()
      expect(r.row.phone).toBeNull()
      expect(r.row.note).toBeNull()
      expect(r.row.versions).toEqual({ terms: '2026-10-01' })
    }
  })

  it('requires organization for partner and building', () => {
    expect(validateAcknowledgement({ ...base, audience: 'partner' }).ok).toBe(false)
    expect(validateAcknowledgement({ ...base, audience: 'building', organization: '  ' }).ok).toBe(false)
    expect(validateAcknowledgement({ ...base, audience: 'partner', organization: 'ACME' }).ok).toBe(true)
  })

  it('rejects an unknown document id', () => {
    expect(validateAcknowledgement({ ...base, documents: ['terms', 'nope'] }).ok).toBe(false)
  })

  it('rejects accepted other than true', () => {
    expect(validateAcknowledgement({ ...base, accepted: false }).ok).toBe(false)
    expect(validateAcknowledgement({ ...base, accepted: 'true' }).ok).toBe(false)
  })

  it('rejects versions keyed by a document that was not acknowledged', () => {
    expect(validateAcknowledgement({ ...base, versions: { 'return-policy': 'v1' } }).ok).toBe(false)
  })

  it('rejects duplicate documents, bad email and bad audience', () => {
    expect(validateAcknowledgement({ ...base, documents: ['terms', 'terms'] }).ok).toBe(false)
    expect(validateAcknowledgement({ ...base, email: 'nope' }).ok).toBe(false)
    expect(validateAcknowledgement({ ...base, audience: 'other' }).ok).toBe(false)
    expect(validateAcknowledgement(null).ok).toBe(false)
  })
})

describe('hashIp', () => {
  it('is deterministic, salted, and null without an ip', () => {
    expect(hashIp('1.2.3.4', 's')).toBe(hashIp('1.2.3.4', 's'))
    expect(hashIp('1.2.3.4', 's')).not.toBe(hashIp('1.2.3.4', 't'))
    expect(hashIp('1.2.3.4', 's')).toMatch(/^[0-9a-f]{64}$/)
    expect(hashIp(undefined, 's')).toBeNull()
  })
})
