<template>
  <section id="core-value" class="core-value-section">
    <div class="grey-block-bg">
      <div class="core-value-content-container">
        <h2 class="section-title with-vertical-strip-orange">{{ $t('brand.brandStoryTitle') }}</h2>
        
        <h1 class="section-second-title">
          <!-- <img class="in-text-logo-engo" src="../assets/logo-orange.svg" alt="enGo Logo" />-->
          {{ $t('brand.intextLogo') }}
        
        </h1>
        
        <div class="text-container section-text text-color-dark-grey">
          <h2></h2>
          <p class="text-color-dark-grey" v-html="$t('brand.paragraph1')"></p>
          <h2></h2>
          <p class="text-color-dark-grey" v-html="$t('brand.paragraph2')"></p>
          <h2></h2>
<!--          <p class="text-color-dark-grey">{{ $t('brand.paragraph3') }}</p>-->
<!--          <h2></h2>-->
<!--          <p class="text-color-dark-grey">{{ $t('brand.paragraph4') }}</p>-->
<!--          <h2></h2>-->
<!--          <p class="text-color-dark-grey">{{ $t('brand.paragraph5') }}</p>-->
        </div>
      </div>
      <div class="core-value-section-bg-container">
        <img
          class="core-value-section-bg"
          src="../assets/images/family.jpeg"
          alt="core value background"
        />
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'CoreValue',
  setup() {
    const { locale } = useI18n()

    return {
      locale
    }
  }
})
</script>
