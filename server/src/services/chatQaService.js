import { getDb, nowIso, syncChatQaFts, removeChatQaFts } from '../db/index.js'

const FIELDS = [
  'id',
  'question_zh',
  'question_en',
  'question_tw',
  'answer_zh',
  'answer_en',
  'answer_tw',
  'keywords',
  'created_at',
  'updated_at',
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

function toItem(row) {
  const out = {}
  for (const key of FIELDS) out[key] = row[key]
  return out
}

function normalizeBody(body = {}, { existing = null, mode = 'create' } = {}) {
  const question_zh = pickField(body, existing, 'question_zh')
  const question_en = pickField(body, existing, 'question_en')
  let question_tw = pickField(body, existing, 'question_tw')
  const answer_zh = pickField(body, existing, 'answer_zh')
  const answer_en = pickField(body, existing, 'answer_en')
  let answer_tw = pickField(body, existing, 'answer_tw')
  const keywords = pickField(body, existing, 'keywords')

  if (mode === 'create') {
    if (!question_zh) return { error: '请填写简体问题' }
    if (!question_en) return { error: '请填写英文问题' }
    if (!answer_zh) return { error: '请填写简体答案' }
    if (!answer_en) return { error: '请填写英文答案' }
  } else {
    if (!question_zh) return { error: '简体问题不能为空' }
    if (!question_en) return { error: '英文问题不能为空' }
    if (!answer_zh) return { error: '简体答案不能为空' }
    if (!answer_en) return { error: '英文答案不能为空' }
  }

  if (!question_tw) question_tw = question_zh
  if (!answer_tw) answer_tw = answer_zh

  return {
    question_zh,
    question_en,
    question_tw,
    answer_zh,
    answer_en,
    answer_tw,
    keywords,
  }
}

export function listChatQaItems() {
  return getDb()
    .prepare('SELECT * FROM chat_qa_items ORDER BY id DESC')
    .all()
    .map(toItem)
}

export function getChatQaItem(id) {
  const row = getDb().prepare('SELECT * FROM chat_qa_items WHERE id = ?').get(id)
  return row ? toItem(row) : null
}

export function createChatQaItem(body) {
  const data = normalizeBody(body, { mode: 'create' })
  if (data.error) return data

  const ts = nowIso()
  const db = getDb()
  const result = db
    .prepare(
      `INSERT INTO chat_qa_items (
         question_zh, question_en, question_tw,
         answer_zh, answer_en, answer_tw,
         keywords, created_at, updated_at
       ) VALUES (
         @question_zh, @question_en, @question_tw,
         @answer_zh, @answer_en, @answer_tw,
         @keywords, @created_at, @updated_at
       )`,
    )
    .run({ ...data, created_at: ts, updated_at: ts })

  const id = Number(result.lastInsertRowid)
  syncChatQaFts(id, db)
  return getChatQaItem(id)
}

export function updateChatQaItem(id, body) {
  const existing = getChatQaItem(id)
  if (!existing) return { error: 'Not found', status: 404 }

  const data = normalizeBody(body || {}, { existing, mode: 'update' })
  if (data.error) return data

  const ts = nowIso()
  const db = getDb()
  db.prepare(
    `UPDATE chat_qa_items SET
       question_zh=@question_zh, question_en=@question_en, question_tw=@question_tw,
       answer_zh=@answer_zh, answer_en=@answer_en, answer_tw=@answer_tw,
       keywords=@keywords, updated_at=@updated_at
     WHERE id=@id`,
  ).run({ ...data, updated_at: ts, id })

  syncChatQaFts(id, db)
  return getChatQaItem(id)
}

export function deleteChatQaItem(id) {
  const existing = getChatQaItem(id)
  if (!existing) return { error: 'Not found', status: 404 }

  const db = getDb()
  removeChatQaFts(id, db)
  db.prepare('DELETE FROM chat_qa_items WHERE id = ?').run(id)
  return { ok: true }
}
