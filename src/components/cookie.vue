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
        <button type="button" class="btn accept" @click="closeCookie">
          <span>{{ $t('cookie.accpet') }}</span>
        </button>
        <!-- Refusing has to be exactly as easy as accepting. -->
        <button type="button" class="btn check" @click="rejectCookie">
          <span>{{ $t('cookie.reject') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getConsent, setConsent } from '@/utils/consent'

export default defineComponent({
  name: 'CookieBanner',
  setup() {
    // Only ask visitors who have not answered yet.
    const isShowCookie = ref(getConsent() === null)
    const isSeeMore = ref(false)

    const closeCookie = () => {
      isShowCookie.value = false
      setConsent('granted')
    }

    const rejectCookie = () => {
      isShowCookie.value = false
      setConsent('denied')
    }

    const seeMore = () => {
      isSeeMore.value = true
    }

    return {
      isShowCookie,
      closeCookie,
      rejectCookie,
      seeMore,
      isSeeMore
    }
  }
})
</script>
