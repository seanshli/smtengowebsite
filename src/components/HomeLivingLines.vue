<template>
  <section class="living-lines" ref="root" aria-label="enGo smart home ecosystem">
    <header class="ll-head">
      <p class="ll-kicker">
        HMS・{{ locale.startsWith('zh') ? '居家管理系統' : 'HOME MANAGEMENT SYSTEM' }}
      </p>
      <h3 class="ll-title">{{ $t('whyEngoTagline1') }}</h3>
      <p class="ll-sub">{{ $t('whyEngoTagline2') }}</p>
    </header>

    <!-- The signature scene: device nodes connect themselves to the enGo hub
         as the visitor scrolls. Each subsystem carries the colour it already
         owns on /enviro, so the two pages read as one system. Pure viewBox
         SVG — no measurement, no resize handling needed. -->
    <svg
      class="ll-scene"
      viewBox="0 0 1000 660"
      fill="none"
      role="img"
      :aria-label="$t('whyEngoTagline2')"
    >
      <!-- connection paths, device -> hub -->
      <path
        v-for="(d, i) in devices"
        :key="'p' + i"
        ref="paths"
        class="ll-path"
        :d="d.path"
        :style="{ stroke: d.color }"
      />

      <!-- travelling pulse dots (hidden until lines are drawn) -->
      <circle
        v-for="(d, i) in devices"
        :key="'dot' + i"
        ref="dots"
        class="ll-dot"
        r="5"
        :style="{ fill: d.color }"
      />

      <!-- device nodes -->
      <g
        v-for="(d, i) in devices"
        :key="'n' + i"
        ref="nodes"
        class="ll-node"
        :transform="`translate(${d.x}, ${d.y})`"
      >
        <!-- inner group exists so mobile CSS can scale the node around its
             own centre without clobbering the outer translate() -->
        <g class="ll-node-inner">
          <circle class="ll-node-ring" r="34" :style="{ stroke: d.color }" />
          <circle class="ll-node-core" r="27" :style="{ stroke: d.color }" />

          <!-- line glyph, drawn in the device's own colour -->
          <g class="ll-glyph" :style="{ stroke: d.color }">
            <path v-for="(seg, j) in d.icon" :key="j" :d="seg" />
          </g>

          <!-- label sits below the circle: gives the glyph the whole disc and
               stops 清風除濕機 being squeezed onto two 13px lines -->
          <text class="ll-node-label" y="54">{{ label(d) }}</text>
        </g>
      </g>

      <!-- hub -->
      <g class="ll-hub" transform="translate(500, 310)">
        <g class="ll-hub-inner">
          <circle class="ll-hub-halo" r="86" ref="halo" />
          <circle class="ll-hub-core" r="60" />
          <text class="ll-hub-label" y="7">enGo</text>
        </g>
      </g>
    </svg>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

interface Device {
  x: number
  y: number
  path: string
  color: string
  /** Line-glyph segments, drawn centred on the node origin at roughly 24x24. */
  icon: string[]
  zh: string
  en: string
  ja: string
}

// Colours are the /enviro pillar colours, not decoration: sunlight orange,
// air green, water blue, kitchen red. Curtains take the gold accent (daylight
// modulation) and security the navy — security sits outside the four pillars,
// so it stays deliberately neutral rather than borrowing a meaning it lacks.
const SUN = '#FE8B05'
const AIR = '#34c98e'
const WATER = '#3bbeff'
const KITCHEN = '#ff5a5a'
const GOLD = '#C7B763'
// Security shares the kitchen red: both are the "something needs your
// attention" family, and red is what an alarm reads as.
const SECURITY = KITCHEN

// Seven devices ringed around the hub at (500, 310). Curves bow outward so
// the drawn lines read as organic wiring, not spokes.
const DEVICES: Device[] = [
  {
    x: 150, y: 105, path: 'M 150 105 C 290 130, 360 220, 448 278',
    color: SUN, zh: '燈光', en: 'Lighting', ja: '照明',
    icon: [
      'M 0 -11 A 7.5 7.5 0 0 1 4.2 2.2 L 4.2 5 L -4.2 5 L -4.2 2.2 A 7.5 7.5 0 0 1 0 -11 Z',
      'M -3.4 8.4 L 3.4 8.4'
    ]
  },
  {
    x: 500, y: 62, path: 'M 500 62 C 470 140, 520 190, 500 248',
    color: AIR, zh: '空調', en: 'Climate', ja: '空調',
    icon: [
      'M -10 -8 L 10 -8 L 10 0 L -10 0 Z',
      'M -5.5 4 Q -3 8 -0.5 4',
      'M 2 4 Q 4.5 8 7 4'
    ]
  },
  {
    x: 850, y: 105, path: 'M 850 105 C 710 130, 640 220, 552 278',
    color: GOLD, zh: '窗簾', en: 'Curtains', ja: 'カーテン',
    icon: [
      'M -11 -9 L 11 -9',
      'M -7 -9 C -8.5 -2, -8.5 4, -9.5 9',
      'M 7 -9 C 8.5 -2, 8.5 4, 9.5 9',
      'M 0 -9 L 0 9'
    ]
  },
  {
    x: 88, y: 310, path: 'M 88 310 C 210 252, 330 368, 436 310',
    color: AIR, zh: '清風除濕機', en: 'Fresh Air', ja: '新風除湿',
    icon: [
      'M -10 -5 L 1 -5 A 3.2 3.2 0 1 0 -2 -8.5',
      'M -10 1 L 4 1 A 3.2 3.2 0 1 1 1 4.5',
      'M -10 7 L 5 7'
    ]
  },
  {
    x: 150, y: 515, path: 'M 150 515 C 290 490, 360 400, 448 342',
    color: WATER, zh: '淨水', en: 'Water', ja: '浄水',
    icon: ['M 0 -10 C 5.5 -2.5, 8.5 1.5, 8.5 4 A 8.5 8.5 0 0 1 -8.5 4 C -8.5 1.5, -5.5 -2.5, 0 -10 Z']
  },
  {
    x: 500, y: 558, path: 'M 500 558 C 530 480, 480 430, 500 372',
    color: KITCHEN, zh: '廚房', en: 'Kitchen', ja: 'キッチン',
    icon: ['M 0 -10 C 4.5 -4, 7 -0.5, 7 3 A 7 7 0 0 1 -7 3 C -7 0.5, -5 -1.5, -3.5 -4 C -2.5 -1.5, -1 -0.5, 0 -0.5 C 0.5 -4, 0 -7, 0 -10 Z']
  },
  {
    x: 850, y: 515, path: 'M 850 515 C 710 490, 640 400, 552 342',
    color: SECURITY, zh: '安防', en: 'Security', ja: 'セキュリティ',
    icon: [
      'M 0 -10 L 8.5 -6.5 V 0 C 8.5 5.5, 4.5 8.5, 0 10 C -4.5 8.5, -8.5 5.5, -8.5 0 V -6.5 Z',
      'M -3.2 0.4 L -0.8 3 L 3.6 -2'
    ]
  }
]

export default defineComponent({
  name: 'HomeLivingLines',
  setup() {
    const { locale } = useI18n()
    const root = ref<HTMLElement | null>(null)
    const paths = ref<SVGPathElement[]>([])
    const nodes = ref<SVGGElement[]>([])
    const dots = ref<SVGCircleElement[]>([])
    const halo = ref<SVGCircleElement | null>(null)

    const label = (d: Device) => {
      const l = locale.value
      if (l.startsWith('zh')) return d.zh
      if (l === 'ja') return d.ja
      return d.en
    }

    let ctx: gsap.Context | null = null

    onMounted(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      ctx = gsap.context(() => {
        if (reduced) {
          // No motion: show the finished scene.
          gsap.set(paths.value, { strokeDasharray: 'none' })
          gsap.set([nodes.value, dots.value], { opacity: 1, scale: 1 })
          return
        }

        // Prepare line drawing.
        paths.value.forEach((p) => {
          const len = p.getTotalLength()
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
        })
        gsap.set(nodes.value, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' })
        gsap.set(dots.value, { opacity: 0 })

        // Scrubbed build-up: lines draw, nodes pop, as the section scrolls through.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.value,
            start: 'top 72%',
            end: 'center 45%',
            scrub: 0.6
          }
        })
        tl.to(paths.value, { strokeDashoffset: 0, ease: 'none', stagger: 0.08 })
          .to(nodes.value, { opacity: 1, scale: 1, ease: 'back.out(1.6)', stagger: 0.06 }, '<0.15')

        // After the scene exists: quiet, endless life. Each wire carries a pulse
        // in its own colour; halo breathes. Paused off-screen so it costs nothing.
        const life = gsap.timeline({ repeat: -1, paused: true })
        dots.value.forEach((dot, i) => {
          life
            .to(
              dot,
              {
                motionPath: { path: paths.value[i], align: paths.value[i], alignOrigin: [0.5, 0.5] },
                opacity: 1,
                duration: 2.4,
                ease: 'power1.inOut'
              },
              i * 0.4
            )
            .to(dot, { opacity: 0, duration: 0.3 }, '>-0.3')
        })
        gsap.to(halo.value, {
          scale: 1.12,
          opacity: 0.25,
          transformOrigin: '50% 50%',
          duration: 2.2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut'
        })

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

    onUnmounted(() => {
      ctx?.revert()
    })

    return { locale, root, paths, nodes, dots, halo, devices: DEVICES, label }
  }
})
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

.living-lines {
  background: $warm-bg-cream;
  padding: 110px 24px 90px;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 70px 12px 56px;
  }
}

.ll-head {
  max-width: 1100px;
  margin: 0 auto 8px;
  text-align: left;
  border-top: 3px solid $grey-blue3; // editorial masthead rule
  padding-top: 22px;
}

.ll-kicker {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: $brand-orange;
}

.ll-title {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: clamp(2.2rem, 6vw, 4.4rem);
  line-height: 1.08;
  color: $grey-blue3;
  margin: 10px 0 6px;
}

.ll-sub {
  font-size: clamp(1rem, 2.2vw, 1.3rem);
  color: $dark-grey;
}

.ll-scene {
  display: block;
  width: min(1100px, 100%);
  margin: 0 auto;
  height: auto;
}

// Stroke colour arrives inline per device; only geometry lives here.
.ll-path {
  stroke-width: 2;
  stroke-linecap: round;
  opacity: 0.8;
}

.ll-node-ring {
  fill: none;
  stroke-width: 1.5;
  opacity: 0.4;
}

.ll-node-core {
  fill: #fff;
  stroke-width: 2;
}

.ll-glyph {
  fill: none;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ll-node-label {
  font-family: 'Noto Serif TC', serif;
  font-size: 16px;
  font-weight: 700;
  fill: $grey-blue3;
  text-anchor: middle;
  letter-spacing: 0.04em;
}

.ll-hub-halo {
  fill: rgba($brand-orange, 0.12);
}

.ll-hub-core {
  fill: $grey-blue3;
}

.ll-hub-label {
  font-family: 'Noto Serif TC', serif;
  font-size: 24px;
  font-weight: 900;
  fill: $warm-bg-light;
  text-anchor: middle;
  letter-spacing: 0.04em;
}

// Mobile legibility: the whole viewBox scales down to ~0.375x on a phone,
// leaving 16px labels at ~6px. Scale node/hub interiors back up around
// their own centres; the wiring layout itself is untouched.
@media (max-width: 768px) {
  .ll-node-inner {
    transform: scale(1.7);
  }

  .ll-hub-inner {
    transform: scale(1.35);
  }

  .ll-path {
    stroke-width: 3.5;
  }

  .ll-dot {
    r: 9;
  }
}
</style>
