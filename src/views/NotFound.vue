<template>
  <section class="nf">
    <div class="nf-inner">
      <p class="nf-kicker">404</p>
      <h1 class="nf-title">
        {{ isZh ? '這個頁面不存在。' : 'This page does not exist.' }}
      </h1>
      <p class="nf-sub">
        {{ isZh
          ? '連結可能已經變更或失效。以下是幾個常去的地方：'
          : 'The link may have changed or expired. Here are some places to go instead:' }}
      </p>

      <div class="nf-links">
        <router-link to="/">{{ $t('homeTitle') }} →</router-link>
        <router-link to="/product">{{ $t('productTitle') }} →</router-link>
        <router-link to="/cases">{{ $t('casesTitle') }} →</router-link>
        <router-link to="/contact">{{ $t('contactTitle') }} →</router-link>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

// A Vue SPA behind Vercel's catch-all rewrite cannot return a real 404 status:
// the platform has already answered 200 with index.html before any JS runs.
// The next best thing, and what Google documents for exactly this case, is to
// make the page unmistakably a 404 — a robots noindex plus visible "not found"
// content — so it gets dropped from the index rather than treated as another
// copy of the home page, which is what rendering HomeView here used to cause.
const ROBOTS_ID = 'nf-robots-noindex'

export default defineComponent({
  name: 'NotFound',
  setup() {
    const { locale } = useI18n()
    const isZh = computed(() => locale.value.startsWith('zh'))

    onMounted(() => {
      if (document.getElementById(ROBOTS_ID)) return
      const meta = document.createElement('meta')
      meta.id = ROBOTS_ID
      meta.name = 'robots'
      meta.content = 'noindex, follow'
      document.head.appendChild(meta)
    })

    // Leaving it behind would tag the next route noindex too.
    onUnmounted(() => {
      document.getElementById(ROBOTS_ID)?.remove()
    })

    return { isZh }
  }
})
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

.nf {
  background: $warm-bg-light;
  min-height: 68vh;
  display: flex;
  align-items: center;
  padding: 140px 5vw 110px;
}

.nf-inner {
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  border-top: 3px solid $grey-blue3;
  padding-top: 22px;
}

.nf-kicker {
  font-size: 1.02rem;
  font-weight: 800;
  letter-spacing: 0.28em;
  color: $brand-orange;
  margin-bottom: 8px;
}

.nf-title {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: clamp(2.2rem, 6vw, 4.2rem);
  line-height: 1.1;
  color: $grey-blue3;
  margin-bottom: 14px;
}

.nf-sub {
  font-size: clamp(1.05rem, 2vw, 1.3rem);
  line-height: 1.9;
  color: $grey-blue2;
  max-width: 34em;
}

.nf-links {
  margin-top: 34px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px 34px;

  a {
    font-family: 'Noto Serif TC', serif;
    font-weight: 700;
    font-size: 1.05rem;
    color: $grey-blue3;
    text-decoration: none;
    border-bottom: 2px solid $brand-orange;
    padding-bottom: 3px;
    transition: color 0.25s ease;

    &:hover,
    &:focus-visible {
      color: $brand-orange;
    }
  }
}
</style>
