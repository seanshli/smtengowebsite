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
          <!-- Remotion-rendered 8s seamless loop (video/src/HeroLoop.tsx).
               Poster + nested img keep the frame meaningful before load and
               wherever autoplay is denied. -->
          <video
            class="ed-hero-media"
            autoplay
            muted
            loop
            playsinline
            preload="metadata"
            poster="/images/hero-home.jpg"
            :aria-label="$t('pageTitle')"
          >
            <source src="/videos/hero-loop.mp4" type="video/mp4" />
            <img src="/images/hero-home.jpg" :alt="$t('pageTitle')" loading="eager" />
          </video>
          <figcaption>
            <span class="ed-cap-initial">e</span>mbrace
            <span class="ed-cap-initial">n</span>ew
            <span class="ed-cap-initial">G</span>oals,
            <span class="ed-cap-initial">o</span>vercome
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- Signature scroll scenes: the home wires itself to the hub (HMS),
         then the building assembles under one dashboard (BMS) -->
    <HomeLivingLines />
    <BuildingBmsScene />

    <!-- ────────────────────────────────────────────────────────────────
         NEWS — 翻閱生活誌: a flippable broadsheet folio
    ───────────────────────────────────────────────────────────────── -->
    <section id="news" class="ed-news">
      <header class="ed-news-head">
        <p class="ed-news-kicker">enGo 生活誌</p>
        <h3 class="ed-news-heading">
          <template v-if="locale === 'zh'">我們的故事，我們的旅程</template>
          <template v-else-if="locale === 'zhCN'">我们的故事，我们的旅程</template>
          <template v-else>
            our <span class="ed-cap-accent">S</span>tory, our <span class="ed-cap-accent">J</span>ourney
          </template>
        </h3>
        <p class="ed-news-sub">
          {{ locale.startsWith('zh') ? 'our Story, our Journey — 最新消息' : $t('newsTitle') }}
        </p>
      </header>

      <NewsFolio :items="newsItems" />
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import newsData from '@/data/news.json'
import { SHOW_AIR_PURIFIER } from '@/configs/systemConfig'
import HomeLivingLines from '@/components/HomeLivingLines.vue'
import BuildingBmsScene from '@/components/BuildingBmsScene.vue'
import NewsFolio from '@/components/NewsFolio.vue'

// News items tied to a product that may be switched off. Their summaries link
// to /product?jump=oxygen1, an anchor that does not exist while the EAP-01
// section is hidden — so the card goes with it rather than dead-ending.
const AIR_PURIFIER_NEWS_IDS = [2]

export default defineComponent({
  name: 'Home',
  components: { HomeLivingLines, BuildingBmsScene, NewsFolio },
  setup() {
    const { locale } = useI18n()
    const newsItems = ref(
      newsData.filter((n) => SHOW_AIR_PURIFIER || !AIR_PURIFIER_NEWS_IDS.includes(n.id))
    )

    const scrollToNews = () => {
      const el = document.getElementById('news')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    return {
      locale,
      newsItems,
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

// letterpress: the Taiwanese-vernacular kicker is a voice, not a label — set it loud.
.ed-kicker {
  font-family: 'Noto Serif TC', serif;
  font-size: clamp(1.45rem, 3.1vw, 2rem);
  font-weight: 900;
  color: $brand-orange;
  letter-spacing: 0.08em;
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
  font-size: clamp(1.16rem, 1.9vw, 1.4rem);
  font-weight: 500;
  line-height: 1.95;
  color: $grey-blue2;
  max-width: 32em;
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

  img,
  .ed-hero-media {
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
      font-weight: 900;
    }
  }

  @media (max-width: 900px) {
    max-width: 480px;

    img,
    .ed-hero-media {
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

.ed-news-kicker {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  color: $brand-orange;
  margin-bottom: 6px;
}

.ed-news-heading {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: clamp(1.8rem, 4.5vw, 3rem);
  color: $grey-blue3;

  // capital accents echo the brand's "embrace new Goals, overcome" treatment
  .ed-cap-accent {
    color: $brand-orange;
  }
}

.ed-news-sub {
  font-size: clamp(0.95rem, 1.8vw, 1.15rem);
  color: $dark-grey;
  margin-top: 6px;
  margin-bottom: 26px;
}

// ─── Keyframes ────────────────────────────────────────────────────────

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
}
</style>
