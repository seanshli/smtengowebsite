<template>
  <div class="cd" v-if="caseItem">
    <!-- tile 1 (white): centered title, location and category as one line, back link -->
    <section class="cd-tile cd-tile-white cd-head">
      <div class="cd-wrap cd-center">
        <h1 class="cd-title">{{ getLocaleText(caseItem.title) }}</h1>
        <p class="cd-meta">{{ getLocaleText(caseItem.location) }}, {{ getLocaleText(caseItem.category) }}</p>
        <p class="cd-note">{{ $t('casesHistoryNote') }} <router-link to="/product" class="cd-link">{{ $t('productTitle') }}<span class="cd-chev" aria-hidden="true">›</span></router-link></p>
        <a class="cd-link cd-back" href="/cases" @click.prevent="$router.push('/cases')"><span class="cd-chev-back" aria-hidden="true">‹</span>{{ $t('casesTitle') }}</a>
      </div>
    </section>

    <!-- tile 2 (parchment): the cover photo, then the real-scene gallery.
         The cover shares view-transition-name with the card's photo in cases.vue -->
    <section v-if="caseItem.image || galleryItems.length > 0" class="cd-tile cd-tile-parchment">
      <div class="cd-wrap">
        <figure v-if="caseItem.image" class="cd-cover" :style="{ viewTransitionName: 'case-' + caseItem.id }">
          <img :src="caseItem.image" :alt="getLocaleText(caseItem.title)" />
        </figure>

        <template v-if="galleryItems.length > 0">
          <h2 class="cd-h2 cd-gallery-title">{{ $t('caseRealScene') || '實景照片／影片' }}</h2>
          <div class="cd-gallery">
            <div v-for="(img, index) in galleryItems" :key="index" class="cd-gallery-item">
              <video v-if="isVideo(img)" controls class="cd-media">
                <source :src="img" type="video/mp4" />
              </video>
              <iframe v-else-if="isGoogleDrive(img)" :src="getGoogleDriveEmbedUrl(img)" class="cd-media" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
              <iframe v-else-if="isYouTube(img)" :src="getYouTubeEmbedUrl(img)" class="cd-media" frameborder="0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>
              <img v-else :src="img" :alt="getLocaleText(caseItem.title)" loading="lazy" />
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- tile 3 (white): the details list, one hairline row per block -->
    <section v-if="hasDetails" class="cd-tile cd-tile-white cd-details">
      <div class="cd-wrap">
        <!-- 1. Intro -->
        <div v-if="details.intro" class="cd-row intro">
          <h2 class="cd-h2">{{ $t('caseIntro') || '專案簡介' }}</h2>
          <div class="cd-body"><p>{{ getLocaleText(details.intro) }}</p></div>
        </div>

        <!-- 2. Basic Info -->
        <div v-if="details.basic_info" class="cd-row basic-info">
          <h2 class="cd-h2">{{ $t('caseBasicInfo') || '基本資料' }}</h2>
          <div class="cd-body cd-info-grid">
            <div v-for="(info, index) in details.basic_info" :key="index" class="cd-info">
              <span class="cd-info-label">{{ getLocaleText(info.label) }}</span>
              <span class="cd-info-value">{{ getLocaleText(info.value) }}</span>
            </div>
          </div>
        </div>

        <!-- 3. Needs -->
        <div v-if="details.needs" class="cd-row needs">
          <h2 class="cd-h2">{{ $t('caseNeeds') || '需求分析' }}</h2>
          <div class="cd-body">
            <ul class="cd-list">
              <li v-for="(item, index) in getLocaleList(details.needs)" :key="index">{{ item }}</li>
            </ul>
          </div>
        </div>

        <!-- 4. Solution -->
        <div v-if="details.solution" class="cd-row solution">
          <h2 class="cd-h2">{{ $t('caseSolution') || '解決方案' }}</h2>
          <div class="cd-body"><p class="cd-card">{{ getLocaleText(details.solution) }}</p></div>
        </div>

        <!-- 5. Scope (Hardware/Software) -->
        <div v-if="details.hardware || details.software" class="cd-row specs">
          <h2 class="cd-h2">{{ $t('caseScope') || '施作項目' }}</h2>
          <div class="cd-body cd-specs">
            <div v-if="details.hardware" class="cd-col">
              <h3 class="cd-h3">{{ $t('caseHardware') || '硬體項目' }}</h3>
              <ul class="cd-list">
                <li v-for="(item, index) in getLocaleList(details.hardware)" :key="index">{{ item }}</li>
              </ul>
            </div>
            <div v-if="details.software" class="cd-col">
              <h3 class="cd-h3">{{ $t('caseSoftware') || '軟體項目' }}</h3>
              <ul class="cd-list">
                <li v-for="(item, index) in getLocaleList(details.software)" :key="index">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 6. Features Demo -->
        <div v-if="details.features" class="cd-row features">
          <h2 class="cd-h2">{{ $t('caseFeatures') || '實際功能展示' }}</h2>
          <div class="cd-body">
            <ul class="cd-list">
              <li v-for="(item, index) in getLocaleList(details.features)" :key="index">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div v-else class="cd-notfound">
    Case not found.
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import casesData from '@/data/cases.json'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const caseId = parseInt(route.params.id as string)

const caseItem = computed(() => {
  return (casesData as any[]).find(c => c.id === caseId)
})

const details = computed(() => {
  return caseItem.value?.details || {}
})

const interfaceImages = computed(() => {
  return caseItem.value?.details?.interface_gallery || []
})

const realSceneImages = computed(() => {
  return caseItem.value?.details?.real_scene_gallery || []
})

const combinedGallery = computed(() => {
  return caseItem.value?.details?.gallery || []
})

// one list for the gallery: the combined gallery wins, the real-scene list is the fallback
const galleryItems = computed(() => (combinedGallery.value.length > 0 ? combinedGallery.value : realSceneImages.value))


const hasDetails = computed(() => {
  const d: any = details.value
  return !!(d.intro || d.basic_info || d.needs || d.solution || d.hardware || d.software || d.features)
})

const getLocaleText = (obj: Record<string, string> | any) => {
  if (!obj) return ''
  return obj[locale.value] || obj['en'] || obj['zh'] || ''
}

const getLocaleList = (obj: Record<string, string[]> | any) => {
    if (!obj) return []
    return obj[locale.value] || obj['en'] || obj['zh'] || []
}

const isVideo = (url: string) => {
  if (!url) return false
  const ext = url.split('.').pop()?.toLowerCase()
  return ['mp4', 'webm', 'ogg', 'mov'].includes(ext || '')
}

const isGoogleDrive = (url: string) => {
  if (!url) return false
  return url.includes('drive.google.com')
}

const getGoogleDriveEmbedUrl = (url: string) => {
  if (!url) return ''
  return url.replace(/\/view.*$/, '/preview')
}

const isYouTube = (url: string) => {
  if (!url) return false
  return url.includes('youtube.com') || url.includes('youtu.be')
}

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return ''
  let videoId = ''
  if (url.includes('youtube.com/shorts/')) {
    videoId = url.split('youtube.com/shorts/')[1].split('?')[0]
  } else if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1].split('&')[0]
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0]
  }
  return `https://www.youtube.com/embed/${videoId}`
}

onMounted(() => {
    if (!caseItem.value) {
        // Handle not found
    } else {
        // Update Title for SEO
        const title = getLocaleText(caseItem.value.title)
        if (title) {
            document.title = `${title} | ${t('brandName')}`
        }
    }
})
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

// Apple-profile tiles (DESIGN.md enGo addendum; reference: src/views/index.vue)
.cd { background: #fff; color: $ink; font-family: $display-font; }
.cd a:focus-visible { outline: 2px solid $brand-orange-text; outline-offset: 3px; }
.cd-wrap { max-width: 1240px; margin: 0 auto; padding-inline: clamp(20px, 5vw, 64px); }
.cd-center { text-align: center; }
.cd-tile { padding: clamp(64px, 9vw, 112px) 0; }
.cd-tile-white { background: #fff; }
.cd-tile-parchment { background: $parchment; }
.cd-head { padding-top: clamp(84px, 9vw, 104px); padding-bottom: clamp(48px, 6vw, 72px); }

.cd-title {
  font-family: $display-font; font-weight: 600; letter-spacing: -.03em; line-height: 1.05; color: $ink; margin: 0;
  font-size: clamp(2.4rem, 5.6vw, 4.5rem);
}
.cd-meta { margin: 18px 0 0; font-size: clamp(1.15rem, 1.7vw, 1.5rem); font-weight: 400; line-height: 1.4; letter-spacing: -.005em; color: $ink-80; }
.cd-note { margin: 14px auto 0; max-width: 60ch; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; color: $ink-80; }
.cd-link { color: $brand-orange-text; text-decoration: none; font-size: 1.0625rem; letter-spacing: -.022em; &:hover { text-decoration: underline; } }
.cd-note .cd-link { white-space: nowrap; }
.cd-chev { margin-left: .25em; }
.cd-chev-back { margin-right: .25em; }
.cd-back { display: inline-block; margin-top: 22px; }

// ─── photos: radius 18, no shadow, no overlay ─────────────────────────────
.cd-cover {
  margin: 0; border-radius: 18px; overflow: hidden; background: $tile-dark-2;
  img { display: block; width: 100%; max-height: 640px; object-fit: cover; }
}
.cd-h2 { margin: 0; font-family: $display-font; font-weight: 600; letter-spacing: -.02em; line-height: 1.1; color: $ink; font-size: clamp(1.6rem, 2.6vw, 2.25rem); }
.cd-gallery-title { margin-top: clamp(40px, 6vw, 72px); margin-bottom: clamp(20px, 3vw, 32px); font-size: clamp(2rem, 3.6vw, 3rem); text-align: center; }
.cd-gallery { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; @media (max-width: 1068px) { grid-template-columns: repeat(2, minmax(0, 1fr)); } @media (max-width: 640px) { grid-template-columns: 1fr; } }
.cd-gallery-item {
  border-radius: 18px; overflow: hidden; background: #fff;
  img, video, iframe { display: block; width: 100%; border: 0; }
  img { height: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
  iframe, video { aspect-ratio: 16 / 9; height: auto; }
}

// ─── details list: one hairline row per block, label left, content right ──
.cd-details { padding-top: clamp(48px, 6vw, 80px); }
.cd-row {
  display: grid; grid-template-columns: 1fr 2fr; gap: 16px clamp(24px, 4vw, 64px);
  padding: clamp(28px, 4vw, 44px) 0; border-top: 1px solid $hairline;
  &:first-child { border-top: 0; }
  @media (max-width: 834px) { grid-template-columns: 1fr; }
}
.cd-body p { margin: 0; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; color: $ink; }
.cd-card { background: $parchment; border: 1px solid $hairline; border-radius: 18px; padding: clamp(20px, 3vw, 32px); }
.cd-info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; align-content: start; }
.cd-info { background: $parchment; border: 1px solid $hairline; border-radius: 18px; padding: 20px; display: flex; flex-direction: column; gap: 4px; }
.cd-info-label { font-size: .875rem; line-height: 1.43; color: $ink-80; }
.cd-info-value { font-size: 1.0625rem; font-weight: 600; line-height: 1.47; letter-spacing: -.022em; color: $ink; }
.cd-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 24px 40px; @media (max-width: 640px) { grid-template-columns: 1fr; } }
.cd-h3 { margin: 0 0 12px; font-family: $display-font; font-weight: 600; font-size: 1.3125rem; letter-spacing: -.01em; line-height: 1.25; color: $ink; }
.cd-list {
  list-style: none; padding: 0; margin: 0;
  li {
    position: relative; padding: 12px 0 12px 28px; border-top: 1px solid $hairline;
    font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; color: $ink;
    &:last-child { border-bottom: 1px solid $hairline; }
    &::before { content: '✔'; position: absolute; left: 0; top: 12px; color: $ink-80; font-size: .9em; line-height: 1.6; }
  }
}

.cd-notfound { padding: 160px 20px; text-align: center; font-family: $display-font; font-size: 1.0625rem; color: $ink-80; }
</style>
