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
      </div>
      <div class="upper-right">
        <!-- 關於enGo -->
        <router-link to="/brand" class="title">{{ $t('footer.about') }}</router-link>
        <!-- 公司介紹 -->
        <router-link to="/" class="subtitle">{{ $t('footer.brand') }}</router-link>
        <!-- 聯絡我們 -->
        <router-link to="/contact" class="subtitle">{{ $t('footer.contactUs') }}</router-link>
      </div>
    </div>
    <div class="bottom">
      <div class="img-container">
        <img class="logo_footer" src="../assets/images/footer_logo_white.png" />
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
          <img
            class="link_icon"
            src="../assets/images/link_FB.png"
            alt="facebook link"
            @click="jumpToFB"
          />
          <img
            class="link_icon"
            src="../assets/images/link_Line.png"
            alt="line link"
            @click="jumpToLine"
          />
          <img
            class="link_icon"
            src="../assets/images/ig_icon.png"
            alt="ig link"
            @click="jumpToIg"
          />
          <img
            class="link_icon"
            src="../assets/images/yt_icon.png"
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
import { changeLocale, type LanguageType } from '../main'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Header',
  setup() {
    const selectedLanguage = ref<LanguageType>('zh')
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
