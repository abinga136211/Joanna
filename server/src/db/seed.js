import { getDb, nowIso } from './index.js'

const SEED_JOBS = [
  {
    title_zh: '前端工程师',
    title_en: 'Frontend Engineer',
    title_tw: '前端工程師',
    job_type_zh: '全职',
    job_type_en: 'Full-time',
    job_type_tw: '全職',
    experience_zh: '2 年以上',
    experience_en: '2+ years',
    experience_tw: '2 年以上',
    work_location_zh: '香港',
    work_location_en: 'Hong Kong',
    work_location_tw: '香港',
    responsibilities_zh:
      '负责官网与商户后台的前端开发与体验优化\n与产品、设计协作，落地跨境支付相关页面与交互\n维护组件库与前端工程规范，保障多语言与多端适配',
    responsibilities_en:
      'Build and polish the marketing site and merchant dashboard\nPartner with product and design on cross-border payment UX\nMaintain the component library and frontend engineering standards',
    responsibilities_tw:
      '負責官網與商戶後台的前端開發與體驗優化\n與產品、設計協作，落地跨境支付相關頁面與交互\n維護組件庫與前端工程規範，保障多語言與多端適配',
    requirements_zh:
      '熟悉 Vue 3 / TypeScript，有实际项目经验\n了解前端性能、无障碍与基础安全实践\n沟通清晰，能独立推进功能交付',
    requirements_en:
      'Solid Vue 3 / TypeScript experience\nFamiliar with performance, accessibility and basic frontend security\nClear communicator who can ship features independently',
    requirements_tw:
      '熟悉 Vue 3 / TypeScript，有實際專案經驗\n了解前端性能、無障礙與基礎安全實踐\n溝通清晰，能獨立推進功能交付',
  },
  {
    title_zh: '后端工程师（支付系统）',
    title_en: 'Backend Engineer (Payments)',
    title_tw: '後端工程師（支付系統）',
    job_type_zh: '全职',
    job_type_en: 'Full-time',
    job_type_tw: '全職',
    experience_zh: '3 年以上',
    experience_en: '3+ years',
    experience_tw: '3 年以上',
    work_location_zh: '香港',
    work_location_en: 'Hong Kong',
    work_location_tw: '香港',
    responsibilities_zh:
      '参与收款、结算与对账相关服务的设计与开发\n对接银行 / 通道接口，保障交易链路稳定与可观测\n编写接口文档与单元测试，参与代码评审',
    responsibilities_en:
      'Design and build collection, settlement and reconciliation services\nIntegrate bank / channel APIs with stable, observable payment flows\nWrite API docs and unit tests; participate in code reviews',
    responsibilities_tw:
      '參與收款、結算與對賬相關服務的設計與開發\n對接銀行 / 通道接口，保障交易鏈路穩定與可觀測\n編寫接口文檔與單元測試，參與代碼評審',
    requirements_zh:
      '熟悉 Java 或 Node.js，了解常见数据库与消息队列\n有金融 / 支付 / 清结算相关经验优先\n重视数据一致性、幂等与异常处理',
    requirements_en:
      'Strong Java or Node.js; comfortable with databases and message queues\nFintech / payments / clearing experience preferred\nCare about consistency, idempotency and error handling',
    requirements_tw:
      '熟悉 Java 或 Node.js，了解常見資料庫與訊息佇列\n有金融 / 支付 / 清結算相關經驗優先\n重視資料一致性、冪等與異常處理',
  },
  {
    title_zh: '合规专员（AML / KYC）',
    title_en: 'Compliance Specialist (AML / KYC)',
    title_tw: '合規專員（AML / KYC）',
    job_type_zh: '全职',
    job_type_en: 'Full-time',
    job_type_tw: '全職',
    experience_zh: '2 年以上',
    experience_en: '2+ years',
    experience_tw: '2 年以上',
    work_location_zh: '香港',
    work_location_en: 'Hong Kong',
    work_location_tw: '香港',
    responsibilities_zh:
      '执行客户尽职调查（CDD / EDD）与持续监控\n识别可疑交易，协助提交可疑交易报告（STR）相关材料\n维护合规政策文档并配合监管检查',
    responsibilities_en:
      'Run CDD / EDD and ongoing monitoring\nIdentify suspicious activity and support STR filings\nMaintain compliance policies and support regulatory reviews',
    responsibilities_tw:
      '執行客戶盡職調查（CDD / EDD）與持續監控\n識別可疑交易，協助提交可疑交易報告（STR）相關材料\n維護合規政策文檔並配合監管檢查',
    requirements_zh:
      '熟悉香港 AML 法规与 MSO 监管要求\n细致、保密意识强，能处理敏感客户资料\n具备合规或风控相关经验优先',
    requirements_en:
      'Familiar with Hong Kong AML rules and MSO oversight\nDetail-oriented, discreet with sensitive client data\nCompliance or risk-control experience preferred',
    requirements_tw:
      '熟悉香港 AML 法規與 MSO 監管要求\n細緻、保密意識強，能處理敏感客戶資料\n具備合規或風控相關經驗優先',
  },
]

/** Insert demo published jobs when the table is empty. */
export function seedJobsIfEmpty() {
  const count = getDb().prepare('SELECT COUNT(*) AS c FROM jobs').get().c
  if (count > 0) return
  const ts = nowIso()
  const stmt = getDb().prepare(
    `INSERT INTO jobs (
       title, job_type, experience, work_location, responsibilities, requirements,
       title_zh, title_en, title_tw,
       job_type_zh, job_type_en, job_type_tw,
       experience_zh, experience_en, experience_tw,
       work_location_zh, work_location_en, work_location_tw,
       responsibilities_zh, responsibilities_en, responsibilities_tw,
       requirements_zh, requirements_en, requirements_tw,
       status, is_deleted, created_at, updated_at
     ) VALUES (
       @title, @job_type, @experience, @work_location, @responsibilities, @requirements,
       @title_zh, @title_en, @title_tw,
       @job_type_zh, @job_type_en, @job_type_tw,
       @experience_zh, @experience_en, @experience_tw,
       @work_location_zh, @work_location_en, @work_location_tw,
       @responsibilities_zh, @responsibilities_en, @responsibilities_tw,
       @requirements_zh, @requirements_en, @requirements_tw,
       'published', 0, @created_at, @updated_at
     )`,
  )
  const tx = getDb().transaction((jobs) => {
    for (const job of jobs) {
      stmt.run({
        ...job,
        title: job.title_zh,
        job_type: job.job_type_zh,
        experience: job.experience_zh,
        work_location: job.work_location_zh,
        responsibilities: job.responsibilities_zh,
        requirements: job.requirements_zh,
        created_at: ts,
        updated_at: ts,
      })
    }
  })
  tx(SEED_JOBS)
  console.log(`Seeded ${SEED_JOBS.length} jobs`)
}
