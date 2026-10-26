import { Router } from 'express'
import { getDb, nowIso } from '../db/index.js'
import { requireAuth } from '../middleware/auth.js'

const publicRouter = Router()
const adminRouter = Router()

const JOB_I18N_FIELDS = [
  'title',
  'job_type',
  'experience',
  'work_location',
  'responsibilities',
  'requirements',
]
const JOB_I18N_LANGS = ['zh', 'en', 'tw']

function splitLines(text) {
  return String(text || '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function pickText(row, field, lang) {
  const preferred = String(row[`${field}_${lang}`] || '').trim()
  if (preferred) return preferred
  const zh = String(row[`${field}_zh`] || '').trim()
  if (zh) return zh
  return String(row[field] || '').trim()
}

function mapPublicJob(row) {
  const out = { id: row.id }
  for (const field of JOB_I18N_FIELDS) {
    for (const lang of JOB_I18N_LANGS) {
      const key = `${field}_${lang}`
      const raw = pickText(row, field, lang)
      out[key] = field === 'responsibilities' || field === 'requirements' ? splitLines(raw) : raw
    }
  }
  // Backward-compatible aliases (zh)
  out.title = out.title_zh
  out.job_type = out.job_type_zh
  out.experience = out.experience_zh
  out.work_location = out.work_location_zh
  out.responsibilities = out.responsibilities_zh
  out.requirements = out.requirements_zh
  return out
}

publicRouter.get('/jobs', (_req, res) => {
  const rows = getDb()
    .prepare(
      `SELECT * FROM jobs WHERE is_deleted = 0 AND status = 'published' ORDER BY updated_at DESC`,
    )
    .all()
  res.json({ items: rows.map(mapPublicJob) })
})

publicRouter.get('/jobs/:id', (req, res) => {
  const row = getDb()
    .prepare(
      `SELECT * FROM jobs WHERE id = ? AND is_deleted = 0 AND status = 'published'`,
    )
    .get(Number(req.params.id))
  if (!row) return res.status(404).json({ error: 'Not found' })
  res.json(mapPublicJob(row))
})

adminRouter.get('/jobs', requireAuth, (req, res) => {
  const includeDeleted = req.query.include_deleted === '1'
  const sql = includeDeleted
    ? 'SELECT * FROM jobs ORDER BY updated_at DESC'
    : 'SELECT * FROM jobs WHERE is_deleted = 0 ORDER BY updated_at DESC'
  const rows = getDb().prepare(sql).all()
  const withCounts = rows.map((row) => {
    const count = getDb()
      .prepare(
        `SELECT COUNT(*) AS c FROM applications WHERE job_id = ? AND is_deleted = 0`,
      )
      .get(row.id).c
    return { ...row, application_count: count }
  })
  res.json({ items: withCounts })
})

adminRouter.get('/jobs/:id', requireAuth, (req, res) => {
  const row = getDb().prepare('SELECT * FROM jobs WHERE id = ?').get(Number(req.params.id))
  if (!row || row.is_deleted) return res.status(404).json({ error: 'Not found' })
  res.json(row)
})

function validateJobBody(body) {
  const data = {}
  for (const field of JOB_I18N_FIELDS) {
    for (const lang of JOB_I18N_LANGS) {
      const key = `${field}_${lang}`
      // Accept legacy monolingual keys as zh fallback when *_zh missing
      const raw =
        body?.[key] ??
        (lang === 'zh' ? body?.[field] : undefined) ??
        ''
      data[key] = String(raw || '').trim()
    }
  }
  if (!data.title_zh) return { error: '请填写简体岗位名称' }
  if (!data.title_en) return { error: '请填写英文岗位名称' }
  // Traditional Chinese falls back to Simplified when empty
  for (const field of JOB_I18N_FIELDS) {
    if (!data[`${field}_tw`]) data[`${field}_tw`] = data[`${field}_zh`]
  }
  data.status = body?.status === 'published' ? 'published' : 'draft'
  // Keep legacy columns synced to zh
  for (const field of JOB_I18N_FIELDS) {
    data[field] = data[`${field}_zh`]
  }
  return data
}

const JOB_COLUMNS = [
  ...JOB_I18N_FIELDS,
  ...JOB_I18N_FIELDS.flatMap((f) => JOB_I18N_LANGS.map((l) => `${f}_${l}`)),
  'status',
]

adminRouter.post('/jobs', requireAuth, (req, res) => {
  const data = validateJobBody(req.body)
  if (data.error) return res.status(400).json({ error: data.error })
  const ts = nowIso()
  const cols = [...JOB_COLUMNS, 'is_deleted', 'created_at', 'updated_at']
  const placeholders = cols.map((c) => `@${c}`).join(', ')
  const info = getDb()
    .prepare(`INSERT INTO jobs (${cols.join(', ')}) VALUES (${placeholders})`)
    .run({ ...data, is_deleted: 0, created_at: ts, updated_at: ts })
  const row = getDb().prepare('SELECT * FROM jobs WHERE id = ?').get(info.lastInsertRowid)
  res.status(201).json(row)
})

adminRouter.put('/jobs/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id)
  const existing = getDb().prepare('SELECT * FROM jobs WHERE id = ? AND is_deleted = 0').get(id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  const data = validateJobBody({ ...existing, ...req.body })
  if (data.error) return res.status(400).json({ error: data.error })
  const sets = [...JOB_COLUMNS, 'updated_at'].map((c) => `${c}=@${c}`).join(', ')
  getDb()
    .prepare(`UPDATE jobs SET ${sets} WHERE id=@id`)
    .run({ ...data, updated_at: nowIso(), id })
  res.json(getDb().prepare('SELECT * FROM jobs WHERE id = ?').get(id))
})

adminRouter.patch('/jobs/:id/status', requireAuth, (req, res) => {
  const id = Number(req.params.id)
  const status = req.body?.status === 'published' ? 'published' : 'draft'
  const existing = getDb().prepare('SELECT id FROM jobs WHERE id = ? AND is_deleted = 0').get(id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  getDb()
    .prepare('UPDATE jobs SET status = ?, updated_at = ? WHERE id = ?')
    .run(status, nowIso(), id)
  res.json({ ok: true, id, status })
})

adminRouter.delete('/jobs/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id)
  const existing = getDb().prepare('SELECT id FROM jobs WHERE id = ? AND is_deleted = 0').get(id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  getDb()
    .prepare('UPDATE jobs SET is_deleted = 1, status = ?, updated_at = ? WHERE id = ?')
    .run('draft', nowIso(), id)
  res.json({ ok: true })
})

export { publicRouter as jobsPublicRouter, adminRouter as jobsAdminRouter }
