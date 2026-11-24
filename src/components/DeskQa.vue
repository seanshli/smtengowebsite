<template>
  <!-- The questions people ask at the 管理室 desk before they start. -->
  <section class="qa" :class="{ 'is-scoped': !!area }" aria-labelledby="qa-title">
    <div class="qa-inner">
      <div class="qa-side">
        <h2 id="qa-title" class="qa-title">{{ lt(qa.title) }}</h2>
        <div v-if="!area" class="qa-areas" role="group" :aria-label="lt(qa.title)">
          <button
            v-for="f in filters" :key="f.id" type="button" class="qa-chip"
            :aria-pressed="pickArea === f.id" @click="pickArea = f.id"
          ><span v-if="f.tone" class="qa-swatch" :class="'tone-' + f.tone" aria-hidden="true"></span>{{ lt(f.label) }}</button>
        </div>
        <div class="qa-more">
          <p class="qa-more-title">{{ lt(qa.moreTitle) }}</p>
          <p class="qa-more-lede">{{ lt(qa.moreLede) }}</p>
          <div class="qa-more-row">
            <router-link :to="contactTo" class="qa-btn" :data-track="'qa:ask:' + (area || pickArea)">{{ lt(hero.counterAction) }}</router-link>
            <a href="https://lin.ee/THIUSjW" target="_blank" rel="noopener" class="qa-btn qa-btn-ghost" data-track="qa:line">LINE <IconArrow external /></a>
          </div>
        </div>
      </div>

      <div class="qa-list">
        <details v-for="it in shown" :key="it.id" class="qa-item" @toggle="onToggle($event, it)">
          <summary class="qa-q">
            <span class="qa-swatch" :class="'tone-' + toneOf(it.area)" aria-hidden="true"></span>
            <span class="qa-q-text">{{ lt(it.q) }}</span>
            <svg class="qa-mark" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M3 8h10M8 3v10" /></svg>
          </summary>
          <p class="qa-a">{{ lt(it.a) }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import data from '@/data/solutions.json'
import IconArrow from '@/components/IconArrow.vue'
import { useLocaleText } from '@/composables/useLocaleText'
import { useAnalytics } from '@/utils/analytics'

// `area` set: a solution page shows only that area's questions, with no filter row.
const props = defineProps<{ area?: string }>()
const { lt } = useLocaleText()
const { trackEvent } = useAnalytics()
const d = data as any
const qa = d.qa
const hero = d.hero
const sols = d.solutions as any[]
const tones: Record<string, string> = Object.fromEntries(sols.map((s) => [s.id, s.tone]))
const toneOf = (a: string) => tones[a] || 'general'
const filters = [
  { id: 'all', label: qa.all, tone: '' },
  { id: 'general', label: qa.general, tone: 'general' },
  ...sols.map((s) => ({ id: s.id, label: s.area, tone: s.tone })),
]
const pickArea = ref('all')
const shown = computed(() => {
  const a = props.area || pickArea.value
  return (qa.items as any[]).filter((it) => a === 'all' || it.area === a)
})
const contactTo = computed(() => {
  const a = props.area || pickArea.value
  return a === 'all' || a === 'general' ? '/contact' : { path: '/contact', query: { area: a } }
})
const onToggle = (e: Event, it: any) => {
  if ((e.target as HTMLDetailsElement).open) trackEvent('qa_open', { id: it.id, area: it.area })
}
</script>

<style scoped lang="scss">
$ink: #1e2a25;
$muted: #4a5650;
$paper: #fbf8f2;
$grille: #2f4a3e;
$glow: #ffd2a6;
$light: #f26b21;
$action: #c94f12;

.qa { background: $paper; color: $ink; padding: clamp(64px, 9vw, 120px) clamp(20px, 6vw, 96px); }
.qa.is-scoped { padding-top: 0; }
.qa-inner { max-width: 1248px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr); gap: clamp(32px, 5vw, 80px); align-items: start; }
.qa-side { position: sticky; top: 96px; }
.qa-title { margin: 0; color: inherit; font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 700; line-height: 1.25; text-wrap: balance; }
.is-scoped .qa-title { font-size: 1.35rem; }

.qa-areas { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 24px; }
.qa-chip {
  font: inherit; font-size: .9rem; font-weight: 500; color: $ink; cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px; min-height: 40px; padding: 6px 14px;
  border-radius: 999px; border: 1px solid rgba($ink, .4); background: none;
  transition: background-color .2s, color .2s;
  &[aria-pressed='true'] { background: $ink; color: $paper; border-color: $ink; }
  &:hover:not([aria-pressed='true']) { background: rgba($ink, .06); }
  &:focus-visible { outline: 2px solid $action; outline-offset: 2px; }
}

.qa-more { margin-top: 28px; padding: 22px; border-radius: 16px; background: $grille; color: $paper; }
.qa-more-title { margin: 0; font-weight: 700; font-size: 1.05rem; }
.qa-more-lede { margin: 6px 0 16px; line-height: 1.7; color: rgba($paper, .88); }
.qa-more-row { display: flex; flex-wrap: wrap; gap: 10px; }
.qa-btn {
  font: inherit; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; min-height: 44px; padding: 0 20px;
  border-radius: 999px; background: $action; color: #fff; text-decoration: none;
  &:hover { background: #b3460f; }
  &:focus-visible { outline: 2px solid $glow; outline-offset: 3px; }
}
.qa-btn-ghost { background: none; border: 1.5px solid $glow; color: $glow; &:hover { background: rgba($glow, .12); } }

.qa-list { border-top: 1px solid rgba($ink, .16); }
.qa-item { border-bottom: 1px solid rgba($ink, .16); }
.qa-q {
  list-style: none; cursor: pointer; display: grid; grid-template-columns: 14px minmax(0, 1fr) 16px; gap: 14px; align-items: baseline;
  padding: 20px 4px; font-size: 1.08rem; font-weight: 600; line-height: 1.55;
  &::-webkit-details-marker { display: none; }
  &:hover .qa-q-text { text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1px; }
  &:focus-visible { outline: 2px solid $action; outline-offset: 2px; border-radius: 6px; }
}
.qa-mark { align-self: center; color: $muted; transition: transform .3s cubic-bezier(.22, 1, .36, 1); }
.qa-item[open] .qa-mark { transform: rotate(45deg); }
.qa-a { margin: 0; padding: 0 4px 22px 32px; max-width: 64ch; font-size: 1rem; line-height: 1.85; color: $ink; }

.qa-swatch { flex: none; display: inline-block; width: 14px; height: 14px; border-radius: 3px; align-self: center; }
.tone-mint { background: #7fb7a4; } .tone-butter { background: #f2d37a; } .tone-salmon { background: #e7a596; } .tone-terrazzo { background: #cfc7b8; } .tone-iron { background: #2f4a3e; }
.tone-general { background: none; border: 2px solid $light; border-radius: 50%; }
.qa-chip[aria-pressed='true'] .tone-iron { box-shadow: 0 0 0 1px rgba($paper, .7); }

@media (prefers-reduced-motion: reduce) { .qa-mark, .qa-chip { transition: none; } }
@media (max-width: 900px) {
  // Phones: heading, filter, the questions, then the ask panel last.
  .qa-inner { display: flex; flex-direction: column; gap: 0; }
  .qa-side { display: contents; }
  .qa-title { order: 1; }
  .qa-areas { order: 2; }
  .qa-list { order: 3; margin-top: 24px; }
  .qa-more { order: 4; }
}
</style>
