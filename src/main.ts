import './css/main.scss'

import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import { zhLocale } from './locale/zh'
import { enLocale } from './locale/en'
import { frLocale } from './locale/fr'
import { jaLocale } from './locale/ja'

export type LanguageType = 'zh' | 'en' | 'fr' | 'ja'

export const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: 'zh',
  globalInjection: true,
  messages: {
    en: enLocale,
    zh: zhLocale,
    fr: frLocale,
    ja: jaLocale
  }
})
const app = createApp(App)

app.use(router)
app.use(i18n)

app.mount('#app')

export const changeLocale = (lang: LanguageType) => {
  console.log('Changing locale to:', lang)
  i18n.global.locale.value = lang
  console.log('Locale changed to:', i18n.global.locale.value)
}

export const geti18n = () => {
  return i18n.global.messages
}
