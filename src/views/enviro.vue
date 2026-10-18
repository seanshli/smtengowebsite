<template>
  <section id="enviro" class="ap-page ev-page">
    <!-- tile 1, white: title, subtitle, consultation pill -->
    <div class="ap-tile ap-tile-first ap-white">
      <div class="ap-wrap ap-center">
        <h1 class="ap-title">{{ $t('enviroTitle') }}</h1>
        <p class="ap-lead fade-in">
          {{ isZh
            ? '整合陽光、空氣、水與智慧廚房，一套系統，讓整個空間的環境彼此連動。'
            : 'Sunlight, air, water, and the smart kitchen, one system where the whole environment moves together.' }}
        </p>
        <div class="ap-cta-row fade-in">
          <router-link to="/contact" class="ap-pill ap-pill-primary">
            {{ isZh ? '免費預約諮詢' : 'Book a free consultation' }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- tile 2, parchment: the network illustration (text-free render in the site palette) -->
    <div class="ap-tile ap-parchment">
      <div class="ap-wrap">
        <figure class="ap-photo ev-scene fade-in">
          <img
            src="/images/enviro/enviro-network.jpg"
            :alt="isZh ? 'enGo 智慧環控網絡示意圖' : 'enGo environmental control network illustration'"
            decoding="async"
          />
        </figure>
      </div>
    </div>

    <!-- tile 3, white: four pillars as cards -->
    <div class="ap-tile ap-white">
      <div class="ap-wrap">
        <div class="ap-grid ap-grid-2 ev-pillars">
          <article v-for="p in pillars" :key="p.id" class="ap-card ev-pillar fade-in">
            <svg class="ev-pillar-icon" viewBox="-24 -24 48 48" aria-hidden="true" v-html="p.icon"></svg>
            <h2 class="ap-h2 ev-pillar-title">{{ isZh ? p.title.zh : p.title.en }}</h2>
            <p class="ap-body ev-pillar-copy">{{ isZh ? p.copy.zh : p.copy.en }}</p>
            <ul class="ap-rows ev-pillar-points">
              <li v-for="(pt, j) in (isZh ? p.points.zh : p.points.en)" :key="j">{{ pt }}</li>
            </ul>
          </article>
        </div>
      </div>
    </div>

    <!-- tile 4, dark: closing -->
    <div class="ap-tile ap-dark">
      <div class="ap-wrap ap-wrap-text ap-center fade-in">
        <p class="ev-closing-line">
          {{ isZh
            ? '陽光、空氣、水，加上一顆懂家的大腦。'
            : 'Sunlight, air, water, and one brain that understands your home.' }}
        </p>
        <div class="ap-cta-row">
          <router-link to="/contact" class="ap-link">
            {{ isZh ? '與我們聊聊您的空間' : 'Talk to us about your space' }}
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

interface Bi {
  zh: string
  en: string
}

interface Pillar {
  id: string
  icon: string // inline SVG fragment, stroke via currentColor
  title: Bi
  copy: Bi
  points: { zh: string[]; en: string[] }
}

// Simple line icons, stroke-based, colored via CSS currentColor.
const ICONS: Record<string, string> = {
  sun: '<circle r="10" fill="none" stroke="currentColor" stroke-width="2.5"/><g stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="0" y1="-19" x2="0" y2="-14"/><line x1="0" y1="14" x2="0" y2="19"/><line x1="-19" y1="0" x2="-14" y2="0"/><line x1="14" y1="0" x2="19" y2="0"/><line x1="-13" y1="-13" x2="-10" y2="-10"/><line x1="10" y1="10" x2="13" y2="13"/><line x1="-13" y1="13" x2="-10" y2="10"/><line x1="10" y1="-10" x2="13" y2="-13"/></g>',
  air: '<g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M -18 -8 H 8 a 7 7 0 1 0 -7 -7"/><path d="M -18 2 H 14 a 7 7 0 1 1 -7 7"/><path d="M -18 12 H 2"/></g>',
  water: '<path d="M 0 -18 C 8 -6, 14 2, 14 9 a 14 14 0 1 1 -28 0 C -14 2, -8 -6, 0 -18 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>',
  kitchen: '<g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="-16" y="-2" width="32" height="16" rx="3"/><line x1="-16" y1="-2" x2="16" y2="-2"/><path d="M -8 -8 C -8 -12, -4 -12, -4 -16"/><path d="M 4 -8 C 4 -12, 8 -12, 8 -16"/></g>'
}

const PILLARS: Pillar[] = [
  {
    id: 'sun',
    icon: ICONS.sun,
    title: { zh: '智慧陽光控溫', en: 'Smart daylight & temperature' },
    copy: {
      zh: '動態採光與溫度調節，依日照、時段與人的活動自動連動窗簾、空調與照明，營造舒適節能的空間。',
      en: 'Dynamic daylighting and temperature control: curtains, HVAC, and lighting move together with the sun, the hour, and the people in the room.'
    },
    points: {
      zh: ['窗簾／照明／空調 三方連動', '日照與室溫曲線自動調節', '節能報表看得見'],
      en: ['Curtains, lighting & HVAC in one loop', 'Auto-tuning to sun and room curves', 'Visible energy savings']
    }
  },
  {
    id: 'air',
    icon: ICONS.air,
    title: { zh: '空氣淨化監測', en: 'Air purification & monitoring' },
    copy: {
      zh: '全天候 PM2.5、VOC 與氣體監測，串連清風除濕與新風設備，保障室內每一口健康空氣。',
      en: 'Round-the-clock PM2.5, VOC, and gas monitoring, wired to fresh-air dehumidification, every breath indoors accounted for.'
    },
    points: {
      zh: ['PM2.5／VOC／CO₂ 即時監測', '清風除濕・新風自動連動', '異常即時推播'],
      en: ['Live PM2.5 / VOC / CO₂ sensing', 'Auto-linked fresh-air dehumidification', 'Instant anomaly alerts']
    }
  },
  {
    id: 'water',
    icon: ICONS.water,
    title: { zh: '智慧水務管理', en: 'Smart water management' },
    copy: {
      zh: '水質過濾與流量優化，濾芯壽命、漏水偵測與用水數據一目瞭然，智慧供水更安全高效。',
      en: 'Filtration and flow optimization: filter life, leak detection, and usage data in one view, for safer and smarter water.'
    },
    points: {
      zh: ['水質／流量／漏水 全監測', '濾芯壽命自動提醒', '電子水閥即時關斷'],
      en: ['Quality, flow & leak monitoring', 'Automatic filter-life reminders', 'Instant electronic shut-off']
    }
  },
  {
    id: 'kitchen',
    icon: ICONS.kitchen,
    title: { zh: '智慧廚房安全', en: 'Smart kitchen safety' },
    copy: {
      zh: '遠端監控廚房設備，火災預警、瓦斯偵測與能源優化，安心，從家的心臟開始。',
      en: 'Remote oversight of kitchen equipment with fire early-warning, gas detection, and energy optimization, peace of mind, from the heart of the home.'
    },
    points: {
      zh: ['瓦斯／煙霧 預警偵測', '爐具遠端狀態監控', '能源使用優化'],
      en: ['Gas & smoke early warning', 'Remote stove monitoring', 'Energy-use optimization']
    }
  }
]

export default defineComponent({
  name: 'Enviro',
  setup() {
    const { locale } = useI18n()
    useScrollReveal('.fade-in', 'visible')
    const isZh = computed(() => locale.value.startsWith('zh'))
    return { isZh, pillars: PILLARS }
  }
})
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

.ev-scene {
  max-width: 980px;
  margin: 0 auto;

  img {
    aspect-ratio: 1400 / 764;
  }
}

.ev-pillars {
  gap: clamp(20px, 2.5vw, 32px);
}

.ev-pillar {
  padding: clamp(24px, 3vw, 36px);
}

.ev-pillar-icon {
  display: block;
  width: 44px;
  height: 44px;
  color: $ink;
}

.ev-pillar-title {
  font-size: clamp(1.5rem, 2.4vw, 2rem);
  margin: 16px 0 12px;
}

.ev-pillar-copy {
  margin-bottom: 20px;
  line-height: 1.6;
}

.ev-pillar-points li {
  font-size: 1.0625rem;
  letter-spacing: -0.022em;
  padding: 10px 0;
}

.ev-closing-line {
  margin: 0;
  font-weight: 600;
  font-size: clamp(1.5rem, 3.2vw, 2.5rem);
  line-height: 1.3;
  letter-spacing: -0.02em;
  color: #fff;
}
</style>
