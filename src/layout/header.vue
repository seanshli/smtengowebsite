<template>
  <header class="header">
    <a class="logo" href=" ">
      <router-link to="/">
        <img class="logo-engo" src="../assets/logo.svg" alt="enGo Logo" />
      </router-link>
    </a>
    <nav class="menu-container">
      <router-link to="/">{{ $t('homeTitle') }}</router-link>
      <div class="dropdown dropdown-spacing-right">
        {{ $t('aboutTitle') }}
        <div class="dropdown-content">
          <router-link to="/brand">{{ $t('brand.brandStoryTitle') }}</router-link>
          <router-link to="/mission">{{ $t('missionTitle') }}</router-link>
          <!--<router-link to="/vision">{{ $t('visionTitle') }}</router-link>-->
          <router-link to="/ecosystem">{{ $t('ecosystemTitle') }}</router-link>
        </div>
      </div>
      
      <div class="dropdown">
        <router-link to="/product">{{ $t('productTitle') }}</router-link>
        <div class="dropdown-content">
          <router-link to="/product">{{ $t('footer.firstLink') }}</router-link>
          <router-link to="product?jump=oxygen">{{ $t('footer.secondLink') }}</router-link>
          <router-link to="product?jump=oxygen1">{{ $t('product.air_purifier.title') }}</router-link>
          
        </div>
      </div>
      <!--
         <router-link to="/product">{{ $t('productTitle') }}</router-link>
      -->
      
      <a @click="toMall">{{ $t('mallTitle') }}</a>
      <router-link to="/contact">{{ $t('contactTitle') }}</router-link>
      <select
        v-model="selectedLanguage"
        @change="changeLanguage"
        id="language-dropdown"
        class="language-dropdown"
      >
        <option value="en">{{ $t('english') }}</option>
        <option value="zh">{{ $t('chinese') }}</option>
        <option value="fr">{{ $t('french') }}</option>
      </select>
    </nav>
    <button class="menu-icon" @click="toggleMenu()">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </button>
  </header>
  <div class="collapsible-menu-container hidden">
    <button class="close-menu" @click="toggleMenu()">
      <img class="close-menu-icon" src="../assets/images/close-line-icon.svg" alt="close menu" />
    </button>
    <nav class="collapsible-menu-nav">
      <div class="menu">
        <select
          v-model="selectedLanguage"
          @change="changeLanguage"
          id="language-dropdown-in-menu"
          class="language-dropdown"
        >
          <option value="en">{{ $t('english') }}</option>
          <option value="zh">{{ $t('chinese') }}</option>
          <option value="fr">{{ $t('french') }}</option>
        </select>

        <router-link to="/">{{ $t('homeTitle') }}</router-link>
        <router-link to="/brand">{{ $t('aboutTitle') }}</router-link>
        <router-link to="/brand" class="sublink">{{ $t('brand.brandStoryTitle') }}</router-link>
        <router-link to="/mission" class="sublink">{{ $t('missionTitle') }}</router-link>
        <!--<router-link to="/vision" class="sublink">{{ $t('visionTitle') }}</router-link>-->
        <router-link to="/ecosystem" class="sublink">{{ $t('ecosystemTitle') }}</router-link>

        <router-link to="/product">{{ $t('productTitle') }}</router-link>
        <router-link to="/product" class="sublink">{{ $t('footer.firstLink') }}</router-link>
        <router-link to="product?jump=oxygen" class="sublink">{{ $t('footer.secondLink') }}</router-link>
        <router-link to="product?jump=oxygen1" class="sublink">{{ $t('product.air_purifier.title') }}</router-link>
        <a @click="toMall">{{ $t('mallTitle') }}</a>
        <router-link to="/contact">{{ $t('contactTitle') }}</router-link>
      </div>
    </nav>
  </div>
</template>
<style scoped>
.dropdown-spacing-right {
  margin-right: 10px; /* 您可以調整這個值來增加右邊的間距 */
}
</style>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { changeLocale, type LanguageType } from '../main'

export default defineComponent({
  name: 'Header',
  setup() {
    const selectedLanguage = ref<LanguageType>('zh')

    const toggleMenu = () => {
      const menu = document.querySelector('.collapsible-menu-container')

      if (menu) {
        menu.classList.toggle('hidden')
      }
    }

    const changeLanguage = () => {
      changeLocale(selectedLanguage.value)
    }

    const toMall = () => {
      window.open('https://h5.smtengo.com')
    }

    return {
      selectedLanguage,
      toggleMenu,
      changeLanguage,
      toMall
    }
  }
})
</script>
