<template>
  <div class="admin-members">
    <div class="dashboard-header">
      <h1>{{ $t('admin.members') }}</h1>
      <button @click="showAddModal = true" class="btn-primary">{{ $t('admin.addMember') }}</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else class="members-table-container">
      <table class="members-table">
        <thead>
          <tr>
            <th>{{ $t('admin.username') }}</th>
            <th>{{ $t('admin.name') }}</th>
            <th>{{ $t('admin.role') }}</th>
            <th>Created At</th>
            <th>{{ $t('admin.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in members" :key="member.id">
            <td>{{ member.username }}</td>
            <td>{{ member.name }}</td>
            <td>
              <span :class="['role-badge', member.role]">
                {{ $t(`admin.${member.role}`) }}
              </span>
            </td>
            <td>{{ formatDate(member.created_at) }}</td>
            <td>
              <button @click="confirmDelete(member)" class="btn-text delete">{{ $t('admin.delete') }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Member Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content">
        <h2>{{ $t('admin.addMember') }}</h2>
        <form @submit.prevent="handleAddMember" class="edit-form">
          <div class="form-group">
            <label>{{ $t('admin.username') }}</label>
            <input v-model="newMember.username" type="text" required />
          </div>
          <div class="form-group">
            <label>{{ $t('admin.password') }}</label>
            <input v-model="newMember.password" type="password" required />
          </div>
          <div class="form-group">
            <label>{{ $t('admin.name') }}</label>
            <input v-model="newMember.name" type="text" />
          </div>
          <div class="form-group">
            <label>{{ $t('admin.role') }}</label>
            <select v-model="newMember.role" required>
              <option value="operator">{{ $t('admin.operator') }}</option>
              <option value="superuser">{{ $t('admin.superuser') }}</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="showAddModal = false" class="btn-secondary">{{ $t('admin.cancel') }}</button>
            <button type="submit" :disabled="submitting" class="btn-primary">
              {{ submitting ? 'Adding...' : $t('admin.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const members = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const showAddModal = ref(false)
const submitting = ref(false)
const newMember = ref({ username: '', password: '', name: '', role: 'operator' })

const fetchMembers = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('admin_token')
    const response = await fetch('/api/admin/members', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch members')
    members.value = await response.json()
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleAddMember = async () => {
  submitting.value = true
  try {
    const token = localStorage.getItem('admin_token')
    const response = await fetch('/api/admin/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newMember.value)
    })
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to add member')
    }
    await fetchMembers()
    showAddModal.value = false
    newMember.value = { username: '', password: '', name: '', role: 'operator' }
  } catch (err: any) {
    alert(err.message)
  } finally {
    submitting.value = false
  }
}

const confirmDelete = async (member: any) => {
  if (!confirm(t('admin.confirmDelete'))) return
  
  try {
    const token = localStorage.getItem('admin_token')
    const response = await fetch(`/api/admin/members?id=${member.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to delete member')
    await fetchMembers()
  } catch (err: any) {
    alert(err.message)
  }
}

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString()

onMounted(fetchMembers)
</script>

<style scoped lang="scss">
.admin-members {
  h1 { margin: 0; }
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.members-table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  overflow-x: auto;
}

.members-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  th, td { padding: 1rem; border-bottom: 1px solid #eee; }
  th { background-color: #fcfcfc; font-weight: 600; }
}

.role-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  &.superuser { background: #fee2e2; color: #991b1b; }
  &.operator { background: #e0f2fe; color: #075985; }
}

.btn-text {
  background: none; border: none; font-weight: 500; cursor: pointer;
  &:hover { text-decoration: underline; }
  &.delete { color: #dc2626; }
}

.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;
}

.modal-content {
  background: white; padding: 2rem; border-radius: 12px; width: 100%; max-width: 450px;
  h2 { margin-bottom: 1.5rem; }
}

.edit-form {
  .form-group {
    margin-bottom: 1rem;
    label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
    input, select { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; }
  }
}

.modal-actions {
  display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;
}

.btn-primary {
  background: #c46043; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer;
  &:disabled { opacity: 0.7; }
}

.btn-secondary {
  background: #eee; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer;
}
</style>
