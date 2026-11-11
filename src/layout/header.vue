<template>
  <header class="header">
    <router-link to="/" class="logo" aria-label="enGo home">
      <img class="logo-engo" src="/assets/logo.svg" alt="enGo Logo" />
    </router-link>
    <nav class="menu-container">
      <!-- 最新消息 lives on the home page (#news), so it hangs off 首頁 -->
      <div class="dropdown">
        <router-link to="/" class="dropdown-trigger" data-track="nav:home">{{ $t('homeTitle') }}</router-link>
        <div class="dropdown-content">
          <router-link :to="{ path: '/', hash: '#news' }">{{ $t('newsTitle') }}</router-link>
        </div>
      </div>
      <div class="dropdown">
        <router-link to="/brand" class="dropdown-trigger" data-track="nav:about">{{ $t('aboutTitle') }}</router-link>
        <div class="dropdown-content">
          <router-link to="/brand">{{ $t('brand.brandStoryTitle') }}</router-link>
          <router-link to="/core">{{ $t('coreValueTitle') }}</router-link>
          <router-link to="/mission">{{ $t('missionTitle') }}</router-link>
          <router-link to="/team">{{ $t('teamTitle') }}</router-link>
          <!--<router-link to="/vision">{{ $t('visionTitle') }}</router-link>-->
          <router-link to="/ecosystem">{{ $t('ecosystemTitle') }}</router-link>
        </div>
      </div>

      <div class="dropdown">
        <router-link to="/product" class="dropdown-trigger" data-track="nav:product">{{ $t('productTitle') }}</router-link>
        <div class="dropdown-content">
          <router-link to="/product">{{ $t('footer.firstLink') }}</router-link>
          <router-link to="/product?jump=oxygen">{{ $t('footer.secondLink') }}</router-link>
          <router-link to="/enviro">{{ $t('enviroTitle') }}</router-link>
          <router-link to="/product#shop">{{ $t('product.shop.title') }}</router-link>
        </div>
      </div>
      <router-link to="/packages" data-track="nav:packages">{{ $t('product.packages.tag') }}</router-link>
      
      <a :href="shopUrl" target="_blank" rel="noopener" @click.prevent="toMall" data-track="nav:mall">{{ $t('mallTitle') }}</a>
      <!-- 常見問題 is a section of 使用教學, so it hangs off it -->
      <div class="dropdown">
        <router-link to="/tutorial" class="dropdown-trigger" data-track="nav:tutorial">{{ $t('tutorialTitle') }}</router-link>
        <div class="dropdown-content">
          <router-link :to="{ path: '/tutorial', hash: '#faq' }">{{ $t('faqTitle') }}</router-link>
        </div>
      </div>
      <router-link to="/cases" data-track="nav:cases">{{ $t('casesTitle') }}</router-link>
      <router-link to="/contact" data-track="nav:contact">{{ $t('contactTitle') }}</router-link>
      <select
        v-model="selectedLanguage"
        @change="changeLanguage"
        id="language-dropdown"
        class="language-dropdown"
        aria-label="Language"
      >
        <option value="en">{{ $t('english') }}</option>
        <option value="zh">{{ $t('chinese') }}</option>
        <option value="zhCN">{{ $t('simplifiedChinese') }}</option>
        <option value="fr">{{ $t('french') }}</option>
        <option value="ja">{{ $t('japanese') }}</option>
        <option value="es">{{ $t('spanish') }}</option>
      </select>
    </nav>
    <button class="menu-icon" type="button" aria-label="Menu" aria-controls="mobile-menu" @click="toggleMenu()">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </button>
  </header>
  <div id="mobile-menu" class="collapsible-menu-container hidden">
    <button class="close-menu" type="button" aria-label="Close menu" @click="toggleMenu()">
      <img class="close-menu-icon" src="/images/close-line-icon.svg" alt="close menu" />
    </button>
    <nav class="collapsible-menu-nav">
      <div class="menu">
        <select
          v-model="selectedLanguage"
          @change="changeLanguage"
          id="language-dropdown-in-menu"
          class="language-dropdown"
          aria-label="Language"
        >
          <option value="en">{{ $t('english') }}</option>
          <option value="zh">{{ $t('chinese') }}</option>
          <option value="zhCN">{{ $t('simplifiedChinese') }}</option>
          <option value="fr">{{ $t('french') }}</option>
          <option value="ja">{{ $t('japanese') }}</option>
          <option value="es">{{ $t('spanish') }}</option>
        </select>

        <router-link to="/">{{ $t('homeTitle') }}</router-link>
        <router-link :to="{ path: '/', hash: '#news' }" class="sublink">{{ $t('newsTitle') }}</router-link>
        <router-link to="/brand">{{ $t('aboutTitle') }}</router-link>
        <router-link to="/brand" class="sublink">{{ $t('brand.brandStoryTitle') }}</router-link>
        <router-link to="/core" class="sublink">{{ $t('coreValueTitle') }}</router-link>
        <router-link to="/mission" class="sublink">{{ $t('missionTitle') }}</router-link>
        <router-link to="/team" class="sublink">{{ $t('teamTitle') }}</router-link>
        <!--<router-link to="/vision" class="sublink">{{ $t('visionTitle') }}</router-link>-->
        <router-link to="/ecosystem" class="sublink">{{ $t('ecosystemTitle') }}</router-link>

        <router-link to="/product">{{ $t('productTitle') }}</router-link>
        <router-link to="/product" class="sublink">{{ $t('footer.firstLink') }}</router-link>
        <router-link to="/product?jump=oxygen" class="sublink">{{ $t('footer.secondLink') }}</router-link>
        <router-link to="/enviro" class="sublink">{{ $t('enviroTitle') }}</router-link>
        <router-link to="/product#shop" class="sublink">{{ $t('product.shop.title') }}</router-link>
        <router-link to="/packages">{{ $t('product.packages.tag') }}</router-link>
        <a :href="shopUrl" target="_blank" rel="noopener" @click.prevent="toMall">{{ $t('mallTitle') }}</a>
        <router-link to="/tutorial">{{ $t('tutorialTitle') }}</router-link>
        <router-link :to="{ path: '/tutorial', hash: '#faq' }" class="sublink">{{ $t('faqTitle') }}</router-link>
        <router-link to="/cases">{{ $t('casesTitle') }}</router-link>
        <router-link to="/contact">{{ $t('contactTitle') }}</router-link>
      </div>
    </nav>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { changeLocale, type LanguageType, i18n } from '../main'
import { openShop, SHOP_URL } from '@/utils/shopUrl'
import { pushUnlocalized } from '@/router'
import { stripLocalePrefix, withLocalePrefix } from '@/utils/localePaths'

export default defineComponent({
  name: 'Header',
  setup() {
    const selectedLanguage = ref<LanguageType>(i18n.global.locale.value || 'zh')
    const router = useRouter()

    // Opening /en sets the locale from the URL, so the dropdown has to follow —
    // otherwise the page is in English while the switcher still reads 中文.
    watch(
      () => i18n.global.locale.value,
      (lang) => {
        if (lang && lang !== selectedLanguage.value) selectedLanguage.value = lang as LanguageType
      },
      { immediate: true }
    )

    const toggleMenu = () => {
      const menu = document.querySelector('.collapsible-menu-container')

      if (menu) {
        menu.classList.toggle('hidden')
      }
    }

    // zh, zhCN and en are the locales with real URLs (/, /zh-cn, /en), so
    // switching between them has to move the address bar — otherwise the page
    // contradicts its own hreflang and the visitor cannot share what they are
    // looking at. Uses pushUnlocalized: the router would otherwise rewrite the
    // target back into the language of the page being left.
    const changeLanguage = () => {
      const lang = selectedLanguage.value
      const { path, query, hash } = router.currentRoute.value
      const bare = stripLocalePrefix(path)

      if (lang === 'en' || lang === 'zhCN' || lang === 'zh') {
        pushUnlocalized({ path: withLocalePrefix(bare, lang), query, hash })
        return
      }
      // The remaining locales have no URL of their own yet: switch in place.
      if (path !== bare) pushUnlocalized({ path: bare, query, hash })
      changeLocale(lang)
    }

    // enGo 安購商城: front page of the new storefront (utils/shopUrl)
    const toMall = () => {
      openShop()
    }

    return {
      selectedLanguage,
      shopUrl: SHOP_URL,
      toggleMenu,
      changeLanguage,
      toMall
    }
  }
})
</script>
