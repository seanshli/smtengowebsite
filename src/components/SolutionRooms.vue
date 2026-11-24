<template>
  <section class="sr" aria-labelledby="sr-title">
    <h2 id="sr-title" class="sr-title">{{ lt(hero.roomsTitle) }}</h2>
    <article v-for="(s, i) in rooms" :key="s.id" class="sr-room" :class="{ 'is-flip': i % 2 === 1 }">
      <figure class="sr-photo">
        <picture>
          <source type="image/webp" :srcset="`/images/building/${s.image}-900.webp 900w, /images/building/${s.image}-1600.webp 1600w`" sizes="(max-width: 900px) 100vw, 52vw" />
          <img :src="`/images/building/${s.image}-1600.webp`" :alt="lt(s.role) + ' · ' + lt(hero.sample)" width="1600" height="1067" loading="lazy" />
        </picture>
        <figcaption>{{ lt(hero.sample) }}</figcaption>
      </figure>
      <div class="sr-text">
        <h3 class="sr-h">{{ lt(s.title) }}</h3>
        <p class="sr-who"><span class="sr-swatch" :class="'tone-' + s.tone" aria-hidden="true"></span>{{ lt(s.role) }} · {{ s.product }}</p>
        <ul class="sr-points">
          <li v-for="(p, k) in s.points.slice(0, 3)" :key="k">
            <span>{{ lt(p) }}</span>
            <em v-if="p.status !== 'live'" class="sr-tag">{{ lt(statusLabel[p.status]) }}</em>
          </li>
        </ul>
        <router-link :to="`/solutions/${s.id}`" class="sr-go" :data-track="'home:room:' + s.id">{{ lt(more) }} <IconArrow /></router-link>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import data from '@/data/solutions.json'
import IconArrow from '@/components/IconArrow.vue'
import { useLocaleText } from '@/composables/useLocaleText'

const { lt } = useLocaleText()
const hero = data.hero
const statusLabel = data.statusLabel as Record<string, any>
const rooms = computed(() => (data.solutions as any[]).filter((s) => s.image))
const more = (data as any).roomsMore
</script>

<style scoped lang="scss">
$ink: #1e2a25;
$muted: #4a5650;
$paper: #fbf8f2;
$light: #f26b21;

.sr { background: $paper; color: $ink; padding: clamp(64px, 9vw, 120px) clamp(20px, 6vw, 96px); }
.sr-title { color: inherit; margin: 0 auto clamp(40px, 6vw, 72px); max-width: 1248px; font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 700; line-height: 1.25; text-wrap: balance; }
.sr-room {
  display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: clamp(28px, 5vw, 72px);
  align-items: center; max-width: 1248px; margin: 0 auto;
  & + & { margin-top: clamp(56px, 8vw, 112px); }
  &.is-flip { grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); .sr-photo { order: 2; } }
}
.sr-photo { position: relative; margin: 0; border-radius: 20px; overflow: hidden; box-shadow: 0 24px 48px -18px rgba(30, 42, 37, .45);
  img { display: block; width: 100%; height: auto; aspect-ratio: 3 / 2; object-fit: cover; }
  figcaption { position: absolute; right: 12px; bottom: 10px; padding: 2px 8px; border-radius: 999px; background: rgba(0, 0, 0, .55); font-size: .75rem; color: #fff; }
}
.sr-h { margin: 0; color: inherit; font-size: clamp(1.6rem, 2.6vw, 2.35rem); line-height: 1.25; font-weight: 700; white-space: pre-line; text-wrap: balance; }
.sr-who { display: flex; align-items: center; gap: 10px; margin: 14px 0 0; font-size: .95rem; font-weight: 600; color: $muted; }
.sr-swatch { width: 14px; height: 14px; border-radius: 3px; }
.tone-mint { background: #7fb7a4; } .tone-butter { background: #f2d37a; } .tone-salmon { background: #e7a596; } .tone-terrazzo { background: #cfc7b8; } .tone-iron { background: #2f4a3e; }
.sr-points { list-style: none; margin: 22px 0 26px; padding: 0; display: grid; gap: 12px;
  li { display: flex; gap: 12px; align-items: baseline; font-size: 1.05rem; line-height: 1.6; font-weight: 500; }
  li::before { content: ''; flex: none; width: 8px; height: 8px; border-radius: 50%; background: $light; transform: translateY(-2px); }
}
.sr-tag { font-style: normal; font-size: .75rem; font-weight: 700; white-space: nowrap; padding: 1px 8px; border-radius: 999px; border: 1px solid $muted; color: $muted; }
.sr-go { display: inline-flex; gap: 8px; align-items: center; min-height: 44px; padding: 0 20px; border-radius: 999px; border: 1.5px solid $ink; color: $ink; font-weight: 700; text-decoration: none;
  transition: background-color .25s, color .25s;
  &:hover { background: $ink; color: $paper; }
  &:focus-visible { outline: 2px solid #c94f12; outline-offset: 3px; }
}
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .sr-photo img { animation: sr-settle linear both; animation-timeline: view(); animation-range: entry 0% cover 50%; }
  }
}
@media (prefers-reduced-motion: reduce) { .sr-go { transition: none; } }
@keyframes sr-settle { from { transform: scale(1.08); } to { transform: scale(1); } }
@media (max-width: 900px) {
  .sr-room, .sr-room.is-flip { grid-template-columns: 1fr; .sr-photo { order: 0; } }
}
</style>
