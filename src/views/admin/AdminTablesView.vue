<script setup>
import { computed, ref } from 'vue'
import { apiFetch } from '@/api/client'
import { formatDateTime, previewText, shortPath } from '@/utils/formatAdmin'
import { useAutoRefresh } from '@/composables/useAutoRefresh'

const TABLE_META = [
  { key: 'system_config', title: '系统配置' },
  { key: 'faq_topics', title: '帮助中心子分类' },
  { key: 'faq_articles', title: '帮助中心文案' },
  { key: 'chat_qa_items', title: '客服问答' },
  { key: 'inquiries', title: '咨询' },
  { key: 'jobs', title: '岗位' },
  { key: 'applications', title: '投递' },
]

const LONG_COLS = new Set([
  'message',
  'responsibilities',
  'responsibilities_zh',
  'responsibilities_en',
  'responsibilities_tw',
  'requirements',
  'requirements_zh',
  'requirements_en',
  'requirements_tw',
  'bio',
  'value_zh',
  'value_en',
  'value_tw',
  'description_zh',
  'description_en',
  'description_tw',
  'body_zh',
  'body_en',
  'body_tw',
  'answer_zh',
  'answer_en',
  'answer_tw',
  'keywords',
])
const DATE_COLS = new Set(['created_at', 'updated_at'])

const includeDeleted = ref(false)
const loading = ref(false)
const msg = ref('')
const payload = ref(null)
const active = ref('system_config')
const firstLoad = ref(true)

const summary = computed(() => payload.value?.summary || null)
const current = computed(() => payload.value?.tables?.[active.value] || null)

const colLabels = {
  id: 'ID',
  ip: 'IP',
  name: '姓名',
  company: '公司',
  phone: '电话 / 手机',
  email: '邮箱',
  industry: '行业',
  appointment_at: '预约时间',
  message: '需求说明',
  is_read: '已读',
  is_deleted: '已删',
  created_at: '创建时间',
  updated_at: '更新时间',
  name_zh: '名称(简)',
  name_en: '名称(英)',
  name_tw: '名称(繁)',
  value_zh: '内容(简)',
  value_en: '内容(英)',
  value_tw: '内容(繁)',
  sort_order: '排序',
  slug: '锚点',
  topic_id: '子分类ID',
  topic_slug: '子分类锚点',
  topic_title_zh: '子分类',
  body_zh: '文案(简)',
  body_en: '文案(英)',
  body_tw: '文案(繁)',
  description_zh: '简介(简)',
  description_en: '简介(英)',
  description_tw: '简介(繁)',
  title: '岗位名称',
  title_zh: '标题(简)',
  title_en: '标题(英)',
  title_tw: '标题(繁)',
  job_type: '类型',
  job_type_zh: '类型(简)',
  job_type_en: '类型(英)',
  job_type_tw: '类型(繁)',
  experience: '经验',
  experience_zh: '经验(简)',
  experience_en: '经验(英)',
  experience_tw: '经验(繁)',
  work_location: '地址',
  work_location_zh: '地址(简)',
  work_location_en: '地址(英)',
  work_location_tw: '地址(繁)',
  responsibilities: '职责',
  responsibilities_zh: '职责(简)',
  responsibilities_en: '职责(英)',
  responsibilities_tw: '职责(繁)',
  requirements: '要求',
  requirements_zh: '要求(简)',
  requirements_en: '要求(英)',
  requirements_tw: '要求(繁)',
  status: '状态',
  job_id: '岗位ID',
  job_title: '岗位',
  gender: '性别',
  school: '院校',
  residence: '现居地',
  bio: '简介',
  resume_path: '简历',
  _note: '说明',
}

function label(col) {
  return colLabels[col] || col
}

function isLong(col) {
  return LONG_COLS.has(col)
}

function cellTitle(col, value) {
  if (value === null || value === undefined || value === '') return ''
  return String(value)
}

function display(col, value) {
  if (value === null || value === undefined || value === '') return '—'
  if (col === 'is_read') return value ? '已读' : '未读'
  if (col === 'is_deleted') return value ? '是' : '否'
  if (col === 'status') return value === 'published' ? '上架' : value === 'draft' ? '下架' : value
  if (col === 'gender') return value === 'male' ? '男' : value === 'female' ? '女' : value
  if (col === 'industry') {
    return (
      {
        goods: '货物贸易',
        services: '服务贸易',
        fx: '灵活换汇',
        b2b: '外贸 B2B 供应链企业',
        digital: '服务贸易与数字企业',
        family: '投资控股与家族办公室',
        ecommerce: '外贸 B2B 供应链企业',
        trade: '外贸 B2B 供应链企业',
        saas: '服务贸易与数字企业',
        other: '其他',
      }[value] || value
    )
  }
  if (DATE_COLS.has(col)) return formatDateTime(value)
  if (col === 'resume_path') return shortPath(value)
  if (isLong(col)) return previewText(String(value).replace(/\s+/g, ' '), 56)
  return String(value)
}

async function load() {
  if (firstLoad.value) loading.value = true
  msg.value = ''
  try {
    const q = includeDeleted.value ? '?include_deleted=1' : ''
    payload.value = await apiFetch(`/api/admin/tables${q}`)
  } catch (err) {
    msg.value = err.message || '加载失败'
  } finally {
    loading.value = false
    firstLoad.value = false
  }
}

useAutoRefresh(load, { intervalMs: 2000 })
</script>

<template>
  <div class="admin-card">
    <h1>数据表总览</h1>
    <p class="admin-muted">只读浏览库表数据；增删改请用对应管理页。长文本超出以 … 省略，悬停可看全文。</p>
    <div class="admin-toolbar">
      <label class="admin-check">
        <input v-model="includeDeleted" type="checkbox" @change="load" />
        包含已软删除记录
      </label>
      <span class="admin-spacer" />
      <button class="admin-btn" type="button" :disabled="loading" @click="load">
        {{ loading ? '加载中…' : '刷新' }}
      </button>
    </div>
    <p v-if="msg" class="admin-msg err">{{ msg }}</p>

    <div v-if="summary" class="admin-stats">
      <div class="admin-stat">
        <strong>{{ summary.system_config }}</strong>
        <span>配置行</span>
      </div>
      <div class="admin-stat">
        <strong>{{ summary.faq_topics }}</strong>
        <span>帮助中心子分类</span>
      </div>
      <div class="admin-stat">
        <strong>{{ summary.faq_articles }}</strong>
        <span>帮助中心文案</span>
      </div>
      <div class="admin-stat">
        <strong>{{ summary.chat_qa_items ?? 0 }}</strong>
        <span>客服问答</span>
      </div>
      <div class="admin-stat">
        <strong>{{ summary.inquiries }}</strong>
        <span>咨询（未读 {{ summary.inquiries_unread }}）</span>
      </div>
      <div class="admin-stat">
        <strong>{{ summary.jobs }}</strong>
        <span>岗位（上架 {{ summary.jobs_published }}）</span>
      </div>
      <div class="admin-stat">
        <strong>{{ summary.applications }}</strong>
        <span>投递（未读 {{ summary.applications_unread }}）</span>
      </div>
    </div>
  </div>

  <div class="admin-card">
    <div class="admin-tabs">
      <button
        v-for="t in TABLE_META"
        :key="t.key"
        type="button"
        class="admin-tab"
        :class="{ active: active === t.key }"
        @click="active = t.key"
      >
        {{ t.title }}
        <em v-if="payload?.tables?.[t.key]">（{{ payload.tables[t.key].rows.length }}）</em>
      </button>
    </div>

    <div v-if="current" class="admin-table-scroll">
      <table class="admin-table admin-table--browse">
        <thead>
          <tr>
            <th v-for="col in current.columns" :key="col">{{ label(col) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, idx) in current.rows"
            :key="row.id ?? idx"
            :class="{ 'is-deleted-row': row.is_deleted }"
          >
            <td
              v-for="col in current.columns"
              :key="col"
              :class="isLong(col) ? 'admin-cell-soft' : 'admin-cell-nowrap'"
            >
              <span
                v-if="isLong(col)"
                class="admin-cell-ellipsis"
                :title="cellTitle(col, row[col])"
              >{{ display(col, row[col]) }}</span>
              <template v-else>{{ display(col, row[col]) }}</template>
            </td>
          </tr>
          <tr v-if="!current.rows.length">
            <td :colspan="current.columns.length" class="admin-muted">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
