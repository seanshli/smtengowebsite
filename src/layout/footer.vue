<template>
  <!-- ed-footer: Apple dense-link footer on parchment. Plain-text columns,
       display-font wordmark, text social links, no rules. -->
  <footer class="ed-footer">
    <div class="ft-inner">
      <div class="ft-top">
        <div class="ft-brand">
          <p class="ft-word">enGo</p>
          <p class="ft-tag">
            {{ isZh ? '把智慧生活，寫進每一天。' : 'Smart living, written into every day.' }}
          </p>
        </div>

        <nav class="ft-cols" aria-label="footer navigation">
          <div class="ft-col">
            <p class="ft-col-title">{{ $t('footer.product') }}</p>
            <router-link to="/product">{{ $t('footer.firstLink') }}</router-link>
            <span class="ft-link" @click="jumpToProduct">{{ $t('footer.secondLink') }}</span>
            <router-link to="/enviro">{{ $t('enviroTitle') }}</router-link>
            <router-link to="/product#shop">{{ $t('product.shop.title') }}</router-link>
            <router-link to="/packages">{{ $t('product.packages.tag') }}</router-link>
          </div>

          <div class="ft-col">
            <p class="ft-col-title">{{ $t('footer.about') }}</p>
            <router-link to="/brand">{{ $t('brand.brandStoryTitle') }}</router-link>
            <router-link to="/core">{{ $t('coreValueTitle') }}</router-link>
            <router-link to="/team">{{ $t('teamTitle') }}</router-link>
            <router-link to="/ecosystem">{{ $t('ecosystemTitle') }}</router-link>
          </div>

          <div class="ft-col">
            <p class="ft-col-title">{{ $t('contactTitle') }}</p>
            <!-- 最新消息 is a home-page section, so it sits with 首頁 -->
            <router-link to="/">{{ $t('homeTitle') }}</router-link>
            <!-- directly under 首頁: 最新消息 is a section of the home page -->
            <router-link :to="{ path: '/', hash: '#news' }">{{ $t('newsTitle') }}</router-link>
            <router-link to="/tutorial">{{ $t('tutorialTitle') }}</router-link>
            <!-- 常見問題 is a section of 使用教學 -->
            <router-link :to="{ path: '/tutorial', hash: '#faq' }">{{ $t('faqTitle') }}</router-link>
            <router-link to="/cases">{{ $t('casesTitle') }}</router-link>
            <router-link to="/contact">{{ $t('footer.contactUs') }}</router-link>
            <router-link to="/login">{{ $t('login') || '登入' }}</router-link>
          </div>
        </nav>
      </div>

      <div class="ft-bottom">
        <div class="ft-social">
          <a href="https://www.facebook.com/smtengo" data-track="footer:facebook" target="_blank" rel="me noopener noreferrer">Facebook</a>
          <a href="https://lin.ee/THIUSjW" data-track="footer:line" target="_blank" rel="me noopener noreferrer">LINE</a>
          <a href="https://www.instagram.com/engo_smtengo" data-track="footer:instagram" target="_blank" rel="me noopener noreferrer">Instagram</a>
          <a href="https://www.youtube.com/@enGo%E6%99%BA%E6%85%A7%E7%AE%A1%E5%AE%B6" data-track="footer:youtube" target="_blank" rel="me noopener noreferrer">YouTube</a>
        </div>

        <div class="ft-meta">
          <span>{{ copyright }}</span>
          <span>{{ $t('footer.time') }}</span>
          <span>
            <a href="tel:+886-2-27510218">{{ $t('footer.phone') }}</a>
            ｜{{ $t('footer.customer') }}
          </span>
          <span class="ft-legal">
            <a :href="legalDoc('return-policy')">{{ $t('footer.returnPolicy') }}</a>
            <i>·</i>
            <a :href="legalDoc('privacy')">{{ $t('footer.privacyPolicy') }}</a>
            <i>·</i>
            <a :href="legalDoc('terms')">{{ $t('footer.termsOfService') }}</a>
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Footer',
  setup() {
    const { t, locale } = useI18n()
    const router = useRouter()

    const isZh = computed(() => locale.value.startsWith('zh'))

    // The legal documents are static pages, not routes, and exist in two
    // languages only. Chinese readers get the Traditional Chinese originals
    // (which remain the governing text); everyone else gets the English
    // translation rather than a page they cannot read.
    const legalDoc = (name: string) =>
      isZh.value ? `/${name}.html` : `/${name}-en.html`
    // Locale strings say "© 2024"; keep the year current without touching 6 files.
    const copyright = computed(() =>
      String(t('footer.copyright')).replace(/20\d{2}/, String(new Date().getFullYear()))
    )

    const jumpToProduct = () => {
      router.push({ name: 'product', query: { jump: 'oxygen' } })
    }
    const jumpToProduct1 = () => {
      router.push({ name: 'product', query: { jump: 'oxygen1' } })
    }

    return { isZh, copyright, jumpToProduct, jumpToProduct1, legalDoc }
  }
})
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

.ed-footer {
  background: $parchment;
  color: $ink-80;
  padding: 72px 5vw 40px;
}

.ft-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.ft-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 48px;
  flex-wrap: wrap;
}

.ft-word {
  font-family: $display-font;
  font-weight: 600;
  font-size: clamp(3rem, 7vw, 5rem);
  line-height: 1;
  letter-spacing: -0.02em;
  color: $ink;
}

.ft-tag {
  margin-top: 14px;
  font-weight: 400;
  font-size: 17px;
  line-height: 1.47;
  color: $ink-80;
}

.ft-cols {
  display: flex;
  gap: clamp(32px, 6vw, 80px);
  flex-wrap: wrap;
}

.ft-col {
  display: flex;
  flex-direction: column;

  a,
  .ft-link {
    margin: 0; // a global rule gives <a> side margins; keep column edges flush
    color: $ink-80;
    font-size: 17px;
    font-weight: 400;
    line-height: 2.4;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover,
    &:focus-visible {
      color: $brand-orange-text;
    }
  }
}

.ft-col-title {
  font-weight: 600;
  font-size: 14px;
  line-height: 1.43;
  color: $ink;
  margin-bottom: 8px;
}

.ft-bottom {
  margin-top: 56px;
  padding-top: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ft-social {
  display: flex;
  flex-wrap: wrap;
  gap: 26px;

  a {
    margin: 0;
    font-weight: 600;
    font-size: 14px;
    color: $ink;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover,
    &:focus-visible {
      color: $brand-orange-text;
    }
  }
}

.ft-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 20px;
  font-size: 12px;
  line-height: 1.5;
  color: $ink-80;

  a {
    margin: 0;
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: $brand-orange-text;
    }
  }
}

.ft-legal i {
  font-style: normal;
  margin: 0 6px;
  color: $ink-80;
}

@media (max-width: 768px) {
  .ed-footer {
    // extra room for the floating LINE/chat button
    padding: 56px 7vw 96px;
  }

  .ft-top {
    flex-direction: column;
    gap: 36px;
  }

  .ft-cols {
    width: 100%;
    justify-content: space-between;
    gap: 28px;
  }
}
</style>
