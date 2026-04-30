<template>
  <main>
    <section id="home" class="home-section">
      <div class="decorate-color-block"></div>
      <div class="home-section-bg-container">
        <img
          class="home-section-bg"
          src="/images/kitchen.jpg"
          alt="kitchen background"
          loading="eager"
        />
      </div>
      <div class="home-section-text">
        <h1 class="page-title">{{ $t('pageTitle') }}</h1>
        <h2 class="section-second-title">
          <img class="in-text-logo-engo" src="/assets/logo-orange.svg" alt="enGo Logo" />
          {{ $t('intextLogo') }}
        </h2>
        <template v-if="locale == 'zh'">
          <div class="pragraph-container">
            <p class="section-text2" >{{ $t('paragraph1') }}</p>
            <p class="section-text2" v-html="$t('paragraph2')"></p>
            <p class="section-text2">
              {{ $t('paragraph3') }}
            </p>
            <p class="section-text2">
              {{ $t('paragraph4') }}
            </p>
          </div>
        </template>
        <template v-else>
          <p class="section-text-en text-color-dark-grey">
            {{ $t('paragraphEn') }}
          </p>
        </template>
      </div>

      <!-- WHY enGo Section -->
      <div class="why-engo-section">
        <h3 class="why-engo-title">{{ $t('whyEngoTitle') }}</h3>
        <p class="why-engo-tagline-en">{{ $t('whyEngoTagline1') }}</p>
        <p class="why-engo-tagline-zh">{{ $t('whyEngoTagline2') }}</p>
        <ul class="why-engo-benefits">
          <li>{{ $t('whyEngoBenefit1') }}</li>
          <li>{{ $t('whyEngoBenefit2') }}</li>
          <li>{{ $t('whyEngoBenefit3') }}</li>
          <li>{{ $t('whyEngoBenefit4') }}</li>
          <li>{{ $t('whyEngoBenefit5') }}</li>
        </ul>
      </div>

      <!-- Quick jump to news -->
      <a class="news-jump-btn" href="#news" @click.prevent="scrollToNews">
        <span class="news-jump-label">{{ $t('newsTitle') }}</span>
        <span class="news-jump-arrow">&#8595;</span>
      </a>

      <div class="home-section-engo-icon-container">
        <div class="logo">
          <img class="logo-engo" src="/assets/logo.svg" alt="enGo Logo" />
        </div>
        <span class="logo-tagline">
          <span class="logo-first-letter">e</span>mbrace <span class="logo-first-letter">n</span>ew
          <span class="logo-first-letter">G</span>oals,
          <span class="logo-first-letter">o</span>vercome</span
        >
      </div>
    </section>

    <!-- News Section — outside home-section so it has its own space -->
    <section id="news" class="news-section">
      <h3 class="news-section-title">{{ $t('newsTitle') }}</h3>
      <div class="news-grid">
        <div
          v-for="item in newsItems"
          :key="item.id"
          class="news-card fade-in"
        >
          <div class="news-card-image" v-if="item.image">
            <img :src="item.image" :alt="tr(item.title)" />
          </div>
          <div class="news-card-body">
            <span class="news-date">{{ formatDate(item.date) }}</span>
            <h4 class="news-title">{{ tr(item.title) }}</h4>
            <p class="news-summary" v-html="tr(item.summary)"></p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import newsData from '@/data/news.json'

type NewsLocale = 'zh' | 'zhCN' | 'en' | 'fr' | 'ja' | 'es'

export default defineComponent({
  name: 'Home',
  setup() {
    const { locale } = useI18n()
    const newsItems = ref(newsData)

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
.news-jump-btn {
  position: absolute;
  bottom: 100px;
  right: 40px;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  cursor: pointer;
  animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 1.2s both;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);

    .news-jump-arrow {
      transform: translateY(3px);
    }
  }

  @media (max-width: 768px) {
    bottom: 30px;
    right: 20px;
  }
}

.news-jump-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.08em;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
  background: rgba(224, 90, 53, 0.85);
  padding: 6px 16px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
}

.news-jump-arrow {
  font-size: 1.1rem;
  color: #fff;
  animation: bounceDown 1.5s ease-in-out infinite;
  transition: transform 0.3s ease;
}

@keyframes bounceDown {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

.news-section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 40px 60px;
  background: #fff;

  @media (max-width: 768px) {
    padding: 50px 20px 40px;
  }
}

.news-section-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 40px;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 48px;
    height: 3px;
    background: linear-gradient(90deg, #e05a35, #FE8B05);
    margin: 12px auto 0;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 28px;
  }
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

.news-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0ebe8;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 28px rgba(224, 90, 53, 0.1);
  }
}

.news-card-image {
  width: 100%;
  height: 180px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .news-card:hover & img {
    transform: scale(1.04);
  }

  @media (max-width: 768px) {
    height: 160px;
  }
}

.news-card-body {
  padding: 20px 24px 24px;

  @media (max-width: 768px) {
    padding: 16px 18px 20px;
  }
}

.news-date {
  display: inline-block;
  font-size: 0.82rem;
  color: #e05a35;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 0.02em;
}

.news-title {
  font-size: 1.08rem;
  font-weight: 600;
  color: #333;
  line-height: 1.5;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
}

.news-summary {
  font-size: 0.92rem;
  color: #666;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;

  // Inline links inside news summaries (rendered via v-html from news.json).
  // Use :deep() so Vue's <style scoped> data-attribute selectors penetrate
  // into v-html content — without :deep() the rule doesn't match because
  // v-html-rendered <a> tags don't get the scoped data-v-xxxx attr.
  // Coral underline + hover deepens — keeps brand consistency with CTAs.
  :deep(a) {
    color: #e05a35;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color 0.2s ease;

    &:hover {
      color: #FE8B05;
    }
  }
}
</style>
