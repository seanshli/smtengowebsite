<template>
  <div class="cookie-container" v-if="isShowCookie">
    <div class="title">{{ $t('cookie.title') }}</div>
    <div class="content" :class="{ 'is-see-all': isSeeMore }">
      {{ $t('cookie.content') }}
    </div>
    <div class="see-more" v-if="!isSeeMore">
      <u @click="seeMore">{{ $t('cookie.seeMore') }}</u>
    </div>
    <div class="btn-container">
      <div class="inner">
        <div class="btn accept" @click="closeCookie">
          <span>{{ $t('cookie.accpet') }}</span>
        </div>
        <div class="btn check">
          <span>{{ $t('cookie.check') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Mission',
  setup() {
    const isShowCookie = ref(true)
    const isSeeMore = ref(false)

    if (localStorage.getItem('acceptCookie') === 'yes') {
      isShowCookie.value = false
    }

    const closeCookie = () => {
      isShowCookie.value = false
      localStorage.setItem('acceptCookie', 'yes')
    }

    const seeMore = () => {
      isSeeMore.value = true
    }

    return {
      isShowCookie,
      closeCookie,
      seeMore,
      isSeeMore
    }
  }
})
</script>
