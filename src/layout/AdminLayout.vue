<template>
  <div class="admin-layout">
    <header class="admin-header">
      <div class="header-left">
        <router-link to="/">
          <img class="logo-engo" src="/assets/logo.svg" alt="enGo Logo" />
        </router-link>
        <span class="admin-title">{{ $t('admin.dashboard') }}</span>
      </div>
      <nav class="admin-nav">
        <router-link :to="{ name: 'admin-dashboard' }" class="nav-item">
          {{ $t('admin.submissions') }}
        </router-link>
        <router-link v-if="user.role === 'superuser'" :to="{ name: 'admin-members' }" class="nav-item">
          {{ $t('admin.members') }}
        </router-link>
        <router-link :to="{ name: 'admin-profile' }" class="nav-item">
          {{ $t('admin.profile') }}
        </router-link>
      </nav>
      <div class="header-right">
        <span class="user-name">{{ user.name || user.username }} ({{ $t(`admin.${user.role}`) }})</span>
        <button @click="handleLogout" class="logout-btn">{{ $t('admin.logout') }}</button>
      </div>
    </header>
    <main class="admin-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('admin_user') || '{}'))

const handleLogout = () => {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  router.push({ name: 'login' })
}
</script>

<style scoped lang="scss">
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.admin-header {
  background-color: #fff;
  border-bottom: 1px solid #dee2e6;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;

  .header-left {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    .logo-engo { height: 32px; }
    .admin-title { font-size: 1.25rem; font-weight: 600; color: #343a40; }
  }

  .admin-nav {
    display: flex;
    gap: 1.5rem;
    .nav-item {
      text-decoration: none;
      color: #666;
      font-weight: 500;
      padding: 0.5rem 0;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
      &.router-link-active { color: #c46043; border-bottom-color: #c46043; }
      &:hover { color: #c46043; }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    .user-name { font-weight: 500; font-size: 0.9rem; color: #666; }
  }
}

.admin-main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.logout-btn {
  background: transparent;
  border: 1px solid #c46043;
  color: #c46043;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #c46043;
    color: #fff;
  }
}
</style>
