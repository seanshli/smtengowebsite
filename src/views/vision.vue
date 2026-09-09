<template>
  <!-- vsn- namespace: the .vision-* classes in _about.scss are shared with
       about.vue, so this page owns its editorial layout under its own prefix. -->
  <section id="vision" class="vsn-page">
    <!-- Editorial masthead -->
    <header class="vsn-mast">
      <p class="vsn-kicker">enGo 生活誌</p>
      <h1 class="vsn-title">{{ $t('visionTitle') }}</h1>
      <p class="vsn-sub fade-in">{{ $t('visionIntextLogo') }}</p>
    </header>

    <!-- The five elements as numbered editorial plates -->
    <div class="vsn-elements">
      <article v-for="(id, i) in elements" :key="id" class="vsn-plate fade-in">
        <span class="vsn-plate-num">{{ String(i + 1).padStart(2, '0') }}</span>
        <h2 class="vsn-plate-title">
          <img class="vsn-plate-logo" src="/assets/logo-orange.svg" alt="enGo" />
          {{ $t(`vision.${id}.title`) }}
        </h2>
        <p class="vsn-plate-copy">{{ $t(`vision.${id}.copy`) }}</p>
      </article>
    </div>

    <!-- Conclusion as a pull-quote -->
    <blockquote class="vsn-quote fade-in">
      <p>{{ $t('vision.closing') }}</p>
    </blockquote>

    <!-- Seven strategic directions -->
    <div class="vsn-blocks">
      <div v-for="(b, i) in blocks" :key="b.icon" class="vsn-block fade-in">
        <span class="vsn-block-num">{{ String(i + 1).padStart(2, '0') }}</span>
        <img class="vsn-block-img" :src="b.icon" :alt="b.alt" />
        <p class="vsn-block-text">{{ $t('vision' + (i + 1)) }}</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'

// Order drives both the numbering and the locale lookup `vision.<id>.*`.
const ELEMENTS = ['sun', 'air', 'water', 'food', 'safety'] as const

// Text comes from the existing flat vision1..vision7 keys, by position.
const BLOCKS = [
  { icon: '/images/business-model-icon.svg', alt: 'business model icon' },
  { icon: '/images/artificial-intelligence-ai-icon.svg', alt: 'artificial intelligence ai icon' },
  { icon: '/images/sharing-icon.svg', alt: 'branding icon' },
  { icon: '/images/shelf-shelves-icon.svg', alt: 'shelves icon' },
  { icon: '/images/iot-icon.svg', alt: 'iot icon' },
  { icon: '/images/engo-coin.svg', alt: 'enGo icon' },
  { icon: '/images/b2b2c.svg', alt: 'b2b2c framework icon' }
]

export default defineComponent({
  name: 'Vision',
  setup() {
    useScrollReveal('.fade-in', 'visible')
    return { elements: ELEMENTS, blocks: BLOCKS }
  }
})
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

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
  border-top: 3px solid $grey-blue3;
  padding-top: 22px;
}

.vsn-kicker {
  font-size: 1.02rem;
  font-weight: 800;
  letter-spacing: 0.28em;
  color: $brand-orange;
  margin-bottom: 8px;
}

.vsn-title {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: clamp(2.4rem, 7vw, 4.6rem);
  line-height: 1.1;
  color: $grey-blue3;
  margin-bottom: 14px;
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
  margin: 0 auto 64px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 26px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 18px;
  }
}

.vsn-plate {
  position: relative;
  background: $warm-bg-cream;
  border: 1px solid rgba($grey-blue3, 0.32);
  border-radius: 0;
  padding: 30px 28px 26px;
  transition: transform 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 8px -8px -8px 8px;
    border: 2px solid transparent;
    transition: border-color 0.3s ease;
    z-index: -1;
  }

  &:hover {
    transform: translate(-3px, -3px);

    &::before {
      border-color: $brand-orange;
    }
  }
}

.vsn-plate-num {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: 1.7rem;
  color: transparent;
  -webkit-text-stroke: 1.5px $brand-orange;
}

.vsn-plate-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: clamp(1.3rem, 2.5vw, 1.7rem);
  line-height: 1.45;
  color: $grey-blue3;
  margin: 10px 0 12px;
}

.vsn-plate-logo {
  flex: none;
  width: auto;
  height: 1em;
}

.vsn-plate-copy {
  font-size: 1.02rem;
  line-height: 1.95;
  color: #4c4c4c;
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
.vsn-blocks {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
}

.vsn-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  background: $warm-bg-cream;
  border: 1px solid rgba($grey-blue3, 0.32);
  border-radius: 0;
  padding: 24px 22px;
  transition: transform 0.3s ease, border-color 0.3s ease;

  &:hover {
    transform: translate(-3px, -3px);
    border-color: $brand-orange;
  }
}

.vsn-block-num {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: 1.4rem;
  color: transparent;
  -webkit-text-stroke: 1.3px $brand-orange;
}

.vsn-block-img {
  width: 56px;
  height: 56px;
  object-fit: contain;
}

.vsn-block-text {
  font-size: 1rem;
  line-height: 1.8;
  font-weight: 600;
  color: $grey-blue2;
}
</style>
