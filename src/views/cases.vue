<template>
  <div class="cases-page">
    <div class="header-section">
      <p class="page-kicker">enGo 生活誌</p>
      <h1 class="page-title">{{ $t('casesTitle') }}</h1>
      <p class="subtitle">{{ $t('casesSubtitle') }}</p>
    </div>

    <div class="filters-container">
      <div class="filter-group">
        <label>{{ $t('filterCategory') }}</label>
        <div class="filters">
          <button 
            v-for="type in types" 
            :key="type.key" 
            @click="setType(type.key)" 
            :class="{ active: selectedType === type.key }"
          >
            {{ $t(type.labelKey) }}
          </button>
        </div>
      </div>

      <div class="filter-group select-filters">
        <div class="select-wrapper">
          <label>{{ $t('filterCountry') }}</label>
          <select v-model="selectedCountry">
            <option value="All">{{ $t('catAll') }}</option>
            <option v-for="country in countries" :key="country" :value="country">
              {{ country }}
            </option>
          </select>
        </div>

        <div class="select-wrapper">
          <label>{{ $t('filterCity') }}</label>
          <select v-model="selectedCity">
            <option value="All">{{ $t('catAll') }}</option>
            <option v-for="city in cities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="cases-grid">
      <transition-group name="fade">
        <div v-for="item in filteredCases" :key="item.id" class="case-card card-hover scroll-reveal" @click="handleCaseClick(item)">
          <!-- view-transition-name pairs with CaseDetail's banner so the
               card image morphs into the detail header on navigation -->
          <div class="image-wrapper" :style="{ viewTransitionName: 'case-' + item.id }">
            <img :src="item.image" :alt="getLocaleText(item.title)" />
            <div class="overlay">
              <span>{{ $t('viewDetails') || '查看詳情' }}</span>
            </div>
          </div>
          <div class="card-content">
            <span class="category">{{ getLocaleText(item.category) }}</span>
            <h3 class="title">{{ getLocaleText(item.title) }}</h3>
            <p class="location"><i class="icon-location"></i> {{ getLocaleText(item.location) }}</p>
            <p class="desc">{{ getLocaleText(item.description) }}</p>
          </div>
        </div>
      </transition-group>
    </div>
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

.cases-page {
  padding: 110px 5vw 100px;
  max-width: 1200px;
  margin: 0 auto;

  // editorial masthead, matching the homepage sections
  .header-section {
    text-align: left;
    border-top: 3px solid $grey-blue3;
    padding-top: 22px;
    margin-bottom: 44px;

    .page-kicker {
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 0.28em;
      color: $brand-orange;
      margin-bottom: 6px;
    }

    .page-title {
      font-family: 'Noto Serif TC', serif;
      font-weight: 900;
      font-size: clamp(2.2rem, 6vw, 4rem);
      line-height: 1.1;
      color: $grey-blue3;
      margin-bottom: 10px;
    }

    .subtitle {
      color: $dark-grey;
      font-size: clamp(1rem, 2vw, 1.2rem);
    }
  }

  // filters as an editorial rule-bounded strip, not a card
  .filters-container {
    border-top: 1px solid rgba($grey-blue3, 0.25);
    border-bottom: 1px solid rgba($grey-blue3, 0.25);
    padding: 20px 0;
    margin-bottom: 50px;
    display: flex;
    flex-direction: column;
    gap: 18px;

    .filter-group {
      display: flex;
      align-items: center;
      gap: 20px;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      label {
        font-weight: 700;
        color: $grey-blue3;
        min-width: 64px;
        font-size: 0.88rem;
        letter-spacing: 0.12em;
      }
    }

    // underline tabs instead of pills
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 22px;

      button {
        padding: 4px 2px 6px;
        border: none;
        border-bottom: 2px solid transparent;
        background: none;
        cursor: pointer;
        font-weight: 500;
        font-size: 0.95rem;
        color: $dark-grey;
        transition: color 0.25s ease, border-color 0.25s ease;

        &:hover { color: $brand-orange; }

        &.active {
          font-family: 'Noto Serif TC', serif;
          font-weight: 700;
          color: $grey-blue3;
          border-bottom-color: $brand-orange;
        }
      }
    }

    .select-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 40px;

      @media (max-width: 768px) {
        flex-direction: column;
        gap: 15px;
      }

      .select-wrapper {
        display: flex;
        align-items: center;
        gap: 15px;

        @media (max-width: 768px) {
          width: 100%;
          justify-content: space-between;
        }

        select {
          padding: 6px 12px;
          border: 1px solid rgba($grey-blue3, 0.35);
          border-radius: 0;
          background: $warm-bg-light;
          color: $grey-blue2;
          font-size: 0.9rem;
          min-width: 150px;
          cursor: pointer;
          &:focus { border-color: $brand-orange; outline: none; }
          @media (max-width: 768px) { min-width: 120px; flex: 1; }
        }
      }
    }
  }

  .cases-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  // mounted plates, matching the hero figure: hard edges, hairline border,
  // orange offset frame on hover instead of a soft shadow lift
  .case-card {
    position: relative;
    background: $warm-bg-light;
    border: 1px solid rgba($grey-blue3, 0.32);
    transition: transform 0.3s ease;
    cursor: pointer;

    &::before {
      content: '';
      position: absolute;
      inset: 8px -8px -8px 8px;
      border: 2px solid transparent;
      transition: border-color 0.3s ease;
      z-index: -1;
    }

    &:hover {
      transform: translate(-3px, -3px);
      &::before { border-color: $brand-orange; }
      .image-wrapper .overlay { opacity: 1; }
    }

    .image-wrapper {
      position: relative;
      height: 250px;
      overflow: hidden;
      border-bottom: 1px solid rgba($grey-blue3, 0.25);
      img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
      .overlay {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba($brand-orange, 0.82);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        span {
          color: white;
          font-family: 'Noto Serif TC', serif;
          font-weight: 700;
          border: 1px solid white;
          padding: 8px 22px;
        }
      }
    }

    .card-content {
      padding: 22px 24px 24px;
      .category {
        color: $brand-orange;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.18em;
      }
      .title {
        margin: 8px 0 4px;
        font-family: 'Noto Serif TC', serif;
        font-weight: 700;
        font-size: 1.3rem;
        line-height: 1.45;
        color: $grey-blue3;
      }
      .location { color: $dark-grey; font-size: 0.88rem; margin-bottom: 12px; }
      .desc { color: #5a5a5a; font-size: 0.94rem; line-height: 1.7; }
    }
  }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s, transform 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: scale(0.9); }
</style>
