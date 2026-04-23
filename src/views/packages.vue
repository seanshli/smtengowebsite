<template>
  <section class="packages-page w-100 pt-70">
    <div id="packages-wrapper" style="background-color: #f8fafd; width: 100%; border-top: 1px solid #e1e8ef;">
      <!-- 套裝方案 -->
      <div id="packages" class="package-section container py-100 py-mob-60">
        <div class="tag as-fs mb-32">
          <img src="/assets/layers.svg" alt="Package Plans icon" />
          <span>{{ $t('product.packages.tag') || '套裝方案' }}</span>
        </div>
        <h2 class="fz-48 fw-700 text-grey-blue mb-56 tac">{{ $t('product.packages.title') || '挑選最適合您的智慧家庭方案' }}</h2>
        
        <div class="package-grid">
          <div v-for="pkg in packages.main_packages" :key="pkg.id" class="package-card card-hover scroll-reveal">
            <div class="p-card-header">
              <h3 class="pkg-name">{{ (pkg.name as any)[locale] || pkg.name['zh'] }}</h3>
              <p class="pkg-usage">{{ (pkg.suggested_usage as any)[locale] || pkg.suggested_usage['zh'] }}</p>
              <div class="pkg-price">{{ pkg.price }}</div>
            </div>
            
            <div class="p-card-body">
              <div class="spec-group">
                <h4>{{ $t('product.packages.functions') || '核心功能' }}</h4>
                <ul>
                  <li v-for="f in ((pkg.functions as any)[locale] || pkg.functions['zh'])" :key="f">{{ f }}</li>
                </ul>
              </div>
              
              <div class="spec-group">
                <h4>{{ $t('product.packages.scenarios') || '情境控制' }}</h4>
                <ul>
                  <li v-for="s in ((pkg.scenarios as any)[locale] || pkg.scenarios['zh'])" :key="s">{{ s }}</li>
                </ul>
              </div>
              
              <div class="spec-group">
                <h4>{{ $t('product.packages.components') || '套裝組件' }}</h4>
                <ul>
                  <li v-for="c in ((pkg.components as any)[locale] || pkg.components['zh'])" :key="c">{{ c }}</li>
                </ul>
              </div>
            </div>

            <div class="p-card-footer">
              <button class="buy-pkg-btn" @click="buyNow">{{ $t('product.purchase.btn') }}</button>
            </div>
          </div>
        </div>

        <!-- 可增選套裝方案 -->
        <h3 class="fz-32 fw-700 text-grey-blue mt-100 mb-48 tac">{{ $t('product.packages.addOns') }}</h3>
        <div class="addon-grid">
           <div v-for="pkg in packages.add_on_packages" :key="pkg.id" class="addon-card scroll-reveal">
            <h4 class="addon-name">{{ (pkg.name as any)[locale] || pkg.name['zh'] }}</h4>
            <ul class="addon-specs">
              <li v-for="item in ((pkg.components as any)[locale] || pkg.components['zh'])" :key="item">{{ item }}</li>
            </ul>
            <div class="addon-footer">
               <button class="buy-addon-btn" @click="buyNow">{{ $t('product.purchase.btn') }}</button>
            </div>
          </div>
          
          <!-- Catalog Menu Trigger -->
          <div class="addon-card other-link" @click="openCatalogMenu">
            <h4 class="addon-name">{{ $t('product.packages.otherOptions') }}</h4>
            <div class="catalog-icon">
              <img src="/assets/file-badge.svg" alt="Catalog" />
            </div>
            <p class="tac text-grey-666 fz-14 px-20">{{ $t('product.viewDetails') || '查看所有產品' }}</p>
          </div>
        </div>
      </div>

      <!-- 產品評論區 (RWD layout) -->
      <div class="product-reviews container py-80 py-mob-40">
        <h2 class="fz-48 fw-700 text-grey-blue mb-40 tac">{{ $t('product.reviews.title') || '用戶評價' }}</h2>
        
        <div class="reviews-container">
          <!-- 評論列表區塊 -->
          <div class="reviews-list-wrapper">
            <div class="reviews-list mb-60">
              <div v-for="(review, index) in reviews" :key="index" class="review-item p-24 mb-20 bg-white shadow-sm border-radius-15 scroll-reveal">
                <div class="d-flex jc-sb ai-c mb-12">
                  <span class="user-name fw-700">{{ review.name }}</span>
                  <span class="review-date fz-14 text-grey">{{ review.date }}</span>
                </div>
                <p class="review-text fz-16 lh-24">{{ review.comment }}</p>
              </div>
            </div>
          </div>
          
          <!-- 發表評論區塊 -->
          <div class="add-review-wrapper">
            <div class="add-review p-32 bg-grey-blue2 text-white border-radius-20">
              <h3 class="fz-24 mb-20">{{ $t('product.reviews.add') || '發表評論' }}</h3>
              <form @submit.prevent="submitReview">
                <div class="mb-16">
                  <input v-model="newReview.name" type="text" placeholder="您的姓名" class="w-100 p-12 border-radius-8 border-none" required />
                </div>
                <div class="mb-16">
                  <textarea v-model="newReview.comment" placeholder="您的寶貴意見..." class="w-100 p-12 border-radius-8 border-none" rows="4" required></textarea>
                </div>
                <button type="submit" class="bg-orange2 text-white border-none py-12 px-32 border-radius-30 fw-500 cursor-pointer hover-scale">
                  {{ $t('submitForm') }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <CatalogMenu
      v-if="isCatalogMenuOpen"
      :isOpen="isCatalogMenuOpen"
      @close="closeCatalogMenu"
      @select="selectCatalogProduct"
    />

    <ProductCatalog 
      v-if="isCatalogOpen" 
      :isOpen="isCatalogOpen" 
      :product="selectedCatalogItem" 
      @close="closeCatalog" 
    />
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useAnalytics } from '@/utils/analytics'
import { useI18n } from 'vue-i18n'
import { useScrollReveal } from '@/composables/useScrollReveal'
import packagesData from '@/data/packages.json'

export default defineComponent({
  name: 'PackagesView',
  components: {
    ProductCatalog: defineAsyncComponent(() => import('@/components/ProductCatalog.vue')),
    CatalogMenu: defineAsyncComponent(() => import('@/components/CatalogMenu.vue'))
  },
  setup() {
    const { t, locale } = useI18n()
    const packages = ref(packagesData)
    const router = useRouter()
    const { trackEvent } = useAnalytics()

    // Initialize scroll reveal animations
    useScrollReveal()

    const buyNow = () => {
      window.open('https://h5.smtengo.com/pages/item/espier-detail?id=435&dtid=0')
    }

    const isCatalogOpen = ref(false)
    const isCatalogMenuOpen = ref(false)
    const selectedCatalogItem = ref(null)

    const openCatalogMenu = () => {
      isCatalogMenuOpen.value = true
    }

    const closeCatalogMenu = () => {
      isCatalogMenuOpen.value = false
    }

    const selectCatalogProduct = (item: any) => {
      selectedCatalogItem.value = item
      isCatalogMenuOpen.value = false
      setTimeout(() => {
        isCatalogOpen.value = true
      }, 100)
    }

    const closeCatalog = () => {
      isCatalogOpen.value = false
      selectedCatalogItem.value = null
    }

    const reviews = ref([
      { name: t('product.reviews.sample1.name'), date: '2024-05-20', comment: t('product.reviews.sample1.comment') },
      { name: t('product.reviews.sample2.name'), date: '2024-06-15', comment: t('product.reviews.sample2.comment') }
    ])
    const newReview = ref({ name: '', comment: '' })

    const submitReview = () => {
      const today = new Date().toISOString().split('T')[0]
      reviews.value.unshift({ ...newReview.value, date: today })
      trackEvent('submit_product_review', { name: newReview.value.name })
      newReview.value = { name: '', comment: '' }
      alert('感謝您的評價！')
    }

    return {
      buyNow,
      reviews,
      newReview,
      submitReview,
      packages,
      locale,
      isCatalogOpen,
      isCatalogMenuOpen,
      selectedCatalogItem,
      openCatalogMenu,
      closeCatalogMenu,
      selectCatalogProduct,
      closeCatalog
    }
  }
})
</script>

<style scoped lang="scss">
.package-section {
  .package-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    @media (max-width: 1024px) {
      grid-template-columns: repeat(1, 1fr);
      max-width: 500px;
      margin: 0 auto;
    }
  }

  .package-card {
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 24px;
    padding: 40px;
    height: 100%;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 50px rgba(0,0,0,0.1);
      border-color: #043655;
      background: #043655;
      color: white;
      .p-card-header {
        .pkg-name { color: #c46043; }
        .pkg-usage { color: #fff; }
      }
      .p-card-body {
        .spec-group ul li { color: #fff; }
      }
      .buy-pkg-btn { background: #c46043; color: #fff; }
    }

    .p-card-header {
      margin-bottom: 30px;
      text-align: center;
      .pkg-name { font-size: 1.8rem; font-weight: 700; color: #043655; margin-bottom: 8px; }
      .pkg-usage { font-size: 1rem; margin-bottom: 16px; font-weight: 500; color: #666; }
      .pkg-price { font-size: 2rem; font-weight: 800; color: #c46043; }
    }

    .p-card-body {
      flex: 1;
      .spec-group {
        margin-bottom: 24px;
        h4 { 
          font-size: 1.1rem; 
          font-weight: 700; 
          margin-bottom: 12px; 
          color: #c46043;
          border-bottom: 1px solid #eee;
          padding-bottom: 8px;
        }
        ul {
          list-style: none;
          padding: 0;
          li {
            font-size: 0.95rem;
            margin-bottom: 8px;
            position: relative;
            padding-left: 20px;
            color: #555;
            &::before {
              content: '✓';
              position: absolute;
              left: 0;
              color: #c46043;
            }
          }
        }
      }
    }

    .p-card-footer {
      margin-top: 20px;
      .buy-pkg-btn {
        width: 100%;
        padding: 16px;
        border-radius: 30px;
        border: none;
        background: #c46043;
        color: white;
        font-weight: 700;
        font-size: 1.1rem;
        cursor: pointer;
        transition: opacity 0.3s;
        &:hover { opacity: 0.9; }
      }
    }
  }

  .addon-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      max-width: 500px;
      margin: 0 auto;
    }

    .addon-card {
      background: #fff8f5;
      border: 1px solid #f9e1d8;
      border-radius: 20px;
      padding: 30px;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;

      &.other-link {
        border-style: dashed;
        cursor: pointer;
        background: #fdfdfd;
        justify-content: center;
        align-items: center;
        &:hover { background: #fff; transform: scale(1.02); }
        .catalog-icon {
          width: 50px;
          margin: 15px 0;
          opacity: 0.7;
          img { width: 100%; }
        }
      }

      &:hover:not(.other-link) {
        border-color: #c46043;
        box-shadow: 0 8px 24px rgba(196, 96, 67, 0.1);
      }

      .addon-name {
        color: #c46043;
        font-size: 1.3rem;
        font-weight: 700;
        margin-bottom: 20px;
        text-align: center;
      }

      .addon-specs {
        list-style: none;
        padding: 0;
        margin: 0;
        flex: 1;
        li {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 10px;
          position: relative;
          padding-left: 18px;
          line-height: 1.4;
          &::before {
            content: '+';
            position: absolute;
            left: 0;
            color: #d4a753;
            font-weight: bold;
          }
        }
      }

      .addon-footer {
        margin-top: 24px;
        .buy-addon-btn {
          width: 100%;
          padding: 12px;
          border-radius: 25px;
          border: 1px solid #c46043;
          background: transparent;
          color: #c46043;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          &:hover {
            background: #c46043;
            color: white;
          }
        }
      }
    }
  }
}

.product-reviews {
  .reviews-container {
    display: flex;
    gap: 40px;
    align-items: flex-start;
    
    @media (max-width: 1024px) {
      flex-direction: column;
    }
  }
  
  .reviews-list-wrapper {
    flex: 1;
    width: 100%;
  }

  .add-review-wrapper {
    flex: 1;
    width: 100%;
    position: sticky;
    top: 100px;
    
    @media (max-width: 1024px) {
      position: static;
    }
  }

  .review-item {
    transition: transform 0.2s;
    &:hover {
      transform: translateY(-2px);
    }
  }

  .add-review form {
    input, textarea {
      width: 100%;
      box-sizing: border-box;
      font-family: inherit;
    }
  }
}
</style>
