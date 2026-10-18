<template>
  <div class="catalog-menu-overlay" v-if="isOpen" @click.self="close">
    <div class="catalog-menu-modal">
      <button class="close-btn" @click="close">×</button>
      <div class="menu-header">
        <h2>{{ $t('product.packages.otherOptions') || '其他選項 (目錄)' }}</h2>
      </div>
      
      <div class="menu-grid">
        <div 
          v-for="item in catalogItems" 
          :key="item.id" 
          class="menu-item"
          @click="selectItem(item)"
        >
          <div class="icon-wrapper">
            <img :src="getImageUrl(item.image)" :alt="item.name.zh" />
          </div>
          <h4 class="item-name">{{ (item.name as any)[locale] || item.name['zh'] }}</h4>
          <span class="view-details">{{ $t('product.viewDetails') || '查看詳情' }} →</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import packagesData from '@/data/packages.json'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'select'])
const { locale } = useI18n()

const catalogItems = computed(() => {
  return packagesData.catalog || []
})

const close = () => {
  emit('close')
}

const selectItem = (item: any) => {
  emit('select', item)
}

const getImageUrl = (name: string) => {
  if (name.startsWith('http')) return name
  return `/images/${name}`
}
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

// Apple-profile utility modal: white sheet on a scrim, parchment hairline cards (radius 18), no shadows.
.catalog-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.catalog-menu-modal {
  background: #fff;
  border-radius: 18px;
  width: 100%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  padding: 40px;
  font-family: $display-font;
  color: $ink;

  @media (max-width: 768px) {
    padding: 24px;
  }

  .close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 44px;
    height: 44px;
    font-size: 1.75rem;
    background: none;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    color: $ink-80;
    z-index: 10;
    line-height: 1;
    transition: transform 0.15s ease;

    &:hover { color: $ink; }
    &:active { transform: scale(0.95); }
    &:focus-visible { outline: 2px solid $brand-orange-text; outline-offset: 2px; }
  }
}

.menu-header {
  text-align: center;
  margin-bottom: 30px;
  h2 {
    margin: 0;
    font-size: clamp(1.5rem, 2.4vw, 2rem);
    letter-spacing: -0.02em;
    color: $ink;
    font-weight: 600;
  }
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.menu-item {
  background: $parchment;
  border: 1px solid $hairline;
  border-radius: 18px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.15s ease;

  &:active { transform: scale(0.95); }

  .icon-wrapper {
    width: 60px;
    height: 60px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }

  .item-name {
    font-size: 1.0625rem;
    font-weight: 600;
    letter-spacing: -0.022em;
    color: $ink;
    margin: 0 0 12px;
    line-height: 1.4;
  }

  .view-details {
    font-size: 1.0625rem;
    letter-spacing: -0.022em;
    color: $brand-orange-text;
  }
}

@media (prefers-reduced-motion: reduce) {
  .menu-item, .close-btn { transition: none; }
}
</style>
