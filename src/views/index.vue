<template>
  <main>
    <section id="home" class="home-section">
      <div class="decorate-color-block"></div>
      <div class="home-section-bg-container">
        <img
          class="home-section-bg"
          src="/images/kitchen.jpg"
          alt="kitchen background"
          loading="eager"
        />
      </div>
      <div class="home-section-text">
        <h1 class="page-title">{{ $t('pageTitle') }}</h1>
        <h2 class="section-second-title">
          <img class="in-text-logo-engo" src="/assets/logo-orange.svg" alt="enGo Logo" />
          {{ $t('intextLogo') }}
        </h2>
        <template v-if="locale == 'zh'">
          <div class="pragraph-container">
            <p class="section-text2" >{{ $t('paragraph1') }}</p>
            <p class="section-text2" v-html="$t('paragraph2')"></p>
            <p class="section-text2">
              {{ $t('paragraph3') }}
            </p>
            <p class="section-text2">
              {{ $t('paragraph4') }}
            </p>
          </div>
        </template>
        <template v-else>
          <p class="section-text-en text-color-dark-grey">
            {{ $t('paragraphEn') }}
          </p>
        </template>
      </div>

      <!-- WHY enGo Section -->
      <div class="why-engo-section">
        <h3 class="why-engo-title">{{ $t('whyEngoTitle') }}</h3>
        <p class="why-engo-tagline-en">{{ $t('whyEngoTagline1') }}</p>
        <p class="why-engo-tagline-zh">{{ $t('whyEngoTagline2') }}</p>
        <ul class="why-engo-benefits">
          <li>{{ $t('whyEngoBenefit1') }}</li>
          <li>{{ $t('whyEngoBenefit2') }}</li>
          <li>{{ $t('whyEngoBenefit3') }}</li>
          <li>{{ $t('whyEngoBenefit4') }}</li>
          <li>{{ $t('whyEngoBenefit5') }}</li>
        </ul>
      </div>

      <div class="home-section-engo-icon-container">
        <div class="logo">
          <img class="logo-engo" src="/assets/logo.svg" alt="enGo Logo" />
        </div>
        <span class="logo-tagline">
          <span class="logo-first-letter">e</span>mbrace <span class="logo-first-letter">n</span>ew
          <span class="logo-first-letter">G</span>oals,
          <span class="logo-first-letter">o</span>vercome</span
        >
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Home',
  setup() {
    const { locale } = useI18n()

    return {
      locale
    }
  }
})
</script>

