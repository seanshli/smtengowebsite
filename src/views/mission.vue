<template>
  <section id="mission" class="mission-section">
    <!-- Hero area with image -->
    <div class="mission-hero">
      <div class="mission-section-image-container">
        <img
          class="mission-section-image"
          src="/images/technology.jpeg"
          alt="enGo smart home technology"
        />
        <div class="image-gradient-overlay"></div>
      </div>
      <div class="mission-hero-text">
        <h2 class="section-title with-vertical-strip-white text-color-white">
          {{ $t('missionTitle') }}
        </h2>
        <p class="mission-subtitle fade-in">
          {{ $t('missionSubtitle') }}
        </p>
      </div>
    </div>

    <!-- Core Values Cards -->
    <div class="mission-values-section">
      <div class="values-intro fade-in">
        <p>{{ $t('fiveValues') }}</p>
      </div>
      <div class="values-cards">
        <div class="value-card fade-in" v-html="$t('fiveValues1')"></div>
        <div class="value-card fade-in" v-html="$t('fiveValues2')"></div>
        <div class="value-card fade-in" v-html="$t('fiveValues3')"></div>
      </div>
    </div>

    <!-- Closing Statement -->
    <div class="mission-closing">
      <div class="mission-closing-content fade-in">
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
.fade-in {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

@keyframes floatOrb {
  0%, 100% {
    transform: translate(0px, 0px);
  }
  33% {
    transform: translate(30px, -40px);
  }
  66% {
    transform: translate(-20px, 30px);
  }
}

.mission-section {
  width: 100%;
  height: auto !important;
  overflow: visible !important;
}

.mission-hero {
  position: relative;
  min-height: 420px;
  display: flex;
  align-items: center;
  overflow: hidden;

  @media (max-width: 768px) {
    min-height: 320px;
  }

  // Floating decorative orb — top-left
  &::before {
    content: '';
    position: absolute;
    top: -5%;
    left: -8%;
    width: 350px;
    height: 350px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(254, 139, 5, 0.15), transparent 65%);
    animation: floatOrb 9s ease-in-out infinite;
    pointer-events: none;
    z-index: 2;
  }

  // Floating decorative orb — bottom-right
  &::after {
    content: '';
    position: absolute;
    bottom: -10%;
    right: -5%;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(224, 90, 53, 0.12), transparent 65%);
    animation: floatOrb 12s ease-in-out infinite reverse;
    pointer-events: none;
    z-index: 2;
  }
}

.mission-section-image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  // Additional floating orb accent
  &::before {
    content: '';
    position: absolute;
    top: 30%;
    right: 15%;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59, 190, 255, 0.08), transparent 70%);
    animation: floatOrb 11s ease-in-out infinite;
    pointer-events: none;
    z-index: 1;
  }
}

.mission-section-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(34, 66, 116, 0.5) 0%, rgba(224, 90, 53, 0.35) 50%, rgba(254, 139, 5, 0.2) 100%);
}

.mission-hero-text {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
  padding: 80px 40px;

  @media (max-width: 768px) {
    padding: 50px 20px;
  }
}

.mission-subtitle {
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.25rem;
  line-height: 2;
  margin-top: 24px;
  font-weight: 400;
  letter-spacing: 0.02em;

  @media (max-width: 768px) {
    font-size: 1.05rem;
  }
}

.mission-values-section {
  max-width: 100%;
  padding: 70px 40px;
  background: #fff;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
}

.values-intro {
  text-align: center;
  margin-bottom: 48px;

  p {
    font-size: 1.2rem;
    line-height: 1.9;
    color: #222;
    font-weight: 500;
    max-width: 700px;
    margin: 0 auto;
  }
}

.values-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

.value-card {
  background: white;
  border-radius: 16px;
  padding: 32px 28px;
  box-shadow: 0 4px 24px rgba(224, 90, 53, 0.08);
  border: 1px solid #f0e8e4;
  font-size: 1.05rem;
  line-height: 1.9;
  color: #444;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(224, 90, 53, 0.14);
  }

  :deep(font[color="e05a35"]) {
    color: #e05a35;
    font-weight: 700;
    font-size: 1.15rem;
    display: block;
    margin-bottom: 8px;
  }

  @media (max-width: 768px) {
    padding: 24px 20px;
  }
}

.mission-closing {
  background: linear-gradient(135deg, #fff8f5, #fef3ee);
  padding: 60px 40px;
  text-align: center;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
}

.mission-closing-content {
  max-width: 700px;
  margin: 0 auto;

  p {
    font-size: 1.2rem;
    line-height: 2;
    color: #333;
    font-weight: 500;
  }

  :deep(font[color="e05a35"]) {
    color: #e05a35;
    font-weight: 700;
    font-size: 1.3rem;
  }

  @media (max-width: 768px) {
    p {
      font-size: 1.05rem;
    }

    :deep(font[color="e05a35"]) {
      font-size: 1.1rem;
    }
  }
}
</style>
