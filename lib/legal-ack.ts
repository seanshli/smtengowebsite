import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'

// Legal Center acknowledgements. Pure validation lives here so it can be unit
// tested without a request object; api/legal/acknowledge.ts only adds I/O.

type RegisterDoc = { id: string; docNo: string; revision: string; issued: string; history: { revision: string; sha256: { zh: string; en: string } }[] }

// package.json is "type": "module": a bare JSON import has no import attribute and makes the
// Vercel function fail at load (FUNCTION_INVOCATION_FAILED, seen 2026-10-20). Load it the way
// lib/line-bot.ts loads knowledge_base.json, which is proven in production.
const require = createRequire(import.meta.url)
const legal: { documents: RegisterDoc[] } = require('../src/data/legal.json')

export const AUDIENCES = ['shop_buyer', 'household', 'building', 'partner'] as const
export const DOCUMENT_IDS = ['terms', 'privacy', 'return-policy'] as const

/** The revision in force for a document, as recorded by the server on every acknowledgement. */
export interface DocVersion {
  docNo: string
  revision: string
  issued: string
  sha256: { zh: string; en: string }
}


/** Current revision per document id, from the controlled register (src/data/legal.json). */
export const currentVersions = (): Record<DocumentId, DocVersion> => {
  const out = {} as Record<DocumentId, DocVersion>
  for (const d of legal.documents) {
    const last = d.history[d.history.length - 1]
    out[d.id as DocumentId] = { docNo: d.docNo, revision: d.revision, issued: d.issued, sha256: last?.sha256 ?? { zh: '', en: '' } }
  }
  return out
}

export type Audience = (typeof AUDIENCES)[number]
export type DocumentId = (typeof DOCUMENT_IDS)[number]

export interface AckRow {
  audience: Audience
  name: string
  organization: string | null
  email: string
  phone: string | null
  documents: DocumentId[]
  versions: Record<string, DocVersion>
  note: string | null
  locale: string | null
  accepted: true
}

export type AckResult = { ok: true; row: AckRow } | { ok: false; error: string; code?: 'stale' }

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

  // The browser may say which revision it showed; the server records the revision in
  // force from the register regardless. A mismatch means the page is stale: refuse, so
  // nobody acknowledges text they did not read.
  const current = currentVersions()
  if (b.versions !== undefined && b.versions !== null) {
    if (typeof b.versions !== 'object' || Array.isArray(b.versions)) return fail('Invalid versions')
    for (const [key, value] of Object.entries(b.versions as Record<string, unknown>)) {
      if (!(documents as string[]).includes(key)) return fail('Version for a document that was not acknowledged')
      if (typeof value !== 'string' || value.length > 32) return fail('Invalid version')
      if (value !== current[key as DocumentId].revision) {
        return { ok: false, code: 'stale', error: 'Document revision has changed; reload the page and review again' }
      }
    }
  }
  const versions: Record<string, DocVersion> = {}
  for (const d of documents) versions[d] = current[d]

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
