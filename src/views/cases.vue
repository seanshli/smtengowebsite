<template>
  <div class="cases-page">
    <div class="header-section">
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
        <div v-for="item in filteredCases" :key="item.id" class="case-card" @click="handleCaseClick(item)">
          <div class="image-wrapper">
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

import { useRouter } from 'vue-router'

const { locale } = useI18n()
const router = useRouter()

const types = [
  { key: 'All', labelKey: 'catAll' },
  { key: 'Private Residence', labelKey: 'catPrivateResidence' },
  { key: 'Office', labelKey: 'catOffice' },
  { key: 'Commercial Space', labelKey: 'catCommercialSpace' },
  { key: 'Showroom', labelKey: 'catShowroom' }
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
.cases-page {
  padding: 100px 20px;
  max-width: 1200px;
  margin: 0 auto;

  .header-section {
    text-align: center;
    margin-bottom: 60px;
    .page-title { 
      font-size: 2.5rem; 
      color: #333; 
      margin-bottom: 10px; 
      @media (max-width: 768px) { font-size: 1.8rem; }
    }
    .subtitle { 
      color: #666; 
      font-size: 1.1rem;
      @media (max-width: 768px) { font-size: 1rem; padding: 0 10px; }
    }
  }

  .filters-container {
    background: #fdfdfd;
    padding: 30px;
    border-radius: 20px;
    border: 1px solid #f0f0f0;
    margin-bottom: 50px;
    display: flex;
    flex-direction: column;
    gap: 30px;

    @media (max-width: 768px) {
      padding: 20px;
      gap: 20px;
    }

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
        color: #333;
        min-width: 80px;
        font-size: 0.95rem;
      }
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      button {
        padding: 8px 20px;
        border: 1px solid #eee;
        background: white;
        cursor: pointer;
        border-radius: 30px;
        font-weight: 500;
        transition: all 0.3s ease;
        font-size: 0.9rem;
        &:hover { border-color: #c46043; color: #c46043; }
        &.active { background: #c46043; color: white; border-color: #c46043; box-shadow: 0 4px 12px rgba(196, 96, 67, 0.2); }
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
          padding: 8px 15px;
          border: 1px solid #eee;
          border-radius: 8px;
          background: white;
          color: #666;
          font-size: 0.9rem;
          min-width: 150px;
          cursor: pointer;
          &:focus { border-color: #c46043; outline: none; }
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

  .case-card {
    background: #fff;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
      .image-wrapper .overlay { opacity: 1; }
    }

    .image-wrapper {
      position: relative;
      height: 250px;
      overflow: hidden;
      img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
      .overlay {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(196, 96, 67, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        span { color: white; font-weight: 600; border: 2px solid white; padding: 8px 20px; border-radius: 5px; }
      }
    }

    .card-content {
      padding: 25px;
      .category { color: #c46043; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
      .title { margin: 10px 0 5px; font-size: 1.4rem; color: #333; }
      .location { color: #888; font-size: 0.9rem; margin-bottom: 15px; }
      .desc { color: #666; font-size: 0.95rem; line-height: 1.6; }
    }
  }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s, transform 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: scale(0.9); }
</style>
