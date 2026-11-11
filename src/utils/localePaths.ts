// URL <-> locale mapping for the indexed languages.
//
// Traditional Chinese is the default and stays unprefixed so every existing URL
// and backlink keeps working. English lives under /en and Simplified Chinese
// under /zh-cn (lowercase only; /zh-CN and /zh-hans are redirected to it).
// ja / fr / es have no URL of their own yet: they switch client-side only.
//
// Kept free of any router / app import so tests and scripts can use it.

export type PrefixedLocale = 'en' | 'zhCN'
export type UrlLocale = 'zh' | PrefixedLocale

export const LOCALE_PREFIXES: Record<UrlLocale, string> = { zh: '', en: '/en', zhCN: '/zh-cn' }

// Pages worth indexing per language. login/success/display/admin are tools,
// not content, so they stay single-locale.
export const LOCALIZED = new Set([
  'home', 'core', 'brand', 'mission', 'team', 'enviro', 'vision',
  'ecosystem', 'product', 'contact', 'packages', 'tutorial', 'cases',
  'case-detail', 'legal'
])

// First path segment of every localized route ('' = home). case-detail shares 'cases'.
export const LOCALIZED_SEGMENTS = new Set([
  '', 'core', 'brand', 'mission', 'team', 'enviro', 'vision',
  'ecosystem', 'product', 'contact', 'packages', 'tutorial', 'cases', 'legal'
])

/** Route name of the prefixed twin: en-product, zhcn-product. */
export const routePrefixName = (locale: PrefixedLocale, name: string) =>
  `${locale === 'zhCN' ? 'zhcn' : locale}-${name}`

const PREFIXED_LOCALES: PrefixedLocale[] = ['en', 'zhCN']

/** Which URL locale a path belongs to. Prefix match is exact-case and segment-wise. */
export function localeFromPath(path: string): UrlLocale {
  for (const loc of PREFIXED_LOCALES) {
    const p = LOCALE_PREFIXES[loc]
    if (path === p || path.startsWith(`${p}/`)) return loc
  }
  return 'zh'
}

/** `/zh-cn/product` -> `/product`; `/en` -> `/`; unprefixed paths pass through. */
export function stripLocalePrefix(path: string): string {
  const loc = localeFromPath(path)
  if (loc === 'zh') return path
  const rest = path.slice(LOCALE_PREFIXES[loc].length)
  return rest === '' ? '/' : rest
}

/** `/product` + zhCN -> `/zh-cn/product`; `/` -> `/zh-cn`. Zh returns the bare path. */
export function withLocalePrefix(path: string, locale: UrlLocale): string {
  const bare = stripLocalePrefix(path)
  const p = LOCALE_PREFIXES[locale]
  if (!p) return bare
  return bare === '/' ? p : `${p}${bare}`
}

/** True for a bare path that has a prefixed twin (a localized content page). */
export function isLocalizedPath(path: string): boolean {
  if (localeFromPath(path) !== 'zh') return false
  const seg = path.split('/')[1] ?? ''
  return LOCALIZED_SEGMENTS.has(seg)
}

/** Wrong-case or alias spellings of the zh-cn prefix that must redirect to /zh-cn. */
const ALIAS = /^\/(zh-cn|zh-hans)(?=\/|$)/i
export function canonicalZhCnPath(path: string): string | null {
  const m = ALIAS.exec(path)
  if (!m || m[1] === 'zh-cn') return null
  return `/zh-cn${path.slice(m[0].length)}`
}
