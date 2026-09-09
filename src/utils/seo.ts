import { nextTick } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import { i18n } from '../main'

const LOCALE_TO_HTML_LANG: Record<string, string> = {
  zh: 'zh-TW',
  zhCN: 'zh-CN',
  en: 'en',
  fr: 'fr',
  ja: 'ja',
  es: 'es'
}

const LOCALE_TO_OG_LOCALE: Record<string, string> = {
  zh: 'zh_TW',
  zhCN: 'zh_CN',
  en: 'en_US',
  fr: 'fr_FR',
  ja: 'ja_JP',
  es: 'es_ES'
}

const BASE_URL = 'https://www.smtengo.com'

function ensureMeta(attr: string, value: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${value}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr.replace(/[\[\]"]/g, ''), value)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
  return el
}

export function useSeo() {
  const updateMeta = async (to: RouteLocationNormalized) => {
    await nextTick()

    const locale = i18n.global.locale.value as string

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

    // 1. Update html lang attribute
    document.documentElement.setAttribute('lang', LOCALE_TO_HTML_LANG[locale] || 'en')

    // 2. Title
    document.title = title

    // 3. Meta Description
    ensureMeta('name', 'description', description)

    // 4. Meta Keywords
    ensureMeta('name', 'keywords', keywords)

    // 5. Open Graph tags
    ensureMeta('property', 'og:title', title)
    ensureMeta('property', 'og:description', description)
    // updateMeta runs in beforeEach, where window.location.href is still the
    // page being left -- og:url was always one navigation behind. Build it
    // from the route we are going to instead.
    ensureMeta('property', 'og:url', `${BASE_URL}${to.fullPath}`)
    ensureMeta('property', 'og:locale', LOCALE_TO_OG_LOCALE[locale] || 'en_US')

    // OG locale alternates
    document.querySelectorAll('meta[property="og:locale:alternate"]').forEach(el => el.remove())
    for (const [loc, ogLoc] of Object.entries(LOCALE_TO_OG_LOCALE)) {
      if (loc !== locale) {
        const alt = document.createElement('meta')
        alt.setAttribute('property', 'og:locale:alternate')
        alt.setAttribute('content', ogLoc)
        document.head.appendChild(alt)
      }
    }

    // 6. Twitter Card tags
    ensureMeta('name', 'twitter:card', 'summary_large_image')
    ensureMeta('name', 'twitter:title', title)
    ensureMeta('name', 'twitter:description', description)
    ensureMeta('name', 'twitter:image', `${BASE_URL}/og-image-1200x630.jpg`)

    // Canonical and hreflang are NOT touched here on purpose.
    //
    // They describe the served document, and the prerendered shell
    // (scripts/prerender-meta.mjs) already emits the correct pair: a
    // self-referencing canonical plus reciprocal zh-Hant / en / x-default
    // alternates for the two indexed locales.
    //
    // This function used to delete every alternate on each navigation and
    // rewrite six of them all pointing at the same URL — which is invalid
    // (Google discards such a set) and silently undid the shell's correct
    // markup the moment Vue hydrated. Rewriting canonical from
    // window.location.href had the same problem. Leave both to the shell.
  }

  return {
    updateMeta
  }
}
