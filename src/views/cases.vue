<template>
  <div class="cs">
    <!-- tile 1 (parchment): page title, lead, filters -->
    <section class="cs-tile cs-tile-parchment cs-head">
      <div class="cs-wrap cs-center">
        <h1 class="cs-title">{{ $t('casesTitle') }}</h1>
        <p class="cs-lead">{{ $t('casesSubtitle') }}</p>
        <p class="cs-note">{{ $t('casesHistoryNote') }} <router-link to="/product" class="cs-link">{{ $t('productTitle') }}<span class="cs-chev" aria-hidden="true">›</span></router-link></p>

        <div class="cs-filters">
          <div class="cs-filter-group">
            <label class="cs-label">{{ $t('filterCategory') }}</label>
            <div class="cs-chips">
              <button
                v-for="type in types"
                :key="type.key"
                type="button"
                class="cs-chip"
                @click="setType(type.key)"
                :class="{ active: selectedType === type.key }"
              >
                {{ $t(type.labelKey) }}
              </button>
            </div>
          </div>

          <div class="cs-filter-group cs-selects">
            <div class="cs-select">
              <label class="cs-label">{{ $t('filterCountry') }}</label>
              <select v-model="selectedCountry">
                <option value="All">{{ $t('catAll') }}</option>
                <option v-for="country in countries" :key="country" :value="country">
                  {{ country }}
                </option>
              </select>
            </div>

            <div class="cs-select">
              <label class="cs-label">{{ $t('filterCity') }}</label>
              <select v-model="selectedCity">
                <option value="All">{{ $t('catAll') }}</option>
                <option v-for="city in cities" :key="city" :value="city">
                  {{ city }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- tile 2 (white): photo cards, caption below the image -->
    <section class="cs-tile cs-tile-white">
      <div class="cs-wrap">
        <!-- Review 2026-11-05: 18 of 22 cases have no photo, and a plate repeating the
             title above the same title read as a missing image. Photographed work keeps
             the photo grid; the rest is an honest list of records under it. -->
        <div class="cs-grid" v-if="photoCases.length">
          <transition-group name="fade">
            <article
              v-for="item in photoCases"
              :key="item.id"
              class="cs-card scroll-reveal"
              role="link"
              tabindex="0"
              @click="handleCaseClick(item)"
              @keydown.enter="handleCaseClick(item)"
            >
              <!-- view-transition-name pairs with CaseDetail's cover figure so the
                   card image morphs into the detail page on navigation -->
              <div class="cs-photo" :style="{ viewTransitionName: 'case-' + item.id }">
                <img :src="item.image" :alt="getLocaleText(item.title)" loading="lazy" />
              </div>
              <div class="cs-cap">
                <h2 class="cs-name">{{ getLocaleText(item.title) }}</h2>
                <p class="cs-meta">{{ getLocaleText(item.location) }}, {{ getLocaleText(item.category) }}</p>
                <p class="cs-desc">{{ getLocaleText(item.description) }}</p>
                <span class="cs-more">{{ $t('viewDetails') || '查看詳情' }}<span class="cs-chev" aria-hidden="true">›</span></span>
              </div>
            </article>
          </transition-group>
        </div>

        <div class="cs-records" v-if="recordCases.length">
          <h2 class="cs-records-title">{{ isZh ? '更多實作紀錄' : 'More projects' }}</h2>
          <ul class="cs-list">
            <li
              v-for="item in recordCases"
              :key="item.id"
              class="cs-row"
              role="link"
              tabindex="0"
              @click="handleCaseClick(item)"
              @keydown.enter="handleCaseClick(item)"
            >
              <span class="cs-row-name">{{ getLocaleText(item.title) }}</span>
              <span class="cs-row-meta">{{ getLocaleText(item.location) }} · {{ getLocaleText(item.category) }}</span>
              <span class="cs-row-more" aria-hidden="true">›</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import casesData from '@/data/cases.json'
import { useAnalytics } from '@/utils/analytics'
import { useI18n } from 'vue-i18n'
import { useScrollReveal } from '@/composables/useScrollReveal'

import { useRouter } from 'vue-router'

const { locale } = useI18n()
const router = useRouter()

// Initialize scroll reveal animations
useScrollReveal()

const types = [
  { key: 'All', labelKey: 'catAll' },
  { key: 'Private Residence', labelKey: 'catPrivateResidence' },
  { key: 'Office', labelKey: 'catOffice' },
  { key: 'Commercial Space', labelKey: 'catCommercialSpace' },
  { key: 'Showroom', labelKey: 'catShowroom' },
  { key: 'Property Development', labelKey: 'catPropertyDevelopment' }
]

const hasPhoto = (c: any) => typeof c.image === 'string' && !c.image.endsWith('case-home.jpg')

const selectedType = ref('All')
const selectedCountry = ref('All')
const selectedCity = ref('All')

const cases = ref(casesData)
const { trackEvent } = useAnalytics()

const countries = computed(() => {
  const allCountries = cases.value.map(c => c.country[locale.value as 'en' | 'zh'] || c.country['en'])
  return [...new Set(allCountries)]
})

const cities = computed(() => {
  let filtered = cases.value
  if (selectedCountry.value !== 'All') {
    filtered = filtered.filter(c => c.country[locale.value as 'en' | 'zh'] === selectedCountry.value || c.country['en'] === selectedCountry.value)
  }
  const allCities = filtered.map(c => c.location[locale.value as 'en' | 'zh'] || c.location['en'])
  return [...new Set(allCities)]
})

const filteredCases = computed(() => {
  return cases.value.filter(c => {
    const matchType = selectedType.value === 'All' || c.category['en'] === selectedType.value
    const matchCountry = selectedCountry.value === 'All' || 
                         c.country[locale.value as 'en' | 'zh'] === selectedCountry.value ||
                         c.country['en'] === selectedCountry.value
    const matchCity = selectedCity.value === 'All' || 
                      c.location[locale.value as 'en' | 'zh'] === selectedCity.value ||
                      c.location['en'] === selectedCity.value
    
    return matchType && matchCountry && matchCity
  })
})
const photoCases = computed(() => filteredCases.value.filter(hasPhoto))
const recordCases = computed(() => filteredCases.value.filter((c) => !hasPhoto(c)))
const isZh = computed(() => locale.value.startsWith('zh'))

const setType = (type: string) => {
  selectedType.value = type
  trackEvent('filter_cases', { category: type })
}

const handleCaseClick = (item: any) => {
  trackEvent('case_click', { case_id: item.id, title: item.title['en'] })
  router.push(`/cases/${item.id}`)
}

const getLocaleText = (obj: any) => {
  return obj[locale.value] || obj['en'] || obj['zh'] || ''
}
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

// Apple-profile tiles (DESIGN.md enGo addendum; reference: src/views/index.vue)
.cs { background: #fff; color: $ink; font-family: $display-font; }
.cs a:focus-visible, .cs button:focus-visible, .cs select:focus-visible, .cs-card:focus-visible { outline: 2px solid $brand-orange-text; outline-offset: 3px; }
.cs-wrap { max-width: 1240px; margin: 0 auto; padding-inline: clamp(20px, 5vw, 64px); }
.cs-center { text-align: center; }
.cs-tile { padding: clamp(64px, 9vw, 112px) 0; }
.cs-tile-white { background: #fff; }
.cs-tile-parchment { background: $parchment; }
.cs-head { padding-top: clamp(84px, 9vw, 104px); padding-bottom: clamp(40px, 5vw, 64px); }

.cs-title {
  font-family: $display-font; font-weight: 600; letter-spacing: -.03em; line-height: 1.05; color: $ink; margin: 0;
  font-size: clamp(2.6rem, 6.4vw, 5rem);
}
.cs-lead { font-size: clamp(1.2rem, 1.9vw, 1.6rem); font-weight: 300; line-height: 1.4; letter-spacing: -.005em; color: $ink; max-width: 30em; margin: 18px auto 0; }
.cs-note { margin: 14px auto 0; max-width: 60ch; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; color: $ink-80; }
.cs-link { color: $brand-orange-text; text-decoration: none; white-space: nowrap; &:hover { text-decoration: underline; } }
.cs-chev { margin-left: .25em; }

// ─── filters: ghost pills, the active one filled ─────────────────────────
.cs-filters { margin-top: clamp(28px, 4vw, 44px); display: flex; flex-direction: column; align-items: center; gap: 20px; }
.cs-filter-group { display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; }
.cs-label { font-size: 1.0625rem; font-weight: 600; letter-spacing: -.022em; color: $ink; }
.cs-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
.cs-chip {
  min-height: 44px; padding: 10px 20px; border-radius: 9999px; cursor: pointer;
  background: transparent; border: 1px solid $brand-orange-text; color: $brand-orange-text;
  font: inherit; font-size: 1.0625rem; font-weight: 400; letter-spacing: -.022em;
  transition: transform .15s ease, background .2s ease;
  &:active { transform: scale(.95); }
  &:hover { background: rgba($brand-orange, .06); }
  &.active { background: $brand-orange-text; color: #fff; &:hover { background: darken($brand-orange-text, 6%); } }
}
.cs-selects { gap: 16px 32px; }
.cs-select {
  display: flex; align-items: center; gap: 12px;
  select {
    min-height: 44px; min-width: 160px; padding: 10px 18px; border-radius: 9999px; cursor: pointer;
    border: 1px solid $hairline; background: #fff; color: $ink; font: inherit; font-size: 1.0625rem; letter-spacing: -.022em;
  }
  @media (max-width: 640px) { width: 100%; justify-content: space-between; select { flex: 1; min-width: 0; } }
}

// ─── photo cards: image radius 18, caption below, no shadow, no overlay ───
.cs-grid {
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(32px, 4vw, 48px) 28px;
  @media (max-width: 1068px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
}
.cs-card { display: flex; flex-direction: column; cursor: pointer; color: $ink; }
.cs-photo {
  aspect-ratio: 4 / 3; border-radius: 18px; overflow: hidden; background: $parchment;
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
}
.cs-cap { display: flex; flex-direction: column; gap: 4px; padding-top: 16px; }
.cs-name { margin: 0; font-family: $display-font; font-weight: 600; font-size: 1.3125rem; line-height: 1.25; letter-spacing: -.01em; color: $ink; }
.cs-meta { margin: 0; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; color: $ink-80; }
.cs-desc { margin: 8px 0 0; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; color: $ink; }
.cs-more { margin-top: 10px; font-size: 1.0625rem; letter-spacing: -.022em; color: $brand-orange-text; }
.cs-card:hover .cs-more { text-decoration: underline; }
.cs-card:active .cs-photo { transform: scale(.99); }
.cs-photo { transition: transform .15s ease; }

// ─── records without a photo: a hairline list, not image-less tiles ───
.cs-records { margin-top: clamp(64px, 8vw, 96px); }
.cs-records:first-child { margin-top: 0; }
.cs-records-title { margin: 0 0 20px; font-family: $display-font; font-weight: 600; font-size: clamp(1.5rem, 2.4vw, 2rem); line-height: 1.15; letter-spacing: -.02em; color: $ink; }
.cs-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid $ink; }
.cs-row {
  display: grid; grid-template-columns: minmax(0, 1fr) auto 20px; align-items: baseline; gap: 4px 24px;
  min-height: 44px; padding: 18px 0; border-bottom: 1px solid $hairline; cursor: pointer; color: $ink;
  &:hover .cs-row-name, &:focus-visible .cs-row-name { color: $brand-orange-text; }
  &:focus-visible { outline: 2px solid $brand-orange-text; outline-offset: 4px; }
  @media (max-width: 640px) { grid-template-columns: minmax(0, 1fr) 20px; .cs-row-meta { grid-column: 1; grid-row: 2; } }
}
.cs-row-name { font-weight: 600; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; transition: color .2s ease; }
.cs-row-meta { font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; color: $ink-80; }
.cs-row-more { color: $brand-orange-text; font-size: 1.25rem; text-align: right; @media (max-width: 640px) { grid-row: 1; grid-column: 2; } }

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .cs-chip, .cs-photo, .fade-enter-active, .fade-leave-active { transition: none; } }
</style>
