import { nextTick } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import { i18n } from '../main'

export function useSeo() {
  const updateMeta = async (to: RouteLocationNormalized) => {
    await nextTick()

    // Translation helper
    const t = (key: string, def: string) => {
      if (!key) return def
      const val = i18n.global.t(key)
      return val === key ? def : val
    }

    const titleKey = to.meta.titleKey as string || ''
    const descKey = to.meta.descKey as string || ''
    const keywordsKey = to.meta.keywordsKey as string || ''

    const title = t(titleKey, to.meta.title as string || 'enGo智管家 - 智慧家居第一品牌')
    const description = t(descKey, to.meta.description as string || 'enGo理家，蝦咪攏嗯驚！智管家用AI技術轉化為智慧居家的必須品...')
    const keywords = t(keywordsKey, '智管家, enGo, smart home, AIot, 智慧家居')

    // 1. Title
    document.title = title

    // 2. Meta Description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    }

    // 3. Meta Keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords)
    }

    // 4. Open Graph Social tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', title)

    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) ogDescription.setAttribute('content', description)

    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl) ogUrl.setAttribute('content', window.location.href)

    // 5. Canonical link (helps with duplicate content across languages)
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', window.location.href.split('?')[0])
  }

  return {
    updateMeta
  }
}
