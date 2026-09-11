import { describe, it, expect } from 'vitest'
import kb from '../data/knowledge_base.json'
import faqs from '../data/faqs.json'
import { normalizeQuery, expandQuery, rankKnowledge } from './chatbotMatch'

const top = (q: string) => rankKnowledge(kb as any, expandQuery(normalizeQuery(q)))[0]

describe('chatbot routes KB-001 questions to the right entry', () => {
  const cases: Array<[string, string]> = [
    ['斷網可以用嗎', 'network-required'],
    ['沒有網路還能控制嗎', 'network-required'],
    ['可以控制門鎖嗎', 'door-lock'],
    ['有支援指紋鎖嗎', 'door-lock'],
    ['手機可以語音嗎', 'voice-control'],
    ['平板會不會偷聽錄音', 'voice-control'],
    ['Siri 可以用嗎', 'homekit-siri'],
    ['支援 Apple HomeKit 嗎', 'homekit-siri'],
    ['相片牆半夜會很亮嗎', 'photo-wall'],
    ['App 叫什麼名字 哪裡下載', 'app-download'],
    ['iPhone 和平板功能一樣嗎', 'engo-interfaces'],
    ['怎麼報修', 'property-management'],
    ['配網失敗 連不上', 'device-pairing'],
    ['資料存在哪裡 會傳到國外嗎', 'data-privacy'],
    ['搬家要怎麼處理帳號', 'data-privacy'],
    ['支援哪些家電', 'compatibility'],
  ]
  for (const [q, id] of cases) {
    it(`"${q}" → ${id}`, () => {
      const best = top(q)
      expect(best, `no match for "${q}"`).toBeDefined()
      expect(best.item.id).toBe(id)
    })
  }
})

describe('no §0.2 claim survives in the KB or the /tutorial FAQ', () => {
  // Customer-visible text only — keywords are routing terms (e.g. 喚醒詞 must
  // route to the voice entry precisely so the bot can say it is unconfirmed).
  const textOf = (e: any) =>
    ['answer', 'specs', 'features', 'description', 'name', 'question']
      .flatMap((k) => (e[k] && typeof e[k] === 'object' ? Object.values(e[k]) : e[k] ? [e[k]] : []))
      .join('\n')
  const text = [...Object.values(kb as any).flat(), ...(faqs as any[])].map(textOf).join('\n')
  const banned = [
    '嘿 Siri', '嘿！Siri', 'Hey Siri', 'Hey Siri', 'Dis Siri',
    '已整合 Apple HomeKit', 'integrates with Apple HomeKit',
    '離線時仍可運作', 'continue to work offline',
    '食譜', '音響系統', '門鎖及', 'locks, and water',
    '喚醒詞', 'wake word,', 'T1 平板', '10.1吋',
  ]
  for (const phrase of banned) {
    it(`does not contain "${phrase}"`, () => {
      expect(text.includes(phrase)).toBe(false)
    })
  }
  it('every entry that says 門鎖 also says it is not supported', () => {
    const all = [...(kb as any).general, ...(kb as any).products, ...(kb as any).catalog]
    for (const e of all) {
      const zh = e.answer?.zh ?? e.features?.zh ?? e.description?.zh ?? ''
      if (zh.includes('門鎖')) expect(zh, e.id).toMatch(/不在.*支援|不支援|不在支援範圍/)
    }
    for (const f of faqs as any[]) {
      if (f.answer.zh.includes('門鎖')) expect(f.answer.zh, String(f.id)).toMatch(/不在.*支援|不支援|不在支援範圍/)
    }
  })
})
