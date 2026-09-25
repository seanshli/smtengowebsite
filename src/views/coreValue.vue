<template>
  <!-- cv- namespace: previously styled by _about.scss globals; those stay
       for about.vue, this page now owns its editorial layout. -->
  <section id="core-value" class="cv-page">
    <!-- Editorial masthead -->
    <header class="cv-mast">
      <h1 class="cv-title">{{ $t('coreValueTitle') }}</h1>
      <p class="cv-sub fade-in">{{ $t('coreValueSubtitle') }}</p>
    </header>

    <!-- The thesis -->
    <div class="cv-lede fade-in" v-html="$t('coreValueDescribe')"></div>

    <!-- Three values as ruled columns: no boxes, no counters. The 3px rule is
         the same letterpress device as the masthead, so the page reads as one
         printed sheet rather than a row of cards. -->
    <div class="cv-values">
      <div v-for="v in values" :key="v.title" class="cv-value fade-in">
        <h2 class="cv-value-title">{{ v.title }}</h2>
        <p class="cv-value-text">{{ v.body }}</p>
      </div>
    </div>

    <!-- Conclusion as a pull-quote -->
    <blockquote class="cv-quote fade-in">
      <p>{{ $t('coreValueConclusion') }}</p>
    </blockquote>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScrollReveal } from '../composables/useScrollReveal'

export default defineComponent({
  name: 'CoreValue',
  setup() {
    const { t, locale } = useI18n()
    useScrollReveal('.fade-in', 'visible')
    // The locale strings are "title - body"; locales without the separator
    // (fr) render the whole line as the body under no title.
    const values = computed(() =>
      [1, 2, 3].map((i) => {
        const raw = t('coreValue' + i)
        const at = raw.indexOf(' - ')
        return at > 0 ? { title: raw.slice(0, at), body: raw.slice(at + 3) } : { title: '', body: raw }
      })
    )
    return { locale, values }
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
  @include masthead-block;
}

.cv-title {
  @include masthead-title;
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
  margin: 0 auto 80px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0 clamp(28px, 4vw, 56px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

.cv-value {
  border-top: 3px solid $grey-blue3;
  padding: 22px 0 8px;

  @media (max-width: 900px) {
    padding-bottom: 28px;
  }
}

.cv-value-title {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: clamp(1.35rem, 2.4vw, 1.7rem);
  line-height: 1.3;
  color: $grey-blue3;
  margin: 0 0 12px;

  &:empty {
    display: none;
  }
}

.cv-value-text {
  font-size: 1.05rem;
  line-height: 1.95;
  color: #4c4c4c;
  margin: 0;
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
