<template>
  <main class="ap-page about-page">
    <!-- tile 1, white: core value -->
    <section id="core-value" class="ap-tile ap-tile-first ap-white">
      <div class="ap-wrap ap-wrap-text">
        <h2 class="ap-title">{{ $t('coreValueTitle') }}</h2>
        <p class="ap-lead">{{ $t('coreValueSubtitle') }}</p>
        <div class="ap-prose about-prose">
          <p v-html="$t('coreValueDescribe')"></p>
          <ol class="about-list">
            <li>{{ $t('coreValue1') }}</li>
            <li>{{ $t('coreValue2') }}</li>
            <li>{{ $t('coreValue3') }}</li>
          </ol>
          <p>
            {{ $t('coreValueConclusion') }}
          </p>
        </div>
        <figure class="ap-photo about-photo">
          <img src="/images/family.jpeg" alt="core value background" />
        </figure>
      </div>
    </section>

    <!-- tile 2, dark: mission -->
    <section id="mission" class="ap-tile ap-dark">
      <div class="ap-wrap ap-wrap-text">
        <h2 class="ap-h2">{{ $t('missionTitle') }}</h2>
        <p class="ap-lead">{{ $t('missionSubtitle') }}</p>
        <div class="ap-prose about-prose">
          <p v-if="locale == 'zh'">{{ $t('fiveValues') }}</p>

          <ul class="ap-rows about-mission-list">
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

    <!-- tile 3, parchment: vision -->
    <section id="vision" class="ap-tile ap-parchment">
      <div class="ap-wrap">
        <div class="ap-head ap-center">
          <h2 class="ap-h2">{{ $t('visionTitle') }}</h2>
        </div>
        <div class="ap-grid ap-grid-3">
          <div class="ap-card about-vision">
            <img class="about-vision-icon" src="/images/business-model-icon.svg" alt="business model icon" />
            <p class="ap-body">{{ $t('vision1') }}</p>
          </div>
          <div class="ap-card about-vision">
            <img class="about-vision-icon" src="/images/artificial-intelligence-ai-icon.svg" alt="artificial intelligence ai icon" />
            <p class="ap-body">{{ $t('vision2') }}</p>
          </div>
          <div class="ap-card about-vision">
            <img class="about-vision-icon" src="/images/sharing-icon.svg" alt="branding icon" />
            <p class="ap-body">{{ $t('vision3') }}</p>
          </div>
          <div class="ap-card about-vision">
            <img class="about-vision-icon" src="/images/shelf-shelves-icon.svg" alt="shelves icon" />
            <p class="ap-body">{{ $t('vision4') }}</p>
          </div>
          <div class="ap-card about-vision">
            <img class="about-vision-icon" src="/images/iot-icon.svg" alt="iot icon" />
            <p class="ap-body">{{ $t('vision5') }}</p>
          </div>
          <div class="ap-card about-vision">
            <img class="about-vision-icon" src="/images/engo-coin.svg" alt="enGo icon" />
            <p class="ap-body">{{ $t('vision6') }}</p>
          </div>
          <div class="ap-card about-vision">
            <img class="about-vision-icon" src="/images/b2b2c.svg" alt="b2c framework icon" />
            <p class="ap-body">{{ $t('vision7') }}</p>
          </div>
        </div>
      </div>
    </section>
    <ecosystem></ecosystem>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import ecosystem from './ecosystem.vue'

export default defineComponent({
  name: 'About',
  components: { ecosystem },
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

.about-prose {
  margin-top: clamp(28px, 4vw, 44px);
}

.about-list {
  margin: 0 0 24px;
  padding-left: 1.4em;
  color: $ink-80;
  line-height: 1.75;
}

.about-photo {
  margin-top: clamp(32px, 4vw, 56px);
  max-width: 560px;
}

.about-mission-list li {
  font-weight: 400;
  color: $on-dark-muted;
}

.mission-first-letter2 {
  font-weight: 600;
  color: #fff;
}

.about-vision {
  padding: 28px;
}

.about-vision-icon {
  display: block;
  width: 56px;
  height: 56px;
  margin-bottom: 16px;
}
</style>
