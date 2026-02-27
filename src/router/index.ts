import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/index.vue'
import { useSeo } from '@/utils/seo'
import { useAnalytics } from '@/utils/analytics'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
        titleKey: 'seo.about.title',
        descKey: 'seo.about.description'
      }
    },
    {
      path: '/brand',
      name: 'brand',
      component: () => import('@/views/brandStory.vue'),
      meta: {
        titleKey: 'seo.about.title',
        descKey: 'seo.about.description'
      }
    },
    {
      path: '/mission',
      name: 'mission',
      component: () => import('@/views/mission.vue'),
      meta: {
        titleKey: 'seo.about.title',
        descKey: 'seo.about.description'
      }
    },
    {
      path: '/vision',
      name: 'vision',
      component: () => import('@/views/vision.vue'),
      meta: {
        titleKey: 'seo.about.title',
        descKey: 'seo.about.description'
      }
    },
    {
      path: '/ecosystem',
      name: 'ecosystem',
      component: () => import('@/views/ecosystem.vue'),
      meta: {
        titleKey: 'seo.product.title',
        descKey: 'seo.product.description'
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
      path: '/:pathMatch(.*)*',
      name: 'Not Found',
      component: HomeView
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

const { updateMeta } = useSeo()
const { trackPageView } = useAnalytics()

router.beforeEach((to, from, next) => {
  updateMeta(to)
  trackPageView(to.fullPath)

  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('admin_token')
    const user = JSON.parse(localStorage.getItem('admin_user') || '{}')

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
