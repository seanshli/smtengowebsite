<template>
  <!-- ed-footer: the magazine's back cover. Flat navy, orange masthead rule,
       serif wordmark, text social links. Replaces the old gradient footer
       (_footer.scss removed with it). -->
  <footer class="ed-footer">
    <div class="ft-inner">
      <div class="ft-top">
        <div class="ft-brand">
          <p class="ft-kicker">enGo 生活誌</p>
          <p class="ft-word">enGo</p>
          <p class="ft-tag">
            {{ isZh ? '把智慧生活，寫進每一天。' : 'Smart living, written into every day.' }}
          </p>
          <!-- 最新消息 sits with the masthead rather than buried in a column:
               it is the thing that changes, so it earns the prominent slot -->
          <router-link class="ft-news" :to="{ path: '/', hash: '#news' }">
            {{ $t('newsTitle') }} →
          </router-link>
        </div>

        <nav class="ft-cols" aria-label="footer navigation">
          <div class="ft-col">
            <p class="ft-col-title">{{ $t('footer.product') }}</p>
            <router-link to="/product">{{ $t('footer.firstLink') }}</router-link>
            <span class="ft-link" @click="jumpToProduct">{{ $t('footer.secondLink') }}</span>
            <span v-if="SHOW_AIR_PURIFIER" class="ft-link" @click="jumpToProduct1">{{ $t('product.air_purifier.title') }}</span>
            <router-link to="/enviro">{{ $t('enviroTitle') }}</router-link>
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
            <router-link to="/tutorial">{{ $t('tutorialTitle') }}</router-link>
            <router-link to="/cases">{{ $t('casesTitle') }}</router-link>
            <router-link to="/contact">{{ $t('footer.contactUs') }}</router-link>
            <router-link to="/login">{{ $t('login') || '登入' }}</router-link>
          </div>
        </nav>
      </div>

      <div class="ft-bottom">
        <div class="ft-social">
          <a href="https://www.facebook.com/smtengo" target="_blank" rel="me noopener noreferrer">Facebook</a>
          <a href="https://lin.ee/THIUSjW" target="_blank" rel="me noopener noreferrer">LINE</a>
          <a href="https://www.instagram.com/engo_smtengo" target="_blank" rel="me noopener noreferrer">Instagram</a>
          <a href="https://www.youtube.com/@enGo%E6%99%BA%E6%85%A7%E7%AE%A1%E5%AE%B6" target="_blank" rel="me noopener noreferrer">YouTube</a>
        </div>

        <div class="ft-meta">
          <span>{{ copyright }}</span>
          <span>{{ $t('footer.time') }}</span>
          <span>
            <a href="tel:+886-2-27510218">{{ $t('footer.phone') }}</a>
            ｜{{ $t('footer.customer') }}
          </span>
          <span class="ft-legal">
            <a href="/return-policy.html">退貨政策</a>
            <i>·</i>
            <a href="/privacy.html">隱私權政策</a>
            <i>·</i>
            <a href="/terms.html">服務條款</a>
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
import { SHOW_AIR_PURIFIER } from '../configs/systemConfig'

export default defineComponent({
  name: 'Footer',
  setup() {
    const { t, locale } = useI18n()
    const router = useRouter()

    const isZh = computed(() => locale.value.startsWith('zh'))
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

    return { isZh, copyright, jumpToProduct, jumpToProduct1, SHOW_AIR_PURIFIER }
  }
})
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

$cream: #fefbf6;

.ed-footer {
  background: $grey-blue3;
  border-top: 3px solid $brand-orange;
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

.ft-kicker {
  font-size: 0.92rem;
  font-weight: 800;
  letter-spacing: 0.28em;
  color: $orange2;
  margin-bottom: 10px;
}

.ft-word {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: clamp(3rem, 7vw, 5rem);
  line-height: 1;
  color: $orange2;
}

.ft-tag {
  margin-top: 14px;
  font-family: 'Noto Serif TC', serif;
  font-weight: 500;
  font-size: 1.02rem;
  letter-spacing: 0.06em;
  color: rgba($cream, 0.75);
}

.ft-news {
  display: inline-block;
  margin-top: 18px;
  font-family: 'Noto Serif TC', serif;
  font-weight: 700;
  font-size: 1.02rem;
  letter-spacing: 0.06em;
  color: $orange2;
  text-decoration: none;
  border-bottom: 2px solid $brand-orange;
  padding-bottom: 3px;
  transition: color 0.2s ease;

  &:hover,
  &:focus-visible {
    color: $warm-bg-light;
  }
}

.ft-cols {
  display: flex;
  gap: clamp(32px, 6vw, 80px);
  flex-wrap: wrap;
}

.ft-col {
  display: flex;
  flex-direction: column;
  gap: 10px;

  a,
  .ft-link {
    margin: 0; // a global rule gives <a> side margins; keep column edges flush
    color: rgba($cream, 0.72);
    font-size: 0.95rem;
    letter-spacing: 0.05em;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover,
    &:focus-visible {
      color: $orange2;
    }
  }
}

.ft-col-title {
  font-family: 'Noto Serif TC', serif;
  font-weight: 700;
  font-size: 1.05rem;
  color: $cream;
  padding-bottom: 8px;
  margin-bottom: 6px;
  border-bottom: 2px solid $brand-orange;
}

.ft-bottom {
  margin-top: 56px;
  padding-top: 22px;
  border-top: 1px solid rgba($cream, 0.18);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ft-social {
  display: flex;
  flex-wrap: wrap;
  gap: 26px;

  a {
    font-family: 'Noto Serif TC', serif;
    font-weight: 700;
    font-size: 0.92rem;
    letter-spacing: 0.08em;
    color: $cream;
    text-decoration: none;
    border-bottom: 2px solid $brand-orange;
    padding-bottom: 2px;
    transition: color 0.2s ease;

    &:hover,
    &:focus-visible {
      color: $orange2;
    }
  }
}

.ft-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 20px;
  font-size: 0.82rem;
  letter-spacing: 0.04em;
  color: rgba($cream, 0.55);

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: $orange2;
    }
  }
}

.ft-legal i {
  font-style: normal;
  margin: 0 6px;
  color: rgba($cream, 0.3);
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
