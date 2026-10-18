<template>
  <div class="contact ap-page">
    <!-- tile 1, white: title, subtitle, phone lines -->
    <div class="ap-tile ap-tile-first ap-white contact-head">
      <div class="ap-wrap ap-wrap-text">
        <div class="contact_title">
          <h1 class="ap-title">{{ $t('contactUsTitle') }}</h1>
          <p class="ap-lead web">{{ $t('contactUsSubtitle') }}</p>
          <div class="phone container">
            <div class="phone">{{ $t('contactUsSubtitle1') }}</div>
            <div class="phone">{{ $t('contactUsSubtitle2') }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- tile 2, parchment: the form (fields, ids and handlers unchanged) -->
    <div class="ap-tile ap-parchment contact-form-tile">
      <div class="ap-wrap ap-wrap-text">
        <div class="contact_wrap">
      <div class="contact_inputs flex_vertical">
        <div class="input_label">
          <label for="cf-name">{{ $t('name') }} <span class="cf-req">({{ $t('required') }})</span></label>
          <input id="cf-name" type="text" name="name" autocomplete="name" v-model="name" />
        </div>
        <div class="input_label">
          <label for="cf-phone">{{ $t('phone') }} <span class="cf-req">({{ $t('required') }})</span></label>
          <input id="cf-phone" type="tel" name="phone" autocomplete="tel" inputmode="tel" v-model="phone" />
        </div>
        <div class="input_label">
          <label for="cf-email">{{ $t('email') }}</label>
          <input id="cf-email" type="email" name="email" autocomplete="email" inputmode="email" v-model="email" />
        </div>
        <div class="input_wrap">
          <div class="input_label--short">
            <label for="cf-city">{{ $t('city') }} <span class="cf-req">({{ $t('required') }})</span></label>
            <select id="cf-city" class="custom_select" :class="{ 'is-empty': !city }" name="city" required v-model="city">
              <option value="" selected disabled hidden>
                {{ $t('city') }}
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
            <label for="cf-address">{{ $t('address') }}</label>
            <input id="cf-address" type="text" name="address" autocomplete="street-address" v-model="address" />
          </div>
        </div>
        <div class="input_label">
          <!-- 我想了解的是 -->
          <label for="cf-interest">{{ $t('interest') }} <span class="cf-req">({{ $t('required') }})</span></label>
          <select id="cf-interest" class="custom_select" :class="{ 'is-empty': !interest }" name="interest" v-model="interest">
            <option value="" selected disabled hidden>
              {{ $t('interest') }}
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
            <label for="cf-messagetype">{{ $t('messagetypePlaceholder') }} <span class="cf-req">({{ $t('required') }})</span></label>
            <select id="cf-messagetype" class="custom_select" :class="{ 'is-empty': !messagetype }" name="messagetype" v-model="messagetype">
              <option value="" selected disabled hidden>
                {{ `${$t('messagetypePlaceholder')}(${$t('required')})` }}
              </option>
              <option value="engosystem">{{ $t('msgType1') }}</option>
              <option value="waterfilter">{{ $t('msgType2') }}</option>
            </select>
          </div>
          <div class="input_label">
            <!-- 選擇方案 -->
            <label for="cf-plan">{{ $t('planPlaceholder') }} <span class="cf-req">({{ $t('required') }})</span></label>
            <select id="cf-plan" class="custom_select" :class="{ 'is-empty': !plan }" name="plan" v-model="plan">
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
          <label for="cf-message">{{ $t('message') }}</label>
          <textarea
            id="cf-message"
            name="message"
            :placeholder="$t('messagePlaceholder')"
            v-model="message"
          ></textarea>
        </div>
      <div class="line-btn-container mt-4">
        <button class="contact-form-line ap-pill ap-pill-ghost" @click="jumpToLine">
          <img src="/images/link_Line.png" alt="LINE" class="line-icon" />
          {{ $t('contactOnLine') }}
        </button>
      </div>

      <div id="form-error-message" class="mt-12">{{ errorMessage }}</div>
      <button class="contact-form-submit ap-pill ap-pill-primary" @click="submitForm">{{ $t('submitForm') }}</button>
      </div>
        </div>
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

    const { locale, tm, t } = useI18n()
    const { trackEvent } = useAnalytics()

    const planOptions = computed(() => {
      return tm('planItems') as any[]
    })

    const route = useRoute()
    const router = useRouter()

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
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/css/utils/_variables.scss';
@import '@/css/pages/_contact.scss';
</style>
