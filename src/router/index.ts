import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useSeo } from '@/utils/seo'
import { useAnalytics } from '@/utils/analytics'
import { changeLocale, i18n } from '@/main'
import {
  LOCALE_PREFIXES,
  LOCALIZED,
  canonicalZhCnPath,
  isLocalizedPath,
  localeFromPath,
  routePrefixName,
  withLocalePrefix
} from '@/utils/localePaths'
import { routes } from './routes'

// Traditional Chinese is the default and stays unprefixed, so every existing
// URL and backlink keeps working. English mirrors the content routes under
// /en/* and Simplified Chinese under /zh-cn/* (see utils/localePaths.ts).
// Only these three are real for search — see public/sitemap.xml.
export { LOCALE_PREFIXES }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Honour #news and friends — without this, linking to /#news from another
    // page lands at the top and the section the user asked for is off-screen.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 80 } // clear the fixed header
    }
    return { top: 0 }
  }
})

// ─── Keep internal links inside the visitor's language ───
// Links are written once, unprefixed ('/product'). While the visitor is on an
// /en or /zh-cn page, route them to the prefixed twin instead, otherwise the
// first click would drop them back to Traditional Chinese (beforeEach resets
// the locale to match the URL). Applied in resolve() so <router-link> hrefs are
// right, and in push()/replace() because RouterLink and code navigate with the
// original target. The header's language switcher uses pushUnlocalized().
type Target = any
const localizeTarget = (to: Target): Target => {
  const loc = localeFromPath(router.currentRoute.value.path)
  if (loc === 'zh') return to
  if (typeof to === 'string') {
    const path = to.split(/[?#]/)[0]
    return isLocalizedPath(path) ? withLocalePrefix(path, loc) + to.slice(path.length) : to
  }
  if (to && typeof to === 'object') {
    if (typeof to.path === 'string' && isLocalizedPath(to.path)) {
      return { ...to, path: withLocalePrefix(to.path, loc) }
    }
    if (typeof to.name === 'string' && LOCALIZED.has(to.name)) {
      return { ...to, name: routePrefixName(loc, to.name) }
    }
  }
  return to
}
const rawResolve = router.resolve.bind(router)
const rawPush = router.push.bind(router)
const rawReplace = router.replace.bind(router)
router.resolve = ((to: Target, current?: any) => rawResolve(localizeTarget(to), current)) as typeof router.resolve
router.push = ((to: Target) => rawPush(localizeTarget(to))) as typeof router.push
router.replace = ((to: Target) => rawReplace(localizeTarget(to))) as typeof router.replace

/** Navigate to exactly this target (no language-prefix rewriting). */
export const pushUnlocalized = (to: Target) => rawPush(to)

const { updateMeta } = useSeo()
const { trackPageView } = useAnalytics()

// ─── Native View Transitions (progressive enhancement) ───
// Wrap route changes in document.startViewTransition so pages crossfade and
// elements with matching view-transition-name (case card -> detail banner)
// morph. Feature-detected: unsupported browsers navigate exactly as before.
let finishViewTransition: (() => void) | undefined

router.beforeResolve((to, from) => {
  if (typeof document === 'undefined' || !('startViewTransition' in document)) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (to.path === from.path) return // query-only changes (e.g. ?jump=) shouldn't flash

  return new Promise<void>((resolveNav) => {
    ;(document as any).startViewTransition(
      () =>
        new Promise<void>((domUpdated) => {
          finishViewTransition = domUpdated
          resolveNav() // let vue-router proceed; afterEach signals DOM completion
        })
    )
  })
})

router.afterEach(async () => {
  if (finishViewTransition) {
    const done = finishViewTransition
    finishViewTransition = undefined
    await nextTick()
    done()
  }
})

router.onError(() => {
  // Aborted navigation: release the captured frame instead of timing out.
  finishViewTransition?.()
  finishViewTransition = undefined
})

/**
 * Reads the `exp` claim out of a `payload.signature` session token. Signature
 * verification is the server's job — a token that fails this check is treated
 * as expired, which is the safe direction to be wrong in.
 */
const isExpired = (token: string): boolean => {
  try {
    const payload = token.split('.')[0]
    const { exp } = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return typeof exp !== 'number' || exp <= Math.floor(Date.now() / 1000)
  } catch {
    return true
  }
}

router.beforeEach((to, from, next) => {
  // /zh-CN and /zh-hans are aliases (vue-router matches case-insensitively, so
  // /zh-CN/product would otherwise render under a second, non-canonical URL).
  const alias = canonicalZhCnPath(to.path)
  if (alias) return next({ path: alias, query: to.query, hash: to.hash, replace: true })

  // The URL is the source of truth for language on the three indexed locales,
  // so /en/team and /zh-cn/team render English / Simplified for a crawler, and
  // for anyone opening the link, without a click on the switcher first.
  const urlLocale = localeFromPath(to.path)
  const current = i18n.global.locale.value
  if (urlLocale !== 'zh') {
    if (current !== urlLocale) changeLocale(urlLocale)
  } else if (current === 'en' || current === 'zhCN') {
    // Leaving a prefixed URL: fall back to the default rather than staying in
    // that language on a Traditional URL, which would contradict that page's
    // own hreflang. (ja / fr / es have no URL, so they are left alone.)
    changeLocale('zh')
  }

  updateMeta(to)
  trackPageView(to.fullPath)

  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('admin_token')
    const user = JSON.parse(localStorage.getItem('admin_user') || '{}')

    // Sessions now expire. Drop a stale one here so the user lands on the login
    // form instead of a dashboard that 401s on every request. The server checks
    // the signature regardless — this only keeps the UI honest.
    if (token && isExpired(token)) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      return next({ name: 'login' })
    }

    if (!token) {
      next({ name: 'login' })
    } else if (to.meta.role && to.meta.role !== user.role) {
      next({ name: 'admin-dashboard' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
