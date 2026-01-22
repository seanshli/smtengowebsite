<template>
  <section id="core-value" class="core-value-section">
    <div class="grey-block-bg">
      <div class="core-value-content-container">
        <h2 class="section-title with-vertical-strip-orange">{{ $t('coreValueTitle') }}</h2>
        <div class="text-container section-text text-color-dark-grey">
          <p class="bold brand-blue">{{ $t('coreValueSubtitle') }}</p>
          <p v-html="$t('coreValueDescribe')"></p>
          <ol class="core-value-section-list">
            <li>{{ $t('coreValue1') }}</li>
            <li>{{ $t('coreValue2') }}</li>
            <li>{{ $t('coreValue3') }}</li>
          </ol>
          <p>
            {{ $t('coreValueConclusion') }}
          </p>
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
