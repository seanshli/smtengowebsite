<template>
  <section class="bms" ref="root" aria-label="enGo building management system">
    <header class="bms-head">
      <p class="bms-kicker">
        BMS・{{ isZh ? '大樓管理系統' : 'BUILDING MANAGEMENT SYSTEM' }}
      </p>
      <h3 class="bms-title">
        {{ isZh ? '一棟大樓，一個大腦。' : 'One Brain. Every Building.' }}
      </h3>
      <p class="bms-sub">
        {{ isZh
          ? '預先佈線＋整案管理——每一戶都是一個 enGo 大腦，透過企業儀表板同時照看整棟。'
          : 'Pre-wired and fleet-managed — every unit is an enGo brain, and one enterprise dashboard watches the whole tower.' }}
      </p>
    </header>

    <svg class="bms-scene" viewBox="0 0 1000 640" fill="none" role="img"
      :aria-label="isZh ? 'enGo 大樓管理系統示意' : 'enGo building management diagram'">
      <!-- ground -->
      <line class="bms-ground" x1="80" y1="580" x2="920" y2="580" />

      <!-- building shell -->
      <path ref="shell" class="bms-shell" d="M 150 580 V 100 L 320 60 L 490 100 V 580" />

      <!-- floor slabs -->
      <line v-for="(y, i) in floors" :key="'f'+i" ref="slabs" class="bms-slab"
        :x1="160" :y1="y + 55" :x2="480" :y2="y + 55" />

      <!-- units: every apartment is a small enGo hub -->
      <g v-for="(u, i) in units" :key="'u'+i" ref="unitEls" class="bms-unit"
        :transform="`translate(${u.x}, ${u.y})`">
        <rect class="bms-unit-halo" x="-26" y="-26" width="52" height="52" rx="4" transform="rotate(45)" />
        <rect class="bms-unit-core" x="-15" y="-15" width="30" height="30" rx="3" transform="rotate(45)" />
      </g>

      <!-- riser: floors feed the collector spine -->
      <path ref="riser" class="bms-riser" d="M 490 520 H 540 V 175 H 490 M 540 285 H 490 M 540 395 H 490" />
      <!-- trunk to the dashboard -->
      <path ref="trunk" class="bms-trunk" d="M 540 330 C 600 330, 610 320, 660 320" />

      <!-- pulse dots travelling the trunk -->
      <circle v-for="i in 2" :key="'d'+i" ref="dots" class="bms-dot" r="5" />

      <!-- enterprise dashboard -->
      <g ref="dash" class="bms-dash" transform="translate(660, 210)">
        <rect class="bms-dash-card" x="0" y="0" width="270" height="230" rx="6" />
        <line class="bms-dash-rule" x1="18" y1="46" x2="252" y2="46" />
        <text class="bms-dash-title" x="18" y="32">{{ isZh ? '企業儀表板' : 'Enterprise Dashboard' }}</text>
        <!-- animated bars -->
        <g transform="translate(30, 190)">
          <rect v-for="(b, i) in bars" :key="'b'+i" ref="barEls" class="bms-bar"
            :x="i * 42" :y="-b" width="24" :height="b" />
        </g>
        <!-- status dots -->
        <g transform="translate(200, 70)">
          <circle v-for="i in 3" :key="'s'+i" ref="statusEls" class="bms-status" :cx="(i-1) * 20" cy="0" r="5" />
        </g>
        <!-- sparkline -->
        <path ref="spark" class="bms-spark" d="M 18 90 L 50 78 L 82 84 L 114 64 L 146 70 L 178 52" />
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

// Four floors, three units per floor — a cross-section, not a floor plan.
const FLOOR_YS = [120, 230, 340, 450]
const UNIT_XS = [220, 320, 420]

export default defineComponent({
  name: 'BuildingBmsScene',
  setup() {
    const { locale } = useI18n()
    const isZh = computed(() => locale.value.startsWith('zh'))

    const root = ref<HTMLElement | null>(null)
    const shell = ref<SVGPathElement | null>(null)
    const slabs = ref<SVGLineElement[]>([])
    const unitEls = ref<SVGGElement[]>([])
    const riser = ref<SVGPathElement | null>(null)
    const trunk = ref<SVGPathElement | null>(null)
    const dots = ref<SVGCircleElement[]>([])
    const dash = ref<SVGGElement | null>(null)
    const barEls = ref<SVGRectElement[]>([])
    const statusEls = ref<SVGCircleElement[]>([])
    const spark = ref<SVGPathElement | null>(null)

    const floors = FLOOR_YS
    const units = FLOOR_YS.flatMap((y) => UNIT_XS.map((x) => ({ x, y })))
    const bars = [70, 110, 88, 130, 96]

    let ctx: gsap.Context | null = null

    onMounted(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      ctx = gsap.context(() => {
        const drawables = [shell.value!, riser.value!, trunk.value!, spark.value!]

        if (reduced) {
          gsap.set([...unitEls.value, dash.value], { opacity: 1 })
          gsap.set(dots.value, { opacity: 0 })
          return
        }

        // prepare line drawing
        drawables.forEach((p) => {
          const len = p.getTotalLength()
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
        })
        gsap.set(slabs.value, { scaleX: 0, transformOrigin: 'left center' })
        gsap.set(unitEls.value, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' })
        gsap.set(dash.value, { opacity: 0, y: 16 })
        gsap.set(barEls.value, { scaleY: 0, transformOrigin: '50% 100%' })
        gsap.set(dots.value, { opacity: 0 })

        // ── Act: the building assembles as you scroll ──
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.value,
            start: 'top 75%',
            end: 'center 42%',
            scrub: 0.6
          }
        })
        tl.to(shell.value, { strokeDashoffset: 0, ease: 'none', duration: 0.9 })
          .to(slabs.value, { scaleX: 1, ease: 'power1.out', stagger: 0.08, duration: 0.3 }, '<0.3')
          // floor-by-floor: units arrive bottom-up, elastic — the "wow" beat
          .to(unitEls.value, {
            opacity: 1,
            scale: 1,
            ease: 'back.out(2.2)',
            stagger: { each: 0.05, from: 'end' },
            duration: 0.4
          }, '<0.2')
          .to(riser.value, { strokeDashoffset: 0, ease: 'none', duration: 0.4 }, '>-0.1')
          .to(trunk.value, { strokeDashoffset: 0, ease: 'none', duration: 0.25 })
          .to(dash.value, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.35 })
          .to(barEls.value, { scaleY: 1, ease: 'back.out(1.4)', stagger: 0.06, duration: 0.35 }, '<0.1')
          .to(spark.value, { strokeDashoffset: 0, ease: 'none', duration: 0.35 }, '<')

        // ── Life: quiet and continuous, paused off-screen ──
        const life = gsap.timeline({ repeat: -1, paused: true })
        // unit halos breathe in a wave across the tower
        life.to(unitEls.value.map(g => g.querySelector('.bms-unit-halo')), {
          opacity: 0.55,
          duration: 1.1,
          ease: 'sine.inOut',
          stagger: { each: 0.12, yoyo: true, repeat: 1 }
        }, 0)
        // pulse dots ride the trunk into the dashboard
        dots.value.forEach((dot, i) => {
          life.to(dot, {
            motionPath: { path: trunk.value!, align: trunk.value!, alignOrigin: [0.5, 0.5] },
            opacity: 1,
            duration: 1.6,
            ease: 'power1.inOut'
          }, i * 1.4).to(dot, { opacity: 0, duration: 0.25 }, '>-0.25')
        })
        // dashboard bars breathe; status dots blink in sequence
        life.to(barEls.value, {
          scaleY: 0.88,
          duration: 1.4,
          yoyo: true,
          repeat: 1,
          ease: 'sine.inOut',
          stagger: 0.1
        }, 0)
        life.to(statusEls.value, {
          opacity: 0.25,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          stagger: 0.5,
          ease: 'sine.inOut'
        }, 0.4)

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

    return { isZh, root, shell, slabs, unitEls, riser, trunk, dots, dash, barEls, statusEls, spark, floors, units, bars }
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
  max-width: 40em;
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

.bms-riser,
.bms-trunk {
  stroke: $brand-orange;
  stroke-width: 2.5;
  stroke-linecap: round;
}

.bms-dot {
  fill: $orange2;
}

.bms-dash-card {
  fill: $warm-bg-light;
  stroke: rgba($grey-blue3, 0.45);
  stroke-width: 1.5;
}

.bms-dash-rule {
  stroke: rgba($grey-blue3, 0.35);
  stroke-width: 2;
}

.bms-dash-title {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: 19px;
  fill: $grey-blue3;
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
  stroke: $brand-blue;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

// mobile legibility — shapes dominate here; thicken lines, grow the title.
@media (max-width: 768px) {
  .bms-shell { stroke-width: 4; }
  .bms-riser, .bms-trunk { stroke-width: 3.5; }
  .bms-dash-title { font-size: 26px; }
}
</style>
