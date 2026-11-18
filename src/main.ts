import './css/main.scss'

import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import { zhLocale } from './locale/zh'
import { zhCNLocale } from './locale/zhCN'
import { enLocale } from './locale/en'
import { frLocale } from './locale/fr'
import { jaLocale } from './locale/ja'
import { esLocale } from './locale/es'

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
const app = createApp(App)

app.use(router)
app.use(i18n)

// Mount only once the first route's lazy component has resolved. Mounting earlier
// renders header + footer with an empty <RouterView>, so the footer sits at the top
// of the screen and is pushed down when the page arrives: mobile CLS 1.00 on the
// homepage (review 2026-11-10 L1 / 2026-11-13 P0-2). Until then the prerendered
// shell in #app stays visible. A failed first navigation still mounts the app.
router.isReady().then(
  () => app.mount('#app'),
  () => app.mount('#app')
)

export const changeLocale = (lang: LanguageType) => {
  console.log('Changing locale to:', lang)
  i18n.global.locale.value = lang
  console.log('Locale changed to:', i18n.global.locale.value)
}

export const geti18n = () => {
  return i18n.global.messages
}
