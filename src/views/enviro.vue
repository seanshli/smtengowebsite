<template>
  <section id="enviro" class="ap-page ev-page">
    <!-- tile 1, white: title, subtitle, consultation pill -->
    <div class="ap-tile ap-tile-first ap-white">
      <div class="ap-wrap ap-center">
        <h1 class="ap-title">{{ $t('enviroTitle') }}</h1>
        <p class="ap-lead fade-in">
          {{ tx('整合陽光、空氣、水與智慧廚房，一套系統，讓整個空間的環境彼此連動。', '集成阳光、空气、水与智慧厨房，一套系统，让整个空间的环境彼此连动。', 'Sunlight, air, water, and the smart kitchen, one system where the whole environment moves together.', { ja: '陽光、空気、水、そしてスマートキッチン。ひとつのシステムで、空間全体の環境を連動させます。', fr: 'Lumière du soleil, air, eau et cuisine connectée : un seul système pour que tout l’environnement évolue de concert.', es: 'Luz del sol, aire, agua y cocina inteligente: un solo sistema para que todo el entorno se mueva en conjunto.' }) }}
        </p>
        <div class="ap-cta-row fade-in">
          <router-link to="/contact" class="ap-pill ap-pill-primary">
            {{ tx('免費預約諮詢', '免费预约咨询', 'Book a free consultation', { ja: '無料相談を予約する', fr: 'Réserver une consultation gratuite', es: 'Reservar una consulta gratuita' }) }}
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
            :alt="tx('enGo 智慧環控網絡示意圖', 'enGo 智慧环控网络示意图', 'enGo environmental control network illustration', { ja: 'enGoスマート環境制御ネットワークのイメージ図', fr: 'Illustration du réseau de contrôle environnemental enGo', es: 'Ilustración de la red de control ambiental de enGo' })"
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
            <h2 class="ap-h2 ev-pillar-title">{{ lt(p.title) }}</h2>
            <p class="ap-body ev-pillar-copy">{{ lt(p.copy) }}</p>
            <ul class="ap-rows ev-pillar-points">
              <li v-for="(pt, j) in lt(p.points)" :key="j">{{ pt }}</li>
            </ul>
          </article>
        </div>
      </div>
    </div>

    <!-- tile 4, dark: closing -->
    <div class="ap-tile ap-dark">
      <div class="ap-wrap ap-wrap-text ap-center fade-in">
        <p class="ev-closing-line">
          {{ tx('陽光、空氣、水，加上一顆懂家的大腦。', '阳光、空气、水，加上一颗懂家的大脑。', 'Sunlight, air, water, and one brain that understands your home.', { ja: '陽光、空気、水、そして住まいを理解するひとつの頭脳。', fr: 'Soleil, air, eau, et un cerveau qui comprend la maison.', es: 'Luz del sol, aire, agua y un cerebro que entiende el hogar.' }) }}
        </p>
        <div class="ap-cta-row">
          <router-link to="/contact" class="ap-link">
            {{ tx('與我們聊聊您的空間', '与我们聊聊您的空间', 'Talk to us about your space', { ja: 'ご自宅・ご利用空間についてご相談ください', fr: 'Parlez-nous de votre espace', es: 'Cuéntenos sobre su espacio' }) }}
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useLocaleText } from '../composables/useLocaleText'
import { useScrollReveal } from '../composables/useScrollReveal'

interface Bi {
  zh: string
  zhCN: string
  en: string
  ja?: string
  fr?: string
  es?: string
}

interface Pillar {
  id: string
  icon: string // inline SVG fragment, stroke via currentColor
  title: Bi
  copy: Bi
  points: { zh: string[]; zhCN: string[]; en: string[]; ja?: string[]; fr?: string[]; es?: string[] }
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
    title: { zh: '智慧陽光控溫', zhCN: '智慧阳光控温', en: 'Smart daylight & temperature', ja: 'スマート採光・温度制御', fr: 'Lumière naturelle et température intelligentes', es: 'Luz natural y temperatura inteligentes' },
    copy: {
      zh: '動態採光與溫度調節，依日照、時段與人的活動自動連動窗簾、空調與照明，營造舒適節能的空間。',
      zhCN: '动态采光与温度调节，依日照、时段与人的活动自动连动窗帘、空调与照明，营造舒适节能的空间。',
      en: 'Dynamic daylighting and temperature control: curtains, HVAC, and lighting move together with the sun, the hour, and the people in the room.',
      ja: '動的な採光と温度調整。日照、時間帯、人の動きに合わせて、カーテン、空調、照明が自動で連動し、快適で省エネな空間をつくります。',
      fr: 'Éclairage naturel et régulation de la température : rideaux, climatisation et éclairage évoluent avec le soleil, l’heure et les personnes présentes dans la pièce.',
      es: 'Iluminación natural y control de temperatura dinámicos: cortinas, aire acondicionado e iluminación se ajustan juntos según el sol, la hora y las personas en el espacio.'
    },
    points: {
      zh: ['窗簾／照明／空調 三方連動', '日照與室溫曲線自動調節', '節能報表看得見'],
      zhCN: ['窗帘／照明／空调 三方连动', '日照与室温曲线自动调节', '节能报表看得见'],
      en: ['Curtains, lighting & HVAC in one loop', 'Auto-tuning to sun and room curves', 'Visible energy savings'],
      ja: ['カーテン／照明／空調の三者連動', '日照と室温のカーブに合わせて自動調整', '省エネレポートで見える化'],
      fr: ['Rideaux, éclairage et climatisation dans une seule boucle', 'Réglage automatique selon le soleil et la température de la pièce', 'Économies d’énergie visibles'],
      es: ['Cortinas, iluminación y aire acondicionado en un solo ciclo', 'Ajuste automático según el sol y la temperatura del espacio', 'Ahorro de energía visible']
    }
  },
  {
    id: 'air',
    icon: ICONS.air,
    title: { zh: '空氣淨化監測', zhCN: '空气净化监测', en: 'Air purification & monitoring', ja: '空気浄化モニタリング', fr: 'Purification et surveillance de l’air', es: 'Purificación y monitoreo del aire' },
    copy: {
      zh: '全天候 PM2.5、VOC 與氣體監測，串連清風除濕與新風設備，保障室內每一口健康空氣。',
      zhCN: '全天候 PM2.5、VOC 与气体监测，串连清风除湿与新风设备，保障室内每一口健康空气。',
      en: 'Round-the-clock PM2.5, VOC, and gas monitoring, wired to fresh-air dehumidification, every breath indoors accounted for.',
      ja: '24時間体制でPM2.5、VOC、ガスを監視し、新風除湿機器と連動。室内の空気をひと呼吸ごとに見守ります。',
      fr: 'Surveillance continue des PM2,5, des COV et des gaz, reliée à la déshumidification à air neuf : chaque respiration à l’intérieur est prise en compte.',
      es: 'Monitoreo permanente de PM2.5, COV y gases, conectado a la deshumidificación de aire fresco, para cuidar cada respiración en interiores.'
    },
    points: {
      zh: ['PM2.5／VOC／CO₂ 即時監測', '清風除濕・新風自動連動', '異常即時推播'],
      zhCN: ['PM2.5／VOC／CO₂ 实时监测', '清风除湿・新风自动连动', '异常实时推播'],
      en: ['Live PM2.5 / VOC / CO₂ sensing', 'Auto-linked fresh-air dehumidification', 'Instant anomaly alerts'],
      ja: ['PM2.5／VOC／CO₂をリアルタイム監視', '新風除湿を自動連動', '異常をリアルタイムで通知'],
      fr: ['Mesure en direct des PM2,5 / COV / CO₂', 'Déshumidification à air neuf liée automatiquement', 'Alertes instantanées en cas d’anomalie'],
      es: ['Medición en vivo de PM2.5 / COV / CO₂', 'Deshumidificación de aire fresco vinculada automáticamente', 'Alertas instantáneas ante anomalías']
    }
  },
  {
    id: 'water',
    icon: ICONS.water,
    title: { zh: '智慧水務管理', zhCN: '智慧水务管理', en: 'Smart water management', ja: 'スマート水管理', fr: 'Gestion intelligente de l’eau', es: 'Gestión inteligente del agua' },
    copy: {
      zh: '水質過濾與流量優化，濾芯壽命、漏水偵測與用水數據一目瞭然，智慧供水更安全高效。',
      zhCN: '水质过滤与流量优化，滤芯寿命、漏水侦测与用水数据一目了然，智慧供水更安全高效。',
      en: 'Filtration and flow optimization: filter life, leak detection, and usage data in one view, for safer and smarter water.',
      ja: '水質ろ過と流量の最適化。フィルター寿命、漏水検知、使用量データをひと目で確認でき、より安全で効率的な給水を実現します。',
      fr: 'Filtration et optimisation du débit : durée de vie des filtres, détection de fuites et données de consommation en un coup d’œil, pour une eau plus sûre et plus intelligente.',
      es: 'Filtración y optimización del flujo: vida útil de los filtros, detección de fugas y datos de consumo en una sola vista, para un suministro de agua más seguro e inteligente.'
    },
    points: {
      zh: ['水質／流量／漏水 全監測', '濾芯壽命自動提醒', '電子水閥即時關斷'],
      zhCN: ['水质／流量／漏水 全监测', '滤芯寿命自动提醒', '电子水阀实时关断'],
      en: ['Quality, flow & leak monitoring', 'Automatic filter-life reminders', 'Instant electronic shut-off'],
      ja: ['水質／流量／漏水をまるごと監視', 'フィルター寿命を自動でお知らせ', '電子バルブで即時遮断'],
      fr: ['Suivi de la qualité, du débit et des fuites', 'Rappels automatiques de fin de vie des filtres', 'Coupure électronique instantanée'],
      es: ['Monitoreo de calidad, flujo y fugas', 'Recordatorios automáticos de vida útil del filtro', 'Corte electrónico instantáneo']
    }
  },
  {
    id: 'kitchen',
    icon: ICONS.kitchen,
    title: { zh: '智慧廚房安全', zhCN: '智慧厨房安全', en: 'Smart kitchen safety', ja: 'スマートキッチンの安全', fr: 'Sécurité de la cuisine connectée', es: 'Seguridad inteligente en la cocina' },
    copy: {
      zh: '遠端監控廚房設備，火災預警、瓦斯偵測與能源優化，安心，從家的心臟開始。',
      zhCN: '远程监控厨房设备，火灾预警、瓦斯侦测与能源优化，安心，从家的心脏开始。',
      en: 'Remote oversight of kitchen equipment with fire early-warning, gas detection, and energy optimization, peace of mind, from the heart of the home.',
      ja: 'キッチン機器を遠隔で見守り、火災の早期警報、ガス検知、エネルギーの最適化を実現。安心は、家の中心から始まります。',
      fr: 'Supervision à distance des équipements de cuisine, avec alerte précoce d’incendie, détection de gaz et optimisation de l’énergie : la tranquillité d’esprit, au cœur de la maison.',
      es: 'Supervisión remota de los equipos de cocina, con alerta temprana de incendio, detección de gas y optimización de energía: tranquilidad desde el corazón del hogar.'
    },
    points: {
      zh: ['瓦斯／煙霧 預警偵測', '爐具遠端狀態監控', '能源使用優化'],
      zhCN: ['瓦斯／烟雾 预警侦测', '炉具远程状态监控', '能源使用优化'],
      en: ['Gas & smoke early warning', 'Remote stove monitoring', 'Energy-use optimization'],
      ja: ['ガス／煙の早期警報検知', 'コンロの状態を遠隔監視', 'エネルギー使用の最適化'],
      fr: ['Alerte précoce gaz et fumée', 'Surveillance à distance de la cuisinière', 'Optimisation de la consommation d’énergie'],
      es: ['Alerta temprana de gas y humo', 'Monitoreo remoto de la estufa', 'Optimización del consumo de energía']
    }
  }
]

export default defineComponent({
  name: 'Enviro',
  setup() {
    const { tx, lt } = useLocaleText()
    useScrollReveal('.fade-in', 'visible')
    return { tx, lt, pillars: PILLARS }
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
