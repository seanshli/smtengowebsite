<template>
  <div class="catalog-modal-overlay" v-if="isOpen" @click.self="close">
    <div class="catalog-modal">
      <button class="close-btn" @click="close">×</button>
      
      <div v-if="product" class="catalog-content">
        <div class="catalog-header">
          <h2>{{ (product.name as any)[locale] || product.name['zh'] }}</h2>
        </div>
        
        <div class="catalog-body">
          <div class="product-gallery">
            <img :src="getImageUrl(product.image)" class="main-img" />
          </div>
          
          <div class="product-info">
            <div class="description-section">
              <h3>{{ $t('product.description') || '產品介紹' }}</h3>
              <p>{{ (product.description as any)[locale] || product.description['zh'] }}</p>
            </div>
            
            <div class="specs-section">
              <h3>{{ $t('product.specs') || '產品規格' }}</h3>
              
              <table class="specs-table">
                <tbody>
                  <tr v-for="(val, key) in product.specs" :key="key" class="spec-row">
                    <td class="spec-label">{{ getSpecLabel(key) }}</td>
                    <td class="spec-value">{{ getSpecValue(val) }}</td>
                  </tr>
                </tbody>
              </table>
              
              <div v-if="product.spec_image" class="spec-image-container">
                <img :src="getImageUrl(product.spec_image)" class="spec-img-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  isOpen: boolean
  product: any
}>()

const emit = defineEmits(['close'])
const { locale, t } = useI18n()

const close = () => {
  emit('close')
}

const getImageUrl = (name: string) => {
  return `/images/${name}`
}

const getSpecLabel = (key: string | number) => {
  const keyStr = String(key)
  // Try to get translated label from locale
  const labelKey = `product.spec_labels.${keyStr}`
  const translated = t(labelKey)
  // If translation exists and is different from the key, use it
  return translated !== labelKey ? translated : keyStr
}

const getSpecValue = (val: any) => {
  // If val is an object with locale keys, extract the appropriate language
  if (val && typeof val === 'object' && (val.zh || val.en)) {
    return val[locale.value] || val['zh'] || val['en'] || JSON.stringify(val)
  }
  // Otherwise return as-is
  return val
}
</script>

<style scoped lang="scss">
.catalog-modal-overlay {
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

.catalog-modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  
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
    
    &:hover { color: #c46043; }
  }
}

.catalog-content {
  padding: 40px;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
}

.catalog-header {
  text-align: center;
  margin-bottom: 30px;
  
  h2 {
    font-size: 2rem;
    color: #043655;
    font-weight: 700;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
}

.catalog-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

.product-gallery {
  .main-img {
    width: 100%;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  }
}

.product-info {
  h3 {
    font-size: 1.2rem;
    color: #c46043;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
  }
  
  p {
    line-height: 1.6;
    color: #555;
    margin-bottom: 30px;
    white-space: pre-wrap;
  }
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #e0e0e0;
  margin-bottom: 20px;
  
  tbody {
    .spec-row {
      border-bottom: 1px solid #e0e0e0;
      
      &:last-child { 
        border-bottom: none; 
      }
      
      td {
        padding: 14px 16px;
        vertical-align: top;
        
        &.spec-label {
          color: #666;
          font-weight: 500;
          font-size: 0.95rem;
          width: 40%;
          background: #fafafa;
        }
        
        &.spec-value {
          color: #333;
          font-weight: 400;
          font-size: 0.95rem;
          width: 60%;
          line-height: 1.6;
        }
      }
    }
  }
}

.spec-image-container {
  margin-top: 20px;
  .spec-img-full {
    width: 100%;
    border-radius: 8px;
    border: 1px solid #eee;
  }
}
</style>
