<template>
  <!-- eco- namespace: previously a dark global-CSS shell (_ecosystem.scss);
       now a tile page that owns its layout. -->
  <section id="engo-ecosystem" class="ap-page eco-page">
    <!-- tile 1, white: title and subtitle -->
    <div class="ap-tile ap-tile-first ap-white eco-head-tile">
      <div class="ap-wrap ap-center">
        <h1 class="ap-title">{{ $t('ecosystemTitle') }}</h1>
        <p class="ap-lead fade-in">
          {{ isZh
            ? '雲端、設備與生活服務，一個平台，串起整個生態。'
            : 'Cloud, devices, and everyday services, one platform, one connected ecosystem.' }}
        </p>
      </div>
    </div>

    <!-- tile 2, dark: the film -->
    <div class="ap-tile ap-dark">
      <div class="ap-wrap">
        <figure class="ap-photo eco-plate fade-in">
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
            <strong class="eco-cap-brand">enGo</strong>
            {{ isZh ? '智慧生態系影片' : 'ecosystem film' }}
          </figcaption>
        </figure>
      </div>
    </div>

    <!-- tile 3, white: one account, three doors: the wall tablet at home, the app
         when out, the store for everything you add. Real screens only (KB-001 rule). -->
    <div class="ap-tile ap-white">
      <div class="ap-wrap">
        <div class="ap-head ap-center">
          <h2 class="ap-h2 fade-in">{{ isZh ? '一組帳號，三個入口' : 'One account, three doors' }}</h2>
        </div>
        <div class="ap-grid ap-grid-3 eco-doors">
          <article class="ap-card eco-door fade-in">
            <div class="eco-media">
              <div class="eco-frame eco-frame-tablet">
                <img src="/images/screens/01-home-tablet.png" :alt="isZh ? 'enGo 牆掛平板首頁' : 'enGo wall tablet home screen'" width="2000" height="1200" loading="lazy" />
              </div>
            </div>
            <div class="eco-door-text">
              <h3 class="ap-h3">{{ isZh ? 'enGo 牆掛平板' : 'enGo wall tablet' }}</h3>
              <p class="ap-body">{{ isZh ? '家中的主控台：家電、情境、平面圖即時視圖、社區公告與報修、語音操作與待機相片牆。' : 'The control hub at home: appliances, scenes, the live floor plan, community notices and repairs, voice control and the standby photo wall.' }}</p>
              <router-link to="/product" class="ap-link">{{ isZh ? '認識平板' : 'About the tablet' }}</router-link>
            </div>
          </article>
          <article class="ap-card eco-door fade-in">
            <div class="eco-media">
              <div class="eco-frame eco-frame-phone">
                <img src="/images/screens/12-home-iphone.png" :alt="isZh ? 'enGo智慧管家 手機 App 首頁' : 'enGo home app on a phone'" width="800" height="1731" loading="lazy" />
              </div>
            </div>
            <div class="eco-door-text">
              <h3 class="ap-h3">{{ isZh ? '手機 App「enGo智慧管家」' : 'The enGo app on your phone' }}</h3>
              <p class="ap-body">{{ isZh ? '出門在外同一組帳號：家電控制、情境、社區服務、攝影機與庫存，iPhone／iPad 與 Android 免費下載。' : 'The same account when you are out: appliances, scenes, community services, cameras and inventory, free on iPhone/iPad and Android.' }}</p>
              <router-link to="/product#interfaces" class="ap-link">{{ isZh ? '三種介面' : 'The three interfaces' }}</router-link>
            </div>
          </article>
          <article class="ap-card eco-door eco-door-store fade-in">
            <div class="eco-media">
              <div class="eco-store-mark" aria-hidden="true">
                <span class="eco-store-brand">enGo</span>
                <span class="eco-store-word">{{ $t('mallTitle') }}</span>
              </div>
            </div>
            <div class="eco-door-text">
              <h3 class="ap-h3">{{ $t('mallTitle') }}</h3>
              <p class="ap-body">{{ isZh ? '套裝方案、淨水系統與生活選品，線上選購後由專人安排安裝與服務。' : 'Packages, the water system and everyday products, ordered online and installed and serviced by our team.' }}</p>
              <a :href="SHOP_URL" target="_blank" rel="noopener" class="ap-link" data-track="ecosystem:store">{{ isZh ? '前往安購商城' : 'Open the enGo Store' }}</a>
            </div>
          </article>
        </div>
      </div>
    </div>

    <!-- tile 4, parchment: five product lines -->
    <div class="ap-tile ap-parchment">
      <div class="ap-wrap">
        <div class="ap-head ap-center">
          <h2 class="ap-h2 fade-in">{{ isZh ? '五條產品線' : 'Five product lines' }}</h2>
        </div>
        <ul class="eco-lines">
          <li v-for="l in lines" :key="l.to" class="fade-in">
            <router-link :to="l.to" class="ap-card eco-line-link">
              <span class="eco-line-title">{{ isZh ? l.zh : l.en }}</span>
              <span class="eco-line-body">{{ isZh ? l.zhBody : l.enBody }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <!-- tile 5, white: partners (names and roles only) and where to next -->
    <div class="ap-tile ap-white">
      <div class="ap-wrap ap-wrap-text">
        <div class="ap-head ap-center">
          <h2 class="ap-h2 fade-in">{{ isZh ? '合作夥伴' : 'Partners' }}</h2>
        </div>
        <ul class="ap-rows eco-partners">
          <li v-for="p in partners" :key="p.zh" class="eco-partner fade-in">
            <a
              v-if="p.url"
              :href="p.url"
              target="_blank"
              rel="noopener"
              class="ap-link eco-partner-name eco-partner-link"
              data-track="ecosystem:partner"
            >{{ isZh ? p.zh : p.en }}</a>
            <span v-else class="eco-partner-name">{{ isZh ? p.zh : p.en }}</span>
            <span class="eco-partner-role">{{ isZh ? p.zhRole : p.enRole }}</span>
          </li>
        </ul>

        <div class="ap-links eco-next fade-in">
          <router-link to="/cases" class="ap-link">
            {{ isZh ? '看實作案例' : 'See the installations' }}
          </router-link>
          <router-link to="/contact" class="ap-link">
            {{ isZh ? '洽談合作' : 'Talk to us about partnering' }}
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScrollReveal } from '../composables/useScrollReveal'
import { SHOP_URL } from '@/utils/shopUrl'

const LINES = [
  { to: '/product', zh: 'enGo AI 智慧中控系統', en: 'enGo AI home control', zhBody: '牆掛平板、手機 App 與雲端服務，家與社區同一套系統。', enBody: 'Wall tablet, phone app and cloud service, one system for the home and the community.' },
  { to: '/product?jump=oxygen', zh: '水維氧 AI 智慧淨水系統', en: 'AI water purification', zhBody: '三道濾心、濾芯壽命與 TDS 監測，在平板與 App 上看得見。', enBody: 'Three-stage filtration with filter life and TDS readings on the tablet and the app.' },
  { to: '/enviro', zh: '智慧環控', en: 'Environmental control', zhBody: '陽光控溫、空氣淨化監測、智慧水務與廚房安全。', enBody: 'Daylight and temperature, air quality, water and kitchen safety.' },
  { to: '/packages', zh: '套裝方案', en: 'Packages', zhBody: '基礎、進階、豪華三種組合，依坪數與需求選配。', enBody: 'Three bundles, sized to the home and what it needs.' },
  { to: '/product#shop', zh: '智管家商城', en: 'enGo Store', zhBody: '社區訂閱與鄰里市集，生鮮、日用與智慧家居送到家門口。', enBody: 'Community subscriptions and a neighbourhood marketplace, delivered to your door.' }
]

// Same list the chatbot and FAQ 27 already give out; no component vendors.
// url only where the site is known; the rest stay plain text.
const PARTNERS: { zh: string; en: string; zhRole: string; enRole: string; url?: string }[] = [
  { zh: '大雅全屋裝修', en: 'Daya Whole-Home Renovation', url: 'https://www.tayakitchen.com.tw/', zhRole: '台中，全屋裝修與建案智慧化，設有展示間', enRole: 'Taichung, whole-home renovation and smart developments, with a showroom' },
  { zh: '撰美室內裝修', en: 'Zhuanmei Interior Design', zhRole: '台北，全室裝修與系統櫥櫃，智慧家居展示空間', enRole: 'Taipei, interiors and system cabinetry, smart-home showroom' },
  { zh: '米多力 MEDOLE', en: 'MEDOLE', url: 'https://www.medole.com.tw/', zhRole: '吊隱式新風除濕機與 3合1 智慧空氣平衡系統', enRole: 'Ceiling-concealed fresh-air dehumidifiers and the 3-in-1 air balance system' },
  { zh: '麗寶生技', en: 'Libo Biotech', zhRole: '智能富氧艙優化合作', enRole: 'Smart oxygen-chamber optimisation' },
  { zh: '合野木業', en: 'Heye Woodworks', url: 'https://www.he-ye.com/', zhRole: '智慧功能櫃，北部展示間', enRole: 'Smart functional cabinetry, showroom in northern Taiwan' },
  { zh: '嘉義達光電、金毅泰節能科技', en: 'Chia-Yi Da Optoelectronics and Jin Yi Tai Energy', zhRole: '能源與節能方案', enRole: 'Energy and energy-saving solutions' }
]

export default defineComponent({
  name: 'Ecosystem',
  setup() {
    const { locale } = useI18n()
    useScrollReveal('.fade-in', 'visible')
    const isZh = computed(() => locale.value.startsWith('zh'))
    return { isZh, SHOP_URL, lines: LINES, partners: PARTNERS }
  }
})
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

// the film: a radius-18 frame resting on the dark tile, caption below
.eco-plate {
  max-width: 980px;
  margin: 0 auto;

  figcaption {
    color: $on-dark-muted;
  }
}

.eco-video {
  aspect-ratio: 16 / 9;
  border-radius: 18px;
  overflow: hidden;
  background: #000;

  iframe {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.eco-cap-brand {
  font-weight: 600;
  color: #fff;
  margin-right: 6px;
}

// ─── three doors ───
.eco-doors {
  gap: clamp(20px, 2.5vw, 32px);
}

.eco-door {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.eco-media {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  padding: 32px 28px 8px;
}

.eco-door-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 20px 28px 28px;

  .ap-body {
    margin-bottom: 4px;
  }
}

// screens sit in the brushed-titanium frame from the homepage, with the one product shadow
@mixin metal-frame($radius, $pad, $glass, $screen-radius) {
  position: relative;
  border-radius: $radius;
  padding: $pad;
  background:
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.07) 0 1px, transparent 1px 3px),
    linear-gradient(135deg, #f4f6f8 0%, #c4cad2 16%, #e6e9ed 34%, #adb5bf 52%, #dde1e6 70%, #b6bdc6 86%, #eef1f4 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 0 rgba(15, 23, 32, 0.28), $product-shadow;

  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: $screen-radius;
    box-shadow: 0 0 0 $glass #0c1219, 0 0 0 ($glass + 1px) rgba(255, 255, 255, 0.12);
  }
}

.eco-frame-tablet {
  @include metal-frame(18px, 10px, 5px, 9px);
  width: 100%;
}

.eco-frame-phone {
  // the whole phone, never cropped into a landscape box (screenshot rule)
  @include metal-frame(34px, 9px, 5px, 22px);
  width: 46%;
  max-width: 150px;
}

.eco-store-mark {
  width: 100%;
  aspect-ratio: 2000 / 1200;
  border-radius: 18px;
  background: $tile-dark;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 18px 22px;
  gap: 4px;
}

.eco-store-brand {
  font-weight: 600;
  font-size: clamp(2rem, 3.2vw, 2.75rem);
  line-height: 1;
  letter-spacing: -0.03em;
  color: #fff;
}

.eco-store-word {
  font-size: 1.0625rem;
  letter-spacing: -0.022em;
  color: $on-dark-muted;
}

// ─── product lines: white cards on the parchment tile ───
.eco-lines {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  li {
    display: flex;
  }
}

.eco-line-link {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 28px;
  text-decoration: none;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.99);
  }
}

.eco-line-title {
  font-weight: 600;
  font-size: 1.3125rem;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: $ink;
}

.eco-line-title::after {
  content: '\203A';
  margin-left: 0.25em;
  color: $brand-orange-text;
}

.eco-line-body {
  font-size: 1.0625rem;
  line-height: 1.47;
  letter-spacing: -0.022em;
  color: $ink-80;
}

// ─── partners ───
.eco-partner {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.eco-partner-name {
  font-weight: 600;
  font-size: 1.3125rem;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: $ink;
}

.eco-partner-link {
  align-self: flex-start;
  color: $brand-orange-text;
}

.eco-partner-role {
  font-size: 1.0625rem;
  line-height: 1.47;
  letter-spacing: -0.022em;
  color: $ink-80;
}

.eco-next {
  margin-top: clamp(36px, 5vw, 56px);
}
</style>
