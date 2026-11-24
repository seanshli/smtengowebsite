<template>
  <main v-if="s" class="so" :class="'tone-' + s.tone">
    <section class="so-hero" :class="{ 'is-whole': !s.image }" aria-labelledby="so-title">
      <picture class="so-photo">
        <source type="image/webp" :srcset="`/images/building/${photo}-900.webp 900w, /images/building/${photo}-1600.webp 1600w`" sizes="100vw" />
        <img :src="`/images/building/${photo}-1600.webp`" :alt="lt(s.role) + ' · ' + lt(data.hero.sample)" width="1600" :height="s.image ? 1067 : 900" fetchpriority="high" />
      </picture>
      <div class="so-hero-inner">
        <nav class="so-crumb" aria-label="breadcrumb"><router-link to="/">enGo</router-link><span aria-hidden="true"> / </span>{{ lt(data.page.crumb) }}<span aria-hidden="true"> / </span>{{ lt(s.area) }}</nav>
        <h1 id="so-title" class="so-title">{{ lt(s.title) }}</h1>
        <p class="so-lede">{{ lt(s.lede) }}</p>
        <p class="so-meta">
          <span v-if="s.product" class="so-prod">{{ s.product }}</span>
          <span v-if="s.status" class="so-status">{{ lt(statusLabel[s.status]) }}</span>
        </p>
        <span class="so-sample">{{ lt(data.hero.sample) }}</span>
      </div>
    </section>

    <section class="so-body">
      <div class="so-points">
        <h2 class="so-h2">{{ lt(data.page.pointsTitle) }}</h2>
        <ul>
          <li v-for="(p, k) in s.points" :key="k">
            <span class="so-point">{{ lt(p) }}</span>
            <span class="so-tag" :class="'is-' + p.status">{{ lt(statusLabel[p.status]) }}</span>
          </li>
        </ul>
        <template v-if="s.products && s.products.length">
          <h2 class="so-h2 so-h2-sub">{{ lt(data.page.productsTitle) }}</h2>
          <p class="so-products">
            <template v-for="(pr, k) in s.products" :key="k">
              <a v-if="pr.href" :href="pr.href" target="_blank" rel="noopener" class="so-link">{{ lt(pr) }} <IconArrow external /></a>
              <router-link v-else :to="pr.to" class="so-link">{{ lt(pr) }} <IconArrow /></router-link>
            </template>
          </p>
        </template>
      </div>

      <form class="so-ask" @submit.prevent="ask">
        <h2 class="so-h2 so-h2-ask">{{ lt(data.page.askTitle) }}</h2>
        <p>{{ lt(data.page.askLede) }}</p>
        <div class="so-ask-row">
          <button type="submit" class="so-btn">{{ lt(data.page.askAction) }}</button>
          <a href="https://lin.ee/THIUSjW" target="_blank" rel="noopener" class="so-btn so-btn-ghost" :data-track="'solution:line:' + s.id">{{ lt(data.page.line) }}</a>
        </div>
      </form>
    </section>

    <DeskQa :area="s.id" />

    <nav class="so-others" :aria-label="lt(data.page.others)">
      <h2 class="so-h2">{{ lt(data.page.others) }}</h2>
      <ul>
        <li v-for="o in others" :key="o.id">
          <router-link :to="`/solutions/${o.id}`" class="so-other">
            <span class="so-swatch" :class="'sw-' + o.tone" aria-hidden="true"></span>
            <span><strong>{{ lt(o.area) }}</strong><span>{{ lt(o.line) }}</span></span>
          </router-link>
        </li>
      </ul>
    </nav>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import solutions from '@/data/solutions.json'
import IconArrow from '@/components/IconArrow.vue'
import DeskQa from '@/components/DeskQa.vue'
import { useLocaleText } from '@/composables/useLocaleText'
import { useAnalytics } from '@/utils/analytics'

const data = solutions as any
const route = useRoute()
const router = useRouter()
const { lt } = useLocaleText()
const { trackEvent } = useAnalytics()
const statusLabel = data.statusLabel as Record<string, any>
const s = computed(() => (data.solutions as any[]).find((x) => x.id === route.params.id))
// Integration has no floor of its own: it is the whole building, so it uses the facade.
const photo = computed(() => (s.value && s.value.image) || 'hero-building-dusk')
const others = computed(() => (data.solutions as any[]).filter((x) => x.id !== route.params.id))
const ask = () => {
  if (!s.value) return
  trackEvent('cta_click', { location: 'solution:ask', area: s.value.id })
  router.push({ path: '/contact', query: { area: s.value.id } })
}
</script>

<style scoped lang="scss">
$ink: #1e2a25;
$muted: #4a5650;
$paper: #fbf8f2;
$terrazzo: #e6e0d5;
$light: #f26b21;
$sky: #0b121c;

.so { background: $paper; color: $ink; }
.so-hero { position: relative; min-height: min(78svh, 760px); display: grid; align-items: end; color: #fff; background: $sky; overflow: hidden; isolation: isolate;
  &.is-whole .so-photo img { object-position: 60% 40%; }
}
.so-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; }
.so-hero::after { content: ''; position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba($sky, .05) 30%, rgba($sky, .82) 100%); }
.so-hero-inner { position: relative; width: 100%; max-width: 1248px; margin: 0 auto; padding: clamp(28px, 5vw, 72px) clamp(20px, 6vw, 96px); }
.so-crumb { font-size: .9rem; color: rgba(#fff, .8); a { color: inherit; padding: 0; margin: 0; } }
.so-title { margin: 12px 0 0; color: inherit; font-size: clamp(2rem, 4.4vw, 3.75rem); font-weight: 700; line-height: 1.16; letter-spacing: -.02em; white-space: pre-line; text-wrap: balance; }
.so-lede { margin: 18px 0 0; max-width: 40em; font-size: clamp(1rem, 1.3vw, 1.15rem); line-height: 1.75; color: rgba(#fff, .9); }
.so-meta { display: flex; gap: 10px; align-items: center; margin: 18px 0 0; }
.so-prod { font-weight: 700; color: #ffd2a6; }
.so-status { font-size: .8rem; font-weight: 700; padding: 2px 10px; border-radius: 999px; border: 1px solid #ffd2a6; color: #ffd2a6; }
.so-sample { position: absolute; right: 12px; bottom: 10px; padding: 2px 8px; border-radius: 999px; background: rgba(0, 0, 0, .55); font-size: .75rem; color: #fff; }

.so-body { max-width: 1248px; margin: 0 auto; padding: clamp(48px, 7vw, 96px) clamp(20px, 6vw, 96px); display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 72px); align-items: start; }
.so-h2 { margin: 0 0 18px; color: inherit; font-size: 1.35rem; font-weight: 700; }
.so-h2-sub { margin-top: 36px; }
.so-points ul { list-style: none; margin: 0; padding: 0; }
.so-points li { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; padding: 16px 0; border-top: 1px solid rgba($ink, .14); font-size: 1.05rem; line-height: 1.6; font-weight: 500; }
.so-tag { flex: none; font-size: .75rem; font-weight: 700; padding: 1px 9px; border-radius: 999px; border: 1px solid $muted; color: $muted; white-space: nowrap;
  &.is-live { background: #7fb7a4; border-color: #7fb7a4; color: $ink; }
}
.so-products { display: flex; flex-wrap: wrap; gap: 18px; margin: 0; }
.so-link { color: #b3460f; font-weight: 700; text-decoration: underline; text-underline-offset: 4px; }
.so-ask { padding: 24px; border-radius: 16px; background: #2f4a3e; color: $paper;
  p { margin: 0 0 18px; line-height: 1.7; color: rgba($paper, .88); }
}
.so-h2-ask { color: $paper; }
.so-ask-row { display: flex; flex-wrap: wrap; gap: 10px; }
.so-btn { font: inherit; font-weight: 700; display: inline-flex; align-items: center; min-height: 44px; padding: 0 22px; border-radius: 999px; border: 0; background: #c94f12; color: #fff; cursor: pointer; text-decoration: none;
  &:hover { background: #b3460f; }
  &:focus-visible { outline: 2px solid #ffd2a6; outline-offset: 3px; }
}
.so-btn-ghost { background: none; border: 1.5px solid #ffd2a6; color: #ffd2a6; &:hover { background: rgba(#ffd2a6, .12); } }

.so-others { background: $terrazzo; padding: clamp(40px, 6vw, 72px) clamp(20px, 6vw, 96px);
  > * { max-width: 1248px; margin-left: auto; margin-right: auto; }
  ul { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0 32px; }
}
.so-other { display: flex; gap: 14px; align-items: flex-start; padding: 16px 0; border-top: 1px solid rgba($ink, .18); color: $ink; text-decoration: none;
  strong { display: block; font-size: 1.05rem; } span span { font-size: .92rem; line-height: 1.55; color: $muted; }
  &:hover strong { text-decoration: underline; text-underline-offset: 4px; }
}
.so-swatch { flex: none; width: 14px; height: 14px; border-radius: 3px; margin-top: 5px; }
.sw-mint { background: #7fb7a4; } .sw-butter { background: #f2d37a; } .sw-salmon { background: #e7a596; } .sw-terrazzo { background: #cfc7b8; } .sw-iron { background: #2f4a3e; }

@media (max-width: 900px) { .so-body { grid-template-columns: 1fr; } }
</style>
