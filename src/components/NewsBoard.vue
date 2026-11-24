<template>
  <!-- The lobby notice board: one notice pinned open, the rest listed beside it. -->
  <section id="news" class="nb" aria-labelledby="nb-title">
    <div class="nb-inner">
      <h2 id="nb-title" class="nb-title">{{ $t('newsTitle') }}</h2>

      <div class="nb-board">
        <div ref="leadBox" class="nb-leadbox">
        <article :key="cur.id" class="nb-lead" aria-live="polite">
          <figure v-if="cur.image" class="nb-photo">
            <img :src="cur.image" :alt="lt(cur.title)" width="1200" height="800" loading="lazy" decoding="async" />
            <figcaption>{{ lt(sample) }}</figcaption>
          </figure>
          <div class="nb-text">
            <h3 class="nb-h">{{ lt(cur.title) }}</h3>
            <p class="nb-meta">
              <time :datetime="cur.date">{{ fmt(cur.date) }}</time>
              <span v-if="areaOf(cur)" class="nb-area"><span class="nb-swatch" :class="'tone-' + areaOf(cur).tone" aria-hidden="true"></span>{{ lt(areaOf(cur).area) }}</span>
            </p>
            <!-- News summaries are our own authored copy (src/data/news.json), with inline links. -->
            <p class="nb-sum" v-html="lt(cur.summary)"></p>
          </div>
        </article>
        </div>

        <ol class="nb-list">
          <li v-for="it in items" :key="it.id">
            <button type="button" class="nb-row" :aria-pressed="it.id === curId" @click="pick(it.id)">
              <time class="nb-row-date" :datetime="it.date">{{ fmt(it.date) }}</time>
              <span class="nb-row-title">{{ lt(it.title) }}</span>
              <span v-if="areaOf(it)" class="nb-swatch" :class="'tone-' + areaOf(it).tone" aria-hidden="true"></span>
            </button>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import news from '@/data/news.json'
import solutions from '@/data/solutions.json'
import { useLocaleText } from '@/composables/useLocaleText'
import { useAnalytics } from '@/utils/analytics'

const { lt } = useLocaleText()
const { trackEvent } = useAnalytics()
const items = [...(news as any[])].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
const sample = (solutions as any).hero.sample
const byId = Object.fromEntries((solutions as any).solutions.map((s: any) => [s.id, s]))
const areaOf = (it: any) => byId[it.area]
const curId = ref<number>(items[0]?.id)
const cur = computed(() => items.find((x) => x.id === curId.value) || items[0])
const fmt = (d: string) => d.replace(/-/g, '.')
const leadBox = ref<HTMLElement | null>(null)
const pick = (id: number) => {
  curId.value = id
  trackEvent('news_open', { id })
  // Phones stack the list under the pinned notice: bring the notice that just opened into view.
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches) {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    leadBox.value?.scrollIntoView({ block: 'start', behavior: still ? 'auto' : 'smooth' })
  }
}
</script>

<style scoped lang="scss">
// Building world: terrazzo band, paper notices, ink type, window light only as a marker.
$ink: #1e2a25;
$muted: #4a5650;
$paper: #fbf8f2;
$terrazzo: #e6e0d5;
$light: #f26b21;
$action: #c94f12;

.nb { background: $terrazzo; color: $ink; padding: clamp(64px, 9vw, 120px) clamp(20px, 6vw, 96px); }
.nb-inner { max-width: 1248px; margin: 0 auto; }
.nb-title { margin: 0 0 clamp(28px, 4vw, 48px); color: inherit; font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 700; line-height: 1.25; }
.nb-board { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: clamp(24px, 4vw, 56px); align-items: start; }

.nb-leadbox { scroll-margin-top: 84px; }
.nb-lead { background: $paper; border-radius: 16px; overflow: hidden; box-shadow: 0 18px 40px -22px rgba(30, 42, 37, .45); }
.nb-photo { position: relative; margin: 0;
  img { display: block; width: 100%; height: auto; aspect-ratio: 3 / 2; object-fit: cover; }
  figcaption { position: absolute; right: 12px; bottom: 10px; padding: 2px 8px; border-radius: 999px; background: rgba(0, 0, 0, .55); font-size: .75rem; color: #fff; }
}
.nb-text { padding: clamp(20px, 3vw, 32px); }
.nb-h { margin: 0; color: inherit; letter-spacing: 0; font-size: clamp(1.3rem, 2vw, 1.75rem); font-weight: 700; line-height: 1.35; text-wrap: balance; }
.nb-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 16px; margin: 12px 0 0; font-size: .9rem; font-weight: 600; color: $muted; font-variant-numeric: tabular-nums; }
.nb-area { display: inline-flex; align-items: center; gap: 8px; }
.nb-sum { margin: 16px 0 0; max-width: 62ch; font-size: 1rem; line-height: 1.8; color: $ink;
  :deep(a) { color: #b3460f; font-weight: 700; text-decoration: underline; text-underline-offset: 4px; }
  :deep(a:focus-visible) { outline: 2px solid $action; outline-offset: 2px; border-radius: 2px; }
}

.nb-list { list-style: none; margin: 0; padding: 0; }
.nb-list li + li { margin-top: 2px; }
.nb-row {
  font: inherit; width: 100%; display: grid; grid-template-columns: 5.6em minmax(0, 1fr) 14px; gap: 14px; align-items: baseline;
  min-height: 44px; padding: 14px 16px; border: 0; border-radius: 12px; background: none; color: $ink; text-align: left; cursor: pointer;
  border-top: 1px solid rgba($ink, .14);
  transition: background-color .25s;
  &:hover { background: rgba($paper, .55); }
  &[aria-pressed='true'] { background: $paper; border-top-color: transparent; .nb-row-title { font-weight: 700; } }
  &:focus-visible { outline: 2px solid $action; outline-offset: 2px; }
}
.nb-list li + li .nb-row[aria-pressed='true'], .nb-list li:has(+ li .nb-row[aria-pressed='true']) .nb-row { border-top-color: transparent; }
.nb-row-date { font-size: .85rem; font-weight: 600; color: $muted; font-variant-numeric: tabular-nums; }
.nb-row-title { font-size: 1rem; line-height: 1.55; font-weight: 500; }
.nb-swatch { flex: none; display: inline-block; width: 14px; height: 14px; border-radius: 3px; align-self: center; }
.tone-mint { background: #7fb7a4; } .tone-butter { background: #f2d37a; } .tone-salmon { background: #e7a596; } .tone-terrazzo { background: #cfc7b8; } .tone-iron { background: #2f4a3e; }

@media (prefers-reduced-motion: no-preference) {
  .nb-lead { animation: nb-in .45s cubic-bezier(.22, 1, .36, 1) both; }
}
@media (prefers-reduced-motion: reduce) { .nb-row { transition: none; } }
@keyframes nb-in { from { opacity: 0; transform: translateY(6px); } }

@media (max-width: 900px) {
  .nb-board { grid-template-columns: 1fr; }
}
</style>
