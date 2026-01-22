<template>
  <div class="contact">
    <div class="contact_wrap">
      <div class="contact_title">
        <h3 class="fz-48 lh-70 fw-500">{{ $t('contactUsTitle') }}</h3>
        <p class="fz-24 lh-34 web">{{ $t('contactUsSubtitle') }}</p>
        <div class="phone container">
          <div class="phone">{{ $t('contactUsSubtitle1') }}</div>
          <div class="phone">{{ $t('contactUsSubtitle2') }}</div>
        </div>
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
        <div id="form-error-message" class="mt-12">{{ errorMessage }}</div>
        <button class="contact-form-submit" @click="submitForm">{{ $t('submitForm') }}</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { config } from '../configs/systemConfig'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { geti18n } from '../main'

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
    const planOptions = ref<any>([])
    const message = ref('')
    const errorMessage = ref('')

    const { locale } = useI18n()
    const i18nObj = geti18n() as any

    const router = useRouter()

    const handleError = () => {
      errorMessage.value = 'Something went wrong. Please try again later.'
    }

    const validateRequired = () => {
      const i18n = i18nObj[locale.value]
      if (name.value === '') {
        errorMessage.value = `${i18n.enterEmpty}"${i18n.name}"`
        return false
      }
      if (phone.value === '') {
        errorMessage.value = `${i18n.enterEmpty}"${i18n.phone}"`
        return false
      }
      if (email.value === '') {
        errorMessage.value = `${i18n.enterEmpty}"${i18n.email}"`
        return false
      }
      if (city.value === '') {
        errorMessage.value = `${i18n.enterEmpty}"${i18n.city}"`
        return false
      }
      if (interest.value === '') {
        errorMessage.value = `${i18n.enterEmpty}"${i18n.interest}"`
        return false
      }

      if (interest.value === 'product') {
        if (messagetype.value === '') {
          errorMessage.value = `${i18n.enterEmpty}"${i18n.messagetype}"`
          return false
        }
        if (plan.value === '') {
          errorMessage.value = `${i18n.enterEmpty}"${i18n.plan}"`
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
        const i18n = i18nObj[locale.value]
        errorMessage.value = i18n.enterValidMail
        return false
      }

      return true
    }

    const validatePhone = () => {
      const isMobile = phone.value.match(/^09[0-9]{8}$/)
      if (!isMobile) {
        const i18n = i18nObj[locale.value]
        errorMessage.value = i18n.enterValidPhone
        return false
      }

      return true
    }

    const submitForm = async () => {
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
        const response = await fetch(`${config.hostname}/contact-us`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        if (response.status !== 200) {
          handleError()
          return
        }

        router.push({ name: 'success' })
      } catch (error) {
        console.log(error)
        handleError()
      }
    }

    const getPlanOptions = async () => {
      try {
        const response: any = await fetch(`${config.hostname}/service/WATER_SERVICE`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })

        if (response.status !== 200) {
          handleError()
          return
        }

        planOptions.value = response.model.content
      } catch (error) {
        console.log(error)
        handleError()
      }
    }

    // getPlanOptions()

    // 測試專區
    const res = {
      timestamp: 1723708238670,
      code: 0,
      status: 200,
      message: null,
      model: {
        content: [
          {
            id: 1,
            name: '買斷： 濾水器',
            num: 'AFASF001',
            type: 'WATER_SERVICE',
            cycle: 3
          },
          {
            id: 2,
            name: '買斷： 空氣機',
            num: 'AFASF002',
            type: 'WATER_SERVICE',
            cycle: 3
          },
          {
            id: 3,
            name: '買斷： 濾水器 濾芯',
            num: 'AFASF003',
            type: 'WATER_SERVICE',
            cycle: 3

          },
          {
            id: 4,
            name: '買斷： 空氣機 濾芯',
            num: 'AFASF004',
            type: 'WATER_SERVICE',
            cycle: 3

          },
          {
            id: 5,
            name: '買斷： enGo 管理中控+濾水器＋空氣機',
            num: 'AFASF005',
            type: 'WATER_SERVICE',
            cycle: 3

          } ,
          {
            id: 6,
            name: '租賃： enGo 管理中控+濾水器 (12個月）',
            num: 'AFASF006',
            type: 'WATER_SERVICE',
            cycle: 3

          } ,
          {
            id: 7,
            name: '租賃： enGo 管理中控+濾水器＋空氣機 (12個月）',
            num: 'AFASF007',
            type: 'WATER_SERVICE',
            cycle: 3

          }
        ],
        totalCount: 1
      }
    }
    planOptions.value = res.model.content

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
      planOptions
    }
  }
})
</script>
