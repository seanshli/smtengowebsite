<template>
  <div class="tutorial-page">
    <div class="header-section ed-mast-block">
      <p class="ed-mast-kicker">{{ $t('brandJournal') }}</p>
      <h1 class="page-title">{{ $t('tutorialTitle') }}</h1>
      <p class="subtitle">{{ $t('tutorialSubtitle') }}</p>
    </div>
    
    <div class="tutorial-grid">
      <div v-for="item in tutorials" :key="item.id" class="tutorial-card" @click="handleCardClick(item)">
        <div class="card-icon">
          <img v-if="item.id === 'individual'" src="/assets/logo.svg" alt="Individual" />
          <img v-else-if="item.id === 'designer'" src="/assets/logo-orange.svg" alt="Designer" />
          <img v-else src="/assets/logo.svg" alt="Builder" />
        </div>
        <h2>{{ (item.title as any)[locale] || item.title['zh'] }}</h2>
        <p>{{ (item.description as any)[locale] || item.description['zh'] }}</p>
        <ul v-if="item.steps" class="steps">
          <li v-for="(step, index) in item.steps" :key="index">
            <strong>{{ (step.title as any)[locale] || (step.title as any)['zh'] }}</strong>: 
            <span v-html="renderStepContent((step.content as any)[locale] || (step.content as any)['zh'])" @click="handleLinkClick"></span>
          </li>
        </ul>

        <div v-if="item.partners && item.partners.length > 0" class="partners-section mt-24">
          <h4 class="partners-title fz-14 fw-700 text-brand-orange mb-12">{{ $t('ourPartners') }}</h4>
          <ul class="partners-list">
            <li v-for="(partner, pIdx) in item.partners" :key="pIdx" class="partner-item mb-8">
              <span class="partner-category fz-12 fw-600 text-grey-666">{{ (partner.category as any)[locale] || (partner.category as any)['zh'] }}: </span>
              <a :href="partner.url" target="_blank" class="partner-name fz-12 text-brand-orange hover-underline" @click.stop>
                {{ (partner.name as any)[locale] || (partner.name as any)['zh'] }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- ─── 操作指南（依功能模組）───
         每個模組帶 id="howto-<模組>"，供 FAQ 與 chatbot 的 /tutorial#howto-xxx 深連結落點。
         內容來自 src/data/howto.json，截圖為 enGo 3.2.2（489）實機擷取。 -->
    <div id="howto" class="howto-section py-80 py-mob-40">
      <h2 class="howto-title tac mb-12">{{ howtoHeading }}</h2>
      <p class="howto-sub tac mb-40">{{ howtoSubheading }}</p>

      <nav class="howto-nav mb-40" aria-label="module index">
        <a
          v-for="m in howtoModules"
          :key="'nav-' + m.id"
          class="howto-pill"
          :class="{ active: openHowto === m.id }"
          :href="'#howto-' + m.id"
          :data-howto="m.id"
          @click.prevent="openModule(m.id, 'pill')"
        >
          {{ pick(m.title) }}
        </a>
      </nav>

      <!-- Folded by default: only the header shows until the visitor opens a module.
           Each open is recorded once per page view (GTM event + howto:<id> row) so we can
           see which modules people actually reach for. -->
      <section
        v-for="m in howtoModules"
        :key="m.id"
        :id="'howto-' + m.id"
        class="howto-module"
        :class="{ open: openHowto === m.id }"
      >
        <button
          type="button"
          class="howto-module-head"
          :aria-expanded="openHowto === m.id ? 'true' : 'false'"
          :aria-controls="'howto-body-' + m.id"
          :data-howto="m.id"
          @click="toggleModule(m.id)"
        >
          <span class="howto-module-text">
            <span class="howto-module-title">{{ pick(m.title) }}</span>
            <span class="howto-module-summary">{{ pick(m.summary) }}</span>
          </span>
          <span class="howto-module-meta">
            <span class="howto-module-count">{{ m.steps.length }} {{ stepsLabel }}</span>
            <span class="howto-chevron" aria-hidden="true">&#x25BC;</span>
          </span>
        </button>

        <div v-if="openHowto === m.id" :id="'howto-body-' + m.id" class="howto-module-body">
        <ol class="howto-steps">
          <li v-for="(st, i) in m.steps" :key="i" class="howto-step">
            <h4 class="howto-step-title">{{ pick(st.title) }}</h4>
            <p class="howto-step-body">{{ pick(st.body) }}</p>
            <figure v-if="st.image" class="howto-shot">
              <img :src="st.image" :alt="pick(st.title)" loading="lazy" decoding="async" />
            </figure>
          </li>
        </ol>

        <ul v-if="m.tips && m.tips.length" class="howto-tips">
          <li v-for="(t, i) in m.tips" :key="'tip-' + i">{{ pick(t) }}</li>
        </ul>

        <p v-if="m.imagesPending" class="howto-pending">{{ pendingLabel }}</p>
        </div>
      </section>
    </div>

    <!-- anchor target for the 常見問題 links in the header and footer -->
    <div id="faq" class="faq-section py-80 py-mob-40">
      <h2 class="faq-title tac mb-50">{{ $t('faqTitle') }}</h2>

      <!-- Category filter pills -->
      <div class="faq-filters tac mb-30">
        <button
          v-for="cat in faqCategories"
          :key="cat.key"
          class="filter-pill"
          :class="{ active: activeFaqFilter === cat.key }"
          @click="activeFaqFilter = cat.key"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Popularity badge -->
      <p class="faq-sort-hint tac mb-20" v-if="activeFaqFilter === 'all'">
        <span class="sort-icon">&#x1F525;</span> {{ faqSortLabel }}
      </p>

      <div class="faq-container">
        <div
          v-for="faq in sortedFaqs"
          :key="faq.id"
          class="faq-item"
          :class="{ open: openFaqId === faq.id }"
          @click="toggleFaq(faq)"
        >
          <div class="faq-header">
            <h3 class="question">Q: {{ (faq.question as any)[locale] || (faq.question as any)['zh'] }}</h3>
            <span class="faq-toggle" :class="{ rotated: openFaqId === faq.id }">&#x25BC;</span>
          </div>
          <transition name="faq-expand">
            <div v-if="openFaqId === faq.id" class="faq-body">
              <p class="answer" @click="handleLinkClick" v-html="'A: ' + renderStepContent((faq.answer as any)[locale] || (faq.answer as any)['zh'])"></p>
              <span class="faq-helpful" v-if="faqClicks[faq.id]">{{ faqClicks[faq.id] }} {{ locale === 'zh' || locale === 'zhCN' ? '人瀏覽' : locale === 'ja' ? '回閲覧' : locale === 'fr' ? 'vues' : locale === 'es' ? 'vistas' : 'views' }}</span>
            </div>
          </transition>
        </div>
      </div>
    </div>



    <div class="video-cta-section p-40 mt-50 bg-light-grey border-radius-20 tac">
      <div class="cta-content">
        <h3 class="fz-24 fw-700 text-brand-orange mb-12">{{ $t('watchTutorials') }}</h3>
        <p class="fz-16 text-grey-666 mb-32">{{ $t('videoGuideDesc') }}</p>
        
        <div class="video-grid">
          <a 
            v-for="(video, idx) in youtubeVideos"
            :key="idx"
            :href="video.url" 
            target="_blank" 
            class="video-card"
          >
            <div class="thumbnail-wrapper">
              <img :src="getYoutubeThumbnail(video.url)" :alt="video.title" class="thumbnail" />
              <div class="play-overlay">
                <i class="icon-play"></i>
              </div>
            </div>
            <span class="video-title">{{ video.title }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import tutorialsData from '@/data/tutorials.json'
import faqsData from '@/data/faqs.json'
import knowledgeBaseData from '@/data/knowledge_base.json'
import howtoData from '@/data/howto.json'
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useAnalytics } from '@/utils/analytics'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'

const tutorials = ref(tutorialsData)
const faqs = ref(faqsData as any[])
const youtubeVideos = ref(knowledgeBaseData.youtube)

// ── 操作指南（howto.json）
// 缺語系一律落回 zh，與本頁 tutorials／FAQ 的既有做法一致。
const howtoModules = ref((howtoData as any).modules as any[])
const pick = (o: any) => (o ? (o[locale.value] ?? o['zh']) : '')
const HOWTO_TEXT: Record<string, Record<string, string>> = {
  heading: {
    zh: '操作指南', zhCN: '操作指南', en: 'How-to Guides',
    fr: 'Guides pratiques', ja: '操作ガイド', es: 'Guías de uso',
  },
  sub: {
    zh: '依功能模組整理的圖文步驟，截圖取自 enGo 3.2.2 實機畫面。',
    zhCN: '依功能模块整理的图文步骤，截图取自 enGo 3.2.2 实机画面。',
    en: 'Step-by-step guides by module, with screenshots taken from enGo 3.2.2 on a real device.',
    fr: 'Guides pas à pas par module, avec des captures réelles d\'enGo 3.2.2.',
    ja: '機能モジュール別の手順ガイド。スクリーンショットは実機の enGo 3.2.2 から取得。',
    es: 'Guías paso a paso por módulo, con capturas reales de enGo 3.2.2.',
  },
  steps: { zh: '個步驟', zhCN: '个步骤', en: 'steps', fr: 'étapes', ja: 'ステップ', es: 'pasos' },
  pending: {
    zh: '本模組的示範截圖尚未以現行版本重拍。',
    zhCN: '本模块的示范截图尚未以现行版本重拍。',
    en: 'Screenshots for this module have not yet been re-taken on the current version.',
    fr: 'Les captures de ce module n\'ont pas encore été refaites sur la version actuelle.',
    ja: 'このモジュールのスクリーンショットは現行バージョンで撮り直していません。',
    es: 'Las capturas de este módulo aún no se han rehecho en la versión actual.',
  },
}
const howtoHeading = computed(() => HOWTO_TEXT.heading[locale.value] || HOWTO_TEXT.heading.zh)
const howtoSubheading = computed(() => HOWTO_TEXT.sub[locale.value] || HOWTO_TEXT.sub.zh)
const pendingLabel = computed(() => HOWTO_TEXT.pending[locale.value] || HOWTO_TEXT.pending.zh)
const stepsLabel = computed(() => HOWTO_TEXT.steps[locale.value] || HOWTO_TEXT.steps.zh)
const { trackEvent } = useAnalytics()
const { locale } = useI18n()
const router = useRouter()
const route = useRoute()

// ── 操作指南 accordion ─────────────────────────────────────────────
// One module open at a time. Opening is what we measure: `via` says whether it
// came from the pill row, the module header, or a deep link (FAQ / chatbot /
// KB-001 §9.2.1). Each module is recorded once per page view.
const openHowto = ref<string | null>(null)
const recordedHowto = new Set<string>()
const recordHowtoOpen = (id: string, via: 'pill' | 'header' | 'link') => {
  if (recordedHowto.has(id)) return
  recordedHowto.add(id)
  trackEvent('howto_open', { module: id, via, locale: locale.value })
  fetch('/api/chatbot-query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword: 'howto:' + id, locale: locale.value, matchFound: true }),
  }).catch(() => { /* analytics must never break the page */ })
}
const openModule = async (id: string, via: 'pill' | 'header' | 'link') => {
  if (!howtoModules.value.some((m) => m.id === id)) return
  openHowto.value = id
  recordHowtoOpen(id, via)
  await nextTick()
  document.getElementById('howto-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
const toggleModule = (id: string) => {
  if (openHowto.value === id) { openHowto.value = null; return }
  openHowto.value = id
  recordHowtoOpen(id, 'header')
}
const openFromHash = (hash: string | undefined) => {
  const m = /^#howto-([a-z]+)$/.exec(hash || '')
  if (m) openModule(m[1], 'link')
}
watch(() => route.hash, (h) => openFromHash(h))
onMounted(() => openFromHash(route.hash || window.location.hash))

// --- Dynamic FAQ ---
const openFaqId = ref<number | null>(null)
const activeFaqFilter = ref('all')

// Load click counts from localStorage (persists across sessions)
const STORAGE_KEY = 'engo_faq_clicks'
const faqClicks = ref<Record<number, number>>((() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch { return {} }
})())

const saveClicks = () => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(faqClicks.value)) } catch {}
}

const toggleFaq = (faq: any) => {
  if (openFaqId.value === faq.id) {
    openFaqId.value = null
  } else {
    openFaqId.value = faq.id
    // Track the click
    faqClicks.value[faq.id] = (faqClicks.value[faq.id] || 0) + 1
    saveClicks()
    trackEvent('faq_click', { faq_id: faq.id, question: (faq.question as any)['en'] || '' })
  }
}

// Category filter
const faqCategoryMap: Record<string, Record<string, string>> = {
  all: { zh: '全部', zhCN: '全部', en: 'All', fr: 'Tous', ja: 'すべて', es: 'Todos' },
  setup: { zh: '安裝設定', zhCN: '安装设定', en: 'Setup', fr: 'Installation', ja: 'セットアップ', es: 'Instalación' },
  features: { zh: '功能', zhCN: '功能', en: 'Features', fr: 'Fonctionnalités', ja: '機能', es: 'Funciones' },
  products: { zh: '產品', zhCN: '产品', en: 'Products', fr: 'Produits', ja: '製品', es: 'Productos' },
  services: { zh: '服務', zhCN: '服务', en: 'Services', fr: 'Services', ja: 'サービス', es: 'Servicios' },
  safety: { zh: '安全', zhCN: '安全', en: 'Safety', fr: 'Sécurité', ja: '安全', es: 'Seguridad' },
  energy: { zh: '節能', zhCN: '节能', en: 'Energy', fr: 'Énergie', ja: '省エネ', es: 'Energía' },
  maintenance: { zh: '維護', zhCN: '维护', en: 'Maintenance', fr: 'Entretien', ja: 'メンテナンス', es: 'Mantenimiento' },
  warranty: { zh: '保固', zhCN: '保固', en: 'Warranty', fr: 'Garantie', ja: '保証', es: 'Garantía' },
  // 這兩個分類 faqs.json 早就在用，但一直沒有對照，導致它們的篩選鈕不會出現
  // （只能在「全部」看到）。2026-09-22 補上。
  tutorials: { zh: '教學', zhCN: '教学', en: 'Tutorials', fr: 'Tutoriels', ja: 'チュートリアル', es: 'Tutoriales' },
  compatibility: { zh: '相容性', zhCN: '兼容性', en: 'Compatibility', fr: 'Compatibilité', ja: '互換性', es: 'Compatibilidad' },
}

const faqCategories = computed(() => {
  const usedCats = new Set(faqs.value.map((f: any) => f.category).filter(Boolean))
  const cats = [{ key: 'all', label: faqCategoryMap['all'][locale.value] || 'All' }]
  for (const key of Object.keys(faqCategoryMap)) {
    if (key !== 'all' && usedCats.has(key)) {
      cats.push({ key, label: faqCategoryMap[key][locale.value] || key })
    }
  }
  return cats
})

// Sorted by popularity (click count) when showing "all"
const sortedFaqs = computed(() => {
  let filtered = faqs.value
  if (activeFaqFilter.value !== 'all') {
    filtered = filtered.filter((f: any) => f.category === activeFaqFilter.value)
  }
  // Sort by clicks desc (most popular first)
  return [...filtered].sort((a: any, b: any) => {
    return (faqClicks.value[b.id] || 0) - (faqClicks.value[a.id] || 0)
  })
})

const faqSortLabel = computed(() => {
  const labels: Record<string, string> = {
    zh: '依熱門程度排序',
    zhCN: '按热门程度排序',
    en: 'Sorted by popularity',
    fr: 'Trié par popularité',
    ja: '人気順',
    es: 'Ordenado por popularidad'
  }
  return labels[locale.value] || labels.en
})

const handleCardClick = (item: any) => {
  trackEvent('tutorial_card_click', { tutorial_id: item.id, title: item.title['en'] })
}

const getYoutubeThumbnail = (url: string) => {
  let videoId = ''
  if (url.includes('v=')) {
    videoId = url.split('v=')[1].split('&')[0]
  } else if (url.includes('shorts/')) {
    videoId = url.split('shorts/')[1].split('?')[0]
  }
  return `https://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

const renderStepContent = (text: string) => {
  if (!text) return ''
  // Markdown links only — nothing else is allowed through. Internal paths stay in-app
  // via handleLinkClick; external URLs (YouTube, partner sites) open in a new tab.
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')
    .replace(/\[([^\]]+)\]\(([^\)\s]+)\)/g, (_m: string, label: string, href: string) =>
      /^https?:\/\//.test(href)
        ? `<a href="${href}" class="step-link" target="_blank" rel="noopener">${label}</a>`
        : `<a href="${href}" class="step-link">${label}</a>`
    )
}

const handleLinkClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  // A click on any link inside an FAQ body must not toggle the accordion.
  if (target.tagName === 'A') e.stopPropagation()
  if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('/')) {
    e.preventDefault()
    e.stopPropagation()
    const href = target.getAttribute('href')!
    // Keep the #fragment: /tutorial#howto-device must land on (and open) that module.
    const [pathAndQuery, fragment] = href.split('#')
    const [path, query] = pathAndQuery.split('?')
    const queryObj: any = {}
    if (query) {
      query.split('&').forEach(q => {
        const [k, v] = q.split('=')
        queryObj[k] = v
      })
    }
    router.push({ path, query: queryObj, ...(fragment ? { hash: '#' + fragment } : {}) })
  }
}

// --- FAQPage JSON-LD Structured Data ---
let jsonLdScript: HTMLScriptElement | null = null

const injectFaqJsonLd = () => {
  // Use English FAQ data for search engines (default language)
  const faqItems = (faqsData as any[]).map(faq => ({
    '@type': 'Question',
    'name': faq.question['en'] || faq.question['zh'],
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': faq.answer['en'] || faq.answer['zh']
    }
  }))

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqItems
  }

  // Create and inject script element
  jsonLdScript = document.createElement('script')
  jsonLdScript.type = 'application/ld+json'
  jsonLdScript.textContent = JSON.stringify(jsonLdData)
  document.head.appendChild(jsonLdScript)
}

const removeFaqJsonLd = () => {
  if (jsonLdScript && jsonLdScript.parentNode) {
    jsonLdScript.parentNode.removeChild(jsonLdScript)
    jsonLdScript = null
  }
}

onMounted(() => {
  injectFaqJsonLd()
})

onUnmounted(() => {
  removeFaqJsonLd()
})
</script>

<style scoped lang="scss">
.tutorial-page {
  padding: 100px 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  :deep(.step-link) {
    color: #c46043;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

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

  .tutorial-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  .tutorial-card {
    background: #fff;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    border: 1px solid #f0f0f0;

    @media (max-width: 768px) {
      padding: 30px 20px;
    }

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      border-color: #c46043;
    }

    .card-icon {
      width: 60px;
      height: 60px;
      margin-bottom: 20px;
      img { width: 100%; height: 100%; object-fit: contain; }
    }

    h2 { color: #c46043; margin-bottom: 15px; font-size: 1.5rem; }
    p { color: #666; margin-bottom: 20px; line-height: 1.6; }

    .steps {
      list-style: none;
      padding: 0;
      li {
        margin-bottom: 12px;
        font-size: 0.9rem;
        color: #444;
        position: relative;
        padding-left: 20px;
        &::before {
          content: '→';
          position: absolute;
          left: 0;
          color: #c46043;
        }
      }
    }

    .partners-section {
      border-top: 1px dashed #eee;
      padding-top: 20px;

      .partners-list {
        list-style: none;
        padding: 0;
        
        .partner-item {
          display: flex;
          align-items: baseline;
          gap: 8px;
          
          .partner-category {
            white-space: nowrap;
          }
          
          .partner-name {
            color: #c46043;
            text-decoration: none;
            word-break: break-all;
            
            &.hover-underline:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }

  // --- FAQ Section ---
  .faq-section {
    .faq-filters {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;

      .filter-pill {
        background: #f5f5f5;
        border: 1.5px solid #e0e0e0;
        border-radius: 24px;
        padding: 8px 20px;
        font-size: 0.88rem;
        color: #555;
        cursor: pointer;
        transition: all 0.25s;
        font-weight: 500;

        &:hover {
          border-color: #e05a35;
          color: #e05a35;
          background: #fff5f2;
        }

        &.active {
          background: linear-gradient(135deg, #e05a35, #FE8B05);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(224, 90, 53, 0.3);
        }
      }
    }

    .faq-sort-hint {
      font-size: 0.85rem;
      color: #999;
      .sort-icon { margin-right: 4px; }
    }

    .faq-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .faq-item {
      background: #fff;
      border: 1.5px solid #f0f0f0;
      border-radius: 16px;
      margin-bottom: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      overflow: hidden;

      &:hover {
        border-color: #e05a35;
        box-shadow: 0 6px 20px rgba(224, 90, 53, 0.08);
      }

      &.open {
        border-color: #e05a35;
        box-shadow: 0 8px 30px rgba(224, 90, 53, 0.12);
      }

      .faq-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 28px;
        gap: 16px;

        .question {
          color: #333;
          font-size: 1.05rem;
          font-weight: 600;
          margin: 0;
          flex: 1;
          transition: color 0.25s;
        }

        .faq-toggle {
          color: #ccc;
          font-size: 0.75rem;
          transition: transform 0.3s, color 0.3s;
          flex-shrink: 0;

          &.rotated {
            transform: rotate(180deg);
            color: #e05a35;
          }
        }
      }

      &:hover .question,
      &.open .question {
        color: #e05a35;
      }

      .faq-body {
        padding: 0 28px 24px;

        .answer {
          color: #555;
          font-size: 0.95rem;
          line-height: 1.7;
          margin: 0 0 8px;
        }

        .faq-helpful {
          display: inline-block;
          background: #f8f4f2;
          color: #e05a35;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 12px;
        }
      }
    }
  }

  // FAQ expand transition
  .faq-expand-enter-active,
  .faq-expand-leave-active {
    transition: all 0.3s ease;
    max-height: 300px;
    overflow: hidden;
  }
  .faq-expand-enter-from,
  .faq-expand-leave-to {
    max-height: 0;
    opacity: 0;
    padding-top: 0;
    padding-bottom: 0;
  }

  .video-cta-section {
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 30px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.05);
    
    .video-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      width: 100%;

      @media (max-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
      }
      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
      
      .video-card {
        text-decoration: none;
        display: flex;
        flex-direction: column;
        gap: 12px;
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-5px);
          .thumbnail-wrapper .play-overlay {
            opacity: 1;
          }
          .video-title {
            color: #c46043;
          }
        }

        .thumbnail-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 12px;
          overflow: hidden;
          background: #eee;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);

          .thumbnail {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .play-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;

            &::before {
              content: '';
              width: 50px;
              height: 50px;
              background: #c46043;
              border-radius: 50%;
              position: absolute;
            }

            // Play Icon Triangle
            &::after {
              content: '';
              width: 0;
              height: 0;
              border-top: 10px solid transparent;
              border-bottom: 10px solid transparent;
              border-left: 15px solid white;
              position: absolute;
              margin-left: 4px;
            }
          }
        }

        .video-title {
          font-size: 1rem;
          font-weight: 600;
          color: #333;
          line-height: 1.4;
          transition: color 0.3s ease;
        }
      }
    }
  }
}

/* ─── 操作指南 ─── */
.howto-section { max-width: 1100px; margin: 0 auto; padding-inline: 20px; }
.howto-title { font-size: 32px; font-weight: 700; }
.howto-sub { color: #666; font-size: 15px; }
.howto-nav { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.howto-pill {
  display: inline-block; padding: 6px 14px; border: 1px solid #e3d9cf; border-radius: 999px;
  font-size: 13px; color: #555; text-decoration: none; background: #fff; transition: .2s;
}
.howto-pill:hover, .howto-pill.active { border-color: var(--brand-orange, #f0913a); color: var(--brand-orange, #f0913a); }
.howto-pill.active { background: #fff7ee; }
.howto-module { scroll-margin-top: 96px; border-top: 1px solid #efe7de; }
.howto-module:first-of-type { border-top: 0; }
.howto-module-head {
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
  width: 100%; padding: 22px 4px; background: none; border: 0; text-align: left; cursor: pointer;
  font: inherit; color: inherit; border-radius: 10px; transition: background .2s;
}
.howto-module-head:hover { background: #fff7ee; }
.howto-module-head:focus-visible { outline: 2px solid var(--brand-orange, #f0913a); outline-offset: 2px; }
.howto-module-text { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.howto-module-title { font-size: 22px; font-weight: 700; }
.howto-module-summary { color: #555; line-height: 1.6; font-size: 15px; }
.howto-module-meta { display: flex; align-items: center; gap: 14px; flex-shrink: 0; color: #8a7b6b; font-size: 13px; }
.howto-chevron { display: inline-block; font-size: 12px; transition: transform .25s; }
.howto-module.open .howto-chevron { transform: rotate(180deg); }
.howto-module-body { padding: 4px 4px 32px; animation: howtoIn .28s ease-out; }
@keyframes howtoIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .howto-module-body { animation: none; } .howto-chevron { transition: none; } }
.howto-steps { list-style: none; counter-reset: howto; padding: 0; margin: 0; }
.howto-step { counter-increment: howto; position: relative; padding-left: 44px; margin-bottom: 28px; }
.howto-step::before {
  content: counter(howto); position: absolute; left: 0; top: 0;
  width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center;
  background: var(--brand-orange, #f0913a); color: #fff; font-size: 14px; font-weight: 700;
}
.howto-step-title { font-size: 17px; font-weight: 600; margin: 4px 0 6px; }
.howto-step-body { color: #555; line-height: 1.75; margin: 0; }
.howto-shot { margin: 14px 0 0; }
.howto-shot img {
  width: 100%; max-width: 760px; height: auto; display: block;
  border: 1px solid #ece3d9; border-radius: 10px;
}
.howto-tips { margin: 8px 0 0; padding-left: 20px; color: #6b5b4b; font-size: 14px; line-height: 1.8; }
.howto-pending { margin-top: 12px; font-size: 13px; color: #9a8c7c; font-style: italic; }
@media (max-width: 767px) {
  .howto-title { font-size: 24px; }
  .howto-module-title { font-size: 18px; }
  .howto-module-head { padding: 16px 0; gap: 12px; }
  .howto-module-summary { font-size: 14px; }
  .howto-module-count { display: none; }
  .howto-step { padding-left: 36px; }
  .howto-step::before { width: 26px; height: 26px; font-size: 13px; }
}
</style>

<style scoped lang="scss">
@import '../css/utils/variables';
@import '../css/utils/masthead';

// ─── Editorial pass (design/editorial-phase2) ───
.tutorial-page {
  background: $warm-bg-light;
}

.tutorial-page :is(h1, h2, h3, h4) {
  font-family: 'Noto Serif TC', serif;
}

.header-section.ed-mast-block {
  text-align: left;
  @include masthead-block;
  margin-bottom: 44px;

  .ed-mast-kicker {
    @include masthead-kicker;
  }

  .page-title {
    @include masthead-title;
  }

  .subtitle {
    font-size: clamp(1.16rem, 2vw, 1.42rem);
    font-weight: 500;
    line-height: 1.95;
    color: $grey-blue2;
    max-width: 34em;
  }
}

.tutorial-page :is(div[class*="card"], div[class*="faq"], button) {
  border-radius: 0 !important;
}
</style>
