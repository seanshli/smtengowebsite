import { describe, it, expect } from 'vitest'
import { planLanguageSwitch } from './localePaths'

// Team report 2026-11-12 (iOS, Android, enGo tablet, Mac, Windows): from 法文/日文/西班牙文,
// choosing 中文 did nothing. The switcher pushed the address it was already on, the
// router treated that as a no-op, and the guard that sets the locale never ran.
describe('planLanguageSwitch', () => {
  it.each(['fr', 'ja', 'es'] as const)('%s → 中文 on an unprefixed page sets the locale without a navigation', (from) => {
    void from
    expect(planLanguageSwitch('/product', 'zh')).toEqual({ push: null, setLocale: 'zh' })
    expect(planLanguageSwitch('/', 'zh')).toEqual({ push: null, setLocale: 'zh' })
  })
  it('always returns the requested locale, so the page can never disagree with the dropdown', () => {
    for (const path of ['/', '/product', '/en/product', '/zh-cn/team', '/cases/5', '/legal'])
      for (const lang of ['zh', 'zhCN', 'en', 'fr', 'ja', 'es'] as const) expect(planLanguageSwitch(path, lang).setLocale).toBe(lang)
  })
  it('moves the address between the three indexed locales', () => {
    expect(planLanguageSwitch('/product', 'en').push).toBe('/en/product')
    expect(planLanguageSwitch('/product', 'zhCN').push).toBe('/zh-cn/product')
    expect(planLanguageSwitch('/en/product', 'zh').push).toBe('/product')
    expect(planLanguageSwitch('/zh-cn/team', 'en').push).toBe('/en/team')
    expect(planLanguageSwitch('/en', 'zh').push).toBe('/')
  })
  it('ja / fr / es have no URL yet: leave a prefixed page for the bare one, stay put otherwise', () => {
    expect(planLanguageSwitch('/en/product', 'fr').push).toBe('/product')
    expect(planLanguageSwitch('/zh-cn/team', 'ja').push).toBe('/team')
    expect(planLanguageSwitch('/product', 'es').push).toBeNull()
  })
  it('choosing the language already shown is a no-op navigation', () => {
    expect(planLanguageSwitch('/en/product', 'en').push).toBeNull()
    expect(planLanguageSwitch('/zh-cn', 'zhCN').push).toBeNull()
  })
})
