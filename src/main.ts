import './css/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'

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
