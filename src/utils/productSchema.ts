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

import { SHOW_AIR_PURIFIER } from '@/configs/systemConfig'

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
    id: 'smartpad-01',
    sku: 'SmartPad_01',
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
      zh: '住家與社區合一的 AI 智慧中控：enGo 牆掛平板搭配手機 App，整合照明、插座、窗簾、空調、紅外線家電、感測器與攝影機，加上社區公告、報修、公設預約與包裹通知。支援將 Matter 網關下的裝置分享至 Apple HomeKit 與 Google Home；enGo 語音操作為平板內建功能。',
      zhCN: '住家与社区合一的 AI 智慧中控：enGo 墙挂平板搭配手机 App，整合照明、插座、窗帘、空调、红外线家电、传感器与摄像头，加上社区公告、报修、公设预约与包裹通知。支持将 Matter 网关下的设备分享至 Apple HomeKit 与 Google Home；enGo 语音操作为平板内置功能。',
      en: 'AI home control for home and community in one: the enGo wall tablet plus mobile app manage lighting, sockets, curtains, air conditioning, IR appliances, sensors and cameras, alongside community notices, repair requests, facility bookings and parcel alerts. Devices on the Matter gateway can be shared to Apple HomeKit and Google Home; enGo voice control is built into the tablet.',
      fr: 'Contrôle intelligent du domicile et de la résidence en un : la tablette murale enGo et l\'appli mobile gèrent éclairage, prises, rideaux, climatisation, appareils IR, capteurs et caméras, ainsi que les avis de résidence, demandes de réparation, réservations et alertes colis. Les appareils rattachés à la passerelle Matter peuvent être partagés vers Apple HomeKit et Google Home ; la commande vocale enGo est intégrée à la tablette.',
      ja: '住まいとコミュニティを一つにする AI ホームコントロール。enGo 壁掛けタブレットとスマホアプリで照明・コンセント・カーテン・空調・赤外線家電・センサー・カメラを管理し、コミュニティのお知らせ、修理依頼、施設予約、宅配通知にも対応。Matter ゲートウェイ配下の機器は Apple HomeKit と Google Home に共有可能。enGo の音声操作はタブレット内蔵機能です。',
      es: 'Control inteligente del hogar y la comunidad en uno: la tableta de pared enGo y la app móvil gestionan iluminación, enchufes, cortinas, aire acondicionado, aparatos IR, sensores y cámaras, además de avisos de la comunidad, solicitudes de reparación, reservas de instalaciones y alertas de paquetes. Los dispositivos de la puerta de enlace Matter pueden compartirse con Apple HomeKit y Google Home; el control por voz de enGo está integrado en la tableta.'
    }
  },
  {
    id: 'water-purifier',
    sku: 'enGoW-601',
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

  // ponytail: skip schema for products currently hidden from the site, so we
  // don't advertise a product visitors can't find. See systemConfig.
  const visible = PRODUCTS.filter((p) => p.id !== 'air-purifier' || SHOW_AIR_PURIFIER)

  visible.forEach((product) => {
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
