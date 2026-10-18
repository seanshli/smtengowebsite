<template>
  <div class="tt">
    <!-- tile 1 (white): page title, lead, the three persona cards -->
    <section class="tt-tile tt-tile-white tt-head">
      <div class="tt-wrap">
        <header class="tt-masthead tt-center">
          <h1 class="tt-title">{{ $t('tutorialTitle') }}</h1>
          <p class="tt-lede">{{ $t('tutorialSubtitle') }}</p>
        </header>

        <div class="tutorial-grid">
          <div v-for="item in tutorials" :key="item.id" class="tutorial-card" @click="handleCardClick(item)">
            <h2 class="tutorial-card-title">{{ (item.title as any)[locale] || item.title['zh'] }}</h2>
            <p class="tutorial-card-desc">{{ (item.description as any)[locale] || item.description['zh'] }}</p>
            <ul v-if="item.steps" class="steps">
              <li v-for="(step, index) in item.steps" :key="index">
                <strong>{{ (step.title as any)[locale] || (step.title as any)['zh'] }}</strong>:
                <span v-html="renderStepContent((step.content as any)[locale] || (step.content as any)['zh'])" @click="handleLinkClick"></span>
              </li>
            </ul>

            <div v-if="item.partners && item.partners.length > 0" class="partners-section">
              <h3 class="partners-title">{{ $t('ourPartners') }}</h3>
              <ul class="partners-list">
                <li v-for="(partner, pIdx) in item.partners" :key="pIdx" class="partner-item">
                  <span class="partner-category">{{ (partner.category as any)[locale] || (partner.category as any)['zh'] }}: </span>
                  <a :href="partner.url" target="_blank" rel="noopener" class="partner-name" @click.stop>
                    {{ (partner.name as any)[locale] || (partner.name as any)['zh'] }}<span class="tt-chev" aria-hidden="true">›</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── 操作指南（依功能模組）(tile 2, parchment) ───
         每個模組帶 id="howto-<模組>"，供 FAQ 與 chatbot 的 /tutorial#howto-xxx 深連結落點。
         內容來自 src/data/howto.json，截圖為 enGo 3.2.2（489）實機擷取。 -->
    <section id="howto" class="tt-tile tt-tile-parchment howto-section">
      <div class="tt-wrap">
        <header class="tt-head-block tt-center">
          <h2 class="tt-h2">{{ howtoHeading }}</h2>
          <p class="tt-lead">{{ howtoSubheading }}</p>
        </header>

        <nav class="howto-nav" aria-label="module index">
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
        <div class="howto-list">
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
                  <h3 class="howto-step-title">{{ pick(st.title) }}</h3>
                  <p class="howto-step-body">{{ pick(st.body) }}</p>
                  <figure v-if="st.image" class="howto-shot" :class="isPhoneShot(st.image) ? 'howto-shot-phone' : 'howto-shot-tablet'">
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
      </div>
    </section>

    <!-- anchor target for the 常見問題 links in the header and footer (tile 3, white) -->
    <section id="faq" class="tt-tile tt-tile-white faq-section">
      <div class="tt-wrap">
        <header class="tt-head-block tt-center">
          <h2 class="tt-h2">{{ $t('faqTitle') }}</h2>
        </header>

        <!-- Category filter pills -->
        <div class="faq-filters">
          <button
            v-for="cat in faqCategories"
            :key="cat.key"
            type="button"
            class="filter-pill"
            :class="{ active: activeFaqFilter === cat.key }"
            @click="activeFaqFilter = cat.key"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- Popularity badge -->
        <p class="faq-sort-hint" v-if="false">
          <span class="sort-icon">&#x1F525;</span> {{ faqSortLabel }}
        </p>

        <!-- "全部" shows the 41 questions grouped by category, each group folded
             except the first, so the page reads as ten headings instead of one
             forty-item list (design review 2026-09-22). A category chip shows a flat list. -->
        <div v-if="activeFaqFilter === 'all'" class="faq-groups">
          <section v-for="g in faqGroups" :key="g.key" class="faq-group" :class="{ open: openFaqGroups.has(g.key) }">
            <button type="button" class="faq-group-head" :aria-expanded="openFaqGroups.has(g.key) ? 'true' : 'false'" @click="toggleFaqGroup(g.key)">
              <span class="faq-group-title">{{ g.label }}</span>
              <span class="faq-group-meta"><span class="faq-group-count">{{ g.items.length }}</span><span class="faq-group-chevron" aria-hidden="true">&#x25BC;</span></span>
            </button>
            <div v-if="openFaqGroups.has(g.key)" class="faq-container">
              <div v-for="faq in g.items" :key="faq.id" class="faq-item" :class="{ open: openFaqId === faq.id }" @click="toggleFaq(faq)">
                <div class="faq-header">
                  <h3 class="question">Q: {{ (faq.question as any)[locale] || (faq.question as any)['zh'] }}</h3>
                  <span class="faq-toggle" :class="{ rotated: openFaqId === faq.id }">&#x25BC;</span>
                </div>
                <transition name="faq-expand">
                  <div v-if="openFaqId === faq.id" class="faq-body">
                    <p class="answer" @click="handleLinkClick" v-html="'A: ' + renderStepContent((faq.answer as any)[locale] || (faq.answer as any)['zh'])"></p>
                  </div>
                </transition>
              </div>
            </div>
          </section>
        </div>

        <div v-else class="faq-container">
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
    </section>

    <!-- tile 4 (dark): video guides -->
    <section class="tt-tile tt-tile-dark video-cta-section">
      <div class="tt-wrap tt-center">
        <h2 class="tt-h2">{{ $t('watchTutorials') }}</h2>
        <p class="tt-lead">{{ $t('videoGuideDesc') }}</p>

        <div class="video-grid">
          <a
            v-for="(video, idx) in youtubeVideos"
            :key="idx"
            :href="video.url"
            target="_blank"
            rel="noopener"
            class="video-card"
          >
            <div class="thumbnail-wrapper">
              <img :src="getYoutubeThumbnail(video.url)" :alt="video.title" class="thumbnail" loading="lazy" />
              <div class="play-overlay">
                <i class="icon-play"></i>
              </div>
            </div>
            <span class="video-title">{{ video.title }}</span>
          </a>
        </div>
      </div>
    </section>
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

// Grouped view for "all": category order follows faqCategoryMap, items sorted by
// popularity inside each group. First group open by default; the rest fold.
const openFaqGroups = ref<Set<string>>(new Set())
const faqGroups = computed(() => {
  const byClicks = (a: any, b: any) => (faqClicks.value[b.id] || 0) - (faqClicks.value[a.id] || 0)
  return Object.keys(faqCategoryMap)
    .filter((k) => k !== 'all')
    .map((key) => ({ key, label: faqCategoryMap[key][locale.value] || key, items: faqs.value.filter((f: any) => f.category === key).sort(byClicks) }))
    .filter((g) => g.items.length)
})
watch(faqGroups, (groups) => { if (!openFaqGroups.value.size && groups.length) openFaqGroups.value = new Set([groups[0].key]) }, { immediate: true })
const toggleFaqGroup = (key: string) => {
  const next = new Set(openFaqGroups.value)
  if (next.has(key)) next.delete(key); else next.add(key)
  openFaqGroups.value = next
  trackEvent('faq_group_toggle', { category: key, open: next.has(key) })
}

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

// Phone captures (800x1731) sit in a phone body, the 2000x1200 tablet captures in a tablet body.
const isPhoneShot = (src: string) => /\/devicedata\/|\/04-device-page\./.test(src)

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
@import '../css/utils/variables';

// Apple-profile tiles (DESIGN.md enGo addendum; reference: src/views/index.vue)
.tt { background: #fff; color: $ink; font-family: $display-font; }
.tt a:focus-visible, .tt button:focus-visible, .tt .tutorial-card:focus-visible { outline: 2px solid $brand-orange-text; outline-offset: 3px; }
.tt-tile-dark a:focus-visible, .tt-tile-dark button:focus-visible { outline-color: $orange2; }
.tt-wrap { max-width: 1240px; margin: 0 auto; padding-inline: clamp(20px, 5vw, 64px); }
.tt-center { text-align: center; }
.tt-tile { padding: clamp(64px, 9vw, 112px) 0; }
.tt-tile-white { background: #fff; color: $ink; }
.tt-tile-parchment { background: $parchment; color: $ink; }
.tt-tile-dark { background: $tile-dark; color: #fff; .tt-h2 { color: #fff; } .tt-lead { color: $on-dark-muted; } }
.tt-chev { margin-left: .25em; }

// ─── type ladder ──────────────────────────────────────────────────────────
.tt-head { padding-top: clamp(84px, 9vw, 104px); }
.tt-masthead { margin-bottom: clamp(40px, 6vw, 72px); }
.tt-title {
  font-family: $display-font; font-weight: 600; letter-spacing: -.03em; line-height: 1.05; color: $ink; margin: 0;
  font-size: clamp(2.6rem, 6.4vw, 5rem);
}
.tt-lede { font-size: clamp(1.2rem, 1.9vw, 1.6rem); font-weight: 300; line-height: 1.4; color: $ink; max-width: 30em; margin: 18px auto 0; }
.tt-h2 { font-family: $display-font; font-weight: 600; letter-spacing: -.02em; line-height: 1.1; margin: 0; color: inherit; font-size: clamp(2rem, 3.6vw, 3rem); }
.tt-lead { font-size: clamp(1.15rem, 1.7vw, 1.5rem); font-weight: 400; line-height: 1.4; letter-spacing: -.005em; color: $ink; margin: 14px auto 0; max-width: 34em; }
.tt-head-block { margin-bottom: clamp(28px, 4vw, 48px); }

:deep(.step-link) {
  color: $brand-orange-text; text-decoration: none; cursor: pointer;
  &:hover { text-decoration: underline; }
}

// ─── persona cards: parchment, hairline, radius 18, no shadow ─────────────
.tutorial-grid {
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; align-items: start;
  // three personas, three weights: the owner card leads (design review 2026-09-22)
  @media (min-width: 1069px) { grid-template-columns: 1.35fr 1fr 1fr; }
  @media (max-width: 1068px) { grid-template-columns: 1fr 1fr; .tutorial-card:first-child { grid-column: 1 / -1; } }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
}
.tutorial-card {
  background: $parchment; border: 1px solid $hairline; border-radius: 18px; padding: clamp(24px, 3vw, 36px); cursor: pointer;
}
.tutorial-card-title { margin: 0 0 12px; font-family: $display-font; font-weight: 600; font-size: 1.75rem; line-height: 1.15; letter-spacing: -.02em; color: $ink; }
.tutorial-card-desc { margin: 0 0 20px; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; color: $ink-80; }
.steps {
  list-style: none; padding: 0; margin: 0;
  li { padding: 12px 0; border-top: 1px solid $hairline; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; color: $ink; strong { font-weight: 600; } }
}
.partners-section { margin-top: 24px; padding-top: 20px; border-top: 1px solid $hairline; }
.partners-title { margin: 0 0 12px; font-family: $display-font; font-weight: 600; font-size: 1.3125rem; letter-spacing: -.01em; color: $ink; }
.partners-list {
  list-style: none; padding: 0; margin: 0;
  .partner-item { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 8px; padding: 8px 0; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; }
  .partner-category { color: $ink-80; white-space: nowrap; }
  .partner-name { color: $brand-orange-text; text-decoration: none; word-break: break-all; &:hover { text-decoration: underline; } }
}

// ─── 操作指南 ─────────────────────────────────────────────────────────────
.howto-nav { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-bottom: clamp(32px, 5vw, 56px); }
.howto-pill {
  display: inline-flex; align-items: center; min-height: 44px; padding: 10px 20px; border: 1px solid $brand-orange-text; border-radius: 9999px;
  font-size: 1.0625rem; letter-spacing: -.022em; color: $brand-orange-text; text-decoration: none; background: transparent;
  transition: transform .15s ease, background .2s ease;
  &:active { transform: scale(.95); }
  &:hover { background: rgba($brand-orange, .06); }
  &.active { background: $brand-orange-text; color: #fff; }
}
.howto-list { max-width: 980px; margin: 0 auto; }
.howto-module { scroll-margin-top: 96px; border-top: 1px solid $hairline; &:first-of-type { border-top: 0; } &:last-of-type { border-bottom: 1px solid $hairline; } }
.howto-module-head {
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
  width: 100%; padding: 24px 0; background: none; border: 0; text-align: left; cursor: pointer;
  font: inherit; color: inherit; border-radius: 18px;
}
.howto-module-text { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.howto-module-title { font-size: 1.5rem; font-weight: 600; line-height: 1.2; letter-spacing: -.02em; color: $ink; }
.howto-module-summary { color: $ink-80; line-height: 1.47; font-size: 1.0625rem; letter-spacing: -.022em; }
.howto-module-meta { display: flex; align-items: center; gap: 14px; flex-shrink: 0; color: $ink-80; font-size: .875rem; }
.howto-chevron { display: inline-block; font-size: 12px; color: $brand-orange-text; transition: transform .25s; }
.howto-module.open .howto-chevron { transform: rotate(180deg); }
.howto-module-body { padding: 4px 0 40px; animation: howtoIn .28s ease-out; }
@keyframes howtoIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .howto-module-body { animation: none; } .howto-chevron, .howto-pill, .filter-pill { transition: none; } }
.howto-steps { list-style: none; counter-reset: howto; padding: 0; margin: 0; }
.howto-step { counter-increment: howto; margin-bottom: clamp(32px, 5vw, 48px); }
.howto-step-title { margin: 0 0 6px; font-family: $display-font; font-size: 1.3125rem; font-weight: 600; letter-spacing: -.01em; line-height: 1.25; color: $ink; &::before { content: counter(howto) '.'; margin-right: .5em; color: $ink-80; } }
.howto-step-body { color: $ink; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; margin: 0; }

// device frames: brushed titanium body (same mixin as the homepage) + the single product shadow
@mixin metal-frame($radius, $pad, $glass, $screen-radius) {
  position: relative; border-radius: $radius; padding: $pad;
  background:
    repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0 1px, transparent 1px 3px),
    linear-gradient(135deg, #f4f6f8 0%, #c4cad2 16%, #e6e9ed 34%, #adb5bf 52%, #dde1e6 70%, #b6bdc6 86%, #eef1f4 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.95), inset 0 -1px 0 rgba(15,23,32,.28), $product-shadow;
  img { display: block; width: 100%; height: auto; border-radius: $screen-radius; box-shadow: 0 0 0 $glass #0c1219, 0 0 0 ($glass + 1px) rgba(255,255,255,.12); }
}
.howto-shot { margin: 18px 0 0; }
.howto-shot-tablet { @include metal-frame(22px, 12px, 6px, 10px); max-width: 760px; img { aspect-ratio: 2000 / 1200; object-fit: cover; object-position: top; } }
.howto-shot-phone { @include metal-frame(40px, 10px, 5px, 28px); width: min(260px, 70%); img { aspect-ratio: 800 / 1731; } }
.howto-tips { margin: 8px 0 0; padding-left: 20px; color: $ink-80; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; }
.howto-pending { margin-top: 12px; font-size: .875rem; color: $ink-80; }
@media (max-width: 640px) {
  .howto-module-title { font-size: 1.25rem; }
  .howto-module-head { padding: 18px 0; gap: 12px; }
  .howto-module-count { display: none; }
}

// ─── FAQ ──────────────────────────────────────────────────────────────────
.faq-filters { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-bottom: clamp(28px, 4vw, 44px); }
.filter-pill {
  min-height: 44px; background: transparent; border: 1px solid $brand-orange-text; border-radius: 9999px; padding: 10px 20px;
  font: inherit; font-size: 1.0625rem; letter-spacing: -.022em; color: $brand-orange-text; cursor: pointer;
  transition: transform .15s ease, background .2s ease;
  &:active { transform: scale(.95); }
  &:hover { background: rgba($brand-orange, .06); }
  &.active { background: $brand-orange-text; color: #fff; }
}
.faq-sort-hint { text-align: center; font-size: .875rem; color: $ink-80; .sort-icon { margin-right: 4px; } }
.faq-container { max-width: 800px; margin: 0 auto; }
.faq-groups { max-width: 800px; margin: 0 auto; }
.faq-group { border-top: 1px solid $hairline; &:first-child { border-top: 0; } }
.faq-group-head {
  width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px;
  padding: 20px 0; background: none; border: 0; cursor: pointer; font: inherit; color: inherit; text-align: left;
  border-radius: 18px;
}
.faq-group-title { font-family: $display-font; font-weight: 600; font-size: 1.5rem; letter-spacing: -.02em; color: $ink; }
.faq-group-meta { display: flex; align-items: center; gap: 12px; color: $ink-80; font-size: .875rem; }
.faq-group-count { min-width: 28px; height: 28px; padding: 0 8px; display: inline-grid; place-items: center; border-radius: 9999px; background: $parchment; font-weight: 600; color: $ink; }
.faq-group-chevron { font-size: 12px; color: $brand-orange-text; transition: transform .25s; }
.faq-group.open .faq-group-chevron { transform: rotate(180deg); }
.faq-group .faq-container { padding: 4px 0 20px; }
@media (prefers-reduced-motion: reduce) { .faq-group-chevron { transition: none; } }

.faq-item {
  background: $parchment; border: 1px solid $hairline; border-radius: 18px; margin-bottom: 12px; cursor: pointer; overflow: hidden;
  .faq-header {
    display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; gap: 16px;
    .question { color: $ink; font-size: 1.0625rem; font-weight: 600; letter-spacing: -.022em; line-height: 1.47; margin: 0; flex: 1; }
    .faq-toggle { color: $ink-80; font-size: .75rem; transition: transform .3s; flex-shrink: 0; &.rotated { transform: rotate(180deg); color: $brand-orange-text; } }
  }
  .faq-body {
    padding: 0 24px 22px;
    .answer { color: $ink; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; margin: 0 0 8px; }
    .faq-helpful { display: inline-block; color: $ink-80; font-size: .875rem; }
  }
}
// FAQ expand transition
.faq-expand-enter-active, .faq-expand-leave-active { transition: max-height .3s ease, opacity .3s ease; max-height: 300px; overflow: hidden; }
.faq-expand-enter-from, .faq-expand-leave-to { max-height: 0; opacity: 0; }

// ─── video guides (dark tile) ─────────────────────────────────────────────
.video-grid {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; width: 100%; margin-top: clamp(32px, 5vw, 56px); text-align: left;
  @media (max-width: 1068px) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  @media (max-width: 834px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
}
.video-card {
  text-decoration: none; display: flex; flex-direction: column; gap: 12px; color: #fff;
  &:hover { .play-overlay { opacity: 1; } .video-title { color: $orange2; } }
  .thumbnail-wrapper {
    position: relative; width: 100%; aspect-ratio: 1 / 1; border-radius: 18px; overflow: hidden; background: $tile-dark-2;
    .thumbnail { width: 100%; height: 100%; object-fit: cover; display: block; }
    .play-overlay {
      position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity .2s ease;
      &::before { content: ''; width: 56px; height: 56px; background: #fff; border-radius: 50%; position: absolute; }
      &::after { content: ''; width: 0; height: 0; border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-left: 15px solid $ink; position: absolute; margin-left: 4px; }
    }
  }
  .video-title { font-size: 1.0625rem; font-weight: 600; letter-spacing: -.022em; color: #fff; line-height: 1.4; transition: color .2s ease; }
}
@media (prefers-reduced-motion: reduce) { .video-card .play-overlay, .video-card .video-title { transition: none; } }
</style>
