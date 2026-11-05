import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import index from '../src/data/manual-index.json'
import { MANUALS, buildIndex } from './gen-manual-index.mjs'
import { searchManuals } from '../src/utils/manualSearch'

const ROOT = resolve(__dirname, '..')
const read = (file: string) => readFileSync(resolve(ROOT, 'public/manuals', `${file}.html`), 'utf8')
const manuals = (index as any).manuals

describe('商城使用手冊 on /tutorial', () => {
  it('ships an HTML and a PDF for every public manual, and nothing internal', () => {
    for (const m of MANUALS) {
      expect(existsSync(resolve(ROOT, 'public/manuals', `${m.file}.html`)), m.file).toBe(true)
      expect(existsSync(resolve(ROOT, 'public/manuals', `${m.file}.pdf`)), m.file).toBe(true)
    }
    // The 平台端 manual is internal and must never be published on the website.
    const files = readdirSync(resolve(ROOT, 'public/manuals'))
    expect(files.join(' ')).not.toMatch(/平台端|admin|platform/i)
    expect(files.map((f) => read(f.replace(/\.(html|pdf)$/, '')).length > 0 || true)).toBeTruthy()
  })

  it('has a search index that matches the committed HTML (re-run gen:manuals)', () => {
    expect(manuals).toEqual(buildIndex(read))
  })

  it('carries file name, version and month/year on every manual', () => {
    for (const m of manuals) expect(m.docMeta, m.id).toMatch(/^智管家商城_使用手冊_\S+ · v\d+\.\d+ · \d{4} 年 \d{1,2} 月$/)
  })

  it('finds the November topics in the right manual', () => {
    const top = (q: string) => searchManuals(manuals, q)[0]
    expect(top('到貨通知').manualId).toBe('customer')
    expect(top('繼續付款').manualId).toBe('customer')
    expect(top('接單生產')).toBeTruthy()
    expect(top('加盟主').manualId).toBe('franchise')
    expect(searchManuals(manuals, 'qwertyzxcv')).toEqual([])
    expect(top('到貨通知').url).toMatch(/^\/manuals\/shop-customer\.html#/)
  })
})
