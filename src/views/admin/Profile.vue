<template>
  <div class="admin-profile">
    <h1>{{ $t('admin.profile') }}</h1>
    
    <div class="profile-card">
      <div class="user-info">
        <div class="info-item">
          <label>{{ $t('admin.username') }}</label>
          <div class="value">{{ user.username }}</div>
        </div>
        <div class="info-item">
          <label>{{ $t('admin.name') }}</label>
          <div class="value">{{ user.name }}</div>
        </div>
        <div class="info-item">
          <label>{{ $t('admin.role') }}</label>
          <div class="value"><span :class="['role-badge', user.role]">{{ $t(`admin.${user.role}`) }}</span></div>
        </div>
      </div>

      <hr class="divider" />

      <h3>{{ $t('admin.changePassword') }}</h3>
      <form @submit.prevent="handleUpdatePassword" class="password-form">
        <div class="form-group">
          <label>{{ $t('admin.currentPassword') }}</label>
          <input v-model="passwords.current" type="password" required />
        </div>
        <div class="form-group">
          <label>{{ $t('admin.newPassword') }}</label>
          <input v-model="passwords.new" type="password" required />
        </div>
        <div class="form-group">
          <label>{{ $t('admin.confirmPassword') }}</label>
          <input v-model="passwords.confirm" type="password" required />
        </div>
        
        <div v-if="pwdError" class="error-msg">{{ pwdError }}</div>
        <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>

        <button type="submit" :disabled="submitting" class="btn-primary">
          {{ submitting ? 'Updating...' : $t('admin.save') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const user = ref(JSON.parse(localStorage.getItem('admin_user') || '{}'))
const passwords = ref({ current: '', new: '', confirm: '' })
const submitting = ref(false)
const pwdError = ref('')
const successMsg = ref('')

const handleUpdatePassword = async () => {
  pwdError.value = ''
  successMsg.value = ''
  
  if (passwords.value.new !== passwords.value.confirm) {
    pwdError.value = t('admin.passwordMismatch')
    return
  }

  submitting.value = true
  try {
    const token = localStorage.getItem('admin_token')
    const response = await fetch('/api/admin/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword: passwords.value.current,
        newPassword: passwords.value.new
      })
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Update failed')
    
    successMsg.value = t('admin.updateSuccess')
    passwords.value = { current: '', new: '', confirm: '' }
  } catch (err: any) {
    pwdError.value = err.message
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.admin-profile {
  h1 { margin-bottom: 2rem; }
}

.profile-card {
  background: white; padding: 2rem; border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  max-width: 600px;
}

.user-info {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;
  .info-item {
    label { display: block; font-size: 0.9rem; color: #888; margin-bottom: 0.25rem; }
    .value { font-weight: 600; font-size: 1.1rem; }
  }
}

.role-badge {
  padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; font-weight: 500;
  &.superuser { background: #fee2e2; color: #991b1b; }
  &.operator { background: #e0f2fe; color: #075985; }
}

.divider { margin: 2rem 0; border: 0; border-top: 1px solid #eee; }

.password-form {
  margin-top: 1rem;
  .form-group {
    margin-bottom: 1.25rem;
    label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
    input { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; }
  }
}

.btn-primary {
  background: #c46043; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; width: 100%; margin-top: 1rem;
  &:disabled { opacity: 0.7; }
}

.error-msg { color: #dc2626; margin-bottom: 1rem; font-size: 0.9rem; }
.success-msg { color: #16a34a; margin-bottom: 1rem; font-size: 0.9rem; }
</style>
