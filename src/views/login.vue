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

const handleLogin = () => {
  trackEvent('login_attempt', { role: isWorker.value ? 'worker' : 'user' })
  
  if (isWorker.value && form.value.username === 'admin' && form.value.password === 'admin123') {
    localStorage.setItem('admin_token', 'admin-secret-token') // Matches API default
    router.push({ name: 'admin-dashboard' })
  } else {
    alert(t('loginPage.upcoming'))
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  
  .login-container {
    width: 100%;
    max-width: 400px;
    padding: 0;
  }
  
  .login-card {
    background: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
    text-align: center;
    
    @media (max-width: 480px) {
      padding: 30px 20px;
    }
    
    .logo { width: 120px; margin-bottom: 20px; }
    h2 { color: #333; margin-bottom: 10px; font-size: 1.5rem; }
    .subtitle { color: #888; margin-bottom: 30px; font-size: 0.9rem; }
    
    .input-group {
      margin-bottom: 15px;
      input {
        width: 100%;
        padding: 12px 15px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s;
        &:focus { border-color: #c46043; outline: none; }
      }
    }
    
    .login-btn {
      width: 100%;
      padding: 12px;
      background: #c46043;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
      margin-top: 10px;
      &:hover { background: #ab5138; }
    }
    
    .switch-mode {
      margin-top: 20px;
      button {
        background: transparent;
        border: none;
        color: #c46043;
        cursor: pointer;
        font-size: 0.9rem;
        text-decoration: underline;
      }
    }
    
    .back-home {
      margin-top: 30px;
      a { color: #888; text-decoration: none; font-size: 0.9rem; &:hover { color: #333; } }
    }
  }
}
</style>
