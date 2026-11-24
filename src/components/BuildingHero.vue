<template>
  <section class="bh" aria-labelledby="bh-title">
    <div class="bh-stage">
      <picture class="bh-photo">
        <source type="image/webp" srcset="/images/building/hero-building-dusk-900.webp 900w, /images/building/hero-building-dusk-1600.webp 1600w" sizes="100vw" />
        <img src="/images/building/hero-building-dusk-1600.webp" :alt="lt(hero.sample)" width="1600" height="900" fetchpriority="high" />
      </picture>
      <div class="bh-shade" aria-hidden="true"></div>

      <div class="bh-copy">
        <h1 id="bh-title" class="bh-title">{{ lt(hero.title) }}</h1>
        <p class="bh-lede">{{ lt(hero.lede) }}</p>
        <p class="bh-hint">{{ lt(hero.hint) }}</p>
      </div>

      <!-- Lit windows: each one is a door into that floor's solution. -->
      <router-link
        v-for="(s, i) in floors" :key="s.id"
        :to="`/solutions/${s.id}`"
        class="bh-spot"
        :style="{ left: s.hotspot.x + '%', top: s.hotspot.y + '%', '--i': i }"
        :data-track="'home:window:' + s.id"
      >
        <span class="bh-dot" aria-hidden="true"></span>
        <span class="bh-label">
          <span class="bh-role">{{ lt(s.role) }}<span v-if="s.status" class="bh-status">{{ lt(statusLabel[s.status]) }}</span></span>
          <span class="bh-line">{{ lt(s.line) }}</span>
          <span class="bh-prod">{{ s.product }} <span aria-hidden="true">→</span></span>
        </span>
      </router-link>

      <!-- The front desk (管理室) by the lobby door is where the conversation starts. -->
      <form class="bh-counter" @submit.prevent="ask">
        <p class="bh-counter-title">{{ lt(hero.counterTitle) }}</p>
        <div class="bh-areas" role="radiogroup" :aria-label="lt(hero.counterTitle)">
          <button
            v-for="s in solutions" :key="s.id" type="button" role="radio"
            class="bh-area" :class="{ 'is-on': area === s.id }" :aria-checked="area === s.id"
            @click="area = s.id"
          >{{ lt(s.area) }}</button>
        </div>
        <button type="submit" class="bh-ask">{{ lt(hero.counterAction) }}</button>
      </form>

      <span class="bh-sample">{{ lt(hero.sample) }}</span>
    </div>

    <!-- Narrow screens: the floors as a list under the desk (labels would cover the photo). -->
    <p class="bh-list-hint">{{ lt(hero.hint) }}</p>
    <ol class="bh-list">
      <li v-for="s in floors" :key="s.id">
        <router-link :to="`/solutions/${s.id}`" class="bh-list-row" :data-track="'home:floor:' + s.id">
          <span class="bh-list-dot" aria-hidden="true"></span>
          <span class="bh-list-text">
            <strong>{{ lt(s.role) }}<span v-if="s.status" class="bh-status bh-status-ink">{{ lt(statusLabel[s.status]) }}</span></strong>
            <span>{{ lt(s.line) }}</span>
          </span>
          <span class="bh-list-go" aria-hidden="true">→</span>
        </router-link>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import data from '@/data/solutions.json'
import { useLocaleText } from '@/composables/useLocaleText'
import { useAnalytics } from '@/utils/analytics'

const { lt } = useLocaleText()
const router = useRouter()
const { trackEvent } = useAnalytics()

const hero = data.hero
const statusLabel = data.statusLabel as Record<string, any>
const solutions = data.solutions as any[]
const floors = computed(() => solutions.filter((s) => s.hotspot))
const area = ref<string>('home')

const ask = () => {
  trackEvent('cta_click', { location: 'home:counter', area: area.value })
  router.push({ path: '/contact', query: { area: area.value } })
}
</script>

<style scoped lang="scss">
// Building world (facelift 2026-11). Colours come from the photograph: dusk sky ink,
// window light, mosaic tile and terrazzo.
$sky: #0b121c;
$light: #f26b21;
$glow: #ffd2a6;
$paper: #fbf8f2;
$ink: #1e2a25;

.bh { position: relative; background: $sky; color: #fff; }
.bh-stage {
  position: relative;
  // Exactly the photo's ratio, so the window hotspots (percentages) stay on their windows.
  aspect-ratio: 16 / 9;
  margin: 0 auto;
  overflow: hidden;
  isolation: isolate;
}
.bh-photo img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; object-position: 60% 50%;
  transform-origin: 60% 40%;
}
.bh-shade {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(90deg, rgba($sky, .82) 0%, rgba($sky, .55) 28%, rgba($sky, 0) 52%);
}
.bh-copy {
  position: absolute; left: clamp(20px, 5vw, 80px); top: 50%; transform: translateY(-58%);
  width: min(34vw, 520px);
}
.bh-title {
  margin: 0; color: inherit; font-weight: 700; white-space: pre-line;
  font-size: clamp(2rem, 4vw, 3.75rem); line-height: 1.14; letter-spacing: -.02em;
  text-wrap: balance;
}
.bh-lede { margin: 1.4rem 0 0; font-size: clamp(1rem, 1.25vw, 1.15rem); line-height: 1.75; color: rgba(#fff, .86); max-width: 30em; }
.bh-hint { margin: 1.1rem 0 0; font-weight: 600; font-size: .95rem; color: $glow; }

// ── lit windows
.bh-spot {
  position: absolute; z-index: 2; display: flex; align-items: flex-start; gap: 12px;
  transform: translate(-11px, -11px); color: #fff; text-decoration: none;
}
.bh-dot {
  flex: none; width: 22px; height: 22px; border-radius: 50%;
  background: $light; border: 3px solid #fff;
  box-shadow: 0 0 0 6px rgba($light, .28), 0 6px 18px rgba(0, 0, 0, .35);
  transition: transform .3s cubic-bezier(.22, 1, .36, 1), box-shadow .3s;
}
.bh-label {
  display: grid; gap: 2px; box-sizing: border-box; width: min(240px, 16vw); padding: 10px 14px 11px; border-radius: 12px;
  background: rgba(8, 13, 18, .74); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, .3);
  transition: background-color .3s, transform .3s cubic-bezier(.22, 1, .36, 1);
}
.bh-role { font-weight: 700; font-size: .88rem; color: $glow; display: flex; flex-wrap: wrap; align-items: center; gap: 2px 8px; }
.bh-status { white-space: nowrap; font-weight: 500; font-size: .72rem; padding: 0 7px; border: 1px solid currentColor; border-radius: 999px; line-height: 1.6; }
.bh-line { font-size: .95rem; line-height: 1.5; font-weight: 500; }
.bh-prod { font-size: .8rem; font-weight: 700; color: rgba(#fff, .82); }
.bh-spot:hover, .bh-spot:focus-visible {
  outline: none;
  .bh-dot { transform: scale(1.15); box-shadow: 0 0 0 10px rgba($light, .32), 0 6px 18px rgba(0, 0, 0, .35); }
  .bh-label { background: rgba(8, 13, 18, .9); transform: translateY(-2px); }
}
.bh-spot:focus-visible .bh-label { box-shadow: 0 0 0 2px $glow, 0 12px 30px rgba(0, 0, 0, .3); }

// ── front desk
.bh-counter {
  position: absolute; z-index: 3; left: 68%; bottom: clamp(16px, 4%, 40px); width: min(380px, 30vw);
  padding: 16px 18px; border-radius: 14px; background: $paper; color: $ink;
  box-shadow: 0 18px 44px rgba(0, 0, 0, .38);
}
.bh-counter-title { margin: 0 0 10px; font-weight: 700; font-size: 1rem; }
.bh-areas { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.bh-area {
  font: inherit; font-size: .8rem; font-weight: 500; color: $ink; cursor: pointer;
  padding: 4px 10px; border-radius: 999px; border: 1px solid rgba($ink, .5); background: none;
  &.is-on { background: $ink; color: $paper; border-color: $ink; }
  &:focus-visible { outline: 2px solid #c94f12; outline-offset: 2px; }
}
.bh-ask {
  font: inherit; font-weight: 700; font-size: .95rem; color: #fff; cursor: pointer;
  padding: 10px 22px; border: 0; border-radius: 999px; background: #c94f12;
  &:hover { background: #b3460f; }
  &:focus-visible { outline: 2px solid $ink; outline-offset: 3px; }
}
.bh-sample { position: absolute; right: 12px; bottom: 10px; padding: 2px 8px; border-radius: 999px; background: rgba(0, 0, 0, .55); font-size: .75rem; color: #fff; }

.bh-list, .bh-list-hint { display: none; }

// ── one authored moment: the windows light up, then the street settles as you scroll
@media (prefers-reduced-motion: no-preference) {
  .bh-dot { animation: bh-light .9s cubic-bezier(.22, 1, .36, 1) both; animation-delay: calc(.35s + var(--i) * .22s); }
  .bh-label { animation: bh-rise .8s cubic-bezier(.22, 1, .36, 1) both; animation-delay: calc(.5s + var(--i) * .22s); }
  @supports (animation-timeline: view()) {
    .bh-photo img { animation: bh-depth linear both; animation-timeline: view(); animation-range: exit 0% exit 100%; }
    .bh-copy { animation: bh-lift linear both; animation-timeline: view(); animation-range: exit 0% exit 100%; }
  }
}
@media (prefers-reduced-motion: reduce) {
  .bh-dot, .bh-label { transition: none; }
}
@keyframes bh-light { from { opacity: 0; transform: scale(.4); box-shadow: 0 0 0 0 rgba($light, 0); } }
@keyframes bh-rise { from { opacity: 0; transform: translateY(8px); } }
@keyframes bh-depth { to { transform: translateY(12%) scale(1.06); } }
@keyframes bh-lift { to { transform: translateY(-90%); opacity: .2; } }

@media (max-width: 1100px) {
  .bh-line { font-size: .85rem; }
}
@media (max-width: 1279px) {
  // Short stage: the desk moves to the quiet street under the words, clear of the window labels.
  .bh-copy { top: clamp(20px, 5%, 44px); transform: none; }
  .bh-counter { left: clamp(20px, 5vw, 80px); width: min(360px, 34vw); }
}
@media (max-width: 900px) {
  // Phones: photo, the words, the front desk (first screen), then the floors as a list.
  .bh { display: flex; flex-direction: column; }
  .bh-stage { display: contents; }
  .bh-photo { order: 1; }
  .bh-photo img { position: static; display: block; aspect-ratio: 4 / 3; height: auto; object-position: 58% 60%; animation: none !important; }
  .bh-shade, .bh-spot { display: none; }
  .bh-copy { order: 2; position: static; transform: none; width: auto; padding: 20px 20px 0; animation: none !important; }
  .bh-copy .bh-hint { display: none; }
  .bh-list-hint { order: 4; display: block; margin: 8px 20px 0; font-weight: 600; font-size: .95rem; color: $glow; }
  // Right gutter keeps the arrows clear of the floating chat button.
  .bh-list { order: 5; display: block; list-style: none; margin: 0; padding: 0 76px 28px 20px; }
  .bh-list li + li { border-top: 1px solid rgba(#fff, .14); }
  .bh-list-row { display: flex; align-items: center; gap: 14px; padding: 14px 0; min-height: 44px; color: #fff; text-decoration: none; }
  .bh-list-dot { flex: none; width: 14px; height: 14px; border-radius: 50%; background: $light; box-shadow: 0 0 0 5px rgba($light, .25); }
  .bh-list-text { display: grid; gap: 2px; flex: 1; font-size: .95rem; line-height: 1.5; strong { display: flex; gap: 8px; align-items: center; color: $glow; font-size: .9rem; } }
  .bh-list-go { color: rgba(#fff, .7); }
  .bh-counter { order: 3; position: static; width: auto; margin: 18px 20px 16px; }
  .bh-area { min-height: 40px; padding: 6px 14px; font-size: .875rem; }
  .bh-ask { min-height: 44px; }
  // Bottom-right of the 4:3 photo (75vw tall); the fixed header would cover the top.
  .bh-sample { top: calc(75vw - 34px); bottom: auto; }
}
</style>
