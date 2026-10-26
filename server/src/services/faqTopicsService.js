import { getDb, nowIso } from '../db/index.js'
import {
  listPublicArticlesByTopicIds,
  softDeleteArticlesForTopic,
  countArticlesForTopics,
} from './faqArticlesService.js'

const PUBLIC_FIELDS = [
  'id',
  'slug',
  'title_zh',
  'title_en',
  'title_tw',
  'description_zh',
  'description_en',
  'description_tw',
  'sort_order',
]

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function trimField(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj || {}, key)
}

function pickField(body, existing, key) {
  if (hasOwn(body, key)) return trimField(body[key])
  return existing ? trimField(existing[key]) : ''
}

function toPublicItem(row) {
  const out = {}
  for (const key of PUBLIC_FIELDS) out[key] = row[key]
  return out
}

/** Public list: empty DB / all deleted → empty array (no hardcoded ghost data). */
export function listPublicFaqTopics() {
  try {
    const rows = getDb()
      .prepare(
        `SELECT * FROM faq_topics
         WHERE is_deleted = 0
         ORDER BY sort_order ASC, id ASC`,
      )
      .all()
    if (!rows.length) return []
    const articles = listPublicArticlesByTopicIds(rows.map((r) => r.id))
    const byTopic = new Map()
    for (const article of articles) {
      const list = byTopic.get(article.topic_id) || []
      list.push(article)
      byTopic.set(article.topic_id, list)
    }
    return rows.map((row) => ({
      ...toPublicItem(row),
      articles: byTopic.get(row.id) || [],
    }))
  } catch {
    return []
  }
}

export function listAdminFaqTopics({ includeDeleted = false } = {}) {
  const sql = includeDeleted
    ? `SELECT * FROM faq_topics ORDER BY sort_order ASC, id ASC`
    : `SELECT * FROM faq_topics WHERE is_deleted = 0 ORDER BY sort_order ASC, id ASC`
  const rows = getDb().prepare(sql).all()
  const counts = countArticlesForTopics(rows.filter((r) => !r.is_deleted).map((r) => r.id))
  return rows.map((row) => ({
    ...row,
    article_count: row.is_deleted ? 0 : counts.get(row.id) || 0,
  }))
}

export function getAdminFaqTopic(id) {
  return getDb()
    .prepare('SELECT * FROM faq_topics WHERE id = ? AND is_deleted = 0')
    .get(id)
}

/**
 * @param {object} body
 * @param {{ existing?: object|null, mode?: 'create'|'update' }} [options]
 */
function normalizeBody(body = {}, { existing = null, mode = 'create' } = {}) {
  const slug = pickField(body, existing, 'slug').toLowerCase()
  const title_zh = pickField(body, existing, 'title_zh')
  const title_en = pickField(body, existing, 'title_en')
  let title_tw = pickField(body, existing, 'title_tw')
  const description_zh = pickField(body, existing, 'description_zh')
  const description_en = pickField(body, existing, 'description_en')
  let description_tw = pickField(body, existing, 'description_tw')

  if (!slug) return { error: '请填写锚点标识（slug）' }
  if (!SLUG_RE.test(slug)) {
    return { error: '锚点标识仅允许小写字母、数字与连字符' }
  }

  if (mode === 'create') {
    if (!title_zh) return { error: '请填写简体标题' }
    if (!title_en) return { error: '请填写英文标题' }
    if (!description_zh) return { error: '请填写简体简介' }
    if (!description_en) return { error: '请填写英文简介' }
  } else {
    // Edit: allow changing one language; final record must still have zh+en.
    if (!title_zh) return { error: '简体标题不能为空' }
    if (!title_en) return { error: '英文标题不能为空' }
    if (!description_zh) return { error: '简体简介不能为空' }
    if (!description_en) return { error: '英文简介不能为空' }
  }

  if (!title_tw) title_tw = title_zh
  if (!description_tw) description_tw = description_zh

  const sortRaw = hasOwn(body, 'sort_order')
    ? body.sort_order
    : existing?.sort_order
  const sort_order = Number.isFinite(Number(sortRaw)) ? Number(sortRaw) : 0

  const excludeId = existing?.id ?? null
  const clash = getDb()
    .prepare(
      `SELECT id FROM faq_topics
       WHERE slug = ? AND is_deleted = 0
         AND (? IS NULL OR id != ?)`,
    )
    .get(slug, excludeId, excludeId)
  if (clash) return { error: '该锚点标识已被使用' }

  return {
    slug,
    title_zh,
    title_en,
    title_tw,
    description_zh,
    description_en,
    description_tw,
    sort_order,
  }
}

export function createFaqTopic(body) {
  const data = normalizeBody(body, { mode: 'create' })
  if (data.error) return data

  const ts = nowIso()
  const result = getDb()
    .prepare(
      `INSERT INTO faq_topics (
         slug, title_zh, title_en, title_tw,
         description_zh, description_en, description_tw,
         sort_order, is_deleted, created_at, updated_at
       ) VALUES (
         @slug, @title_zh, @title_en, @title_tw,
         @description_zh, @description_en, @description_tw,
         @sort_order, 0, @created_at, @updated_at
       )`,
    )
    .run({ ...data, created_at: ts, updated_at: ts })

  return getDb().prepare('SELECT * FROM faq_topics WHERE id = ?').get(result.lastInsertRowid)
}

export function updateFaqTopic(id, body) {
  const existing = getAdminFaqTopic(id)
  if (!existing) return { error: 'Not found', status: 404 }

  const data = normalizeBody(body || {}, { existing, mode: 'update' })
  if (data.error) return data

  const ts = nowIso()
  getDb()
    .prepare(
      `UPDATE faq_topics SET
         slug=@slug, title_zh=@title_zh, title_en=@title_en, title_tw=@title_tw,
         description_zh=@description_zh, description_en=@description_en,
         description_tw=@description_tw, sort_order=@sort_order, updated_at=@updated_at
       WHERE id=@id`,
    )
    .run({ ...data, updated_at: ts, id })

  return getDb().prepare('SELECT * FROM faq_topics WHERE id = ?').get(id)
}

/** Soft-delete removes the whole row (zh / en / tw) and its articles. */
export function softDeleteFaqTopic(id) {
  const existing = getAdminFaqTopic(id)
  if (!existing) return { error: 'Not found', status: 404 }

  const ts = nowIso()
  getDb()
    .prepare('UPDATE faq_topics SET is_deleted = 1, updated_at = ? WHERE id = ?')
    .run(ts, id)
  softDeleteArticlesForTopic(id)

  return { ok: true }
}
