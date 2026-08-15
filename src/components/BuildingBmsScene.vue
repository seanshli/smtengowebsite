<template>
  <section class="bms" ref="root" aria-label="enGo HMS and BMS integration">
    <header class="bms-head">
      <p class="bms-kicker">
        HMS × BMS・{{ isZh ? '家與大樓，即時互通' : 'HOME & BUILDING, IN CONVERSATION' }}
      </p>
      <h3 class="bms-title">
        {{ isZh ? '一棟大樓，一個大腦。' : 'One Brain. Every Building.' }}
      </h3>
      <p class="bms-sub">
        {{ isZh
          ? '每一戶的 HMS——公布欄、物業管理、家居系統、通訊警報、AIoT——與大樓的智能櫃、監控、智能信箱、能源管理即時互通，一個企業儀表板照看整棟。'
          : 'Every unit\'s HMS — bulletin, property services, home systems, alerts, AIoT — talks live with the building\'s smart lockers, surveillance, smart mailboxes, and energy management, under one enterprise dashboard.' }}
      </p>
    </header>

    <svg class="bms-scene" viewBox="0 0 1040 680" fill="none" role="img"
      :aria-label="isZh ? 'enGo HMS 與 BMS 互通示意' : 'enGo HMS and BMS integration diagram'">
      <!-- ground -->
      <line class="bms-ground" x1="60" y1="620" x2="980" y2="620" />

      <!-- building shell -->
      <path ref="shell" class="bms-shell" d="M 120 620 V 130 L 265 70 L 410 130 V 620" />

      <!-- floor slabs -->
      <line v-for="(y, i) in floors" :key="'f'+i" ref="slabs" class="bms-slab"
        :x1="130" :y1="y + 55" :x2="400" :y2="y + 55" />

      <!-- units: every apartment is a small enGo hub -->
      <g v-for="(u, i) in units" :key="'u'+i" ref="unitEls" class="bms-unit"
        :transform="`translate(${u.x}, ${u.y})`">
        <rect class="bms-unit-halo" x="-24" y="-24" width="48" height="48" rx="4" transform="rotate(45)" />
        <rect class="bms-unit-core" x="-13" y="-13" width="26" height="26" rx="3" transform="rotate(45)" />
      </g>

      <!-- highlighted unit -> HMS card leader -->
      <circle ref="focusRing" class="bms-focus" cx="350" cy="260" r="30" />
      <path ref="leader" class="bms-leader" d="M 378 250 C 420 220, 430 200, 466 185" />

      <!-- HMS card: what runs inside every unit -->
      <g ref="hmsCard" class="bms-card-g" transform="translate(470, 78)">
        <rect class="bms-card" x="0" y="0" width="252" height="252" rx="6" />
        <text class="bms-card-title" x="18" y="34">HMS・{{ isZh ? '每一戶' : 'Every Unit' }}</text>
        <line class="bms-card-rule" x1="18" y1="48" x2="234" y2="48" />
        <g v-for="(f, i) in hmsRows" :key="'h'+i" ref="hmsRowEls" :transform="`translate(18, ${76 + i * 36})`">
          <rect class="bms-row-tick bms-row-tick--hms" x="0" y="-9" width="10" height="10" />
          <text class="bms-row-text" x="22" y="0">{{ isZh ? f.zh : f.en }}</text>
        </g>
      </g>

      <!-- BMS facilities card: what the building itself runs -->
      <g ref="bmsCard" class="bms-card-g" transform="translate(470, 398)">
        <rect class="bms-card" x="0" y="0" width="252" height="204" rx="6" />
        <text class="bms-card-title" x="18" y="34">BMS・{{ isZh ? '整棟公設' : 'The Building' }}</text>
        <line class="bms-card-rule" x1="18" y1="48" x2="234" y2="48" />
        <g v-for="(f, i) in bmsRows" :key="'b'+i" ref="bmsRowEls" :transform="`translate(18, ${76 + i * 34})`">
          <rect class="bms-row-tick bms-row-tick--bms" x="0" y="-9" width="10" height="10" />
          <text class="bms-row-text" x="22" y="0">{{ isZh ? f.zh : f.en }}</text>
        </g>
      </g>

      <!-- building base feeds the facilities -->
      <path ref="baseLink" class="bms-wire" d="M 410 500 C 435 500, 440 500, 466 500" />

      <!-- both cards converge on the dashboard; HMS wire is bidirectional -->
      <path ref="hmsWire" class="bms-wire" d="M 722 204 C 762 204, 768 260, 800 300" />
      <path ref="bmsWire" class="bms-wire" d="M 722 500 C 762 500, 768 440, 800 400" />
      <circle ref="dotDown" class="bms-dot bms-dot--hms" r="5" />
      <circle ref="dotUp" class="bms-dot bms-dot--hms" r="5" />
      <circle ref="dotBms" class="bms-dot bms-dot--bms" r="5" />

      <!-- enterprise dashboard -->
      <g ref="dash" class="bms-card-g" transform="translate(800, 230)">
        <rect class="bms-card bms-card--dash" x="0" y="0" width="216" height="240" rx="6" />
        <text class="bms-card-title bms-card-title--dash" x="18" y="34">{{ isZh ? '企業儀表板' : 'Dashboard' }}</text>
        <line class="bms-card-rule bms-card-rule--dash" x1="18" y1="48" x2="198" y2="48" />
        <g transform="translate(28, 196)">
          <rect v-for="(b, i) in bars" :key="'bar'+i" ref="barEls" class="bms-bar"
            :x="i * 34" :y="-b" width="20" :height="b" />
        </g>
        <g transform="translate(150, 70)">
          <circle v-for="i in 3" :key="'s'+i" ref="statusEls" class="bms-status" :cx="(i-1) * 18" cy="0" r="5" />
        </g>
        <path ref="spark" class="bms-spark" d="M 18 96 L 48 84 L 78 90 L 108 70 L 138 76 L 170 58" />
      </g>
    </svg>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

// Building cross-section: four floors, three units each.
const FLOOR_YS = [150, 260, 370, 480]
const UNIT_XS = [180, 265, 350]

// The real enGo feature sets.
const HMS_ROWS = [
  { zh: '公布欄', en: 'Bulletin board' },
  { zh: '物業管理', en: 'Property services' },
  { zh: '家居系統管理', en: 'Home system control' },
  { zh: '通訊警報', en: 'Comms & alerts' },
  { zh: 'AIoT 智慧連動', en: 'AIoT automation' }
]
const BMS_ROWS = [
  { zh: '智能櫃', en: 'Smart lockers' },
  { zh: '監控系統', en: 'Surveillance' },
  { zh: '智能信箱', en: 'Smart mailboxes' },
  { zh: '能源管理', en: 'Energy management' }
]

export default defineComponent({
  name: 'BuildingBmsScene',
  setup() {
    const { locale } = useI18n()
    const isZh = computed(() => locale.value.startsWith('zh'))

    const root = ref<HTMLElement | null>(null)
    const shell = ref<SVGPathElement | null>(null)
    const slabs = ref<SVGLineElement[]>([])
    const unitEls = ref<SVGGElement[]>([])
    const focusRing = ref<SVGCircleElement | null>(null)
    const leader = ref<SVGPathElement | null>(null)
    const hmsCard = ref<SVGGElement | null>(null)
    const hmsRowEls = ref<SVGGElement[]>([])
    const bmsCard = ref<SVGGElement | null>(null)
    const bmsRowEls = ref<SVGGElement[]>([])
    const baseLink = ref<SVGPathElement | null>(null)
    const hmsWire = ref<SVGPathElement | null>(null)
    const bmsWire = ref<SVGPathElement | null>(null)
    const dotDown = ref<SVGCircleElement | null>(null)
    const dotUp = ref<SVGCircleElement | null>(null)
    const dotBms = ref<SVGCircleElement | null>(null)
    const dash = ref<SVGGElement | null>(null)
    const barEls = ref<SVGRectElement[]>([])
    const statusEls = ref<SVGCircleElement[]>([])
    const spark = ref<SVGPathElement | null>(null)

    const floors = FLOOR_YS
    const units = FLOOR_YS.flatMap((y) => UNIT_XS.map((x) => ({ x, y })))
    const bars = [60, 96, 76, 112, 84]

    let ctx: gsap.Context | null = null

    onMounted(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      ctx = gsap.context(() => {
        const cards = [hmsCard.value!, bmsCard.value!, dash.value!]
        const rows = [...hmsRowEls.value, ...bmsRowEls.value]
        const wires = [leader.value!, baseLink.value!, hmsWire.value!, bmsWire.value!]
        const dots = [dotDown.value!, dotUp.value!, dotBms.value!]

        if (reduced) {
          gsap.set([...unitEls.value, ...cards, ...rows, focusRing.value], { opacity: 1 })
          gsap.set(dots, { opacity: 0 })
          return
        }

        ;[shell.value!, ...wires, spark.value!].forEach((p) => {
          const len = p.getTotalLength()
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
        })
        gsap.set(slabs.value, { scaleX: 0, transformOrigin: 'left center' })
        gsap.set(unitEls.value, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' })
        gsap.set(focusRing.value, { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' })
        gsap.set(cards, { opacity: 0, y: 16 })
        gsap.set(rows, { opacity: 0, x: -10 })
        gsap.set(barEls.value, { scaleY: 0, transformOrigin: '50% 100%' })
        gsap.set(dots, { opacity: 0 })

        // ── The story assembles on scroll ──
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.value,
            start: 'top 75%',
            end: 'center 40%',
            scrub: 0.6
          }
        })
        tl.to(shell.value, { strokeDashoffset: 0, ease: 'none', duration: 0.7 })
          .to(slabs.value, { scaleX: 1, ease: 'power1.out', stagger: 0.06, duration: 0.25 }, '<0.25')
          .to(unitEls.value, {
            opacity: 1, scale: 1,
            ease: 'back.out(2.2)',
            stagger: { each: 0.04, from: 'end' },
            duration: 0.35
          }, '<0.15')
          // one unit steps forward and unfolds its HMS
          .to(focusRing.value, { opacity: 1, scale: 1, ease: 'back.out(2)', duration: 0.2 })
          .to(leader.value, { strokeDashoffset: 0, ease: 'none', duration: 0.15 })
          .to(hmsCard.value, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.25 })
          .to(hmsRowEls.value, { opacity: 1, x: 0, ease: 'power2.out', stagger: 0.05, duration: 0.2 }, '<0.05')
          // the building unfolds its BMS facilities
          .to(baseLink.value, { strokeDashoffset: 0, ease: 'none', duration: 0.12 })
          .to(bmsCard.value, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.25 }, '<')
          .to(bmsRowEls.value, { opacity: 1, x: 0, ease: 'power2.out', stagger: 0.05, duration: 0.2 }, '<0.05')
          // both meet in the dashboard
          .to([hmsWire.value, bmsWire.value], { strokeDashoffset: 0, ease: 'none', duration: 0.2 })
          .to(dash.value, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.25 })
          .to(barEls.value, { scaleY: 1, ease: 'back.out(1.4)', stagger: 0.05, duration: 0.25 }, '<0.05')
          .to(spark.value, { strokeDashoffset: 0, ease: 'none', duration: 0.25 }, '<')

        // ── Continuous life, paused off-screen ──
        const life = gsap.timeline({ repeat: -1, paused: true })
        life.to(unitEls.value.map(g => g.querySelector('.bms-unit-halo')), {
          opacity: 0.55, duration: 1.1, ease: 'sine.inOut',
          stagger: { each: 0.1, yoyo: true, repeat: 1 }
        }, 0)
        // HMS <-> dashboard is a conversation: one dot each way
        life.to(dotDown.value, {
          motionPath: { path: hmsWire.value!, align: hmsWire.value!, alignOrigin: [0.5, 0.5] },
          opacity: 1, duration: 1.5, ease: 'power1.inOut'
        }, 0).to(dotDown.value, { opacity: 0, duration: 0.2 }, '>-0.2')
        life.to(dotUp.value, {
          motionPath: { path: hmsWire.value!, align: hmsWire.value!, alignOrigin: [0.5, 0.5], start: 1, end: 0 },
          opacity: 1, duration: 1.5, ease: 'power1.inOut'
        }, 1.1).to(dotUp.value, { opacity: 0, duration: 0.2 }, '>-0.2')
        // facilities report in
        life.to(dotBms.value, {
          motionPath: { path: bmsWire.value!, align: bmsWire.value!, alignOrigin: [0.5, 0.5] },
          opacity: 1, duration: 1.5, ease: 'power1.inOut'
        }, 0.6).to(dotBms.value, { opacity: 0, duration: 0.2 }, '>-0.2')
        life.to(barEls.value, {
          scaleY: 0.86, duration: 1.4, yoyo: true, repeat: 1,
          ease: 'sine.inOut', stagger: 0.1
        }, 0)
        life.to(statusEls.value, {
          opacity: 0.25, duration: 0.5, yoyo: true, repeat: 1,
          stagger: 0.5, ease: 'sine.inOut'
        }, 0.4)
        life.to(focusRing.value, {
          scale: 1.18, opacity: 0.4, duration: 1.2, yoyo: true, repeat: 1,
          ease: 'sine.inOut', transformOrigin: '50% 50%'
        }, 0)

        ScrollTrigger.create({
          trigger: root.value,
          start: 'top 80%',
          onEnter: () => life.play(),
          onLeave: () => life.pause(),
          onEnterBack: () => life.play(),
          onLeaveBack: () => life.pause()
        })
      }, root.value as Element)
    })

    onUnmounted(() => ctx?.revert())

    return {
      isZh, root, shell, slabs, unitEls, focusRing, leader,
      hmsCard, hmsRowEls, bmsCard, bmsRowEls, baseLink, hmsWire, bmsWire,
      dotDown, dotUp, dotBms, dash, barEls, statusEls, spark,
      floors, units, bars, hmsRows: HMS_ROWS, bmsRows: BMS_ROWS
    }
  }
})
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

.bms {
  background: $warm-bg-cream;
  padding: 40px 24px 110px;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 24px 12px 64px;
  }
}

.bms-head {
  max-width: 1100px;
  margin: 0 auto 8px;
  border-top: 1px solid rgba($grey-blue3, 0.25);
  padding-top: 22px;
}

.bms-kicker {
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.28em;
  color: $brand-orange;
}

.bms-title {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: clamp(2rem, 5.5vw, 4rem);
  line-height: 1.1;
  color: $grey-blue3;
  margin: 10px 0 6px;
}

.bms-sub {
  font-size: clamp(1rem, 2vw, 1.3rem);
  font-weight: 500;
  line-height: 1.9;
  color: $grey-blue2;
  max-width: 44em;
}

.bms-scene {
  display: block;
  width: min(1100px, 100%);
  margin: 0 auto;
  height: auto;
}

.bms-ground {
  stroke: rgba($grey-blue3, 0.4);
  stroke-width: 2;
}

.bms-shell {
  stroke: $grey-blue3;
  stroke-width: 3;
  stroke-linejoin: round;
}

.bms-slab {
  stroke: rgba($grey-blue3, 0.3);
  stroke-width: 1.5;
}

.bms-unit-halo {
  fill: rgba($brand-orange, 0.16);
  opacity: 0.2;
}

.bms-unit-core {
  fill: $grey-blue3;
}

.bms-focus {
  stroke: $brand-orange;
  stroke-width: 2;
  fill: none;
}

.bms-leader,
.bms-wire {
  stroke: $brand-orange;
  stroke-width: 2.5;
  stroke-linecap: round;
}

.bms-dot--hms {
  fill: $orange2;
}

.bms-dot--bms {
  fill: $gold;
}

.bms-card {
  fill: $warm-bg-light;
  stroke: rgba($grey-blue3, 0.45);
  stroke-width: 1.5;

  &--dash {
    fill: $grey-blue3;
    stroke: $grey-blue3;
  }
}

.bms-card-title {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: 19px;
  fill: $grey-blue3;

  &--dash {
    fill: $warm-bg-light;
  }
}

.bms-card-rule {
  stroke: rgba($grey-blue3, 0.35);
  stroke-width: 2;

  &--dash {
    stroke: rgba(254, 251, 246, 0.4);
  }
}

.bms-row-tick {
  &--hms {
    fill: $brand-orange;
  }

  &--bms {
    fill: $gold;
  }
}

.bms-row-text {
  font-size: 16px;
  font-weight: 500;
  fill: $grey-blue2;
}

.bms-bar {
  fill: $brand-orange;

  &:nth-of-type(2n) {
    fill: $gold;
  }
}

.bms-status {
  fill: $green;
}

.bms-spark {
  stroke: $light-blue;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

// mobile: thicken strokes, grow card text (SVG text scales with viewBox,
// so bump user units — CSS wins over the attribute values)
@media (max-width: 768px) {
  .bms-shell { stroke-width: 4; }
  .bms-leader, .bms-wire { stroke-width: 3.5; }
  .bms-card-title { font-size: 26px; }
  .bms-row-text { font-size: 22px; }
}
</style>
