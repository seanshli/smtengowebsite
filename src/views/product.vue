<template>
  <main ref="motionRoot" class="pd">
    <div class="product-container">
      <div class="scroll-top-btn" @click="scrollToTop">
        <img src="/images/scroll-top.png" alt="scroll to top" />
      </div>

      <!-- ─── HERO TILE (white): one headline, one tagline, the product ─────────
           Apple-profile grammar, same as the homepage: centered stack, the device is
           the only thing on the page that carries a shadow. -->
      <section id="hero" class="pd-tile pd-white pd-hero">
        <div data-reveal-group class="pd-wrap pd-center">
          <h1 class="pd-title">{{ $t('product.tablet_intro.title') }}</h1>
          <!-- A tagline, not a section heading. -->
          <p class="pd-tagline">{{ $t('product.tablet_intro.tagline') }}</p>
          <p class="pd-sub">
            <img class="pd-mark" src="/images/logo_darkblue.svg" alt="enGo" />
            {{ $t('product.tablet_intro.info') }}
          </p>
        </div>
        <!-- ENGO-WEB-001 §3.2 shot #1 composited onto the enGo tablet render (screen
             pixels untouched, cover-fit into the 1755×1054 panel). -->
        <img data-reveal class="pd-hero-device" src="/images/screens/01-home-tablet-device.png" :alt="$t('product.tablet_intro.title')" loading="eager" />
      </section>

      <!-- ─── INTRO TILE (parchment): ENGO-WEB-001 §2.2. One copy for every breakpoint. -->
      <section id="intro" class="pd-tile pd-parchment">
        <div class="pd-wrap">
          <header class="pd-head pd-center" data-reveal>
            <h2 class="pd-h2">
              <img class="pd-h2-logo" src="/images/logo_darkblue.svg" alt="enGo" />
              {{ $t('product.brand_intro.title') }}
            </h2>
          </header>
          <div data-reveal-group class="pd-intro-grid">
            <div class="pd-intro-img">
              <img src="/images/Frame74.png" :alt="$t('product.brand_intro.title')" loading="lazy" />
            </div>
            <div class="pd-intro-copy">
              <h3 class="pd-h3">{{ $t('product.brand_intro.heading') }}</h3>
              <p class="pd-lead pd-lead-left">{{ $t('product.brand_intro.lead') }}</p>
              <p class="pd-body">
                <strong class="intro-label">{{ $t('product.brand_intro.homeLabel') }}</strong>
                {{ $t('product.brand_intro.home') }}
              </p>
              <p class="pd-body">
                <strong class="intro-label">{{ $t('product.brand_intro.communityLabel') }}</strong>
                {{ $t('product.brand_intro.community') }}
              </p>
              <!-- §3.2 shot #8, cropped to the two real notices (違規勸導／社區除蟲通知);
                   the same screen also carried a／b／123／test entries. -->
              <figure class="intro-figure">
                <img src="/images/screens/09-announcement-tablet.png" :alt="$t('product.brand_intro.communityFigure')" loading="lazy" />
                <figcaption>{{ $t('product.brand_intro.communityFigure') }}</figcaption>
              </figure>
              <p class="pd-body">{{ $t('product.brand_intro.scenes') }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── NUMBERS TILE (white). CountUp.js. One markup for every breakpoint. -->
      <section class="pd-tile pd-white pd-counts">
        <div class="pd-wrap">
          <div data-reveal-group class="pd-count-grid">
            <div class="pd-count">
              <img class="pd-count-icon" src="/assets/file-badge.svg" alt="專利icon" />
              <div class="pd-count-num">
                <count-up :end-val="24" :duration="2.5" :options="options" @init="onInit"></count-up>
                <span class="pd-count-unit">{{ $t('product.brand_intro.countCard.card01.unit') }}</span>
              </div>
              <p class="pd-count-info">{{ $t('product.brand_intro.countCard.card01.info') }}</p>
            </div>
            <div class="pd-count">
              <img class="pd-count-icon" src="/assets/brain__circuit.svg" alt="AI功能 icon" />
              <div class="pd-count-num">
                <count-up :end-val="30" :duration="3" :options="options" @init="onInit"></count-up>
                <span class="pd-count-unit">{{ $t('product.brand_intro.countCard.card02.unit') }}</span>
              </div>
              <p class="pd-count-info">{{ $t('product.brand_intro.countCard.card02.info') }}</p>
            </div>
            <div class="pd-count">
              <img class="pd-count-icon" src="/assets/test_tubes.svg" alt="驗證測試 icon" />
              <div class="pd-count-num">
                <count-up :end-val="10" :duration="2.5" :options="options" @init="onInit"></count-up>
                <span class="pd-count-unit">{{ $t('product.brand_intro.countCard.card04.tenThousand') }}{{ $t('product.brand_intro.countCard.card04.unit') }}</span>
              </div>
              <p class="pd-count-info">{{ $t('product.brand_intro.countCard.card04.info') }}</p>
            </div>
            <div class="pd-count">
              <img class="pd-count-icon" src="/assets/lightbulb.svg" alt="研發 icon" />
              <div class="pd-count-num">
                <count-up :end-val="5" :duration="2" :options="options" @init="onInit"></count-up>
                <span class="pd-count-unit">{{ $t('product.brand_intro.countCard.card03.unit') }}</span>
              </div>
              <p class="pd-count-info">{{ $t('product.brand_intro.countCard.card03.info') }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── 三種介面，一組帳號 (dark tile) — ENGO-WEB-001 §2.3. -->
      <section id="interfaces" class="pd-tile pd-dark interfaces">
        <div class="pd-wrap">
          <header class="pd-head pd-center" data-reveal>
            <h2 class="pd-h2">{{ $t('product.interfaces.title') }}</h2>
          </header>
          <div class="interfaces-scroll">
            <table class="interfaces-table">
              <thead>
                <tr>
                  <td></td>
                  <th scope="col">{{ $t('product.interfaces.columns.tablet') }}</th>
                  <th scope="col">{{ $t('product.interfaces.columns.ios') }}</th>
                  <th scope="col">{{ $t('product.interfaces.columns.android') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">{{ $t('product.interfaces.rows.control') }}</th>
                  <td><span class="if-yes" :aria-label="$t('product.interfaces.yes')">●</span></td>
                  <td><span class="if-yes" :aria-label="$t('product.interfaces.yes')">●</span></td>
                  <td><span class="if-yes" :aria-label="$t('product.interfaces.yes')">●</span></td>
                </tr>
                <tr>
                  <th scope="row">{{ $t('product.interfaces.rows.community') }}</th>
                  <td><span class="if-yes" :aria-label="$t('product.interfaces.yes')">●</span></td>
                  <td><span class="if-yes" :aria-label="$t('product.interfaces.yes')">●</span></td>
                  <td><span class="if-yes" :aria-label="$t('product.interfaces.yes')">●</span></td>
                </tr>
                <!-- 2026-09-27 實機＋程式碼複查，更正這一區兩處：
                     (1) 舊註解寫「平面圖與用電統計都只有平板有」，那是 2026-09-23 我方查核的
                         錯誤結論。設備數據（用電／用水／空氣品質）在 iPhone 上實測可用，
                         UM-001 §6.3 就是四張 iPhone 實機截圖 —— 另立一列標三平台皆有。
                     (2) 平面圖在出貨版 3.2.2(489) 並未提供（右上第一顆圖示只切換欄數；
                         floorplan 程式碼在 develop／release/v3.2.x／main 皆為 0 檔），
                         因此標示為「開發中」而非可用。規劃中亦僅做平板（手機螢幕太小）。 -->
                <tr>
                  <th scope="row">{{ $t('product.interfaces.rows.deviceData') }}</th>
                  <td><span class="if-yes" :aria-label="$t('product.interfaces.yes')">●</span></td>
                  <td><span class="if-yes" :aria-label="$t('product.interfaces.yes')">●</span></td>
                  <td><span class="if-yes" :aria-label="$t('product.interfaces.yes')">●</span></td>
                </tr>
                <tr>
                  <th scope="row">{{ $t('product.interfaces.rows.floorplan') }}</th>
                  <td><small class="if-only">{{ $t('product.interfaces.comingSoon') }}</small></td>
                  <td><span class="if-no" :aria-label="$t('product.interfaces.no')">—</span></td>
                  <td><span class="if-no" :aria-label="$t('product.interfaces.no')">—</span></td>
                </tr>
                <tr>
                  <th scope="row">{{ $t('product.interfaces.rows.voice') }}</th>
                  <td><span class="if-yes" :aria-label="$t('product.interfaces.yes')">●</span><small class="if-only">{{ $t('product.interfaces.tabletOnly') }}</small></td>
                  <td><span class="if-no" :aria-label="$t('product.interfaces.no')">—</span></td>
                  <td><span class="if-no" :aria-label="$t('product.interfaces.no')">—</span></td>
                </tr>
                <tr>
                  <th scope="row">{{ $t('product.interfaces.rows.photowall') }}</th>
                  <td><span class="if-yes" :aria-label="$t('product.interfaces.yes')">●</span><small class="if-only">{{ $t('product.interfaces.tabletOnly') }}</small></td>
                  <td><span class="if-no" :aria-label="$t('product.interfaces.no')">—</span></td>
                  <td><span class="if-no" :aria-label="$t('product.interfaces.no')">—</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Phones see one platform column at a time; the second column peeks in
               and this line says the rest is a swipe away. -->
          <p class="interfaces-hint pd-mob">{{ $t('product.interfaces.scrollHint') }}</p>
          <p data-reveal class="interfaces-note">{{ $t('product.interfaces.footnote') }}</p>
          <!-- Official store badges. Apple: badge API SVG, zh-TW for the Chinese locales,
               en-US otherwise. Google: generic English badge (no zh-TW asset is published).
               Both stores list the app as enGo智慧管家 (iOS tw.smtengo.engohome.ios = id6680188565,
               Android tw.smtengo.engohome.android). -->
          <p data-reveal class="interfaces-stores">
            <a href="https://apps.apple.com/app/id6680188565" target="_blank" rel="noopener" data-track="product:app-store">
              <img class="badge-apple" :src="$i18n.locale === 'zh' || $i18n.locale === 'zhCN' ? '/images/badges/app-store-zh-tw.svg' : '/images/badges/app-store-en.svg'" alt="Download on the App Store" height="40" loading="lazy" />
            </a>
            <a href="https://play.google.com/store/apps/details?id=tw.smtengo.engohome.android" target="_blank" rel="noopener" data-track="product:google-play">
              <img class="badge-google" src="/images/badges/google-play-en.png" alt="Get it on Google Play" height="60" loading="lazy" />
            </a>
          </p>
          <!-- Phase 2: ENGO-WEB-001 §3.2 shots #6 (iPhone home) and #7 (Android home). -->
          <div v-if="interfaceImages.ios || interfaceImages.android" class="interfaces-figures">
            <figure v-if="interfaceImages.ios">
              <div class="pd-iphone"><img :src="interfaceImages.ios" :alt="$t('product.interfaces.columns.ios')" loading="lazy" /></div>
              <figcaption>{{ $t('product.interfaces.columns.ios') }}</figcaption>
            </figure>
            <figure v-if="interfaceImages.android">
              <div class="pd-iphone"><img :src="interfaceImages.android" :alt="$t('product.interfaces.columns.android')" loading="lazy" /></div>
              <figcaption>{{ $t('product.interfaces.columns.android') }}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <!-- ─── 功能介紹 (parchment): ENGO-WEB-001 §2.4, four text cards. tablet_1.png is
           deliberately NOT reused: 一張正確的圖加四張留白，比五張錯的圖好.
           Each card's figure renders once featureImages carries a path (§3.2 #2–#5). -->
      <section ref="observeTarget" id="features" class="pd-tile pd-parchment">
        <div class="pd-wrap">
          <header class="pd-head pd-center" data-reveal>
            <h2 class="pd-h2">{{ $t('product.tablet_function.tag') }}</h2>
          </header>
          <div data-reveal-group class="tf-features" :class="{ 'is-visible': targetIsVisible }">
            <article class="tf-card">
              <figure v-if="featureImages.voice" class="tf-figure">
                <img :src="featureImages.voice" :alt="$t('product.tablet_function.features.voice.title')" loading="lazy" />
              </figure>
              <div class="tf-card-head">
                <span class="tf-badge">{{ $t('product.tablet_function.tabletOnly') }}</span>
              </div>
              <h3>{{ $t('product.tablet_function.features.voice.title') }}</h3>
              <p>{{ $t('product.tablet_function.features.voice.body') }}</p>
              <p class="tf-note">{{ $t('product.tablet_function.features.voice.note') }}</p>
            </article>
            <article class="tf-card">
              <figure v-if="featureImages.floorplan" class="tf-figure">
                <img :src="featureImages.floorplan" :alt="$t('product.tablet_function.features.floorplan.title')" loading="lazy" />
              </figure>
              <div class="tf-card-head">
                <span class="tf-badge">{{ $t('product.tablet_function.tabletOnly') }}</span>
                <span class="tf-badge tf-badge-soon">{{ $t('product.interfaces.comingSoon') }}</span>
              </div>
              <h3>{{ $t('product.tablet_function.features.floorplan.title') }}</h3>
              <p>{{ $t('product.tablet_function.features.floorplan.body') }}</p>
            </article>
            <article class="tf-card">
              <figure v-if="featureImages.photowall" class="tf-figure">
                <img :src="featureImages.photowall" :alt="$t('product.tablet_function.features.photowall.title')" loading="lazy" />
              </figure>
              <div class="tf-card-head">
                <span class="tf-badge">{{ $t('product.tablet_function.tabletOnly') }}</span>
              </div>
              <h3>{{ $t('product.tablet_function.features.photowall.title') }}</h3>
              <p>{{ $t('product.tablet_function.features.photowall.body') }}</p>
            </article>
            <article class="tf-card">
              <figure v-if="featureImages.inventory" class="tf-figure">
                <img :src="featureImages.inventory" :alt="$t('product.tablet_function.features.inventory.title')" loading="lazy" />
              </figure>
              <h3>{{ $t('product.tablet_function.features.inventory.title') }}</h3>
              <p>{{ $t('product.tablet_function.features.inventory.body') }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- ─── 水維氧 product line. #oxygen is the ?jump=oxygen target: it stays a direct
           child of .product-container with no positioned ancestor (offsetTop). -->
      <section id="oxygen" class="pd-tile pd-white pd-oxygen">
        <div class="pd-wrap">
          <header class="pd-head pd-center" data-reveal>
            <!-- 兩機一體 -->
            <p class="pd-lead pd-two">{{ $t('product.engo_products.two') }}{{ locale.startsWith('zh') ? '' : ' ' }}{{ $t('product.engo_products.twoMachines') }}</p>
            <h2 class="pd-h2">
              <!-- 水維氧AI智慧淨水系統 + -->
              <span class="pd-h2-line">{{ $t('product.engo_products.title01') }}</span>
              <span class="pd-h2-line"><span class="pd-amp">&amp;</span> {{ $t('product.engo_products.title02') }}</span>
            </h2>
            <!-- 從進水到出水層層把關，濾芯狀態看得見 -->
            <p class="pd-lead">{{ $t('product.engo_products.info') }}</p>
          </header>
          <img data-reveal class="pd-oxygen-photo pd-desk-lg" src="/images/filterwtablet.png" :alt="$t('product.engo_products.title01')" loading="lazy" />
          <div class="pd-two-machines pd-mob-lg">
            <img class="pd-m01" src="/assets/two-machines01.png" alt="兩機一體" loading="lazy" />
            <img class="pd-m02" src="/assets/two-machines02.png" alt="兩機一體" loading="lazy" />
          </div>
        </div>
      </section>

      <section class="pd-tile pd-parchment pd-water">
        <div class="pd-wrap">
          <header class="pd-head pd-center" data-reveal>
            <h2 class="pd-h2">
              <!-- 水維氧AI智慧淨水系統 -->
              {{ $t('product.water_filter.title') }}
            </h2>
            <i18n-t keypath="product.water_filter.subTitle" tag="p" class="pd-lead">
              <template v-slot:quality>
                <a class="pd-inline-link" href="https://oss.smtengo.com/engo-bucket-prod/device/WechatIMG87.pdf" target="_blank">
                  <!-- SGS水質檢測 -->
                  {{ $t('product.water_filter.quality') }}
                </a>
              </template>
              <template v-slot:valid>
                <a class="pd-inline-link" href="https://oss.smtengo.com/engo-bucket-prod/device/20240719132511.pdf" target="_blank">
                  <!-- BSMI商品檢驗 -->
                  {{ $t('product.water_filter.valid') }}
                </a>
              </template>
            </i18n-t>
          </header>
          <!-- The three renders below carry white callout text baked into the PNG, so
               each sits on a dark stage inside the light tile. -->
          <div data-reveal class="pd-stage filter-core">
            <img class="pd-desk" src="/images/filter_side.png" alt="濾芯" loading="lazy" />
            <img class="pd-mob pd-stage-small" src="/images/filter_core.png" alt="濾芯" loading="lazy" />
            <ol class="pd-mob pd-stage-list">
              <!-- 1. 一體式水路板 -->
              <li>{{ $t('product.water_filter.filterCore01') }}</li>
              <!-- 2. 三重濾心過濾 -->
              <li>{{ $t('product.water_filter.filterCore02') }}</li>
            </ol>
            <div class="qr-code-container">
              <img src="/images/qr-code.png" alt="Insurance certificate QR code" />
              <div>投保證書</div>
            </div>
          </div>
        </div>
      </section>

      <section class="pd-tile pd-white pd-water">
        <div class="pd-wrap">
          <header class="pd-head pd-center" data-reveal>
            <h2 class="pd-h2">
              <!-- 無儲水桶設計，安心防漏不滋菌 -->
              {{ $t('product.filter_strength.title') }}
            </h2>
            <p class="pd-lead">
              <!-- 避免複雜管線產生漏水風險。免儲水桶儲水，杜絕藏污納垢與細菌滋生。 -->
              {{ $t('product.filter_strength.desc') }}
            </p>
          </header>
          <div data-reveal class="pd-stage water-loop">
            <img class="pd-desk" src="/images/water_loop.png" alt="強效過濾濾芯" loading="lazy" />
            <img class="pd-mob pd-stage-small" src="/images/water_loop_mob.png" alt="強效過濾濾芯" loading="lazy" />
            <ol class="pd-mob pd-stage-list">
              <!-- 1. 減少管路連接 -->
              <li>{{ $t('product.filter_strength.water_loop01') }}</li>
              <!-- 2. 充分利用產品空間 -->
              <li>{{ $t('product.filter_strength.water_loop02') }}</li>
              <!-- 3. 杜絕漏水風險 -->
              <li>{{ $t('product.filter_strength.water_loop03') }}</li>
              <!-- 4. 可承受強壓 -->
              <li>{{ $t('product.filter_strength.water_loop04') }}</li>
            </ol>
          </div>
        </div>
      </section>

      <section class="pd-tile pd-parchment pd-water">
        <div class="pd-wrap">
          <header class="pd-head pd-center" data-reveal>
            <h2 class="pd-h2">
              <!-- 多重強效過濾，好濾芯大口喝水 -->
              {{ $t('product.filter_types.title') }}
            </h2>
          </header>
          <div data-reveal class="pd-stage pd-desk">
            <img src="/images/filter_types.png" alt="強效過濾濾心" loading="lazy" />
          </div>
          <div class="pd-swipe pd-mob">
            <swiper
              :slidesPerView="1"
              :spaceBetween="30"
              :loop="true"
              :pagination="{ clickable: true }"
              :navigation="true"
              :modules="modules"
              :style="{
                '--swiper-navigation-color': '#1d1d1f',
                '--swiper-pagination-color': '#b8431f',
                '--swiper-navigation-size': '15px'
              }"
            >
              <swiper-slide>
                <img src="/images/SRM.png" alt="SRM 富鍶礦化濾心" />
              </swiper-slide>
              <swiper-slide>
                <img src="/images/RO.png" alt="RO逆滲透膜" />
              </swiper-slide>
              <swiper-slide>
                <img src="/images/PPC.png" alt="PPC複合濾芯" />
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </section>

      <!-- 進口RO：the layered render carries its own callouts, so it sits in a dark tile. -->
      <section class="pd-tile pd-dark pd-levels">
        <div class="pd-wrap">
          <header class="pd-head pd-center" data-reveal>
            <h2 class="pd-h2">
              <!-- 進口RO，AI智慧淨濾，只為安心 -->
              {{ $t('product.filter_levels.title') }}
            </h2>
            <p class="pd-lead">
              <!-- 深度精確過濾有效過濾和除原水中的泥沙、懸浮物、餘氯、苯、甲醛、重金屬、細菌、病毒、異味等所有雜質。
              將原水過濾為帶有礦物質的極淨礦泉水。 -->
              {{ $t('product.filter_levels.subTitle') }}
            </p>
            <button
              type="button"
              class="pd-pill pd-pill-ghost-dark filter_detail_btn pd-mob"
              :class="{ 'is-hidden': targetExpand }"
              @click="expandImg()"
            >
              <!-- 查看更多 -->
              {{ $t('product.filter_levels.detail') }}
              <img class="pd-btn-arrow" src="/assets/arrow_down.svg" alt="arrow_down icon" />
            </button>
          </header>
          <img data-reveal class="pd-levels-img pd-desk" src="/images/filter_level.png" alt="Water filtration levels diagram" loading="lazy" />
          <div :class="{ expand: targetExpand, close: !targetExpand }" class="filter_levels_mob pd-mob">
            <img src="/images/filter_level_mob.png" alt="Water filtration levels diagram" loading="lazy" />
          </div>
          <div class="pd-mob pd-center">
            <button
              type="button"
              class="pd-pill pd-pill-ghost-dark close_img_btn"
              :class="{ 'is-hidden': !targetExpand }"
              @click="closeImg()"
            >
              <img class="pd-btn-arrow" src="/assets/arrow_up.svg" alt="arrow_down icon" />
            </button>
          </div>
        </div>
      </section>

      <section class="pd-tile pd-white pd-si">
        <div class="pd-wrap pd-center">
          <!-- 好 {鍶} 低鈉，分子礦化~固骨髓 -->
          <i18n-t keypath="product.filter_si.title" tag="h2" class="pd-h2">
            <template v-slot:si>
              <span class="pd-si">
                <!-- 鍶 -->
                {{ $t('product.filter_si.si') }}
              </span>
            </template>
          </i18n-t>
          <p data-reveal class="pd-lead pd-si-desc">
            <!-- 運用泉感極淨科技，創研分子礦化技術，增加以原始礦源為標準研發的泉感極淨礦層，將鍶原子與水分子有機結合，打造分子級富鍶低鈉好水，不僅提升口感，更能幫助提升骨質密度，增進鈣質代謝，適量補充還能預防蛀牙、強化骨髓。 -->
            {{ $t('product.filter_si.desc') }}
          </p>
        </div>
      </section>

      <section class="pd-tile pd-parchment pd-baby">
        <div class="pd-wrap">
          <div data-reveal-group class="pd-baby-grid">
            <img class="pd-baby-img" src="/images/babywwater_2.png" :alt="$t('product.baby_intro.title')" loading="lazy" />
            <div class="pd-baby-copy">
              <h2 class="pd-h2">
                <!-- 口感清甜，淨飲更有味 -->
                {{ $t('product.baby_intro.title') }}
              </h2>
              <p class="pd-lead pd-lead-left">
                <!-- 口感微甘，寶寶愛喝水，泡茶、泡咖啡更顯清甜風味 -->
                {{ $t('product.baby_intro.desc') }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 產品優勢: one list for every breakpoint (the old page kept a desktop and a mobile copy). -->
      <section class="pd-tile pd-dark pd-advantages">
        <div class="pd-wrap">
          <header class="pd-head pd-center" data-reveal>
            <h2 class="pd-h2">
              <!-- 水維氧AI智慧淨水系統 -->
              {{ $t('product.filter_list.title') }}
            </h2>
          </header>
          <div data-reveal-group class="pd-adv-grid">
            <div v-for="n in 3" :key="n" class="filter_list">
              <img class="pd-adv-icon" src="/assets/check.svg" :alt="$t(`product.filter_list.list0${n}.title`)" />
              <h3>{{ $t(`product.filter_list.list0${n}.title`) }}</h3>
              <p>{{ $t(`product.filter_list.list0${n}.desc`) }}</p>
            </div>
            <div class="filter_list filter_list-fault">
              <img class="pd-adv-icon" src="/assets/fault.svg" alt="傳統淨水器" />
              <h3>{{ $t('product.filter_list.list04.title') }}</h3>
              <ul>
                <li>{{ $t('product.filter_list.list04.desc01') }}</li>
                <li>{{ $t('product.filter_list.list04.desc02') }}</li>
                <li>{{ $t('product.filter_list.list04.desc03') }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="pd-tile pd-white pd-competitor">
        <div class="pd-wrap">
          <header class="pd-head pd-center" data-reveal>
            <h2 class="pd-h2">
              <!-- 水維氧AI智慧淨水系統 -->
              {{ $t('product.competitor.title') }}
            </h2>
          </header>
          <div class="competitor_img pd-desk">
            <img src="/images/competitors.png" alt="" loading="lazy" />
          </div>
          <div class="competitor_img pd-swipe pd-mob">
            <swiper
              :slidesPerView="1"
              :spaceBetween="30"
              :loop="true"
              :pagination="{ clickable: true }"
              :navigation="true"
              :modules="modules"
              :style="{
                '--swiper-navigation-color': '#1d1d1f',
                '--swiper-pagination-color': '#b8431f',
                '--swiper-navigation-size': '15px'
              }"
              :lazy="true"
            >
              <swiper-slide>
                <img src="/images/M3_brand_engo.png" alt="3 牌淨水系統" />
              </swiper-slide>
              <swiper-slide>
                <img src="/images/B_brand_engo.png" alt="B 牌淨水系統" />
              </swiper-slide>
              <swiper-slide>
                <img src="/images/S_brand_engo.png" alt="S 牌淨水系統" />
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </section>

      <!-- 水維氧 enGoW-601 pricing card -->
      <section class="pd-tile pd-parchment wf-price-section">
        <div class="pd-wrap">
          <div data-reveal class="wf-price-card">
            <div class="wf-price-flag">早鳥優惠</div>
            <div class="wf-price-amounts">
              <span class="wf-price-msrp">
                <span class="wf-price-msrp-label">MSRP</span>
                <s>NT$21,000</s>
              </span>
              <span class="wf-price-promo">NT$18,000</span>
            </div>
            <div class="wf-price-bonus">★ 通過 SGS 水質檢測 · BSMI 商品檢驗 雙重認證</div>
            <button class="pd-pill pd-pill-primary wf-buy-btn-card" @click="buyNow">
              {{ $t('product.purchase.btn') }} →
            </button>
          </div>
        </div>
      </section>

      <!-- 智管家商城: the fifth product line (Sean 2026-09-27). A separate site
           (shoph5.smtengo.com), so this section describes and links, never sells here.
           Copy follows KB-001 A.15: same store as the former 安購商城, new version. -->
      <section id="shop" class="pd-tile pd-white shop-line">
        <div class="pd-wrap">
          <header class="pd-head pd-center" data-reveal>
            <h2 class="pd-h2">{{ $t('product.shop.title') }}</h2>
            <p class="pd-lead">{{ $t('product.shop.lede') }}</p>
          </header>
          <figure class="shop-line-figure" data-reveal>
            <div class="shop-line-frame">
              <img src="/images/screens/13-shop-home.jpg" :alt="$t('product.shop.alt')" width="1280" height="720" loading="lazy" />
            </div>
            <figcaption>{{ $t('product.shop.caption') }}</figcaption>
          </figure>
          <ul data-reveal-group class="shop-line-points">
            <li v-for="i in 3" :key="i">
              <strong>{{ $t(`product.shop.points.p${i}.title`) }}</strong>
              <span>{{ $t(`product.shop.points.p${i}.body`) }}</span>
            </li>
          </ul>
          <p class="shop-line-note">{{ $t('product.shop.note') }}</p>
          <div class="shop-line-ctas">
            <a :href="SHOP_URL" target="_blank" rel="noopener" class="pd-pill pd-pill-primary shop-line-btn" data-track="product:shop">{{ $t('product.shop.cta') }}</a>
            <a :href="SHOP_URL + 'subscriptions'" target="_blank" rel="noopener" class="pd-link shop-line-link" data-track="product:shop-plans">{{ $t('product.shop.ctaPlans') }}<span class="pd-chev" aria-hidden="true">›</span></a>
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
    <SectionDots :items="sectionDots" :aria-label="$t('product.tablet_intro.title')" />
  </main>
</template>
<script lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { openShop, SHOP_URL } from '@/utils/shopUrl'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { computed, defineComponent, ref, watch, watchEffect, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import type { CountUpOptions, ICountUp } from 'vue-countup-v3'
import CountUp from 'vue-countup-v3'
import { useRouter } from 'vue-router'
import { useAnalytics } from '@/utils/analytics'
import { injectProductSchemas, cleanupProductSchemas } from '@/utils/productSchema'
import { useEditorialMotion } from '@/composables/useEditorialMotion'
import SectionDots from '@/components/SectionDots.vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Product',
  components: {
    CountUp,
    Swiper,
    SwiperSlide,
    SectionDots,
    ProductCatalog: defineAsyncComponent(() => import('@/components/ProductCatalog.vue')),
    CatalogMenu: defineAsyncComponent(() => import('@/components/CatalogMenu.vue'))
  },
  setup() {
    const { t, locale } = useI18n()
    const observeTarget = ref(null)
    const targetIsVisible = ref(false)

    // ENGO-WEB-001 §3.2 image slots. A figure renders only once a path is set,
    // so an unfilled slot is simply absent — never an empty box.
    //   voice     → shot #2 not taken: the idle screen draws no voice entry point
    //               and the wake method is unconfirmed. Stays text-only until told.
    //   photowall → shot #4 delivered, but it shows a MEDOLE catalogue page rather
    //               than family photos; kept text-only (2026-09-11 feedback).
    //   ios       → 2026-09-23: filled with a REAL enGo iOS capture (iPhone, prd
    //               3.2.2+489, 智管家工作室 household, 米多力3合1 device page). It is a
    //               device-control page, NOT the §3.2 shot #6 home screen: the home
    //               screen carries a live account greeting (a colleague's display
    //               name), so it stays unpublished until that account is changed.
    //               Never substitute the Android shot here.
    const featureImages: Record<'voice' | 'floorplan' | 'photowall' | 'inventory', string | null> = {
      voice: null,
      // 2026-09-27: the floor plan is not in 3.2.2 (開發中); the old capture was a dev build, so no figure.
      floorplan: null,
      photowall: null,
      // 2026-09-22: the only inventory capture shows third-party product names — text-only until a clean capture exists.
      inventory: null
    }
    const interfaceImages: Record<'ios' | 'android', string | null> = {
      ios: '/images/screens/06-device-phone.png',
      android: null   // only a cropped Android shot exists; the store badges carry the platforms
    }
    const router = useRouter()
    const hasHeader = ref(true)
    const { trackEvent } = useAnalytics()

    // Editorial motion (scroll reveals, hero parallax, card tilt) + right-edge section dots.
    const motionRoot = ref<HTMLElement | null>(null)
    useEditorialMotion(motionRoot)
    const sectionDots = computed(() => [
      { id: 'hero', label: t('product.tablet_intro.title') },
      { id: 'intro', label: t('product.brand_intro.title') },
      { id: 'interfaces', label: t('product.interfaces.title') },
      { id: 'features', label: t('product.tablet_function.tag') },
      { id: 'oxygen', label: t('product.water_filter.title') },
      { id: 'shop', label: t('product.shop.title') }
    ])

    // Product JSON-LD schema injection for SEO rich results — re-inject on locale change
    onMounted(() => {
      injectProductSchemas(locale.value)
    })
    watch(locale, (newLocale) => {
      injectProductSchemas(newLocale)
    })
    onUnmounted(() => {
      cleanupProductSchemas()
    })

    // coutup.js options
    const endValueRef = ref(2000)
    const options: CountUpOptions = {
      startVal: 0,
      useEasing: true,
      enableScrollSpy: true,
      scrollSpyDelay: 200 // delay (ms) after target comes into view  目标进入可视范围内后的延迟时间(毫秒)
    }
    let countUp: ICountUp | undefined
    const onInit = (ctx: ICountUp) => {
      countUp = ctx
    }

    const modules = ref([Autoplay, Navigation, Pagination])
    const navigation = ref({
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    })

    if (router.currentRoute.value.name === 'display') hasHeader.value = false

    watchEffect(() => {
      if (router.currentRoute.value.query && router.currentRoute.value.query.jump === 'oxygen') {
        setTimeout(() => {
          let oxygenElement: any = document.getElementById('oxygen')
          if (oxygenElement !== undefined) {
            window.scrollTo(0, oxygenElement.offsetTop)
          }
        }, 100)
      }
      if (router.currentRoute.value.query && router.currentRoute.value.query.jump === 'oxygen1') {
        setTimeout(() => {
          let oxygenElement: any = document.getElementById('oxygen1')
          if (oxygenElement !== undefined) {
            window.scrollTo(0, oxygenElement.offsetTop)
          }
        }, 100)
      }

    })

    const { stop } = useIntersectionObserver(
      observeTarget,
      ([{ isIntersecting }], observerElement) => {
        // Sticky: reveal the feature cards once and leave them; re-hiding on
        // scroll-out made the old annotations flicker.
        if (isIntersecting) targetIsVisible.value = true
      }
    )

    const buyNow = () => {
      trackEvent('buy_now_click', {
        product_id: '428',
        product_name: 'engo_water_purifier',
        product_category: 'water_purifier',
        product_sku: 'enGoW-601',
        price_twd: 18000,
        locale: locale.value
      })
      openShop()
    }

const targetExpand = ref(false)
    const expandImg = () => {
      targetExpand.value = true
    }
    const closeImg = () => {
      targetExpand.value = false
    }

    const scrollToTop = () => {
      window.scrollTo(0, 0)
    }

    const toMall = () => {
      window.open('https://drive.google.com/file/d/1nWgn0EpNhq-n6Vmes8rHGLD8RmcZOCwN/view?usp=sharing')
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
      motionRoot,
      sectionDots,
      SHOP_URL,
      buyNow,
      targetIsVisible,
      observeTarget,
      hasHeader,
      endValueRef,
      options,
      onInit,
      modules,
      navigation,
      targetExpand,
      expandImg,
      closeImg,
      featureImages,
      interfaceImages,
      scrollToTop,
      locale,
      toMall,
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

// ─── Apple-profile page grammar (DESIGN.md + src/views/index.vue) ─────────
// Tokens ($ink, $ink-80, $parchment, $tile-dark, $tile-dark-2, $hairline, $on-dark-muted,
// $product-shadow, $display-font) come from utils/variables. Tiles run edge to edge and
// alternate white / parchment / dark; the colour change is the divider.
//
// Tile order: hero W · intro P · numbers W · interfaces D · features P · oxygen W ·
// filter P · strength W · types P · levels D · strontium W · baby P · advantages D ·
// competitor W · price P · shop W.

.pd { background: #fff; color: $ink; font-family: $display-font; }
.pd a:focus-visible, .pd button:focus-visible { outline: 2px solid $brand-orange-text; outline-offset: 3px; }
.pd-dark a:focus-visible, .pd-dark button:focus-visible { outline-color: $orange2; }
.pd-wrap { max-width: 1240px; margin: 0 auto; padding-inline: clamp(20px, 5vw, 64px); }
.pd-center { text-align: center; }

.pd-tile { padding: clamp(64px, 9vw, 112px) 0; overflow-x: clip; }
.pd-white { background: #fff; color: $ink; }
.pd-parchment { background: $parchment; color: $ink; }
.pd-dark {
  background: $tile-dark; color: #fff;
  .pd-h2, .pd-h3 { color: #fff; }
  .pd-lead, .pd-body { color: $on-dark-muted; }
}

// ─── type: 600 display with negative tracking, 400 body 17px / 1.47 / -.022em ──
.pd-title {
  font-family: $display-font; font-weight: 600; letter-spacing: -.03em; line-height: 1.05; color: $ink; margin: 0;
  font-size: clamp(2.1rem, 8.7vw, 5rem); // 10 CJK glyphs fit one line at 390px, no orphan
}
.pd-tagline {
  font-size: clamp(1.2rem, 1.9vw, 1.75rem); font-weight: 300; line-height: 1.4; letter-spacing: -.005em;
  color: $ink; max-width: 30em; margin: 18px auto 0; text-wrap: balance;
}
.pd-sub {
  display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px;
  margin: 20px 0 0; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; color: $ink-80;
}
.pd-mark { height: 22px; width: auto; }
.pd-h2 {
  font-family: $display-font; font-weight: 600; letter-spacing: -.02em; line-height: 1.1; margin: 0; color: inherit;
  font-size: clamp(2rem, 3.6vw, 3rem);
}
.pd-h2-logo { height: .9em; width: auto; vertical-align: -.08em; margin-right: .2em; }
.pd-h2-line { display: block; }
.pd-amp { font-weight: 400; }
.pd-h3 {
  font-family: $display-font; font-weight: 600; letter-spacing: -.02em; line-height: 1.2; margin: 0 0 14px; color: $ink;
  font-size: clamp(1.5rem, 2.4vw, 2rem);
}
.pd-lead {
  font-size: clamp(1.15rem, 1.7vw, 1.5rem); font-weight: 400; line-height: 1.4; letter-spacing: -.005em;
  color: $ink; margin: 14px auto 0; max-width: 34em;
}
.pd-lead-left { margin-left: 0; margin-right: 0; }
.pd-body { margin: 14px 0 0; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; color: $ink; }
.pd-head { margin-bottom: clamp(36px, 5vw, 64px); }
.pd-head .pd-lead + .pd-h2, .pd-two { margin-top: 0; }
.pd-head .pd-two { margin-bottom: 10px; }
.pd-head .pd-h2 + .pd-lead { margin-top: 14px; }
.pd-inline-link { color: $brand-orange-text; text-decoration: none; &:hover { text-decoration: underline; } }
.pd-dark .pd-inline-link { color: $orange2; }

// ─── the one accent: pills and links ──────────────────────────────────────
.pd-pill {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px; white-space: nowrap; text-decoration: none; cursor: pointer;
  font-family: inherit; font-size: 1.0625rem; font-weight: 400; letter-spacing: -.022em; padding: 11px 22px; min-height: 44px; border-radius: 9999px; border: 1px solid transparent;
  transition: transform .15s ease, background .2s ease; &:active { transform: scale(.95); }
}
.pd-pill-primary { background: $brand-orange-text; color: #fff; &:hover { background: darken($brand-orange-text, 6%); color: #fff; } }
.pd-pill-ghost-dark { background: transparent; color: #fff; border-color: rgba(255, 255, 255, .55); &:hover { background: rgba(255, 255, 255, .08); } }
.pd-btn-arrow { width: 17px; height: 17px; filter: brightness(0) invert(1); }
.pd-link { color: $brand-orange-text; text-decoration: none; font-size: 1.0625rem; letter-spacing: -.022em; &:hover { text-decoration: underline; } }
.pd-chev { margin-left: .25em; }

// ─── responsive show / hide pairs ──────────────────────────────────────────
// !important: the stage/figure rules below set display on the same elements.
.pd-mob, .pd-mob-lg { display: none !important; }
@media (max-width: 768px) {
  .pd-desk { display: none !important; }
  .pd-mob { display: block !important; }
  .pd-mob.pd-pill { display: inline-flex !important; }
}
@media (max-width: 1024px) {
  .pd-desk-lg { display: none !important; }
  .pd-mob-lg { display: block !important; }
  .pd-two-machines.pd-mob-lg { display: flex !important; }
}
.pd-pill.is-hidden { display: none !important; }

// ─── fixed scroll-to-top control (utility button, no shadow) ──────────────
.scroll-top-btn {
  position: fixed; right: 24px; bottom: 24px; z-index: 100; width: 44px; height: 44px; border-radius: 9999px;
  background: $parchment; border: 1px solid $hairline; display: flex; align-items: center; justify-content: center; cursor: pointer;
  transition: transform .15s ease; &:active { transform: scale(.95); }
  img { width: 20px; height: 20px; }
  @media (max-width: 768px) { display: none; }
}

// ─── device frames: brushed titanium body + the single product shadow (copied from the homepage) ───
@mixin metal-frame($radius, $pad, $glass, $screen-radius) {
  position: relative; border-radius: $radius; padding: $pad;
  background:
    repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0 1px, transparent 1px 3px),
    linear-gradient(135deg, #f4f6f8 0%, #c4cad2 16%, #e6e9ed 34%, #adb5bf 52%, #dde1e6 70%, #b6bdc6 86%, #eef1f4 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.95), inset 0 -1px 0 rgba(15,23,32,.28), $product-shadow;
  img { display: block; width: 100%; height: auto; border-radius: $screen-radius; box-shadow: 0 0 0 $glass #0c1219, 0 0 0 ($glass + 1px) rgba(255,255,255,.12); }
}
.pd-iphone { @include metal-frame(34px, 9px, 5px, 22px); }

// ─── hero ─────────────────────────────────────────────────────────────────
.pd-hero { padding-top: clamp(96px, 10vw, 120px); padding-bottom: clamp(48px, 7vw, 88px); }
.pd-hero-device {
  display: block; width: min(960px, 92vw); height: auto; margin: clamp(28px, 5vw, 56px) auto 0;
  // the device PNG is transparent around the body, so the product shadow follows its outline
  filter: drop-shadow(rgba(0, 0, 0, .22) 3px 5px 30px);
}

// ─── intro ────────────────────────────────────────────────────────────────
.pd-intro-grid {
  display: grid; grid-template-columns: 5fr 6fr; gap: clamp(32px, 5vw, 72px); align-items: start;
  @media (max-width: 834px) { grid-template-columns: 1fr; }
}
.pd-intro-img img { display: block; width: 100%; height: auto; border-radius: 18px; }
.pd-intro-copy {
  .pd-h3 { margin-top: 0; }
  .pd-lead { margin-top: 0; }
  .intro-label { font-weight: 600; margin-right: .5em; }
  .intro-figure {
    margin: 24px 0 8px; max-width: 440px;
    img { display: block; width: 100%; height: auto; border-radius: 18px; border: 1px solid $hairline; }
    figcaption { margin-top: 10px; font-size: .875rem; line-height: 1.43; color: $ink-80; }
  }
}

// ─── numbers ──────────────────────────────────────────────────────────────
.pd-count-grid {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px;
  @media (max-width: 1024px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
}
.pd-count {
  display: flex; flex-direction: column; gap: 6px; padding: 28px; background: $parchment; border: 1px solid $hairline; border-radius: 18px;
}
.pd-count-icon { width: 36px; height: 36px; filter: brightness(0); opacity: .85; margin-bottom: 14px; }
.pd-count-num {
  display: flex; align-items: baseline; gap: 8px; font-family: $display-font; font-weight: 600; letter-spacing: -.03em; line-height: 1;
  font-size: clamp(2.6rem, 4.4vw, 4rem); font-variant-numeric: tabular-nums; color: $ink;
}
.pd-count-unit { font-size: clamp(1.15rem, 1.7vw, 1.5rem); font-weight: 400; letter-spacing: -.01em; color: $ink-80; }
.pd-count-info { margin: 0; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; color: $ink-80; }

// ─── 三種介面，一組帳號 (dark tile; .interfaces-table classes are GSAP targets) ───
.interfaces {
  &-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  &-table {
    width: 100%; min-width: 640px; border-collapse: collapse; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em;
    th, td { padding: 18px 16px; border-bottom: 1px solid rgba(255, 255, 255, .18); text-align: center; vertical-align: middle; }
    thead th, thead td { border-bottom: 1px solid rgba(255, 255, 255, .5); }
    thead th { font-family: $display-font; font-weight: 600; font-size: 1.3125rem; color: #fff; letter-spacing: -.01em; }
    tbody th { text-align: left; font-weight: 400; width: 34%; color: #fff; }
    @media (max-width: 768px) {
      // 480 in a ~330px box leaves the second column half visible: that is the cue the table scrolls.
      font-size: .9375rem; min-width: 480px;
      th, td { padding: 14px 10px; }
      thead th { font-size: 1rem; }
    }
  }
  .if-yes { color: #fff; font-size: 1.1em; }
  .if-no { color: $on-dark-muted; opacity: .6; }
  .if-only { display: block; margin-top: 4px; font-size: .75rem; line-height: 1.3; color: $on-dark-muted; }
  &-hint { margin: 10px 0 0; font-size: .875rem; color: $on-dark-muted; }
  &-note { max-width: 42em; margin: 28px auto 0; text-align: center; font-size: 1.0625rem; line-height: 1.47; color: $on-dark-muted; }
  &-stores {
    display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 12px; margin: 20px 0 0;
    a { display: inline-flex; flex: none; line-height: 0; border: 0; padding: 0; background: none; transition: transform .15s ease; &:active { transform: scale(.95); } }
    img { display: block; width: auto; max-width: none; }
    .badge-apple { height: 40px; }
    // Google's generic badge ships with transparent padding (~20%); oversize it so the visible badge
    // matches the Apple one, and pull the padding back with margins.
    .badge-google { height: 60px; margin: -10px -14px; }
  }
  &-figures {
    display: flex; flex-wrap: wrap; justify-content: center; gap: 32px; margin-top: clamp(36px, 5vw, 56px);
    figure { margin: 0; flex: 0 1 240px; }
    figcaption { margin-top: 14px; text-align: center; font-size: .875rem; color: $on-dark-muted; }
  }
}

// ─── 功能介紹 ─────────────────────────────────────────────────────────────
.tf-features {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; margin: 0 auto;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
}
.tf-card {
  background: #fff; border: 1px solid $hairline; border-radius: 18px; padding: 32px; color: $ink;
  h3 { margin: 0 0 12px; font-size: 1.5rem; line-height: 1.25; font-weight: 600; letter-spacing: -.02em; color: $ink; }
  p { margin: 0; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; color: $ink-80; }
  .tf-note { margin-top: 14px; padding-top: 12px; border-top: 1px solid $hairline; font-weight: 600; color: $ink; }
  @media (max-width: 768px) { padding: 24px 20px; }
}
.tf-card-head { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
// status chips, not kickers: plain sentence-case text in a hairline pill
.tf-badge { padding: 2px 12px; font-size: .875rem; line-height: 1.5; color: $ink-80; border: 1px solid $hairline; border-radius: 9999px; background: $parchment; }
.tf-figure {
  margin: 0 0 18px; aspect-ratio: 1920 / 1236; overflow: hidden;
  img { display: block; width: 100%; height: 100%; object-fit: contain; }
}

// ─── 水維氧 ───────────────────────────────────────────────────────────────
.pd-oxygen-photo { display: block; width: 100%; max-width: 1100px; height: auto; margin: 0 auto; border-radius: 18px; box-shadow: $product-shadow; }
.pd-two-machines {
  position: relative; display: flex; align-items: flex-end; justify-content: center; gap: 24px;
  .pd-m01 { width: 22%; max-width: 123px; height: auto; border-radius: 18px; }
  .pd-m02 { width: 70%; max-width: 498px; height: auto; border-radius: 18px; box-shadow: $product-shadow; }
}
.pd-water .pd-head { margin-bottom: clamp(28px, 4vw, 48px); }

// dark stages for renders whose callouts are white text baked into the PNG
.pd-stage {
  position: relative; background: $tile-dark; border-radius: 18px; padding: clamp(24px, 4vw, 56px); margin: 0 auto; max-width: 1100px;
  img { display: block; width: 100%; height: auto; margin: 0 auto; }
}
.filter-core img.pd-desk { max-width: 720px; }
.filter-core .qr-code-container {
  position: absolute; left: clamp(20px, 3vw, 40px); bottom: clamp(16px, 3vw, 32px); display: flex; flex-direction: column; align-items: center; gap: 8px;
  font-size: .875rem; color: $on-dark-muted;
  img { width: 72px; }
  @media (max-width: 768px) { position: static; margin: 20px auto 0; }
}
.water-loop img.pd-desk { max-width: 950px; }
.pd-stage-small { max-width: 320px !important; border-radius: 12px; }
.pd-stage-list {
  list-style: decimal; margin: 20px 0 0; padding: 0 0 0 1.4em; text-align: left; color: #fff; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em;
  li { margin-top: 6px; }
}
.pd-swipe {
  max-width: 420px; margin: 0 auto;
  img { display: block; width: 100%; height: auto; border-radius: 18px; }
  :deep(.swiper-button-prev), :deep(.swiper-button-next) { width: 30px !important; height: 30px !important; border: 1px solid $hairline; border-radius: 9999px; background: #fff; }
}
.pd-water .pd-stage.pd-desk img[src$='filter_types.png'] { max-width: 1000px; }

// 進口RO
.pd-levels-img { display: block; width: 100%; max-width: 640px; height: auto; margin: 0 auto; border-radius: 18px; }
.filter_levels_mob {
  max-width: 360px; margin: 24px auto 0; max-height: 0; overflow: hidden; transition: max-height .4s ease;
  &.expand { max-height: 9999px; }
  &.close { max-height: 0; }
  img { display: block; width: 100%; height: auto; border-radius: 18px; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
}
.close_img_btn { margin-top: 20px; min-width: 44px; padding: 11px; }

// 鍶
.pd-si-desc { max-width: 38em; }
.pd-baby-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 72px); align-items: center;
  @media (max-width: 834px) { grid-template-columns: 1fr; }
}
.pd-baby-img { display: block; width: 100%; height: auto; border-radius: 18px; }

// 產品優勢
.pd-adv-grid {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
}
.filter_list {
  background: $tile-dark-2; border: 1px solid rgba(255, 255, 255, .18); border-radius: 18px; padding: 32px; color: #fff;
  h3 { margin: 14px 0 10px; font-size: 1.5rem; line-height: 1.25; font-weight: 600; letter-spacing: -.02em; color: #fff; }
  p, li { margin: 0; font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; color: $on-dark-muted; }
  ul { margin: 0; padding-left: 1.2em; li { margin-top: 6px; } }
  // the check / cross glyphs ship as green / red strokes; render them neutral white
  .pd-adv-icon { width: 36px; height: 36px; filter: grayscale(1) brightness(10); }
  &-fault .pd-adv-icon { opacity: .6; }
}

// 比較表 (the PNG carries its own table colours)
.competitor_img img { display: block; width: 100%; max-width: 1000px; height: auto; margin: 0 auto; }

// ─── 價格 ─────────────────────────────────────────────────────────────────
.wf-price-card {
  display: flex; flex-direction: column; align-items: center; gap: 14px; max-width: 520px; margin: 0 auto; padding: 40px;
  background: #fff; border: 1px solid $hairline; border-radius: 18px; color: $ink; text-align: center;
  @media (max-width: 560px) { padding: 28px 20px; }
}
.wf-price-flag { font-size: 1.0625rem; font-weight: 600; letter-spacing: -.022em; color: $ink-80; }
.wf-price-amounts { display: flex; align-items: baseline; justify-content: center; flex-wrap: wrap; gap: 16px; }
.wf-price-msrp {
  display: inline-flex; flex-direction: column; align-items: center; font-size: 1.0625rem; color: $ink-80;
  .wf-price-msrp-label { font-size: .875rem; margin-bottom: 2px; }
}
.wf-price-promo { font-family: $display-font; font-weight: 600; font-size: clamp(2.2rem, 4vw, 3rem); letter-spacing: -.03em; color: $ink; }
.wf-price-bonus { font-size: 1.0625rem; line-height: 1.47; color: $ink-80; }
.wf-buy-btn-card { margin-top: 6px; padding-inline: 36px; }

// ─── 智管家商城 ───────────────────────────────────────────────────────────
.shop-line-figure {
  margin: 0 auto; max-width: 1000px;
  figcaption { margin-top: 18px; text-align: center; font-size: .875rem; line-height: 1.43; color: $ink-80; }
}
.shop-line-frame {
  border-radius: 18px; overflow: hidden; background: #fff; box-shadow: $product-shadow;
  img { display: block; width: 100%; height: auto; }
}
.shop-line-points {
  list-style: none; padding: 0; margin: clamp(36px, 5vw, 64px) 0 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px;
  @media (max-width: 834px) { grid-template-columns: 1fr; }
  li { display: flex; flex-direction: column; gap: 8px; padding: 28px; background: $parchment; border: 1px solid $hairline; border-radius: 18px; }
  strong { font-size: 1.3125rem; font-weight: 600; letter-spacing: -.01em; color: $ink; }
  span { font-size: 1.0625rem; line-height: 1.47; letter-spacing: -.022em; color: $ink-80; }
}
.shop-line-note { max-width: 42em; margin: 32px auto 0; text-align: center; font-size: 1.0625rem; line-height: 1.47; color: $ink-80; }
.shop-line-ctas { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 14px 28px; margin-top: 28px; }

@media (prefers-reduced-motion: reduce) {
  .pd-pill, .scroll-top-btn, .interfaces-stores a { transition: none; }
}
</style>
