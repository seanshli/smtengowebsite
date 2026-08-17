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
          ? '每一戶的 HMS——公布欄、物業管理、家居系統、通訊警報、AIoT——與大樓的智能櫃、監控、智能信箱、能源管理，透過樓中央的 enGo 中樞即時雙向連動。'
          : 'Every unit\'s HMS — bulletin, property services, home systems, alerts, AIoT — links live and both ways with the building\'s smart lockers, surveillance, smart mailboxes, and energy management, through the enGo hub at the building\'s core.' }}
      </p>
    </header>

    <svg class="bms-scene" viewBox="0 0 800 700" fill="none" role="img"
      :aria-label="isZh ? 'enGo HMS 與 BMS 雙向連動示意' : 'enGo HMS and BMS two-way integration diagram'">
      <!-- ground -->
      <line class="bms-ground" x1="60" y1="640" x2="760" y2="640" />

      <!-- the building: a lived-in cutaway (Gemini pro render). Units glow,
           families cook, the lobby runs lockers/mail/energy. -->
      <g ref="buildingG">
        <image href="/images/home/bms-building.jpg" x="80" y="45" width="400" height="580"
          preserveAspectRatio="xMidYMid slice" />
        <rect x="80" y="45" width="400" height="580" fill="none" stroke="rgba(21,41,57,0.4)" stroke-width="2" />
      </g>

      <!-- 連動 wires: the hub talks to both cards, and both talk back -->
      <path ref="hmsWire" class="bms-wire" d="M 344 296 C 404 248, 448 204, 500 188" />
      <path ref="bmsWire" class="bms-wire" d="M 344 374 C 404 428, 448 492, 500 522" />
      <circle ref="dotHmsOut" class="bms-dot bms-dot--hms" r="5.5" />
      <circle ref="dotHmsBack" class="bms-dot bms-dot--hms" r="5.5" />
      <circle ref="dotBmsOut" class="bms-dot bms-dot--bms" r="5.5" />
      <circle ref="dotBmsBack" class="bms-dot bms-dot--bms" r="5.5" />

      <!-- THE hub: the enGo brain, sitting dead centre of the building it runs.
           Same glowing-glass language as the /enviro hero, clipped to a disc so
           it reads as one object against the cutaway. -->
      <defs>
        <clipPath id="bmsHubClip">
          <circle cx="280" cy="335" r="82" />
        </clipPath>
      </defs>
      <g ref="hubG" class="bms-hub">
        <circle ref="hubHalo" class="bms-hub-halo" cx="280" cy="335" r="104" />
        <image href="/images/home/engo-hub-3d.jpg" x="192" y="239" width="176" height="176"
          clip-path="url(#bmsHubClip)" preserveAspectRatio="xMidYMid slice" />
        <circle class="bms-hub-rim" cx="280" cy="335" r="82" />
        <text class="bms-hub-label" x="280" y="392">enGo</text>
      </g>

      <!-- HMS card: what runs inside every unit -->
      <g ref="hmsCard" class="bms-card-g" transform="translate(500, 44)">
        <rect class="bms-card" x="0" y="0" width="252" height="322" rx="6" />
        <image href="/images/cases/case-home.jpg" x="12" y="12" width="228" height="76" preserveAspectRatio="xMidYMid slice" />
        <rect x="12" y="12" width="228" height="76" fill="none" stroke="rgba(21,41,57,0.35)" stroke-width="1.5" />
        <text class="bms-card-title" x="36" y="116">HMS・{{ isZh ? '每一戶' : 'Every Unit' }}</text>
        <line class="bms-card-rule" x1="36" y1="130" x2="216" y2="130" />
        <!-- x=36 matches the title inset, and every glyph is boxed 0..16, so the
             icon column and the title start on exactly the same edge -->
        <g v-for="(f, i) in hmsRows" :key="'h'+i" ref="hmsRowEls" :transform="`translate(36, ${158 + i * 34})`">
          <g class="bms-row-icon bms-row-icon--hms" v-html="f.icon"></g>
          <text class="bms-row-text" x="34" y="0">{{ isZh ? f.zh : f.en }}</text>
        </g>
      </g>

      <!-- BMS facilities card: what the building itself runs -->
      <g ref="bmsCard" class="bms-card-g" transform="translate(500, 400)">
        <rect class="bms-card" x="0" y="0" width="252" height="272" rx="6" />
        <image href="/images/home/bms-lobby.jpg" x="12" y="12" width="228" height="76" preserveAspectRatio="xMidYMid slice" />
        <rect x="12" y="12" width="228" height="76" fill="none" stroke="rgba(21,41,57,0.35)" stroke-width="1.5" />
        <text class="bms-card-title" x="36" y="116">BMS・{{ isZh ? '整棟公設' : 'The Building' }}</text>
        <line class="bms-card-rule" x1="36" y1="130" x2="216" y2="130" />
        <g v-for="(f, i) in bmsRows" :key="'b'+i" ref="bmsRowEls" :transform="`translate(36, ${156 + i * 30})`">
          <g class="bms-row-icon bms-row-icon--bms" v-html="f.icon"></g>
          <text class="bms-row-text" x="34" y="0">{{ isZh ? f.zh : f.en }}</text>
        </g>
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

// 18px line glyphs, every one boxed inside x 0..16 so the icon column aligns.
// (The chip's antenna leads used to reach x=-1, which pulled that single row
// visibly left of the rest.)
const I = {
  bulletin: '<g fill="none" stroke="currentColor" stroke-width="2"><rect x="0" y="-14" width="16" height="14" rx="1.5"/><line x1="3.5" y1="-10" x2="12.5" y2="-10"/><line x1="3.5" y1="-6.5" x2="12.5" y2="-6.5"/></g>',
  property: '<g fill="none" stroke="currentColor" stroke-width="2"><path d="M 0 0 V -11 L 8 -15 L 16 -11 V 0"/><line x1="5" y1="0" x2="5" y2="-5"/><line x1="11" y1="0" x2="11" y2="-5"/></g>',
  sliders: '<g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="0" y1="-11" x2="16" y2="-11"/><line x1="0" y1="-4" x2="16" y2="-4"/><circle cx="5" cy="-11" r="2.6" fill="currentColor" stroke="none"/><circle cx="11" cy="-4" r="2.6" fill="currentColor" stroke="none"/></g>',
  bell: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M 2 -3 C 2 -3, 3 -4.5, 3 -8 A 5 5 0 0 1 13 -8 C 13 -4.5, 14 -3, 14 -3 Z"/><path d="M 6.5 -1 A 1.8 1.8 0 0 0 9.5 -1"/></g>',
  chip: '<g fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="-13" width="12" height="12" rx="2"/><rect x="7" y="-9" width="4" height="4" fill="currentColor" stroke="none"/><line x1="3" y1="-7" x2="0" y2="-7"/><line x1="15" y1="-7" x2="16" y2="-7"/><line x1="9" y1="-13" x2="9" y2="-16"/><line x1="9" y1="-1" x2="9" y2="1"/></g>',
  locker: '<g fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="-14" width="14" height="14" rx="1.5"/><line x1="8" y1="-14" x2="8" y2="0"/><circle cx="5" cy="-7" r="1.2" fill="currentColor" stroke="none"/><circle cx="11.5" cy="-7" r="1.2" fill="currentColor" stroke="none"/></g>',
  camera: '<g fill="none" stroke="currentColor" stroke-width="2"><path d="M 1 -12 H 15 V -8 A 7 5.5 0 0 1 1 -8 Z"/><circle cx="8" cy="-7" r="2.2"/></g>',
  mailbox: '<g fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="-12" width="14" height="10" rx="1.5"/><path d="M 1 -11 L 8 -6 L 15 -11"/></g>',
  // every glyph is optically centred on x=8, which is what aligns the column
  bolt: '<path d="M 9 -15 L 2 -5 H 7 L 6 2 L 14 -8 H 8.5 Z" fill="currentColor"/>'
}

const HMS_ROWS = [
  { zh: '公布欄', en: 'Bulletin board', icon: I.bulletin },
  { zh: '物業管理', en: 'Property services', icon: I.property },
  { zh: '家居系統管理', en: 'Home system control', icon: I.sliders },
  { zh: '通訊警報', en: 'Comms & alerts', icon: I.bell },
  { zh: 'AIoT 智慧連動', en: 'AIoT automation', icon: I.chip }
]
const BMS_ROWS = [
  { zh: '智能櫃', en: 'Smart lockers', icon: I.locker },
  { zh: '監控系統', en: 'Surveillance', icon: I.camera },
  { zh: '智能信箱', en: 'Smart mailboxes', icon: I.mailbox },
  { zh: '能源管理', en: 'Energy management', icon: I.bolt }
]

export default defineComponent({
  name: 'BuildingBmsScene',
  setup() {
    const { locale } = useI18n()
    const isZh = computed(() => locale.value.startsWith('zh'))

    const root = ref<HTMLElement | null>(null)
    const buildingG = ref<SVGGElement | null>(null)
    const hubG = ref<SVGGElement | null>(null)
    const hubHalo = ref<SVGCircleElement | null>(null)
    const hmsCard = ref<SVGGElement | null>(null)
    const hmsRowEls = ref<SVGGElement[]>([])
    const bmsCard = ref<SVGGElement | null>(null)
    const bmsRowEls = ref<SVGGElement[]>([])
    const hmsWire = ref<SVGPathElement | null>(null)
    const bmsWire = ref<SVGPathElement | null>(null)
    const dotHmsOut = ref<SVGCircleElement | null>(null)
    const dotHmsBack = ref<SVGCircleElement | null>(null)
    const dotBmsOut = ref<SVGCircleElement | null>(null)
    const dotBmsBack = ref<SVGCircleElement | null>(null)

    let ctx: gsap.Context | null = null

    onMounted(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      ctx = gsap.context(() => {
        const cards = [hmsCard.value!, bmsCard.value!]
        const rows = [...hmsRowEls.value, ...bmsRowEls.value]
        const wires = [hmsWire.value!, bmsWire.value!]
        const dots = [dotHmsOut.value!, dotHmsBack.value!, dotBmsOut.value!, dotBmsBack.value!]

        if (reduced) {
          gsap.set([buildingG.value, hubG.value, ...cards, ...rows], { opacity: 1 })
          gsap.set(dots, { opacity: 0 })
          return
        }

        wires.forEach((p) => {
          const len = p.getTotalLength()
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
        })
        gsap.set(buildingG.value, { opacity: 0, y: 24 })
        // scale/opacity only — tweening x/y on a <g> overwrites its
        // transform="translate(...)" and would fling the hub off-centre
        gsap.set(hubG.value, { opacity: 0, scale: 0.55, transformOrigin: '50% 50%' })
        gsap.set(cards, { opacity: 0, scale: 0.94, transformOrigin: '50% 50%' })
        gsap.set(rows, { opacity: 0, x: -10 })
        gsap.set(dots, { opacity: 0 })

        // ── The story assembles on scroll: the building, then its brain, then
        //    the two halves that brain keeps in conversation ──
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.value,
            start: 'top 75%',
            end: 'center 40%',
            scrub: 0.6
          }
        })
        tl.to(buildingG.value, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.6 })
          .to(hubG.value, { opacity: 1, scale: 1, ease: 'back.out(1.8)', duration: 0.35 })
          .to(hmsWire.value, { strokeDashoffset: 0, ease: 'none', duration: 0.2 })
          .to(hmsCard.value, { opacity: 1, scale: 1, ease: 'power2.out', duration: 0.25 }, '<0.1')
          .to(hmsRowEls.value, { opacity: 1, x: 0, ease: 'power2.out', stagger: 0.05, duration: 0.2 }, '<0.05')
          .to(bmsWire.value, { strokeDashoffset: 0, ease: 'none', duration: 0.2 })
          .to(bmsCard.value, { opacity: 1, scale: 1, ease: 'power2.out', duration: 0.25 }, '<0.1')
          .to(bmsRowEls.value, { opacity: 1, x: 0, ease: 'power2.out', stagger: 0.05, duration: 0.2 }, '<0.05')

        // ── Continuous life. 連動 is the whole point, so every wire carries
        //    traffic in both directions ──
        const life = gsap.timeline({ repeat: -1, paused: true })
        const travel = (
          dot: SVGCircleElement,
          wire: SVGPathElement,
          at: number,
          reverse = false
        ) => {
          life
            .to(dot, {
              motionPath: {
                path: wire, align: wire, alignOrigin: [0.5, 0.5],
                ...(reverse ? { start: 1, end: 0 } : {})
              },
              opacity: 1, duration: 1.5, ease: 'power1.inOut'
            }, at)
            .to(dot, { opacity: 0, duration: 0.2 }, '>-0.2')
        }
        travel(dotHmsOut.value!, hmsWire.value!, 0)
        travel(dotHmsBack.value!, hmsWire.value!, 1.1, true)
        travel(dotBmsOut.value!, bmsWire.value!, 0.55)
        travel(dotBmsBack.value!, bmsWire.value!, 1.65, true)

        // the brain breathes
        life.to(hubHalo.value, {
          scale: 1.14, opacity: 0.3, duration: 1.4, yoyo: true, repeat: 1,
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
      isZh, root, buildingG, hubG, hubHalo,
      hmsCard, hmsRowEls, bmsCard, bmsRowEls, hmsWire, bmsWire,
      dotHmsOut, dotHmsBack, dotBmsOut, dotBmsBack,
      hmsRows: HMS_ROWS, bmsRows: BMS_ROWS
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

// ── the enGo brain, centred in the building ──
.bms-hub-halo {
  fill: rgba($brand-orange, 0.2);
}

.bms-hub-rim {
  fill: none;
  stroke: $brand-orange;
  stroke-width: 3;
}

.bms-hub-label {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: 30px;
  fill: $warm-bg-light;
  text-anchor: middle;
  letter-spacing: 0.03em;
}

.bms-card {
  fill: $warm-bg-light;
  stroke: rgba($grey-blue3, 0.45);
  stroke-width: 1.5;
}

.bms-card-title {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: 19px;
  fill: $grey-blue3;
}

.bms-card-rule {
  stroke: rgba($grey-blue3, 0.35);
  stroke-width: 2;
}

.bms-row-icon {
  &--hms {
    color: $brand-orange;
  }

  &--bms {
    color: darken($gold, 12%);
  }
}

.bms-row-text {
  font-size: 16px;
  font-weight: 500;
  fill: $grey-blue2;
}

// mobile: thicken strokes, grow card text (SVG text scales with viewBox,
// so bump user units — CSS wins over the attribute values)
@media (max-width: 768px) {
  .bms-wire { stroke-width: 3.5; }
  .bms-card-title { font-size: 26px; }
  .bms-row-text { font-size: 22px; }
  .bms-hub-label { font-size: 34px; }
}
</style>
