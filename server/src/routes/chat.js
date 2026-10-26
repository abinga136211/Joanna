import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { askChat } from '../services/chatSearchService.js'
import {
  listChatQaItems,
  createChatQaItem,
  updateChatQaItem,
  deleteChatQaItem,
} from '../services/chatQaService.js'

const publicRouter = Router()
const adminRouter = Router()

/** Simple in-memory IP rate limit for public ask. */
const askHits = new Map()
const ASK_WINDOW_MS = 60_000
const ASK_MAX = 30

function clientIp(req) {
  const xf = req.headers['x-forwarded-for']
  if (typeof xf === 'string' && xf.trim()) return xf.split(',')[0].trim()
  return req.ip || req.socket?.remoteAddress || 'unknown'
}

function rateLimitAsk(req, res, next) {
  const ip = clientIp(req)
  const now = Date.now()
  let bucket = askHits.get(ip)
  if (!bucket || now - bucket.start >= ASK_WINDOW_MS) {
    bucket = { start: now, count: 0 }
    askHits.set(ip, bucket)
  }
  bucket.count += 1
  if (bucket.count > ASK_MAX) {
    return res.status(429).json({ error: '请求过于频繁，请稍后再试' })
  }
  next()
}

publicRouter.post('/chat/ask', rateLimitAsk, (req, res) => {
  const result = askChat(req.body || {})
  res.json(result)
})

adminRouter.get('/chat-qa', requireAuth, (_req, res) => {
  res.json({ items: listChatQaItems() })
})

adminRouter.post('/chat-qa', requireAuth, (req, res) => {
  const result = createChatQaItem(req.body || {})
  if (result.error) return res.status(400).json({ error: result.error })
  res.status(201).json(result)
})

adminRouter.put('/chat-qa/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' })
  const result = updateChatQaItem(id, req.body || {})
  if (result.error) {
    return res.status(result.status || 400).json({ error: result.error })
  }
  res.json(result)
})

adminRouter.delete('/chat-qa/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' })
  const result = deleteChatQaItem(id)
  if (result.error) {
    return res.status(result.status || 400).json({ error: result.error })
  }
  res.json(result)
})

export { publicRouter as chatPublicRouter, adminRouter as chatAdminRouter }
