import {
  LOCALIZED,
  LOCALE_PREFIXES,
  routePrefixName,
  type PrefixedLocale
} from '@/utils/localePaths'

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
      path: '/legal',
      name: 'legal',
      component: () => import('@/views/legal.vue'),
      meta: {
        titleKey: 'seo.legal.title',
        descKey: 'seo.legal.description'
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
      component: () => import('@/views/NotFound.vue'),
      // Without its own meta, seo.ts falls through to the home page's title
      // and description, so every bad URL introduced itself as the home page.
      meta: { titleKey: 'seo.notFound.title', descKey: 'seo.notFound.description' }
    }
]

// The catch-all has to stay last or it swallows /en/* and /zh-cn/* before those
// routes are ever reached.
const catchAll = baseRoutes.filter((r) => String(r.path).startsWith('/:pathMatch'))
const normal = baseRoutes.filter((r) => !String(r.path).startsWith('/:pathMatch'))

// Mirror the content routes under a locale prefix. /en and /zh-cn are built by
// the same function so they cannot drift apart.
const prefixed = (locale: PrefixedLocale) =>
  normal
    .filter((r) => LOCALIZED.has(String(r.name)))
    .map((r) => ({
      ...r,
      path: r.path === '/' ? LOCALE_PREFIXES[locale] : `${LOCALE_PREFIXES[locale]}${r.path}`,
      name: routePrefixName(locale, String(r.name)),
      meta: { ...(r.meta || {}), locale }
    }))

export const routes: any[] = [...normal, ...prefixed('en'), ...prefixed('zhCN'), ...catchAll]
