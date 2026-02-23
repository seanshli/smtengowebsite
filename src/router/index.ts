import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/index.vue'
import { useSeo } from '@/utils/seo'
import { useAnalytics } from '@/utils/analytics'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'Not Found',
      component: HomeView
    },
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
  next()
})

export default router
