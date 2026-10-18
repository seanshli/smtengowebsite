<template>
  <section id="core-value" class="ap-page bs-page">
    <!-- tile 1, white: the title and the opening of the story -->
    <div class="ap-tile ap-tile-first ap-white">
      <div class="ap-wrap ap-wrap-text">
        <h1 class="ap-title">{{ $t('brand.brandStoryTitle') }}</h1>
        <h2 class="ap-lead bs-intext">{{ $t('brand.intextLogo') }}</h2>

        <div class="ap-prose bs-prose">
          <p class="fade-in" v-html="$t('brand.paragraph1')"></p>
          <p class="fade-in" v-html="$t('brand.paragraph2')"></p>
        </div>
      </div>
    </div>

    <!-- tile 2, parchment: the photograph -->
    <div class="ap-tile ap-parchment bs-photo-tile">
      <div class="ap-wrap">
        <figure class="ap-photo">
          <img src="/images/brand-morning.jpg" alt="Modern smart home interior" />
        </figure>
      </div>
    </div>

    <!-- tile 3, white: the founder story -->
    <div class="ap-tile ap-white">
      <div class="ap-wrap ap-wrap-text">
        <div class="ap-prose bs-prose">
          <p class="fade-in" v-html="$t('brand.paragraph3')"></p>
          <p class="fade-in" v-html="$t('brand.paragraph4')"></p>
        </div>
      </div>
    </div>

    <!-- tile 4, dark: the closing statement -->
    <div class="ap-tile ap-dark">
      <div class="ap-wrap ap-wrap-text ap-center">
        <p class="bs-closing fade-in" v-html="$t('brand.paragraph5')"></p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScrollReveal } from '../composables/useScrollReveal'

export default defineComponent({
  name: 'CoreValue',
  setup() {
    const { locale } = useI18n()

    useScrollReveal('.fade-in', 'visible')

    return {
      locale
    }
  }
})
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

.bs-intext {
  margin-top: 24px;
  margin-bottom: clamp(32px, 4vw, 48px);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.bs-photo-tile .ap-photo {
  max-width: 560px;
  margin: 0 auto;

  img {
    aspect-ratio: 4 / 5;
  }
}

.bs-closing {
  margin: 0;
  font-weight: 600;
  font-size: clamp(1.5rem, 3.2vw, 2.5rem);
  line-height: 1.3;
  letter-spacing: -0.02em;
  color: #fff;

  :deep(font[color]) {
    color: #fff;
    font-weight: 600;
  }
}
</style>
