<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/layout/header.vue'
import Footer from '@/layout/footer.vue'
import Cookie from '@/components/cookie.vue'
import Chatbot from '@/components/Chatbot.vue'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const isShowHeaderFooter = computed(() => {
  return window.location.pathname !== '/display'
})
</script>

<template>
  <Header v-if="isShowHeaderFooter"></Header>
  <Cookie v-if="isShowHeaderFooter"></Cookie>
  <RouterView />
  <Chatbot v-if="isShowHeaderFooter"></Chatbot>
  <Footer v-if="isShowHeaderFooter"></Footer>
</template>
