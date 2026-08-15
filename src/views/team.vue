<template>
  <section id="team" class="tm-page">
    <!-- Editorial masthead -->
    <header class="tm-mast">
      <p class="tm-kicker">enGo 生活誌</p>
      <h1 class="tm-title">{{ $t('teamTitle') }}</h1>
      <p class="tm-sub fade-in">{{ $t('teamSubtitle') }}</p>
    </header>

    <!-- Profiles: alternating editorial spreads -->
    <article
      v-for="(m, i) in members"
      :key="m.id"
      class="tm-profile fade-in"
      :class="{ 'tm-profile--flip': i % 2 === 1 }"
    >
      <figure class="tm-plate">
        <img :src="m.photo" :alt="pick(m.name)" decoding="async" :loading="i === 0 ? 'eager' : 'lazy'" />
        <figcaption>
          <span class="tm-plate-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <span v-if="m.advisor" class="tm-advisor-tag">{{ isZh ? '顧問' : 'Advisor' }}</span>
        </figcaption>
      </figure>

      <div class="tm-bio">
        <p class="tm-role">{{ pick(m.role) }}</p>
        <h2 class="tm-name">
          {{ pick(m.name) }}
          <span class="tm-name-en">{{ m.nameEn }}</span>
        </h2>
        <p class="tm-story">{{ pick(m.story) }}</p>
        <ul class="tm-creds">
          <li v-for="(c, j) in pick(m.creds)" :key="j">{{ c }}</li>
        </ul>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScrollReveal } from '../composables/useScrollReveal'

interface Bi<T> {
  zh: T
  en: T
}

interface Member {
  id: string
  photo: string
  nameEn: string
  advisor?: boolean
  name: Bi<string>
  role: Bi<string>
  story: Bi<string>
  creds: Bi<string[]>
}

// Founding team + board advisor. Sourced from the company team deck
// (ENGO_team.pdf) and the 智管家 company profile.
const MEMBERS: Member[] = [
  {
    id: 'sean-li',
    photo: '/images/team/sean-li.jpg',
    nameEn: 'Sean Li',
    name: { zh: '黎世宏', en: 'Sean Li' },
    role: { zh: '共同創辦人・董事長暨總經理', en: 'Co-founder · Chairman & CEO' },
    story: {
      zh: '美國麻省理工學院（MIT）博士，主修人工智慧、機器人與精密機械設計，累計逾二十八年產業經歷。曾於 Apple 參與 iPod／iPad／iPhone 產品開發，歷任敦南科技策略長、敦宏科技董事長、達爾科技亞太區新業務戰略與發展副總裁。於 enGo 主導自研 enGoCLC／MultiLink 跨設備整合中介層，以及公司二十七項專利的佈局。',
      en: 'MIT Ph.D. in AI, robotics, and precision machine design, with over 28 years across hardware, software, and operations. At Apple he helped ship iPod, iPad, and iPhone; he has served as CSO of Lite-On Semiconductor, Chairman of Dyna Image, and VP of APAC New Business Strategy at Diodes Inc. At enGo he leads the enGoCLC/MultiLink integration layer and the company\'s 27-patent portfolio.'
    },
    creds: {
      zh: [
        'Atlas Magnetics Corp. 策略長',
        '達爾科技（US: DIOD）亞太區新業務戰略與發展副總裁',
        '敦南科技策略長・敦宏科技董事長',
        '蘋果公司 專案經理（iPod／iPad／iPhone）',
        'Asyst 技術總監（AMHS）・應用材料 高級工程師',
        '麻省理工（MIT）碩士、博士',
        '台灣大學／復旦大學 管理學院 EMBA 碩士'
      ],
      en: [
        'CSO, Atlas Magnetics Corp.',
        'VP APAC New Business Strategy & Development, Diodes Inc. (US: DIOD)',
        'CSO, Lite-On Semiconductor · Chairman, Dyna Image',
        'Program Manager, Apple Inc. (iPod / iPad / iPhone)',
        'Director of Technology, Asyst (AMHS) · Sr. Engineer, Applied Materials',
        'M.S. & Ph.D., MIT',
        'EMBA, National Taiwan University / Fudan University'
      ]
    }
  },
  {
    id: 'enzo-chang',
    photo: '/images/team/enzo-chang.jpg',
    nameEn: 'Enzo Chang',
    name: { zh: '張允融', en: 'Enzo Chang' },
    role: { zh: '共同創辦人・設計總監', en: 'Co-founder · Design Director' },
    story: {
      zh: '旅法設計家與品牌經營者，現任 Belber 1891（盧森堡）執行董事暨設計總監，將百年工藝品牌的美學語言與藝術品管理視角，帶進 enGo 的產品與空間設計。',
      en: 'A Paris-trained designer and brand steward, currently Executive Director and Design Director of Belber 1891 (Luxembourg). She brings the aesthetic language of a heritage craft house — and an art-management eye — into enGo\'s product and spatial design.'
    },
    creds: {
      zh: [
        'Belber 1891 International Ltd.（盧森堡）執行董事／設計總監',
        '法國 ESSEC 商學院 碩士',
        '英國皇家藝術學院 RCA innovation 顧問與創新',
        '法國高等藝術學院 碩士・高等應用藝術學 DSAA 碩士',
        '巴黎 École d\'Art et de Culture 蘇富比學校／藝術品管理證照',
        '復旦大學管理學院 EMBA（\'18）・復旦私董會',
        '哈佛商學院全球高管領導力課程'
      ],
      en: [
        'Executive Director / Design Director, Belber 1891 International Ltd. (Luxembourg)',
        'M.S., ESSEC Business School, France',
        'Innovation advisor, Royal College of Art (RCA), UK',
        'M.A., École supérieure d\'arts appliqués (DSAA), France',
        'École d\'Art et de Culture, Paris — Sotheby\'s art management certification',
        'EMBA (\'18), Fudan University · Fudan private board',
        'Harvard Business School global executive leadership program'
      ]
    }
  },
  {
    id: 'jacky-chang',
    photo: '/images/team/jacky-chang.jpg',
    nameEn: 'Jacky Chang',
    name: { zh: '張宏彰', en: 'Jacky Chang' },
    role: { zh: '業務營運長', en: 'VP of Business Operations' },
    story: {
      zh: '橫跨環保建材、數智實業、家居製造與地產開發的連續創業者，長年深耕兩岸與日本市場，深諳供應鏈與跨國營運。於 enGo 掌管營運、供應鏈與通路合作。',
      en: 'A serial entrepreneur across green building materials, digital industry, home manufacturing, and property development, with deep supply-chain and cross-border operating experience spanning Taiwan, China, and Japan. At enGo he runs operations, supply chain, and channel partnerships.'
    },
    creds: {
      zh: [
        '智管家科技股份有限公司 業務營運長',
        '睿呈環保實業有限公司 負責人',
        '珐興數智實業有限公司 總經理',
        '廈門松粽家居股份有限公司 營運總監',
        '帝觀地產開發股份有限公司 董事長',
        '日商台灣變克工業股份有限公司 董事合夥人',
        '國立台中科技大學日文系・日本京都教育大學經濟系',
        '中興大學 EMBA 企管碩士'
      ],
      en: [
        'VP of Business Operations, Smart enGo Home Corp.',
        'Principal, Ruicheng Green Materials',
        'GM, Faxing Digital Industry',
        'Operations Director, Xiamen Songzong Home',
        'Chairman, Diguan Property Development',
        'Board Partner, Vector Industry Taiwan (Japan)',
        'NTCUST Japanese · Kyoto University of Education, Economics',
        'EMBA, National Chung Hsing University'
      ]
    }
  },
  {
    id: 'eric-chang',
    photo: '/images/team/eric-chang.jpg',
    nameEn: 'Eric Chang',
    advisor: true,
    name: { zh: '張益肇', en: 'Eric Chang' },
    role: { zh: '董事顧問・技術與風險', en: 'Board Advisor · Technology & Risk' },
    story: {
      zh: 'AI 智能與語意專家，麻省理工學院學士、碩士、博士。曾任香港感知與互動智能中心（CPII）暨微軟亞洲研究院技術戰略合夥人總監，為 enGo 把關技術路線與風險治理。',
      en: 'An AI and semantics expert with B.S., M.S., and Ph.D. degrees from MIT. Formerly Director of Technology Strategy Partnerships at the Centre for Perceptual and Interactive Intelligence (CPII) in Hong Kong and Microsoft Research Asia, he stewards enGo\'s technology roadmap and risk governance.'
    },
    creds: {
      zh: [
        '技術與風險總監',
        '感知與互動智能中心（CPII）有限公司・HK 微軟亞洲研究院 技術戰略合夥人總監',
        'AI 智能與語意專家',
        '麻省理工（MIT）學士、碩士、博士',
        '史丹佛大學 innovation'
      ],
      en: [
        'Director, Technology & Risk',
        'Director of Technology Strategy Partnerships, CPII (HK) · Microsoft Research Asia',
        'AI intelligence & semantics expert',
        'B.S., M.S. & Ph.D., MIT',
        'Stanford University innovation programs'
      ]
    }
  }
]

export default defineComponent({
  name: 'Team',
  setup() {
    const { locale } = useI18n()

    useScrollReveal('.fade-in', 'visible')

    const isZh = computed(() => locale.value.startsWith('zh'))
    const pick = <T,>(field: Bi<T>): T => (isZh.value ? field.zh : field.en)

    return { members: MEMBERS, isZh, pick }
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

.tm-page {
  background: $warm-bg-light;
  padding: 110px 5vw 100px;

  @media (max-width: 768px) {
    padding-top: 96px;
  }
}

// ─── masthead ───
.tm-mast {
  max-width: 1100px;
  margin: 0 auto 64px;
  border-top: 3px solid $grey-blue3;
  padding-top: 22px;
}

.tm-kicker {
  font-size: 1.02rem;
  font-weight: 800;
  letter-spacing: 0.28em;
  color: $brand-orange;
  margin-bottom: 8px;
}

.tm-title {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: clamp(2.4rem, 7vw, 4.6rem);
  line-height: 1.1;
  color: $grey-blue3;
  margin-bottom: 14px;
}

.tm-sub {
  font-size: clamp(1.16rem, 2vw, 1.42rem);
  font-weight: 500;
  line-height: 1.95;
  color: $grey-blue2;
  max-width: 34em;
}

// ─── profile spreads ───
.tm-profile {
  max-width: 1100px;
  margin: 0 auto;
  padding: 56px 0;
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(28px, 5vw, 72px);
  align-items: start;
  border-top: 1px solid rgba($grey-blue3, 0.22);

  &--flip {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);

    .tm-plate {
      order: 2;
    }

    .tm-bio {
      order: 1;
    }
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 40px 0;

    &--flip .tm-plate {
      order: 0;
    }

    &--flip .tm-bio {
      order: 1;
    }
  }
}

// mounted plate, matching the site's editorial system
.tm-plate {
  position: relative;
  margin: 0;
  max-width: 400px;

  img {
    display: block;
    position: relative;
    z-index: 1;
    width: 100%;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    border: 1px solid rgba($grey-blue3, 0.5);
    box-shadow: 0 18px 38px -22px rgba(21, 41, 57, 0.55);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 14px -14px -14px 14px;
    border: 2px solid $brand-orange;
    z-index: 0;
  }

  figcaption {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-top: 12px;
  }

  .tm-plate-num {
    font-family: 'Noto Serif TC', serif;
    font-weight: 900;
    font-size: 1.6rem;
    color: transparent;
    -webkit-text-stroke: 1.5px $brand-orange;
  }

  .tm-advisor-tag {
    background: $grey-blue3;
    color: $warm-bg-light;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    padding: 4px 12px;
  }

  @media (max-width: 900px) {
    max-width: 320px;
  }
}

.tm-role {
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: $brand-orange;
  margin-bottom: 8px;
}

.tm-name {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: clamp(1.9rem, 4.5vw, 3rem);
  line-height: 1.2;
  color: $grey-blue3;
  margin-bottom: 16px;

  .tm-name-en {
    font-size: 0.5em;
    font-weight: 700;
    color: rgba($grey-blue3, 0.55);
    margin-left: 10px;
    letter-spacing: 0.04em;
  }
}

.tm-story {
  font-size: 1.05rem;
  line-height: 2;
  color: $grey-blue2;
  margin-bottom: 22px;
  max-width: 38em;
}

.tm-creds {
  list-style: none;
  padding: 0;
  border-top: 1px solid rgba($grey-blue3, 0.22);

  li {
    padding: 9px 0 9px 18px;
    border-bottom: 1px solid rgba($grey-blue3, 0.14);
    font-size: 0.93rem;
    line-height: 1.7;
    color: #4c4c4c;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 1.05em;
      width: 8px;
      height: 2px;
      background: $brand-orange;
    }
  }
}
</style>
