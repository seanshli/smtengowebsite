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
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  padding: 40px;

  @media (max-width: 768px) {
    padding: 24px;
  }

  .close-btn {
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: 2rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    z-index: 10;
    line-height: 1;
    
    &:hover { color: #c46043; }
  }
}

.menu-header {
  text-align: center;
  margin-bottom: 30px;
  h2 {
    font-size: 1.8rem;
    color: #043655;
    font-weight: 700;
  }
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.menu-item {
  background: #f8f9fa;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    border-color: #c46043;
    
    .view-details {
      color: #c46043;
      opacity: 1;
    }
  }

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
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
    line-height: 1.4;
  }

  .view-details {
    font-size: 0.85rem;
    color: #888;
    opacity: 0.7;
    transition: all 0.2s;
  }
}
</style>
