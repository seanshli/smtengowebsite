<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/layout/header.vue'
import Footer from '@/layout/footer.vue'
import Cookie from '@/components/cookie.vue'
import Chatbot from '@/components/Chatbot.vue'
import { useRouter } from 'vue-router'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const router = useRouter()
const scrollProgress = ref(0)

const isShowHeaderFooter = computed(() => {
  const path = window.location.pathname
  return path !== '/display' && !path.startsWith('/admin')
})

// ── Scroll progress bar + header shrink ──
function onScroll() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0

  const header = document.querySelector('.header') as HTMLElement
  if (header) {
    header.classList.toggle('scrolled', scrollTop > 50)
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <!-- Scroll progress bar -->
  <div
    class="scroll-progress"
    :style="{ width: scrollProgress + '%' }"
  ></div>

  <Header v-if="isShowHeaderFooter"></Header>
  <Cookie v-if="isShowHeaderFooter"></Cookie>
  <RouterView />
  <Chatbot v-if="isShowHeaderFooter"></Chatbot>
  <Footer v-if="isShowHeaderFooter"></Footer>
</template>
