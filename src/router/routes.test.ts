import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { routes } from './routes'
import {
  LOCALIZED_SEGMENTS,
  canonicalZhCnPath,
  isLocalizedPath,
  localeFromPath,
  stripLocalePrefix,
  withLocalePrefix
} from '@/utils/localePaths'

const router = createRouter({ history: createMemoryHistory(), routes })

describe('/zh-cn routes', () => {
  it('resolves /zh-cn/product to the product page with locale zhCN, like /en/product with en', () => {
    const zh = router.resolve('/zh-cn/product')
    expect(zh.name).toBe('zhcn-product')
    expect(zh.meta.locale).toBe('zhCN')
    expect(zh.meta.titleKey).toBe('seo.product.title')
    const en = router.resolve('/en/product')
    expect(en.name).toBe('en-product')
    expect(en.meta.locale).toBe('en')
    // same component, same page
    expect(zh.matched[0].components!.default).toBe(router.resolve('/product').matched[0].components!.default)
  })

  it('has a /zh-cn twin for exactly the routes /en has, and nothing else', () => {
    const names = (prefix: string) =>
      router.getRoutes().filter((r) => r.path === prefix || r.path.startsWith(`${prefix}/`)).map((r) => r.path.slice(prefix.length) || '/').sort()
    expect(names('/zh-cn')).toEqual(names('/en'))
    expect(names('/zh-cn')).toContain('/cases/:id')
    expect(names('/zh-cn').length).toBe(14)
  })

  it('resolves home, cases/:id, ecosystem and packages under /zh-cn', () => {
    expect(router.resolve('/zh-cn').name).toBe('zhcn-home')
    expect(router.resolve('/zh-cn/cases/5').name).toBe('zhcn-case-detail')
    expect(router.resolve('/zh-cn/cases/5').params.id).toBe('5')
    expect(router.resolve('/zh-cn/ecosystem').name).toBe('zhcn-ecosystem')
    expect(router.resolve('/zh-cn/packages').name).toBe('zhcn-packages')
  })

  it('does not invent routes: /zh-cn/login and /zh-cn/admin fall to Not Found', () => {
    expect(router.resolve('/zh-cn/login').name).toBe('Not Found')
    expect(router.resolve('/zh-cn/admin').name).toBe('Not Found')
  })
})

describe('locale path helpers', () => {
  it('maps paths to locales exactly (segment-wise, lowercase prefix)', () => {
    expect(localeFromPath('/zh-cn')).toBe('zhCN')
    expect(localeFromPath('/zh-cn/product')).toBe('zhCN')
    expect(localeFromPath('/en')).toBe('en')
    expect(localeFromPath('/en/product')).toBe('en')
    expect(localeFromPath('/engineering')).toBe('zh')
    expect(localeFromPath('/zh-cnx')).toBe('zh')
    expect(localeFromPath('/product')).toBe('zh')
  })
  it('strips and adds prefixes round-trip', () => {
    expect(stripLocalePrefix('/zh-cn')).toBe('/')
    expect(stripLocalePrefix('/zh-cn/cases/5')).toBe('/cases/5')
    expect(withLocalePrefix('/', 'zhCN')).toBe('/zh-cn')
    expect(withLocalePrefix('/en/product', 'zhCN')).toBe('/zh-cn/product')
    expect(withLocalePrefix('/zh-cn/product', 'zh')).toBe('/product')
    expect(withLocalePrefix('/zh-cn', 'en')).toBe('/en')
  })
  it('only content pages are localized; tools stay single-locale', () => {
    expect(isLocalizedPath('/product')).toBe(true)
    expect(isLocalizedPath('/cases/12')).toBe(true)
    expect(isLocalizedPath('/')).toBe(true)
    for (const p of ['/login', '/admin', '/success', '/display', '/legal', '/zh-cn/product']) expect(isLocalizedPath(p)).toBe(false)
    expect(LOCALIZED_SEGMENTS.has('product')).toBe(true)
  })
  it('redirects /zh-CN and /zh-hans spellings to lowercase /zh-cn and leaves /zh-cn alone', () => {
    expect(canonicalZhCnPath('/zh-CN/product')).toBe('/zh-cn/product')
    expect(canonicalZhCnPath('/zh-CN')).toBe('/zh-cn')
    expect(canonicalZhCnPath('/zh-hans/cases/5')).toBe('/zh-cn/cases/5')
    expect(canonicalZhCnPath('/zh-Hans')).toBe('/zh-cn')
    expect(canonicalZhCnPath('/zh-cn/product')).toBeNull()
    expect(canonicalZhCnPath('/zh-cnx')).toBeNull()
    expect(canonicalZhCnPath('/product')).toBeNull()
  })
})
