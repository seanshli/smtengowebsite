import { describe, it, expect } from 'vitest'
import { askShopKnowledge, SHOP_KNOWLEDGE_ENDPOINT } from './shop-knowledge'

const ok = (answers: any[]) =>
  (async () => ({ ok: true, json: async () => ({ question: 'q', answers }) })) as unknown as typeof fetch

const ANSWER = {
  slug: 'returns-7day', title: '七日鑑賞期', category: 'RETURNS',
  excerpt: '依消費者保護法第 19 條…', articleUrl: 'https://shoph5.smtengo.com/help/returns-7day',
}

describe('askShopKnowledge', () => {
  it('把標題、內文與原文連結組成回覆', async () => {
    const r = await askShopKnowledge('退貨', { fetchImpl: ok([ANSWER]) })
    expect(r).not.toBeNull()
    expect(r!.text).toContain('七日鑑賞期')
    expect(r!.text).toContain('消費者保護法第 19 條')
    expect(r!.text).toContain('https://shoph5.smtengo.com/help/returns-7day')
    expect(r!.slugs).toEqual(['returns-7day'])
  })

  it('非中文語系要加一句「內容是繁中」——不要假裝是原生譯文', async () => {
    const r = await askShopKnowledge('return policy', { locale: 'en', fetchImpl: ok([ANSWER]) })
    expect(r!.text).toMatch(/Traditional Chinese/)
    const zh = await askShopKnowledge('退貨', { locale: 'zh', fetchImpl: ok([ANSWER]) })
    expect(zh!.text).not.toMatch(/Traditional Chinese/)
  })

  it('🔑 任何失敗都回 null —— 對話不能因為商城掛了就中斷', async () => {
    const boom = (async () => { throw new Error('network') }) as unknown as typeof fetch
    expect(await askShopKnowledge('退貨', { fetchImpl: boom })).toBeNull()

    const err500 = (async () => ({ ok: false, json: async () => ({}) })) as unknown as typeof fetch
    expect(await askShopKnowledge('退貨', { fetchImpl: err500 })).toBeNull()

    expect(await askShopKnowledge('退貨', { fetchImpl: ok([]) })).toBeNull()

    const junk = (async () => ({ ok: true, json: async () => ({ answers: 'nope' }) })) as unknown as typeof fetch
    expect(await askShopKnowledge('退貨', { fetchImpl: junk })).toBeNull()
  })

  it('空問句不發請求', async () => {
    let called = false
    const spy = (async () => { called = true; return { ok: true, json: async () => ({ answers: [ANSWER] }) } }) as unknown as typeof fetch
    expect(await askShopKnowledge('   ', { fetchImpl: spy })).toBeNull()
    expect(called).toBe(false)
  })

  it('問句截到 200 字（API 上限），且打的是公開端點', async () => {
    let url = ''
    const spy = (async (u: any) => { url = String(u); return { ok: true, json: async () => ({ answers: [ANSWER] }) } }) as unknown as typeof fetch
    await askShopKnowledge('退'.repeat(500), { fetchImpl: spy })
    expect(url.startsWith(SHOP_KNOWLEDGE_ENDPOINT)).toBe(true)
    expect(decodeURIComponent(url.split('q=')[1].split('&')[0]).length).toBe(200)
  })
})
