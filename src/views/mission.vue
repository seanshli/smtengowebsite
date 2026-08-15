<template>
  <!-- msn- namespace: the old class names collided with _about.scss's global
       .mission-section (display:flex row), which crushed this page into three
       side-by-side columns. The About page keeps those globals untouched. -->
  <section id="mission" class="msn-page">
    <!-- Editorial masthead -->
    <header class="msn-mast">
      <p class="msn-kicker">enGo 生活誌</p>
      <h1 class="msn-title">{{ $t('missionTitle') }}</h1>
      <p class="msn-sub fade-in">{{ $t('missionSubtitle') }}</p>
    </header>

    <!-- Mission statement as a pull-quote beside the family plate -->
    <div class="msn-feature">
      <blockquote class="msn-quote fade-in">
        <p>{{ $t('fiveValues') }}</p>
      </blockquote>
      <figure class="msn-figure fade-in">
        <img src="/images/mission-family.jpg" :alt="$t('missionTitle')" loading="lazy" />
      </figure>
    </div>

    <!-- Three values as mounted plates -->
    <div class="msn-values">
      <div class="msn-card fade-in" v-html="$t('fiveValues1')"></div>
      <div class="msn-card fade-in" v-html="$t('fiveValues2')"></div>
      <div class="msn-card fade-in" v-html="$t('fiveValues3')"></div>
    </div>

    <!-- Closing statement: navy band, serif, orange accents -->
    <div class="msn-closing">
      <div class="msn-closing-inner fade-in">
        <p v-html="$t('missionConclusion')"></p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Mission',
  setup() {
    const { locale } = useI18n()

    onMounted(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      }, { threshold: 0.15 })

      document.querySelectorAll('.fade-in').forEach(el => observer.observe(el))
    })

    return {
      locale
    }
  }
})
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

.fade-in {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

.msn-page {
  background: $warm-bg-light;
  padding: 110px 5vw 0;

  @media (max-width: 768px) {
    padding-top: 96px;
  }
}

// ─── masthead ───
.msn-mast {
  max-width: 1100px;
  margin: 0 auto 56px;
  border-top: 3px solid $grey-blue3;
  padding-top: 22px;
}

.msn-kicker {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  color: $brand-orange;
  margin-bottom: 6px;
}

.msn-title {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: clamp(2.4rem, 7vw, 4.6rem);
  line-height: 1.1;
  color: $grey-blue3;
  margin-bottom: 14px;
}

.msn-sub {
  font-size: clamp(1.02rem, 1.8vw, 1.25rem);
  line-height: 2;
  color: #454545;
  max-width: 36em;
}

// ─── pull-quote + family plate ───
.msn-feature {
  max-width: 1100px;
  margin: 0 auto 72px;
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: clamp(28px, 5vw, 72px);
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.msn-quote {
  margin: 0;
  border-left: 3px solid $brand-orange;
  padding-left: clamp(20px, 3vw, 36px);

  p {
    font-family: 'Noto Serif TC', serif;
    font-weight: 700;
    font-size: clamp(1.3rem, 2.8vw, 2rem);
    line-height: 1.9;
    color: $grey-blue2;
  }
}

// mounted plate, same device as the homepage hero and /cases cards
.msn-figure {
  position: relative;
  margin: 0;

  img {
    display: block;
    position: relative;
    z-index: 1;
    width: 100%;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    border: 1px solid rgba($grey-blue3, 0.35);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 14px -14px -14px 14px;
    border: 2px solid $brand-orange;
    z-index: 0;
  }

  @media (max-width: 900px) {
    max-width: 440px;

    img {
      aspect-ratio: 16 / 10;
    }
  }
}

// ─── value plates ───
.msn-values {
  max-width: 1100px;
  margin: 0 auto;
  padding-bottom: 90px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 26px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 18px;
    padding-bottom: 56px;
  }
}

.msn-card {
  position: relative;
  background: $warm-bg-light;
  border: 1px solid rgba($grey-blue3, 0.32);
  padding: 30px 28px;
  font-size: 1rem;
  line-height: 1.95;
  color: #4c4c4c;
  transition: transform 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 8px -8px -8px 8px;
    border: 2px solid transparent;
    transition: border-color 0.3s ease;
    z-index: -1;
  }

  &:hover {
    transform: translate(-3px, -3px);

    &::before {
      border-color: $brand-orange;
    }
  }

  // the locale strings mark card titles with <font color="e05a35">
  :deep(font[color='e05a35']) {
    display: block;
    font-family: 'Noto Serif TC', serif;
    font-weight: 900;
    font-size: 1.3rem;
    color: $brand-orange;
    margin-bottom: 10px;
  }
}

// ─── closing band ───
.msn-closing {
  background: $grey-blue3;
  margin: 0 -5vw;
  padding: 84px 5vw;
  text-align: center;
}

.msn-closing-inner {
  max-width: 760px;
  margin: 0 auto;

  p {
    font-family: 'Noto Serif TC', serif;
    font-weight: 700;
    font-size: clamp(1.2rem, 2.6vw, 1.7rem);
    line-height: 2.1;
    color: $warm-bg-light;
  }

  :deep(font[color='e05a35']) {
    color: $orange2;
    font-weight: 900;
  }
}
</style>
