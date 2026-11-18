<template>
  <section class="ap-page nf">
    <div class="ap-tile ap-tile-first ap-white nf-tile">
      <div class="ap-wrap ap-wrap-text">
        <h1 class="ap-title">
          {{ tx('這個頁面不存在。', '这个页面不存在。', 'This page does not exist.', { ja: 'このページは存在しません。', fr: 'Cette page n’existe pas.', es: 'Esta página no existe.' }) }}
        </h1>
        <p class="ap-lead">
          {{ tx('連結可能已經變更或失效。以下是幾個常去的地方：', '链接可能已经变更或失效。以下是几个常去的地方：', 'The link may have changed or expired. Here are some places to go instead:', { ja: 'リンクが変更されたか、無効になっている可能性があります。代わりに、よくご覧いただくページをご案内します。', fr: 'Le lien a peut-être changé ou expiré. Voici quelques pages à consulter :', es: 'Es posible que el enlace haya cambiado o haya expirado. Estas son algunas páginas que pueden servir:' }) }}
        </p>

        <div class="ap-links nf-links">
          <router-link class="ap-link" :to="localePath('/')">{{ $t('homeTitle') }}</router-link>
          <router-link class="ap-link" :to="localePath('/product')">{{ $t('productTitle') }}</router-link>
          <router-link class="ap-link" :to="localePath('/cases')">{{ $t('casesTitle') }}</router-link>
          <router-link class="ap-link" :to="localePath('/contact')">{{ $t('contactTitle') }}</router-link>
        </div>

        <p class="ap-fine nf-code">404</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted } from 'vue'
import { useLocaleText } from '../composables/useLocaleText'
import { withLocalePrefix } from '../utils/localePaths'

// A Vue SPA behind Vercel's catch-all rewrite cannot return a real 404 status:
// the platform has already answered 200 with index.html before any JS runs.
// The next best thing, and what Google documents for exactly this case, is to
// make the page unmistakably a 404 — a robots noindex plus visible "not found"
// content — so it gets dropped from the index rather than treated as another
// copy of the home page, which is what rendering HomeView here used to cause.
const ROBOTS_ID = 'nf-robots-noindex'

export default defineComponent({
  name: 'NotFound',
  setup() {
    const { isZh, tx, locale } = useLocaleText()

    // English and Simplified Chinese are the prefixed locales (zh is
    // unprefixed, fr/ja/es reuse the unprefixed routes). Without this the
    // recovery links carried translated labels to Chinese pages, pushing every
    // English / Simplified visitor off their own site.
    const localePath = (path: string) =>
      locale.value === 'en' || locale.value === 'zhCN' ? withLocalePrefix(path, locale.value) : path

    // The catch-all rewrite serves the home shell for every unmatched URL, so
    // a 404 arrives carrying the home page's canonical and hreflang set. Left
    // in place that asserts this URL *is* the home page -- the same duplicate
    // signal the noindex exists to kill, and a direct contradiction of it.
    // Park the nodes while this page is mounted and restore them on the way
    // out, so a client-side navigation back to a real route is unaffected.
    let parked: Element[] = []

    onMounted(() => {
      parked = Array.from(
        document.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]')
      )
      parked.forEach((el) => el.remove())

      if (document.getElementById(ROBOTS_ID)) return
      const meta = document.createElement('meta')
      meta.id = ROBOTS_ID
      meta.name = 'robots'
      meta.content = 'noindex, follow'
      document.head.appendChild(meta)
    })

    // Leaving any of this behind would tag the next route noindex and strip
    // its canonical.
    onUnmounted(() => {
      document.getElementById(ROBOTS_ID)?.remove()
      parked.forEach((el) => document.head.appendChild(el))
      parked = []
    })

    return { isZh, tx, localePath }
  }
})
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

.nf-tile {
  min-height: 68vh;
  display: flex;
  align-items: center;

  .ap-wrap {
    width: 100%;
  }
}

.nf-links {
  margin-top: 36px;
}

.nf-code {
  margin: 48px 0 0;
}
</style>
