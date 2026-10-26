import { Router } from 'express'
import { getDb, nowIso } from '../db/index.js'
import { requireAuth } from '../middleware/auth.js'
import { notifyInquiry } from '../services/mailService.js'

const INDUSTRY_MAP = {
  // 联系表单当前选项
  goods: 'goods',
  services: 'services',
  fx: 'fx',
  货物贸易: 'goods',
  貨物貿易: 'goods',
  服务贸易: 'services',
  服務貿易: 'services',
  灵活换汇: 'fx',
  靈活換匯: 'fx',
  // 兼容旧提交值
  b2b: 'b2b',
  digital: 'digital',
  family: 'family',
  '外贸 B2B 供应链企业': 'b2b',
  '外貿 B2B 供應鏈企業': 'b2b',
  '服务贸易与数字企业': 'digital',
  '服務貿易與數字企業': 'digital',
  '投资控股与家族办公室': 'family',
  '投資控股與家族辦公室': 'family',
  ecommerce: 'b2b',
  trade: 'b2b',
  saas: 'digital',
  other: 'other',
  跨境电商: 'b2b',
  '外贸出口（B2B）': 'b2b',
  外贸出口: 'b2b',
  软件服务: 'digital',
  其他: 'other',
}

const ALLOWED_INDUSTRY = new Set(['goods', 'services', 'fx', 'b2b', 'digital', 'family', 'other'])

const publicRouter = Router()
const adminRouter = Router()

function clientIp(req) {
  const xf = req.headers['x-forwarded-for']
  if (typeof xf === 'string' && xf.trim()) return xf.split(',')[0].trim()
  return req.socket?.remoteAddress || ''
}

const APPOINTMENT_SLOT_RE = /^\d{2}:\d{2}[–-]\d{2}:\d{2}$/
const APPOINTMENT_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function normalizeAppointmentAt(raw) {
  const value = String(raw || '').trim()
  if (!value) return null
  if (value.length > 64) return null
  // Accept "YYYY-MM-DD HH:MM–HH:MM", date-only, or slot-only
  const parts = value.split(/\s+/)
  if (parts.length === 1) {
    if (APPOINTMENT_DATE_RE.test(parts[0]) || APPOINTMENT_SLOT_RE.test(parts[0])) return value
    return null
  }
  if (parts.length === 2 && APPOINTMENT_DATE_RE.test(parts[0]) && APPOINTMENT_SLOT_RE.test(parts[1])) {
    return `${parts[0]} ${parts[1].replace('-', '–')}`
  }
  return null
}

publicRouter.post('/inquiries', async (req, res) => {
  const { name, company, phone, email, industry, appointment_at, message } = req.body || {}
  const n = String(name || '').trim()
  const c = String(company || '').trim()
  const p = String(phone || '').trim()
  const e = String(email || '').trim()
  const m = String(message || '').trim()
  if (!n || !c || !p || !e || !m) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
    return res.status(400).json({ error: 'Invalid email' })
  }
  const rawIndustry = String(industry || '').trim()
  const industryCode = rawIndustry ? INDUSTRY_MAP[rawIndustry] || rawIndustry : ''
  if (industryCode && !ALLOWED_INDUSTRY.has(industryCode)) {
    return res.status(400).json({ error: 'Invalid industry' })
  }
  const appointmentAt = normalizeAppointmentAt(appointment_at)
  if (String(appointment_at || '').trim() && !appointmentAt) {
    return res.status(400).json({ error: 'Invalid appointment time' })
  }

  const info = getDb()
    .prepare(
      `INSERT INTO inquiries (ip, name, company, phone, email, industry, appointment_at, message, is_read, is_deleted, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?)`,
    )
    .run(clientIp(req), n, c, p, e, industryCode || null, appointmentAt, m, nowIso())

  const id = Number(info.lastInsertRowid)
  await notifyInquiry({
    id,
    name: n,
    company: c,
    phone: p,
    email: e,
    industry: industryCode || null,
    appointment_at: appointmentAt,
    message: m,
  })

  res.status(201).json({ ok: true, id })
})

adminRouter.get('/inquiries', requireAuth, (req, res) => {
  const { read, include_deleted } = req.query
  const where = []
  const params = []
  if (include_deleted !== '1') {
    where.push('is_deleted = 0')
  }
  if (read === '0' || read === '1') {
    where.push('is_read = ?')
    params.push(Number(read))
  }
  const sql = `SELECT * FROM inquiries ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY created_at DESC`
  const rows = getDb().prepare(sql).all(...params)
  res.json({ items: rows })
})

adminRouter.get('/inquiries/:id', requireAuth, (req, res) => {
  const row = getDb().prepare('SELECT * FROM inquiries WHERE id = ?').get(Number(req.params.id))
  if (!row || row.is_deleted) return res.status(404).json({ error: 'Not found' })
  res.json(row)
})

adminRouter.patch('/inquiries/:id/read', requireAuth, (req, res) => {
  const id = Number(req.params.id)
  const is_read = req.body?.is_read === false || req.body?.is_read === 0 ? 0 : 1
  const row = getDb().prepare('SELECT id FROM inquiries WHERE id = ? AND is_deleted = 0').get(id)
  if (!row) return res.status(404).json({ error: 'Not found' })
  getDb().prepare('UPDATE inquiries SET is_read = ? WHERE id = ?').run(is_read, id)
  res.json({ ok: true, id, is_read })
})

adminRouter.delete('/inquiries/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id)
  const row = getDb().prepare('SELECT id FROM inquiries WHERE id = ? AND is_deleted = 0').get(id)
  if (!row) return res.status(404).json({ error: 'Not found' })
  getDb().prepare('UPDATE inquiries SET is_deleted = 1 WHERE id = ?').run(id)
  res.json({ ok: true })
})

export { publicRouter as inquiriesPublicRouter, adminRouter as inquiriesAdminRouter }
