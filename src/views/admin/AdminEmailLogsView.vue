<script setup>
import { computed, ref, watch } from 'vue'
import { apiFetch } from '@/api/client'
import { formatDateTime, previewText } from '@/utils/formatAdmin'
import { useAutoRefresh } from '@/composables/useAutoRefresh'

const items = ref([])
const searchInput = ref('')
const searchQuery = ref('')
const statusFilter = ref('all')
const msg = ref('')

const statusLabel = {
  sent: '已发送',
  failed: '失败',
  skipped: '已跳过',
}

const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return items.value
  return items.value.filter((row) => {
    const hay = [row.id, row.inquiry_id, row.from_email, row.to_email, row.subject, row.error_message, row.status]
      .map((v) => String(v ?? '').toLowerCase())
      .join(' ')
    return hay.includes(q)
  })
})

async function load() {
  try {
    const params = new URLSearchParams()
    if (statusFilter.value !== 'all') params.set('status', statusFilter.value)
    const q = params.toString() ? `?${params}` : ''
    const data = await apiFetch(`/api/admin/email-logs${q}`)
    items.value = data.items || []
    msg.value = ''
  } catch (err) {
    msg.value = err.message
  }
}

watch(statusFilter, () => {
  load()
})

useAutoRefresh(load, { intervalMs: 2000 })

function applySearch() {
  searchQuery.value = searchInput.value.trim()
}

function onSearchKeydown(e) {
  if (e.key === 'Enter') {
    e.preventDefault()
    applySearch()
  }
}
</script>

<template>
  <div class="admin-card">
    <h1>邮件记录</h1>
    <div class="admin-toolbar">
      <input
        v-model="searchInput"
        class="admin-toolbar-input"
        type="search"
        placeholder="搜索咨询编号、收件人、主题…"
        aria-label="搜索邮件记录"
        @keydown="onSearchKeydown"
      />
      <button class="admin-btn" type="button" @click="applySearch">搜索</button>
      <select v-model="statusFilter" class="admin-toolbar-select" aria-label="筛选发送状态">
        <option value="all">全部</option>
        <option value="sent">已发送</option>
        <option value="failed">失败</option>
        <option value="skipped">已跳过</option>
      </select>
      <span class="admin-spacer" />
      <span class="admin-muted">共 {{ filteredItems.length }} 条</span>
      <button class="admin-btn" type="button" @click="load">刷新</button>
    </div>
    <p v-if="msg" class="admin-msg err">{{ msg }}</p>
    <div class="admin-table-scroll">
      <table class="admin-table">
        <thead>
          <tr>
            <th>时间</th>
            <th>咨询 ID</th>
            <th>收件人</th>
            <th>主题</th>
            <th>状态</th>
            <th>错误信息</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in filteredItems" :key="row.id">
            <td class="admin-cell-nowrap">{{ formatDateTime(row.created_at) }}</td>
            <td class="admin-cell-nowrap">{{ row.inquiry_id ?? '—' }}</td>
            <td>{{ row.to_email || '—' }}</td>
            <td>
              <div class="admin-cell-clamp" :title="row.subject">{{ previewText(row.subject, 48) }}</div>
            </td>
            <td>
              <span class="admin-badge" :class="row.status">{{ statusLabel[row.status] || row.status }}</span>
            </td>
            <td>
              <div class="admin-cell-clamp" :title="row.error_message || ''">
                {{ row.error_message ? previewText(row.error_message, 80) : '—' }}
              </div>
            </td>
          </tr>
          <tr v-if="!filteredItems.length">
            <td colspan="6" class="admin-muted">
              {{ items.length ? '没有匹配的记录' : '暂无记录' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
