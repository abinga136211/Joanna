<script setup>
import { computed, ref } from 'vue'
import { apiFetch } from '@/api/client'
import { formatDateTime, previewText } from '@/utils/formatAdmin'
import { useAutoRefresh } from '@/composables/useAutoRefresh'

const items = ref([])
const searchInput = ref('')
const searchQuery = ref('')
const msg = ref('')
const ok = ref(true)
const saving = ref(false)
const modalOpen = ref(false)
const editingId = ref(null)
const form = ref(emptyForm())

function emptyForm() {
  return {
    question_zh: '',
    question_en: '',
    question_tw: '',
    answer_zh: '',
    answer_en: '',
    answer_tw: '',
    keywords: '',
  }
}

function applySearch() {
  searchQuery.value = searchInput.value.trim()
}

function onSearchKeydown(e) {
  if (e.key === 'Enter') {
    e.preventDefault()
    applySearch()
  }
}

const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return items.value
  return items.value.filter((row) => {
    const hay = [
      row.id,
      row.question_zh,
      row.question_en,
      row.question_tw,
      row.answer_zh,
      row.answer_en,
      row.answer_tw,
      row.keywords,
    ]
      .map((v) => String(v ?? '').toLowerCase())
      .join(' ')
    return hay.includes(q)
  })
})

async function load() {
  try {
    const data = await apiFetch('/api/admin/chat-qa')
    items.value = data.items || []
  } catch (err) {
    msg.value = err.message
    ok.value = false
  }
}

useAutoRefresh(load, {
  intervalMs: 2000,
  paused: computed(() => modalOpen.value || saving.value),
})

function openCreate() {
  editingId.value = null
  form.value = emptyForm()
  msg.value = ''
  modalOpen.value = true
}

function openEdit(row) {
  editingId.value = row.id
  form.value = {
    question_zh: row.question_zh || '',
    question_en: row.question_en || '',
    question_tw: row.question_tw || '',
    answer_zh: row.answer_zh || '',
    answer_en: row.answer_en || '',
    answer_tw: row.answer_tw || '',
    keywords: row.keywords || '',
  }
  msg.value = ''
  modalOpen.value = true
}

function closeModal() {
  if (saving.value) return
  modalOpen.value = false
  editingId.value = null
}

async function save() {
  saving.value = true
  msg.value = ''
  try {
    if (editingId.value == null) {
      await apiFetch('/api/admin/chat-qa', { method: 'POST', body: form.value })
    } else {
      await apiFetch(`/api/admin/chat-qa/${editingId.value}`, {
        method: 'PUT',
        body: form.value,
      })
    }
    modalOpen.value = false
    editingId.value = null
    ok.value = true
    msg.value = '已保存'
    await load()
  } catch (err) {
    msg.value = err.message || '保存失败'
    ok.value = false
  } finally {
    saving.value = false
  }
}

async function remove(row) {
  if (!confirm(`确认删除问答「${row.question_zh || row.id}」？此操作不可恢复。`)) return
  try {
    await apiFetch(`/api/admin/chat-qa/${row.id}`, { method: 'DELETE' })
    msg.value = '已删除'
    ok.value = true
    await load()
  } catch (err) {
    msg.value = err.message || '删除失败'
    ok.value = false
  }
}
</script>

<template>
  <div class="admin-card">
    <h1>客服问答</h1>
    <p class="admin-muted">
      管理自动客服知识库。访客提问会通过全文检索匹配下列问题、答案与关键词；聊天记录不会保存。
    </p>

    <div class="admin-toolbar">
      <button class="admin-btn admin-btn-primary" type="button" @click="openCreate">
        添加问答
      </button>
      <input
        v-model="searchInput"
        class="admin-toolbar-input"
        type="search"
        placeholder="搜索问题或答案…"
        aria-label="搜索问答"
        @keydown="onSearchKeydown"
      />
      <button class="admin-btn" type="button" @click="applySearch">搜索</button>
      <span class="admin-spacer" />
      <span class="admin-muted">共 {{ filteredItems.length }} 条</span>
      <button class="admin-btn" type="button" @click="load">刷新</button>
    </div>

    <p v-if="msg" class="admin-msg" :class="ok ? 'ok' : 'err'">{{ msg }}</p>

    <div class="admin-table-scroll">
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>问题（简）</th>
            <th>答案摘要</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in filteredItems" :key="row.id">
            <td class="admin-cell-nowrap">{{ row.id }}</td>
            <td>
              <strong>{{ row.question_zh || '—' }}</strong>
              <div class="admin-stack">
                <small>{{ row.question_en || '—' }}</small>
                <small>{{ row.question_tw || '—' }}</small>
              </div>
            </td>
            <td>
              <span class="admin-cell-ellipsis" :title="row.answer_zh">
                {{ previewText(row.answer_zh, 48) }}
              </span>
            </td>
            <td class="admin-cell-nowrap">{{ formatDateTime(row.updated_at) }}</td>
            <td>
              <div class="admin-actions">
                <button class="admin-btn" type="button" @click="openEdit(row)">编辑</button>
                <button class="admin-btn admin-btn-danger" type="button" @click="remove(row)">
                  删除
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!filteredItems.length">
            <td colspan="5" class="admin-muted">
              {{ items.length ? '没有匹配的问答' : '暂无问答，点击「添加问答」添加' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div
    v-if="modalOpen"
    class="admin-modal-backdrop"
    role="presentation"
    @click.self="closeModal"
  >
    <div class="admin-modal" role="dialog" aria-modal="true" aria-labelledby="chat-qa-modal-title">
      <div class="admin-modal-header">
        <h2 id="chat-qa-modal-title">
          {{ editingId == null ? '添加客服问答' : `编辑客服问答 #${editingId}` }}
        </h2>
        <button class="admin-modal-close" type="button" aria-label="关闭" @click="closeModal">
          ×
        </button>
      </div>
      <form class="admin-form" @submit.prevent="save">
        <fieldset class="admin-lang-group">
          <legend>简体中文</legend>
          <label>
            问题
            <input v-model="form.question_zh" required />
          </label>
          <label>
            答案
            <textarea v-model="form.answer_zh" rows="3" required />
          </label>
        </fieldset>
        <fieldset class="admin-lang-group">
          <legend>English</legend>
          <label>
            Question
            <input v-model="form.question_en" required />
          </label>
          <label>
            Answer
            <textarea v-model="form.answer_en" rows="3" required />
          </label>
        </fieldset>
        <fieldset class="admin-lang-group">
          <legend>繁體中文（可留空，将回落简体）</legend>
          <label>
            問題
            <input v-model="form.question_tw" />
          </label>
          <label>
            答案
            <textarea v-model="form.answer_tw" rows="3" />
          </label>
        </fieldset>
        <label>
          关键词（可选，空格或逗号分隔，用于提升命中）
          <input v-model="form.keywords" placeholder="开户 注册 onboard" />
        </label>
        <div class="admin-actions">
          <button class="admin-btn admin-btn-primary" type="submit" :disabled="saving">
            {{ saving ? '保存中…' : '保存' }}
          </button>
          <button class="admin-btn" type="button" :disabled="saving" @click="closeModal">
            取消
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
