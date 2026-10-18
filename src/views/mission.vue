<template>
  <!-- msn- namespace: the old class names collided with _about.scss's global
       .mission-section (display:flex row), so this page owns its layout. -->
  <section id="mission" class="ap-page msn-page">
    <!-- tile 1, white: title and subtitle -->
    <div class="ap-tile ap-tile-first ap-white">
      <div class="ap-wrap ap-wrap-text">
        <h1 class="ap-title">{{ $t('missionTitle') }}</h1>
        <p class="ap-lead fade-in">{{ $t('missionSubtitle') }}</p>
      </div>
    </div>

    <!-- tile 2, parchment: mission statement beside the family photo -->
    <div class="ap-tile ap-parchment">
      <div class="ap-wrap">
        <div class="msn-feature">
          <blockquote class="msn-quote fade-in">
            <p>{{ $t('fiveValues') }}</p>
          </blockquote>
          <figure class="ap-photo msn-figure fade-in">
            <!-- ponytail: NOT lazy. This is the page's primary plate and sits
                 near the fold; lazy-loading it is what left the frame empty. -->
            <img src="/images/mission-family.jpg" :alt="$t('missionTitle')" decoding="async" />
          </figure>
        </div>
      </div>
    </div>

    <!-- tile 3, white: the three values as cards -->
    <div class="ap-tile ap-white">
      <div class="ap-wrap">
        <div class="ap-grid ap-grid-3">
          <div class="ap-card msn-value fade-in" v-html="$t('fiveValues1')"></div>
          <div class="ap-card msn-value fade-in" v-html="$t('fiveValues2')"></div>
          <div class="ap-card msn-value fade-in" v-html="$t('fiveValues3')"></div>
        </div>
      </div>
    </div>

    <!-- tile 4, dark: closing statement -->
    <div class="ap-tile ap-dark">
      <div class="ap-wrap ap-wrap-text ap-center">
        <p class="msn-closing fade-in" v-html="$t('missionConclusion')"></p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScrollReveal } from '../composables/useScrollReveal'

export default defineComponent({
  name: 'Mission',
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

.msn-feature {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: clamp(32px, 5vw, 72px);
  align-items: center;

  @media (max-width: 834px) {
    grid-template-columns: 1fr;
  }
}

.msn-quote {
  margin: 0;

  p {
    margin: 0;
    font-weight: 600;
    font-size: clamp(1.75rem, 3.4vw, 3rem);
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: $ink;
  }
}

.msn-figure img {
  aspect-ratio: 4 / 5;

  @media (max-width: 834px) {
    aspect-ratio: 16 / 10;
  }
}

.msn-value {
  padding: 32px;
  font-size: 1.0625rem;
  line-height: 1.6;
  letter-spacing: -0.022em;
  color: $ink-80;

  @media (max-width: 640px) {
    padding: 24px;
  }

  // the locale strings mark the card title with <font color="e05a35">
  :deep(font[color]) {
    display: block;
    font-weight: 600;
    font-size: 1.3125rem;
    line-height: 1.25;
    letter-spacing: -0.01em;
    color: $ink;
    margin-bottom: 12px;
  }
}

.msn-closing {
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
