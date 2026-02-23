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
        <img class="logo_footer" src="/images/footer_logo_white.png" />
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
        </div>
        <div class="right">
          <router-link to="/login" class="login-footer-link">{{ $t('login') || '登入' }}</router-link>
          <img
            class="link_icon hover-scale"
            src="/images/link_FB.png"
            alt="facebook link"
            @click="jumpToFB"
          />
          <img
            class="link_icon hover-scale"
            src="/images/link_Line.png"
            alt="line link"
            @click="jumpToLine"
          />
          <img
            class="link_icon hover-scale"
            src="/images/ig_icon.png"
            alt="ig link"
            @click="jumpToIg"
          />
          <img
            class="link_icon hover-scale"
            src="/images/yt_icon.png"
            alt="yt link"
            @click="jumpToYt"
          />
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

    const jumpToFB = () => {
      window.open('https://www.facebook.com/smtengo')
    }

    const jumpToLine = () => {
      window.open('https://lin.ee/THIUSjW')
    }

    const jumpToIg = () => {
      window.open('https://www.instagram.com/engo_smtengo')
    }
    const jumpToYt = () => {
      window.open('https://www.youtube.com/@enGo%E6%99%BA%E6%85%A7%E7%AE%A1%E5%AE%B6')
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
      jumpToFB,
      jumpToLine,
      jumpToIg,
      jumpToYt,
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
</style>
