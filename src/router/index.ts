import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useSeo } from '@/utils/seo'
import { useAnalytics } from '@/utils/analytics'
import { changeLocale, i18n } from '@/main'

// Traditional Chinese is the default and stays unprefixed, so every existing
// URL and backlink keeps working. English mirrors the content routes under
// /en/*. Only these two are real for search — see public/sitemap.xml.
export const LOCALE_PREFIXES = { zh: '', en: '/en' } as const

// Pages worth indexing per language. login/success/display/admin are tools,
// not content, so they stay single-locale.
const LOCALIZED = new Set([
  'home', 'core', 'brand', 'mission', 'team', 'enviro', 'vision',
  'ecosystem', 'product', 'contact', 'packages', 'tutorial', 'cases',
  'case-detail'
])

const baseRoutes: any[] = [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/index.vue'),
      meta: {
        titleKey: 'seo.home.title',
        descKey: 'seo.home.description'
      }
    },
    {
      path: '/core',
      name: 'core',
      component: () => import('@/views/coreValue.vue'),
      meta: {
        titleKey: 'seo.core.title',
        descKey: 'seo.core.description'
      }
    },
    {
      path: '/brand',
      name: 'brand',
      component: () => import('@/views/brandStory.vue'),
      meta: {
        titleKey: 'seo.brand.title',
        descKey: 'seo.brand.description'
      }
    },
    {
      path: '/mission',
      name: 'mission',
      component: () => import('@/views/mission.vue'),
      meta: {
        titleKey: 'seo.mission.title',
        descKey: 'seo.mission.description'
      }
    },
    {
      path: '/team',
      name: 'team',
      component: () => import('@/views/team.vue'),
      meta: {
        titleKey: 'seo.team.title',
        descKey: 'seo.team.description'
      }
    },
    {
      path: '/enviro',
      name: 'enviro',
      component: () => import('@/views/enviro.vue'),
      meta: {
        titleKey: 'seo.enviro.title',
        descKey: 'seo.enviro.description'
      }
    },
    {
      path: '/vision',
      name: 'vision',
      component: () => import('@/views/vision.vue'),
      meta: {
        titleKey: 'seo.vision.title',
        descKey: 'seo.vision.description'
      }
    },
    {
      path: '/ecosystem',
      name: 'ecosystem',
      component: () => import('@/views/ecosystem.vue'),
      meta: {
        titleKey: 'seo.ecosystem.title',
        descKey: 'seo.ecosystem.description'
      }
    },
    {
      path: '/product',
      name: 'product',
      component: () => import('@/views/product.vue'),
      meta: {
        titleKey: 'seo.product.title',
        descKey: 'seo.product.description'
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/contact.vue'),
      meta: {
        titleKey: 'seo.contact.title',
        descKey: 'seo.contact.description'
      }
    },
    {
      path: '/packages',
      name: 'packages',
      component: () => import('@/views/packages.vue'),
      meta: {
        titleKey: 'seo.packages.title',
        descKey: 'seo.packages.description'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login.vue'),
      meta: {
        titleKey: 'seo.login.title',
        descKey: 'seo.login.description'
      }
    },
    {
      path: '/tutorial',
      name: 'tutorial',
      component: () => import('@/views/tutorial.vue'),
      meta: {
        titleKey: 'seo.tutorial.title',
        descKey: 'seo.tutorial.description'
      }
    },
    {
      path: '/cases',
      name: 'cases',
      component: () => import('@/views/cases.vue'),
      meta: {
        titleKey: 'seo.cases.title',
        descKey: 'seo.cases.description'
      }
    },
    {
      path: '/cases/:id',
      name: 'case-detail',
      component: () => import('@/views/CaseDetail.vue'),
      meta: {
        titleKey: 'seo.cases.title'
      }
    },
    {
      path: '/success',
      name: 'success',
      component: () => import('@/views/success.vue'),
      meta: { title: 'Success | enGo' }
    },
    {
      path: '/display',
      name: 'display',
      component: () => import('@/views/product.vue'),
      meta: { titleKey: 'seo.product.title' }
    },
    {
      path: '/admin',
      component: () => import('@/layout/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/Dashboard.vue'),
          meta: { title: 'Admin Dashboard' }
        },
        {
          path: 'members',
          name: 'admin-members',
          component: () => import('@/views/admin/Members.vue'),
          meta: { title: 'Member Management', requiresAuth: true, role: 'superuser' }
        },
        {
          path: 'profile',
          name: 'admin-profile',
          component: () => import('@/views/admin/Profile.vue'),
          meta: { title: 'My Profile', requiresAuth: true }
        }
      ]
    },
    {
      // Rendering HomeView here made every bad URL a 200 duplicate of the home
      // page — an unbounded set of indexable soft-404s.
      path: '/:pathMatch(.*)*',
      name: 'Not Found',
      component: () => import('@/views/NotFound.vue')
    }
]

// The catch-all has to stay last or it swallows /en/* before those routes are
// ever reached.
const catchAll = baseRoutes.filter((r) => String(r.path).startsWith('/:pathMatch'))
const normal = baseRoutes.filter((r) => !String(r.path).startsWith('/:pathMatch'))

const enRoutes = normal
  .filter((r) => LOCALIZED.has(String(r.name)))
  .map((r) => ({
    ...r,
    path: r.path === '/' ? '/en' : `/en${r.path}`,
    name: `en-${String(r.name)}`,
    meta: { ...(r.meta || {}), locale: 'en' }
  }))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...normal, ...enRoutes, ...catchAll],
  scrollBehavior(to, from, savedPosition) {
    // Honour #news and friends — without this, linking to /#news from another
    // page lands at the top and the section the user asked for is off-screen.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 80 } // clear the fixed header
    }
    return { top: 0 }
  }
})

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
  // The URL is the source of truth for language on the two indexed locales, so
  // /en/team renders English for a crawler — and for anyone opening the link —
  // without needing a click on the switcher first.
  const wantsEn = to.path === '/en' || to.path.startsWith('/en/')
  const current = i18n.global.locale.value
  if (wantsEn && current !== 'en') {
    changeLocale('en')
  } else if (!wantsEn && current === 'en') {
    // Leaving an /en URL: fall back to the default rather than staying English
    // on a Chinese URL, which would contradict that page's own hreflang.
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
