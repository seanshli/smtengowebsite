import { describe, it, expect } from 'vitest'
import { maskEmail, maskPhone, maskAddress, redactSubmission, redactFreeText } from './redact'

describe('maskEmail', () => {
  it('keeps the first character and the domain', () => {
    expect(maskEmail('wang.xm@gmail.com')).toBe('w••••••@gmail.com')
  })
  it('never leaks a one-character local part', () => {
    expect(maskEmail('a@b.com')).toBe('a•••@b.com')
  })
  it('hides everything when there is no usable local part', () => {
    expect(maskEmail('@nolocal.com')).toBe('•••')
    expect(maskEmail('not-an-email')).toBe('•••')
  })
  it('passes through empty and non-strings untouched', () => {
    expect(maskEmail('')).toBe('')
    expect(maskEmail(null)).toBe(null)
    expect(maskEmail(undefined)).toBe(undefined)
  })
})

describe('maskPhone', () => {
  it('keeps a recognisable prefix and last three digits', () => {
    expect(maskPhone('0912-345-678')).toBe('0912•••678')
  })
  it('hides short numbers entirely rather than exposing most of them', () => {
    expect(maskPhone('1234567')).toBe('•••')
  })
  it('passes through empty and non-strings untouched', () => {
    expect(maskPhone('')).toBe('')
    expect(maskPhone(null)).toBe(null)
  })
})

describe('redactSubmission', () => {
  const row = {
    id: 7, name: '王小明', email: 'wang.xm@gmail.com', phone: '0912-345-678',
    region: '台灣', city: '台北市', address: '大安區忠孝東路四段 123 號 5 樓',
    message: '我想了解淨水系統', status: 'pending', notes: '', created_at: '2026-01-01'
  }

  it('masks exactly the three sensitive fields', () => {
    const out = redactSubmission(row)
    expect(out.email).toBe('w••••••@gmail.com')
    expect(out.phone).toBe('0912•••678')
    expect(out.address).toBe('•••')
  })

  it('leaves everything an operator needs to triage', () => {
    const out = redactSubmission(row)
    for (const k of ['id','name','region','city','message','status','notes','created_at'] as const) {
      expect(out[k]).toBe(row[k])
    }
  })

  it('does not mutate the original row', () => {
    const copy = { ...row }
    redactSubmission(row)
    expect(row).toEqual(copy)
  })
})

describe('redactFreeText', () => {
  it('removes emails, links, ids and phone numbers', () => {
    expect(redactFreeText('寄到 wang@gmail.com 謝謝')).toBe('寄到 [email] 謝謝')
    expect(redactFreeText('see https://x.example/a?b=1 now')).toBe('see [url] now')
    expect(redactFreeText('A123456789 申請')).toBe('[id] 申請')
    expect(redactFreeText('call 0912-345-678 please')).toBe('call [number] please')
    expect(redactFreeText('+886 912 345 678')).toBe('[number]')
  })
  it('leaves ordinary questions and short numbers alone', () => {
    expect(redactFreeText('配網失敗怎麼辦')).toBe('配網失敗怎麼辦')
    expect(redactFreeText('can I use 2 locks in 3 rooms')).toBe('can I use 2 locks in 3 rooms')
  })
})
