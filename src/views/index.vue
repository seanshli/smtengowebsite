<template>
  <main class="ed-home">
    <!-- ────────────────────────────────────────────────────────────────
         EDITORIAL HERO — 溫暖生活誌
         Magazine masthead, oversized serif headline, offset photo plate.
         Entrance is pure CSS (staggered keyframes); GSAP is reserved for
         the scroll scene below.
    ───────────────────────────────────────────────────────────────── -->
    <section id="home" class="ed-hero">
      <div class="ed-grain" aria-hidden="true"></div>

      <div class="ed-masthead">
        <span class="ed-mast-brand">enGo 智管家</span>
        <span class="ed-mast-rule" aria-hidden="true"></span>
        <span class="ed-mast-tag">{{
          locale.startsWith('zh') ? '智慧家居生活誌' : 'A LIVING HOME JOURNAL'
        }}</span>
      </div>

      <div class="ed-hero-grid">
        <div class="ed-hero-copy">
          <p class="ed-kicker">{{ $t('intextLogo') }}</p>
          <h1 class="ed-title">{{ $t('pageTitle') }}</h1>
          <p class="ed-lede">
            {{ locale === 'zh' ? $t('paragraph1') : $t('paragraphEn') }}
          </p>

          <ul class="ed-benefits">
            <li>{{ $t('whyEngoBenefit1') }}</li>
            <li>{{ $t('whyEngoBenefit2') }}</li>
            <li>{{ $t('whyEngoBenefit3') }}</li>
            <li>{{ $t('whyEngoBenefit4') }}</li>
            <li>{{ $t('whyEngoBenefit5') }}</li>
          </ul>

          <a class="ed-news-jump" href="#news" @click.prevent="scrollToNews">
            {{ $t('newsTitle') }} <span aria-hidden="true">↓</span>
          </a>
        </div>

        <figure class="ed-hero-figure">
          <img src="/images/kitchen.jpg" :alt="$t('pageTitle')" loading="eager" />
          <figcaption>
            <span class="ed-cap-initial">e</span>mbrace new
            <span class="ed-cap-initial">G</span>oals,
            <span class="ed-cap-initial">o</span>vercome
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- Signature scroll scene: the home wires itself to the hub -->
    <HomeLivingLines />

    <!-- ────────────────────────────────────────────────────────────────
         NEWS — numbered editorial index
    ───────────────────────────────────────────────────────────────── -->
    <section id="news" class="ed-news">
      <header class="ed-news-head">
        <h3 class="ed-news-heading">{{ $t('newsTitle') }}</h3>
      </header>

      <article
        v-for="(item, idx) in newsItems"
        :key="item.id"
        class="ed-news-row fade-in"
      >
        <span class="ed-news-index" aria-hidden="true">{{ String(idx + 1).padStart(2, '0') }}</span>
        <div class="ed-news-body">
          <span class="ed-news-date">{{ formatDate(item.date) }}</span>
          <h4 class="ed-news-title">{{ tr(item.title) }}</h4>
          <p class="ed-news-summary" v-html="tr(item.summary)"></p>
        </div>
        <div class="ed-news-thumb" v-if="item.image">
          <img :src="item.image" :alt="tr(item.title)" loading="lazy" />
        </div>
      </article>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import newsData from '@/data/news.json'
import { SHOW_AIR_PURIFIER } from '@/configs/systemConfig'
import HomeLivingLines from '@/components/HomeLivingLines.vue'

// News items tied to a product that may be switched off. Their summaries link
// to /product?jump=oxygen1, an anchor that does not exist while the EAP-01
// section is hidden — so the card goes with it rather than dead-ending.
const AIR_PURIFIER_NEWS_IDS = [2]

type NewsLocale = 'zh' | 'zhCN' | 'en' | 'fr' | 'ja' | 'es'

export default defineComponent({
  name: 'Home',
  components: { HomeLivingLines },
  setup() {
    const { locale } = useI18n()
    const newsItems = ref(
      newsData.filter((n) => SHOW_AIR_PURIFIER || !AIR_PURIFIER_NEWS_IDS.includes(n.id))
    )

    // Type-safe localized field accessor.
    // locale.value is typed as a broad `string` by vue-i18n, so TS can't index
    // our narrow { zh, zhCN, en, fr, ja, es } record without a cast.
    const tr = (field: Record<NewsLocale, string>): string =>
      field[locale.value as NewsLocale] || field.en

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr)
      const loc = locale.value as NewsLocale
      const dateLocale =
        loc === 'zh' || loc === 'zhCN' ? 'zh-TW' :
        loc === 'ja' ? 'ja-JP' :
        loc === 'fr' ? 'fr-FR' :
        loc === 'es' ? 'es-ES' : 'en-US'
      return date.toLocaleDateString(dateLocale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    onMounted(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      }, { threshold: 0.1 })

      document.querySelectorAll('.fade-in').forEach(el => observer.observe(el))
    })

    const scrollToNews = () => {
      const el = document.getElementById('news')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    return {
      locale,
      newsItems,
      tr,
      formatDate,
      scrollToNews
    }
  }
})
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

// ─── Editorial hero ───────────────────────────────────────────────────

.ed-home {
  background: $warm-bg-light;
}

.ed-hero {
  position: relative;
  padding: 118px 5vw 90px;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 96px 6vw 56px;
  }
}

// Paper grain: inline SVG turbulence, no asset request.
.ed-grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.ed-masthead {
  display: flex;
  align-items: baseline;
  gap: 18px;
  border-top: 3px solid $grey-blue3;
  border-bottom: 1px solid rgba($grey-blue3, 0.25);
  padding: 14px 0 12px;
  margin-bottom: clamp(36px, 7vh, 80px);
  animation: edFade 0.7s ease both;

  .ed-mast-brand {
    font-family: 'Noto Serif TC', serif;
    font-weight: 900;
    font-size: 1.05rem;
    color: $grey-blue3;
  }

  .ed-mast-rule {
    flex: 1;
    height: 1px;
    background: rgba($grey-blue3, 0.2);
  }

  .ed-mast-tag {
    font-size: 0.78rem;
    letter-spacing: 0.32em;
    color: $brand-orange;
    font-weight: 700;
    white-space: nowrap;
  }
}

.ed-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: clamp(24px, 5vw, 72px);
  align-items: start;
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.ed-kicker {
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 700;
  color: $brand-orange;
  letter-spacing: 0.14em;
  animation: edRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
}

.ed-title {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: clamp(3.2rem, 10.5vw, 8.5rem);
  line-height: 1.04;
  letter-spacing: 0.02em;
  color: $grey-blue3;
  margin: 6px 0 26px;
  animation: edReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
}

.ed-lede {
  font-size: clamp(1.02rem, 1.6vw, 1.22rem);
  line-height: 2;
  color: #454545;
  max-width: 34em;
  animation: edRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both;
}

.ed-benefits {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 22px;
  margin: 30px 0 40px;
  padding: 16px 0;
  border-top: 1px solid rgba($grey-blue3, 0.2);
  border-bottom: 1px solid rgba($grey-blue3, 0.2);
  list-style: none;
  animation: edRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.7s both;

  li {
    font-size: 0.94rem;
    font-weight: 500;
    color: $grey-blue2;
    white-space: nowrap;
  }
}

.ed-news-jump {
  display: inline-block;
  font-family: 'Noto Serif TC', serif;
  font-weight: 700;
  font-size: 1.05rem;
  color: $grey-blue3;
  text-decoration: none;
  border-bottom: 2px solid $brand-orange;
  padding-bottom: 3px;
  animation: edRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.85s both;
  transition: color 0.25s ease, border-color 0.25s ease;

  &:hover {
    color: $brand-orange;
  }

  span {
    display: inline-block;
    animation: edBounce 1.6s ease-in-out 2s infinite;
  }
}

// The photo as a mounted plate: hard offset border instead of soft shadow.
.ed-hero-figure {
  position: relative;
  margin: clamp(8px, 3vh, 40px) 0 0;
  animation: edReveal 1s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;

  img {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    border: 1px solid rgba($grey-blue3, 0.35);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 14px -14px -14px 14px;
    border: 2px solid $brand-orange;
    z-index: -1;
  }

  figcaption {
    margin-top: 12px;
    font-size: 0.8rem;
    letter-spacing: 0.18em;
    color: $dark-grey;

    .ed-cap-initial {
      color: $brand-orange;
      font-weight: 700;
    }
  }

  @media (max-width: 900px) {
    max-width: 480px;

    img {
      aspect-ratio: 16 / 10;
    }
  }
}

// ─── News: numbered editorial index ──────────────────────────────────

.ed-news {
  max-width: 1100px;
  margin: 0 auto;
  padding: 90px 5vw 100px;

  @media (max-width: 768px) {
    padding: 56px 6vw 64px;
  }
}

.ed-news-head {
  border-top: 3px solid $grey-blue3;
  padding-top: 20px;
  margin-bottom: 14px;
}

.ed-news-heading {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: clamp(1.8rem, 4.5vw, 3rem);
  color: $grey-blue3;
}

.ed-news-row {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 180px;
  gap: 26px;
  align-items: start;
  padding: 30px 0;
  border-bottom: 1px solid rgba($grey-blue3, 0.18);

  @media (max-width: 768px) {
    grid-template-columns: 44px minmax(0, 1fr);

    .ed-news-thumb {
      grid-column: 2;
    }
  }
}

.ed-news-index {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: 2rem;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1.5px $brand-orange;
  padding-top: 4px;
}

.ed-news-date {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: $brand-orange;
  margin-bottom: 6px;
}

.ed-news-title {
  font-family: 'Noto Serif TC', serif;
  font-weight: 700;
  font-size: clamp(1.1rem, 2.4vw, 1.45rem);
  line-height: 1.5;
  color: $grey-blue3;
  margin-bottom: 8px;
}

.ed-news-summary {
  font-size: 0.94rem;
  color: #5a5a5a;
  line-height: 1.85;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  // Inline links inside news summaries (rendered via v-html from news.json).
  // :deep() so scoped selectors reach v-html content.
  :deep(a) {
    color: $brand-orange;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color 0.2s ease;

    &:hover {
      color: $orange2;
    }
  }
}

.ed-news-thumb {
  img {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border: 1px solid rgba($grey-blue3, 0.3);
  }
}

// ─── Shared reveal + keyframes ────────────────────────────────────────

.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

@keyframes edFade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes edRise {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes edReveal {
  from { opacity: 0; clip-path: inset(0 0 100% 0); transform: translateY(10px); }
  to { opacity: 1; clip-path: inset(0 0 0% 0); transform: translateY(0); }
}

@keyframes edBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}

@media (prefers-reduced-motion: reduce) {
  .ed-masthead,
  .ed-kicker,
  .ed-title,
  .ed-lede,
  .ed-benefits,
  .ed-news-jump,
  .ed-news-jump span,
  .ed-hero-figure {
    animation: none;
  }

  .fade-in {
    opacity: 1;
    transform: none;
  }
}
</style>
