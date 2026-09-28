/** Keyword knowledge base for the on-site assistant (from original adgpay.html) */
export const CHAT_KB = [
  {
    k: ['牌照', 'mso', '金钱服务', '监管', '合规', 'license', 'licensed', 'regulated', 'regulatory', 'legal', '海关'],
    a: {
      zh: 'ADG PAY 持有香港海关发出的MSO牌照，受《打击洗钱及恐怖分子资金筹集条例》规管，提供货币兑换与汇款服务，并执行严格的AML与KYC审查及交易监控。',
      tw: 'ADG PAY 持有香港海關發出的MSO牌照，受《打擊洗錢及恐怖分子資金籌集條例》規管，提供貨幣兌換與匯款服務，並執行嚴格的AML與KYC審查及交易監控。',
      en: 'ADG PAY holds a Hong Kong Customs & Excise Department Money Service Operator (MSO) license, regulated under the Anti-Money Laundering and Counter-Terrorist Financing Ordinance, providing money changing and remittance with strict AML/KYC due diligence and transaction monitoring.',
    },
  },
  {
    k: ['开户', '注册', '申请', 'onboard', 'open account', 'register', 'sign up', '申请账户', '开通', '入驻'],
    a: {
      zh: '开户流程很简单：① 在线提交企业资料与申请；② 完成KYC与业务核验；③ 审核通过后开通多币种账户。全程在线办理，合规团队会协助您准备材料。',
      tw: '開戶流程很簡單：① 在線提交企業資料與申請；② 完成KYC與業務核驗；③ 審核通過後開通多幣種賬戶。全程在線辦理，合規團隊會協助您準備材料。',
      en: 'Onboarding is simple: 1) Submit your company details and application online; 2) Complete KYC identity and business verification; 3) Your multi-currency account is activated after approval. Our compliance team assists with the documents.',
    },
  },
  {
    k: ['收款', '收钱', '收取', 'collection', 'receive', '收款账户', '收汇', 'collect', '收款项'],
    a: {
      zh: '您可通过 ADG PAY 开立多币种收款账户，向合作方提供本地收款信息以收取跨境款项，资金隔离存放、安全持有。',
      tw: '您可通過 ADG PAY 開立多幣種收款賬戶，向合作方提供本地收款信息以收取跨境款項，資金隔離存放、安全持有。',
      en: 'Open multi-currency collection accounts with ADG PAY and share local receiving details with partners to collect cross-border payments, held safely in segregated funds.',
    },
  },
  {
    k: ['付款', '打款', '支付', 'pay', 'send', 'disburse', '付款给', 'global pay', '汇款', 'remit', '转账'],
    a: {
      zh: 'ADG PAY 支持向全球供应商、员工与合作伙伴付款，覆盖主流币种，流程为：持有币种 → 按需兑换 → 发起对外付款。',
      tw: 'ADG PAY 支持向全球供應商、員工與合作夥伴付款，覆蓋主流幣種，流程爲：持有幣種 → 按需兌換 → 發起對外付款。',
      en: 'ADG PAY supports paying suppliers, employees and partners worldwide across major currencies: hold funds → exchange as needed → send outward payments.',
    },
  },
  {
    k: ['币种', '货币', '多币种', 'currency', 'fx', 'foreign exchange', '换汇', '兑换', 'exchange', '多货币', '持有'],
    a: {
      zh: '我们提供多币种持有与货币兑换服务，您可在同一账户内持有多种货币，并按需进行兑换，降低汇兑成本。',
      tw: '我們提供多幣種持有與貨幣兌換服務，您可在同一賬戶內持有多種貨幣，並按需進行兌換，降低匯兌成本。',
      en: 'We provide multi-currency holding and exchange — hold several currencies in one account and convert on demand to reduce FX costs.',
    },
  },
  {
    k: ['费率', '手续费', '收费', 'fee', 'charge', 'cost', 'price', '价格', '多少钱', '报价', '费用'],
    a: {
      zh: '具体费率根据您的业务规模与币种组合定制。请留下联系方式，我们的商务团队会为您一对一提供透明报价。',
      tw: '具體費率根據您的業務規模與幣種組合定製。請留下聯繫方式，我們的商務團隊會爲您一對一提供透明報價。',
      en: 'Pricing is tailored to your business volume and currency mix. Leave your contact details and our team will share a transparent quote with you.',
    },
  },
  {
    k: ['到账', '多久', '时间', 'speed', 'settle', 'settlement', '时效', '几天', '处理时间'],
    a: {
      zh: '到账时间取决于币种与通道，多数主流币种付款可在 1–2 个工作日内处理。具体时效建议您联系我们按场景确认。',
      tw: '到賬時間取決於幣種與通道，多數主流幣種付款可在 1–2 個工作日內處理。具體時效建議您聯繫我們按場景確認。',
      en: 'Settlement depends on currency and corridor; most major-currency payments are processed within 1–2 business days. Contact us for timing on your scenario.',
    },
  },
  {
    k: ['安全', '资金', '隔离', 'security', 'safe', 'segregat', '资金安全', '加密', '保护', '风控'],
    a: {
      zh: '客户资金隔离存放于受监管金融机构账户，与平台自有资金分离；全链路采用银行级加密与访问控制，保障资金与数据安全。',
      tw: '客戶資金隔離存放於受監管金融機構賬戶，與平臺自有資金分離；全鏈路採用銀行級加密與訪問控制，保障資金與數據安全。',
      en: 'Client funds are held in segregated accounts at regulated financial institutions, separate from company funds. Bank-grade encryption and access controls protect funds and data.',
    },
  },
  {
    k: ['语言', '双语', '中英文', 'chinese', 'english', 'language', 'bilingual', '中文', '英文'],
    a: {
      zh: '我们提供中英双语服务，网站与客服团队均支持中文与英文沟通，方便不同地区合作伙伴对接。',
      tw: '我們提供中英雙語服務，網站與客服團隊均支持中文與英文溝通，方便不同地區合作夥伴對接。',
      en: 'We provide bilingual (Chinese & English) service — both the website and our support team communicate in Chinese and English.',
    },
  },
  {
    k: ['客户', '行业', '谁', '适合', 'industry', 'who', 'partner', '适用', '电商', '外贸', '业务'],
    a: {
      zh: 'ADG PAY 服务于有跨境收款、付款与换汇需求的企业，覆盖电商、外贸、服务贸易、数字业务等多种行业。',
      tw: 'ADG PAY 服務於有跨境收款、付款與換匯需求的企業，覆蓋電商、外貿、服務貿易、數字業務等多種行業。',
      en: 'ADG PAY serves businesses with cross-border collection, payment and FX needs — e-commerce, trade, service export, digital businesses and more.',
    },
  },
  {
    k: ['联系', '客服', '电话', '邮箱', 'contact', 'email', 'phone', 'reach', '怎么找', '人工', '沟通'],
    a: {
      zh: '您可访问「联系我们」页面提交咨询，我们会尽快与您取得联系；需要人工协助时也可直接邮件沟通。',
      tw: '您可訪問「聯繫我們」頁面提交諮詢，我們會儘快與您取得聯繫；需要人工協助時也可直接郵件溝通。',
      en: "Visit the Contact page to submit an inquiry and we'll get back to you promptly; email is also available for direct assistance.",
    },
  },
  {
    k: ['公司', '关于', '介绍', 'about', 'company', '你们是', 'who are you', '是什么', '做什么'],
    a: {
      zh: 'ADG PAY 是持有香港MSO牌照的跨境支付服务提供商，专注为企业的全球收款、多币种持有、货币兑换与对外付款提供合规、稳定的金融基础设施。',
      tw: 'ADG PAY 是持有香港MSO牌照的跨境支付服務提供商，專注爲企業的全球收款、多幣種持有、貨幣兌換與對外付款提供合規、穩定的金融基礎設施。',
      en: 'ADG PAY is a Hong Kong MSO-licensed cross-border payment provider, offering compliant and reliable infrastructure for global collection, multi-currency holding, FX and outbound payments.',
    },
  },
]
