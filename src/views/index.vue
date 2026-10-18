<template>
  <main class="hm" ref="motionRoot">
    <!-- ─── HERO TILE (white): one headline, one lede, two pills, the product ────
         Apple-profile rhythm (design-md/apple): centered stack, UI recedes, the
         tablet and phone are the only things with a shadow on the page. Screens are
         real 3.2.2 captures (文件-當前版/assets/screens, crop only, never retouched). -->
    <section id="home" class="hm-tile hm-tile-white hm-hero">
      <div class="hm-wrap hm-center">
        <p class="hm-kicker">{{ $t('intextLogo') }}</p>
        <h1 class="hm-title">{{ $t('pageTitle') }}</h1>
        <p class="hm-lede">{{ locale.startsWith('zh') ? $t('paragraph1') : $t('paragraphEn') }}</p>
        <div class="hm-cta-row">
          <router-link to="/contact" class="hm-pill hm-pill-primary" @click="trackCta('hero')">{{ T.cta }}</router-link>
          <router-link to="/product" class="hm-pill hm-pill-ghost">{{ T.seeProduct }}</router-link>
        </div>
        <a href="https://lin.ee/THIUSjW" class="hm-link" target="_blank" rel="noopener" data-track="home:line" @click="trackCta('line')">{{ T.lineCta }}<span class="hm-chev" aria-hidden="true">›</span></a>
      </div>
      <figure class="hm-hero-figure" aria-label="enGo 牆掛平板與手機 App">
        <div class="hm-plate hm-plate-tablet">
          <img src="/images/screens/01-home-tablet.png" :alt="T.altTablet" width="2000" height="1200" loading="eager" fetchpriority="high" />
        </div>
        <div class="hm-iphone hm-iphone-hero">
          <img src="/images/screens/12-home-iphone.png" :alt="T.altPhone" width="800" height="1731" loading="eager" />
        </div>
      </figure>
    </section>

    <!-- ─── THREE INTERFACES, ONE ACCOUNT (parchment tile; copy mirrors /product §2.3) -->
    <section id="interfaces" class="hm-tile hm-tile-parchment">
      <div class="hm-wrap">
        <header class="hm-head hm-center" data-reveal>
          <h2 class="hm-h2">{{ T.ifTitle }}</h2>
          <p class="hm-lead">{{ T.ifSub }}</p>
        </header>
        <div class="hm-if-grid" data-reveal-group>
          <div class="hm-if-item hm-if-tablet">
            <div class="hm-plate"><img src="/images/screens/01-home-tablet.png" :alt="T.altTablet" width="2000" height="1200" loading="lazy" /></div>
            <p class="hm-cap"><strong>{{ T.ifTablet }}</strong>{{ T.ifTabletCap }}</p>
          </div>
          <div class="hm-if-item">
            <div class="hm-iphone"><img src="/images/screens/12-home-iphone.png" :alt="T.altPhone" width="800" height="1731" loading="lazy" /></div>
            <p class="hm-cap"><strong>iPhone / iPad</strong>{{ T.ifIosCap }}</p>
            <a class="hm-store" href="https://apps.apple.com/app/id6680188565" target="_blank" rel="noopener" data-track="home:app-store">
              <img :src="locale.startsWith('zh') ? '/images/badges/app-store-zh-tw.svg' : '/images/badges/app-store-en.svg'" alt="Download on the App Store" width="120" height="40" loading="lazy" />
            </a>
          </div>
          <div class="hm-if-item">
            <div class="hm-if-android">
              <a class="hm-store hm-store-google" href="https://play.google.com/store/apps/details?id=tw.smtengo.engohome.android" target="_blank" rel="noopener" data-track="home:google-play">
                <img src="/images/badges/google-play-en.png" alt="Get it on Google Play" height="40" loading="lazy" />
              </a>
            </div>
            <p class="hm-cap"><strong>{{ T.ifAndroid }}</strong>{{ T.ifAndroidCap }}</p>
          </div>
        </div>
        <p class="hm-fine hm-center" data-reveal>{{ T.ifNote }}</p>
      </div>
    </section>

    <!-- ─── A DAY WITH ENGO (dark tile): four scenes from the 模型屋 demo home. Names as
         on the real 場景 screen (10-scenes-tablet.png); scenes run by tap or by time /
         sensor (KB-001 §1). Text only, no chips, no colour cards. -->
    <section id="day" class="hm-tile hm-tile-dark">
      <div class="hm-wrap">
        <header class="hm-head hm-center" data-reveal>
          <h2 class="hm-h2">{{ T.dayTitle }}</h2>
          <p class="hm-lead">{{ T.daySub }}</p>
        </header>
        <div class="hm-day-grid" data-reveal-group>
          <div v-for="m in T.dayMoments" :key="m.time" class="hm-moment">
            <span class="hm-moment-time">{{ m.time }}</span>
            <span class="hm-moment-name">{{ m.name }}</span>
            <p class="hm-moment-body">{{ m.body }}</p>
          </div>
        </div>
        <p class="hm-center" data-reveal>
          <router-link to="/tutorial#howto-scene" class="hm-link hm-link-on-dark">{{ T.dayLink }}<span class="hm-chev" aria-hidden="true">›</span></router-link>
        </p>
      </div>
    </section>

    <!-- ─── SIGNATURE SCENE: the home wires itself to the hub (kept) ── -->
    <HomeLivingLines />

    <!-- ─── FOUR CAPABILITIES (white tile): 2×2 utility cards, hairline, no shadow ── -->
    <section id="capabilities" class="hm-tile hm-tile-white">
      <div class="hm-wrap">
        <header class="hm-head hm-center" data-reveal>
          <h2 class="hm-h2">{{ T.capTitle }}</h2>
          <p class="hm-lead">{{ T.capSub }}</p>
        </header>
        <div class="hm-cap-grid" data-reveal-group>
          <router-link to="/tutorial#howto-devicedata" class="hm-card">
            <div class="hm-card-media hm-card-media-phone"><div class="hm-iphone hm-iphone-sm"><img src="/images/howto/devicedata/01-power.png" :alt="T.capData" width="800" height="1731" loading="lazy" /></div></div>
            <div class="hm-card-text"><strong>{{ T.capData }}</strong><span>{{ T.capDataSub }}</span></div>
          </router-link>
          <router-link to="/tutorial#howto-scene" class="hm-card">
            <div class="hm-card-media"><div class="hm-plate hm-plate-sm"><img src="/images/screens/10-scenes-tablet.png" :alt="T.capScenes" width="2000" height="1200" loading="lazy" /></div></div>
            <div class="hm-card-text"><strong>{{ T.capScenes }}</strong><span>{{ T.capScenesSub }}</span></div>
          </router-link>
          <div class="hm-card">
            <div class="hm-card-media hm-card-media-quote"><span class="hm-voice-quote">{{ T.capVoiceQuote }}</span></div>
            <div class="hm-card-text"><strong>{{ T.capVoice }}</strong><span>{{ T.capVoiceSub }}</span></div>
          </div>
          <router-link to="/tutorial#howto-warehouse" class="hm-card">
            <div class="hm-card-media hm-card-media-list">
              <ul class="hm-card-list"><li v-for="c in T.capWarehouseChips" :key="c">{{ c }}</li></ul>
            </div>
            <div class="hm-card-text"><strong>{{ T.capWarehouse }}</strong><span>{{ T.capWarehouseSub }}</span></div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ─── HMS × BMS (parchment tile) ───────────────────────────────── -->
    <section id="community" class="hm-tile hm-tile-parchment">
      <div class="hm-wrap hm-bms-grid">
        <div class="hm-bms-copy" data-reveal>
          <h2 class="hm-h2">{{ T.bmsTitle }}</h2>
          <p class="hm-lead">{{ T.bmsSub }}</p>
          <ul class="hm-bms-list">
            <li v-for="item in T.bmsItems" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div class="hm-bms-media" data-reveal-group>
          <div class="hm-plate hm-plate-land"><img src="/images/screens/09-announcement-tablet.png" :alt="T.altAnnounce" width="2000" height="1148" loading="lazy" /></div>
          <router-link :to="'/cases/' + bmsCase.id" class="hm-photo" v-if="bmsCase">
            <img :src="bmsCase.image" :alt="T.bmsPhotoCap" loading="lazy" />
            <!-- Sean 2026-09-24: no development (建案) name on the home page; the photo alone. -->
            <p class="hm-cap"><strong>{{ T.bmsPhotoCap }}</strong>{{ T.bmsPhotoSub }}</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ─── PROOF (white tile): real photographs only ─────────────────── -->
    <section id="proof" class="hm-tile hm-tile-white">
      <div class="hm-wrap">
        <header class="hm-head hm-head-row" data-reveal>
          <h2 class="hm-h2">{{ T.proofTitle }}</h2>
          <router-link to="/cases" class="hm-link">{{ T.proofAll }}<span class="hm-chev" aria-hidden="true">›</span></router-link>
        </header>
        <div class="hm-proof-grid" data-reveal-group>
          <router-link v-for="c in proofCases" :key="c.id" :to="'/cases/' + c.id" class="hm-photo" @click="trackEvent('case_click', { case_id: c.id, title: c.title.en })">
            <img :src="c.image" :alt="pick(c.title)" loading="lazy" />
            <p class="hm-cap"><strong>{{ pick(c.title) }}</strong>{{ pick(c.category) }}</p>
          </router-link>
          <div class="hm-showroom">
            <p class="hm-showroom-title">{{ T.showroomTitle }}</p>
            <ul>
              <li v-for="s in showrooms" :key="s.id"><router-link :to="'/cases/' + s.id">{{ pick(s.title) }}</router-link><span>{{ pick(s.location) }}</span></li>
            </ul>
            <router-link to="/contact" class="hm-link" @click="trackCta('showroom')">{{ T.cta }}<span class="hm-chev" aria-hidden="true">›</span></router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── NEWS (folio kept, parchment) ─────────────────────────────── -->
    <section id="news" class="hm-tile hm-tile-parchment hm-news">
      <div class="hm-wrap">
        <header class="hm-head" data-reveal>
          <h2 class="hm-h2">{{ $t('newsTitle') }}</h2>
        </header>
        <NewsFolio :items="newsItems" />
      </div>
    </section>

    <!-- ─── CTA (dark tile) ──────────────────────────────────────────── -->
    <section id="cta" class="hm-tile hm-tile-dark hm-cta">
      <div class="hm-wrap hm-center" data-reveal>
        <h2 class="hm-h2">{{ T.ctaTitle }}</h2>
        <p class="hm-lead">{{ T.ctaSub }}</p>
        <div class="hm-cta-row">
          <router-link to="/contact" class="hm-pill hm-pill-primary" @click="trackCta('band')">{{ T.cta }}</router-link>
          <a href="https://lin.ee/THIUSjW" class="hm-pill hm-pill-ghost hm-pill-ghost-dark" target="_blank" rel="noopener" data-track="home:line-band" @click="trackCta('line-band')">{{ T.lineCta }}</a>
        </div>
        <p class="hm-fine hm-fine-on-dark">02-27510218　{{ T.hours }}</p>
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

// Copy: short, concrete, benefit-first. Every claim below is lifted from KB-001 A.17 /
// the existing site; scene names are the ones on the real 場景 screen.
// zh, zhCN and en are written out; the other locales fall back to en.
const COPY: Record<string, Record<string, any>> = {
  zh: {
    cta: '預約體驗', seeProduct: '看產品介紹', lineCta: '用 LINE 問我們',
    altTablet: 'enGo 牆掛平板首頁，依房間分組的裝置卡片', altPhone: 'iPhone 上的 enGo智慧管家首頁，模型屋示範住家', altAnnounce: '平板上的社區公告',
    ifTitle: '三種介面，一組帳號。',
    ifSub: '牆掛平板在家裡當主控台，手機在外面接手。',
    ifTablet: 'enGo 牆掛平板', ifTabletCap: '家電、情境、設備數據、社區服務，加上平板專屬的語音與待機相片牆。',
    ifIosCap: '在外遠端掌握，同一組帳號。', ifAndroid: 'Android 手機', ifAndroidCap: '公告、報修、預約，隨時看。',
    ifNote: '手機 App「enGo智慧管家」於 App Store 與 Google Play 免費下載。語音操作與待機相片牆為牆掛平板專屬。',
    dayTitle: '一天，就這樣過。',
    daySub: '一鍵執行，或依時間與感測器自動觸發。示範住家的四個情境，名稱由您決定。',
    dayLink: '看情境怎麼設定',
    dayMoments: [
      { time: '07:00', name: '早安模式', body: '窗簾與燈光跟著你起床。用電趨勢，平板和手機都看得到。' },
      { time: '08:10', name: '離家模式', body: '關全部燈、關空調。不用回頭檢查。' },
      { time: '18:40', name: '回家模式', body: '包裹到了、公告更新了，都在同一支 App。進門一鍵，燈先亮。' },
      { time: '23:00', name: '晚安模式', body: '一鍵關燈。牆掛平板待機時，是相片牆。' },
    ],
    capTitle: '每天都會用到的四件事。', capSub: '照明、插座、窗簾、空調、感測器、攝影機。一台平板，看見、控制、自動化。',
    capData: '設備數據', capDataSub: '用電趨勢、用電分布、用水量、空氣品質。平板與手機都有。',
    capVoice: '語音操作', capVoiceSub: '牆掛平板專屬。涉及安全的裝置會先向您確認。', capVoiceQuote: '「開客廳燈」',
    capWarehouse: '智慧倉儲', capWarehouseSub: '濾芯、電池、備品放哪裡、剩多少。', capWarehouseChips: ['物品', '櫃位', '低庫存提醒'],
    capScenes: '情境', capScenesSub: '「離家」等於關全部燈加關空調。一鍵執行，或依時間、感測器自動觸發。',
    bmsTitle: '一棟大樓，一個大腦。', bmsSub: '社區服務與家裡的裝置，同一個 App、同一台平板。',
    bmsItems: ['社區公告與通知', '報修與工單追蹤', '公設預約', '包裹通知與取件'],
    bmsPhotoCap: '建案導入', bmsPhotoSub: '社區與每一戶，同一套系統',
    proofTitle: '真實住家。', proofAll: '看全部案例', showroomTitle: '兩個展示間，親自走一趟。',
    ctaTitle: '想看看您家會變成什麼樣子？', ctaSub: '留下聯繫方式，我們安排展示間體驗與規劃建議。', hours: '週一至週五 09:00-18:00',
  },
  zhCN: {
    cta: '预约体验', seeProduct: '看产品介绍', lineCta: '用 LINE 问我们',
    altTablet: 'enGo 壁挂平板首页，依房间分组的设备卡片', altPhone: 'iPhone 上的 enGo智慧管家首页，模型屋示范住家', altAnnounce: '平板上的社区公告',
    ifTitle: '三种界面，一组账号。',
    ifSub: '壁挂平板在家里当主控台，手机在外面接手。',
    ifTablet: 'enGo 壁挂平板', ifTabletCap: '家电、情境、设备数据、社区服务，加上平板专属的语音与待机相片墙。',
    ifIosCap: '在外远程掌握，同一组账号。', ifAndroid: 'Android 手机', ifAndroidCap: '公告、报修、预约，随时看。',
    ifNote: '手机 App「enGo智慧管家」于 App Store 与 Google Play 免费下载。语音操作与待机相片墙为壁挂平板专属。',
    dayTitle: '一天，就这样过。',
    daySub: '一键执行，或依时间与传感器自动触发。示范住家的四个情境，名称由您决定。',
    dayLink: '看情境怎么设定',
    dayMoments: [
      { time: '07:00', name: '早安模式', body: '窗帘与灯光跟着你起床。用电趋势，平板和手机都看得到。' },
      { time: '08:10', name: '离家模式', body: '关全部灯、关空调。不用回头检查。' },
      { time: '18:40', name: '回家模式', body: '包裹到了、公告更新了，都在同一个 App。进门一键，灯先亮。' },
      { time: '23:00', name: '晚安模式', body: '一键关灯。壁挂平板待机时，是相片墙。' },
    ],
    capTitle: '每天都会用到的四件事。', capSub: '照明、插座、窗帘、空调、传感器、摄像头。一台平板，看见、控制、自动化。',
    capData: '设备数据', capDataSub: '用电趋势、用电分布、用水量、空气质量。平板与手机都有。',
    capVoice: '语音操作', capVoiceSub: '壁挂平板专属。涉及安全的设备会先向您确认。', capVoiceQuote: '「开客厅灯」',
    capWarehouse: '智慧仓储', capWarehouseSub: '滤芯、电池、备品放哪里、剩多少。', capWarehouseChips: ['物品', '柜位', '低库存提醒'],
    capScenes: '情境', capScenesSub: '「离家」等于关全部灯加关空调。一键执行，或依时间、传感器自动触发。',
    bmsTitle: '一栋大楼，一个大脑。', bmsSub: '社区服务与家里的设备，同一个 App、同一台平板。',
    bmsItems: ['社区公告与通知', '报修与工单追踪', '公设预约', '包裹通知与取件'],
    bmsPhotoCap: '建案导入', bmsPhotoSub: '社区与每一户，同一套系统',
    proofTitle: '真实住家。', proofAll: '看全部案例', showroomTitle: '两个展示间，亲自走一趟。',
    ctaTitle: '想看看您家会变成什么样子？', ctaSub: '留下联系方式，我们安排展示间体验与规划建议。', hours: '周一至周五 09:00-18:00',
  },
  en: {
    cta: 'Book a visit', seeProduct: 'See the product', lineCta: 'Ask us on LINE',
    altTablet: 'enGo wall tablet home screen with device cards grouped by room', altPhone: 'enGo智慧管家 home screen on iPhone, Model Home demo household', altAnnounce: 'Community announcements on the tablet',
    ifTitle: 'Three interfaces. One account.',
    ifSub: 'The wall tablet runs the home. Your phone takes over when you are out.',
    ifTablet: 'enGo wall tablet', ifTabletCap: 'Devices, scenes, device data and community services, plus tablet-only voice and the standby photo wall.',
    ifIosCap: 'Remote control on the go, same account.', ifAndroid: 'Android phone', ifAndroidCap: 'Announcements, repairs and bookings, anytime.',
    ifNote: 'The app is free on the App Store and Google Play, listed as enGo智慧管家. Voice control and the standby photo wall are wall-tablet only.',
    dayTitle: 'A day, the easy way.',
    daySub: 'One tap, or triggered by time and sensors. Four scenes from the demo home; the names are yours.',
    dayLink: 'How scenes are set up',
    dayMoments: [
      { time: '07:00', name: 'Good morning', body: 'Curtains and lights wake up with you. Energy trend on the tablet and the phone.' },
      { time: '08:10', name: 'Away', body: 'All lights off, AC off. No walking back to check.' },
      { time: '18:40', name: 'Home', body: 'A parcel and a notice, in the same app. One tap at the door, lights first.' },
      { time: '23:00', name: 'Good night', body: 'One tap, lights off. On standby the wall tablet is a photo wall.' },
    ],
    capTitle: 'Four things you will use every day.', capSub: 'Lighting, outlets, curtains, air conditioning, sensors, cameras. One tablet to see, control and automate.',
    capData: 'Device data', capDataSub: 'Energy trend and share, water use, air quality. On the tablet and in the app.',
    capVoice: 'Voice control', capVoiceSub: 'Wall tablet only. Safety-related devices ask for confirmation first.', capVoiceQuote: '"Living room lights on"',
    capWarehouse: 'Smart inventory', capWarehouseSub: 'Where the filters, batteries and spares are, and how many are left.', capWarehouseChips: ['Items', 'Cabinets', 'Low-stock alerts'],
    capScenes: 'Scenes', capScenesSub: '"Away" means all lights off and AC off. One tap, or by time and sensor.',
    bmsTitle: 'One brain. Every building.', bmsSub: 'Community services and the home, in the same app and the same tablet.',
    bmsItems: ['Announcements and notices', 'Repair requests and tracking', 'Facility booking', 'Parcel notice and pickup'],
    bmsPhotoCap: 'Development rollout', bmsPhotoSub: 'The community and every home on one system',
    proofTitle: 'Real homes.', proofAll: 'All cases', showroomTitle: 'Two showrooms. Come and see.',
    ctaTitle: 'Curious what your home would look like?', ctaSub: 'Leave your details and we will arrange a showroom visit and planning advice.', hours: 'Mon to Fri 09:00-18:00',
  },
}
const T = computed(() => COPY[locale.value] ?? COPY.en)
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

// ─── Apple-profile tokens (design-md/apple, copied, not recalled) ───────────
// ink #1d1d1f · parchment #f5f5f7 · dark tile #272729 / #2a2a2c · hairline #e0e0e0
// body-muted-on-dark #cccccc · ink-muted-48 #7a7a7a · product shadow rgba(0,0,0,.22) 3px 5px 30px
// Accent is enGo orange ($brand-orange / $brand-orange-text), the one interactive colour.
$ink: #1d1d1f;
$ink-48: #7a7a7a; // profile: disabled / micro legal only
$ink-80: #333333; // profile: ink-muted-80, AA on white and parchment
$parchment: #f5f5f7;
$tile-dark: #272729;
$tile-dark-2: #2a2a2c;
$hairline: #e0e0e0;
$on-dark-muted: #cccccc;
$product-shadow: rgba(0, 0, 0, .22) 3px 5px 30px 0;
$display: 'Noto Sans TC', system-ui, -apple-system, sans-serif;

.hm { background: #fff; color: $ink; font-family: $display; }
.hm-wrap { max-width: 1240px; margin: 0 auto; padding-inline: clamp(20px, 5vw, 64px); }
.hm-center { text-align: center; }

// Tiles: edge to edge, 0 gap, the colour change is the divider.
.hm-tile { padding: clamp(64px, 9vw, 112px) 0; }
.hm-tile-white { background: #fff; color: $ink; }
.hm-tile-parchment { background: $parchment; color: $ink; }
.hm-tile-dark { background: $tile-dark; color: #fff; .hm-h2 { color: #fff; } .hm-lead, .hm-moment-body { color: $on-dark-muted; } }

// ─── type ladder: 600 / 400 / 300, negative tracking at display sizes ─────
.hm-h2 {
  font-family: $display; font-weight: 600; letter-spacing: -.02em; line-height: 1.1; margin: 0; color: inherit;
  font-size: clamp(2rem, 3.6vw, 3rem);
}
.hm-lead { font-size: clamp(1.15rem, 1.7vw, 1.5rem); font-weight: 400; line-height: 1.4; letter-spacing: -.005em; color: $ink; margin: 14px auto 0; max-width: 34em; }
.hm-head { margin-bottom: clamp(36px, 5vw, 64px); }
.hm-head-row { display: flex; justify-content: space-between; align-items: baseline; gap: 20px; flex-wrap: wrap; }
.hm-cap { margin: 14px 0 0; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; color: $ink-80; strong { display: block; color: $ink; font-weight: 600; } }
.hm-fine { margin: 40px 0 0; font-size: .875rem; line-height: 1.43; color: $ink-80; }
.hm-fine-on-dark { color: $on-dark-muted; margin-top: 22px; }

// ─── the one accent: pills and links ──────────────────────────────────────
.hm-pill {
  display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; text-decoration: none;
  font-size: 1.0625rem; font-weight: 400; letter-spacing: -.022em; padding: 11px 22px; min-height: 44px; border-radius: 9999px;
  transition: transform .15s ease, background .2s ease; &:active { transform: scale(.95); }
}
.hm-pill-primary { background: $brand-orange; color: #fff; &:hover { background: darken($brand-orange, 5%); } }
.hm-pill-ghost { color: $brand-orange-text; border: 1px solid $brand-orange-text; &:hover { background: rgba($brand-orange, .06); } }
.hm-pill-ghost-dark { color: #fff; border-color: rgba(255, 255, 255, .55); &:hover { background: rgba(255, 255, 255, .08); } }
.hm-link { color: $brand-orange-text; text-decoration: none; font-size: 1.0625rem; letter-spacing: -.022em; &:hover { text-decoration: underline; } }
.hm-link-on-dark { color: $orange2; }
.hm-chev { margin-left: .25em; }
.hm-cta-row { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 28px; }
.hm-center .hm-cta-row + .hm-link { display: inline-block; margin-top: 18px; }

// ─── device frames: brushed titanium body (Sean 2026-09-24) + the single product shadow
@mixin metal-frame($radius, $pad, $glass, $screen-radius) {
  position: relative; border-radius: $radius; padding: $pad;
  background:
    repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0 1px, transparent 1px 3px),
    linear-gradient(135deg, #f4f6f8 0%, #c4cad2 16%, #e6e9ed 34%, #adb5bf 52%, #dde1e6 70%, #b6bdc6 86%, #eef1f4 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.95), inset 0 -1px 0 rgba(15,23,32,.28), $product-shadow;
  img { display: block; width: 100%; height: auto; border-radius: $screen-radius; box-shadow: 0 0 0 $glass #0c1219, 0 0 0 ($glass + 1px) rgba(255,255,255,.12); }
}
.hm-plate { @include metal-frame(26px, 16px, 7px, 12px); }
.hm-plate-sm { @include metal-frame(18px, 10px, 5px, 9px); }
.hm-plate-land img { aspect-ratio: 2000 / 1148; object-fit: cover; object-position: top; }
.hm-iphone { @include metal-frame(46px, 12px, 6px, 30px); img { aspect-ratio: 800 / 1731; } }
.hm-iphone-sm { @include metal-frame(34px, 9px, 5px, 22px); }
.hm-store { display: inline-block; line-height: 0; margin-top: 14px; img { height: 40px; width: auto; } }
.hm-store-google img { height: 58px; margin: -9px -12px; }

// ─── hero ─────────────────────────────────────────────────────────────────
.hm-hero { padding-top: clamp(84px, 9vw, 104px); padding-bottom: 0; overflow: hidden; }
.hm-kicker { font-size: 1.0625rem; font-weight: 600; letter-spacing: -.022em; color: $ink-80; margin: 0 0 10px; animation: hmRise .7s cubic-bezier(.22,1,.36,1) .05s both; }
.hm-title {
  font-family: $display; font-weight: 600; letter-spacing: -.03em; line-height: 1.05; color: $ink; margin: 0;
  font-size: clamp(2.6rem, 6.4vw, 5rem); animation: hmRise .8s cubic-bezier(.22,1,.36,1) .15s both;
}
.hm-lede { font-size: clamp(1.2rem, 1.9vw, 1.6rem); font-weight: 300; line-height: 1.4; color: $ink; max-width: 30em; margin: 18px auto 0; animation: hmRise .7s cubic-bezier(.22,1,.36,1) .3s both; }
.hm-hero .hm-cta-row, .hm-hero .hm-link { animation: hmRise .7s cubic-bezier(.22,1,.36,1) .45s both; }
.hm-hero-figure {
  position: relative; max-width: 1180px; margin: clamp(40px, 6vw, 72px) auto 0; padding: 0 clamp(20px, 5vw, 64px) clamp(56px, 8vw, 96px);
  animation: hmRise 1s cubic-bezier(.22,1,.36,1) .5s both;
  .hm-plate-tablet { width: 84%; margin: 0 auto; }
  .hm-iphone-hero { position: absolute; right: clamp(20px, 5vw, 64px); bottom: clamp(24px, 4vw, 48px); width: 17%; }
  @media (max-width: 734px) { .hm-plate-tablet { width: 100%; } .hm-iphone-hero { display: none; } }
}

// ─── interfaces ───────────────────────────────────────────────────────────
.hm-if-grid {
  display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 24px; align-items: end;
  @media (max-width: 834px) { grid-template-columns: 1fr 1fr; .hm-if-tablet { grid-column: 1 / -1; } }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
}
.hm-if-item { display: flex; flex-direction: column; .hm-iphone { width: 62%; margin: 0 auto; } }
.hm-if-android { display: flex; align-items: center; justify-content: center; min-height: 160px; border: 1px solid $hairline; border-radius: 18px; background: #fff; }

// ─── a day with enGo ──────────────────────────────────────────────────────
.hm-day-grid {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(24px, 3vw, 40px); margin-bottom: clamp(36px, 5vw, 56px);
  @media (max-width: 834px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
}
.hm-moment { display: flex; flex-direction: column; gap: 8px; padding-top: 22px; border-top: 1px solid rgba(255, 255, 255, .18); }
.hm-moment-time { font-family: $display; font-weight: 600; font-size: clamp(2.2rem, 3.4vw, 3rem); line-height: 1; letter-spacing: -.03em; font-variant-numeric: tabular-nums; }
.hm-moment-name { font-size: 1.3125rem; font-weight: 600; letter-spacing: -.01em; }
.hm-moment-body { margin: 0; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; }

// ─── capabilities: utility cards, hairline, no shadow ─────────────────────
.hm-cap-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
}
.hm-card {
  display: flex; flex-direction: column; border: 1px solid $hairline; border-radius: 18px; background: $parchment; color: $ink; text-decoration: none; overflow: hidden;
  transition: transform .15s ease; &:active { transform: scale(.99); }
}
.hm-card-media { display: flex; align-items: center; justify-content: center; min-height: 300px; padding: 32px; }
.hm-card-media .hm-plate-sm { width: 92%; }
.hm-card-media-phone .hm-iphone-sm { width: 34%; max-width: 150px; }
.hm-card-media-quote { background: $tile-dark-2; }
.hm-voice-quote { font-family: $display; font-weight: 600; color: #fff; letter-spacing: -.02em; font-size: clamp(2rem, 3.4vw, 3rem); line-height: 1.1; }
.hm-card-list {
  list-style: none; margin: 0; padding: 0; width: 100%; max-width: 360px;
  li { padding: 16px 0; border-top: 1px solid $hairline; font-size: 1.3125rem; font-weight: 600; letter-spacing: -.01em; &:last-child { border-bottom: 1px solid $hairline; } }
}
.hm-card-text { padding: 0 32px 32px; display: flex; flex-direction: column; gap: 4px; strong { font-size: 1.3125rem; font-weight: 600; letter-spacing: -.01em; } span { font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; color: $ink-80; } }

// ─── HMS × BMS ────────────────────────────────────────────────────────────
.hm-bms-grid { display: grid; grid-template-columns: 6fr 6fr; gap: clamp(32px, 5vw, 72px); align-items: center; @media (max-width: 834px) { grid-template-columns: 1fr; } }
.hm-bms-copy .hm-lead { margin-left: 0; }
.hm-bms-list {
  list-style: none; padding: 0; margin: 28px 0 0; display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px;
  li { border-top: 1px solid $hairline; padding: 12px 0; font-size: 1.0625rem; letter-spacing: -.022em; }
}
.hm-bms-media { display: grid; gap: 24px; }
.hm-photo {
  display: block; text-decoration: none; color: $ink;
  img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; display: block; border-radius: 18px; }
}

// ─── proof ────────────────────────────────────────────────────────────────
.hm-proof-grid {
  display: grid; grid-template-columns: 3fr 2fr 2fr; gap: 24px; align-items: start;
  .hm-photo img { aspect-ratio: 4 / 3; }
  @media (max-width: 834px) { grid-template-columns: 1fr 1fr; .hm-photo:first-child { grid-column: 1 / -1; } }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
}
.hm-showroom {
  border: 1px solid $hairline; border-radius: 18px; padding: 28px; display: flex; flex-direction: column; gap: 22px;
  ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; }
  li { display: flex; flex-direction: column; padding: 12px 0; border-top: 1px solid $hairline; a { color: $ink; font-weight: 600; text-decoration: none; letter-spacing: -.01em; &:hover { color: $brand-orange-text; } } span { font-size: .875rem; color: $ink-80; } }
}
.hm-showroom-title { font-family: $display; font-weight: 600; font-size: 1.3125rem; letter-spacing: -.01em; line-height: 1.25; margin: 0; }

// ─── news + cta ───────────────────────────────────────────────────────────
.hm-news { padding-bottom: clamp(40px, 6vw, 72px); }
.hm-cta .hm-lead { margin-bottom: 0; }

// ─── keyframes ────────────────────────────────────────────────────────────
@keyframes hmRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  .hm-kicker, .hm-title, .hm-lede, .hm-hero .hm-cta-row, .hm-hero .hm-link, .hm-hero-figure { animation: none; }
  .hm-pill, .hm-card { transition: none; }
}
</style>
