<template>
  <main class="hm" ref="motionRoot">
    <!-- ─── HERO: product first ────────────────────────────────────────
         Four text elements (kicker, title, lede, CTAs) beside the real 3.2.2
         tablet and phone screens (文件-當前版/assets/screens, crop only, never
         retouched). Entrance is CSS; GSAP handles everything below the fold. -->
    <section id="home" class="hm-hero">
      <div class="hm-grain" aria-hidden="true"></div>
      <div class="hm-hero-grid">
        <div class="hm-hero-copy">
          <p class="hm-kicker">{{ $t('intextLogo') }}</p>
          <h1 class="hm-title">{{ $t('pageTitle') }}</h1>
          <p class="hm-lede">{{ locale.startsWith('zh') ? $t('paragraph1') : $t('paragraphEn') }}</p>
          <div class="hm-cta-row">
            <router-link to="/contact" class="hm-btn hm-btn-primary" @click="trackCta('hero')">{{ T.cta }}</router-link>
            <router-link to="/product" class="hm-btn hm-btn-ghost">{{ T.seeProduct }}</router-link>
          </div>
        </div>

        <figure class="hm-hero-figure" aria-label="enGo 牆掛平板與手機 App">
          <div class="hm-plate hm-plate-tablet" data-float>
            <img src="/images/screens/01-home-tablet.png" :alt="T.altTablet" width="2000" height="1200" loading="eager" fetchpriority="high" />
          </div>
          <!-- Full-screen iPhone capture (3.2.2, 模型屋), delivered 2026-09-23. Shown whole, at its
               own aspect; earlier cropped shots were never framed as a phone. -->
          <div class="hm-iphone hm-iphone-hero">
            <img src="/images/screens/12-home-iphone.png" :alt="T.altPhone" width="800" height="1731" loading="eager" />
          </div>
        </figure>
      </div>
    </section>

    <!-- ─── THREE INTERFACES, ONE ACCOUNT (copy mirrors /product §2.3) ── -->
    <section id="interfaces" class="hm-interfaces">
      <div class="hm-wrap">
        <header class="hm-head" data-reveal>
          <h2 class="hm-h2">{{ T.ifTitle }}</h2>
          <p class="hm-sub">{{ T.ifSub }}</p>
        </header>
        <div class="hm-if-grid" data-reveal-group>
          <div class="hm-if-item hm-if-tablet">
            <div class="hm-plate"><img src="/images/screens/01-home-tablet.png" :alt="T.altTablet" width="2000" height="1200" loading="lazy" /></div>
            <div class="hm-if-cap"><strong>{{ T.ifTablet }}</strong><span>{{ T.ifTabletCap }}</span></div>
          </div>
          <!-- No full-screen phone captures exist yet (only cropped Android shots, and WEB-002 forbids
               passing an Android screen off as iPhone), so both phone columns carry the store badge. -->
          <div class="hm-if-item hm-if-phone">
            <div class="hm-iphone"><img src="/images/screens/12-home-iphone.png" :alt="T.altPhone" width="800" height="1731" loading="lazy" /></div>
            <div class="hm-if-cap"><strong>iPhone / iPad</strong><span>{{ T.ifIosCap }}</span>
              <a class="hm-store hm-store-inline" href="https://apps.apple.com/app/id6680188565" target="_blank" rel="noopener" data-track="home:app-store">
                <img :src="locale.startsWith('zh') ? '/images/badges/app-store-zh-tw.svg' : '/images/badges/app-store-en.svg'" alt="Download on the App Store" width="120" height="40" loading="lazy" />
              </a>
            </div>
          </div>
          <div class="hm-if-item hm-if-store">
            <a class="hm-store hm-store-google" href="https://play.google.com/store/apps/details?id=tw.smtengo.engohome.android" target="_blank" rel="noopener" data-track="home:google-play">
              <img src="/images/badges/google-play-en.png" alt="Get it on Google Play" height="40" loading="lazy" />
            </a>
            <div class="hm-if-cap"><strong>{{ T.ifAndroid }}</strong><span>{{ T.ifAndroidCap }}</span></div>
          </div>
        </div>
        <p class="hm-if-note" data-reveal>{{ T.ifNote }}</p>
      </div>
    </section>

    <!-- ─── SIGNATURE SCENE: the home wires itself to the hub (kept, label removed) -->
    <HomeLivingLines />

    <!-- ─── FOUR CAPABILITIES: bento with exactly four cells (2+1 / 1+2) ── -->
    <section id="capabilities" class="hm-bento">
      <div class="hm-wrap">
        <header class="hm-head" data-reveal>
          <h2 class="hm-h2 hm-on-navy">{{ T.capTitle }}</h2>
          <p class="hm-sub hm-on-navy-sub">{{ T.capSub }}</p>
        </header>
        <div class="hm-bento-grid" data-reveal-group>
          <router-link to="/product#features" class="hm-cell hm-cell-img hm-cell-wide">
            <img src="/images/screens/03-floorplan-tablet.png" :alt="T.capFloorplan" width="2000" height="1200" loading="lazy" />
            <div class="hm-cell-cap"><strong>{{ T.capFloorplan }}</strong><span>{{ T.capFloorplanSub }}</span></div>
          </router-link>
          <div class="hm-cell hm-cell-voice">
            <span class="hm-voice-quote">{{ T.capVoiceQuote }}</span>
            <div class="hm-cell-cap"><strong>{{ T.capVoice }}</strong><span>{{ T.capVoiceSub }}</span></div>
          </div>
          <router-link to="/tutorial#howto-warehouse" class="hm-cell hm-cell-text">
            <div class="hm-cell-chips" aria-hidden="true"><span v-for="c in T.capWarehouseChips" :key="c">{{ c }}</span></div>
            <div class="hm-cell-cap"><strong>{{ T.capWarehouse }}</strong><span>{{ T.capWarehouseSub }}</span></div>
          </router-link>
          <router-link to="/tutorial#howto-scene" class="hm-cell hm-cell-img hm-cell-wide">
            <img src="/images/screens/10-scenes-tablet.png" :alt="T.capScenes" width="2000" height="1200" loading="lazy" />
            <div class="hm-cell-cap"><strong>{{ T.capScenes }}</strong><span>{{ T.capScenesSub }}</span></div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ─── HMS × BMS, compact ───────────────────────────────────────── -->
    <section id="community" class="hm-bms">
      <div class="hm-wrap hm-bms-grid">
        <div class="hm-bms-copy" data-reveal>
          <h2 class="hm-h2">{{ T.bmsTitle }}</h2>
          <p class="hm-sub">{{ T.bmsSub }}</p>
          <ul class="hm-bms-list">
            <li v-for="item in T.bmsItems" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div class="hm-bms-media" data-reveal-group>
          <div class="hm-plate hm-plate-land"><img src="/images/screens/09-announcement-tablet.png" :alt="T.altAnnounce" width="2000" height="1148" loading="lazy" /></div>
          <router-link :to="'/cases/' + bmsCase.id" class="hm-photo hm-photo-land" v-if="bmsCase">
            <img :src="bmsCase.image" :alt="T.bmsPhotoCap" loading="lazy" />
            <!-- Sean 2026-09-24: no development (建案) name on the home page; the photo alone. -->
            <div class="hm-photo-cap"><strong>{{ T.bmsPhotoCap }}</strong><span>{{ T.bmsPhotoSub }}</span></div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ─── PROOF: real photographs only ─────────────────────────────── -->
    <section id="proof" class="hm-proof">
      <div class="hm-wrap">
        <header class="hm-head hm-head-row" data-reveal>
          <h2 class="hm-h2">{{ T.proofTitle }}</h2>
          <router-link to="/cases" class="hm-link">{{ T.proofAll }}</router-link>
        </header>
        <div class="hm-proof-grid" data-reveal-group>
          <router-link v-for="c in proofCases" :key="c.id" :to="'/cases/' + c.id" class="hm-photo hm-proof-card" @click="trackEvent('case_click', { case_id: c.id, title: c.title.en })">
            <img :src="c.image" :alt="pick(c.title)" loading="lazy" />
            <div class="hm-photo-cap"><span>{{ pick(c.category) }}</span><strong>{{ pick(c.title) }}</strong></div>
          </router-link>
          <div class="hm-showroom">
            <p class="hm-showroom-title">{{ T.showroomTitle }}</p>
            <ul>
              <li v-for="s in showrooms" :key="s.id"><router-link :to="'/cases/' + s.id">{{ pick(s.title) }}</router-link><span>{{ pick(s.location) }}</span></li>
            </ul>
            <router-link to="/contact" class="hm-link hm-link-gold" @click="trackCta('showroom')">{{ T.cta }}</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── NEWS (folio kept) + CTA ──────────────────────────────────── -->
    <section id="news" class="hm-news">
      <div class="hm-wrap">
        <header class="hm-head" data-reveal>
          <h2 class="hm-h2">{{ $t('newsTitle') }}</h2>
        </header>
        <NewsFolio :items="newsItems" />
      </div>
    </section>

    <section id="cta" class="hm-cta">
      <div class="hm-wrap hm-cta-band" data-reveal>
        <div class="hm-cta-copy">
          <p class="hm-cta-title">{{ T.ctaTitle }}</p>
          <p class="hm-cta-sub">{{ T.ctaSub }}</p>
        </div>
        <div class="hm-cta-actions">
          <router-link to="/contact" class="hm-btn hm-btn-light" @click="trackCta('band')">{{ T.cta }}</router-link>
          <span class="hm-cta-phone">02-27510218　{{ T.hours }}</span>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import newsData from '@/data/news.json'
import casesData from '@/data/cases.json'
import HomeLivingLines from '@/components/HomeLivingLines.vue'
import NewsFolio from '@/components/NewsFolio.vue'
import { useEditorialMotion } from '@/composables/useEditorialMotion'
import { useAnalytics } from '@/utils/analytics'

const { locale } = useI18n()
const { trackEvent } = useAnalytics()
const newsItems = ref(newsData as any)
const motionRoot = ref<HTMLElement | null>(null)
useEditorialMotion(motionRoot)

const pick = (o: any) => (o ? (o[locale.value] ?? o.zh ?? o.en ?? '') : '')

// Proof uses only cases that carry a real photograph (the shared illustration
// is `case-home.jpg`); the two showrooms are linked by name, not shown as photos.
const cases = casesData as any[]
const hasPhoto = (c: any) => typeof c.image === 'string' && !c.image.endsWith('case-home.jpg')
const proofCases = computed(() => cases.filter((c) => hasPhoto(c) && c.category?.en !== 'Property Development').slice(0, 2))
const bmsCase = computed(() => cases.find((c) => hasPhoto(c) && c.category?.en === 'Property Development') ?? null)
const showrooms = computed(() => cases.filter((c) => c.category?.en === 'Showroom'))

const trackCta = (location: string) => trackEvent('cta_click', { location, page: 'home' })

// Copy: every claim below is lifted from KB-001 A.8 / the existing site.
// zh, zhCN and en are written out; the other locales fall back to en.
const COPY: Record<string, Record<string, any>> = {
  zh: {
    cta: '預約體驗', seeProduct: '看產品介紹',
    altTablet: 'enGo 牆掛平板首頁，依房間分組的裝置卡片', altPhone: 'iPhone 上的 enGo智慧管家首頁，模型屋示範住家', altAnnounce: '手機上的社區公告',
    ifTitle: '三種介面，一組帳號',
    ifSub: '牆掛平板是家中的主控台；iPhone、iPad 與 Android 手機讓您在外遠端掌握。手機 App「enGo智慧管家」於 App Store 與 Google Play 免費下載。',
    ifTablet: 'enGo 牆掛平板', ifTabletCap: '家電控制、情境、平面圖、社區服務，加上平板專屬的語音操作與待機相片牆',
    ifIosCap: '在外遠端掌握，同一組帳號', ifAndroid: 'Android 手機', ifAndroidCap: '社區公告、報修、預約隨時看',
    ifNote: '語音操作與待機相片牆為牆掛平板專屬功能。',
    capTitle: '每天都會用到的四件事', capSub: '照明、插座、窗簾、空調、感測器與攝影機，在同一台平板上看見、控制、自動化。',
    capFloorplan: '平面圖即時視圖', capFloorplanSub: '每個房間的裝置狀態，畫在您家的平面圖上。',
    capVoice: '語音操作', capVoiceSub: '牆掛平板專屬。涉及安全的裝置會先向您確認。', capVoiceQuote: '「開客廳燈」',
    capWarehouse: '智慧倉儲管理', capWarehouseSub: '濾芯、電池、備品放哪裡、剩多少。',
    capWarehouseChips: ['物品', '櫃位', '低庫存提醒'],
    capScenes: '情境（一鍵模式）', capScenesSub: '「離家」等於關全部燈加關空調。手動一鍵執行，或依時間、感測器狀態自動觸發。',
    capSceneChips: ['回家模式', '離家模式', '睡眠模式', '晨曦喚醒'],
    bmsTitle: '一棟大樓，一個大腦。', bmsSub: '住戶不必為了看公告另外裝一支 App。社區服務與家裡的裝置在同一個 App 與同一台平板裡。',
    bmsItems: ['社區公告與通知', '報修與工單追蹤', '公設預約', '包裹通知與取件'],
    bmsPhotoCap: '建案導入', bmsPhotoSub: '社區與每一戶，同一套系統',
    proofTitle: '真實住家的實作紀錄', proofAll: '看全部案例', showroomTitle: '兩個展示間，親自走一趟。',
    ctaTitle: '想看看您家會變成什麼樣子？', ctaSub: '留下聯繫資料，專人為您安排展示間體驗與規劃建議。', hours: '週一至週五 09:00-18:00',
  },
  zhCN: {
    cta: '预约体验', seeProduct: '看产品介绍',
    altTablet: 'enGo 壁挂平板首页，依房间分组的设备卡片', altPhone: 'iPhone 上的 enGo智慧管家首页，模型屋示范住家', altAnnounce: '手机上的社区公告',
    ifTitle: '三种界面，一组账号',
    ifSub: '壁挂平板是家中的主控台；iPhone、iPad 与 Android 手机让您在外远程掌握。手机 App「enGo智慧管家」于 App Store 与 Google Play 免费下载。',
    ifTablet: 'enGo 壁挂平板', ifTabletCap: '家电控制、情境、平面图、社区服务，加上平板专属的语音操作与待机相片墙',
    ifIosCap: '在外远程掌握，同一组账号', ifAndroid: 'Android 手机', ifAndroidCap: '社区公告、报修、预约随时看',
    ifNote: '语音操作与待机相片墙为壁挂平板专属功能。',
    capTitle: '每天都会用到的四件事', capSub: '照明、插座、窗帘、空调、传感器与摄像头，在同一台平板上看见、控制、自动化。',
    capFloorplan: '平面图实时视图', capFloorplanSub: '每个房间的设备状态，画在您家的平面图上。',
    capVoice: '语音操作', capVoiceSub: '壁挂平板专属。涉及安全的设备会先向您确认。', capVoiceQuote: '「开客厅灯」',
    capWarehouse: '智慧仓储管理', capWarehouseSub: '滤芯、电池、备品放哪里、剩多少。',
    capWarehouseChips: ['物品', '柜位', '低库存提醒'],
    capScenes: '情境（一键模式）', capScenesSub: '「离家」等于关全部灯加关空调。手动一键执行，或依时间、传感器状态自动触发。',
    capSceneChips: ['回家模式', '离家模式', '睡眠模式', '晨曦唤醒'],
    bmsTitle: '一栋大楼，一个大脑。', bmsSub: '住户不必为了看公告另外装一个 App。社区服务与家里的设备在同一个 App 与同一台平板里。',
    bmsItems: ['社区公告与通知', '报修与工单追踪', '公设预约', '包裹通知与取件'],
    bmsPhotoCap: '建案导入', bmsPhotoSub: '社区与每一户，同一套系统',
    proofTitle: '真实住家的实施记录', proofAll: '看全部案例', showroomTitle: '两个展示间，亲自走一趟。',
    ctaTitle: '想看看您家会变成什么样子？', ctaSub: '留下联系资料，专人为您安排展示间体验与规划建议。', hours: '周一至周五 09:00-18:00',
  },
  en: {
    cta: 'Book a visit', seeProduct: 'See the product',
    altTablet: 'enGo wall tablet home screen with device cards grouped by room', altPhone: 'enGo智慧管家 home screen on iPhone, Model Home demo household', altAnnounce: 'Community announcements on the phone',
    ifTitle: 'Three interfaces, one account',
    ifSub: 'The wall tablet is the control centre at home; iPhone, iPad and Android phones keep you in touch when you are out. The enGo HMS app is free on the App Store and Google Play, listed as enGo智慧管家.',
    ifTablet: 'enGo wall tablet', ifTabletCap: 'Device control, scenes, floor plan, community services, plus tablet-only voice control and the standby photo wall',
    ifIosCap: 'Remote control on the go, same account', ifAndroid: 'Android phone', ifAndroidCap: 'Announcements, repairs and bookings anytime',
    ifNote: 'Voice control and the standby photo wall are wall-tablet-only features.',
    capTitle: 'Four things you will use every day', capSub: 'Lighting, outlets, curtains, air conditioning, sensors and cameras, seen, controlled and automated on one tablet.',
    capFloorplan: 'Live floor plan', capFloorplanSub: 'Every room\'s device status, drawn on your own floor plan.',
    capVoice: 'Voice control', capVoiceSub: 'Wall tablet only. Safety-related devices ask for confirmation first.', capVoiceQuote: '"Living room lights on"',
    capWarehouse: 'Smart inventory', capWarehouseSub: 'Where the filters, batteries and spares are, and how many are left.',
    capWarehouseChips: ['Items', 'Cabinets', 'Low-stock alerts'],
    capScenes: 'Scenes (one tap)', capScenesSub: '"Away" means all lights off and AC off. Run it by tap, or trigger it by time or sensor state.',
    capSceneChips: ['Home', 'Away', 'Sleep', 'Sunrise'],
    bmsTitle: 'One brain. Every building.', bmsSub: 'Residents do not need a second app for notices. Community services live in the same app and tablet as the home.',
    bmsItems: ['Announcements and notices', 'Repair requests and tracking', 'Facility booking', 'Parcel notice and pickup'],
    bmsPhotoCap: 'Development rollout', bmsPhotoSub: 'The community and every home on one system',
    proofTitle: 'Real homes, real installs', proofAll: 'All cases', showroomTitle: 'Two showrooms. Come and see.',
    ctaTitle: 'Curious what your home would look like?', ctaSub: 'Leave your details and we will arrange a showroom visit and planning advice.', hours: 'Mon to Fri 09:00-18:00',
  },
}
const T = computed(() => COPY[locale.value] ?? COPY.en)
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

$navy: $grey-blue3;
$navy-2: $grey-blue2;

.hm { background: $warm-bg-light; color: #2c2c2c; }
.hm-wrap { max-width: 1240px; margin: 0 auto; padding-inline: clamp(20px, 5vw, 64px); }

// ─── shared type ─────────────────────────────────────────────────
.hm-h2 {
  font-family: 'Noto Serif TC', serif; font-weight: 700; color: $navy;
  font-size: clamp(1.9rem, 3.4vw, 2.9rem); line-height: 1.15; margin: 0;
}
.hm-sub { font-size: clamp(1rem, 1.25vw, 1.1rem); line-height: 1.75; color: #555; max-width: 62ch; margin: 12px 0 0; }
.hm-head { margin-bottom: clamp(28px, 4vw, 44px); }
.hm-head-row { display: flex; justify-content: space-between; align-items: baseline; gap: 20px; flex-wrap: wrap; }
.hm-on-navy { color: $warm-bg-light; }
.hm-on-navy-sub { color: rgba($warm-bg-light, 0.72); }
.hm-link {
  font-weight: 700; color: $brand-orange-text; text-decoration: none;
  border-bottom: 2px solid $brand-orange; padding-bottom: 2px; transition: color .2s;
  &:hover { color: $brand-orange; }
}
.hm-link-gold { color: $gold; border-color: $gold; align-self: flex-start; &:hover { color: lighten($gold, 12%); } }

.hm-btn {
  display: inline-flex; align-items: center; justify-content: center; white-space: nowrap;
  font-weight: 700; font-size: 1rem; padding: 15px 28px; border-radius: 999px; text-decoration: none;
  transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
  &:active { transform: translateY(1px) scale(0.98); }
}
.hm-btn-primary { background: $brand-orange; color: #fff; box-shadow: 0 10px 30px rgba($brand-orange, .28); &:hover { background: darken($brand-orange, 6%); } }
.hm-btn-ghost { color: $navy; border: 1.5px solid $navy; &:hover { background: rgba($navy, .06); } }
.hm-btn-light { background: $warm-bg-light; color: $brand-orange-text; &:hover { background: #fff; } }

// device plates: navy frame, cover-fit, never retouched
.hm-plate {
  background: $navy; border-radius: 22px; padding: 10px; box-shadow: 0 24px 60px rgba($navy, .22);
  img { display: block; width: 100%; height: auto; border-radius: 14px; }
}
.hm-plate-tall img { aspect-ratio: 4 / 5; object-fit: cover; object-position: top; }
.hm-plate-land img { aspect-ratio: 2000 / 1148; object-fit: cover; object-position: top; }

.hm-store { display: inline-block; line-height: 0; img { height: 40px; width: auto; } }
.hm-store-inline { margin-top: 10px; }
// Real phone frame for a full-screen capture: whole image, own aspect, no cover-fit.
.hm-iphone {
  background: $navy; border-radius: 40px; padding: 10px; box-shadow: 0 24px 60px rgba($navy, .28);
  img { display: block; width: 100%; height: auto; border-radius: 32px; aspect-ratio: 800 / 1731; }
}
.hm-if-phone { align-items: stretch; .hm-iphone { width: 62%; margin: 0 auto; } }
.hm-store-google img { height: 58px; margin: -9px -12px; }
.hm-if-store {
  justify-content: flex-end; padding: 22px; border-radius: 20px; background: rgba($navy, .04); border: 1px solid #D8DFE8;
  .hm-store { align-self: flex-start; padding-bottom: 6px; }
}

// ─── hero ────────────────────────────────────────────────────────
.hm-hero { position: relative; overflow: hidden; padding: clamp(72px, 9vh, 104px) 0 clamp(40px, 6vw, 72px); }
.hm-grain {
  position: absolute; inset: 0; pointer-events: none; opacity: .05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.hm-hero-grid {
  position: relative; max-width: 1240px; margin: 0 auto; padding-inline: clamp(20px, 5vw, 64px);
  display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 6fr); gap: clamp(24px, 4vw, 56px); align-items: center;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
}
.hm-hero-copy { display: flex; flex-direction: column; gap: 18px; }
.hm-kicker {
  font-family: 'Noto Serif TC', serif; font-weight: 900; color: $brand-orange-text; letter-spacing: .06em;
  font-size: clamp(1.1rem, 1.8vw, 1.45rem); margin: 0; animation: hmRise .7s cubic-bezier(.22,1,.36,1) .1s both;
}
.hm-title {
  font-family: 'Noto Serif TC', serif; font-weight: 900; color: $navy; letter-spacing: -.01em;
  font-size: clamp(3rem, 7.4vw, 6.2rem); line-height: 1.02; margin: 0; animation: hmReveal .9s cubic-bezier(.22,1,.36,1) .25s both;
}
.hm-lede { font-size: clamp(1.08rem, 1.5vw, 1.3rem); line-height: 1.8; color: $navy-2; max-width: 30em; margin: 0; animation: hmRise .7s cubic-bezier(.22,1,.36,1) .45s both; }
.hm-cta-row { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 6px; animation: hmRise .7s cubic-bezier(.22,1,.36,1) .6s both; }

.hm-hero-figure {
  position: relative; margin: 0; padding-bottom: 8%; animation: hmReveal 1s cubic-bezier(.22,1,.36,1) .4s both;
  .hm-plate-tablet { width: 88%; margin-left: auto; }
  .hm-iphone-hero { position: absolute; left: 0; bottom: -6%; width: 27%; }
  @media (max-width: 900px) { padding-top: 24px; margin-bottom: 30px; .hm-plate-tablet { width: 100%; } .hm-iphone-hero { display: none; } }
}

// ─── interfaces ──────────────────────────────────────────────────
.hm-interfaces { background: $warm-bg-section; padding: clamp(56px, 8vw, 96px) 0; }
.hm-if-grid {
  display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 24px; align-items: end;
  @media (max-width: 900px) { grid-template-columns: 1fr 1fr; .hm-if-tablet { grid-column: 1 / -1; } }
  @media (max-width: 540px) { grid-template-columns: 1fr; }
}
.hm-if-item { display: flex; flex-direction: column; gap: 12px; }
.hm-if-cap { display: flex; flex-direction: column; gap: 2px; strong { color: $navy; font-size: 1.05rem; } span { font-size: .88rem; color: #5B6470; line-height: 1.55; } }
.hm-if-note { margin: 26px 0 0; font-size: .9rem; color: #5B6470; }

// ─── bento ───────────────────────────────────────────────────────
.hm-bento { background: $navy; padding: clamp(56px, 8vw, 96px) 0; position: relative; }
.hm-bento-grid {
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: minmax(220px, auto); gap: 18px;
  @media (max-width: 900px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: 540px) { grid-template-columns: 1fr; .hm-cell-wide { grid-column: auto; } }
}
.hm-cell { position: relative; border-radius: 20px; overflow: hidden; background: $navy-2; color: $warm-bg-light; text-decoration: none; display: flex; min-height: 240px; transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s; }
a.hm-cell:hover { transform: translateY(-4px); box-shadow: 0 22px 50px rgba(0,0,0,.28); }
.hm-cell-wide { grid-column: span 2; }
.hm-cell-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: left top; opacity: .92; transition: transform .6s ease; }
a.hm-cell-img:hover img { transform: scale(1.03); }
.hm-cell-cap {
  position: relative; margin-top: auto; width: 100%; padding: 18px 22px; display: flex; flex-direction: column; gap: 4px;
  background: linear-gradient(180deg, rgba($navy, 0) 0%, rgba($navy, .92) 60%);
  strong { font-size: 1.2rem; } span { font-size: .9rem; color: rgba($warm-bg-light, .8); line-height: 1.5; }
}
.hm-cell-text { flex-direction: column; justify-content: space-between; padding: 24px 24px 0; .hm-cell-cap { margin: 0 -24px; padding-top: 12px; background: none; } }
.hm-cell-chips { display: flex; flex-wrap: wrap; gap: 8px; span { border: 1.5px solid rgba($warm-bg-light, .5); border-radius: 999px; padding: 7px 14px; font-size: .85rem; font-weight: 700; color: $warm-bg-light; } }
.hm-cell-voice { flex-direction: column; justify-content: space-between; padding: 24px 24px 0; .hm-cell-cap { margin: 0 -24px; padding-top: 12px; background: none; } }
.hm-voice-quote { font-family: 'Noto Serif TC', serif; font-weight: 700; color: $gold; font-size: clamp(2rem, 3.2vw, 3.1rem); line-height: 1.05; }

// ─── HMS × BMS ───────────────────────────────────────────────────
.hm-bms { padding: clamp(56px, 8vw, 96px) 0; }
.hm-bms-grid { display: grid; grid-template-columns: 5fr 7fr; gap: clamp(28px, 5vw, 64px); align-items: center; @media (max-width: 900px) { grid-template-columns: 1fr; } }
.hm-bms-list {
  list-style: none; padding: 0; margin: 22px 0 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px;
  li { border-top: 1px solid #D8DFE8; padding-top: 10px; font-weight: 500; color: $navy; font-size: .98rem; }
}
.hm-bms-media { display: grid; grid-template-columns: 1fr; gap: 18px; }
.hm-photo-land { aspect-ratio: 16 / 9; }
.hm-photo {
  position: relative; display: block; border-radius: 20px; overflow: hidden; text-decoration: none; color: $warm-bg-light; aspect-ratio: 4 / 5;
  img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .6s ease; }
  &:hover img { transform: scale(1.04); }
}
.hm-photo-cap {
  position: absolute; left: 0; right: 0; bottom: 0; padding: 18px 20px; display: flex; flex-direction: column; gap: 2px; color: #fff;
  strong, span { color: #fff; text-shadow: 0 1px 10px rgba(0, 0, 0, .55); }
  background: linear-gradient(180deg, rgba($navy, 0) 0%, rgba($navy, .9) 100%);
  strong { font-family: 'Noto Serif TC', serif; font-size: 1.15rem; line-height: 1.3; } span { font-size: .78rem; letter-spacing: .1em; opacity: .85; }
}

// ─── proof ───────────────────────────────────────────────────────
.hm-proof { background: $warm-bg-section; padding: clamp(56px, 8vw, 96px) 0; }
.hm-proof-grid {
  display: grid; grid-template-columns: 3fr 2fr 2fr; gap: 20px;
  .hm-proof-card { aspect-ratio: auto; min-height: 320px; }
  @media (max-width: 900px) { grid-template-columns: 1fr 1fr; .hm-proof-card:first-child { grid-column: 1 / -1; } }
  @media (max-width: 540px) { grid-template-columns: 1fr; }
}
.hm-showroom {
  border-radius: 20px; background: $navy; color: $warm-bg-light; padding: 28px; display: flex; flex-direction: column; justify-content: space-between; gap: 22px; min-height: 320px;
  ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
  li { display: flex; flex-direction: column; a { color: $warm-bg-light; font-weight: 700; text-decoration: none; &:hover { color: $gold; } } span { font-size: .85rem; opacity: .75; } }
}
.hm-showroom-title { font-family: 'Noto Serif TC', serif; font-weight: 700; font-size: clamp(1.4rem, 2vw, 1.8rem); line-height: 1.35; margin: 0; }

// ─── news + cta ──────────────────────────────────────────────────
.hm-news { padding: clamp(56px, 8vw, 96px) 0 clamp(24px, 3vw, 40px); }
.hm-cta { padding: 0 0 clamp(56px, 8vw, 96px); }
.hm-cta-band {
  background: $brand-orange; color: #fff; border-radius: 24px; padding: clamp(28px, 4vw, 44px);
  display: grid; grid-template-columns: 1.2fr 1fr; gap: 28px; align-items: center;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
}
.hm-cta-title { font-family: 'Noto Serif TC', serif; font-weight: 700; font-size: clamp(1.5rem, 2.6vw, 2.2rem); line-height: 1.25; margin: 0 0 8px; }
.hm-cta-sub { margin: 0; opacity: .92; line-height: 1.6; }
.hm-cta-actions { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; @media (min-width: 901px) { align-items: flex-end; } }
.hm-cta-phone { font-size: .95rem; opacity: .92; }

// ─── keyframes ───────────────────────────────────────────────────
@keyframes hmRise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
@keyframes hmReveal { from { opacity: 0; clip-path: inset(0 0 100% 0); transform: translateY(10px); } to { opacity: 1; clip-path: inset(0 0 0 0); transform: none; } }
@media (prefers-reduced-motion: reduce) {
  .hm-kicker, .hm-title, .hm-lede, .hm-cta-row, .hm-hero-figure { animation: none; }
  .hm-cell, .hm-photo img, .hm-cell-img img { transition: none; }
}
</style>
