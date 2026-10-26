import { getDb } from '../db/index.js'

const LANGS = new Set(['zh', 'en', 'tw'])

function pickLang(lang) {
  const l = String(lang || 'zh').toLowerCase()
  return LANGS.has(l) ? l : 'zh'
}

function pickLocalized(row, field, lang) {
  const primary = trimField(row[`${field}_${lang}`])
  if (primary) return primary
  if (lang === 'tw') {
    const zh = trimField(row[`${field}_zh`])
    if (zh) return zh
  }
  return trimField(row[`${field}_zh`]) || trimField(row[`${field}_en`]) || ''
}

function trimField(value) {
  return typeof value === 'string' ? value.trim() : ''
}

/** Strip FTS special chars; keep CJK / letters / digits / spaces. */
function sanitizeQuery(raw) {
  return String(raw || '')
    .slice(0, 200)
    .replace(/["'*(){}[\]^~:!-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractTokens(q) {
  const tokens = new Set()
  const words = q.split(/\s+/).filter(Boolean)
  for (const w of words) {
    if (w.length >= 2) tokens.add(w)
  }
  // CJK continuous string: add 2–4 char windows from start/end
  if (/[\u4e00-\u9fff]/.test(q)) {
    const compact = q.replace(/\s+/g, '')
    tokens.add(compact)
    for (let len = 2; len <= 4 && len <= compact.length; len++) {
      tokens.add(compact.slice(0, len))
      tokens.add(compact.slice(-len))
    }
  }
  return [...tokens]
}

function buildMatchQuery(q) {
  const tokens = extractTokens(q)
    .map((t) => t.replace(/"/g, ''))
    .filter((t) => t.length >= 2)
  if (!tokens.length) return null
  // Prefer longer tokens first for ranking stability; OR for recall
  const unique = [...new Set(tokens)].sort((a, b) => b.length - a.length).slice(0, 8)
  return unique.map((t) => `"${t}"`).join(' OR ')
}

function toResult(row, lang) {
  return {
    matched: true,
    itemId: row.id,
    question: pickLocalized(row, 'question', lang),
    answer: pickLocalized(row, 'answer', lang),
  }
}

function searchFts(q) {
  const match = buildMatchQuery(q)
  if (!match) return null

  try {
    return getDb()
      .prepare(
        `SELECT q.*, bm25(chat_qa_fts) AS rank
         FROM chat_qa_fts
         JOIN chat_qa_items q ON q.id = chat_qa_fts.rowid
         WHERE chat_qa_fts MATCH ?
         ORDER BY rank
         LIMIT 1`,
      )
      .get(match)
  } catch {
    return null
  }
}

function searchLike(q) {
  const tokens = extractTokens(q)
    .filter((t) => t.length >= 2)
    .sort((a, b) => b.length - a.length)
    .slice(0, 6)
  if (!tokens.length) return null

  const db = getDb()
  for (const token of tokens) {
    const like = `%${token}%`
    const row = db
      .prepare(
        `SELECT * FROM chat_qa_items
         WHERE question_zh LIKE ? OR question_en LIKE ? OR question_tw LIKE ?
            OR keywords LIKE ?
            OR answer_zh LIKE ? OR answer_en LIKE ? OR answer_tw LIKE ?
         ORDER BY id DESC
         LIMIT 1`,
      )
      .get(like, like, like, like, like, like, like)
    if (row) return row
  }
  return null
}

/**
 * Stateless ask: no chat history persisted.
 * @param {{ q?: string, lang?: string }} input
 */
export function askChat(input = {}) {
  const lang = pickLang(input.lang)
  const q = sanitizeQuery(input.q)
  if (!q) return { matched: false }

  const ftsHit = searchFts(q)
  if (ftsHit) return toResult(ftsHit, lang)

  const likeHit = searchLike(q)
  if (likeHit) return toResult(likeHit, lang)

  return { matched: false }
}
