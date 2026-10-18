<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <img class="logo" src="/assets/logo-orange.svg" alt="enGo Logo" />
        <h2>{{ isWorker ? $t('loginPage.workerLogin') : $t('loginPage.userLogin') }}</h2>
        <p class="subtitle">{{ $t('loginPage.welcome') }}</p>
        
        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <input type="text" :placeholder="$t('loginPage.username')" v-model="form.username" required />
          </div>
          <div class="input-group">
            <input type="password" :placeholder="$t('loginPage.password')" v-model="form.password" required />
          </div>
          <button type="submit" class="login-btn">{{ $t('loginPage.submit') }}</button>
        </form>
        
        <div class="switch-mode">
          <button @click="isWorker = !isWorker">
            {{ $t('loginPage.switchTo') }} {{ isWorker ? $t('loginPage.userLogin') : $t('loginPage.workerLogin') }}
          </button>
        </div>
        
        <div class="back-home">
          <router-link to="/">{{ $t('loginPage.backHome') }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAnalytics } from '@/utils/analytics'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const isWorker = ref(false)
const form = ref({ username: '', password: '' })
const { trackEvent } = useAnalytics()
const { t } = useI18n()
const router = useRouter()

const handleLogin = async () => {
  trackEvent('login_attempt', { role: isWorker.value ? 'worker' : 'user' })
  
  if (isWorker.value) {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.value.username,
          password: form.value.password
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || t('admin.loginError'))
      }

      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_user', JSON.stringify(data.user))
      router.push({ name: 'admin-dashboard' })
    } catch (err: any) {
      alert(err.message)
    }
  } else {
    alert(t('loginPage.upcoming'))
  }
}
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

.login-page {
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $parchment;
  font-family: $display-font;
  color: $ink;

  .login-container {
    width: 100%;
    max-width: 400px;
    padding: 0;
  }

  .login-card {
    background: #fff;
    padding: 40px;
    border: 1px solid $hairline;
    border-radius: 18px;
    text-align: center;

    @media (max-width: 480px) {
      padding: 30px 20px;
    }

    .logo { width: 120px; margin-bottom: 20px; }
    h2 { color: $ink; margin-bottom: 10px; font-size: 1.5rem; font-weight: 600; letter-spacing: -0.02em; }
    .subtitle { color: $ink-80; margin-bottom: 30px; font-size: 0.9rem; }

    .input-group {
      margin-bottom: 15px;
      input {
        width: 100%;
        height: 44px;
        padding: 0 15px;
        box-sizing: border-box;
        background: #fff;
        color: $ink;
        border: 1px solid $hairline;
        border-radius: 8px;
        font-size: 1.0625rem;
        letter-spacing: -0.022em;
        &:focus-visible { outline: 2px solid $brand-orange-text; outline-offset: 2px; }
      }
    }

    .login-btn {
      width: 100%;
      min-height: 44px;
      padding: 11px 22px;
      background: $brand-orange-text;
      color: #fff;
      border: none;
      border-radius: 9999px;
      font-size: 1.0625rem;
      font-weight: 400;
      cursor: pointer;
      transition: transform 0.15s ease, background 0.2s ease;
      margin-top: 10px;
      &:hover { background: darken($brand-orange-text, 6%); }
      &:active { transform: scale(0.95); }
      &:focus-visible { outline: 2px solid $brand-orange-text; outline-offset: 2px; }
    }

    .switch-mode {
      margin-top: 20px;
      button {
        background: transparent;
        border: none;
        color: $brand-orange-text;
        cursor: pointer;
        font-size: 0.9rem;
        text-decoration: underline;
        &:focus-visible { outline: 2px solid $brand-orange-text; outline-offset: 2px; }
      }
    }

    .back-home {
      margin-top: 30px;
      a { color: $ink-80; text-decoration: none; font-size: 0.9rem; &:hover { color: $ink; } }
    }
  }
}
</style>
