import './css/main.scss'

import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import { zhLocale } from './locale/zh'
import { enLocale } from './locale/en'
import { frLocale } from './locale/fr'

export type LanguageType = 'zh' | 'en' | 'fr'

const i18n = createI18n({
  locale: 'zh',
  allowComposition: true, // you need to specify that!
  globalInjection: true,
  messages: {
    en: enLocale,
    zh: zhLocale,
    fr: frLocale
  }
})
const app = createApp(App)

app.use(router)
app.use(i18n)

app.mount('#app')

export const changeLocale = (lang: LanguageType) => {
  i18n.global.locale = lang
}

export const geti18n = () => {
  return i18n.global.messages
}
