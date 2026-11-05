<template>
  <!-- The real enGo wordmark (paths from src/assets/logo.svg), not typed text.
       The "o" is drawn as an eye in the logo, so it is the one thing that moves:
       the letters rise in once, then the pupil follows the pointer and blinks. -->
  <router-link to="/" class="fm" :aria-label="label" ref="root">
    <svg viewBox="0 0 148 57" aria-hidden="true" focusable="false">
      <path class="fm-letter" d="M9.6671 36.7549L22.855 32.3638C20.5644 28.7302 17.7794 27.4599 14.5026 28.5515C12.6224 29.1759 11.245 30.2096 10.3728 31.6463C9.49676 33.0831 9.26238 34.7886 9.6671 36.7549ZM35.1579 35.3101L11.7669 42.9507C12.6013 44.9392 13.8981 46.4986 15.6008 47.3505C17.301 48.2023 18.9903 48.3515 20.6668 47.793C23.6651 46.7951 25.5586 44.7031 26.3489 41.5201L36.3054 41.3993C34.9312 48.108 30.7386 52.6291 23.7272 54.9652C18.567 56.6824 13.9378 56.545 9.84064 54.5516C5.73968 52.5595 2.80164 49.0202 1.02652 43.932C-0.569936 39.3585 -0.30482 34.9834 1.82571 30.8062C3.95495 26.6315 7.36815 23.7604 12.0698 22.1948C16.797 20.6211 21.311 20.9398 25.6137 23.1526C29.9164 25.3623 32.9223 28.9145 34.6308 33.8061L35.1579 35.3101Z" />
      <path class="fm-letter" d="M45.3956 21.3533V25.3992C49.2859 22.146 53.3696 20.52 57.6454 20.52C61.2981 20.52 64.3206 21.855 66.7092 24.5271C69.0998 27.1984 70.2966 30.6095 70.2966 34.7608V55.465H58.7154V36.3862C58.7154 34.4298 58.1122 32.7773 56.9096 31.4293C55.7076 30.0794 54.2443 29.4051 52.5224 29.4051C50.4444 29.4051 48.7365 30.2582 47.4 31.9637C46.0642 33.6698 45.3956 35.8709 45.3956 38.5688V55.465H33.9912V21.3533H45.3956Z" />
      <g class="fm-letter">
        <path d="M103.765 3.99353C100.232 2.10248 98.018 1.21798 95.4142 0.525166L93.1569 1.14441e-05C91.4119 13.2103 79.8314 22.6742 69.5104 17.7129C69.5104 18.1339 69.5104 18.9759 69.554 19.5164C69.3266 20.6999 69.1563 21.9129 69.0423 23.1592C68.929 24.4074 68.8713 25.687 68.8713 26.9993C68.8713 30.7389 69.3728 34.2695 70.373 37.5936C70.7086 38.7013 71.096 39.7855 71.543 40.8463C75.7413 51.5139 85.9815 56.5085 95.1113 55.317C96.3838 55.0963 97.5518 54.7604 98.6174 54.3129C100.749 53.4161 102.747 51.9257 104.615 49.8405C105.003 49.4059 105.371 48.9566 105.727 48.498V55.6548H112.757V26.7681H111.849H105.727H95.2381V34.084L105.844 34.0636L105.777 34.2251C104.323 42.1444 100.929 45.916 95.5193 47.7664C95.0243 47.9346 93.4842 48.0801 92.0036 47.9753C87.2706 47.2819 84.6118 44.3109 82.6868 40.5492C82.0765 39.3534 81.6776 37.8137 81.2447 36.433C80.3789 33.6698 80.254 31.2887 80.254 28.0157C80.254 24.9911 80.7727 22.2945 81.5194 19.6958C86.7308 16.768 88.8574 14.2717 91.9588 8.92087C92.4512 8.20341 93.5597 8.40065 94.608 8.39202C102.82 10.357 104.729 18.9518 104.729 18.9518H114.531C113.676 13.0346 109.711 9.87441 107.146 6.90716" />
        <path d="M114.476 55.6551H105.929V26.7685H114.476V55.6551Z" />
      </g>
      <g class="fm-letter fm-eye">
        <path class="fm-iris" d="M148 38.7781C148 48.4269 140.439 56.25 131.113 56.25C121.786 56.25 114.225 48.4269 114.225 38.7781C114.225 29.128 121.786 21.3049 131.113 21.3049C140.439 21.3049 148 29.128 148 38.7781Z" />
        <path class="fm-pupil" d="M138.798 39.2325C138.798 44.9882 135.677 49.6536 131.825 49.6536C127.975 49.6536 124.853 44.9882 124.853 39.2325C124.853 33.4786 127.975 28.8114 131.825 28.8114C135.677 28.8114 138.798 33.4786 138.798 39.2325Z" />
      </g>
    </svg>
  </router-link>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
defineProps<{ label: string }>()

const root = ref<{ $el: HTMLElement } | null>(null)
let ctx: gsap.Context | null = null
const cleanups: Array<() => void> = []

// How far the pupil may travel inside the iris, in viewBox units.
const REACH_X = 3.6
const REACH_Y = 4.2

onMounted(() => {
  const el = root.value?.$el
  if (!el) return
  // Reduced motion: the static mark, full stop. Pointer-following is motion too.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

  ctx = gsap.context(() => {
    const q = gsap.utils.selector(el)
    const eye = el.querySelector<SVGGElement>('.fm-eye')!
    const pupil = el.querySelector<SVGPathElement>('.fm-pupil')!
    let visible = false

    const blink = () =>
      gsap.timeline()
        .to(pupil, { scaleY: 0.08, transformOrigin: '50% 50%', duration: 0.09, ease: 'power2.in' })
        .to(pupil, { scaleY: 1, duration: 0.16, ease: 'power2.out' })

    // Idle blinks at a human, irregular rhythm, only while the mark is on screen.
    let blinkTimer: gsap.core.Tween | null = null
    const scheduleBlink = () => {
      blinkTimer = gsap.delayedCall(gsap.utils.random(3.2, 6.5), () => {
        if (visible) blink()
        scheduleBlink()
      })
    }

    // IntersectionObserver rather than ScrollTrigger: this mark sits at the end of
    // long pages whose height changes as images load, and a stale trigger position
    // would leave the logo invisible. IO reads live geometry.
    gsap.set(q('.fm-letter'), { y: 36, opacity: 0 })
    const intro = () =>
      gsap.timeline()
        .to(q('.fm-letter'), { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out' })
        .from(eye, { scale: 0.6, transformOrigin: '50% 50%', duration: 0.7, ease: 'back.out(2.2)' }, '<0.24')
        .add(blink(), '+=0.15')
        .add(scheduleBlink)

    let played = false
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !played) {
        played = true
        intro()
      }
    }, { threshold: 0.25 })
    io.observe(el)
    cleanups.push(() => io.disconnect())

    const toX = gsap.quickTo(pupil, 'x', { duration: 0.45, ease: 'power3.out' })
    const toY = gsap.quickTo(pupil, 'y', { duration: 0.45, ease: 'power3.out' })

    if (finePointer) {
      // The pupil looks toward the pointer. Distance only sets how far it leans:
      // a pointer across the page reaches full travel, one on the mark barely moves it.
      const onMove = (e: PointerEvent) => {
        if (!visible) return
        const r = eye.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        const d = Math.hypot(dx, dy) || 1
        const lean = Math.min(d / 320, 1)
        toX((dx / d) * REACH_X * lean)
        toY((dy / d) * REACH_Y * lean)
      }
      window.addEventListener('pointermove', onMove, { passive: true })
      cleanups.push(() => window.removeEventListener('pointermove', onMove))
    } else {
      // Touch screens have no pointer to follow: glance around slowly instead.
      const glance = () => {
        if (visible) {
          toX(gsap.utils.random(-REACH_X, REACH_X))
          toY(gsap.utils.random(-REACH_Y, REACH_Y * 0.6))
        }
        glanceTimer = gsap.delayedCall(gsap.utils.random(1.6, 3.2), glance)
      }
      let glanceTimer = gsap.delayedCall(2, glance)
      cleanups.push(() => glanceTimer.kill())
    }
    cleanups.push(() => blinkTimer?.kill())
  }, el)
})

onUnmounted(() => {
  cleanups.splice(0).forEach((fn) => fn())
  ctx?.revert()
  ctx = null
})
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

.fm {
  display: inline-block;
  margin: 0; // a global rule gives <a> side margins
  line-height: 0;
  color: $ink;

  svg {
    display: block;
    width: clamp(168px, 21vw, 264px);
    height: auto;
    overflow: visible;
  }

  &:focus-visible {
    outline: 2px solid $brand-orange-text;
    outline-offset: 6px;
    border-radius: 4px;
  }
}

.fm-letter {
  fill: currentColor;
}

// The orange "o" is the brand's own variant (src/assets/logo-orange.svg).
.fm-iris {
  fill: $brand-orange;
}

.fm-pupil {
  fill: #fff;
}
</style>
