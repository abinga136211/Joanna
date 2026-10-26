import nodemailer from 'nodemailer'
import { getDb, nowIso } from '../db/index.js'

const INDUSTRY_LABEL = {
  goods: '货物贸易',
  services: '服务贸易',
  fx: '灵活换汇',
  b2b: '外贸 B2B 供应链企业',
  digital: '服务贸易与数字企业',
  family: '投资控股与家族办公室',
  ecommerce: '外贸 B2B 供应链企业',
  trade: '外贸 B2B 供应链企业',
  saas: '服务贸易与数字企业',
  other: '其他',
}

function smtpConfig() {
  const user = String(process.env.SMTP_USER || '').trim()
  const pass = String(process.env.SMTP_PASS || '').trim()
  const from = String(process.env.MAIL_FROM || user).trim()
  const to = String(process.env.MAIL_TO || '').trim()
  const host = String(process.env.SMTP_HOST || 'smtp.qq.com').trim()
  const port = Number(process.env.SMTP_PORT || 465)
  const secure = String(process.env.SMTP_SECURE ?? 'true').toLowerCase() !== 'false'
  return { user, pass, from, to, host, port, secure }
}

function insertLog({ inquiryId, from, to, subject, status, error }) {
  getDb()
    .prepare(
      `INSERT INTO email_logs (inquiry_id, from_email, to_email, subject, status, error_message, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(inquiryId ?? null, from || '', to || '', subject || '', status, error || null, nowIso())
}

function industryText(code) {
  if (!code) return '—'
  return INDUSTRY_LABEL[code] || code
}

function buildBody(inquiry) {
  return [
    '网站收到一条新的咨询。',
    '',
    `咨询编号：${inquiry.id}`,
    `姓名：${inquiry.name}`,
    `公司：${inquiry.company}`,
    `电话：${inquiry.phone}`,
    `邮箱：${inquiry.email}`,
    `行业：${industryText(inquiry.industry)}`,
    `预约时间：${inquiry.appointment_at || '—'}`,
    `需求说明：`,
    inquiry.message || '',
  ].join('\n')
}

export async function notifyInquiry(inquiry) {
  const cfg = smtpConfig()
  const subject = `新咨询 #${inquiry.id} ${inquiry.name || ''}`.trim()
  if (!cfg.user || !cfg.pass || !cfg.from || !cfg.to) {
    insertLog({
      inquiryId: inquiry.id,
      from: cfg.from,
      to: cfg.to,
      subject,
      status: 'skipped',
      error: 'SMTP not configured',
    })
    return { status: 'skipped' }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: { user: cfg.user, pass: cfg.pass },
    })
    await transporter.sendMail({
      from: cfg.from,
      to: cfg.to,
      subject,
      text: buildBody(inquiry),
    })
    insertLog({
      inquiryId: inquiry.id,
      from: cfg.from,
      to: cfg.to,
      subject,
      status: 'sent',
    })
    return { status: 'sent' }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    insertLog({
      inquiryId: inquiry.id,
      from: cfg.from,
      to: cfg.to,
      subject,
      status: 'failed',
      error: message,
    })
    console.error('Inquiry notification email failed:', message)
    return { status: 'failed' }
  }
}
