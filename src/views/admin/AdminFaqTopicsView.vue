<script setup>
import { computed, ref, watch } from 'vue'
import { apiFetch } from '@/api/client'
import { formatDateTime, previewText } from '@/utils/formatAdmin'
import { useAutoRefresh } from '@/composables/useAutoRefresh'

const items = ref([])
const searchInput = ref('')
const searchQuery = ref('')
const statusFilter = ref('active')
const msg = ref('')
const ok = ref(true)
const saving = ref(false)
const modalOpen = ref(false)
const editingId = ref(null)
const form = ref(emptyTopicForm())

const articlesTopic = ref(null)
const articles = ref([])
const articleStatusFilter = ref('active')
const articleModalOpen = ref(false)
const editingArticleId = ref(null)
const articleForm = ref(emptyArticleForm())
const articleMsg = ref('')
const articleOk = ref(true)
const articleSaving = ref(false)
const formLang = ref('zh')
const articleFormLang = ref('zh')

const LANG_TABS = [
  { key: 'zh', label: '简体' },
  { key: 'en', label: 'English' },
  { key: 'tw', label: '繁體' },
]

function emptyTopicForm() {
  return {
    slug: '',
    title_zh: '',
    title_en: '',
    title_tw: '',
    description_zh: '',
    description_en: '',
    description_tw: '',
    sort_order: 0,
  }
}

function emptyArticleForm() {
  return {
    title_zh: '',
    title_en: '',
    title_tw: '',
    body_zh: '',
    body_en: '',
    body_tw: '',
    sort_order: 0,
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
  let list = items.value
  if (statusFilter.value === 'active') {
    list = list.filter((r) => !r.is_deleted)
  } else if (statusFilter.value === 'deleted') {
    list = list.filter((r) => r.is_deleted)
  }
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return list
  return list.filter((row) => {
    const hay = [
      row.id,
      row.slug,
      row.title_zh,
      row.title_en,
      row.title_tw,
      row.description_zh,
      row.description_en,
      row.description_tw,
      row.sort_order,
    ]
      .map((v) => String(v ?? '').toLowerCase())
      .join(' ')
    return hay.includes(q)
  })
})

const filteredArticles = computed(() => {
  let list = articles.value
  if (articleStatusFilter.value === 'active') {
    list = list.filter((r) => !r.is_deleted)
  } else if (articleStatusFilter.value === 'deleted') {
    list = list.filter((r) => r.is_deleted)
  }
  return list
})

const panelBusy = computed(
  () =>
    modalOpen.value ||
    saving.value ||
    articleModalOpen.value ||
    articleSaving.value ||
    !!articlesTopic.value,
)

async function load() {
  try {
    const includeDeleted = statusFilter.value !== 'active'
    const q = includeDeleted ? '?include_deleted=1' : ''
    const data = await apiFetch(`/api/admin/faq-topics${q}`)
    items.value = data.items || []
  } catch (err) {
    msg.value = err.message
    ok.value = false
  }
}

watch(statusFilter, () => {
  load()
})

useAutoRefresh(load, {
  intervalMs: 2000,
  paused: panelBusy,
})

function openCreate() {
  editingId.value = null
  formLang.value = 'zh'
  const nextOrder =
    items.value.reduce((max, row) => Math.max(max, Number(row.sort_order) || 0), 0) + 1
  form.value = { ...emptyTopicForm(), sort_order: nextOrder }
  msg.value = ''
  modalOpen.value = true
}

function openEdit(row) {
  editingId.value = row.id
  formLang.value = 'zh'
  form.value = {
    slug: row.slug || '',
    title_zh: row.title_zh || '',
    title_en: row.title_en || '',
    title_tw: row.title_tw || '',
    description_zh: row.description_zh || '',
    description_en: row.description_en || '',
    description_tw: row.description_tw || '',
    sort_order: Number(row.sort_order) || 0,
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
    const body = {
      ...form.value,
      sort_order: Number(form.value.sort_order) || 0,
    }
    if (editingId.value == null) {
      await apiFetch('/api/admin/faq-topics', { method: 'POST', body })
    } else {
      await apiFetch(`/api/admin/faq-topics/${editingId.value}`, {
        method: 'PUT',
        body,
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
  if (
    !confirm(
      `确认删除子分类「${row.title_zh || row.slug}」？\n将一次性删除简体 / 繁体 / 英文全部内容，及其下全部文案；导航与页脚同步移除。`,
    )
  ) {
    return
  }
  try {
    await apiFetch(`/api/admin/faq-topics/${row.id}`, { method: 'DELETE' })
    msg.value = '已删除'
    ok.value = true
    if (articlesTopic.value?.id === row.id) closeArticles()
    await load()
  } catch (err) {
    msg.value = err.message || '删除失败'
    ok.value = false
  }
}

async function openArticles(row) {
  articlesTopic.value = row
  articleMsg.value = ''
  articleStatusFilter.value = 'active'
  await loadArticles()
}

function closeArticles() {
  if (articleSaving.value || articleModalOpen.value) return
  articlesTopic.value = null
  articles.value = []
  articleMsg.value = ''
}

async function loadArticles() {
  if (!articlesTopic.value) return
  try {
    const includeDeleted = articleStatusFilter.value !== 'active'
    const q = includeDeleted ? '?include_deleted=1' : ''
    const data = await apiFetch(
      `/api/admin/faq-topics/${articlesTopic.value.id}/articles${q}`,
    )
    articles.value = data.items || []
    if (data.topic) articlesTopic.value = data.topic
  } catch (err) {
    articleMsg.value = err.message || '加载文案失败'
    articleOk.value = false
  }
}

watch(articleStatusFilter, () => {
  if (articlesTopic.value) loadArticles()
})

function openCreateArticle() {
  editingArticleId.value = null
  articleFormLang.value = 'zh'
  const nextOrder =
    articles.value.reduce((max, row) => Math.max(max, Number(row.sort_order) || 0), 0) + 1
  articleForm.value = { ...emptyArticleForm(), sort_order: nextOrder }
  articleMsg.value = ''
  articleModalOpen.value = true
}

function openEditArticle(row) {
  editingArticleId.value = row.id
  articleFormLang.value = 'zh'
  articleForm.value = {
    title_zh: row.title_zh || '',
    title_en: row.title_en || '',
    title_tw: row.title_tw || '',
    body_zh: row.body_zh || '',
    body_en: row.body_en || '',
    body_tw: row.body_tw || '',
    sort_order: Number(row.sort_order) || 0,
  }
  articleMsg.value = ''
  articleModalOpen.value = true
}

function closeArticleModal() {
  if (articleSaving.value) return
  articleModalOpen.value = false
  editingArticleId.value = null
}

async function saveArticle() {
  if (!articlesTopic.value) return
  articleSaving.value = true
  articleMsg.value = ''
  try {
    const body = {
      ...articleForm.value,
      sort_order: Number(articleForm.value.sort_order) || 0,
    }
    if (editingArticleId.value == null) {
      await apiFetch(`/api/admin/faq-topics/${articlesTopic.value.id}/articles`, {
        method: 'POST',
        body,
      })
    } else {
      await apiFetch(`/api/admin/faq-articles/${editingArticleId.value}`, {
        method: 'PUT',
        body,
      })
    }
    articleModalOpen.value = false
    editingArticleId.value = null
    articleOk.value = true
    articleMsg.value = '文案已保存'
    await loadArticles()
    await load()
  } catch (err) {
    articleMsg.value = err.message || '保存失败'
    articleOk.value = false
  } finally {
    articleSaving.value = false
  }
}

async function removeArticle(row) {
  if (
    !confirm(
      `确认删除文案「${row.title_zh || row.id}」？\n将一次性删除简体 / 繁体 / 英文全部标题与内容。`,
    )
  ) {
    return
  }
  try {
    await apiFetch(`/api/admin/faq-articles/${row.id}`, { method: 'DELETE' })
    articleMsg.value = '文案已删除'
    articleOk.value = true
    await loadArticles()
    await load()
  } catch (err) {
    articleMsg.value = err.message || '删除失败'
    articleOk.value = false
  }
}
</script>

<template>
  <div class="admin-card">
    <h1>帮助中心 · 子分类</h1>
    <p class="admin-muted">
      管理导航「帮助中心」子菜单与其下文章。新增时简体与英文必填，繁体留空用简体；编辑时可只改某一语言。删除会一次移除三种语言。保存后前台约
      3 秒内同步。
    </p>

    <div class="admin-toolbar">
      <button class="admin-btn admin-btn-primary" type="button" @click="openCreate">
        新增子分类
      </button>
      <input
        v-model="searchInput"
        class="admin-toolbar-input"
        type="search"
        placeholder="搜索标题、锚点…"
        aria-label="搜索子分类"
        @keydown="onSearchKeydown"
      />
      <button class="admin-btn" type="button" @click="applySearch">搜索</button>
      <select v-model="statusFilter" class="admin-toolbar-select" aria-label="筛选状态">
        <option value="active">仅正常</option>
        <option value="deleted">仅已删除</option>
        <option value="all">全部</option>
      </select>
      <span class="admin-spacer" />
      <span class="admin-muted">共 {{ filteredItems.length }} 条</span>
      <button class="admin-btn" type="button" @click="load">刷新</button>
    </div>

    <p v-if="msg" class="admin-msg" :class="ok ? 'ok' : 'err'">{{ msg }}</p>

    <div class="admin-table-scroll">
      <table class="admin-table">
        <thead>
          <tr>
            <th>排序</th>
            <th>标题（简）</th>
            <th>锚点</th>
            <th>文案数</th>
            <th>简介摘要</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in filteredItems"
            :key="row.id"
            :class="{ 'is-deleted-row': row.is_deleted }"
          >
            <td class="admin-cell-nowrap">{{ row.sort_order }}</td>
            <td>
              <strong>{{ row.title_zh || '—' }}</strong>
              <div class="admin-stack">
                <small>{{ row.title_en || '—' }}</small>
                <small>{{ row.title_tw || '—' }}</small>
              </div>
            </td>
            <td class="admin-cell-nowrap">
              <code>#{{ row.slug }}</code>
            </td>
            <td class="admin-cell-nowrap">{{ row.article_count ?? 0 }}</td>
            <td>
              <span class="admin-cell-ellipsis" :title="row.description_zh">
                {{ previewText(row.description_zh, 40) }}
              </span>
            </td>
            <td class="admin-cell-nowrap">{{ formatDateTime(row.updated_at) }}</td>
            <td>
              <div v-if="!row.is_deleted" class="admin-actions">
                <button class="admin-btn" type="button" @click="openArticles(row)">文案</button>
                <button class="admin-btn" type="button" @click="openEdit(row)">编辑</button>
                <button class="admin-btn admin-btn-danger" type="button" @click="remove(row)">
                  删除
                </button>
              </div>
              <span v-else class="admin-muted">已删除</span>
            </td>
          </tr>
          <tr v-if="!filteredItems.length">
            <td colspan="7" class="admin-muted">
              {{
                items.length
                  ? '没有匹配的子分类'
                  : '暂无子分类，点击「新增子分类」添加'
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="articlesTopic" class="admin-card">
    <div class="admin-toolbar">
      <h2 style="margin: 0; font-size: 1.1rem">
        文案 · {{ articlesTopic.title_zh }}
        <small class="admin-muted">#{{ articlesTopic.slug }}</small>
      </h2>
      <span class="admin-spacer" />
      <button class="admin-btn" type="button" @click="closeArticles">返回子分类</button>
    </div>
    <p class="admin-muted">每条文案需填写简体/英文标题与内容；繁体可留空，将使用简体。</p>

    <div class="admin-toolbar">
      <button class="admin-btn admin-btn-primary" type="button" @click="openCreateArticle">
        新增文案
      </button>
      <select
        v-model="articleStatusFilter"
        class="admin-toolbar-select"
        aria-label="筛选文案状态"
      >
        <option value="active">仅正常</option>
        <option value="deleted">仅已删除</option>
        <option value="all">全部</option>
      </select>
      <span class="admin-spacer" />
      <span class="admin-muted">共 {{ filteredArticles.length }} 条</span>
      <button class="admin-btn" type="button" @click="loadArticles">刷新</button>
    </div>

    <p v-if="articleMsg" class="admin-msg" :class="articleOk ? 'ok' : 'err'">{{ articleMsg }}</p>

    <div class="admin-table-scroll">
      <table class="admin-table">
        <thead>
          <tr>
            <th>排序</th>
            <th>标题（简）</th>
            <th>内容摘要</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in filteredArticles"
            :key="row.id"
            :class="{ 'is-deleted-row': row.is_deleted }"
          >
            <td class="admin-cell-nowrap">{{ row.sort_order }}</td>
            <td>
              <strong>{{ row.title_zh || '—' }}</strong>
              <div class="admin-stack">
                <small>{{ row.title_en || '—' }}</small>
                <small>{{ row.title_tw || '—' }}</small>
              </div>
            </td>
            <td>
              <span class="admin-cell-ellipsis" :title="row.body_zh">
                {{ previewText(row.body_zh, 48) }}
              </span>
            </td>
            <td class="admin-cell-nowrap">{{ formatDateTime(row.updated_at) }}</td>
            <td>
              <div v-if="!row.is_deleted" class="admin-actions">
                <button class="admin-btn" type="button" @click="openEditArticle(row)">编辑</button>
                <button
                  class="admin-btn admin-btn-danger"
                  type="button"
                  @click="removeArticle(row)"
                >
                  删除
                </button>
              </div>
              <span v-else class="admin-muted">已删除</span>
            </td>
          </tr>
          <tr v-if="!filteredArticles.length">
            <td colspan="5" class="admin-muted">
              {{
                articles.length
                  ? '没有匹配的文案'
                  : '暂无文案，点击「新增文案」添加'
              }}
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
    <div
      class="admin-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="faq-topic-modal-title"
    >
      <div class="admin-modal-header">
        <h2 id="faq-topic-modal-title">
          {{ editingId == null ? '新增子分类' : `编辑子分类 #${editingId}` }}
        </h2>
        <button class="admin-modal-close" type="button" aria-label="关闭" @click="closeModal">
          ×
        </button>
      </div>
      <form class="admin-form" @submit.prevent="save">
        <p class="admin-muted">
          {{
            editingId == null
              ? '新增：简体与英文必填；繁体可留空（自动用简体）。'
              : '编辑：可只改当前语言页签中的内容，其他语言保持不变。'
          }}
        </p>
        <label>
          锚点标识（slug）
          <input
            v-model="form.slug"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            placeholder="例如 guide、account-setup"
            title="仅小写字母、数字与连字符"
          />
        </label>
        <label>
          排序（数字越小越靠前）
          <input v-model.number="form.sort_order" type="number" step="1" />
        </label>
        <div class="admin-tabs" role="tablist" aria-label="子分类语言">
          <button
            v-for="tab in LANG_TABS"
            :key="tab.key"
            type="button"
            class="admin-tab"
            :class="{ active: formLang === tab.key }"
            role="tab"
            :aria-selected="formLang === tab.key"
            @click="formLang = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
        <template v-for="tab in LANG_TABS" :key="tab.key">
          <div v-show="formLang === tab.key">
            <label>
              {{ tab.key === 'en' ? 'Title' : tab.key === 'tw' ? '標題' : '标题' }}
              <input
                v-model="form[`title_${tab.key}`]"
                :required="editingId == null && (tab.key === 'zh' || tab.key === 'en')"
                :placeholder="
                  tab.key === 'tw'
                    ? '可留空，未填则用简体代替'
                    : editingId == null
                      ? '必填'
                      : ''
                "
              />
            </label>
            <label>
              {{ tab.key === 'en' ? 'Description' : tab.key === 'tw' ? '簡介' : '简介' }}
              <textarea
                v-model="form[`description_${tab.key}`]"
                rows="2"
                :required="editingId == null && (tab.key === 'zh' || tab.key === 'en')"
                :placeholder="
                  tab.key === 'tw'
                    ? '可留空，未填则用简体代替'
                    : editingId == null
                      ? '必填'
                      : ''
                "
              />
            </label>
          </div>
        </template>
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

  <div
    v-if="articleModalOpen"
    class="admin-modal-backdrop"
    role="presentation"
    @click.self="closeArticleModal"
  >
    <div
      class="admin-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="faq-article-modal-title"
    >
      <div class="admin-modal-header">
        <h2 id="faq-article-modal-title">
          {{ editingArticleId == null ? '新增文案' : `编辑文案 #${editingArticleId}` }}
        </h2>
        <button
          class="admin-modal-close"
          type="button"
          aria-label="关闭"
          @click="closeArticleModal"
        >
          ×
        </button>
      </div>
      <form class="admin-form" @submit.prevent="saveArticle">
        <p class="admin-muted">
          {{
            editingArticleId == null
              ? '新增：简体与英文的标题、内容必填；繁体可留空（自动用简体）。'
              : '编辑：可只改当前语言页签中的内容，其他语言保持不变。'
          }}
        </p>
        <label>
          排序（数字越小越靠前）
          <input v-model.number="articleForm.sort_order" type="number" step="1" />
        </label>
        <div class="admin-tabs" role="tablist" aria-label="文案语言">
          <button
            v-for="tab in LANG_TABS"
            :key="tab.key"
            type="button"
            class="admin-tab"
            :class="{ active: articleFormLang === tab.key }"
            role="tab"
            :aria-selected="articleFormLang === tab.key"
            @click="articleFormLang = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
        <template v-for="tab in LANG_TABS" :key="tab.key">
          <div v-show="articleFormLang === tab.key">
            <label>
              {{ tab.key === 'en' ? 'Title' : tab.key === 'tw' ? '標題' : '标题' }}
              <input
                v-model="articleForm[`title_${tab.key}`]"
                :required="editingArticleId == null && (tab.key === 'zh' || tab.key === 'en')"
                :placeholder="
                  tab.key === 'tw'
                    ? '可留空，未填则用简体代替'
                    : editingArticleId == null
                      ? '必填'
                      : ''
                "
              />
            </label>
            <label>
              {{ tab.key === 'en' ? 'Body' : tab.key === 'tw' ? '文案內容' : '文案内容' }}
              <textarea
                v-model="articleForm[`body_${tab.key}`]"
                rows="4"
                :required="editingArticleId == null && (tab.key === 'zh' || tab.key === 'en')"
                :placeholder="
                  tab.key === 'tw'
                    ? '可留空，未填则用简体代替'
                    : editingArticleId == null
                      ? '必填'
                      : ''
                "
              />
            </label>
          </div>
        </template>
        <div class="admin-actions">
          <button class="admin-btn admin-btn-primary" type="submit" :disabled="articleSaving">
            {{ articleSaving ? '保存中…' : '保存' }}
          </button>
          <button
            class="admin-btn"
            type="button"
            :disabled="articleSaving"
            @click="closeArticleModal"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
