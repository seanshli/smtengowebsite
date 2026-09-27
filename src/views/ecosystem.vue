<template>
  <!-- eco- namespace: previously a dark global-CSS shell (_ecosystem.scss);
       now an editorial page that owns its own layout. -->
  <section id="engo-ecosystem" class="eco-page">
    <header class="eco-mast">
      <h1 class="eco-title">{{ $t('ecosystemTitle') }}</h1>
      <p class="eco-sub fade-in">
        {{ isZh
          ? '雲端、設備與生活服務，一個平台，串起整個生態。'
          : 'Cloud, devices, and everyday services, one platform, one connected ecosystem.' }}
      </p>
    </header>

    <!-- The film, mounted like every other plate in the system -->
    <figure class="eco-plate fade-in">
      <div class="eco-video">
        <iframe
          src="https://www.youtube.com/embed/sKjo04dGmfg"
          :title="$t('ecosystemTitle')"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>
      <figcaption>
        <span class="eco-cap-brand">enGo</span>
        {{ isZh ? '智慧生態系影片' : 'ecosystem film' }}
      </figcaption>
    </figure>

    <!-- One account, three doors: the wall tablet at home, the app when out,
         the store for everything you add. Real screens only (KB-001 rule). -->
    <h2 class="eco-h2 fade-in">{{ isZh ? '一組帳號，三個入口' : 'One account, three doors' }}</h2>
    <div class="eco-doors">
      <article class="eco-door fade-in">
        <div class="eco-frame eco-frame-tablet">
          <img src="/images/screens/01-home-tablet.png" :alt="isZh ? 'enGo 牆掛平板首頁' : 'enGo wall tablet home screen'" width="2000" height="1200" loading="lazy" />
        </div>
        <h3>{{ isZh ? 'enGo 牆掛平板' : 'enGo wall tablet' }}</h3>
        <p>{{ isZh ? '家中的主控台：家電、情境、平面圖即時視圖、社區公告與報修、語音操作與待機相片牆。' : 'The control hub at home: appliances, scenes, the live floor plan, community notices and repairs, voice control and the standby photo wall.' }}</p>
        <router-link to="/product" class="eco-link">{{ isZh ? '認識平板' : 'About the tablet' }} →</router-link>
      </article>
      <article class="eco-door fade-in">
        <div class="eco-frame eco-frame-phone">
          <img src="/images/screens/12-home-iphone.png" :alt="isZh ? 'enGo智慧管家 手機 App 首頁' : 'enGo home app on a phone'" width="800" height="1731" loading="lazy" />
        </div>
        <h3>{{ isZh ? '手機 App「enGo智慧管家」' : 'The enGo app on your phone' }}</h3>
        <p>{{ isZh ? '出門在外同一組帳號：家電控制、情境、社區服務、攝影機與庫存，iPhone／iPad 與 Android 免費下載。' : 'The same account when you are out: appliances, scenes, community services, cameras and inventory, free on iPhone/iPad and Android.' }}</p>
        <router-link to="/product#interfaces" class="eco-link">{{ isZh ? '三種介面' : 'The three interfaces' }} →</router-link>
      </article>
      <article class="eco-door eco-door-store fade-in">
        <div class="eco-store-mark" aria-hidden="true">
          <span class="eco-store-brand">enGo</span>
          <span class="eco-store-word">{{ $t('mallTitle') }}</span>
        </div>
        <h3>{{ $t('mallTitle') }}</h3>
        <p>{{ isZh ? '套裝方案、淨水系統與生活選品，線上選購後由專人安排安裝與服務。' : 'Packages, the water system and everyday products, ordered online and installed and serviced by our team.' }}</p>
        <a :href="shopUrl" target="_blank" rel="noopener" class="eco-link" data-track="ecosystem:store">{{ isZh ? '前往安購商城' : 'Open the enGo Store' }} →</a>
      </article>
    </div>

    <!-- Four product lines -->
    <h2 class="eco-h2 fade-in">{{ isZh ? '四條產品線' : 'Four product lines' }}</h2>
    <ul class="eco-lines">
      <li v-for="l in lines" :key="l.to" class="eco-line fade-in">
        <router-link :to="l.to" class="eco-line-link">
          <span class="eco-line-title">{{ isZh ? l.zh : l.en }}</span>
          <span class="eco-line-body">{{ isZh ? l.zhBody : l.enBody }}</span>
        </router-link>
      </li>
    </ul>

    <!-- Partners: the names the site already states on /tutorial and in the FAQ -->
    <h2 class="eco-h2 fade-in">{{ isZh ? '合作夥伴' : 'Partners' }}</h2>
    <ul class="eco-partners">
      <li v-for="p in partners" :key="p.zh" class="eco-partner fade-in">
        <span class="eco-partner-name">{{ isZh ? p.zh : p.en }}</span>
        <span class="eco-partner-role">{{ isZh ? p.zhRole : p.enRole }}</span>
      </li>
    </ul>

    <!-- Where to next -->
    <div class="eco-links fade-in">
      <router-link to="/cases" class="eco-link">
        {{ isZh ? '看實作案例' : 'See the installations' }} →
      </router-link>
      <router-link to="/contact" class="eco-link">
        {{ isZh ? '洽談合作' : 'Talk to us about partnering' }} →
      </router-link>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScrollReveal } from '../composables/useScrollReveal'
import { shopUrl } from '@/utils/shopUrl'

const LINES = [
  { to: '/product', zh: 'enGo AI 智慧中控系統', en: 'enGo AI home control', zhBody: '牆掛平板、手機 App 與雲端服務，家與社區同一套系統。', enBody: 'Wall tablet, phone app and cloud service, one system for the home and the community.' },
  { to: '/product?jump=oxygen', zh: '水維氧 AI 智慧淨水系統', en: 'AI water purification', zhBody: '三道濾心、濾芯壽命與 TDS 監測，在平板與 App 上看得見。', enBody: 'Three-stage filtration with filter life and TDS readings on the tablet and the app.' },
  { to: '/enviro', zh: '智慧環控', en: 'Environmental control', zhBody: '陽光控溫、空氣淨化監測、智慧水務與廚房安全。', enBody: 'Daylight and temperature, air quality, water and kitchen safety.' },
  { to: '/packages', zh: '套裝方案', en: 'Packages', zhBody: '基礎、進階、豪華三種組合，依坪數與需求選配。', enBody: 'Three bundles, sized to the home and what it needs.' }
]

// Same list the chatbot and FAQ 27 already give out; no component vendors.
const PARTNERS = [
  { zh: '大雅全屋裝修', en: 'Daya Whole-Home Renovation', zhRole: '台中，全屋裝修與建案智慧化，設有展示間', enRole: 'Taichung, whole-home renovation and smart developments, with a showroom' },
  { zh: '撰美室內裝修', en: 'Zhuanmei Interior Design', zhRole: '台北，全室裝修與系統櫥櫃，智慧家居展示空間', enRole: 'Taipei, interiors and system cabinetry, smart-home showroom' },
  { zh: '米多力 MEDOLE', en: 'MEDOLE', zhRole: '吊隱式新風除濕機與 3合1 智慧空氣平衡系統', enRole: 'Ceiling-concealed fresh-air dehumidifiers and the 3-in-1 air balance system' },
  { zh: '麗寶生技', en: 'Libo Biotech', zhRole: '智能富氧艙優化合作', enRole: 'Smart oxygen-chamber optimisation' },
  { zh: '合野木業', en: 'Heye Woodworks', zhRole: '智慧功能櫃，北部展示間', enRole: 'Smart functional cabinetry, showroom in northern Taiwan' },
  { zh: '嘉義達光電、金毅泰節能科技', en: 'Chia-Yi Da Optoelectronics and Jin Yi Tai Energy', zhRole: '能源與節能方案', enRole: 'Energy and energy-saving solutions' }
]

export default defineComponent({
  name: 'Ecosystem',
  setup() {
    const { locale } = useI18n()
    useScrollReveal('.fade-in', 'visible')
    const isZh = computed(() => locale.value.startsWith('zh'))
    return { isZh, shopUrl, lines: LINES, partners: PARTNERS }
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

.eco-page {
  background: $warm-bg-light;
  padding: 110px 5vw 100px;

  @media (max-width: 768px) {
    padding-top: 96px;
  }
}

.eco-mast {
  max-width: 1100px;
  margin: 0 auto 48px;
  @include masthead-block;
}

.eco-title {
  @include masthead-title;
}

.eco-sub {
  font-size: clamp(1.16rem, 2vw, 1.42rem);
  font-weight: 500;
  line-height: 1.95;
  color: $grey-blue2;
  max-width: 34em;
}

// mounted plate, same device as every other page
.eco-plate {
  position: relative;
  max-width: 960px;
  margin: 0 auto 72px;

  &::before {
    content: '';
    position: absolute;
    inset: 14px -14px -14px 14px;
    border: 2px solid $brand-orange;
    z-index: 0;
  }
}

.eco-video {
  position: relative;
  z-index: 1;
  aspect-ratio: 16 / 9;
  border: 1px solid rgba($grey-blue3, 0.5);
  box-shadow: 0 18px 38px -22px rgba(21, 41, 57, 0.55);
  background: $grey-blue3;

  iframe {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.eco-plate figcaption {
  position: relative;
  z-index: 1;
  margin-top: 12px;
  font-size: 0.85rem;
  letter-spacing: 0.16em;
  color: $dark-grey;

  .eco-cap-brand {
    font-family: 'Noto Serif TC', serif;
    font-weight: 900;
    color: $brand-orange;
    margin-right: 6px;
  }
}

.eco-h2 {
  max-width: 1100px;
  margin: 0 auto 22px;
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  line-height: 1.25;
  color: $grey-blue3;
}

// ─── three doors ───
.eco-doors {
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

.eco-door {
  border-top: 3px solid $grey-blue3;
  padding: 22px 0 8px;

  h3 {
    font-family: 'Noto Serif TC', serif;
    font-weight: 900;
    font-size: clamp(1.2rem, 2vw, 1.4rem);
    line-height: 1.3;
    color: $grey-blue3;
    margin: 18px 0 10px;
  }

  p {
    font-size: 1rem;
    line-height: 1.9;
    color: #4c4c4c;
    margin: 0 0 14px;
  }

  @media (max-width: 900px) {
    padding-bottom: 28px;
  }
}

// screens sit in the same metal frame language as the homepage, at small size
.eco-frame {
  border-radius: 14px;
  padding: 6px;
  background: linear-gradient(135deg, #f4f6f8 0%, #c4cad2 16%, #e6e9ed 34%, #adb5bf 52%, #dde1e6 70%, #b6bdc6 86%, #eef1f4 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 0 rgba(15, 23, 32, 0.28), 0 14px 32px -16px rgba($grey-blue3, 0.45);

  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 0 0 3px #0c1219;
  }
}

.eco-frame-tablet {
  aspect-ratio: 2000 / 1200;
}

.eco-frame-phone {
  // the whole phone, never cropped into a landscape box (screenshot rule):
  // the column simply runs taller than the tablet's
  width: 42%;
  border-radius: 22px;
  padding: 5px;

  img {
    border-radius: 17px;
  }
}

.eco-door-store {
  .eco-store-mark {
    aspect-ratio: 2000 / 1200;
    border-radius: 14px;
    background: $grey-blue3;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 18px 20px;
    gap: 4px;
  }

  .eco-store-brand {
    font-family: 'Noto Serif TC', serif;
    font-weight: 900;
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    line-height: 1;
    color: $orange2;
  }

  .eco-store-word {
    font-size: 0.95rem;
    letter-spacing: 0.2em;
    color: rgba($warm-bg-light, 0.85);
  }
}

// ─── product lines ───
.eco-lines {
  max-width: 1100px;
  margin: 0 auto 80px;
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

.eco-line {
  border-bottom: 1px solid rgba($grey-blue3, 0.22);
}

.eco-line-link {
  display: block;
  padding: 18px 0;
  text-decoration: none;
  color: inherit;

  &:hover .eco-line-title {
    color: $brand-orange;
  }
}

.eco-line-title {
  display: block;
  font-family: 'Noto Serif TC', serif;
  font-weight: 700;
  font-size: clamp(1.05rem, 1.8vw, 1.25rem);
  line-height: 1.5;
  color: $grey-blue2;
  transition: color 0.25s ease;
}

.eco-line-body {
  display: block;
  margin-top: 4px;
  font-size: 0.95rem;
  line-height: 1.8;
  color: #4c4c4c;
}

// ─── partners ───
.eco-partners {
  max-width: 1100px;
  margin: 0 auto 72px;
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

.eco-partner {
  padding: 16px 0;
  border-bottom: 1px solid rgba($grey-blue3, 0.22);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.eco-partner-name {
  font-family: 'Noto Serif TC', serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: $grey-blue2;
}

.eco-partner-role {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #4c4c4c;
}

.eco-links {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 16px 36px;
}

.eco-link {
  display: inline-block;
  font-family: 'Noto Serif TC', serif;
  font-weight: 700;
  font-size: 1.05rem;
  color: $grey-blue3;
  text-decoration: none;
  border-bottom: 2px solid $brand-orange;
  padding-bottom: 3px;
  transition: color 0.25s ease;

  &:hover {
    color: $brand-orange;
  }
}
</style>
