import { Router } from 'express'
import { getDb } from '../db/index.js'
import { requireAuth } from '../middleware/auth.js'
import { listAdminConfigItems } from '../services/configService.js'
import { listAdminFaqTopics } from '../services/faqTopicsService.js'

const router = Router()

router.get('/tables', requireAuth, (req, res) => {
  const includeDeleted = req.query.include_deleted === '1'
  const db = getDb()

  const configItems = listAdminConfigItems({ includeDeleted })
  const faqTopics = listAdminFaqTopics({ includeDeleted })

  const inquiriesSql = includeDeleted
    ? 'SELECT * FROM inquiries ORDER BY id DESC'
    : 'SELECT * FROM inquiries WHERE is_deleted = 0 ORDER BY id DESC'
  const jobsSql = includeDeleted
    ? 'SELECT * FROM jobs ORDER BY id DESC'
    : 'SELECT * FROM jobs WHERE is_deleted = 0 ORDER BY id DESC'
  const applicationsSql = includeDeleted
    ? `SELECT a.*, COALESCE(NULLIF(j.title_zh, ''), j.title) AS job_title
       FROM applications a
       LEFT JOIN jobs j ON j.id = a.job_id
       ORDER BY a.id DESC`
    : `SELECT a.*, COALESCE(NULLIF(j.title_zh, ''), j.title) AS job_title
       FROM applications a
       LEFT JOIN jobs j ON j.id = a.job_id
       WHERE a.is_deleted = 0
       ORDER BY a.id DESC`
  const faqArticlesSql = includeDeleted
    ? `SELECT a.*, t.slug AS topic_slug, t.title_zh AS topic_title_zh
       FROM faq_articles a
       LEFT JOIN faq_topics t ON t.id = a.topic_id
       ORDER BY a.id DESC`
    : `SELECT a.*, t.slug AS topic_slug, t.title_zh AS topic_title_zh
       FROM faq_articles a
       LEFT JOIN faq_topics t ON t.id = a.topic_id
       WHERE a.is_deleted = 0
       ORDER BY a.id DESC`

  const inquiries = db.prepare(inquiriesSql).all()
  const jobs = db.prepare(jobsSql).all()
  const applications = db.prepare(applicationsSql).all()
  const faqArticles = db.prepare(faqArticlesSql).all()
  const chatQaItems = db
    .prepare('SELECT * FROM chat_qa_items ORDER BY id DESC')
    .all()

  res.json({
    include_deleted: includeDeleted,
    summary: {
      system_config: configItems.length,
      faq_topics: faqTopics.length,
      faq_articles: faqArticles.length,
      chat_qa_items: chatQaItems.length,
      inquiries: inquiries.length,
      jobs: jobs.length,
      applications: applications.length,
      inquiries_unread: db
        .prepare('SELECT COUNT(*) AS c FROM inquiries WHERE is_deleted = 0 AND is_read = 0')
        .get().c,
      applications_unread: db
        .prepare('SELECT COUNT(*) AS c FROM applications WHERE is_deleted = 0 AND is_read = 0')
        .get().c,
      jobs_published: db
        .prepare(`SELECT COUNT(*) AS c FROM jobs WHERE is_deleted = 0 AND status = 'published'`)
        .get().c,
    },
    tables: {
      system_config: {
        columns: [
          'id',
          'name_zh',
          'name_en',
          'name_tw',
          'value_zh',
          'value_en',
          'value_tw',
          'sort_order',
          'is_deleted',
          'created_at',
          'updated_at',
        ],
        rows: configItems,
      },
      faq_topics: {
        columns: [
          'id',
          'slug',
          'title_zh',
          'title_en',
          'title_tw',
          'description_zh',
          'description_en',
          'description_tw',
          'sort_order',
          'is_deleted',
          'created_at',
          'updated_at',
        ],
        rows: faqTopics,
      },
      faq_articles: {
        columns: [
          'id',
          'topic_id',
          'topic_slug',
          'topic_title_zh',
          'title_zh',
          'title_en',
          'title_tw',
          'body_zh',
          'body_en',
          'body_tw',
          'sort_order',
          'is_deleted',
          'created_at',
          'updated_at',
        ],
        rows: faqArticles,
      },
      chat_qa_items: {
        columns: [
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
        ],
        rows: chatQaItems,
      },
      inquiries: {
        columns: [
          'id',
          'ip',
          'name',
          'company',
          'phone',
          'email',
          'industry',
          'appointment_at',
          'message',
          'is_read',
          'is_deleted',
          'created_at',
        ],
        rows: inquiries,
      },
      jobs: {
        columns: [
          'id',
          'title_zh',
          'title_en',
          'title_tw',
          'job_type_zh',
          'job_type_en',
          'job_type_tw',
          'experience_zh',
          'experience_en',
          'experience_tw',
          'work_location_zh',
          'work_location_en',
          'work_location_tw',
          'responsibilities_zh',
          'responsibilities_en',
          'responsibilities_tw',
          'requirements_zh',
          'requirements_en',
          'requirements_tw',
          'status',
          'is_deleted',
          'created_at',
          'updated_at',
        ],
        rows: jobs,
      },
      applications: {
        columns: [
          'id',
          'job_id',
          'job_title',
          'name',
          'gender',
          'phone',
          'email',
          'school',
          'residence',
          'bio',
          'resume_path',
          'is_read',
          'is_deleted',
          'created_at',
        ],
        rows: applications,
      },
    },
  })
})

export default router
