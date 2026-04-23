<template>
  <div class="chatbot-container" :class="{ open: isOpen }">
    <div class="chatbot-bubble" @click="toggleChat">
      <img src="/assets/logo.svg" alt="Chat" v-if="!isOpen" />
      <span v-else>✕</span>
    </div>

    <div class="chat-window" v-if="isOpen">
      <div class="chat-header">
        <div class="chat-header-content">
          <div class="chat-header-icon">
            <img src="/assets/logo.svg" alt="enGo" />
          </div>
          <div>
            <h3>enGo 小精靈</h3>
            <span class="chat-header-status">{{ $t('chatbot.online') || 'Online' }}</span>
          </div>
        </div>
      </div>
      <div class="chat-body" ref="chatBody">
        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
          <div v-if="msg.type === 'video'" class="video-container">
            <div class="text mb-2" v-html="formatMessage(msg.text)"></div>
            <iframe :src="msg.mediaUrl" frameborder="0" allowfullscreen></iframe>
          </div>
          <div v-else-if="msg.type === 'catalog'" class="catalog-card">
            <img :src="getImageUrl(msg.data.image)" class="product-img" :alt="msg.data.name || 'Product image'" />
            <h3>{{ msg.data.name }}</h3>
            <p class="description">{{ msg.data.description[locale] || msg.data.description.zh || msg.data.description }}</p>
            <div class="specs-table">
              <div v-for="(val, key) in msg.data.specs" :key="key" class="spec-row">
                <span class="spec-key">{{ key }}</span>
                <span class="spec-val">{{ val }}</span>
              </div>
            </div>
            <img v-if="msg.data.spec_image" :src="getImageUrl(msg.data.spec_image)" class="spec-img" :alt="(msg.data.name || 'Product') + ' specifications'" />
          </div>
          <div v-if="msg.type === 'handover'" class="handover-container">
            <div class="text mb-2" v-html="formatMessage(msg.text)"></div>
            <button @click="jumpToLine" class="line-handoff-btn">
              <img src="/images/link_Line.png" alt="LINE" />
              {{ $t('chatbot.line_handoff') }}
            </button>
          </div>
          <div v-else class="text" v-html="formatMessage(msg.text)"></div>
        </div>
        <div v-if="isTyping" class="message assistant">
          <div class="text typing-indicator">
            <span></span><span></span><span></span>
          </div>
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
const isTyping = ref(false)
const { trackEvent } = useAnalytics()

const { t, locale } = useI18n()

const messages = ref<Array<{
  role: string,
  text: string,
  type?: 'text' | 'video' | 'catalog' | 'handover',
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

const quickReplyKeys = [
  'chatbot.replies.product',
  'chatbot.replies.water',
  'chatbot.replies.air',
  'chatbot.replies.tutorial',
  'chatbot.replies.contact',
  'chatbot.replies.showroom',
  'chatbot.replies.pricing'
]

const jumpToLine = () => {
  trackEvent('chatbot_line_handoff')
  window.open('https://lin.ee/THIUSjW')
}

const formatMessage = (text: string) => {
  if (!text) return ''
  return text
    .replace(/\n/g, '<br/>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #e05a35; font-weight: bold; text-decoration: underline;">$1</a>')
}

const logQuery = async (keyword: string, matchFound: boolean) => {
  try {
    await fetch('/api/chatbot-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keyword,
        locale: locale.value,
        matchFound
      })
    })
  } catch (err) {
    console.error('Failed to log chatbot query:', err)
  }
}

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

// --- Intent matching helpers ---------------------------------------------
// Synonyms: maps common user phrasings to canonical KB keywords. Keeps the
// KB keyword arrays lean while still catching how real people actually ask.
const SYNONYMS: Record<string, string[]> = {
  // Pricing
  '多少錢': ['價格', '費用', 'price'],
  '多少': ['價格', 'price'],
  '費用': ['價格', 'pricing'],
  '報價': ['價格', 'quote'],
  'cost': ['price', 'pricing'],
  'how much': ['price', 'cost'],
  'cuanto': ['price', 'precio'],
  // Hours
  '幾點': ['hours', '時間', '營業'],
  '開門': ['營業', 'open', 'hours'],
  '什麼時候': ['when', 'hours'],
  'when open': ['hours', 'open'],
  // Location
  '怎麼去': ['address', '地址'],
  '在哪': ['address', '地址', 'location'],
  '怎麼走': ['address', '地址'],
  // LINE
  '加好友': ['line', 'add'],
  '加line': ['line', 'add', '好友'],
  '加入line': ['line'],
  // Product discovery
  '買什麼': ['product', 'packages'],
  '有什麼產品': ['product', 'catalog'],
  '推薦': ['product', 'packages', 'recommend'],
  // Contact
  '找人': ['contact', '客服'],
  '怎麼聯絡': ['contact', '聯絡'],
  'reach you': ['contact'],
}

// Normalize a query: lowercase, strip punctuation, collapse whitespace,
// convert full-width digits to half-width.
const normalizeQuery = (q: string): string => {
  return q
    .toLowerCase()
    .replace(/[？?！!，,。、；;：:()\[\]【】「」『』"'`~]/g, ' ')
    .replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xFEE0))
    .replace(/\s+/g, ' ')
    .trim()
}

// Expand a query with synonyms: appends canonical terms so downstream matching
// can find KB entries keyed on the canonical form.
const expandQuery = (q: string): string => {
  let expanded = q
  for (const [phrase, canon] of Object.entries(SYNONYMS)) {
    if (q.includes(phrase.toLowerCase())) {
      expanded += ' ' + canon.join(' ')
    }
  }
  return expanded
}

// Score an item against a (normalized+expanded) query. Longer keywords score
// higher — they're more specific. Also score weak reverse match (keyword
// contains a short query) at lower weight.
const scoreItem = (query: string, keywords: string[]): number => {
  let score = 0
  for (const k of keywords) {
    const kw = k.toLowerCase()
    if (!kw) continue
    if (query.includes(kw)) {
      // Longer keyword = more specific hit. Clamp so single-char words still
      // score something but can't dominate.
      score += Math.max(2, Math.min(kw.length, 12))
    } else if (kw.length >= 4 && query.length >= 2 && kw.includes(query)) {
      // Reverse partial match for short user queries like "line"
      score += 1
    }
  }
  return score
}

const handleSearch = () => {
  if (!userQuery.value.trim()) return

  const rawQuery = userQuery.value
  const normalized = normalizeQuery(rawQuery)
  const query = expandQuery(normalized)

  messages.value.push({ role: 'user', text: rawQuery })
  trackEvent('chatbot_search', { query: rawQuery })

  const currentQuery = rawQuery
  userQuery.value = ''

  // Show typing indicator
  isTyping.value = true
  scrollToBottom()

  setTimeout(() => {
    isTyping.value = false

    // Score every item across every category — gather the top-K so we can
    // optionally render more than one when a user asks a compound question
    // like "營業時間跟地址".
    const scored: Array<{ item: any; cat: string; score: number }> = []
    const categories = ['general', 'catalog', 'products', 'packages', 'tutorials', 'cases', 'youtube', 'faqs']
    for (const cat of categories) {
      const items = (knowledgeBase as any)[cat]
      if (!items) continue
      for (const item of items) {
        const score = scoreItem(query, item.keywords || [])
        if (score > 0) scored.push({ item, cat, score })
      }
    }
    scored.sort((a, b) => b.score - a.score)

    const bestMatch: any = scored.length > 0
      ? { ...scored[0].item, type: scored[0].cat }
      : null

    // Compound-intent: if the 2nd match is from a *different* entry id and
    // scores within ~40% of the top, and both are text-answer types, stitch
    // their answers together. Keeps lookups useful for "hours + address" etc.
    let secondMatch: any = null
    if (
      scored.length > 1 &&
      scored[1].item.id !== scored[0].item.id &&
      scored[1].score >= scored[0].score * 0.6 &&
      scored[0].item.answer &&
      scored[1].item.answer
    ) {
      secondMatch = { ...scored[1].item, type: scored[1].cat }
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
        // Compound intent: append the second answer so "hours and address"
        // returns both in one message.
        if (secondMatch && secondMatch.answer) {
          const second = secondMatch.answer[lang] || secondMatch.answer.zh || secondMatch.answer
          response += '\n\n---\n\n' + second
        }
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
      messages.value.push({
        role: 'assistant',
        text: response,
        type: 'handover'
      })
    }

    logQuery(currentQuery, !!bestMatch)
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
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #e05a35 0%, #FE8B05 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 8px 30px rgba(224, 90, 53, 0.45), 0 0 0 0 rgba(224, 90, 53, 0.3);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    animation: bubblePulse 3s ease-in-out infinite;
    img { width: 35px; height: 35px; filter: brightness(0) invert(1); }
    span { color: white; font-size: 24px; font-weight: bold; }
    &:hover {
      transform: scale(1.12);
      box-shadow: 0 12px 40px rgba(224, 90, 53, 0.55);
    }
  }

  .chat-window {
    position: absolute;
    bottom: 80px;
    left: 0;
    width: 360px;
    height: 520px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(34, 66, 116, 0.18), 0 0 0 1px rgba(224, 90, 53, 0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: chatSlideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .chat-header {
    background: linear-gradient(135deg, #e05a35 0%, #FE8B05 60%, #eb9f0c 100%);
    padding: 16px 20px;
    color: white;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1), rgba(255,255,255,0.4));
      background-size: 200% 100%;
      animation: shimmerBar 3s linear infinite;
    }

    .chat-header-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .chat-header-icon {
      width: 38px;
      height: 38px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(8px);
      img { width: 24px; height: 24px; filter: brightness(0) invert(1); }
    }

    h3 { margin: 0; font-size: 1.1rem; font-weight: 700; letter-spacing: 0.02em; }
    .chat-header-status {
      font-size: 0.75rem;
      opacity: 0.85;
      display: flex;
      align-items: center;
      gap: 5px;
      &::before {
        content: '';
        width: 7px;
        height: 7px;
        background: #4ade80;
        border-radius: 50%;
        display: inline-block;
        animation: statusPulse 2s ease-in-out infinite;
      }
    }
  }

  .chat-body {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    background: linear-gradient(180deg, #fdf8f5 0%, #f8f9fa 100%);
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(224, 90, 53, 0.2);
      border-radius: 4px;
    }

    .message {
      margin-bottom: 14px;
      display: flex;
      animation: msgFadeIn 0.3s ease-out;

      .text {
        padding: 12px 16px;
        border-radius: 18px;
        font-size: 0.9rem;
        max-width: 85%;
        line-height: 1.6;
        white-space: pre-wrap;
        color: #333;
      }
      &.assistant .text {
        background: white;
        color: #333;
        border-bottom-left-radius: 4px;
        box-shadow: 0 2px 12px rgba(34, 66, 116, 0.08);
        border: 1px solid rgba(224, 90, 53, 0.06);
      }

      .catalog-card {
        background: white;
        border-radius: 16px;
        padding: 14px;
        box-shadow: 0 4px 20px rgba(34, 66, 116, 0.1);
        max-width: 90%;
        border: 1px solid rgba(224, 90, 53, 0.08);

        .product-img {
          width: 100%;
          border-radius: 12px;
          margin-bottom: 10px;
        }

        h3 {
          margin: 0 0 8px 0;
          font-size: 1rem;
          color: #e05a35;
          font-weight: 700;
        }

        .description {
          font-size: 0.85rem;
          margin-bottom: 12px;
          line-height: 1.5;
          color: #555;
        }

        .specs-table {
          background: linear-gradient(135deg, #fdf8f5, #f8f9fa);
          border-radius: 10px;
          padding: 10px;
          margin-bottom: 8px;

          .spec-row {
            display: flex;
            justify-content: space-between;
            font-size: 0.8rem;
            padding: 5px 0;
            border-bottom: 1px solid rgba(224, 90, 53, 0.06);

            &:last-child { border-bottom: none; }

            .spec-key { color: #888; flex: 1; }
            .spec-val { color: #333; flex: 2; text-align: right; font-weight: 500; }
          }
        }

        .spec-img {
          width: 100%;
          border-radius: 10px;
          margin-top: 8px;
        }
      }

      &.user {
        justify-content: flex-end;
        .text {
          background: linear-gradient(135deg, #e05a35, #FE8B05);
          color: white;
          border-bottom-right-radius: 4px;
          box-shadow: 0 2px 12px rgba(224, 90, 53, 0.25);
        }
      }

      .handover-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        max-width: 85%;

        .line-handoff-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #06c755;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 24px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 4px 12px rgba(6, 199, 85, 0.25);

          &:hover {
            background: #05a546;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(6, 199, 85, 0.35);
          }

          img {
            width: 20px;
            height: 20px;
          }
        }
      }

      .typing-indicator {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 14px 20px;
        background: white;
        border-radius: 18px;
        border-bottom-left-radius: 4px;
        box-shadow: 0 2px 12px rgba(34, 66, 116, 0.08);

        span {
          width: 8px;
          height: 8px;
          background: #e05a35;
          border-radius: 50%;
          opacity: 0.4;
          animation: typingDot 1.4s infinite;

          &:nth-child(2) { animation-delay: 0.2s; }
          &:nth-child(3) { animation-delay: 0.4s; }
        }
      }
    }
  }

  .chat-footer {
    padding: 14px 16px;
    background: white;
    border-top: 1px solid rgba(224, 90, 53, 0.08);

    .chat-input-area {
      display: flex;
      gap: 10px;
      margin-bottom: 12px;

      .chat-input {
        flex: 1;
        padding: 10px 16px;
        border: 2px solid #eee;
        border-radius: 24px;
        font-size: 0.9rem;
        outline: none;
        color: #333;
        background: white;
        transition: all 0.3s;
        &::placeholder { color: #aaa; }
        &:focus {
          border-color: #e05a35;
          box-shadow: 0 0 0 3px rgba(224, 90, 53, 0.1);
        }
      }

      .send-btn {
        background: linear-gradient(135deg, #e05a35, #FE8B05);
        color: white;
        border: none;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        box-shadow: 0 2px 8px rgba(224, 90, 53, 0.3);
        &:hover {
          transform: scale(1.08);
          box-shadow: 0 4px 15px rgba(224, 90, 53, 0.4);
        }
      }
    }

    .quick-replies {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      button {
        padding: 6px 14px;
        border: 1.5px solid #e05a35;
        background: transparent;
        color: #e05a35;
        border-radius: 20px;
        font-size: 0.78rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        &:hover {
          background: linear-gradient(135deg, #e05a35, #FE8B05);
          color: white;
          border-color: transparent;
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(224, 90, 53, 0.25);
        }
      }
    }
  }
}

@keyframes chatSlideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes bubblePulse {
  0%, 100% { box-shadow: 0 8px 30px rgba(224, 90, 53, 0.45), 0 0 0 0 rgba(224, 90, 53, 0.3); }
  50% { box-shadow: 0 8px 30px rgba(224, 90, 53, 0.45), 0 0 0 12px rgba(224, 90, 53, 0); }
}

@keyframes shimmerBar {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

@keyframes msgFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes typingDot {
  0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-4px); }
}

// Mobile responsive
@media (max-width: 480px) {
  .chatbot-container {
    bottom: 15px;
    left: 15px;

    .chat-window {
      width: calc(100vw - 30px);
      height: calc(100vh - 120px);
      bottom: 75px;
      left: 0;
      border-radius: 16px;
    }
  }
}
</style>
