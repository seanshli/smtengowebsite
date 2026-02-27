<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>{{ $t('admin.submissions') }}</h1>
    </div>

    <div class="tabs-container">
      <button 
        v-for="tab in ['all', 'pending', 'processing', 'completed']" 
        :key="tab"
        :class="['tab-item', { active: activeTab === tab }]"
        @click="activeTab = tab"
      >
        {{ tab === 'all' ? 'All' : $t(`admin.${tab}`) }}
        <span class="count" v-if="getCount(tab) > 0">{{ getCount(tab) }}</span>
      </button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else class="submissions-table-container">
      <table class="submissions-table">
        <thead>
          <tr>
            <th>{{ $t('name') }}</th>
            <th>{{ $t('phone') }}</th>
            <th>{{ $t('city') }}</th>
            <th v-if="activeTab === 'all'">{{ $t('admin.status') }}</th>
            <th>Time</th>
            <th>{{ $t('admin.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="submission in filteredSubmissions" :key="submission.id">
            <td>{{ submission.name }}</td>
            <td>{{ submission.phone }}</td>
            <td>{{ submission.city }}</td>
            <td v-if="activeTab === 'all'">
              <span :class="['status-badge', submission.status || 'pending']">
                {{ $t(`admin.${submission.status || 'pending'}`) }}
              </span>
            </td>
            <td>{{ formatDate(submission.created_at) }}</td>
            <td>
              <button @click="viewDetails(submission)" class="btn-text">{{ $t('admin.edit') }}</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredSubmissions.length === 0" class="no-data">
        No submissions found in this category.
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="selectedSubmission" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>{{ $t('admin.edit') }}</h2>
        <div class="details-grid">
          <div class="detail-item"><strong>{{ $t('name') }}:</strong> {{ selectedSubmission.name }}</div>
          <div class="detail-item"><strong>{{ $t('phone') }}:</strong> {{ selectedSubmission.phone }}</div>
          <div class="detail-item"><strong>{{ $t('email') }}:</strong> {{ selectedSubmission.email }}</div>
          <div class="detail-item"><strong>{{ $t('city') }}:</strong> {{ selectedSubmission.city }}</div>
          <div class="detail-item"><strong>{{ $t('address') }}:</strong> {{ selectedSubmission.address }}</div>
          <div class="detail-item"><strong>{{ $t('plan') }}:</strong> {{ selectedSubmission.service_plan_id }}</div>
          <div class="detail-item"><strong>{{ $t('interest') }}:</strong> {{ selectedSubmission.product_type }}</div>
        </div>
        
        <div class="message-box">
          <strong>{{ $t('message') }}:</strong>
          <p>{{ selectedSubmission.message }}</p>
        </div>

        <hr />

        <div class="edit-form">
          <div class="form-group">
            <label>{{ $t('admin.status') }}</label>
            <select v-model="editData.status">
              <option value="pending">{{ $t('admin.pending') }}</option>
              <option value="processing">{{ $t('admin.processing') }}</option>
              <option value="completed">{{ $t('admin.completed') }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ $t('admin.notes') }}</label>
            <textarea v-model="editData.notes" rows="3"></textarea>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="closeModal" class="btn-secondary">{{ $t('admin.cancel') }}</button>
          <button @click="saveChanges" :disabled="saving" class="btn-primary">
            {{ saving ? 'Saving...' : $t('admin.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const submissions = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const selectedSubmission = ref<any>(null)
const editData = ref({ status: 'pending', notes: '' })
const saving = ref(false)
const activeTab = ref('all')

import { computed } from 'vue'

const filteredSubmissions = computed(() => {
  if (activeTab.value === 'all') return submissions.value
  return submissions.value.filter(s => (s.status || 'pending') === activeTab.value)
})

const getCount = (tab: string) => {
  if (tab === 'all') return submissions.value.length
  return submissions.value.filter(s => (s.status || 'pending') === tab).length
}

const fetchData = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('admin_token')
    const response = await fetch('/api/admin/submissions', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!response.ok) throw new Error('Failed to fetch')
    submissions.value = await response.json()
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString()
}

const viewDetails = (submission: any) => {
  selectedSubmission.value = submission
  editData.value = {
    status: submission.status || 'pending',
    notes: submission.notes || ''
  }
}

const closeModal = () => {
  selectedSubmission.value = null
}

const saveChanges = async () => {
  saving.value = true
  try {
    const token = localStorage.getItem('admin_token')
    const response = await fetch('/api/admin/submissions', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        id: selectedSubmission.value.id,
        ...editData.value
      })
    })

    if (!response.ok) throw new Error('Save failed')
    
    // Update local state
    const index = submissions.value.findIndex(s => s.id === selectedSubmission.value.id)
    if (index !== -1) {
      submissions.value[index] = { ...submissions.value[index], ...editData.value }
    }
    closeModal()
  } catch (err: any) {
    alert(err.message)
  } finally {
    saving.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.admin-dashboard {
  h1 { margin-bottom: 2rem; }
}

.tabs-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: #eee;
  padding: 0.25rem;
  border-radius: 8px;
  width: fit-content;
}

.tab-item {
  padding: 0.5rem 1.25rem;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &.active {
    background: white;
    color: #c46043;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }

  .count {
    background: #e5e7eb;
    color: #4b5563;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 0.75rem;
  }
}

.no-data {
  padding: 3rem;
  text-align: center;
  color: #888;
  font-style: italic;
}

.submissions-table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  overflow-x: auto;
}

.submissions-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th, td {
    padding: 1rem;
    border-bottom: 1px solid #eee;
  }

  th {
    background-color: #fcfcfc;
    font-weight: 600;
  }
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  
  &.pending { background: #fff3cd; color: #856404; }
  &.processing { background: #cce5ff; color: #004085; }
  &.completed { background: #d4edda; color: #155724; }
}

.btn-text {
  background: none;
  border: none;
  color: #c46043;
  cursor: pointer;
  font-weight: 500;
  &:hover { text-decoration: underline; }
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;

  h2 { margin-bottom: 1.5rem; }
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.message-box {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  p { margin-top: 0.5rem; white-space: pre-wrap; }
}

.edit-form {
  margin-top: 1.5rem;
  
  .form-group {
    margin-bottom: 1rem;
    label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
    select, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
    }
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary {
  background: #c46043;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  &:disabled { opacity: 0.7; }
}

.btn-secondary {
  background: #eee;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
}
</style>
