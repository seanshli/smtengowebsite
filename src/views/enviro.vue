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

    <!-- Network scene: Gemini-rendered illustration in the night-edition
         palette (generated via the ai-studio-image skill, text-free edit of
         v1). Replaces the earlier hand-built SVG — one diagram, the richer
         one; the SVG lives in git history if ever needed again. -->
    <figure class="ev-scene-wrap fade-in">
      <img
        class="ev-scene-img"
        src="/images/enviro/enviro-network.jpg"
        :alt="isZh ? 'enGo 智慧環控網絡示意圖' : 'enGo environmental control network illustration'"
        decoding="async"
      />
    </figure>

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
    return { isZh, pillars: PILLARS }
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

// ─── network scene (rendered illustration) ───
.ev-scene-wrap {
  max-width: 900px;
  margin: 8px auto 48px;
}

.ev-scene-img {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid rgba($warm-bg-light, 0.28);
  box-shadow: 0 22px 44px -24px rgba(0, 0, 0, 0.65);
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
