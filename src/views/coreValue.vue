<template>
  <!-- cv- namespace: previously styled by _about.scss globals; those stay
       for about.vue, this page now owns its editorial layout. -->
  <section id="core-value" class="cv-page">
    <!-- Editorial masthead -->
    <header class="cv-mast">
      <p class="cv-kicker">enGo 生活誌</p>
      <h1 class="cv-title">{{ $t('coreValueTitle') }}</h1>
      <p class="cv-sub fade-in">{{ $t('coreValueSubtitle') }}</p>
    </header>

    <!-- The thesis -->
    <div class="cv-lede fade-in" v-html="$t('coreValueDescribe')"></div>

    <!-- Three values as numbered editorial plates -->
    <div class="cv-values">
      <div v-for="i in 3" :key="i" class="cv-card fade-in">
        <span class="cv-card-num">{{ String(i).padStart(2, '0') }}</span>
        <p class="cv-card-text">{{ $t('coreValue' + i) }}</p>
      </div>
    </div>

    <!-- Conclusion as a pull-quote -->
    <blockquote class="cv-quote fade-in">
      <p>{{ $t('coreValueConclusion') }}</p>
    </blockquote>
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
    return { locale }
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

.cv-page {
  background: $warm-bg-light;
  padding: 110px 5vw 100px;

  @media (max-width: 768px) {
    padding-top: 96px;
  }
}

.cv-mast {
  max-width: 1100px;
  margin: 0 auto 48px;
  border-top: 3px solid $grey-blue3;
  padding-top: 22px;
}

.cv-kicker {
  font-size: 1.02rem;
  font-weight: 800;
  letter-spacing: 0.28em;
  color: $brand-orange;
  margin-bottom: 8px;
}

.cv-title {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: clamp(2.4rem, 7vw, 4.6rem);
  line-height: 1.1;
  color: $grey-blue3;
  margin-bottom: 14px;
}

.cv-sub {
  font-family: 'Noto Serif TC', serif;
  font-weight: 700;
  font-size: clamp(1.2rem, 2.4vw, 1.7rem);
  line-height: 1.8;
  color: $grey-blue2;
  max-width: 30em;
}

.cv-lede {
  max-width: 1100px;
  margin: 0 auto 56px;
  font-size: clamp(1.1rem, 1.9vw, 1.35rem);
  font-weight: 500;
  line-height: 2;
  color: $grey-blue2;

  :deep(p) {
    max-width: 44em;
  }
}

.cv-values {
  max-width: 1100px;
  margin: 0 auto 72px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 26px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 18px;
  }
}

.cv-card {
  position: relative;
  background: $warm-bg-light;
  border: 1px solid rgba($grey-blue3, 0.32);
  padding: 28px 26px;
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

.cv-card-num {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: 1.7rem;
  color: transparent;
  -webkit-text-stroke: 1.5px $brand-orange;
}

.cv-card-text {
  margin-top: 10px;
  font-size: 1.02rem;
  line-height: 1.95;
  color: #4c4c4c;
}

.cv-quote {
  max-width: 1100px;
  margin: 0 auto;
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
</style>
