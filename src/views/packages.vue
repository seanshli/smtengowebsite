<template>
  <section class="packages-page">
    <div id="packages-wrapper">
      <!-- 套裝方案 (white tile): centered head, then the three package cards -->
      <section id="packages" class="pk-tile pk-white package-section">
        <div class="pk-wrap">
          <header class="pk-head">
            <h1 class="pk-title">{{ $t('product.packages.tag') || '套裝方案' }}</h1>
            <p class="pk-lead">{{ $t('product.packages.title') || '挑選最適合您的智慧家庭方案' }}</p>
          </header>

          <div class="package-grid">
            <div v-for="(pkg, idx) in packages.main_packages" :key="pkg.id" class="package-card scroll-reveal" :class="{ featured: idx === 1 }">
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
        </div>
      </section>

      <!-- 可增選套裝方案 (parchment tile) -->
      <section id="addons" class="pk-tile pk-parchment package-section">
        <div class="pk-wrap">
          <header class="pk-head">
            <h2 class="pk-h2">{{ $t('product.packages.addOns') }}</h2>
          </header>
          <div class="addon-grid">
            <div v-for="pkg in packages.add_on_packages" :key="pkg.id" class="addon-card scroll-reveal">
              <h3 class="addon-name">{{ (pkg.name as any)[locale] || pkg.name['zh'] }}</h3>
              <ul class="addon-specs">
                <li v-for="item in ((pkg.components as any)[locale] || pkg.components['zh'])" :key="item">{{ item }}</li>
              </ul>
              <div class="addon-footer">
                <button class="buy-addon-btn" @click="buyNow">{{ $t('product.purchase.btn') }}</button>
              </div>
            </div>

            <!-- Catalog Menu Trigger -->
            <div class="addon-card other-link" @click="openCatalogMenu">
              <h3 class="addon-name">{{ $t('product.packages.otherOptions') }}</h3>
              <div class="catalog-icon">
                <img src="/assets/file-badge.svg" alt="Catalog" />
              </div>
              <p class="catalog-hint">{{ $t('product.viewDetails') || '查看所有產品' }}</p>
            </div>
          </div>
        </div>
      </section>
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
import { openShop } from '@/utils/shopUrl'
import packagesData from '@/data/packages.json'

export default defineComponent({
  name: 'PackagesView',
  components: {
    ProductCatalog: defineAsyncComponent(() => import('@/components/ProductCatalog.vue')),
    CatalogMenu: defineAsyncComponent(() => import('@/components/CatalogMenu.vue'))
  },
  setup() {
    const { locale } = useI18n()
    const packages = ref(packagesData)
    const router = useRouter()
    const { trackEvent } = useAnalytics()

    // Initialize scroll reveal animations
    useScrollReveal()

    const buyNow = () => {
      trackEvent('buy_now_click', {
        product_id: '435',
        product_category: 'packages',
        platform: 'h5_smtengo',
        locale: locale.value
      })
      openShop()
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

    return {
      buyNow,
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
@import '../css/utils/variables';

// Apple-profile tiles (DESIGN.md + src/views/index.vue): white then parchment, edge to edge,
// parchment hairline cards (white on the parchment tile so the card edge still reads), no shadow.
.packages-page { background: #fff; color: $ink; font-family: $display-font; }
.packages-page a:focus-visible, .packages-page button:focus-visible { outline: 2px solid $brand-orange-text; outline-offset: 3px; }

.pk-wrap { max-width: 1240px; margin: 0 auto; padding-inline: clamp(20px, 5vw, 64px); }
.pk-tile { padding: clamp(64px, 9vw, 112px) 0; }
.pk-white { background: #fff; }
.pk-parchment { background: $parchment; }
// the first tile sits under the fixed header
#packages { padding-top: clamp(104px, 11vw, 136px); }

.pk-head { text-align: center; margin-bottom: clamp(36px, 5vw, 64px); }
.pk-title {
  font-family: $display-font; font-weight: 600; letter-spacing: -.03em; line-height: 1.05; color: $ink; margin: 0;
  font-size: clamp(2.6rem, 6.4vw, 5rem);
}
.pk-h2 {
  font-family: $display-font; font-weight: 600; letter-spacing: -.02em; line-height: 1.1; color: $ink; margin: 0;
  font-size: clamp(2rem, 3.6vw, 3rem);
}
.pk-lead { font-size: clamp(1.15rem, 1.7vw, 1.5rem); font-weight: 400; line-height: 1.4; letter-spacing: -.005em; color: $ink; margin: 14px auto 0; max-width: 34em; }

.package-section {
  .package-grid {
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px;
    @media (max-width: 1024px) { grid-template-columns: 1fr; max-width: 520px; margin: 0 auto; }
  }

  .package-card {
    display: flex; flex-direction: column; height: 100%; padding: 36px;
    background: $parchment; border: 1px solid $hairline; border-radius: 18px; color: $ink;
    &.featured { border-color: $ink; }
    @media (max-width: 480px) { padding: 28px 22px; }

    .p-card-header {
      margin-bottom: 28px; text-align: center;
      .pkg-name { font-family: $display-font; font-size: 1.75rem; font-weight: 600; letter-spacing: -.02em; line-height: 1.2; color: $ink; margin: 0 0 8px; }
      .pkg-usage { font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; color: $ink-80; margin: 0 0 16px; }
      .pkg-price { font-family: $display-font; font-size: clamp(2rem, 3vw, 2.5rem); font-weight: 600; letter-spacing: -.03em; line-height: 1.1; color: $ink; }
    }

    .p-card-body {
      flex: 1;
      .spec-group {
        margin-bottom: 24px;
        h4 { font-size: 1.0625rem; font-weight: 600; letter-spacing: -.022em; margin: 0 0 10px; padding-bottom: 8px; color: $ink; border-bottom: 1px solid $hairline; }
        ul {
          list-style: none; padding: 0; margin: 0;
          li {
            position: relative; padding-left: 22px; margin-bottom: 8px; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; color: $ink-80;
            &::before { content: '✓'; position: absolute; left: 0; color: $ink; }
          }
        }
      }
    }

    .p-card-footer {
      margin-top: 20px;
      .buy-pkg-btn {
        width: 100%; min-height: 44px; padding: 11px 22px; border-radius: 9999px; border: 1px solid transparent; cursor: pointer;
        background: $brand-orange-text; color: #fff; font-family: inherit; font-size: 1.0625rem; font-weight: 400; letter-spacing: -.022em;
        transition: transform .15s ease, background .2s ease;
        &:hover { background: darken($brand-orange-text, 6%); }
        &:active { transform: scale(.95); }
      }
    }
  }

  .addon-grid {
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px;
    @media (max-width: 1024px) { grid-template-columns: 1fr; max-width: 520px; margin: 0 auto; }

    .addon-card {
      display: flex; flex-direction: column; padding: 32px; background: #fff; border: 1px solid $hairline; border-radius: 18px; color: $ink;

      &.other-link {
        cursor: pointer; justify-content: center; align-items: center; transition: transform .15s ease;
        &:active { transform: scale(.98); }
        .catalog-icon { width: 44px; margin: 14px 0; img { width: 100%; filter: brightness(0); opacity: .85; } }
        .catalog-hint { margin: 0; text-align: center; font-size: 1.0625rem; letter-spacing: -.022em; color: $brand-orange-text; }
      }

      .addon-name { font-family: $display-font; font-size: 1.3125rem; font-weight: 600; letter-spacing: -.01em; line-height: 1.25; color: $ink; margin: 0 0 20px; text-align: center; }

      .addon-specs {
        list-style: none; padding: 0; margin: 0; flex: 1;
        li {
          position: relative; padding-left: 20px; margin-bottom: 10px; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; color: $ink-80;
          &::before { content: '+'; position: absolute; left: 0; color: $ink; font-weight: 600; }
        }
      }

      .addon-footer {
        margin-top: 24px;
        .buy-addon-btn {
          width: 100%; min-height: 44px; padding: 11px 22px; border-radius: 9999px; border: 1px solid $brand-orange-text; cursor: pointer;
          background: transparent; color: $brand-orange-text; font-family: inherit; font-size: 1.0625rem; font-weight: 400; letter-spacing: -.022em;
          transition: transform .15s ease, background .2s ease;
          &:hover { background: rgba($brand-orange, .06); }
          &:active { transform: scale(.95); }
        }
      }
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .package-card, .addon-card, .buy-pkg-btn, .buy-addon-btn { transition: none; }
}
</style>
