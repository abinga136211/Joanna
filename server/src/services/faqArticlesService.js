import { getDb, nowIso } from '../db/index.js'

const PUBLIC_FIELDS = [
  'id',
  'topic_id',
  'title_zh',
  'title_en',
  'title_tw',
  'body_zh',
  'body_en',
  'body_tw',
  'sort_order',
]

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

export function listPublicArticlesByTopicIds(topicIds) {
  if (!topicIds.length) return []
  const placeholders = topicIds.map(() => '?').join(', ')
  return getDb()
    .prepare(
      `SELECT * FROM faq_articles
       WHERE is_deleted = 0 AND topic_id IN (${placeholders})
       ORDER BY sort_order ASC, id ASC`,
    )
    .all(...topicIds)
    .map(toPublicItem)
}

export function listAdminArticlesForTopic(topicId, { includeDeleted = false } = {}) {
  const sql = includeDeleted
    ? `SELECT * FROM faq_articles WHERE topic_id = ? ORDER BY sort_order ASC, id ASC`
    : `SELECT * FROM faq_articles WHERE topic_id = ? AND is_deleted = 0 ORDER BY sort_order ASC, id ASC`
  return getDb().prepare(sql).all(topicId)
}

export function getAdminArticle(id) {
  return getDb()
    .prepare('SELECT * FROM faq_articles WHERE id = ? AND is_deleted = 0')
    .get(id)
}

/**
 * @param {object} body
 * @param {{ existing?: object|null, mode?: 'create'|'update' }} [options]
 */
function normalizeBody(body = {}, { existing = null, mode = 'create' } = {}) {
  const title_zh = pickField(body, existing, 'title_zh')
  const title_en = pickField(body, existing, 'title_en')
  let title_tw = pickField(body, existing, 'title_tw')
  const body_zh = pickField(body, existing, 'body_zh')
  const body_en = pickField(body, existing, 'body_en')
  let body_tw = pickField(body, existing, 'body_tw')

  if (mode === 'create') {
    if (!title_zh) return { error: '请填写简体标题' }
    if (!title_en) return { error: '请填写英文标题' }
    if (!body_zh) return { error: '请填写简体文案内容' }
    if (!body_en) return { error: '请填写英文文案内容' }
  } else {
    if (!title_zh) return { error: '简体标题不能为空' }
    if (!title_en) return { error: '英文标题不能为空' }
    if (!body_zh) return { error: '简体文案内容不能为空' }
    if (!body_en) return { error: '英文文案内容不能为空' }
  }

  if (!title_tw) title_tw = title_zh
  if (!body_tw) body_tw = body_zh

  const sortRaw = hasOwn(body, 'sort_order') ? body.sort_order : existing?.sort_order
  const sort_order = Number.isFinite(Number(sortRaw)) ? Number(sortRaw) : 0

  return {
    title_zh,
    title_en,
    title_tw,
    body_zh,
    body_en,
    body_tw,
    sort_order,
  }
}

export function createFaqArticle(topicId, body) {
  const topic = getDb()
    .prepare('SELECT id FROM faq_topics WHERE id = ? AND is_deleted = 0')
    .get(topicId)
  if (!topic) return { error: '子分类不存在', status: 404 }

  const data = normalizeBody(body, { mode: 'create' })
  if (data.error) return data

  const ts = nowIso()
  const result = getDb()
    .prepare(
      `INSERT INTO faq_articles (
         topic_id, title_zh, title_en, title_tw,
         body_zh, body_en, body_tw,
         sort_order, is_deleted, created_at, updated_at
       ) VALUES (
         @topic_id, @title_zh, @title_en, @title_tw,
         @body_zh, @body_en, @body_tw,
         @sort_order, 0, @created_at, @updated_at
       )`,
    )
    .run({ ...data, topic_id: topicId, created_at: ts, updated_at: ts })

  return getDb().prepare('SELECT * FROM faq_articles WHERE id = ?').get(result.lastInsertRowid)
}

export function updateFaqArticle(id, body) {
  const existing = getAdminArticle(id)
  if (!existing) return { error: 'Not found', status: 404 }

  const data = normalizeBody(body || {}, { existing, mode: 'update' })
  if (data.error) return data

  const ts = nowIso()
  getDb()
    .prepare(
      `UPDATE faq_articles SET
         title_zh=@title_zh, title_en=@title_en, title_tw=@title_tw,
         body_zh=@body_zh, body_en=@body_en, body_tw=@body_tw,
         sort_order=@sort_order, updated_at=@updated_at
       WHERE id=@id`,
    )
    .run({ ...data, updated_at: ts, id })

  return getDb().prepare('SELECT * FROM faq_articles WHERE id = ?').get(id)
}

/** Soft-delete removes the whole article (zh / en / tw together). */
export function softDeleteFaqArticle(id) {
  const existing = getAdminArticle(id)
  if (!existing) return { error: 'Not found', status: 404 }

  getDb()
    .prepare('UPDATE faq_articles SET is_deleted = 1, updated_at = ? WHERE id = ?')
    .run(nowIso(), id)

  return { ok: true }
}

export function softDeleteArticlesForTopic(topicId) {
  getDb()
    .prepare(
      `UPDATE faq_articles SET is_deleted = 1, updated_at = ?
       WHERE topic_id = ? AND is_deleted = 0`,
    )
    .run(nowIso(), topicId)
}

export function countArticlesForTopics(topicIds) {
  const map = new Map()
  for (const id of topicIds) map.set(id, 0)
  if (!topicIds.length) return map
  const placeholders = topicIds.map(() => '?').join(', ')
  const rows = getDb()
    .prepare(
      `SELECT topic_id, COUNT(*) AS c FROM faq_articles
       WHERE is_deleted = 0 AND topic_id IN (${placeholders})
       GROUP BY topic_id`,
    )
    .all(...topicIds)
  for (const row of rows) map.set(row.topic_id, row.c)
  return map
}
