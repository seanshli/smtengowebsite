import { describe, expect, it } from 'vitest'
import { isTaiwanPhone } from './phone'

describe('isTaiwanPhone', () => {
  it.each(['0912345678', '0912-345-678', '02-27510218', '(02) 2751-0218', '04-23456789', '07-1234567', '+886912345678', '+886-2-2751-0218', '02-27510218#123', '02 2751 0218 分機12'])('accepts %s', (n) => expect(isTaiwanPhone(n)).toBe(true))
  it.each(['', '12345', '0812', '091234567', '09123456789', 'abc', '+1 415 555 0100'])('rejects %s', (n) => expect(isTaiwanPhone(n)).toBe(false))
})
