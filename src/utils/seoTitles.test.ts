import { describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { rawMessageIn } from './rawMessage'
import { zhLocale } from '../locale/zh'
import { zhCNLocale } from '../locale/zhCN'
import { enLocale } from '../locale/en'
import { frLocale } from '../locale/fr'
import { jaLocale } from '../locale/ja'
import { esLocale } from '../locale/es'

const LOCALES: Record<string, any> = { zh: zhLocale, zhCN: zhCNLocale, en: enLocale, fr: frLocale, ja: jaLocale, es: esLocale }

describe('page titles survive vue-i18n (2026-11-05 regression)', () => {
  it('documents the trap: t() cuts a title at the first " | "', () => {
    const i18n = createI18n({ legacy: false, locale: 'zh', messages: { zh: { seo: { home: { title: '首頁 | enGo智管家' } } } } })
    expect(i18n.global.t('seo.home.title')).toBe('首頁')
  })

  it('rawMessageIn returns the full title for every seo.* page in every locale', () => {
    for (const [loc, messages] of Object.entries(LOCALES)) {
      for (const page of Object.keys(messages.seo || {})) {
        const title = rawMessageIn(messages, `seo.${page}.title`)
        if (title === undefined) continue
        if (title.includes('|')) expect(title.split('|').length, `${loc} seo.${page}.title`).toBeGreaterThan(1)
        expect(title.length, `${loc} seo.${page}.title is a bare word`).toBeGreaterThan(6)
      }
    }
  })

  it('seo.ts sets document.title from the raw message, not from t()', () => {
    const src = readFileSync(resolve(__dirname, 'seo.ts'), 'utf8')
    expect(src).toContain('rawMessageIn(')
  })

  it('homepage description no longer advertises 雲端倉儲 (renamed 庫存管理 in the app)', () => {
    expect(rawMessageIn(zhLocale, 'seo.home.description')).not.toContain('雲端倉儲')
    const head = readFileSync(resolve(__dirname, '../../index.html'), 'utf8').split('<script')[0]
    expect(head).not.toContain('雲端倉儲')
  })
})

describe('alias hosts redirect every path, including "/" and trailing slashes', () => {
  it('uses a catch-all pattern that matches the root', () => {
    const v = JSON.parse(readFileSync(resolve(__dirname, '../../vercel.json'), 'utf8'))
    const hosts = (v.redirects || []).filter((r: any) => r.has?.[0]?.type === 'host')
    expect(hosts.map((r: any) => r.has[0].value).sort()).toEqual(['w2.smtengo.com', 'web.smtengo.com'])
    for (const r of hosts) {
      expect(r.source).toBe('/:path(.*)')
      expect(r.destination).toBe('https://www.smtengo.com/:path')
      expect(r.permanent).toBe(true)
    }
  })
})
