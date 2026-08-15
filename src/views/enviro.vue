<template>
  <!-- 夜間版 night edition: the one dark page in the 生活誌 system. Ground is
       brand navy (not black), type is cream, wires are orange — the same
       tokens as the light pages, roles inverted. -->
  <section id="enviro" class="ev-page">
    <!-- Editorial masthead, inverted -->
    <header class="ev-mast">
      <p class="ev-kicker">{{ isZh ? '全方位環控方案' : 'TOTAL ENVIRONMENTAL CONTROL' }}</p>
      <h1 class="ev-title">{{ $t('enviroTitle') }}</h1>
      <p class="ev-sub fade-in">
        {{ isZh
          ? '整合陽光、空氣、水與智慧廚房——一套系統，讓整個空間的環境彼此連動。'
          : 'Sunlight, air, water, and the smart kitchen — one system where the whole environment moves together.' }}
      </p>
      <router-link to="/contact" class="ev-cta fade-in">
        {{ isZh ? '免費預約諮詢' : 'Book a free consultation' }} →
      </router-link>
    </header>

    <!-- Network scene: hand-built in brand colors (swap-ready for a rendered
         illustration in /images/enviro/ once one is generated). -->
    <div class="ev-scene-wrap fade-in" aria-hidden="true">
      <svg class="ev-scene" viewBox="0 0 720 560" fill="none">
        <!-- wires -->
        <path class="ev-wire" d="M 170 130 C 260 180, 290 230, 330 260" />
        <path class="ev-wire" d="M 550 130 C 460 180, 430 230, 390 260" />
        <path class="ev-wire" d="M 170 430 C 260 380, 290 330, 330 300" />
        <path class="ev-wire" d="M 550 430 C 460 380, 430 330, 390 300" />

        <!-- hub -->
        <g transform="translate(360, 280)">
          <rect class="ev-hub-halo" x="-84" y="-84" width="168" height="168" rx="10" transform="rotate(45)" />
          <rect class="ev-hub" x="-62" y="-62" width="124" height="124" rx="8" transform="rotate(45)" />
          <text class="ev-hub-label" y="9">enGo</text>
        </g>

        <!-- device cards -->
        <g v-for="d in devices" :key="d.id" :transform="`translate(${d.x}, ${d.y})`" class="ev-node">
          <rect class="ev-card" x="-92" y="-46" width="184" height="92" rx="6" />
          <g transform="translate(-62, 0)" v-html="d.icon"></g>
          <text class="ev-card-title" x="-30" y="-4">{{ isZh ? d.zh : d.en }}</text>
          <text class="ev-card-sub" x="-30" y="20">{{ d.tag }}</text>
        </g>
      </svg>
    </div>

    <!-- Four pillars -->
    <div class="ev-pillars">
      <article v-for="(p, i) in pillars" :key="p.id" class="ev-pillar fade-in">
        <span class="ev-pillar-num">{{ String(i + 1).padStart(2, '0') }}</span>
        <h2 class="ev-pillar-title">{{ isZh ? p.title.zh : p.title.en }}</h2>
        <p class="ev-pillar-copy">{{ isZh ? p.copy.zh : p.copy.en }}</p>
        <ul class="ev-pillar-points">
          <li v-for="(pt, j) in (isZh ? p.points.zh : p.points.en)" :key="j">{{ pt }}</li>
        </ul>
      </article>
    </div>

    <!-- Closing: inverted back to cream — the daylight returns -->
    <div class="ev-closing">
      <div class="ev-closing-inner fade-in">
        <p class="ev-closing-line">
          {{ isZh
            ? '陽光、空氣、水——加上一顆懂家的大腦。'
            : 'Sunlight, air, water — and one brain that understands your home.' }}
        </p>
        <router-link to="/contact" class="ev-closing-cta">
          {{ isZh ? '與我們聊聊您的空間' : 'Talk to us about your space' }} →
        </router-link>
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

const DEVICES = [
  { id: 'sun', x: 150, y: 110, zh: '智慧陽光控溫', en: 'Daylight & Temp', tag: 'LUX · °C', icon: ICONS.sun },
  { id: 'air', x: 570, y: 110, zh: '空氣淨化監測', en: 'Air Purification', tag: 'PM2.5 · VOC', icon: ICONS.air },
  { id: 'water', x: 150, y: 450, zh: '智慧水務管理', en: 'Smart Water', tag: 'TDS · FLOW', icon: ICONS.water },
  { id: 'kitchen', x: 570, y: 450, zh: '智慧廚房安全', en: 'Kitchen Safety', tag: 'GAS · FIRE', icon: ICONS.kitchen }
]

const PILLARS: Pillar[] = [
  {
    id: 'sun',
    title: { zh: '智慧陽光控溫', en: 'Smart daylight & temperature' },
    copy: {
      zh: '動態採光與溫度調節，依日照、時段與人的活動自動連動窗簾、空調與照明，營造舒適節能的空間。',
      en: 'Dynamic daylighting and temperature control — curtains, HVAC, and lighting move together with the sun, the hour, and the people in the room.'
    },
    points: {
      zh: ['窗簾／照明／空調 三方連動', '日照與室溫曲線自動調節', '節能報表看得見'],
      en: ['Curtains, lighting & HVAC in one loop', 'Auto-tuning to sun and room curves', 'Visible energy savings']
    }
  },
  {
    id: 'air',
    title: { zh: '空氣淨化監測', en: 'Air purification & monitoring' },
    copy: {
      zh: '全天候 PM2.5、VOC 與氣體監測，串連清風除濕與新風設備，保障室內每一口健康空氣。',
      en: 'Round-the-clock PM2.5, VOC, and gas monitoring, wired to fresh-air dehumidification — every breath indoors accounted for.'
    },
    points: {
      zh: ['PM2.5／VOC／CO₂ 即時監測', '清風除濕・新風自動連動', '異常即時推播'],
      en: ['Live PM2.5 / VOC / CO₂ sensing', 'Auto-linked fresh-air dehumidification', 'Instant anomaly alerts']
    }
  },
  {
    id: 'water',
    title: { zh: '智慧水務管理', en: 'Smart water management' },
    copy: {
      zh: '水質過濾與流量優化，濾芯壽命、漏水偵測與用水數據一目瞭然，智慧供水更安全高效。',
      en: 'Filtration and flow optimization — filter life, leak detection, and usage data in one view, for safer and smarter water.'
    },
    points: {
      zh: ['水質／流量／漏水 全監測', '濾芯壽命自動提醒', '電子水閥即時關斷'],
      en: ['Quality, flow & leak monitoring', 'Automatic filter-life reminders', 'Instant electronic shut-off']
    }
  },
  {
    id: 'kitchen',
    title: { zh: '智慧廚房安全', en: 'Smart kitchen safety' },
    copy: {
      zh: '遠端監控廚房設備，火災預警、瓦斯偵測與能源優化——安心，從家的心臟開始。',
      en: 'Remote oversight of kitchen equipment with fire early-warning, gas detection, and energy optimization — peace of mind, from the heart of the home.'
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
    return { isZh, devices: DEVICES, pillars: PILLARS }
  }
})
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

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

  .ev-wire {
    animation: none !important;
  }
}

// ─── night ground ───
.ev-page {
  background: $grey-blue3;
  padding: 110px 5vw 0;
  color: $warm-bg-light;

  @media (max-width: 768px) {
    padding-top: 96px;
  }
}

.ev-mast {
  max-width: 1100px;
  margin: 0 auto 20px;
  border-top: 3px solid $warm-bg-light;
  padding-top: 22px;
}

.ev-kicker {
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.28em;
  color: $orange2;
  margin-bottom: 8px;
}

.ev-title {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: clamp(2.6rem, 8vw, 5.4rem);
  line-height: 1.08;
  color: $warm-bg-light;
  margin-bottom: 14px;
}

.ev-sub {
  font-size: clamp(1.12rem, 2vw, 1.4rem);
  font-weight: 500;
  line-height: 1.95;
  color: rgba($warm-bg-light, 0.82);
  max-width: 32em;
}

.ev-cta {
  display: inline-block;
  margin-top: 26px;
  font-family: 'Noto Serif TC', serif;
  font-weight: 700;
  font-size: 1.08rem;
  color: $grey-blue3;
  background: $brand-orange;
  padding: 13px 26px;
  text-decoration: none;
  transition: background 0.25s ease, transform 0.25s ease;

  &:hover {
    background: $orange2;
    transform: translate(-2px, -2px);
  }
}

// ─── network scene ───
.ev-scene-wrap {
  max-width: 900px;
  margin: 8px auto 40px;
}

.ev-scene {
  display: block;
  width: 100%;
  height: auto;
}

.ev-wire {
  stroke: $brand-orange;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-dasharray: 6 10;
  animation: evFlow 1.6s linear infinite;
  opacity: 0.9;
}

@keyframes evFlow {
  to {
    stroke-dashoffset: -32;
  }
}

.ev-hub-halo {
  fill: rgba($brand-orange, 0.14);
}

.ev-hub {
  fill: #1d3346;
  stroke: $brand-orange;
  stroke-width: 2.5;
}

.ev-hub-label {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: 30px;
  fill: $warm-bg-light;
  text-anchor: middle;
}

.ev-card {
  fill: #1d3346;
  stroke: rgba($warm-bg-light, 0.35);
  stroke-width: 1.5;
}

.ev-node {
  color: $gold; // icons pick this up via currentColor

  &:nth-of-type(odd) {
    color: $orange2;
  }
}

.ev-card-title {
  font-family: 'Noto Serif TC', serif;
  font-weight: 700;
  font-size: 19px;
  fill: $warm-bg-light;
}

.ev-card-sub {
  font-size: 12px;
  letter-spacing: 0.22em;
  fill: rgba($warm-bg-light, 0.55);
}

// ─── pillars ───
.ev-pillars {
  max-width: 1100px;
  margin: 0 auto;
  padding-bottom: 90px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 26px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 18px;
    padding-bottom: 56px;
  }
}

.ev-pillar {
  position: relative;
  background: #1d3346;
  border: 1px solid rgba($warm-bg-light, 0.28);
  padding: 30px 30px 26px;
  transition: transform 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 8px -8px -8px 8px;
    border: 2px solid transparent;
    transition: border-color 0.3s ease;
    z-index: -1;
  }

  &:hover {
    transform: translate(-3px, -3px);

    &::before {
      border-color: $brand-orange;
    }
  }
}

.ev-pillar-num {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: 1.7rem;
  color: transparent;
  -webkit-text-stroke: 1.5px $orange2;
}

.ev-pillar-title {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: clamp(1.35rem, 2.6vw, 1.75rem);
  color: $warm-bg-light;
  margin: 10px 0 12px;
}

.ev-pillar-copy {
  font-size: 1rem;
  line-height: 1.95;
  color: rgba($warm-bg-light, 0.8);
  margin-bottom: 18px;
}

.ev-pillar-points {
  list-style: none;
  padding: 0;
  border-top: 1px solid rgba($warm-bg-light, 0.22);

  li {
    padding: 8px 0 8px 18px;
    border-bottom: 1px solid rgba($warm-bg-light, 0.12);
    font-size: 0.92rem;
    color: rgba($warm-bg-light, 0.85);
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 1em;
      width: 8px;
      height: 2px;
      background: $orange2;
    }
  }
}

// ─── closing: back to daylight ───
.ev-closing {
  background: $warm-bg-light;
  margin: 0 -5vw;
  padding: 84px 5vw;
  text-align: center;
}

.ev-closing-inner {
  max-width: 720px;
  margin: 0 auto;
}

.ev-closing-line {
  font-family: 'Noto Serif TC', serif;
  font-weight: 700;
  font-size: clamp(1.3rem, 2.8vw, 1.9rem);
  line-height: 1.9;
  color: $grey-blue3;
  margin-bottom: 24px;
}

.ev-closing-cta {
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
