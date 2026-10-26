import { Router } from 'express'
import {
  listPublicFaqTopics,
  listAdminFaqTopics,
  createFaqTopic,
  updateFaqTopic,
  softDeleteFaqTopic,
  getAdminFaqTopic,
} from '../services/faqTopicsService.js'
import {
  listAdminArticlesForTopic,
  createFaqArticle,
  updateFaqArticle,
  softDeleteFaqArticle,
} from '../services/faqArticlesService.js'
import { requireAuth } from '../middleware/auth.js'

const publicRouter = Router()
const adminRouter = Router()

publicRouter.get('/faq-topics', (_req, res) => {
  res.json({ items: listPublicFaqTopics() })
})

adminRouter.get('/faq-topics', requireAuth, (req, res) => {
  const includeDeleted = req.query.include_deleted === '1'
  res.json({ items: listAdminFaqTopics({ includeDeleted }) })
})

adminRouter.post('/faq-topics', requireAuth, (req, res) => {
  const result = createFaqTopic(req.body || {})
  if (result.error) return res.status(400).json({ error: result.error })
  res.status(201).json(result)
})

adminRouter.put('/faq-topics/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' })
  const result = updateFaqTopic(id, req.body || {})
  if (result.error) {
    return res.status(result.status || 400).json({ error: result.error })
  }
  res.json(result)
})

adminRouter.delete('/faq-topics/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' })
  const result = softDeleteFaqTopic(id)
  if (result.error) {
    return res.status(result.status || 400).json({ error: result.error })
  }
  res.json(result)
})

adminRouter.get('/faq-topics/:topicId/articles', requireAuth, (req, res) => {
  const topicId = Number(req.params.topicId)
  if (!Number.isFinite(topicId)) return res.status(400).json({ error: 'Invalid id' })
  const topic = getAdminFaqTopic(topicId)
  if (!topic) return res.status(404).json({ error: '子分类不存在' })
  const includeDeleted = req.query.include_deleted === '1'
  res.json({
    topic,
    items: listAdminArticlesForTopic(topicId, { includeDeleted }),
  })
})

adminRouter.post('/faq-topics/:topicId/articles', requireAuth, (req, res) => {
  const topicId = Number(req.params.topicId)
  if (!Number.isFinite(topicId)) return res.status(400).json({ error: 'Invalid id' })
  const result = createFaqArticle(topicId, req.body || {})
  if (result.error) {
    return res.status(result.status || 400).json({ error: result.error })
  }
  res.status(201).json(result)
})

adminRouter.put('/faq-articles/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' })
  const result = updateFaqArticle(id, req.body || {})
  if (result.error) {
    return res.status(result.status || 400).json({ error: result.error })
  }
  res.json(result)
})

adminRouter.delete('/faq-articles/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' })
  const result = softDeleteFaqArticle(id)
  if (result.error) {
    return res.status(result.status || 400).json({ error: result.error })
  }
  res.json(result)
})

export { publicRouter as faqTopicsPublicRouter, adminRouter as faqTopicsAdminRouter }
