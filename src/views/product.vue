<template>
  <section>
    <div class="product-container">
      <!-- 【桌機】立即購買 -->
      <!-- 
      <button class="buy-now-btn" @click="buyNow">
        {{ $t('product.purchase.btn') }}
      </button>
      -->
      <!-- 【平板】立即購買 -->
      <!-- 
      <div class="buy-now-tab-btn" @click="buyNow">
        <img src="../assets/images/shopping-cart.png" />
      </div>
      -->
      <!-- 【桌機】滑到最上icon -->
      <div class="scroll-top-btn" @click="scrollToTop">
        <img src="../assets/images/scroll-top.png" />
      </div>
      <div class="tablet_intro mt-mob-56 pb-44 pb-tab-20" :class="{ 'mt-70': hasHeader }">
        <div class="container title_wrap d-flex fd-column ai-c text-white mt-54 mb-24 mt-mob-40">
          <h2 class="h2-title fz-48 lh-70 fz-mob-24 lh-mob-34 fw-600">
            <!-- AI智慧家居全能管家 -->
            {{ $t('product.tablet_intro.title') }}
          </h2>
          <div class="subtitle fz-24 lh-36 fz-mob-14 lh-mob-18 fw-500 fw-mob-700">
            <!-- enGo智慧中控平板，可用AI語音操作，整合智慧管家、商城、食譜、物業連結及訊息管理。 -->
            <img class="engo-white" src="../assets/images/footer_logo_white.png" />
            {{ $t('product.tablet_intro.info') }}
          </div>
        </div>
        <img src="../assets/images/tablet_1.png" alt="tablet photo" />
      </div>
      <div class="gradient_container_i">
        <div class="brand_intro pt-88 pb-72 pt-tab-80 pb-tab-86 py-mob-0">
          <div class="title_wrap">
            <div
              class="badge text-white bg-grey-blue2 fz-mob-18 lh-mob-26 fw-mob-500 py-10 px-20 py-mob-12 px-mob-18"
            >
              <img class="pr-8" src="../assets/logo_G.svg" alt="engo logo branding" />
              <!-- 產品介紹 -->
              {{ $t('product.brand_intro.badge') }}
            </div>
            <h2
              class="product-describe fz-72 fw-700 text-grey-blue tac mt-36 mb-56 d-tab-none d-mob-none"
            >
              <!-- 【桌機】AI智慧管家中控平板 -->
              <img src="../assets/images/logo_darkblue.svg" />
              {{ $t('product.brand_intro.title') }}
            </h2>
            <!-- 【手機】家中的大小事，都是智管家的事... -->
            <i18n-t
              keypath="product.brand_intro.subTitle_mob"
              tag="h3"
              class="fz-mob-16 lh-mob-24 fw-mob-500 text-mob-white tac mt-mob-16 d-none d-mob-block"
            >
              <template v-slot:housekeeper>
                <span class="text-orange">
                  <!-- 智管家 -->
                  {{ $t('product.brand_intro.housekeeper') }}
                </span>
              </template>
            </i18n-t>
            <h2
              class="fz-tab-56 lh-tab-78 fz-mob-24 lh-mob-34 fw-tab-500 text-grey-blue text-mob-white tac mt-tab-36 mb-tab-70 my-mob-12 d-none d-tab-block d-mob-block"
            >
              <!-- 【平板/手機】AI 替您輕鬆管理家中一切 -->
              {{ $t('product.brand_intro.title_tab') }}
            </h2>
          </div>
          <div class="brand_desc d-flex">
            <div class="brand_desc_img d-mob-none">
              <img src="../assets/images/Frame74.png" alt="廚房平板位置" />
            </div>
            <div class="brand_desc_info pl-72 pr-100 pr-tab-74 px-mob-24 text-grey-blue fw-500">
              <h3 class="fw-500 fz-36 lh-50 text-grey-blue tac pt-30 mb-32 d-tab-none d-mob-none">
                <!-- 【桌機】AI 管家替您輕鬆管理家中一切 -->
                {{ $t('product.brand_intro.subTitle') }}
              </h3>
              <h4 class="fw-500 fz-24 lh-34 d-tab-none d-mob-none">
                <!-- 【桌機】通過整合智能照明、智能家電、安全監控、音響系統、門鎖及水處理等設備，提升了家居的舒適度、安全性和能源效率。用戶可以隨時隨地通過手機或enGo
                AI智慧中控平板遠程控制和監控。 -->
                {{ $t('product.brand_intro.desc01') }}
              </h4>
              <h4 class="fw-500 fz-tab-20 lh-tab-28 d-none d-tab-block d-mob-none">
                <!-- 【平板】通過整合智能照明、智能家電、安全監控、音響系統、門鎖及水處理等設備，提升了家居的舒適度、安全性和能源效率。用戶可以隨時隨地通過手機或enGo
                AI智慧中控平板遠程控制和監控。 -->
                {{ $t('product.brand_intro.desc01_tab') }}
              </h4>
              <h4 class="fw-500 fz-mob-14 lh-mob-20 text-mob-white d-none d-mob-block">
                <!-- 智管家是一個創新平台，將智慧AI科技深度融入家庭生活，提供智慧管家式的貼心照顧。 -->
                {{ $t('product.brand_intro.desc01_mob') }}
              </h4>
              <br />
              <h4 class="fw-500 fz-24 lh-34 fz-tab-20 lh-tab-28 d-mob-none">
                <!-- 智管家以人工智慧、物聯網和自動化技術為核心，致力於讓生活更便利、更健康，為您和家人打造安全、舒適、便捷的智慧生活，讓AI智慧整合系統替您創造美好生活。 -->
                {{ $t('product.brand_intro.desc02') }}
              </h4>
              <h4
                class="readMore_wrap fw-500 fz-mob-14 lh-mob-20 text-mob-white d-none d-mob-block"
                v-show="!isExpandWrReadMore"
              >
                <!-- 通過整合智能照明、智能家電、安全監控、音響系統、門鎖及水處理等設備，提升了家居的舒適度、安全性和能源效率。用戶可以隨時隨地通過手機或enGo AI智慧中控平板遠程控制和監控。
智管家以人工智慧、物聯網和自動化技術為核心，致力於讓生活更便利、更健康，為您和家人打造安全、舒適、便捷的智慧生活，讓AI智慧整合系統替您創造美好生活。 -->
                {{ $t('product.brand_intro.desc02_mob') }}
              </h4>
              <h4
                class="fw-500 fz-mob-14 lh-mob-20 text-mob-white d-none d-mob-block"
                v-show="isExpandWrReadMore"
              >
                <!-- 通過整合智能照明、智能家電、安全監控、音響系統、門鎖及水處理等設備，提升了家居的舒適度、安全性和能源效率。用戶可以隨時隨地通過手機或enGo AI智慧中控平板遠程控制和監控。
智管家以人工智慧、物聯網和自動化技術為核心，致力於讓生活更便利、更健康，為您和家人打造安全、舒適、便捷的智慧生活，讓AI智慧整合系統替您創造美好生活。 -->
                {{ $t('product.brand_intro.desc02_mob') }}
              </h4>
              <div
                @click="expandReadMore()"
                class="jc-fe ai-c text-white d-none"
                :class="{ 'd-mob-flex': !isExpandWrReadMore }"
              >
                <div class="readMore_txt">
                  <!-- 閱讀更多 -->
                  {{ $t('product.brand_intro.readMore') }}
                </div>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#FFFFFF"
                  >
                    <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 以下數字使用 CountUp.js 套件 -->
        <!-- 【桌機/平板】 -->
        <div class="d-flex jc-se p-40 px-tab-20 py-tab-24 d-mob-none">
          <div class="count_card text-grey-blue2 d-flex jc-sb p-32 p-tab-20">
            <div class="d-flex fd-column jc-sb">
              <div class="count_card_number">
                <span class="fz-72 fz-tab-58 fw-500 pr-8">
                  <count-up
                    :end-val="24"
                    :duration="2.5"
                    :options="options"
                    @init="onInit"
                  ></count-up>
                </span>
                <span class="fz-32 fz-tab-20 fw-500">
                  <!-- 項 -->
                  {{ $t('product.brand_intro.countCard.card01.unit') }}
                </span>
              </div>
              <div>
                <span class="fz-24 fw-500">
                  <!-- 專利設計 -->
                  {{ $t('product.brand_intro.countCard.card01.info') }}
                </span>
              </div>
            </div>
            <div>
              <img src="../assets/file-badge.svg" alt="專利icon" />
            </div>
          </div>
          <div class="count_card text-grey-blue2 d-flex jc-sb p-32 p-tab-20">
            <div class="d-flex fd-column jc-sb">
              <div class="count_card_number">
                <span class="fz-72 fz-tab-58 fw-500 pr-8">
                  <count-up
                    :end-val="30"
                    :duration="3"
                    :options="options"
                    @init="onInit"
                  ></count-up>
                </span>
                <span class="fz-32 fz-tab-20 fw-500">
                  <!-- 種 -->
                  {{ $t('product.brand_intro.countCard.card02.unit') }}
                </span>
              </div>
              <div>
                <span class="fz-24 fw-500">
                  <!-- AI 功能 -->
                  {{ $t('product.brand_intro.countCard.card02.info') }}
                </span>
              </div>
            </div>
            <div>
              <img src="../assets/brain__circuit.svg" alt="AI功能 icon" />
            </div>
          </div>
          <div class="count_card text-grey-blue2 d-flex jc-sb p-32 p-tab-20">
            <div class="d-flex fd-column jc-sb">
              <div class="count_card_number">
                <span class="fz-72 fz-tab-58 fw-500 pr-8">
                  <count-up :end-val="5" :duration="2" :options="options" @init="onInit"></count-up>
                </span>
                <span class="fz-32 fz-tab-20 fw-500">
                  <!-- 年 -->
                  {{ $t('product.brand_intro.countCard.card03.unit') }}
                </span>
              </div>
              <div>
                <span class="fz-24 fw-500">
                  <!-- 研發時間 -->
                  {{ $t('product.brand_intro.countCard.card03.info') }}
                </span>
              </div>
            </div>
            <div>
              <img src="../assets/lightbulb.svg" alt="研發 icon" />
            </div>
          </div>
          <div class="count_card text-grey-blue2 d-flex jc-sb p-32 p-tab-20">
            <div class="d-flex fd-column jc-sb">
              <div class="count_card_number">
                <span class="fz-72 fz-tab-58 fw-500 pr-8">
                  <count-up
                    :end-val="10"
                    :duration="2.5"
                    :options="options"
                    @init="onInit"
                  ></count-up>
                </span>
                <span class="fz-32 fz-tab-20 fw-500">
                  <!-- 萬次 -->
                  {{ $t('product.brand_intro.countCard.card04.unit') }}
                </span>
              </div>
              <div>
                <span class="fz-24 fw-500">
                  <!-- 驗證測試 -->
                  {{ $t('product.brand_intro.countCard.card04.info') }}
                </span>
              </div>
            </div>
            <div>
              <img src="../assets/test_tubes.svg" alt="驗證測試 icon" />
            </div>
          </div>
        </div>
        <!-- 【手機】 -->
        <div class="d-mob-flex jc-se px-20 py-24 d-none d-tab-none">
          <div class="count_card text-grey-blue2 px-8 py-10">
            <div class="d-flex jc-fs">
              <img src="../assets/file-badge.svg" alt="專利icon" />
            </div>
            <div class="pos-r tac">
              <div class="fz-72 fw-500 mb-12 d-flex jc-c ai-fs">
                <div class="pos-r">
                  <count-up
                    :end-val="24"
                    :duration="2.5"
                    :options="options"
                    @init="onInit"
                  ></count-up>
                  <div class="fz-20 lh-28 fw-700 pos-a" style="right: -20px; top: 0">
                    <!-- 項 -->
                    {{ $t('product.brand_intro.countCard.card01.unit') }}
                  </div>
                </div>
              </div>
            </div>
            <div class="tac">
              <span class="fz-20 lh-28 fw-500">
                <!-- 專利設計 -->
                {{ $t('product.brand_intro.countCard.card01.info') }}
              </span>
            </div>
          </div>
          <div class="count_card text-grey-blue2 px-8 py-10">
            <div class="d-flex jc-fs">
              <img src="../assets/brain__circuit.svg" alt="AI功能 icon" />
            </div>
            <div class="pos-r tac">
              <div class="fz-72 fw-500 mb-12 d-flex jc-c ai-fs">
                <div class="pos-r">
                  <count-up
                    :end-val="30"
                    :duration="3"
                    :options="options"
                    @init="onInit"
                  ></count-up>
                  <div class="fz-20 lh-28 fw-700 pos-a" style="right: -20px; top: 0">
                    <!-- 種 -->
                    {{ $t('product.brand_intro.countCard.card02.unit') }}
                  </div>
                </div>
              </div>
            </div>
            <div class="tac">
              <span class="fz-20 lh-28 fw-500">
                <!-- AI 功能 -->
                {{ $t('product.brand_intro.countCard.card02.info') }}
              </span>
            </div>
          </div>
        </div>
        <div class="d-mob-flex jc-se px-20 mb-24 d-none d-tab-none">
          <div class="count_card text-grey-blue2 px-8 py-10">
            <div class="d-flex jc-fs">
              <img src="../assets/test_tubes.svg" alt="驗證測試 icon" />
            </div>
            <div class="pos-r tac">
              <div class="fz-72 fw-500 mb-12 d-flex jc-c ai-fs">
                <div class="pos-r">
                  <count-up
                    :end-val="10"
                    :duration="2.5"
                    :options="options"
                    @init="onInit"
                  ></count-up>
                  <div
                    class="fz-20 lh-28 fw-700 pos-a d-flex fd-column jc-sb"
                    style="height: 70px; width: 20px; right: -20px; top: 0"
                  >
                    <div>
                      <!-- 次 -->
                      {{ $t('product.brand_intro.countCard.card04.unit') }}
                    </div>
                    <div>
                      <!-- 萬 -->
                      {{ $t('product.brand_intro.countCard.card04.tenThousand') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tac">
              <span class="fz-20 lh-28 fw-500">
                <!-- 驗證測試 -->
                {{ $t('product.brand_intro.countCard.card04.info') }}
              </span>
            </div>
          </div>
          <div class="count_card text-grey-blue2 px-8 py-10">
            <div class="d-flex jc-fs">
              <img src="../assets/lightbulb.svg" alt="研發 icon" />
            </div>
            <div class="pos-r tac">
              <div class="fz-72 fw-500 mb-12 d-flex jc-c ai-fs">
                <div class="pos-r">
                  <count-up :end-val="5" :duration="2" :options="options" @init="onInit"></count-up>
                  <div class="fz-20 lh-28 fw-700 pos-a" style="right: -20px; top: 0">
                    <!-- 年 -->
                    {{ $t('product.brand_intro.countCard.card03.unit') }}
                  </div>
                </div>
              </div>
            </div>
            <div class="tac">
              <span class="fz-20 lh-28 fw-500">
                <!-- 研發時間 -->
                {{ $t('product.brand_intro.countCard.card03.info') }}
              </span>
            </div>
          </div>
        </div>
        <div
          ref="observeTarget"
          class="tablet_function pt-64 pb-80 px-118 px-tab-50 pt-mob-60 pb-mob-40 px-mob-10 pos-r"
        >
          <div class="tag text-white d-flex ai-c py-8 px-16 ml-mob-0">
            <img class="pr-4" src="../assets/joystick.svg" alt="function icon" />
            <div>
              <!-- 功能介紹 -->
              {{ $t('product.tablet_function.tag') }}
            </div>
          </div>
          <!-- 【桌機/平板】黃框動畫 -->
          <div class="pos-r d-mob-none">
            <div class="d-flex jc-fe pt-162">
              <div class="tablet_img pos-r">
                <img src="../assets/images/tablet_1.png" alt="平板介面介紹" />
                <div class="annotation annotation_A" :class="{ animate2: targetIsVisible }"></div>
                <div class="annotation annotation_B" :class="{ animate2: targetIsVisible }"></div>
                <div class="annotation annotation_C" :class="{ animate2: targetIsVisible }"></div>
                <div class="annotation annotation_D" :class="{ animate2: targetIsVisible }"></div>
              </div>
            </div>
            <div
              class="pos-a p-16 annotation_frame annotation_text_A"
              :class="{ animate1: targetIsVisible, animate4: targetIsVisible }"
            >
              <div class="pos-a annotation_line_A01">
                <div class="pos-a dot dot-01"></div>
                <div class="pos-a dot dot-02"></div>
              </div>
              <div class="pos-a annotation_line_A02">
                <div class="pos-a dot dot-01"></div>
              </div>
              <div class="pos-a annotation_line_A03">
                <div class="pos-a dot dot-01"></div>
              </div>
              <h4 class="text-gold fz-32 lh-46 fz-tab-24 lh-tab-34 fw-700">
                <!-- 資訊整合平台 -->
                {{ $t('product.tablet_function.annotation.A.title') }}
              </h4>
              <h5 class="text-white fz-16 lh-24 fw-500">
                <!-- 社區物業、家庭、個人訊息管理， 資訊同步不漏接 -->
                {{ $t('product.tablet_function.annotation.A.info') }}
              </h5>
            </div>
            <div
              class="pos-a p-16 annotation_frame annotation_text_B"
              :class="{ animate1: targetIsVisible, animate3: targetIsVisible }"
            >
              <div class="pos-a annotation_line_B">
                <div class="pos-a dot dot-01"></div>
                <div class="pos-a dot dot-02"></div>
              </div>
              <h4 class="text-gold fz-32 lh-46 fz-tab-24 lh-tab-34 fw-700">
                <!-- 智慧倉儲管理 -->
                {{ $t('product.tablet_function.annotation.B.title') }}
              </h4>
              <h5 class="text-white fz-16 lh-24 fw-500">
                <!-- 家庭儲物隨時監控，並與商城服 務連結，缺什麼馬上補！ -->
                {{ $t('product.tablet_function.annotation.B.info') }}
              </h5>
            </div>
            <div
              class="pos-a p-16 annotation_frame annotation_text_C"
              :class="{ animate1: targetIsVisible, animate3: targetIsVisible }"
            >
              <div class="pos-a annotation_line_C">
                <div class="pos-a dot dot-01"></div>
                <div class="pos-a dot dot-02"></div>
              </div>
              <h4 class="text-gold fz-32 lh-46 fz-tab-24 lh-tab-34 fw-700">
                <!-- AIoT 雲端智慧串連 -->
                {{ $t('product.tablet_function.annotation.C.title') }}
              </h4>
              <h5 class="text-white fz-16 lh-24 fw-500">
                <!-- 隨時掌控居家聯網設備狀態與管理，AI 管家 24hr 全天候守護 -->
                {{ $t('product.tablet_function.annotation.C.info') }}
              </h5>
            </div>
          </div>
          <!-- 【手機】黃框輪播 -->
          <div class="mob_img_wrap d-none d-mob-block">
            <div class="d-flex jc-c ai-fe fz-24 fw-700 text-white">
              <!-- 【桌機】AI智慧管家中控平板 -->
              <img class="engo-white mr-8" src="../assets/images/footer_logo_white.png" />
              <h3 class="fz-24 fw-700 text-white">
                {{ $t('product.brand_intro.title') }}
              </h3>
            </div>
            <swiper
              :slidesPerView="1"
              :spaceBetween="30"
              :loop="true"
              :pagination="{
                clickable: true
              }"
              :navigation="true"
              :modules="modules"
              :style="{
                '--swiper-navigation-color': '#043655',
                '--swiper-pagination-color': '#043655',
                '--swiper-navigation-size': '15px'
              }"
              :lazy="true"
            >
              <swiper-slide class="px-30 pt-20 pb-24">
                <div class="tablet_img pos-r mb-24">
                  <img src="../assets/images/tablet_1.png" alt="平板介面介紹" />
                  <div class="annotation annotation_A" :class="{ animate2: targetIsVisible }"></div>
                </div>
                <h4 class="text-gold fz-32 lh-46 fz-tab-24 lh-tab-34 fw-700">
                  <!-- 智慧倉儲管理 -->
                  {{ $t('product.tablet_function.annotation.B.title') }}
                </h4>
                <h5 class="text-white fz-16 lh-24 fw-500">
                  <!-- 家庭儲物隨時監控，並與商城服 務連結，缺什麼馬上補！ -->
                  {{ $t('product.tablet_function.annotation.B.info') }}
                </h5>
              </swiper-slide>
              <swiper-slide class="px-30 pt-20 pb-24">
                <div class="tablet_img pos-r mb-24">
                  <img src="../assets/images/tablet_1.png" alt="平板介面介紹" />
                  <div class="annotation annotation_C" :class="{ animate2: targetIsVisible }"></div>
                  <div class="annotation annotation_D" :class="{ animate2: targetIsVisible }"></div>
                </div>
                <h4 class="text-gold fz-32 lh-46 fz-tab-24 lh-tab-34 fw-700">
                  <!-- 資訊整合平台 -->
                  {{ $t('product.tablet_function.annotation.A.title') }}
                </h4>
                <h5 class="text-white fz-16 lh-24 fw-500">
                  <!-- 社區物業、家庭、個人訊息管理， 資訊同步不漏接 -->
                  {{ $t('product.tablet_function.annotation.A.info') }}
                </h5>
              </swiper-slide>
              <swiper-slide class="px-30 pt-20 pb-24">
                <div class="tablet_img pos-r mb-24">
                  <img src="../assets/images/tablet_1.png" alt="平板介面介紹" />
                  <div class="annotation annotation_B" :class="{ animate2: targetIsVisible }"></div>
                </div>
                <h4 class="text-gold fz-32 lh-46 fz-tab-24 lh-tab-34 fw-700">
                  <!-- AIoT 雲端智慧串連 -->
                  {{ $t('product.tablet_function.annotation.C.title') }}
                </h4>
                <h5 class="text-white fz-16 lh-24 fw-500">
                  <!-- 隨時掌控居家聯網設備狀態與管理，AI 管家 24hr 全天候守護 -->
                  {{ $t('product.tablet_function.annotation.C.info') }}
                </h5>
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </div>
      <div class="gradient_container_ii text-white text-mob-grey-blue2">
        <div
          id="oxygen"
          class="engo_products px-142 px-tab-80 px-mob-36 pt-106 pb-124 pb-tab-0 pt-mob-140 pb-mob-20 pos-r"
        >
          <!-- 兩機一體 -->
          <div class="two-machines fz-32 fz-mob-20 fw-400">
            <div style="display: flex; align-items: flex-end">
              <div class="two-machines-txt text-white fz-32 fz-mob-16">
                {{ $t('product.engo_products.two') }}
              </div>
              <div class="two-machines-txt-lines fz-32 fz-mob-16">
                {{ $t('product.engo_products.twoMachines') }}
              </div>
            </div>
          </div>
          <div class="tag text-white px-16 py-8 mb-30 d-flex">
            <img src="../assets/glasswater.svg" alt="智慧應用icon" />
            <span>
              <!-- 智慧應用 -->
              {{ $t('product.engo_products.btn') }}
            </span>
          </div>
          <h4 class="text-gold fz-24 lh-30 fz-tab-16 lh-tab-20 d-mob-none">
            <!-- 從進水到出水層層把關，濾芯狀態看得見 -->
            {{ $t('product.engo_products.info') }}
          </h4>
          <h3 class="fz-48 lh-60 fz-tab-32 lh-tab-40 d-mob-none">
            <!-- 水維氧AI智慧淨水系統 + -->
            {{ $t('product.engo_products.title01') }}
          </h3>
          <h3 class="fz-48 lh-60 fz-tab-32 lh-tab-40 d-mob-none">
            <span class="pr-12">&</span>
            <!-- AI 智慧管家中控平板 -->
            {{ $t('product.engo_products.title02') }}
          </h3>
          <div class="two-machines-bg pos-r d-none d-tab-block d-mob-block mt-0 mt-tab-60 mt-mob-0">
            <div class="machine01 pos-a">
              <img src="../assets/two-machines01.png" alt="兩機一體" />
            </div>
            <div class="machine02 pos-a d-flex fd-column ai-fe">
              <img class="mb-40" src="../assets/two-machines02.png" alt="兩機一體" />
              <h4 class="fz-16 lh-20 tar d-tab-none">
                <!-- 從進水到出水層層把關，濾芯狀態看得見 -->
                {{ $t('product.engo_products.info') }}
              </h4>
            </div>
          </div>
        </div>
        <div class="water_filter pos-r pt-70 pt-mob-0">
          <div class="container ai-c mb-80 mb-mob-30">
            <h2 class="fz-72 fz-tab-64 fz-mob-30 lh-104 lh-tab-92 lh-mob-48 fw-700 tac">
              <!-- 水維氧AI智慧淨水系統 -->
              {{ $t('product.water_filter.title') }}
            </h2>
            <i18n-t
              keypath="product.water_filter.subTitle"
              tag="h3"
              class="fz-24 lh-30 fz-mob-18 lh-mob-24 fw-500"
            >
              <template v-slot:quality>
                <a
                  class="text-gold text-mob-grey-blue2"
                  href="https://oss.smtengo.com/engo-bucket-prod/device/WechatIMG87.pdf"
                  target="_blank"
                >
                  <!-- SGS水質檢測 -->
                  {{ $t('product.water_filter.quality') }}
                </a>
              </template>
              <template v-slot:valid>
                <a
                  class="text-gold text-mob-grey-blue2"
                  href="https://oss.smtengo.com/engo-bucket-prod/device/20240719132511.pdf"
                  target="_blank"
                >
                  <!-- BSMI商品檢驗 -->
                  {{ $t('product.water_filter.valid') }}
                </a>
              </template>
            </i18n-t>
          </div>
          <div class="filter-core container px-mob-24">
            <div class="qr-code-container">
              <img src="../assets/images/qr-code.png" />
              <div class="">投保證書</div>
            </div>
            <img class="d-mob-none" src="../assets/images/filter_side.png" alt="濾芯" />
            <img class="d-none d-mob-block" src="../assets/images/filter_core.png" alt="濾芯" />
            <div class="d-none d-mob-flex fd-column ai-fe fz-16 lh-20 fw-700">
              <!-- 1. 一體式水路板 -->
              1. {{ $t('product.water_filter.filterCore01') }}<br />
              <!-- 2. 三重濾心過濾 -->
              2. {{ $t('product.water_filter.filterCore02') }}
            </div>
          </div>
        </div>
        <div class="filter_strength container pt-116 pt-mob-30">
          <div class="tag mb-18">
            <img src="../assets/layers.svg" alt="產品特點 icon" />
            <!-- 產品特點 -->
            {{ $t('product.filter_strength.tag') }}
          </div>
          <div class="d-flex fd-column jc-c ai-c mb-112 mb-mob-18 text-white pos-r">
            <div class="bg-text bg-text-l d-none d-mob-block">1</div>
            <h3 class="fz-48 lh-70 fz-mob-20 lh-mob-32 fw-700">
              <!-- 無儲水桶設計，安心防漏不滋菌 -->
              {{ $t('product.filter_strength.title') }}
            </h3>
            <h5 class="fz-24 lh-34 fz-mob-14 lh-mob-20 fw-500">
              <!-- 避免複雜管線產生漏水風險。免儲水桶儲水，杜絕藏污納垢與細菌滋生。 -->
              {{ $t('product.filter_strength.desc') }}
            </h5>
            <div class="d-none d-mob-flex fd-column as-fe fz-14 lh-20 fw-700">
              <!-- 1. 減少管路連接 -->
              1. {{ $t('product.filter_strength.water_loop01') }}<br />
              <!-- 2. 充分利用產品空間 -->
              2. {{ $t('product.filter_strength.water_loop02') }}<br />
              <!-- 3. 杜絕漏水風險 -->
              3. {{ $t('product.filter_strength.water_loop03') }}<br />
              <!-- 4. 可承受強壓 -->
              4. {{ $t('product.filter_strength.water_loop04') }}<br />
            </div>
          </div>
          <div class="water-loop container px-mob-24">
            <img class="d-mob-none" src="../assets/images/water_loop.png" alt="強效過濾濾芯" />
            <img
              class="d-none d-mob-block"
              src="../assets/images/water_loop_mob.png"
              alt="強效過濾濾芯"
            />
          </div>
        </div>
        <div class="filter_types container d-flex fd-column ai-c pt-160 pt-mob-30 text-white pos-r">
          <div class="bg-text bg-text-r d-none d-mob-block">2</div>
          <h3 class="fz-48 lh-70 fz-mob-20 lh-mob-32 fw-700 mb-38 mb-mob-24">
            <!-- 多重強效過濾，好濾芯大口喝水 -->
            {{ $t('product.filter_types.title') }}
          </h3>
          <div class="img_wrap d-mob-none">
            <img src="../assets/images/filter_types.png" alt="強效過濾濾心" />
          </div>
          <div class="img_wrap d-none d-mob-block">
            <swiper
              :slidesPerView="1"
              :spaceBetween="30"
              :loop="true"
              :pagination="{
                clickable: true
              }"
              :navigation="true"
              :modules="modules"
              :style="{
                '--swiper-navigation-color': '#333',
                '--swiper-pagination-color': '#fff',
                '--swiper-navigation-size': '15px'
              }"
              :lazy="true"
            >
              <swiper-slide>
                <img src="../assets/images/SRM.png" alt="SRM 富鍶礦化濾心" />
              </swiper-slide>
              <swiper-slide>
                <img src="../assets/images/RO.png" alt="RO逆滲透膜" />
              </swiper-slide>
              <swiper-slide>
                <img src="../assets/images/PPC.png" alt="PPC複合濾芯" />
              </swiper-slide>
            </swiper>
          </div>
        </div>
        <div class="d-none d-mob-flex fd-column ai-c pt-80 pb-50 px-24 pos-r">
          <div class="bg-text bg-text-r">3</div>
          <h2 class="title text-white fz-mob-20 lh-mob-32 fw-700 mb-12">
            <!-- 進口RO，AI智慧淨濾，只為安心 -->
            {{ $t('product.filter_levels.title') }}
          </h2>
          <div class="subtitle">
            <h5 class="text-white fz-mob-16 lh-mob-24 fw-400">
              <!-- 深度精確過濾有效過濾和除原水中的泥沙、懸浮物、餘氯、苯、甲醛、重金屬、細菌、病毒、異味等所有雜質。
              將原水過濾為帶有礦物質的極淨礦泉水。 -->
              {{ $t('product.filter_levels.subTitle') }}
            </h5>
          </div>
          <div
            @click="expandImg()"
            class="filter_detail_btn ai-c mt-32 py-10 px-24 text-grey-blue2 bg-white"
            :class="{ 'd-none': targetExpand, 'd-flex': !targetExpand }"
          >
            <!-- 查看更多 -->
            {{ $t('product.filter_levels.detail') }}
            <img class="pl-4" src="../assets/arrow_down.svg" alt="arrow_down icon" />
          </div>
        </div>
      </div>
      <div
        :class="{ expand: targetExpand, close: !targetExpand }"
        class="filter_levels_mob d-none d-mob-block bg-grey-blue2"
      >
        <img src="../assets/images/filter_level_mob.png" />
      </div>
      <div class="filter_levels d-flex fd-column ai-c d-mob-none">
        <img src="../assets/images/filter_level.png" />
        <div class="container filter-text-container">
          <h2 class="title text-white fz-72 lh-104 fz-tab-48 lh-tab-70 fw-700 mb-46 mb-tab-24">
            <!-- 進口RO，AI智慧淨濾，只為安心 -->
            {{ $t('product.filter_levels.title') }}
          </h2>
          <div class="subtitle d-mob-none">
            <h5 class="text-white fz-32 lh-46 fz-tab-24 lh-tab-36 fw-400">
              <!-- 深度精確過濾有效過濾和除原水中的泥沙、懸浮物、餘氯、苯、甲醛、重金屬、細菌、病毒、異味等所有雜質。
              將原水過濾為帶有礦物質的極淨礦泉水。 -->
              {{ $t('product.filter_levels.subTitle') }}
            </h5>
          </div>
        </div>
      </div>
      <div
        class="filter_si text-white pt-92 px-168 px-tab-100 pb-mob-54 px-mob-0"
        :class="{ 'pt-mob-44': !targetExpand, 'pt-mob-12': targetExpand }"
      >
        <div class="d-none d-mob-flex jc-c">
          <div
            @click="closeImg()"
            class="close_img_btn jc-c ai-c py-10 px-10 text-grey-blue2 bg-white"
            :class="{ 'd-none': !targetExpand, 'd-flex': targetExpand }"
          >
            <img src="../assets/arrow_up.svg" alt="arrow_down icon" />
          </div>
        </div>
        <div class="d-none d-mob-block pos-r">
          <img class="pos-a pl-24" src="../assets/water_drop.svg" alt="水滴icon" />
          <div class="p-mob-24">
            <!-- 好 {鍶} 低鈉，分子礦化~固骨髓 -->
            <i18n-t
              keypath="product.filter_si.title"
              tag="h3"
              class="fz-20 lh-32 tac mb-12 d-none-d-mob-block"
            >
              <template v-slot:si>
                <span class="text-orange fz-28 lh-40">
                  <!-- 鍶 -->
                  {{ $t('product.filter_si.si') }}
                </span>
              </template>
            </i18n-t>
            <h6 class="fz-14 lh-20 fw-500">
              <!-- 運用泉感極淨科技，創研分子礦化技術，增加以原始礦源為標準研發的泉感極淨礦層，將鍶原子與水分子有機結合，打造分子級富鍶低鈉好水，不僅提升口感，更能幫助提升骨質密度，增進鈣質代謝，適量補充還能預防蛀牙、強化骨髓。 -->
              {{ $t('product.filter_si.desc') }}
            </h6>
            <div class="bg-text bg-text-lb">4</div>
          </div>
        </div>
        <!-- 好 {鍶} 低鈉，分子礦化~固骨髓 -->
        <i18n-t
          keypath="product.filter_si.title"
          tag="h3"
          class="fz-48 lh-70 fz-tab-32 lh-tab-50 fw-500 pl-58 pl-tab-32 mb-12 d-mob-none"
        >
          <template v-slot:si>
            <span class="text-orange fz-64 lh-92">
              <!-- 鍶 -->
              {{ $t('product.filter_si.si') }}
            </span>
          </template>
        </i18n-t>
        <div class="si_wrap p-32 d-flex ai-fs d-mob-none">
          <img class="pr-20" src="../assets/water_drop.svg" alt="水滴icon" />
          <h6 class="fz-32 lh-48 fw-500">
            <!-- 運用泉感極淨科技，創研分子礦化技術，增加以原始礦源為標準研發的泉感極淨礦層，將鍶原子與水分子有機結合，打造分子級富鍶低鈉好水，不僅提升口感，更能幫助提升骨質密度，增進鈣質代謝，適量補充還能預防蛀牙、強化骨髓。 -->
            {{ $t('product.filter_si.desc') }}
          </h6>
        </div>
      </div>
      <div class="baby_intro d-flex d-mob-none">
        <div class="baby_intro_img"></div>
        <div class="baby_intro_info">
          <div class="intro_wrap py-200 px-160 py-tab-100 px-tab-60">
            <img class="mb-8" src="../assets/water_drop.svg" alt="水滴 icon" />
            <h6 class="text-white fz-40 lh-58 fz-tab-28 lh-tab-36 fw-700 mb-8">
              <!-- 口感清甜，淨飲更有味 -->
              {{ $t('product.baby_intro.title') }}
            </h6>
            <h6 class="text-white fz-32 lh-46 fz-tab-20 lh-tab-32 fw-400">
              <!-- 口感微甘，寶寶愛喝水，泡茶、泡咖啡更顯清甜風味 -->
              {{ $t('product.baby_intro.desc') }}
            </h6>
          </div>
        </div>
      </div>
      <div class="gradient_container_iii">
        <div class="background_i">
          <div class="d-flex jc-fe ai-c">
            <h3 class="fz-32 lh-46 fw-500 mr-22">
              <!-- 水維氧AI智慧淨水系統 -->
              {{ $t('product.filter_list.title') }}
            </h3>
            <img src="../assets/water_drop.svg" alt="水滴 icon" />
          </div>
          <div class="filter_list">
            <ul class="text_0">
              <li class="list_header fz-40 lh-58 fz-tab-32 lh-tab-46">
                <img src="../assets/check.svg" alt="斷水設計" />
                <span>
                  <!-- 漏水監控斷水設計 -->
                  {{ $t('product.filter_list.list01.title') }}
                </span>
              </li>
              <li class="fz-32 lh-44 fz-tab-24 lh-tab-32">
                <!-- 智能漏水監控，立即自動斷水並即時提示。 -->
                {{ $t('product.filter_list.list01.desc') }}
              </li>
            </ul>
          </div>
          <div class="filter_list">
            <ul class="text_0">
              <li class="list_header fz-40 lh-58 fz-tab-32 lh-tab-46">
                <img src="../assets/check.svg" alt="即時掌控水值" />
                <span>
                  <!-- 即時掌控TDS水值 -->
                  {{ $t('product.filter_list.list02.title') }}
                </span>
              </li>
              <li class="fz-32 lh-44 fz-tab-24 lh-tab-32">
                <!-- 中控系統即時顯示目前TDS水值與飲用量，好水看得見、飲用最放心！ -->
                {{ $t('product.filter_list.list02.desc') }}
              </li>
            </ul>
          </div>
          <div class="filter_list">
            <ul class="text_0">
              <li class="list_header fz-40 lh-58 fz-tab-32 lh-tab-46">
                <img src="../assets/check.svg" alt="濾芯狀態智慧提醒" />
                <span>
                  <!-- 濾芯狀態智慧提醒 -->
                  {{ $t('product.filter_list.list03.title') }}
                </span>
              </li>
              <li class="fz-32 lh-44 fz-tab-24 lh-tab-32">
                <!-- 當濾芯使用壽命低於10%，智管家智慧AI系統自動提示更換。 -->
                {{ $t('product.filter_list.list03.desc') }}
              </li>
            </ul>
          </div>
          <div class="filter_list">
            <ul class="text_0">
              <li class="list_header fz-40 lh-58 fz-tab-32 lh-tab-46">
                <img src="../assets/fault.svg" alt="傳統淨水器" />
                <span>
                  <!-- 傳統淨水器 -->
                  {{ $t('product.filter_list.list04.title') }}
                </span>
              </li>
              <li class="fz-32 lh-44 fz-tab-24 lh-tab-32">
                <!-- 無法掌握當前飲用水狀態，飲水品質難以確保。 -->
                {{ $t('product.filter_list.list04.desc01') }}
              </li>
              <li class="fz-32 lh-44 fz-tab-24 lh-tab-32">
                <!-- 漏水發生無法即時應變。 -->
                {{ $t('product.filter_list.list04.desc02') }}
              </li>
              <li class="fz-32 lh-44 fz-tab-24 lh-tab-32">
                <!-- 濾心狀態無法即時掌握更換時機。 -->
                {{ $t('product.filter_list.list04.desc03') }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 產品優勢 -->
      <div class="productAdvantages pb-32 px-24 d-none d-mob-flex fd-column">
        <div class="tag as-fs mb-32">
          <img src="../assets/radar.svg" alt="產品比較 icon" />
          <span>
            <!-- 產品優勢 -->
            {{ $t('product.advantages') }}
          </span>
        </div>
        <div class="filter_list mb-12">
          <ul>
            <li class="list_header d-flex ai-c">
              <img class="mr-8" src="../assets/check.svg" alt="斷水設計" />
              <span class="fz-24 lh-30 fw-900 text-grey-blue2">
                <!-- 漏水監控斷水設計 -->
                {{ $t('product.filter_list.list01.title') }}
              </span>
            </li>
            <li class="fz-18 lh-24 fw-500 text-grey-blue2 ml-64">
              <!-- 智能漏水監控，立即自動斷水並即時提示。 -->
              {{ $t('product.filter_list.list01.desc') }}
            </li>
          </ul>
        </div>
        <div class="filter_list mb-12">
          <ul>
            <li class="list_header d-flex ai-c">
              <img class="mr-8" src="../assets/check.svg" alt="即時掌控水值" />
              <span class="fz-24 lh-30 fw-900 text-grey-blue2">
                <!-- 即時掌控TDS水值 -->
                {{ $t('product.filter_list.list02.title') }}
              </span>
            </li>
            <li class="fz-18 lh-24 fw-500 text-grey-blue2 ml-64">
              <!-- 中控系統即時顯示目前TDS水值與飲用量，好水看得見、飲用最放心！ -->
              {{ $t('product.filter_list.list02.desc') }}
            </li>
          </ul>
        </div>
        <div class="filter_list mb-12">
          <ul>
            <li class="list_header d-flex ai-c">
              <img class="mr-8" src="../assets/check.svg" alt="濾芯狀態智慧提醒" />
              <span class="fz-24 lh-30 fw-900 text-grey-blue2">
                <!-- 濾芯狀態智慧提醒 -->
                {{ $t('product.filter_list.list03.title') }}
              </span>
            </li>
            <li class="fz-18 lh-24 fw-500 text-grey-blue2 ml-64">
              <!-- 當濾芯使用壽命低於10%，智管家智慧AI系統自動提示更換。 -->
              {{ $t('product.filter_list.list03.desc') }}
            </li>
          </ul>
        </div>
        <div class="filter_list">
          <ul>
            <li class="list_header d-flex ai-c">
              <img class="mr-8" src="../assets/fault.svg" alt="傳統淨水器" />
              <span class="fz-24 lh-30 fw-900 text-grey-blue2">
                <!-- 傳統淨水器 -->
                {{ $t('product.filter_list.list04.title') }}
              </span>
            </li>
            <li class="fz-18 lh-24 fw-500 text-grey-blue2 ml-64">
              <!-- 無法掌握當前飲用水狀態，飲水品質難以確保。 -->
              {{ $t('product.filter_list.list04.desc01') }}
            </li>
            <li class="fz-18 lh-24 fw-500 text-grey-blue2 ml-64">
              <!-- 漏水發生無法即時應變。 -->
              {{ $t('product.filter_list.list04.desc02') }}
            </li>
            <li class="fz-18 lh-24 fw-500 text-grey-blue2 ml-64">
              <!-- 濾心狀態無法即時掌握更換時機。 -->
              {{ $t('product.filter_list.list04.desc03') }}
            </li>
          </ul>
        </div>
      </div>
      <div class="background_B">
        <div class="competitor container d-flex fd-column ai-c py-80 py-mob-0">
          <div class="tag as-fs mb-12">
            <img src="../assets/radar.svg" alt="{{ $t('product.air_purifier.tag') }} icon" />
            <span>
              <!-- 產品比較 -->
              {{ $t('product.competitor.tag') }}
            </span>
          </div>
          <h2 class="text-white fz-72 lh-104 fz-tab-48 lh-tab-70 fw-700 d-mob-none">
            <!-- 水維氧AI智慧淨水系統 -->
            {{ $t('product.competitor.title') }}
          </h2>
          <div class="competitor_img d-mob-none">
            <img src="../assets/images/competitors.png" alt="" />
          </div>
          <div class="competitor_img d-none d-mob-block">
            <swiper
              :slidesPerView="1"
              :spaceBetween="30"
              :loop="true"
              :pagination="{
                clickable: true
              }"
              :navigation="true"
              :modules="modules"
              class="d-none d-mob-block"
              :style="{
                '--swiper-navigation-color': '#333',
                '--swiper-pagination-color': '#fff',
                '--swiper-navigation-size': '15px'
              }"
              :lazy="true"
            >
              <swiper-slide>
                <img src="../assets/images/M3_brand_engo.png" alt="3 牌淨水系統" />
              </swiper-slide>
              <swiper-slide>
                <img src="../assets/images/B_brand_engo.png" alt="B 牌淨水系統" />
              </swiper-slide>
              <swiper-slide>
                <img src="../assets/images/S_brand_engo.png" alt="S 牌淨水系統" />
              </swiper-slide>
            </swiper>
          </div>
        </div>
        <!-- <div class="purchase container d-flex fd-column ai-c pb-80 d-mob-none">
          <div class="tag as-fs mb-12">
            <img class="pr-8" src="../assets/shopping_bag.svg" alt="購買方式" />
            <span>
              {{ $t('product.purchase.tag') }}
            </span>
          </div>

          <div class="card_2 flex_horizontal">
            <img src="../assets/images/pack.png" alt="早鳥優惠價" />
            <div class="d-flex fd-column jc-sa p-24 pos-r">
              <div class="btn_wrap">
                <span class="flag">
                  {{ $t('product.purchase.flag') }}
                </span>
                <div></div>
                <button @click="buyNow">
                  {{ $t('product.purchase.btn') }}
                </button>
              </div>
              <span class="fz-32 lh-46 fw-500 text-grey-blue3">
                {{ $t('product.purchase.title') }}
              </span>
              <span class="subtitle fz-20 lh-28 fw-400">
                {{ $t('product.purchase.desc') }}
              </span>
              <div class="price tar fz-48 fw-500">＄39,800</div>
            </div>
          </div>
        </div>-->
      </div>
      <div
  id="oxygen1"
  class="engo_products scroll-anchor px-142 px-tab-80 px-mob-36 pt-106 pb-124 pb-tab-0 pt-mob-140 pb-mob-20 pos-r"
  aria-hidden="true"
></div>
        <div class="background_B">
        <div class="competitor container d-flex fd-column ai-c py-80 py-mob-0">
          <div class="tag as-fs mb-12">
            <img src="../assets/radar.svg" alt="{{ $t('product.air_purifier.tag') }} icon" />
            <span>
              <!-- 產品比較 -->
              {{ $t('product.air_purifier.tag') }}
            </span>
          </div>
          <h2 class="text-white fz-72 lh-104 fz-tab-48 lh-tab-70 fw-700 d-mob-none">
            <!-- 水維氧AI智慧淨水系統 -->
            {{ $t('product.air_purifier.title') }}
          </h2>
          <div class="competitor_img d-mob-none">
            <img src="../assets/images/AirPurifier001.png" alt="" />
            <img src="../assets/images/AirPurifier002.png" alt="" />
            <img src="../assets/images/AirPurifier003.png" alt="" />
            <img src="../assets/images/AirPurifier004.png" alt="" />
            <img src="../assets/images/AirPurifier005.png" alt="" />
            <img src="../assets/images/AirPurifier006.png" alt="" />
            <img src="../assets/images/AirPurifier007.png" alt="" />
            <img src="../assets/images/AirPurifier008.png" alt="" />
          </div>
          <div class="competitor_img d-none d-mob-block">
            <swiper
              :slidesPerView="1"
              :spaceBetween="30"
              :loop="true"
              :pagination="{
                clickable: true
              }"
              :navigation="true"
              :modules="modules"
              class="d-none d-mob-block"
              :style="{
                '--swiper-navigation-color': '#333',
                '--swiper-pagination-color': '#fff',
                '--swiper-navigation-size': '15px'
              }"
              :lazy="true"
            >
              <swiper-slide>
                <img src="../assets/images/AirPurifier001.png" alt="空氣清淨機" />
              </swiper-slide>
               <swiper-slide>
                <img src="../assets/images/AirPurifier002.png" alt="空氣清淨機" />
              </swiper-slide>
              <swiper-slide>
                <img src="../assets/images/AirPurifier003.png" alt="空氣清淨機" />
              </swiper-slide> 
              <swiper-slide>
                <img src="../assets/images/AirPurifier004.png" alt="空氣清淨機" />
              </swiper-slide>
              <swiper-slide>
                <img src="../assets/images/AirPurifier005.png" alt="空氣清淨機" />
              </swiper-slide>
              <swiper-slide>
                <img src="../assets/images/AirPurifier006.png" alt="空氣清淨機" />
              </swiper-slide>
              <swiper-slide>
                <img src="../assets/images/AirPurifier007.png" alt="空氣清淨機" />
              </swiper-slide>
              <swiper-slide>
                <img src="../assets/images/AirPurifier008.png" alt="空氣清淨機" />
              </swiper-slide>                                                                                   
            </swiper>
          </div>
        </div>
      </div>
      <div class="purchase-btn pos-f bg-orange2 d-none d-mob-block" @click="buyNow">
        <div class="container d-flex jc-c ai-c py-20">
          <img class="mr-4" src="../assets/shopping-cart.svg" alt="購物車 icon" />
          <span class="text-white fw-500">
            <!-- 立即訂購 -->
            {{ $t('product.purchase.btn') }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { defineComponent, ref, watchEffect } from 'vue'
import type { CountUpOptions, ICountUp } from 'vue-countup-v3'
import CountUp from 'vue-countup-v3'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Product',
  components: {
    CountUp,
    Swiper,
    SwiperSlide
  },
  setup() {
    const observeTarget = ref(null)
    const targetIsVisible = ref(false)
    const router = useRouter()
    const hasHeader = ref(true)
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
        targetIsVisible.value = isIntersecting
      }
    )

    const buyNow = () => {
      window.open('https://h5.smtengo.com/pages/item/espier-detail?id=326&dtid=0')
    }

    const targetExpand = ref(false)
    const expandImg = () => {
      targetExpand.value = true
    }
    const closeImg = () => {
      targetExpand.value = false
    }

    const isExpandWrReadMore = ref(false)
    const expandReadMore = () => {
      isExpandWrReadMore.value = true
    }

    const scrollToTop = () => {
      window.scrollTo(0, 0)
    }

    return {
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
      isExpandWrReadMore,
      expandReadMore,
      scrollToTop
    }
  }
})
</script>
