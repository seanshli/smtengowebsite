<template>
  <div class="contact">
    <div class="contact_wrap">
      <div class="contact_title">
        <h1 class="fz-48 lh-70 fw-500">{{ $t('contactUsTitle') }}</h1>
        <p class="fz-24 lh-34 web">{{ $t('contactUsSubtitle') }}</p>
        <div class="phone container">
          <div class="phone">{{ $t('contactUsSubtitle1') }}</div>
          <div class="phone">{{ $t('contactUsSubtitle2') }}</div>
        </div>
      </div>
      <!-- Voucher banner: always shown to surface the EAP-01 offer to every /contact visitor -->
      <div class="voucher-banner" :class="{ 'voucher-banner--prefilled': isVoucherRequest }">
        <span class="voucher-banner-icon">🎁</span>
        <div class="voucher-banner-text">
          <strong>EAP-01 空氣清淨機｜獨家折扣碼限時申請</strong>
          <p v-if="isVoucherRequest">
            您正在申請 EAP-01 折扣碼。填寫以下聯絡資料，我們將於 1–2 個工作日內將專屬折扣碼寄至您的 Email。
          </p>
          <p v-else>
            對 EAP-01 有興趣嗎？填寫下方資料並於「我想了解的是」選擇<strong>產品 → 空氣清淨機</strong>，
            我們將於 1–2 個工作日內將獨家折扣碼寄至您的 Email。
          </p>
        </div>
        <a
          href="https://www.zeczec.com/projects/enGo-Smart-Manager-AI-AirPurifier"
          target="_blank"
          rel="noopener"
          class="voucher-banner-cta"
          @click="trackVoucherCtaClick"
        >
          先看看 EAP-01 →
        </a>
      </div>
      <div class="contact_inputs flex_vertical">
        <div class="input_label">
          <input
            type="text"
            :placeholder="`${$t('name')}(${$t('required')})`"
            name="name"
            v-model="name"
          />
        </div>
        <div class="input_label">
          <input
            type="text"
            :placeholder="`${$t('phone')}(${$t('required')})`"
            name="phone"
            v-model="phone"
          />
        </div>
        <div class="input_label">
          <input type="text" :placeholder="$t('email')" name="email" v-model="email" />
        </div>
        <div class="input_wrap">
          <div class="input_label--short">
            <select class="custom_select" name="city" required v-model="city">
              <option value="" selected disabled hidden>
                {{ `${$t('city')}(${$t('required')})` }}
              </option>
              <option :value="$t('tpe')">{{ $t('tpe') }}</option>
              <option :value="$t('ntpe')">{{ $t('ntpe') }}</option>
              <option :value="$t('ht')">{{ $t('ht') }}</option>
              <option :value="$t('tj')">{{ $t('tj') }}</option>
              <option :value="$t('tn')">{{ $t('tn') }}</option>
              <option :value="$t('kh')">{{ $t('kh') }}</option>
              <option :value="$t('hl')">{{ $t('hl') }}</option>
              <option :value="$t('pd')">{{ $t('pd') }}</option>
              <option :value="$t('td')">{{ $t('td') }}</option>
              <option :value="$t('jh')">{{ $t('jh') }}</option>
              <option :value="$t('other')">{{ $t('other') }}</option>
            </select>
          </div>

          <div class="input_label--long">
            <input type="text" :placeholder="$t('address')" name="address" v-model="address" />
          </div>
        </div>
        <div class="input_label">
          <!-- 我想了解的是 -->
          <select class="custom_select" name="interest" v-model="interest">
            <option value="" selected disabled hidden>
              {{ `${$t('interest')}(${$t('required')})` }}
            </option>
            <option value="product">{{ $t('interestType1') }}</option>
            <option value="fix">{{ $t('interestType2') }}</option>
            <option value="showroom">{{ $t('interestType5') }}</option>
            <option value="smarthome">{{ $t('interestType4') }}</option>
            <option value="other">{{ $t('interestType3') }}</option>
          </select>
        </div>
        <div class="input_wrap" v-if="interest === 'product'">
          <div class="input_label">
            <!-- 選擇產品 -->
            <select class="custom_select" name="messagetype" v-model="messagetype">
              <option value="" selected disabled hidden>
                {{ `${$t('messagetypePlaceholder')}(${$t('required')})` }}
              </option>
              <option value="engosystem">{{ $t('msgType1') }}</option>
              <option value="waterfilter">{{ $t('msgType2') }}</option>
			  <option value="airfilter">{{ $t('msgType3') }}</option>
            </select>
          </div>
          <div class="input_label">
            <!-- 選擇方案 -->
            <select class="custom_select" name="plan" v-model="plan">
              <option value="" selected disabled hidden>
                {{ `${$t('planPlaceholder')}(${$t('required')})` }}
              </option>
              <option v-for="(item, index) in planOptions" :key="index" :value="item.id">
                {{ item.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="textarea_label">
          <label for="message">{{ $t('message') }}</label>
          <textarea
            name="message"
            :placeholder="$t('messagePlaceholder')"
            v-model="message"
          ></textarea>
        </div>
      <div class="line-btn-container mt-4">
        <button class="contact-form-line" @click="jumpToLine">
          <img src="/images/link_Line.png" alt="LINE" class="line-icon" />
          {{ $t('contactOnLine') }}
        </button>
      </div>
      
      <div id="form-error-message" class="mt-12">{{ errorMessage }}</div>
      <button class="contact-form-submit" @click="submitForm">{{ $t('submitForm') }}</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { config } from '../configs/systemConfig'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useAnalytics } from '@/utils/analytics'

export default defineComponent({
  name: 'Contact',
  setup() {
    const name = ref('')
    const email = ref('')
    const phone = ref('')
    const region = ref('')
    const city = ref('')
    const address = ref('')
    const interest = ref('')
    const messagetype = ref('')
    const plan = ref('')
    const message = ref('')
    const errorMessage = ref('')

    // Voucher lead-capture flow: when /contact?topic=eap01_voucher is opened
    // (e.g. from the EAP-01 product page voucher link), prefill the form with
    // air-purifier interest + a templated message so the user just adds their
    // contact details. submitForm() also tags the productType with a voucher
    // flag so admins can filter these in Supabase.
    const isVoucherRequest = ref(false)

    const { locale, tm, t } = useI18n()
    const { trackEvent } = useAnalytics()

    const planOptions = computed(() => {
      return tm('planItems') as any[]
    })

    const route = useRoute()
    const router = useRouter()

    onMounted(() => {
      const topic = (route.query.topic || '').toString()
      if (topic === 'eap01_voucher') {
        isVoucherRequest.value = true
        interest.value = 'product'
        messagetype.value = 'airfilter'
        // Pre-fill the message; user can edit before submitting.
        message.value = '我想申請 EAP-01 空氣清淨機的獨家折扣碼，請寄送至上方留下的 Email。謝謝！'
        trackEvent('voucher_form_opened', { product: 'EAP-01', source: route.query.from || 'direct' })
      } else {
        // Banner is now visible to all /contact visitors — track impression so we can
        // measure conversion lift from the universal banner vs. the targeted voucher URL.
        trackEvent('voucher_banner_impression', { source: 'organic_contact' })
      }
    })

    const trackVoucherCtaClick = () => {
      trackEvent('voucher_banner_cta_click', {
        product: 'EAP-01',
        destination: 'zeczec',
        source: isVoucherRequest.value ? 'voucher_link' : 'organic_contact'
      })
    }

    const jumpToLine = () => {
      trackEvent('click_contact_line')
      window.open('https://lin.ee/THIUSjW')
    }

    const handleError = () => {
      errorMessage.value = 'Something went wrong. Please try again later.'
      trackEvent('form_submit_error', { error: errorMessage.value })
    }

    const validateRequired = () => {
      if (name.value === '') {
        errorMessage.value = `${t('enterEmpty')}"${t('name')}"`
        trackEvent('form_validation_error', { field: 'name', error: errorMessage.value })
        return false
      }
      if (phone.value === '') {
        errorMessage.value = `${t('enterEmpty')}"${t('phone')}"`
        trackEvent('form_validation_error', { field: 'phone', error: errorMessage.value })
        return false
      }
      if (email.value === '') {
        errorMessage.value = `${t('enterEmpty')}"${t('email')}"`
        trackEvent('form_validation_error', { field: 'email', error: errorMessage.value })
        return false
      }
      if (city.value === '') {
        errorMessage.value = `${t('enterEmpty')}"${t('city')}"`
        trackEvent('form_validation_error', { field: 'city', error: errorMessage.value })
        return false
      }
      if (interest.value === '') {
        errorMessage.value = `${t('enterEmpty')}"${t('interest')}"`
        trackEvent('form_validation_error', { field: 'interest', error: errorMessage.value })
        return false
      }

      if (interest.value === 'product') {
        if (messagetype.value === '') {
          errorMessage.value = `${t('enterEmpty')}"${t('messagetype')}"`
          trackEvent('form_validation_error', { field: 'messagetype', error: errorMessage.value })
          return false
        }
        if (plan.value === '') {
          errorMessage.value = `${t('enterEmpty')}"${t('plan')}"`
          trackEvent('form_validation_error', { field: 'plan', error: errorMessage.value })
          return false
        }
      }

      return true
    }

    const validateEmail = () => {
      const isValid = email.value.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      if (!isValid) {
        errorMessage.value = t('enterValidMail')
        trackEvent('form_validation_error', { field: 'email', error: 'Invalid format' })
        return false
      }

      return true
    }

    const validatePhone = () => {
      const isMobile = phone.value.match(/^09[0-9]{8}$/)
      if (!isMobile) {
        errorMessage.value = t('enterValidPhone')
        trackEvent('form_validation_error', { field: 'phone', error: 'Invalid format' })
        return false
      }

      return true
    }

    const submitForm = async () => {
      trackEvent('form_submit_attempt')
      
      if (!validateRequired()) return
      if (!validatePhone()) return
      if (!validateEmail()) return
      let productType = "";
       // 判斷 div 是否被隱藏
      if (interest.value !== 'product') {
        // div 被隱藏時的邏輯
        productType = interest.value;
        plan.value = "";
        console.log('Product/Plan section is hidden');
      } else {
        // div 顯示時的邏輯 (interest.value === 'product')
        // 根據您之前的邏輯，這裡 messagetype 和 plan 應該有值
        if (messagetype.value !== "" && plan.value !== "") {
          productType = interest.value + "," + messagetype.value;
        } else {
          productType = interest.value;
        }
        console.log('Product/Plan section is visible');
      }

      // Voucher flow: tag productType so it's easy to filter these submissions in Supabase.
      // Tag as voucher_eap01 if EITHER:
      //   1) Came from /contact?topic=eap01_voucher (explicit voucher link click), OR
      //   2) User organically selected 產品 → 空氣清淨機 (active EAP-01 interest)
      // Result: every potential EAP-01 lead is captured for the manual voucher email workflow.
      const isAirPurifierInterest = interest.value === 'product' && messagetype.value === 'airfilter';
      if (isVoucherRequest.value || isAirPurifierInterest) {
        productType = `voucher_eap01,${productType}`;
      }
      const data = {
        name: name.value,
        email: email.value,
        phone: phone.value,
        region: region.value,
        city: city.value,
        address: address.value,
        servicePlanId: plan.value,
        productType: productType,
        message: message.value
      }
      
      console.log('data', data)
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        if (!response.ok) {
          handleError()
          return
        }

        trackEvent('form_submit_success', { productType })
        router.push({ name: 'success' })
      } catch (error) {
        console.log(error)
        handleError()
      }
    }


    // getPlanOptions() - replaced by computed planOptions from locale



    return {
      name,
      email,
      phone,
      region,
      city,
      address,
      messagetype,
      plan,
      message,
      submitForm,
      errorMessage,
      locale,
      interest,
      planOptions,
      jumpToLine,
      isVoucherRequest,
      trackVoucherCtaClick
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/css/utils/_variables.scss';
@import '@/css/pages/_contact.scss';

.voucher-banner {
  display: flex;
  align-items: center;
  gap: 18px;
  background: linear-gradient(135deg, #fff5f0 0%, #ffe7d9 100%);
  border: 1px solid #f5c4ad;
  border-left: 5px solid #e05a35;
  border-radius: 14px;
  padding: 22px 26px;
  margin: 0 0 28px;
  box-shadow: 0 4px 18px rgba(224, 90, 53, 0.12);
  position: relative;

  // Pulse the border-left when user landed via the voucher link itself —
  // they're warmest, so emphasize the "you got it" vibe.
  &--prefilled {
    border-left-width: 7px;
    background: linear-gradient(135deg, #ffefe5 0%, #ffd6bd 100%);

    &::before {
      content: '已啟用';
      position: absolute;
      top: -10px;
      right: 18px;
      background: #e05a35;
      color: #fff;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 999px;
      letter-spacing: 0.5px;
    }
  }

  .voucher-banner-icon {
    font-size: 2.4rem;
    line-height: 1;
    flex-shrink: 0;
  }

  .voucher-banner-text {
    flex: 1;

    strong {
      display: block;
      color: #224274;
      font-size: 1.15rem;
      font-weight: 600;
      margin-bottom: 6px;
    }

    p {
      margin: 0;
      color: #4a4a4a;
      font-size: 0.95rem;
      line-height: 1.6;

      strong {
        display: inline;
        color: #e05a35;
        font-weight: 600;
        font-size: inherit;
        margin: 0;
      }
    }
  }

  .voucher-banner-cta {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    background: #e05a35;
    color: #fff;
    padding: 10px 20px;
    border-radius: 999px;
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
    transition: all 0.25s ease;
    box-shadow: 0 2px 8px rgba(224, 90, 53, 0.25);

    &:hover {
      background: #c64a28;
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(224, 90, 53, 0.35);
    }
  }

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    padding: 18px 18px;

    .voucher-banner-icon {
      font-size: 2rem;
    }

    .voucher-banner-text strong {
      font-size: 1.05rem;
    }

    .voucher-banner-text p {
      font-size: 0.9rem;
    }

    .voucher-banner-cta {
      width: 100%;
      justify-content: center;
      padding: 12px 20px;
    }

    &--prefilled::before {
      top: -8px;
      right: 14px;
      font-size: 0.68rem;
    }
  }
}

.line-btn-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.contact-form-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #06c755;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 300px;
  
  &:hover {
    background-color: #05a546;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(6, 199, 85, 0.3);
  }

  .line-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
}
</style>
