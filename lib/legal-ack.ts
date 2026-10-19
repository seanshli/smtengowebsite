import { createHash } from 'node:crypto'

// Legal Center acknowledgements. Pure validation lives here so it can be unit
// tested without a request object; api/legal/acknowledge.ts only adds I/O.

export const AUDIENCES = ['shop_buyer', 'household', 'building', 'partner'] as const
export const DOCUMENT_IDS = ['terms', 'privacy', 'return-policy'] as const

export type Audience = (typeof AUDIENCES)[number]
export type DocumentId = (typeof DOCUMENT_IDS)[number]

export interface AckRow {
  audience: Audience
  name: string
  organization: string | null
  email: string
  phone: string | null
  documents: DocumentId[]
  versions: Record<string, string>
  note: string | null
  locale: string | null
  accepted: true
}

export type AckResult = { ok: true; row: AckRow } | { ok: false; error: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ORG_REQUIRED: readonly Audience[] = ['building', 'partner']

const fail = (error: string): AckResult => ({ ok: false, error })

/** Optional string field: undefined/null/'' -> null; wrong type or too long -> undefined (invalid). */
const optionalString = (value: unknown, max: number): string | null | undefined => {
  if (value === undefined || value === null) return null
  if (typeof value !== 'string') return undefined
  const v = value.trim()
  if (v.length > max) return undefined
  return v === '' ? null : v
}

export function validateAcknowledgement(body: unknown): AckResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return fail('Invalid body')
  const b = body as Record<string, unknown>

  if (b.accepted !== true) return fail('Acknowledgement must be accepted')

  if (typeof b.audience !== 'string' || !(AUDIENCES as readonly string[]).includes(b.audience)) {
    return fail('Invalid audience')
  }
  const audience = b.audience as Audience

  if (typeof b.name !== 'string') return fail('Name is required')
  const name = b.name.trim()
  if (name.length < 1 || name.length > 100) return fail('Name must be 1-100 characters')

  if (typeof b.email !== 'string') return fail('A valid email is required')
  const email = b.email.trim()
  if (email.length < 3 || email.length > 254 || !EMAIL_RE.test(email)) {
    return fail('A valid email is required')
  }

  const organization = optionalString(b.organization, 200)
  if (organization === undefined) return fail('Invalid organization')
  if (ORG_REQUIRED.includes(audience) && !organization) return fail('Organization is required')

  const phone = optionalString(b.phone, 40)
  if (phone === undefined) return fail('Invalid phone')

  const note = optionalString(b.note, 2000)
  if (note === undefined) return fail('Invalid note')

  const locale = optionalString(b.locale, 8)
  if (locale === undefined) return fail('Invalid locale')

  if (!Array.isArray(b.documents) || b.documents.length < 1 || b.documents.length > 10) {
    return fail('Invalid documents')
  }
  const known = DOCUMENT_IDS as readonly string[]
  for (const d of b.documents) {
    if (typeof d !== 'string' || !known.includes(d)) return fail('Unknown document')
  }
  if (new Set(b.documents).size !== b.documents.length) return fail('Duplicate documents')
  const documents = b.documents as DocumentId[]

  const versions: Record<string, string> = {}
  if (b.versions !== undefined && b.versions !== null) {
    if (typeof b.versions !== 'object' || Array.isArray(b.versions)) return fail('Invalid versions')
    for (const [key, value] of Object.entries(b.versions as Record<string, unknown>)) {
      if (!(documents as string[]).includes(key)) return fail('Version for a document that was not acknowledged')
      if (typeof value !== 'string' || value.length > 32) return fail('Invalid version')
      versions[key] = value
    }
  }

  return {
    ok: true,
    row: { audience, name, organization, email, phone, documents, versions, note, locale, accepted: true }
  }
}

/** sha256(salt + ip) as hex, so repeat submitters can be spotted without storing the address. */
export function hashIp(ip: string | undefined, salt: string): string | null {
  if (!ip) return null
  return createHash('sha256').update(salt + ip).digest('hex')
}
