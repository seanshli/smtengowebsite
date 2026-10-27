<template>
  <!-- vsn- namespace: the .vision-* classes in _about.scss were shared with
       about.vue, so this page owns its layout under its own prefix. -->
  <section id="vision" class="ap-page vsn-page">
    <!-- tile 1, white: title and subtitle -->
    <div class="ap-tile ap-tile-first ap-white">
      <div class="ap-wrap ap-wrap-text">
        <h1 class="ap-title">{{ $t('visionTitle') }}</h1>
        <p class="ap-lead fade-in">{{ $t('visionIntextLogo') }}</p>
      </div>
    </div>

    <!-- tile 2, parchment: the five elements as cards -->
    <div class="ap-tile ap-parchment">
      <div class="ap-wrap">
        <div class="ap-grid ap-grid-2">
          <article v-for="id in elements" :key="id" class="ap-card vsn-element fade-in">
            <h2 class="ap-h3 vsn-element-title">
              <img class="vsn-element-logo" src="/assets/logo-orange.svg" alt="enGo" />
              {{ $t(`vision.${id}.title`) }}
            </h2>
            <p class="ap-body">{{ $t(`vision.${id}.copy`) }}</p>
          </article>
        </div>
      </div>
    </div>

    <!-- tile 3, dark: closing statement -->
    <div class="ap-tile ap-dark">
      <div class="ap-wrap ap-wrap-text ap-center">
        <blockquote class="vsn-quote fade-in">
          <p>{{ $t('vision.closing') }}</p>
        </blockquote>
      </div>
    </div>

    <!-- tile 4, white: seven strategic directions as ruled rows -->
    <div class="ap-tile ap-white">
      <div class="ap-wrap">
        <ul class="ap-rows vsn-directions">
          <li v-for="i in 7" :key="i" class="vsn-direction fade-in">{{ $t('vision' + i) }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'

// Order drives the locale lookup `vision.<id>.*`.
const ELEMENTS = ['sun', 'air', 'water', 'food', 'safety'] as const

export default defineComponent({
  name: 'Vision',
  setup() {
    useScrollReveal('.fade-in', 'visible')
    return { elements: ELEMENTS }
  }
})
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

.vsn-element {
  padding: 32px;

  @media (max-width: 640px) {
    padding: 24px;
  }
}

.vsn-element-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.vsn-element-logo {
  flex: none;
  width: auto;
  height: 1em;
}

.vsn-quote {
  margin: 0;

  p {
    margin: 0;
    font-weight: 600;
    font-size: clamp(1.5rem, 3.2vw, 2.5rem);
    line-height: 1.3;
    letter-spacing: -0.02em;
    color: #fff;
  }
}

.vsn-directions {
  border-top: 1px solid $hairline;
  columns: 2;
  column-gap: clamp(32px, 5vw, 72px);

  @media (max-width: 834px) {
    columns: 1;
  }

  // two-column list: rules per row, so undo the shared first/last special case per column
  li {
    break-inside: avoid;
    font-weight: 600;
    font-size: 1.3125rem;
    line-height: 1.35;
    letter-spacing: -0.01em;
    border-top: 0;
    border-bottom: 1px solid $hairline;
    padding: 18px 0;

    &:last-child {
      border-bottom: 1px solid $hairline;
    }
  }
}
</style>
