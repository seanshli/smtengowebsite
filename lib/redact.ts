// Operators work the enquiry queue: they need to see who asked and what about,
// but not to walk away with a list of customer phone numbers and home
// addresses. Masking happens here, server-side, because anything sent to the
// browser is readable in the network tab no matter what the UI renders.

const DOT = '•'

/** wang.xm@gmail.com -> w******@gmail.com */
export const maskEmail = (value: unknown): unknown => {
  if (typeof value !== 'string' || value === '') return value
  const at = value.indexOf('@')
  // No local part to keep (missing or leading @) — hide the lot.
  if (at < 1) return DOT.repeat(3)
  return value[0] + DOT.repeat(Math.max(3, at - 1)) + value.slice(at)
}

/** 0912-345-678 -> 0912•••678 (enough to recognise a known caller, not to dial) */
export const maskPhone = (value: unknown): unknown => {
  if (typeof value !== 'string' || value === '') return value
  if (value.length < 8) return DOT.repeat(3)
  return value.slice(0, 4) + DOT.repeat(3) + value.slice(-3)
}

/**
 * Strips the street address entirely. `region` and `city` are separate columns
 * and stay visible, so an operator still knows roughly where — which is what
 * routing an enquiry actually needs.
 */
export const maskAddress = (value: unknown): unknown =>
  typeof value === 'string' && value !== '' ? DOT.repeat(3) : value

export const redactSubmission = <T extends Record<string, unknown>>(row: T): T => ({
  ...row,
  email: maskEmail(row.email),
  phone: maskPhone(row.phone),
  address: maskAddress(row.address)
})
