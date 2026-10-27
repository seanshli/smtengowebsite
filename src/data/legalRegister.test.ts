import { describe, expect, it } from 'vitest'
// Revision control for the controlled legal documents (ISO 27001 7.5): a change to
// public/<doc>.html, the stamps inside it, or docs/LEGAL_DOCUMENT_REGISTER.md without
// `npm run legal:bump` fails here. See scripts/legal-register.mjs.
import { verify, loadRegister } from '../../scripts/legal-register.mjs'

describe('legal document register', () => {
  it('every document is numbered, stamped, hashed and in the register', () => {
    expect(verify()).toEqual([])
  })

  it('audiences only reference registered documents', () => {
    const reg = loadRegister()
    const ids = new Set(reg.documents.map((d: any) => d.id))
    for (const a of reg.audiences) for (const d of a.documents) expect(ids.has(d)).toBe(true)
  })
})
