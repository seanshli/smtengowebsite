<template>
  <footer class="footer">
    <div class="upper">
      <div class="upper-left">
        <!-- 產品 -->
        <router-link to="/product" class="title">{{ $t('footer.product') }}</router-link>
        <!-- enGo AI智慧中控系統 -->
        <router-link class="subtitle link" to="/product">{{ $t('footer.firstLink') }}</router-link>
        <!-- 水維氧AI智慧淨水系 -->
        <span class="subtitle link" @click="jumpToProduct">{{ $t('footer.secondLink') }}</span>
        <!-- 水維氧AI智慧淨水系 -->
        <span class="subtitle link" @click="jumpToProduct1">{{ $t('product.air_purifier.title') }}</span>
        <!-- 智慧管家方案 -->
        <router-link to="/packages" class="subtitle link">{{ $t('product.packages.tag') }}</router-link>
        <!-- 使用教學 -->
        <router-link to="/tutorial" class="subtitle link">{{ $t('footer.tutorial') }}</router-link>
        <!-- 案例分享 -->
        <router-link to="/cases" class="subtitle link">{{ $t('footer.cases') }}</router-link>
      </div>
      <div class="upper-right">
        <!-- 關於enGo -->
        <router-link to="/brand" class="title">{{ $t('footer.about') }}</router-link>
        <!-- 公司介紹 -->
        <router-link to="/" class="subtitle">{{ $t('footer.brand') }}</router-link>
        <!-- 使用教學 -->
        <router-link to="/tutorial" class="subtitle">{{ $t('footer.tutorial') }}</router-link>
        <!-- 案例分享 -->
        <router-link to="/cases" class="subtitle">{{ $t('footer.cases') }}</router-link>
        <!-- 聯絡我們 -->
        <router-link to="/contact" class="subtitle">{{ $t('footer.contactUs') }}</router-link>
      </div>
    </div>
    <div class="bottom">
      <div class="img-container">
        <img class="logo_footer" src="/images/footer_logo_white.png" alt="enGo logo" />
      </div>
      <div class="info-container">
        <div class="left">
          <span class="copyright">
            {{ $t('footer.copyright') }}
          </span>
          <div class="other-info">
            <div>
              <span class="time">{{ $t('footer.time') }}</span>
            </div>
            <div>
              <a class="phone" href="tel:+886-2-27510218">{{ $t('footer.phone') }}</a>
              <span class="customer-service">| {{ $t('footer.customer') }}</span>
            </div>
          </div>
          <div class="legal-links">
            <a href="/return-policy.html" class="legal-link">退貨政策</a>
            <span class="sep">·</span>
            <a href="/privacy.html" class="legal-link">隱私權政策</a>
            <span class="sep">·</span>
            <a href="/terms.html" class="legal-link">服務條款</a>
          </div>
        </div>
        <div class="right">
          <router-link to="/login" class="login-footer-link">{{ $t('login') || '登入' }}</router-link>
          <a
            class="social-link"
            href="https://www.facebook.com/smtengo"
            target="_blank"
            rel="me noopener noreferrer"
            aria-label="enGo on Facebook"
          >
            <img class="link_icon hover-scale" src="/images/link_FB.png" alt="Facebook" />
          </a>
          <a
            class="social-link"
            href="https://lin.ee/THIUSjW"
            target="_blank"
            rel="me noopener noreferrer"
            aria-label="enGo on LINE"
          >
            <img class="link_icon hover-scale" src="/images/link_Line.png" alt="LINE" />
          </a>
          <a
            class="social-link"
            href="https://www.instagram.com/engo_smtengo"
            target="_blank"
            rel="me noopener noreferrer"
            aria-label="enGo on Instagram"
          >
            <img class="link_icon hover-scale" src="/images/ig_icon.png" alt="Instagram" />
          </a>
          <a
            class="social-link"
            href="https://www.youtube.com/@enGo%E6%99%BA%E6%85%A7%E7%AE%A1%E5%AE%B6"
            target="_blank"
            rel="me noopener noreferrer"
            aria-label="enGo on YouTube"
          >
            <img class="link_icon hover-scale" src="/images/yt_icon.png" alt="YouTube" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { changeLocale, type LanguageType, i18n } from '../main'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Header',
  setup() {
    const selectedLanguage = ref<LanguageType>(i18n.global.locale.value || 'zh')
    const router = useRouter()

    const toggleMenu = () => {
      const menu = document.querySelector('.collapsible-menu-container')

      if (menu) {
        menu.classList.toggle('hidden')
      }
    }

    const changeLanguage = () => {
      changeLocale(selectedLanguage.value)
    }

    const jumpToProduct = () => {
      router.push({
        name: 'product',
        query: { jump: 'oxygen' }
      })
    }
    const jumpToProduct1 = () => {
      router.push({
        name: 'product',
        query: { jump: 'oxygen1' }
      })
    }



    return {
      selectedLanguage,
      toggleMenu,
      changeLanguage,
      jumpToProduct,
      jumpToProduct1
    }
  }
})
</script>

<style scoped lang="scss">
.hover-scale {
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.1);
    cursor: pointer;
  }
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: outline 0.15s ease;

  &:focus-visible {
    outline: 2px solid #FE8B05;
    outline-offset: 3px;
  }
}

.login-footer-link {
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  margin-right: 20px;
  padding: 5px 15px;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 20px;
  transition: all 0.3s;
  &:hover {
    background: #fff;
    color: #c46043;
  }
}

.footer {
  /* Existing styles are handled by main.scss or scoped here if any */
}

.legal-links {
  margin-top: 12px;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.65);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;

  .legal-link {
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    transition: color 0.15s ease;
    &:hover {
      color: #fe8b05;
      text-decoration: underline;
    }
  }
  .sep {
    color: rgba(255, 255, 255, 0.35);
  }
}
</style>
