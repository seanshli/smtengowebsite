<template>
  <section id="core-value" class="ap-page cv-page">
    <!-- tile 1, white: title, subtitle, the thesis -->
    <div class="ap-tile ap-tile-first ap-white">
      <div class="ap-wrap ap-wrap-text">
        <h1 class="ap-title">{{ $t('coreValueTitle') }}</h1>
        <p class="ap-lead fade-in">{{ $t('coreValueSubtitle') }}</p>
        <div class="cv-lede ap-prose fade-in" v-html="$t('coreValueDescribe')"></div>
      </div>
    </div>

    <!-- tile 2, parchment: the three values as cards -->
    <div class="ap-tile ap-parchment">
      <div class="ap-wrap">
        <div class="ap-grid ap-grid-3">
          <div v-for="v in values" :key="v.title" class="ap-card cv-value fade-in">
            <h2 v-if="v.title" class="ap-h3 cv-value-title">{{ v.title }}</h2>
            <p class="ap-body">{{ v.body }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- tile 3, dark: the conclusion -->
    <div class="ap-tile ap-dark">
      <div class="ap-wrap ap-wrap-text ap-center">
        <blockquote class="cv-quote fade-in">
          <p>{{ $t('coreValueConclusion') }}</p>
        </blockquote>
      </div>
    </div>
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

.cv-lede {
  margin-top: clamp(28px, 4vw, 44px);

  :deep(p) {
    font-size: 1.0625rem;
  }
}

.cv-value {
  padding: 32px;

  @media (max-width: 640px) {
    padding: 24px;
  }
}

.cv-value-title {
  margin-bottom: 12px;
}

.cv-quote {
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
</style>
