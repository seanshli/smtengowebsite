import { describe, it, expect } from 'vitest'
import { queryTerms, searchManuals, type ManualEntry } from './manualSearch'

const man = (id: string, sections: [string, string][]): ManualEntry => ({
  id, file: `shop-${id}`, title: { zh: id }, html: `/manuals/shop-${id}.html`,
  sections: sections.map(([heading, text], i) => ({ id: `s${i}`, level: 2, heading, text })),
})
const books = [
  man('customer', [['到貨通知', '在缺貨商品頁點「到貨通知我」。'], ['繼續付款', '待付款訂單可以繼續付款。']]),
  man('franchise', [['加盟主資料與銀行帳戶', '只有負責人與財務可以查看。']]),
]

describe('manual search', () => {
  it('splits long Chinese phrases into 2-char pieces', () => {
    expect(queryTerms('到貨通知怎麼用').parts).toContain('到貨')
    expect(queryTerms('refund  policy').whole).toEqual(['refund', 'policy'])
  })
  it('ranks a heading hit first and links to the section anchor', () => {
    const [hit] = searchManuals(books, '到貨通知')
    expect(hit.heading).toBe('到貨通知')
    expect(hit.url).toBe('/manuals/shop-customer.html#s0')
  })
  it('still finds a section from a longer question', () => {
    expect(searchManuals(books, '加盟主的銀行帳戶誰看得到')[0].manualId).toBe('franchise')
  })
  it('returns nothing for empty or unrelated queries', () => {
    expect(searchManuals(books, '   ')).toEqual([])
    expect(searchManuals(books, 'zzzz')).toEqual([])
  })
})
