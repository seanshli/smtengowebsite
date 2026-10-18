<template>
  <section id="mission" class="ap-page">
    <div class="ap-tile ap-tile-first ap-dark">
      <div class="ap-wrap ap-wrap-text">
        <h2 class="ap-h2">{{ $t('missionTitle') }}</h2>
        <p class="ap-lead">{{ $t('missionSubtitle') }}</p>
        <div class="ap-prose mo-prose">
          <p v-if="locale == 'zh'">{{ $t('fiveValues') }}</p>

          <ul class="ap-rows mo-list">
            <li><span class="mo-letter">A</span>loT {{ $t('fiveValues1') }}</li>
            <li>
              <span class="mo-letter">B</span>ig Data
              {{ $t('fiveValues2') }}
            </li>
            <li>
              <span class="mo-letter">C</span>loud
              {{ $t('fiveValues3') }}
            </li>
            <li><span class="mo-letter">D</span>evice enGo {{ $t('fiveValues4') }}</li>
            <li>
              <span class="mo-letter">E</span>SG
              {{ $t('fiveValues5') }}
            </li>
          </ul>
          <p v-html="$t('missionConclusion')"></p>
        </div>
        <figure class="ap-photo mo-photo">
          <img src="/images/technology.jpeg" alt="mission background technology" />
        </figure>
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

<style scoped lang="scss">
@import '../css/utils/variables';

.mo-prose {
  margin-top: clamp(28px, 4vw, 44px);
}

.mo-list li {
  color: $on-dark-muted;
}

.mo-letter {
  font-weight: 600;
  color: #fff;
}

.mo-photo {
  margin-top: clamp(32px, 4vw, 56px);
}
</style>
