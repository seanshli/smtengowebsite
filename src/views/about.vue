<template>
  <main>
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
            src="/images/family.jpeg"
            alt="core value background"
          />
        </div>
      </div>
    </section>
    <section id="mission" class="mission-section">
      <div class="mission-section-image-container">
        <img
          class="mission-section-image"
          src="/images/technology.jpeg"
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
    <section id="vision" class="vision-section">
      <div class="vision-section-container">
        <h2 class="section-title with-horizontal-strip-orange">{{ $t('visionTitle') }}</h2>
        <div class="vision-blocks-container">
          <div class="vision-block">
            <div class="vision-number vision-number-red">01</div>
            <img
              class="vision-image"
              src="/images/business-model-icon.svg"
              alt="business model icon"
            />
            <div class="vision-text">{{ $t('vision1') }}</div>
          </div>
          <div class="vision-block">
            <div class="vision-number vision-number-light-blue">02</div>
            <img
              class="vision-image"
              src="/images/artificial-intelligence-ai-icon.svg"
              alt="artificial intelligence ai icon"
            />
            <div class="vision-text">{{ $t('vision2') }}</div>
          </div>
          <div class="vision-block">
            <div class="vision-number vision-number-blue">03</div>
            <img class="vision-image" src="/images/sharing-icon.svg" alt="branding icon" />
            <div class="vision-text">{{ $t('vision3') }}</div>
          </div>
          <div class="vision-block">
            <div class="vision-number vision-number-green">04</div>
            <img
              class="vision-image"
              src="/images/shelf-shelves-icon.svg"
              alt="shelves icon"
            />
            <div class="vision-text">{{ $t('vision4') }}</div>
          </div>
          <div class="vision-block">
            <div class="vision-number vision-number-yellow">05</div>
            <img class="vision-image" src="/images/iot-icon.svg" alt="iot icon" />
            <div class="vision-text">{{ $t('vision5') }}</div>
          </div>
          <div class="vision-block">
            <div class="vision-number vision-number-red">06</div>
            <img class="vision-image" src="/images/engo-coin.svg" alt="enGo icon" />
            <div class="vision-text">{{ $t('vision6') }}</div>
          </div>
          <div class="vision-block">
            <div class="vision-number vision-number-light-blue">07</div>
            <img class="vision-image" src="/images/b2b2c.svg" alt="b2c framework icon" />
            <div class="vision-text">{{ $t('vision7') }}</div>
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
