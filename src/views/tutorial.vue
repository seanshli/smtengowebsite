<template>
  <div class="tutorial-page">
    <div class="header-section">
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
    <div class="faq-section py-80 py-mob-40">
      <h2 class="faq-title tac mb-50">{{ $t('faqTitle') }}</h2>
      <div class="faq-container">
        <div v-for="faq in faqs" :key="faq.id" class="faq-item mb-30 p-32 bg-white shadow-sm border-radius-20 border-1">
          <h3 class="question text-brand-orange mb-12 fw-700 fz-20">Q: {{ (faq.question as any)[locale] || (faq.question as any)['zh'] }}</h3>
          <p class="answer text-grey-333 fz-16 lh-24">A: {{ (faq.answer as any)[locale] || (faq.answer as any)['zh'] }}</p>

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
import { ref } from 'vue'
import { useAnalytics } from '@/utils/analytics'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const tutorials = ref(tutorialsData)
const faqs = ref(faqsData)
const youtubeVideos = ref(knowledgeBaseData.youtube)
const { trackEvent } = useAnalytics()
const { locale } = useI18n()
const router = useRouter()

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
  return text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="step-link">$1</a>')
}

const handleLinkClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('/')) {
    e.preventDefault()
    e.stopPropagation()
    const href = target.getAttribute('href')!
    const [path, query] = href.split('?')
    const queryObj: any = {}
    if (query) {
      query.split('&').forEach(q => {
        const [k, v] = q.split('=')
        queryObj[k] = v
      })
    }
    router.push({ path, query: queryObj })
  }
}
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
</style>
