/**
 * Taiwan phone numbers a visitor may type on the contact form: a mobile (09…), a landline
 * with its area code (02-…, 04-…), or the +886 form, with an optional extension.
 * Building committees, care sites and shops usually leave an office landline, which the
 * old mobile-only check rejected.
 */
export function isTaiwanPhone(raw: string): boolean {
  const s = String(raw || '').replace(/[\s\-().]/g, '').replace(/(#|ext|分機)\d{1,6}$/i, '')
  return /^09\d{8}$/.test(s) || /^0[2-8]\d{7,8}$/.test(s) || /^\+?886(9\d{8}|[2-8]\d{7,8})$/.test(s)
}
