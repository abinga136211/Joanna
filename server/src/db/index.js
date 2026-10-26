import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Database from 'better-sqlite3'
import { DEFAULT_CONFIG, DEFAULT_CONFIG_ITEMS } from '../defaults/config.js'
import {
  DEFAULT_FAQ_TOPICS,
  DEFAULT_FAQ_ARTICLES_BY_SLUG,
} from '../defaults/faqTopics.js'
import { DEFAULT_CHAT_QA } from '../defaults/chatQa.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const serverRoot = path.resolve(__dirname, '../..')

export const DATA_DIR = path.join(serverRoot, 'data')
export const UPLOADS_DIR = path.join(serverRoot, 'uploads', 'resumes')
export const DB_PATH = process.env.SQLITE_PATH || path.join(DATA_DIR, 'adgpay.sqlite')

let db

export function getDb() {
  if (!db) throw new Error('Database not initialized')
  return db
}

export function initDb() {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })

  db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  const migrationPath = path.join(__dirname, 'migrations', '001_initial.sql')
  const sql = fs.readFileSync(migrationPath, 'utf8')
  db.exec(sql)
  ensureColumnMigrations(db)
  ensureConfigItemsTable(db)
  ensureAppMetaTable(db)
  ensureFaqTopicsTable(db)
  ensureFaqArticlesTable(db)
  ensureChatQaTables(db)
  ensureEmailLogsTable(db)

  return db
}

function ensureEmailLogsTable(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS email_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      inquiry_id INTEGER,
      from_email TEXT NOT NULL DEFAULT '',
      to_email TEXT NOT NULL DEFAULT '',
      subject TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'skipped')),
      error_message TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_email_logs_created ON email_logs(created_at DESC);
  `)
}

function ensureAppMetaTable(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    );
  `)
}

function isMetaFlag(database, key) {
  const row = database.prepare('SELECT value FROM app_meta WHERE key = ?').get(key)
  return !!row && String(row.value) === '1'
}

function setMetaFlag(database, key) {
  database
    .prepare(
      `INSERT INTO app_meta (key, value) VALUES (?, '1')
       ON CONFLICT(key) DO UPDATE SET value = '1'`,
    )
    .run(key)
}

/** Additive columns for DBs that already ran an older 001_initial. */
function ensureColumnMigrations(database) {
  const appCols = database
    .prepare(`PRAGMA table_info(applications)`)
    .all()
    .map((c) => c.name)
  if (!appCols.includes('phone')) {
    database.exec(`ALTER TABLE applications ADD COLUMN phone TEXT NOT NULL DEFAULT ''`)
  }
  if (!appCols.includes('email')) {
    database.exec(`ALTER TABLE applications ADD COLUMN email TEXT NOT NULL DEFAULT ''`)
  }

  const inquiryCols = database
    .prepare(`PRAGMA table_info(inquiries)`)
    .all()
    .map((c) => c.name)
  if (!inquiryCols.includes('appointment_at')) {
    database.exec(`ALTER TABLE inquiries ADD COLUMN appointment_at TEXT`)
  }

  ensureJobsI18nColumns(database)
}

const JOB_I18N_FIELDS = [
  'title',
  'job_type',
  'experience',
  'work_location',
  'responsibilities',
  'requirements',
]
const JOB_I18N_LANGS = ['zh', 'en', 'tw']

function ensureJobsI18nColumns(database) {
  const cols = new Set(
    database
      .prepare(`PRAGMA table_info(jobs)`)
      .all()
      .map((c) => c.name),
  )
  for (const field of JOB_I18N_FIELDS) {
    for (const lang of JOB_I18N_LANGS) {
      const col = `${field}_${lang}`
      if (!cols.has(col)) {
        database.exec(`ALTER TABLE jobs ADD COLUMN ${col} TEXT NOT NULL DEFAULT ''`)
        cols.add(col)
      }
    }
  }

  // Backfill zh from legacy monolingual columns when zh is still empty.
  for (const field of JOB_I18N_FIELDS) {
    if (!cols.has(field) || !cols.has(`${field}_zh`)) continue
    database.exec(
      `UPDATE jobs SET ${field}_zh = ${field}
       WHERE TRIM(COALESCE(${field}_zh, '')) = ''
         AND TRIM(COALESCE(${field}, '')) != ''`,
    )
  }
}

/** Multilingual config items; seed once from legacy system_config or defaults. */
function ensureConfigItemsTable(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS system_config_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_zh TEXT NOT NULL DEFAULT '',
      name_en TEXT NOT NULL DEFAULT '',
      name_tw TEXT NOT NULL DEFAULT '',
      value_zh TEXT NOT NULL DEFAULT '',
      value_en TEXT NOT NULL DEFAULT '',
      value_tw TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_deleted INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_config_items_sort
      ON system_config_items(is_deleted, sort_order, id);
  `)

  const count = database
    .prepare('SELECT COUNT(*) AS c FROM system_config_items')
    .get().c
  if (count > 0) return

  seedConfigItems(database)
}

function seedConfigItems(database) {
  const legacy = database.prepare('SELECT * FROM system_config WHERE id = 1').get()
  const customer =
    (legacy?.customer_email || '').trim() || DEFAULT_CONFIG.customer_email
  const address =
    (legacy?.office_address || '').trim() || DEFAULT_CONFIG.office_address

  const seeds = DEFAULT_CONFIG_ITEMS.map((item) => {
    if (item.name_zh === '客户邮箱') {
      return { ...item, value_zh: customer, value_en: customer, value_tw: customer }
    }
    if (item.name_zh === '办公地址') {
      return { ...item, value_zh: address, value_en: address, value_tw: address }
    }
    return item
  })

  const ts = new Date().toISOString()
  const insert = database.prepare(`
    INSERT INTO system_config_items (
      name_zh, name_en, name_tw, value_zh, value_en, value_tw,
      sort_order, is_deleted, created_at, updated_at
    ) VALUES (
      @name_zh, @name_en, @name_tw, @value_zh, @value_en, @value_tw,
      @sort_order, 0, @created_at, @updated_at
    )
  `)

  const tx = database.transaction((rows) => {
    for (const row of rows) {
      insert.run({ ...row, created_at: ts, updated_at: ts })
    }
  })
  tx(seeds)
}

/**
 * Help-center topics: seed defaults only once.
 * After the first seed (or if rows already exist), emptying the table / restart
 * will NOT re-insert hardcoded defaults.
 */
function ensureFaqTopicsTable(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS faq_topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL DEFAULT '',
      title_zh TEXT NOT NULL DEFAULT '',
      title_en TEXT NOT NULL DEFAULT '',
      title_tw TEXT NOT NULL DEFAULT '',
      description_zh TEXT NOT NULL DEFAULT '',
      description_en TEXT NOT NULL DEFAULT '',
      description_tw TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_deleted INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_faq_topics_sort
      ON faq_topics(is_deleted, sort_order, id);
  `)

  const count = database.prepare('SELECT COUNT(*) AS c FROM faq_topics').get().c
  if (count > 0) {
    setMetaFlag(database, 'faq_topics_seeded')
    return
  }
  if (isMetaFlag(database, 'faq_topics_seeded')) return

  const ts = new Date().toISOString()
  const insert = database.prepare(`
    INSERT INTO faq_topics (
      slug, title_zh, title_en, title_tw,
      description_zh, description_en, description_tw,
      sort_order, is_deleted, created_at, updated_at
    ) VALUES (
      @slug, @title_zh, @title_en, @title_tw,
      @description_zh, @description_en, @description_tw,
      @sort_order, 0, @created_at, @updated_at
    )
  `)

  const tx = database.transaction((rows) => {
    for (const row of rows) {
      insert.run({ ...row, created_at: ts, updated_at: ts })
    }
  })
  tx(DEFAULT_FAQ_TOPICS)
  setMetaFlag(database, 'faq_topics_seeded')
}

/**
 * Help-center articles: seed defaults only once (same one-shot rule as topics).
 */
function ensureFaqArticlesTable(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS faq_articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER NOT NULL,
      title_zh TEXT NOT NULL DEFAULT '',
      title_en TEXT NOT NULL DEFAULT '',
      title_tw TEXT NOT NULL DEFAULT '',
      body_zh TEXT NOT NULL DEFAULT '',
      body_en TEXT NOT NULL DEFAULT '',
      body_tw TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_deleted INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (topic_id) REFERENCES faq_topics(id)
    );
    CREATE INDEX IF NOT EXISTS idx_faq_articles_topic
      ON faq_articles(topic_id, is_deleted, sort_order, id);
  `)

  const count = database.prepare('SELECT COUNT(*) AS c FROM faq_articles').get().c
  if (count > 0) {
    setMetaFlag(database, 'faq_articles_seeded')
    return
  }
  if (isMetaFlag(database, 'faq_articles_seeded')) return

  const topics = database
    .prepare('SELECT id, slug FROM faq_topics WHERE is_deleted = 0')
    .all()
  if (!topics.length) {
    // Topics already seeded-empty or not ready: still mark so we don't keep retrying forever
    // only after topics seed flag is set (avoid blocking first-boot article seed).
    if (isMetaFlag(database, 'faq_topics_seeded')) {
      setMetaFlag(database, 'faq_articles_seeded')
    }
    return
  }

  const ts = new Date().toISOString()
  const insert = database.prepare(`
    INSERT INTO faq_articles (
      topic_id, title_zh, title_en, title_tw,
      body_zh, body_en, body_tw,
      sort_order, is_deleted, created_at, updated_at
    ) VALUES (
      @topic_id, @title_zh, @title_en, @title_tw,
      @body_zh, @body_en, @body_tw,
      @sort_order, 0, @created_at, @updated_at
    )
  `)

  const tx = database.transaction(() => {
    for (const topic of topics) {
      const articles = DEFAULT_FAQ_ARTICLES_BY_SLUG[topic.slug] || []
      for (const article of articles) {
        insert.run({
          ...article,
          topic_id: topic.id,
          created_at: ts,
          updated_at: ts,
        })
      }
    }
  })
  tx()
  setMetaFlag(database, 'faq_articles_seeded')
}

/**
 * Chat QA knowledge + FTS5 index (trigram). Separate from FAQ help center.
 */
function ensureChatQaTables(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS chat_qa_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_zh TEXT NOT NULL DEFAULT '',
      question_en TEXT NOT NULL DEFAULT '',
      question_tw TEXT NOT NULL DEFAULT '',
      answer_zh TEXT NOT NULL DEFAULT '',
      answer_en TEXT NOT NULL DEFAULT '',
      answer_tw TEXT NOT NULL DEFAULT '',
      keywords TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `)

  ensureChatQaFtsTable(database)
  seedChatQaIfEmpty(database)

  if (!isMetaFlag(database, 'chat_qa_fts_built')) {
    rebuildChatQaFts(database)
    setMetaFlag(database, 'chat_qa_fts_built')
  }
}

function ensureChatQaFtsTable(database) {
  const ddl = `
    CREATE VIRTUAL TABLE IF NOT EXISTS chat_qa_fts USING fts5(
      question_zh, question_en, question_tw,
      answer_zh, answer_en, answer_tw,
      keywords,
      content='chat_qa_items',
      content_rowid='id',
      tokenize='trigram'
    );
  `
  try {
    database.exec(ddl)
    // Probe for prior corruption from plain DELETE on external-content FTS.
    database.prepare('SELECT * FROM chat_qa_fts LIMIT 0').all()
  } catch {
    database.exec('DROP TABLE IF EXISTS chat_qa_fts')
    database.exec(ddl)
    database
      .prepare(`DELETE FROM app_meta WHERE key = 'chat_qa_fts_built'`)
      .run()
  }
}

function seedChatQaIfEmpty(database) {
  const count = database.prepare('SELECT COUNT(*) AS c FROM chat_qa_items').get().c
  if (count > 0) {
    setMetaFlag(database, 'chat_qa_seeded')
    return
  }
  if (isMetaFlag(database, 'chat_qa_seeded')) return

  const ts = new Date().toISOString()
  const insert = database.prepare(`
    INSERT INTO chat_qa_items (
      question_zh, question_en, question_tw,
      answer_zh, answer_en, answer_tw,
      keywords, created_at, updated_at
    ) VALUES (
      @question_zh, @question_en, @question_tw,
      @answer_zh, @answer_en, @answer_tw,
      @keywords, @created_at, @updated_at
    )
  `)

  const tx = database.transaction((rows) => {
    for (const row of rows) {
      insert.run({ ...row, created_at: ts, updated_at: ts })
    }
  })
  tx(DEFAULT_CHAT_QA)
  setMetaFlag(database, 'chat_qa_seeded')
}

export function rebuildChatQaFts(database = getDb()) {
  // External-content FTS5: use rebuild command (plain DELETE corrupts the vtab).
  database.prepare(`INSERT INTO chat_qa_fts(chat_qa_fts) VALUES('rebuild')`).run()
}

export function syncChatQaFts(id, database = getDb()) {
  const row = database.prepare('SELECT * FROM chat_qa_items WHERE id = ?').get(id)
  // Remove old index row if present (external content delete command).
  database
    .prepare(
      `INSERT INTO chat_qa_fts(chat_qa_fts, rowid, question_zh, question_en, question_tw,
         answer_zh, answer_en, answer_tw, keywords)
       VALUES('delete', ?, '', '', '', '', '', '', '')`,
    )
    .run(id)
  if (!row) return
  database
    .prepare(
      `INSERT INTO chat_qa_fts(
         rowid, question_zh, question_en, question_tw,
         answer_zh, answer_en, answer_tw, keywords
       ) VALUES (
         @id, @question_zh, @question_en, @question_tw,
         @answer_zh, @answer_en, @answer_tw, @keywords
       )`,
    )
    .run(row)
}

export function removeChatQaFts(id, database = getDb()) {
  database
    .prepare(
      `INSERT INTO chat_qa_fts(chat_qa_fts, rowid, question_zh, question_en, question_tw,
         answer_zh, answer_en, answer_tw, keywords)
       VALUES('delete', ?, '', '', '', '', '', '', '')`,
    )
    .run(id)
}

export function nowIso() {
  return new Date().toISOString()
}
