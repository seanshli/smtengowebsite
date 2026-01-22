import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/index.vue'

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
      component: () => import('@/views/index.vue')
    },
    {
      path: '/core',
      name: 'core',
      component: () => import('@/views/coreValue.vue')
    },
    {
      path: '/brand',
      name: 'brand',
      component: () => import('@/views/brandStory.vue')
    },
    {
      path: '/mission',
      name: 'mission',
      component: () => import('@/views/mission.vue')
    },
    {
      path: '/vision',
      name: 'vision',
      component: () => import('@/views/vision.vue')
    },
    {
      path: '/ecosystem',
      name: 'ecosystem',
      component: () => import('@/views/ecosystem.vue')
    },
    {
      path: '/product',
      name: 'product',
      component: () => import('@/views/product.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/contact.vue')
    },
    {
      path: '/success',
      name: 'success',
      component: () => import('@/views/success.vue')
    },
    {
      path: '/display',
      name: 'display',
      component: () => import('@/views/product.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router
