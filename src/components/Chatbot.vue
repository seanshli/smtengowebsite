<template>
  <div class="chatbot-container" :class="{ open: isOpen }">
    <div class="chatbot-bubble" @click="toggleChat">
      <img src="/assets/logo.svg" alt="Chat" v-if="!isOpen" />
      <span v-else>✕</span>
    </div>
    
    <div class="chat-window" v-if="isOpen">
      <div class="chat-header">
        <h3>enGo Assistant</h3>
      </div>
      <div class="chat-body" ref="chatBody">
        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
          <div v-if="msg.type === 'video'" class="video-container">
            <div class="text mb-2">{{ msg.text }}</div>
            <iframe :src="msg.mediaUrl" frameborder="0" allowfullscreen></iframe>
          </div>
          <div v-else-if="msg.type === 'catalog'" class="catalog-card">
            <img :src="getImageUrl(msg.data.image)" class="product-img" />
            <h3>{{ msg.data.name }}</h3>
            <p class="description">{{ msg.data.description[locale] || msg.data.description.zh || msg.data.description }}</p>
            <div class="specs-table">
              <div v-for="(val, key) in msg.data.specs" :key="key" class="spec-row">
                <span class="spec-key">{{ key }}</span>
                <span class="spec-val">{{ val }}</span>
              </div>
            </div>
            <img v-if="msg.data.spec_image" :src="getImageUrl(msg.data.spec_image)" class="spec-img" />
          </div>
          <div v-else class="text">{{ msg.text }}</div>
        </div>
      </div>
      <div class="chat-footer">
        <div class="chat-input-area">
          <input 
            v-model="userQuery" 
            @keyup.enter="handleSearch"
            :placeholder="$t('chatbot.inputPlaceholder') || 'Ask me anything...'"
            class="chat-input"
          />
          <button @click="handleSearch" class="send-btn">
            <i class="icon-send">➤</i>
          </button>
        </div>
        <div class="quick-replies" v-if="messages.length < 3">
          <button v-for="key in quickReplyKeys" :key="key" @click="sendQuickReply(key)">
            {{ $t(key) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { useAnalytics } from '@/utils/analytics'
import { useI18n } from 'vue-i18n'
import knowledgeBase from '@/data/knowledge_base.json'

const isOpen = ref(false)
const userQuery = ref('')
const chatBody = ref<HTMLElement | null>(null)
const { trackEvent } = useAnalytics()

const { t, locale } = useI18n()

const messages = ref<Array<{ 
  role: string, 
  text: string, 
  type?: 'text' | 'video' | 'catalog', 
  mediaUrl?: string, 
  data?: any 
}>>([])

// Initialize welcome message
const initWelcome = () => {
  messages.value = [
    { role: 'assistant', text: t('chatbot.welcome') }
  ]
}

onMounted(() => {
  initWelcome()
})

// Watch for language changes to update welcome message and other UI elements
import { watch } from 'vue'
watch(locale, () => {
  // If we only have the welcome message, refresh it
  if (messages.value.length === 1 && messages.value[0].role === 'assistant') {
    messages.value[0].text = t('chatbot.welcome')
  }
})

const quickReplyKeys = ['chatbot.replies.product', 'chatbot.replies.water', 'chatbot.replies.air', 'chatbot.replies.tutorial', 'chatbot.replies.contact']

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    trackEvent('chatbot_open')
    scrollToBottom()
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight
  }
}

const handleSearch = () => {
  if (!userQuery.value.trim()) return
  
  const query = userQuery.value.toLowerCase()
  messages.value.push({ role: 'user', text: userQuery.value })
  trackEvent('chatbot_search', { query })
  
  const currentQuery = userQuery.value
  userQuery.value = ''
  
  setTimeout(() => {
    let bestMatch: any = null
    
    // Simple keyword matching across all categories
    const categories = ['catalog', 'products', 'packages', 'tutorials', 'cases', 'youtube', 'faqs']
    for (const cat of categories) {
      const items = (knowledgeBase as any)[cat]
      if (!items) continue
      for (const item of items) {
        if (item.keywords.some((k: string) => query.includes(k.toLowerCase()))) {
          bestMatch = { ...item, type: cat }
          break
        }
      }
      if (bestMatch) break
    }

    let response = ''
    if (bestMatch) {
      if (bestMatch.type === 'youtube') {
        const videoId = bestMatch.url.split('v=')[1] || bestMatch.url.split('/').pop()
        const embedUrl = `https://www.youtube.com/embed/${videoId}`
        response = `${t('chatbot.found_video')} ${bestMatch.title}\n`
        messages.value.push({ 
          role: 'assistant', 
          text: response,
          type: 'video',
          mediaUrl: embedUrl
        })
      } else if (bestMatch.type === 'catalog') {
        // Detailed catalog product
        messages.value.push({
          role: 'assistant',
          text: '',
          type: 'catalog',
          data: bestMatch
        })
      } else if (bestMatch.type === 'products') {
        const specsLabel = t('chatbot.specs')
        const featuresLabel = t('chatbot.features')
        const name = bestMatch.name[locale.value] || bestMatch.name.zh || bestMatch.name
        const specs = bestMatch.specs[locale.value] || bestMatch.specs.zh || bestMatch.specs
        const features = bestMatch.features[locale.value] || bestMatch.features.zh || bestMatch.features
        
        response = `**${name}**\n\n${specsLabel}: ${specs}\n${featuresLabel}: ${features}`
        if (bestMatch.link) {
          const fullLink = bestMatch.link.startsWith('http') 
            ? bestMatch.link 
            : `${window.location.origin}${bestMatch.link}`
          response += `\n\n${t('chatbot.found_info')}\n${fullLink}`
        }
        messages.value.push({ role: 'assistant', text: response })
      } else if (bestMatch.answer) {
        const lang = locale.value as string
        response = bestMatch.answer[lang] || bestMatch.answer.zh || bestMatch.answer
        messages.value.push({ role: 'assistant', text: response })
      } else if (bestMatch.link) {
        response = t('chatbot.found_info')
        const fullLink = bestMatch.link.startsWith('http') 
          ? bestMatch.link 
          : `${window.location.origin}${bestMatch.link}`
        response += `\n${fullLink}`
        messages.value.push({ role: 'assistant', text: response })
      }
    } else {
      response = t('chatbot.no_match')
      messages.value.push({ role: 'assistant', text: response })
    }

    scrollToBottom()
  }, 800)
}

const sendQuickReply = (key: string) => {
  const userText = t(key)
  userQuery.value = userText
  handleSearch()
}

const getImageUrl = (name: string) => {
  if (!name) return ''
  // Images are in public/images, so they are served from /images/
  return `/images/${name}`
}
</script>

<style scoped lang="scss">
.chatbot-container {
  position: fixed;
  bottom: 30px;
  left: 30px;
  z-index: 9999;

  .chatbot-bubble {
    width: 60px;
    height: 60px;
    background: #c46043;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 10px 25px rgba(196, 96, 67, 0.4);
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    img { width: 35px; height: 35px; filter: brightness(0) invert(1); }
    span { color: white; font-size: 24px; font-weight: bold; }
    &:hover { transform: scale(1.1); }
  }

  .chat-window {
    position: absolute;
    bottom: 80px;
    left: 0;
    width: 320px;
    height: 450px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 15px 50px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: slideUp 0.3s ease-out;
  }

  .chat-header {
    background: #c46043;
    padding: 15px;
    color: white;
    h3 { margin: 0; font-size: 1.1rem; }
  }

  .chat-body {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
    background: #f8f9fa;
    .message {
      margin-bottom: 12px;
      display: flex;
      .text {
        padding: 10px 14px;
        border-radius: 15px;
        font-size: 0.9rem;
        max-width: 85%;
        line-height: 1.5;
        white-space: pre-wrap;
      }
      &.assistant .text { background: white; color: #333; border-bottom-left-radius: 2px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
      
      .catalog-card {
        background: white;
        border-radius: 12px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        max-width: 90%;
        
        .product-img {
          width: 100%;
          border-radius: 8px;
          margin-bottom: 8px;
        }
        
        h3 {
          margin: 0 0 8px 0;
          font-size: 1rem;
          color: #c46043;
        }
        
        .description {
          font-size: 0.85rem;
          margin-bottom: 12px;
          line-height: 1.4;
          color: #555;
        }
        
        .specs-table {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 8px;
          margin-bottom: 8px;
          
          .spec-row {
            display: flex;
            justify-content: space-between;
            font-size: 0.8rem;
            padding: 4px 0;
            border-bottom: 1px solid #eee;
            
            &:last-child { border-bottom: none; }
            
            .spec-key { color: #888; flex: 1; }
            .spec-val { color: #333; flex: 2; text-align: right; }
          }
        }
        
        .spec-img {
          width: 100%;
          border-radius: 8px;
          margin-top: 8px;
        }
      }

      &.user {
        justify-content: flex-end;
        .text { background: #c46043; color: white; border-bottom-right-radius: 2px; }
      }
    }
  }

  .chat-footer {
    padding: 15px;
    background: white;
    border-top: 1px solid #eee;
    
    .chat-input-area {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
      
      .chat-input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 20px;
        font-size: 0.9rem;
        outline: none;
        &:focus { border-color: #c46043; }
      }
      
      .send-btn {
        background: #c46043;
        color: white;
        border: none;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
        &:hover { background: #ab5138; }
      }
    }

    .quick-replies {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      button {
        padding: 6px 12px;
        border: 1px solid #c46043;
        background: transparent;
        color: #c46043;
        border-radius: 20px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s;
        &:hover { background: #c46043; color: white; }
      }
    }
  }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
