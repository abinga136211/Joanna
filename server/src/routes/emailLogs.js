import { Router } from 'express'
import { getDb } from '../db/index.js'
import { requireAuth } from '../middleware/auth.js'

const adminRouter = Router()
const ALLOWED_STATUS = new Set(['sent', 'failed', 'skipped'])

adminRouter.get('/email-logs', requireAuth, (req, res) => {
  const status = String(req.query.status || '').trim()
  const params = []
  let sql = 'SELECT * FROM email_logs'
  if (ALLOWED_STATUS.has(status)) {
    sql += ' WHERE status = ?'
    params.push(status)
  }
  sql += ' ORDER BY created_at DESC'
  const items = getDb().prepare(sql).all(...params)
  res.json({ items })
})

export { adminRouter as emailLogsAdminRouter }
