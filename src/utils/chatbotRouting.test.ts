import { describe, expect, it } from 'vitest'
import kb from '../data/knowledge_base.json'
import sol from '../data/solutions.json'
import { resolveQuestion, qaGrams } from './chatbotMatch'

// What answers a visitor question: a prospect Q&A item (by id), or a knowledge-base entry
// (by id or title). Phrasings are how visitors actually type, not the Q&A wording.
const items = (sol as any).qa.items
const answerFor = (q: string): string => {
  const r = resolveQuestion(kb as any, items, q)
  if (r.kind === 'qa') return 'qa:' + r.item.id
  if (r.kind === 'kb') return 'kb:' + (r.ranked[0].item.id ?? r.ranked[0].item.title)
  return 'none'
}
const areaOf = (id: string) => items.find((x: any) => 'qa:' + x.id === id)?.area

describe('chatbot routing by area (2026-11-24)', () => {
  it.each([
    // the prospect questions themselves, word for word and lightly reworded
    ['enGo 安購商城是什麼？', 'qa:qa14'],
    ['安購商城是什麼', 'qa:qa14'],
    ['店家或連鎖品牌可以用它管理銷售嗎？', 'qa:qa15'],
    ['可以管理庫存嗎', 'qa:qa16'],
    ['費用怎麼算', 'qa:qa3'],
    ['建商可以導入嗎', 'qa:qa9'],
    ['新成屋可以導入嗎', 'qa:qa6'],
    ['管委會可以用嗎', 'qa:qa8'],
    ['可以串接我們的 ERP 嗎', 'qa:qa17'],
    ['Can enGo connect to our CRM', 'qa:qa17'],
    ['What is enGo Care?', 'qa:qa10'],
  ])('%s → %s', (q, want) => expect(answerFor(q)).toBe(want))

  it.each([
    // keyword questions keep their knowledge-base entries
    ['門鎖可以控制嗎', 'kb:door-lock'],
    ['智慧鎖支援嗎', 'kb:door-lock'],
    ['App 下載', 'kb:app-download'],
    ['斷網還能用嗎', 'kb:network-required'],
    ['語音控制', 'kb:voice-control'],
    ['公司地址在哪', 'kb:address'],
    ['你們是誰', 'kb:what-is-engo'],
    ['大樓管理平台上線了嗎', 'kb:engo-bms'],
  ])('%s → %s', (q, want) => expect(answerFor(q)).toBe(want))

  it('care questions in other words stay in care', () => {
    for (const q of ['日照中心適合用 enGo Care 嗎', 'enGo Care 會不會幫長輩做健康診斷', '要換掉原本的照護系統嗎', '長照據點可以用嗎']) {
      const a = answerFor(q)
      expect(a === 'kb:engo-care' || areaOf(a) === 'care', `${q} → ${a}`).toBe(true)
    }
  })

  it('chain stores never land on door locks, and a general "replace everything" never on care', () => {
    expect(answerFor('連鎖品牌可以用你們的商城嗎')).not.toBe('kb:door-lock')
    expect(areaOf(answerFor('需要換掉現有的系統嗎'))).not.toBe('care')
  })

  it('a price question about a product does not get the solutions overview', () => {
    expect(answerFor('淨水器多少錢')).not.toBe('kb:solutions-overview')
  })

  it('particles split runs, so 的 never forms a shared pair', () => {
    expect([...qaGrams('現有的系統')]).toEqual(['現有', '系統'])
  })

  it('no knowledge-base keyword is a single Chinese character (鎖 matched 連鎖)', () => {
    for (const [cat, list] of Object.entries(kb as any)) for (const x of list as any[]) {
      for (const k of x.keywords || []) expect(/^[㐀-鿿]$/.test(k), `${cat}/${x.id ?? x.title}: ${k}`).toBe(false)
    }
  })
})
