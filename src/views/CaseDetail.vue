<template>
  <div class="case-detail-page" v-if="caseItem">
    <div class="header-banner" :style="{ backgroundImage: `url(${caseItem.image})` }">
      <div class="overlay">
        <div class="container">
          <span class="category">{{ getLocaleText(caseItem.category) }}</span>
          <h1 class="title">{{ getLocaleText(caseItem.title) }}</h1>
          <p class="location"><i class="icon-location"></i> {{ getLocaleText(caseItem.location) }}</p>
        </div>
      </div>
    </div>

    <div class="content-container">
      <div class="back-link" @click="$router.push('/cases')">
        <i class="icon-arrow-left"></i> {{ $t('casesTitle') }}
      </div>

      <!-- 1. Intro -->
      <section v-if="details.intro" class="section intro">
        <h2>{{ $t('caseIntro') || '專案簡介' }}</h2>
        <p>{{ getLocaleText(details.intro) }}</p>
      </section>

      <!-- 2. Basic Info -->
      <section v-if="details.basic_info" class="section basic-info">
        <h2>{{ $t('caseBasicInfo') || '基本資料' }}</h2>
        <div class="info-grid">
          <div v-for="(info, index) in details.basic_info" :key="index" class="info-item">
            <span class="label">{{ getLocaleText(info.label) }}</span>
            <span class="value">{{ getLocaleText(info.value) }}</span>
          </div>
        </div>
      </section>

      <!-- 3. Needs -->
      <section v-if="details.needs" class="section needs">
        <h2>{{ $t('caseNeeds') || '需求分析' }}</h2>
        <ul class="d-list">
          <li v-for="(item, index) in getLocaleList(details.needs)" :key="index">{{ item }}</li>
        </ul>
      </section>

      <!-- 4. Solution -->
      <section v-if="details.solution" class="section solution">
        <h2>{{ $t('caseSolution') || '解決方案' }}</h2>
        <p>{{ getLocaleText(details.solution) }}</p>
      </section>

      <!-- 5. Scope (Hardware/Software) -->
      <section v-if="details.hardware || details.software" class="section specs">
        <h2>{{ $t('caseScope') || '施作項目' }}</h2>
        <div class="specs-grid">
          <div v-if="details.hardware" class="col">
            <h3>{{ $t('caseHardware') || '硬體項目' }}</h3>
            <ul class="d-list">
              <li v-for="(item, index) in getLocaleList(details.hardware)" :key="index">{{ item }}</li>
            </ul>
          </div>
          <div v-if="details.software" class="col">
            <h3>{{ $t('caseSoftware') || '軟體項目' }}</h3>
            <ul class="d-list">
              <li v-for="(item, index) in getLocaleList(details.software)" :key="index">{{ item }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 6. Features Demo -->
      <section v-if="details.features" class="section features">
        <h2>{{ $t('caseFeatures') || '實際功能展示' }}</h2>
        <ul class="d-list">
          <li v-for="(item, index) in getLocaleList(details.features)" :key="index">{{ item }}</li>
        </ul>
      </section>

      <!-- Gallery Section (Combined) -->
      <section v-if="combinedGallery.length > 0" class="section gallery">
        <h2>{{ $t('caseRealScene') || '實景照片／影片' }}</h2>
        <div class="gallery-grid">
          <div v-for="(img, index) in combinedGallery" :key="index" class="gallery-item">
             <video v-if="isVideo(img)" controls class="gallery-video">
                <source :src="img" type="video/mp4" />
             </video>
             <iframe v-else-if="isGoogleDrive(img)" :src="getGoogleDriveEmbedUrl(img)" class="gallery-iframe" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
             <img v-else :src="img" alt="Gallery Image" />
          </div>
        </div>
      </section>


      <!-- 6. Real Scene Gallery (only if separate from combined gallery) -->
      <section v-if="realSceneImages.length > 0 && combinedGallery.length === 0" class="section gallery">
        <h2>{{ $t('caseRealScene') || '實景照片／影片' }}</h2>
        <div class="gallery-grid">
          <div v-for="(img, index) in realSceneImages" :key="index" class="gallery-item">
             <video v-if="isVideo(img)" controls class="gallery-video">
                <source :src="img" type="video/mp4" />
             </video>
             <iframe v-else-if="isGoogleDrive(img)" :src="getGoogleDriveEmbedUrl(img)" class="gallery-iframe" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
             <img v-else :src="img" alt="Real Scene" />
          </div>
        </div>
      </section>

    </div>
  </div>
  <div v-else class="not-found">
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
const { locale } = useI18n()
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
  return ['mp4', 'webm', 'ogg'].includes(ext || '')
}

const isGoogleDrive = (url: string) => {
  if (!url) return false
  return url.includes('drive.google.com')
}

const getGoogleDriveEmbedUrl = (url: string) => {
  if (!url) return ''
  return url.replace(/\/view.*$/, '/preview')
}

onMounted(() => {
    if (!caseItem.value) {
        // Handle not found
    } else {
        // Update Title for SEO
        const title = getLocaleText(caseItem.value.title)
        if (title) {
            document.title = `${title} | enGo 智管家`
        }
    }
})
</script>

<style scoped lang="scss">
.case-detail-page {
  padding-bottom: 100px;
  
  .header-banner {
    height: 60vh;
    min-height: 400px;
    background-size: cover;
    background-position: center;
    position: relative;
    
    .overlay {
      background: rgba(0,0,0,0.4);
      height: 100%;
      display: flex;
      align-items: flex-end;
      padding-bottom: 60px;
      
      .container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 0 20px;
        color: white;
        
        .category {
          background: #c46043;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .title {
          font-size: 3rem;
          margin: 15px 0;
          font-weight: 700;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
          @media(max-width: 768px) { font-size: 2rem; }
        }
        
        .location {
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          gap: 5px;
          opacity: 0.9;
        }
      }
    }
  }

  .content-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 20px;
    
    .back-link {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #666;
      margin-bottom: 40px;
      font-weight: 500;
      transition: color 0.3s;
      &:hover { color: #c46043; }
    }
    
    .section {
      margin-bottom: 60px;
      
      h2 {
        font-size: 1.8rem;
        color: #333;
        margin-bottom: 25px;
        padding-left: 15px;
        border-left: 4px solid #c46043;
      }
      
      p {
        font-size: 1.1rem;
        line-height: 1.8;
        color: #555;
      }
    }
    
    .basic-info {
      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
        
        .info-item {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 10px;
          
          .label { display: block; font-size: 0.9rem; color: #888; margin-bottom: 5px; }
          .value { display: block; font-size: 1.1rem; color: #333; font-weight: 600; }
        }
      }
    }
    
    .specs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      @media(max-width: 768px) { grid-template-columns: 1fr; gap: 20px; }
      
      h3 { font-size: 1.4rem; color: #444; margin-bottom: 20px; font-weight: 600; }
    }
    
    .d-list {
      list-style: none;
      padding: 0;
      li {
        position: relative;
        padding-left: 30px;
        margin-bottom: 15px;
        font-size: 1.1rem;
        line-height: 1.6;
        color: #555;
        &:before {
          content: "✔";
          color: #c46043;
          position: absolute;
          left: 0;
          font-size: 1.2rem;
          line-height: 1.5;
        }
      }
    }
    
    .solution {
        background: #fdfdfd;
        padding: 40px;
        border-radius: 20px;
        border: 1px solid #f0f0f0;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      .gallery-item {
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        img, video, iframe { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          display: block; 
          border: none;
        }
        iframe, video {
          aspect-ratio: 16 / 9;
          height: auto;
        }
      }
    }
  }
}
</style>
