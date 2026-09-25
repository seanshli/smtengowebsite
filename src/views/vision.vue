<template>
  <!-- vsn- namespace: the .vision-* classes in _about.scss are shared with
       about.vue, so this page owns its editorial layout under its own prefix. -->
  <section id="vision" class="vsn-page">
    <!-- Editorial masthead -->
    <header class="vsn-mast">
      <h1 class="vsn-title">{{ $t('visionTitle') }}</h1>
      <p class="vsn-sub fade-in">{{ $t('visionIntextLogo') }}</p>
    </header>

    <!-- The five elements as a ruled two-column list: title in serif, body
         below, no boxes and no counters. -->
    <div class="vsn-elements">
      <article v-for="id in elements" :key="id" class="vsn-element fade-in">
        <h2 class="vsn-element-title">
          <img class="vsn-element-logo" src="/assets/logo-orange.svg" alt="enGo" />
          {{ $t(`vision.${id}.title`) }}
        </h2>
        <p class="vsn-element-copy">{{ $t(`vision.${id}.copy`) }}</p>
      </article>
    </div>

    <!-- Conclusion as a pull-quote -->
    <blockquote class="vsn-quote fade-in">
      <p>{{ $t('vision.closing') }}</p>
    </blockquote>

    <!-- Seven strategic directions: a hairline list in two columns. The old
         grey clip-art icons are gone; the words carry it. -->
    <ul class="vsn-directions">
      <li v-for="i in 7" :key="i" class="vsn-direction fade-in">{{ $t('vision' + i) }}</li>
    </ul>
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
@import '../css/utils/masthead';

.fade-in {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .fade-in {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

.vsn-page {
  background: $warm-bg-light;
  padding: 110px 5vw 100px;

  @media (max-width: 768px) {
    padding-top: 96px;
  }
}

.vsn-mast {
  max-width: 1100px;
  margin: 0 auto 48px;
  @include masthead-block;
}

.vsn-title {
  @include masthead-title;
}

.vsn-sub {
  font-family: 'Noto Serif TC', serif;
  font-weight: 700;
  font-size: clamp(1.2rem, 2.4vw, 1.7rem);
  line-height: 1.8;
  color: $grey-blue2;
  max-width: 30em;
}

// ─── five elements ───
.vsn-elements {
  max-width: 1100px;
  margin: 0 auto 72px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 clamp(32px, 5vw, 72px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.vsn-element {
  border-top: 3px solid $grey-blue3;
  padding: 22px 0 30px;
}

.vsn-element-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: clamp(1.3rem, 2.5vw, 1.7rem);
  line-height: 1.45;
  color: $grey-blue3;
  margin: 0 0 12px;
}

.vsn-element-logo {
  flex: none;
  width: auto;
  height: 1em;
}

.vsn-element-copy {
  font-size: 1.02rem;
  line-height: 1.95;
  color: #4c4c4c;
  margin: 0;
}

// ─── closing pull-quote ───
.vsn-quote {
  max-width: 1100px;
  margin: 0 auto 72px;
  border-left: 3px solid $brand-orange;
  padding-left: clamp(20px, 3vw, 36px);

  p {
    font-family: 'Noto Serif TC', serif;
    font-weight: 700;
    font-size: clamp(1.2rem, 2.6vw, 1.8rem);
    line-height: 2;
    color: $grey-blue2;
    max-width: 34em;
  }
}

// ─── seven strategic directions ───
.vsn-directions {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 clamp(32px, 5vw, 72px);
  border-top: 3px solid $grey-blue3;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.vsn-direction {
  padding: 18px 0;
  border-bottom: 1px solid rgba($grey-blue3, 0.22);
  font-family: 'Noto Serif TC', serif;
  font-weight: 700;
  font-size: clamp(1.05rem, 1.8vw, 1.25rem);
  line-height: 1.6;
  color: $grey-blue2;
}
</style>
