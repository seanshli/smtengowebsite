/**
 * Product JSON-LD schema injection for SEO rich results.
 *
 * Injects schema.org/Product structured data into <head> for each of enGo's
 * three products: AI Smart Hub tablet, 水維氧 water purifier, and the
 * EAP-01 air purifier. Schemas are re-injected on locale change so content
 * stays in sync with the visible language.
 *
 * Used by src/views/product.vue via onMounted + watch(locale) lifecycle.
 */

type Locale = 'zh' | 'zhCN' | 'en' | 'fr' | 'ja' | 'es'

const BASE_URL = 'https://www.smtengo.com'
const PRODUCT_URL = `${BASE_URL}/product`
const BRAND = {
  '@type': 'Brand' as const,
  name: 'enGo智管家',
  url: BASE_URL
}

interface LocalizedField {
  zh: string
  zhCN: string
  en: string
  fr: string
  ja: string
  es: string
}

interface ProductDef {
  id: string
  sku: string
  anchor: string // URL fragment on /product
  image: string // absolute URL to primary image
  priceTWD: number | null // null = contact for quote / not publicly priced
  name: LocalizedField
  description: LocalizedField
}

const PRODUCTS: ProductDef[] = [
  {
    id: 'engo-hub',
    sku: 'ENGO-HUB',
    anchor: 'tablet',
    image: `${BASE_URL}/images/product/engo-hub.jpg`,
    priceTWD: 8000, // early-bird promo; MSRP 12,000 TWD
    name: {
      zh: 'enGo AI智慧中控平板',
      zhCN: 'enGo AI智慧中控平板',
      en: 'enGo AI Smart Hub Tablet',
      fr: 'Tablette de contrôle intelligent enGo AI',
      ja: 'enGo AI スマートハブタブレット',
      es: 'Tableta de Control Inteligente enGo AI'
    },
    description: {
      zh: '整合 MEDOLE 架構，支援 Apple HomeKit、Google Home、Amazon Alexa，一鍵控制全家智慧家電與情境模式。',
      zhCN: '整合 MEDOLE 架构，支持 Apple HomeKit、Google Home、Amazon Alexa，一键控制全家智慧家电与情境模式。',
      en: 'Built on the MEDOLE framework with Apple HomeKit, Google Home, and Amazon Alexa support — central control for all smart appliances and scene modes.',
      fr: 'Basé sur le framework MEDOLE avec Apple HomeKit, Google Home et Amazon Alexa — contrôle central pour tous les appareils intelligents et scénarios.',
      ja: 'MEDOLEフレームワークを採用し、Apple HomeKit、Google Home、Amazon Alexaに対応。全家のスマート家電とシーンモードを一元制御。',
      es: 'Construido sobre el framework MEDOLE con soporte para Apple HomeKit, Google Home y Amazon Alexa — control central para todos los electrodomésticos inteligentes.'
    }
  },
  {
    id: 'water-purifier',
    sku: 'ENGO-WATER',
    anchor: 'oxygen',
    image: `${BASE_URL}/images/product/water-purifier.jpg`,
    priceTWD: 18000, // early-bird promo; MSRP 21,000 TWD
    name: {
      zh: '水維氧 AI智慧淨水系統',
      zhCN: '水维氧 AI智慧净水系统',
      en: 'Shui Wei Yang AI Smart Water Purifier',
      fr: 'Purificateur d\'eau AI Shui Wei Yang',
      ja: '水維氧 AIスマート浄水システム',
      es: 'Purificador de Agua Inteligente Shui Wei Yang AI'
    },
    description: {
      zh: '電子水閥、無儲水桶設計，三重濾心過濾，通過 BSMI 商品檢驗與 SGS 水質檢測。',
      zhCN: '电子水阀、无储水桶设计，三重滤心过滤，通过 BSMI 商品检验与 SGS 水质检测。',
      en: 'Electronic water valve with tankless design, triple-filter purification, certified by BSMI and SGS water quality testing.',
      fr: 'Vanne électronique sans réservoir, triple filtration, certifié BSMI et tests de qualité d\'eau SGS.',
      ja: '電子水バルブ、貯水タンクレス設計、三重フィルター、BSMI商品検査とSGS水質検査認証済み。',
      es: 'Válvula de agua electrónica sin tanque, triple filtración, certificada por BSMI y pruebas de calidad de agua SGS.'
    }
  },
  {
    id: 'air-purifier',
    sku: 'EAP-01',
    anchor: 'oxygen1',
    image: `${BASE_URL}/images/AirPurifier001.png`,
    priceTWD: 8960, // presale; MSRP 12,800 TWD
    name: {
      zh: 'enGo 智能空氣清淨機 EAP-01',
      zhCN: 'enGo 智能空气清净机 EAP-01',
      en: 'enGo Smart Air Purifier EAP-01',
      fr: 'Purificateur d\'air intelligent enGo EAP-01',
      ja: 'enGo スマート空気清浄機 EAP-01',
      es: 'Purificador de Aire Inteligente enGo EAP-01'
    },
    description: {
      zh: '一機四用：HEPA12 + NIH1 + 銀離子三重濾網、SoundBox 藍牙音響、Qi 無線充電、香氛擴香。適用 8–10 坪，最大噪音 < 61dB，NCC / BSMI 認證。',
      zhCN: '一机四用：HEPA12 + NIH1 + 银离子三重滤网、SoundBox 蓝牙音响、Qi 无线充电、香氛扩香。适用 8–10 坪，最大噪音 < 61dB，NCC / BSMI 认证。',
      en: 'Four essentials in one: HEPA12 + NIH1 + Silver Ionizer triple filter, SoundBox Bluetooth speaker, Qi wireless charging, and aroma diffuser. Coverage 8–10 ping, max noise <61dB, NCC/BSMI certified.',
      fr: 'Quatre essentiels en un : Filtre triple HEPA12 + NIH1 + Ioniseur d\'argent, enceinte Bluetooth SoundBox, recharge sans fil Qi, diffuseur d\'arôme. Couverture 8–10 ping, bruit max <61dB, certifié NCC/BSMI.',
      ja: '一台四役：HEPA12 + NIH1 + シルバーイオン三層フィルター、SoundBox Bluetoothスピーカー、Qiワイヤレス充電、アロマディフューザー。適用畳数 8〜10坪、最大騒音 <61dB、NCC/BSMI認証。',
      es: 'Cuatro esenciales en uno: Filtro triple HEPA12 + NIH1 + Ionizador de Plata, altavoz Bluetooth SoundBox, carga inalámbrica Qi y difusor de aroma. Cobertura 8–10 ping, ruido máx. <61dB, certificado NCC/BSMI.'
    }
  }
]

function buildSchema(product: ProductDef, locale: Locale): object {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${PRODUCT_URL}#${product.anchor}`,
    name: product.name[locale] || product.name.en,
    description: product.description[locale] || product.description.en,
    sku: product.sku,
    image: product.image,
    url: `${PRODUCT_URL}?jump=${product.anchor}`,
    brand: BRAND,
    manufacturer: BRAND,
    category: 'Smart Home Appliance'
  }

  if (product.priceTWD !== null) {
    schema.offers = {
      '@type': 'Offer',
      url: `${PRODUCT_URL}?jump=${product.anchor}`,
      priceCurrency: 'TWD',
      price: product.priceTWD,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: BRAND
    }
  }

  return schema
}

/**
 * Inject (or replace) <script type="application/ld+json" data-schema="product">
 * tags in the document head, one per product, localized to the given locale.
 */
export function injectProductSchemas(rawLocale: string): void {
  if (typeof document === 'undefined') return
  const locale = (rawLocale as Locale) || 'en'

  // Remove any existing product schema tags so we don't accumulate duplicates
  // when the user switches languages.
  cleanupProductSchemas()

  PRODUCTS.forEach((product) => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-schema', 'product')
    script.setAttribute('data-product-id', product.id)
    script.textContent = JSON.stringify(buildSchema(product, locale))
    document.head.appendChild(script)
  })
}

/**
 * Remove all product JSON-LD tags injected by this module. Called by the
 * consumer's onUnmounted hook and by injectProductSchemas before re-inject.
 */
export function cleanupProductSchemas(): void {
  if (typeof document === 'undefined') return
  document
    .querySelectorAll('script[type="application/ld+json"][data-schema="product"]')
    .forEach((el) => el.remove())
}
