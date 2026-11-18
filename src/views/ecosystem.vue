<template>
  <!-- eco- namespace: previously a dark global-CSS shell (_ecosystem.scss);
       now a tile page that owns its layout. -->
  <section id="engo-ecosystem" class="ap-page eco-page">
    <!-- tile 1, white: title and subtitle -->
    <div class="ap-tile ap-tile-first ap-white eco-head-tile">
      <div class="ap-wrap ap-center">
        <h1 class="ap-title">{{ $t('ecosystemTitle') }}</h1>
        <p class="ap-lead fade-in">
          {{ tx('雲端、設備與生活服務，一個平台，串起整個生態。', '云端、设备与生活服务，一个平台，串起整个生态。', 'Cloud, devices, and everyday services, one platform, one connected ecosystem.', { ja: 'クラウド、デバイス、暮らしのサービスを、ひとつのプラットフォームでつなぐエコシステム。', fr: 'Cloud, appareils et services du quotidien : une seule plateforme, un écosystème connecté.', es: 'Nube, dispositivos y servicios cotidianos: una sola plataforma, un ecosistema conectado.' }) }}
        </p>
      </div>
    </div>

    <!-- tile 2, dark: the film -->
    <div class="ap-tile ap-dark">
      <div class="ap-wrap">
        <figure class="ap-photo eco-plate fade-in">
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
            <strong class="eco-cap-brand">enGo</strong>
            {{ tx('智慧生態系影片', '智慧生态系视频', 'ecosystem film', { ja: 'エコシステム紹介動画', fr: 'Film de l’écosystème', es: 'Video del ecosistema' }) }}
          </figcaption>
        </figure>
      </div>
    </div>

    <!-- tile 3, white: one account, three doors: the wall tablet at home, the app
         when out, the store for everything you add. Real screens only (KB-001 rule). -->
    <div class="ap-tile ap-white">
      <div class="ap-wrap">
        <div class="ap-head ap-center">
          <h2 class="ap-h2 fade-in">{{ tx('一組帳號，三個入口', '一组帐号，三个入口', 'One account, three doors', { ja: 'ひとつのアカウントで、三つの入口', fr: 'Un seul compte, trois accès', es: 'Una sola cuenta, tres accesos' }) }}</h2>
        </div>
        <div class="ap-grid ap-grid-3 eco-doors">
          <article class="ap-card eco-door fade-in">
            <div class="eco-media">
              <div class="eco-frame eco-frame-tablet">
                <img src="/images/screens/01-home-tablet.png" :alt="tx('enGo 牆掛平板首頁', 'enGo 墙挂平板首页', 'enGo wall tablet home screen', { ja: 'enGo壁掛けタブレットのホーム画面', fr: 'Écran d’accueil de la tablette murale enGo', es: 'Pantalla de inicio de la tableta de pared enGo' })" width="2000" height="1200" loading="lazy" />
              </div>
            </div>
            <div class="eco-door-text">
              <h3 class="ap-h3">{{ tx('enGo 牆掛平板', 'enGo 墙挂平板', 'enGo wall tablet', { ja: 'enGo壁掛けタブレット', fr: 'Tablette murale enGo', es: 'Tableta de pared enGo' }) }}</h3>
              <p class="ap-body">{{ tx('家中的主控台：家電、情境、社區公告與報修、語音操作。', '家中的主控台：家电、情境、社区公告与报修、语音操作。', 'The control hub at home: appliances, scenes, community notices and repairs, voice control.', { ja: 'ご自宅の操作拠点：家電、シーン、コミュニティのお知らせと修理依頼、音声操作。', fr: 'Le poste de commande de la maison : appareils, scénarios, annonces et demandes de réparation de la résidence, commande vocale.', es: 'El centro de control del hogar: electrodomésticos, escenas, avisos y reportes de reparación de la comunidad, control por voz.' }) }}</p>
              <router-link to="/product" class="ap-link">{{ tx('認識平板', '认识平板', 'About the tablet', { ja: 'タブレットについて', fr: 'Découvrir la tablette', es: 'Conocer la tableta' }) }}</router-link>
            </div>
          </article>
          <article class="ap-card eco-door fade-in">
            <div class="eco-media">
              <div class="eco-frame eco-frame-phone">
                <img src="/images/screens/12-home-iphone.png" :alt="tx('enGo智慧管家 手機 App 首頁', 'enGo智慧管家 手机 App 首页', 'enGo home app on a phone', { ja: 'enGo智慧管家 スマートフォンアプリのホーム画面', fr: 'Écran d’accueil de l’application enGo智慧管家 sur téléphone', es: 'Pantalla de inicio de la app enGo智慧管家 en un celular' })" width="800" height="1731" loading="lazy" />
              </div>
            </div>
            <div class="eco-door-text">
              <h3 class="ap-h3">{{ tx('手機 App「enGo智慧管家」', '手机 App「enGo智慧管家」', 'The enGo app on your phone', { ja: 'スマートフォンアプリ「enGo智慧管家」', fr: 'L’application « enGo智慧管家 » sur téléphone', es: 'La app «enGo智慧管家» en el celular' }) }}</h3>
              <p class="ap-body">{{ tx('出門在外同一組帳號：家電控制、情境、社區服務、攝影機與庫存，iPhone／iPad 與 Android 免費下載。', '出门在外同一组帐号：家电控制、情境、社区服务、摄影机与库存，iPhone／iPad 与 Android 免费下载。', 'The same account when you are out: appliances, scenes, community services, cameras and inventory, free on iPhone/iPad and Android.', { ja: '外出先でも同じアカウントで：家電操作、シーン、コミュニティサービス、カメラ、在庫。iPhone／iPadとAndroidで無料ダウンロードできます。', fr: 'Le même compte hors de chez soi : commande des appareils, scénarios, services de la résidence, caméras et stocks, téléchargement gratuit sur iPhone/iPad et Android.', es: 'La misma cuenta fuera de casa: control de electrodomésticos, escenas, servicios de la comunidad, cámaras e inventario, descarga gratuita en iPhone/iPad y Android.' }) }}</p>
              <router-link to="/product#interfaces" class="ap-link">{{ tx('三種介面', '三种界面', 'The three interfaces', { ja: '3つのインターフェース', fr: 'Les trois interfaces', es: 'Las tres interfaces' }) }}</router-link>
            </div>
          </article>
          <article class="ap-card eco-door eco-door-store fade-in">
            <div class="eco-media">
              <div class="eco-store-mark" aria-hidden="true">
                <span class="eco-store-brand">enGo</span>
                <span class="eco-store-word">{{ $t('mallTitle') }}</span>
              </div>
            </div>
            <div class="eco-door-text">
              <h3 class="ap-h3">{{ $t('mallTitle') }}</h3>
              <p class="ap-body">{{ tx('套裝方案、淨水系統與生活選品，線上選購後由專人安排安裝與服務。', '套装方案、净水系统与生活选品，在线选购后由专人安排安装与服务。', 'Packages, the water system and everyday products, ordered online and installed and serviced by our team.', { ja: 'パッケージプラン、浄水システム、暮らしのアイテムをオンラインで購入でき、設置とサービスは専任スタッフが手配します。', fr: 'Packs, système de purification d’eau et produits du quotidien, commandés en ligne, puis installés et pris en charge par notre équipe.', es: 'Paquetes, sistema de agua y productos para el día a día, que se compran en línea y que nuestro equipo instala y atiende.' }) }}</p>
              <a :href="SHOP_URL" target="_blank" rel="noopener" class="ap-link" data-track="ecosystem:store">{{ tx('前往 enGo 安購商城', '前往 enGo 安购商城', 'Open enGo Shop', { ja: 'enGo Shopを開く', fr: 'Ouvrir enGo Shop', es: 'Abrir enGo Shop' }) }}</a>
            </div>
          </article>
        </div>
      </div>
    </div>

    <!-- tile 4, parchment: five product lines -->
    <div class="ap-tile ap-parchment">
      <div class="ap-wrap">
        <div class="ap-head ap-center">
          <h2 class="ap-h2 fade-in">{{ tx('五條產品線', '五条产品线', 'Five product lines', { ja: '5つの製品ライン', fr: 'Cinq gammes de produits', es: 'Cinco líneas de producto' }) }}</h2>
        </div>
        <ul class="eco-lines">
          <li v-for="l in lines" :key="l.to" class="fade-in">
            <router-link :to="l.to" class="ap-card eco-line-link">
              <span class="eco-line-title">{{ lt(l) }}</span>
              <span class="eco-line-body">{{ lt(l, 'Body') }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <!-- tile 5, white: partners (names and roles only) and where to next -->
    <div class="ap-tile ap-white">
      <div class="ap-wrap ap-wrap-text">
        <div class="ap-head ap-center">
          <h2 class="ap-h2 fade-in">{{ tx('合作夥伴', '合作伙伴', 'Partners', { ja: 'パートナー', fr: 'Partenaires', es: 'Socios' }) }}</h2>
        </div>
        <ul class="ap-rows eco-partners">
          <li v-for="p in partners" :key="p.zh" class="eco-partner fade-in">
            <a
              v-if="p.url"
              :href="p.url"
              target="_blank"
              rel="noopener"
              class="ap-link eco-partner-name eco-partner-link"
              data-track="ecosystem:partner"
            >{{ lt(p) }}</a>
            <span v-else class="eco-partner-name">{{ lt(p) }}</span>
            <span class="eco-partner-role">{{ lt(p, 'Role') }}</span>
          </li>
        </ul>

        <div class="ap-links eco-next fade-in">
          <router-link to="/cases" class="ap-link">
            {{ tx('看實作案例', '看实作案例', 'See the installations', { ja: '導入事例を見る', fr: 'Voir les réalisations', es: 'Ver las instalaciones' }) }}
          </router-link>
          <router-link to="/contact" class="ap-link">
            {{ tx('洽談合作', '洽谈合作', 'Talk to us about partnering', { ja: '提携のご相談', fr: 'Parler de partenariat', es: 'Hablar sobre una alianza' }) }}
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useLocaleText } from '../composables/useLocaleText'
import { useScrollReveal } from '../composables/useScrollReveal'
import { SHOP_URL } from '@/utils/shopUrl'

const LINES = [
  { to: '/product', zh: 'enGo AI 智慧中控系統', zhCN: 'enGo AI 智慧中控系统', en: 'enGo AI home control', ja: 'enGo AIスマート制御システム', fr: 'Pilotage domestique enGo AI', es: 'Control del hogar enGo AI', zhBody: '牆掛平板、手機 App 與雲端服務，家與社區同一套系統。', zhCNBody: '墙挂平板、手机 App 与云端服务，家与社区同一套系统。', enBody: 'Wall tablet, phone app and cloud service, one system for the home and the community.', jaBody: '壁掛けタブレット、スマートフォンアプリ、クラウドサービス。住まいとコミュニティをひとつのシステムで。', frBody: 'Tablette murale, application mobile et service cloud : un seul système pour le logement et la résidence.', esBody: 'Tableta de pared, app para celular y servicio en la nube: un solo sistema para el hogar y la comunidad.' },
  { to: '/product?jump=oxygen', zh: '水維氧 AI 智慧淨水系統', zhCN: '水维氧 AI 智慧净水系统', en: 'AI water purification', ja: '水維氧 AIスマート浄水システム', fr: 'Purification d’eau AI', es: 'Purificación de agua con AI', zhBody: '三道濾心、濾芯壽命與 TDS 監測，在平板與 App 上看得見。', zhCNBody: '三道滤心、滤芯寿命与 TDS 监测，在平板与 App 上看得见。', enBody: 'Three-stage filtration with filter life and TDS readings on the tablet and the app.', jaBody: '3段階ろ過。フィルター寿命とTDS値をタブレットとアプリで確認できます。', frBody: 'Filtration en trois étapes ; durée de vie des filtres et mesures TDS visibles sur la tablette et l’application.', esBody: 'Filtración en tres etapas, con vida útil de los filtros y lecturas de TDS en la tableta y en la app.' },
  { to: '/enviro', zh: '智慧環控', zhCN: '智慧环控', en: 'Environmental control', ja: 'スマート環境制御', fr: 'Contrôle de l’environnement', es: 'Control ambiental', zhBody: '陽光控溫、空氣淨化監測、智慧水務與廚房安全。', zhCNBody: '阳光控温、空气净化监测、智慧水务与厨房安全。', enBody: 'Daylight and temperature, air quality, water and kitchen safety.', jaBody: '採光と温度、空気の質、水まわり、キッチンの安全。', frBody: 'Lumière naturelle et température, qualité de l’air, eau et sécurité de la cuisine.', esBody: 'Luz natural y temperatura, calidad del aire, agua y seguridad en la cocina.' },
  { to: '/packages', zh: '套裝方案', zhCN: '套装方案', en: 'Packages', ja: 'パッケージプラン', fr: 'Packs', es: 'Paquetes', zhBody: '基礎、進階、豪華三種組合，依坪數與需求選配。', zhCNBody: '基础、高级、豪华三种组合，依坪数与需求选配。', enBody: 'Three bundles, sized to the home and what it needs.', jaBody: '3種類のプランから、広さとご要望に合わせて選べます。', frBody: 'Trois formules, dimensionnées selon le logement et ses besoins.', esBody: 'Tres paquetes, dimensionados según la vivienda y sus necesidades.' },
  { to: '/product#shop', zh: 'enGo 安購商城', zhCN: 'enGo 安购商城', en: 'enGo Shop', ja: 'enGo Shop', fr: 'enGo Shop', es: 'enGo Shop', zhBody: '社區訂閱與鄰里市集，生鮮、日用與智慧家居送到家門口。', zhCNBody: '社区订阅与邻里市集，生鲜、日用与智慧家居送到家门口。', enBody: 'Community subscriptions and a neighbourhood marketplace, delivered to your door.', jaBody: 'コミュニティ定期購入と近隣マーケット。生鮮品、日用品、スマートホーム商品を玄関先までお届けします。', frBody: 'Abonnements de résidence et marché de quartier : produits frais, articles du quotidien et produits maison connectée, livrés à la porte.', esBody: 'Suscripciones comunitarias y un mercado de barrio: productos frescos, artículos de uso diario y productos para el hogar inteligente, entregados a domicilio.' }
]

// Same list the chatbot and FAQ 27 already give out; no component vendors.
// url only where the site is known; the rest stay plain text.
interface Partner {
  zh: string
  zhCN: string
  en: string
  ja: string
  fr: string
  es: string
  zhRole: string
  zhCNRole: string
  enRole: string
  jaRole: string
  frRole: string
  esRole: string
  url?: string
}
const PARTNERS: Partner[] = [
  { zh: '大雅全屋裝修', zhCN: '大雅全屋装修', en: 'Daya Whole-Home Renovation', ja: '大雅全屋裝修', fr: 'Daya Whole-Home Renovation', es: 'Daya Whole-Home Renovation', url: 'https://www.tayakitchen.com.tw/', zhRole: '台中，全屋裝修與建案智慧化，設有展示間', zhCNRole: '台中，全屋装修与建案智慧化，设有展示间', enRole: 'Taichung, whole-home renovation and smart developments, with a showroom', jaRole: '台中市、全屋リノベーションと分譲物件のスマート化。ショールームあり', frRole: 'Taichung, rénovation complète de logements et programmes immobiliers connectés, avec salle d’exposition', esRole: 'Taichung, remodelación integral de viviendas y desarrollos inmobiliarios inteligentes, con sala de exhibición' },
  { zh: '撰美室內裝修', zhCN: '撰美室内装修', en: 'Zhuanmei Interior Design', ja: '撰美室內裝修', fr: 'Zhuanmei Interior Design', es: 'Zhuanmei Interior Design', zhRole: '台北，全室裝修與系統櫥櫃，智慧家居展示空間', zhCNRole: '台北，全室装修与系统橱柜，智慧家居展示空间', enRole: 'Taipei, interiors and system cabinetry, smart-home showroom', jaRole: '台北市、インテリア全般とシステム収納。スマートホームのショールーム', frRole: 'Taipei, aménagement intérieur et rangements modulaires, espace d’exposition maison connectée', esRole: 'Taipéi, interiorismo y gabinetes modulares, sala de exhibición de hogar inteligente' },
  { zh: '米多力 MEDOLE', zhCN: '米多力 MEDOLE', en: 'MEDOLE', ja: '米多力 MEDOLE', fr: 'MEDOLE', es: 'MEDOLE', url: 'https://www.medole.com.tw/', zhRole: '吊隱式新風除濕機與 3合1 智慧空氣平衡系統', zhCNRole: '吊隐式新风除湿机与 3合1 智慧空气平衡系统', enRole: 'Ceiling-concealed fresh-air dehumidifiers and the 3-in-1 air balance system', jaRole: '天井埋込型の新風除湿機と、3in1スマート空気バランスシステム', frRole: 'Déshumidificateurs à air neuf encastrés au plafond et système d’équilibre de l’air 3 en 1', esRole: 'Deshumidificadores de aire fresco ocultos en el techo y sistema de balance de aire 3 en 1' },
  { zh: '麗寶生醫', zhCN: '丽宝生医', en: 'Lihpao Life Science', ja: '麗寶生醫', fr: 'Lihpao Life Science', es: 'Lihpao Life Science', url: 'https://libobio.com/?page_id=527', zhRole: '智能富氧艙優化合作', zhCNRole: '智能富氧舱优化合作', enRole: 'Smart Oxygen Chamber optimization', jaRole: 'スマート酸素チャンバーの最適化に関する協業', frRole: 'Collaboration sur l’optimisation de la chambre à oxygène intelligente', esRole: 'Colaboración para optimizar la cámara de oxígeno inteligente' },
  { zh: '合野木業', zhCN: '合野木业', en: 'Heye Woodworks', ja: '合野木業', fr: 'Heye Woodworks', es: 'Heye Woodworks', url: 'https://www.he-ye.com/', zhRole: '智慧功能櫃，北部展示間', zhCNRole: '智慧功能柜，北部展示间', enRole: 'Smart functional cabinetry, showroom in northern Taiwan', jaRole: 'スマート機能収納。台湾北部にショールームあり', frRole: 'Rangements fonctionnels intelligents, salle d’exposition dans le nord de Taïwan', esRole: 'Gabinetes funcionales inteligentes, sala de exhibición en el norte de Taiwán' },
  { zh: '嘉義達光電、金毅泰節能科技', zhCN: '嘉义达光电、金毅泰节能科技', en: 'Chia-Yi Da Optoelectronics and Jin Yi Tai Energy', ja: '嘉義達光電、金毅泰節能科技', fr: 'Chia-Yi Da Optoelectronics and Jin Yi Tai Energy', es: 'Chia-Yi Da Optoelectronics and Jin Yi Tai Energy', zhRole: '能源與節能方案', zhCNRole: '能源与节能方案', enRole: 'Energy and energy-saving solutions', jaRole: 'エネルギーおよび省エネソリューション', frRole: 'Solutions énergétiques et d’économie d’énergie', esRole: 'Soluciones de energía y ahorro de energía' }
]

export default defineComponent({
  name: 'Ecosystem',
  setup() {
    const { tx, lt } = useLocaleText()
    useScrollReveal('.fade-in', 'visible')
    return { tx, lt, SHOP_URL, lines: LINES, partners: PARTNERS }
  }
})
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

// the film: a radius-18 frame resting on the dark tile, caption below
.eco-plate {
  max-width: 980px;
  margin: 0 auto;

  figcaption {
    color: $on-dark-muted;
  }
}

.eco-video {
  aspect-ratio: 16 / 9;
  border-radius: 18px;
  overflow: hidden;
  background: #000;

  iframe {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.eco-cap-brand {
  font-weight: 600;
  color: #fff;
  margin-right: 6px;
}

// ─── three doors ───
.eco-doors {
  gap: clamp(20px, 2.5vw, 32px);
}

.eco-door {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.eco-media {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  padding: 32px 28px 8px;
}

.eco-door-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 20px 28px 28px;

  .ap-body {
    margin-bottom: 4px;
  }
}

// screens sit in the brushed-titanium frame from the homepage, with the one product shadow
@mixin metal-frame($radius, $pad, $glass, $screen-radius) {
  position: relative;
  border-radius: $radius;
  padding: $pad;
  background:
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.07) 0 1px, transparent 1px 3px),
    linear-gradient(135deg, #f4f6f8 0%, #c4cad2 16%, #e6e9ed 34%, #adb5bf 52%, #dde1e6 70%, #b6bdc6 86%, #eef1f4 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 0 rgba(15, 23, 32, 0.28), $product-shadow;

  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: $screen-radius;
    box-shadow: 0 0 0 $glass #0c1219, 0 0 0 ($glass + 1px) rgba(255, 255, 255, 0.12);
  }
}

.eco-frame-tablet {
  @include metal-frame(18px, 10px, 5px, 9px);
  width: 100%;
}

.eco-frame-phone {
  // the whole phone, never cropped into a landscape box (screenshot rule)
  @include metal-frame(34px, 9px, 5px, 22px);
  width: 46%;
  max-width: 150px;
}

.eco-store-mark {
  width: 100%;
  aspect-ratio: 2000 / 1200;
  border-radius: 18px;
  background: $tile-dark;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 18px 22px;
  gap: 4px;
}

.eco-store-brand {
  font-weight: 600;
  font-size: clamp(2rem, 3.2vw, 2.75rem);
  line-height: 1;
  letter-spacing: -0.03em;
  color: #fff;
}

.eco-store-word {
  font-size: 1.0625rem;
  letter-spacing: -0.022em;
  color: $on-dark-muted;
}

// ─── product lines: white cards on the parchment tile ───
.eco-lines {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  li {
    display: flex;
  }
}

.eco-line-link {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 28px;
  text-decoration: none;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.99);
  }
}

.eco-line-title {
  font-weight: 600;
  font-size: 1.3125rem;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: $ink;
}

.eco-line-title::after {
  content: '\203A';
  margin-left: 0.25em;
  color: $brand-orange-text;
}

.eco-line-body {
  font-size: 1.0625rem;
  line-height: 1.47;
  letter-spacing: -0.022em;
  color: $ink-80;
}

// ─── partners ───
.eco-partner {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.eco-partner-name {
  font-weight: 600;
  font-size: 1.3125rem;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: $ink;
}

.eco-partner-link {
  align-self: flex-start;
  color: $brand-orange-text;
}

.eco-partner-role {
  font-size: 1.0625rem;
  line-height: 1.47;
  letter-spacing: -0.022em;
  color: $ink-80;
}

.eco-next {
  margin-top: clamp(36px, 5vw, 56px);
}
</style>
