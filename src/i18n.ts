import { createI18n } from 'vue-i18n'
import { zhLocale } from './locale/zh'
import { zhCNLocale } from './locale/zhCN'
import { enLocale } from './locale/en'
import { frLocale } from './locale/fr'
import { jaLocale } from './locale/ja'
import { esLocale } from './locale/es'

// Lives outside main.ts so the router, seo.ts and header.vue can use it without
// importing the app entry point (that formed main → router → seo → main and
// main → App → header → main cycles).

export type LanguageType = 'zh' | 'zhCN' | 'en' | 'fr' | 'ja' | 'es'

export const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: 'zh',
  globalInjection: true,
  messages: {
    en: enLocale,
    zh: zhLocale,
    zhCN: zhCNLocale,
    fr: frLocale,
    ja: jaLocale,
    es: esLocale
  }
})

export const changeLocale = (lang: LanguageType) => {
  i18n.global.locale.value = lang
}
