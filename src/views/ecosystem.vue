<template>
  <!-- eco- namespace: previously a dark global-CSS shell (_ecosystem.scss);
       now an editorial page that owns its own layout. -->
  <section id="engo-ecosystem" class="eco-page">
    <header class="eco-mast">
      <p class="eco-kicker">enGo 生活誌</p>
      <h1 class="eco-title">{{ $t('ecosystemTitle') }}</h1>
      <p class="eco-sub fade-in">
        {{ isZh
          ? '雲端、設備與生活服務——一個平台，串起整個生態。'
          : 'Cloud, devices, and everyday services — one platform, one connected ecosystem.' }}
      </p>
    </header>

    <!-- The film, mounted like every other plate in the system -->
    <figure class="eco-plate fade-in">
      <div class="eco-video">
        <iframe
          src="https://www.youtube.com/embed/sKjo04dGmfg"
          :title="$t('ecosystemTitle')"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>
      <figcaption>
        <span class="eco-cap-brand">enGo</span>
        {{ isZh ? '智慧生態系影片' : 'ecosystem film' }}
      </figcaption>
    </figure>

    <!-- Where to next -->
    <div class="eco-links fade-in">
      <router-link to="/product" class="eco-link">
        {{ isZh ? '認識 enGo 產品' : 'Explore the products' }} →
      </router-link>
      <router-link to="/enviro" class="eco-link">
        {{ isZh ? '智慧環控方案' : 'Environmental control' }} →
      </router-link>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScrollReveal } from '../composables/useScrollReveal'

export default defineComponent({
  name: 'Ecosystem',
  setup() {
    const { locale } = useI18n()
    useScrollReveal('.fade-in', 'visible')
    const isZh = computed(() => locale.value.startsWith('zh'))
    return { isZh }
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

@media (prefers-reduced-motion: reduce) {
  .fade-in {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

.eco-page {
  background: $warm-bg-light;
  padding: 110px 5vw 100px;

  @media (max-width: 768px) {
    padding-top: 96px;
  }
}

.eco-mast {
  max-width: 1100px;
  margin: 0 auto 48px;
  border-top: 3px solid $grey-blue3;
  padding-top: 22px;
}

.eco-kicker {
  font-size: 1.02rem;
  font-weight: 800;
  letter-spacing: 0.28em;
  color: $brand-orange;
  margin-bottom: 8px;
}

.eco-title {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: clamp(2.4rem, 7vw, 4.6rem);
  line-height: 1.1;
  color: $grey-blue3;
  margin-bottom: 14px;
}

.eco-sub {
  font-size: clamp(1.16rem, 2vw, 1.42rem);
  font-weight: 500;
  line-height: 1.95;
  color: $grey-blue2;
  max-width: 34em;
}

// mounted plate, same device as every other page
.eco-plate {
  position: relative;
  max-width: 960px;
  margin: 0 auto 48px;

  &::before {
    content: '';
    position: absolute;
    inset: 14px -14px -14px 14px;
    border: 2px solid $brand-orange;
    z-index: 0;
  }
}

.eco-video {
  position: relative;
  z-index: 1;
  aspect-ratio: 16 / 9;
  border: 1px solid rgba($grey-blue3, 0.5);
  box-shadow: 0 18px 38px -22px rgba(21, 41, 57, 0.55);
  background: $grey-blue3;

  iframe {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.eco-plate figcaption {
  position: relative;
  z-index: 1;
  margin-top: 12px;
  font-size: 0.85rem;
  letter-spacing: 0.16em;
  color: $dark-grey;

  .eco-cap-brand {
    font-family: 'Noto Serif TC', serif;
    font-weight: 900;
    color: $brand-orange;
    margin-right: 6px;
  }
}

.eco-links {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 16px 36px;
}

.eco-link {
  font-family: 'Noto Serif TC', serif;
  font-weight: 700;
  font-size: 1.05rem;
  color: $grey-blue3;
  text-decoration: none;
  border-bottom: 2px solid $brand-orange;
  padding-bottom: 3px;
  transition: color 0.25s ease;

  &:hover {
    color: $brand-orange;
  }
}
</style>
