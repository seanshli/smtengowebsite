<template>
  <section id="mission" class="mission-section">
    <div class="mission-section-image-container">
      <img
        class="mission-section-image"
        src="../assets/images/technology.jpeg"
        alt="mission background technology"
      />
      <div class="image-gradient-overlay"></div>
    </div>
    <div class="mission-text">
      <h2 class="section-title with-vertical-strip-white text-color-white">
        {{ $t('missionTitle') }}
      </h2>
      <div class="text-container section-text text-color-white">
        <p>
          {{ $t('missionSubtitle') }}
        </p>
        <p v-if="locale == 'zh'">{{ $t('fiveValues') }}</p>

        <ul class="mission-section-list">
          <li><span class="mission-first-letter2">A</span>loT {{ $t('fiveValues1') }}</li>
          <li>
            <span class="mission-first-letter2">B</span>ig Data
            {{ $t('fiveValues2') }}
          </li>
          <li>
            <span class="mission-first-letter2">C</span>loud
            {{ $t('fiveValues3') }}
          </li>
          <li><span class="mission-first-letter2">D</span>evice enGo {{ $t('fiveValues4') }}</li>
          <li>
            <span class="mission-first-letter2">E</span>SG
            {{ $t('fiveValues5') }}
          </li>
        </ul>
        <p v-html="$t('missionConclusion')"></p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Mission',
  setup() {
    const { locale } = useI18n()

    return {
      locale
    }
  }
})
</script>
