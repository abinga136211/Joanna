<script setup>
import { ref, computed, watch } from 'vue'
import HeroVisual from '@/components/home/HeroVisual.vue'
import FlagMarquee from '@/components/home/FlagMarquee.vue'
import WhyGlobe from '@/components/home/WhyGlobe.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useLocaleStore } from '@/stores/locale'

const root = ref(null)
useScrollReveal(root)

const locale = useLocaleStore()
const productTab = ref('methods') // methods | scenarios
const openProduct = ref(-1)

const t = (...args) => locale.t(...args)

const methodItems = computed(() => [
  {
    key: 'receive',
    title: t('跨境收款', 'Cross-border Collection', '跨境收款'),
    desc: t(
      '为全球买家提供本地收款账户，用本地币种收款，减少中转与汇损。',
      'Provide local collection accounts for global buyers to receive funds in local currencies, reducing intermediaries and FX loss.',
      '為全球買家提供本地收款賬戶，用本地幣種收款，減少中轉與匯損。',
    ),
    href: '/products#receive',
    visual: {
      tag: t('本地收款', 'Local collection', '本地收款'),
      headline: t('本地币种收款入账', 'Receive in local currency', '本地幣種收款入賬'),
      metric: 'USD → HKD',
      detail: t('减少中转与汇损', 'Fewer hops, less FX loss', '減少中轉與匯損'),
    },
  },
  {
    key: 'settle',
    title: t('多币种结算', 'Multi-currency Settlement', '多幣種結算'),
    desc: t(
      '持有并管理多种币种余额，按需结算，灵活把握换汇时点。',
      'Hold and manage multiple currency balances, settle on demand, and flexibly time your currency exchange.',
      '持有並管理多種幣種餘額，按需結算，靈活把握換匯時點。',
    ),
    href: '/products#settle',
    visual: {
      tag: t('多币种', 'Multi-currency', '多幣種'),
      headline: t('持有余额，按需结算', 'Hold & settle on demand', '持有餘額，按需結算'),
      metric: 'USD · EUR · HKD',
      detail: t('灵活把握换汇时点', 'Time your FX with flexibility', '靈活把握換匯時點'),
    },
  },
  {
    key: 'va',
    title: t('虚拟账户', 'Virtual Accounts', '虛擬賬戶'),
    desc: t(
      '为每个业务线开立独立虚拟账户，资金清晰可分，对账更高效。',
      'Open independent virtual accounts for each business line, keeping funds clearly separable and reconciliation more efficient.',
      '為每個業務線開立獨立虛擬賬戶，資金清晰可分，對賬更高效。',
    ),
    href: '/products#va',
    visual: {
      tag: t('虚拟账户', 'Virtual account', '虛擬賬戶'),
      headline: t('一业务线一账户', 'One line, one ledger', '一業務線一賬戶'),
      metric: 'VA-001 · VA-002',
      detail: t('对账更高效', 'Clearer reconciliation', '對賬更高效'),
    },
  },
  {
    key: 'pay',
    title: t('供应商付款', 'Supplier Payments', '供應商付款'),
    desc: t(
      '向海外供应商批量付款，支持多币种，流程留痕、合规可查。',
      'Make batch payments to overseas suppliers in multiple currencies, with traceable processes and compliant records.',
      '向海外供應商批量付款，支持多幣種，流程留痕、合規可查。',
    ),
    href: '/products#pay',
    visual: {
      tag: t('批量付款', 'Batch payout', '批量付款'),
      headline: t('向海外供应商付款', 'Pay suppliers globally', '向海外供應商付款'),
      metric: 'Batch · Multi-CCY',
      detail: t('流程留痕、合规可查', 'Traceable & compliant', '流程留痕、合規可查'),
    },
  },
])

const scenarioItems = computed(() => [
  {
    key: 'ecommerce',
    title: t('跨境电商', 'Cross-border E-commerce', '跨境電商'),
    subtitle: t('平台收款与回款', 'Platform Collection & Payout', '平台收款與回款'),
    desc: t(
      '对接主流电商平台收款，本地币种入账，回国结算更顺。',
      'Connect with major e-commerce platforms for collection, credit in local currency, and smoother repatriation settlement.',
      '對接主流電商平台收款，本地幣種入賬，回國結算更順。',
    ),
    features: t(
      ['多店铺统一归集', '本地收款账户'],
      ['Unified Multi-store Aggregation', 'Local Collection Account'],
      ['多店鋪統一歸集', '本地收款賬戶'],
    ),
    href: '/products',
    visual: {
      tag: t('跨境电商', 'E-commerce', '跨境電商'),
      headline: t('平台收款与回款', 'Platform Collection & Payout', '平台收款與回款'),
      metric: 'Multi-store',
      detail: t('本地币种入账，回国结算更顺', 'Local currency in, smoother repatriation', '本地幣種入賬，回國結算更順'),
    },
  },
  {
    key: 'trade',
    title: t('外贸出口', 'Cross-border Trade / Export', '外貿出口'),
    subtitle: t('B2B 贸易收付款', 'Cross-border Trade B2B', 'B2B 貿易收付款'),
    desc: t(
      '面向海外买家的电汇收款与供应商付款，单证与流水清晰可查。',
      'Wire collection from overseas buyers and supplier payments, with clear documents and transaction records.',
      '面向海外買家的電匯收款與供應商付款，單證與流水清晰可查。',
    ),
    features: t(
      ['电汇收款', '批量付供应商'],
      ['Wire Collection', 'Batch Supplier Payments'],
      ['電匯收款', '批量付供應商'],
    ),
    href: '/products',
    visual: {
      tag: t('外贸出口', 'B2B Trade', '外貿出口'),
      headline: t('B2B 贸易收付款', 'B2B pay-in & pay-out', 'B2B 貿易收付款'),
      metric: 'Wire · Batch',
      detail: t('单证与流水清晰可查', 'Clear documents & records', '單證與流水清晰可查'),
    },
  },
  {
    key: 'saas',
    title: t('SaaS / 软件', 'SaaS / Software', 'SaaS / 軟件'),
    subtitle: t('订阅与全球收款', 'Subscriptions & Global Collection', '訂閱與全球收款'),
    desc: t(
      '支持全球用户以本地方式付费，统一归集到多币种账户。',
      'Let global users pay locally, with funds unified into multi-currency accounts.',
      '支持全球用戶以本地方式付費，統一歸集到多幣種賬戶。',
    ),
    features: t(
      ['订阅收款', '自动化对账'],
      ['Subscription Collection', 'Automated Reconciliation'],
      ['訂閱收款', '自動化對賬'],
    ),
    href: '/products',
    visual: {
      tag: t('软件服务', 'SaaS', '軟件服務'),
      headline: t('订阅与全球收款', 'Subscriptions & Global Collection', '訂閱與全球收款'),
      metric: 'Global → Multi-CCY',
      detail: t('本地付费，统一归集', 'Local pay-in, unified accounts', '本地付費，統一歸集'),
    },
  },
])

const products = computed(() =>
  productTab.value === 'scenarios' ? scenarioItems.value : methodItems.value,
)

const ctaHref = computed(() => {
  const list = products.value
  return list[openProduct.value]?.href || list[0]?.href || '/products'
})

function setTab(tab) {
  productTab.value = tab
  openProduct.value = -1
}

function selectProduct(index) {
  openProduct.value = openProduct.value === index ? -1 : index
}

watch(
  () => locale.language,
  () => {
    openProduct.value = -1
  },
)
</script>

<template>
<div ref="root">
<!-- ===== Hero ===== -->
<section class="hero hero-home">
<div class="container">
<div class="hero-layout">
<div class="hero-copy reveal-group">
<h1 class="reveal" data-en='Licensed Cross-border Payment<br>Making Global Collections <span class="hero-accent">Easier</span> for Cross-border Businesses' data-zh='持牌跨境支付<br/>让跨境企业<span class="hero-accent">全球收款更简单</span>' data-tw='持牌跨境支付<br/>讓跨境企業<span class="hero-accent">全球收款更簡單</span>'>持牌跨境支付<br/>让跨境企业<span class="hero-accent">全球收款更简单</span></h1>
<p class="lead reveal" data-en='ADG PAY holds a <mark class="hero-license-mark">Hong Kong Money Service Operator (MSO) licence</mark> and focuses on providing compliant, transparent and efficient cross-border collection and multi-currency settlement services for cross-border enterprises such as e-commerce, trade and SaaS. Local team, companion-style service.' data-zh='ADG PAY持有<mark class="hero-license-mark">香港MSO牌照</mark>，专注为电商、外贸与 SaaS 等跨境企业提供合规、透明、高效的跨境收款与多币种结算服务。本地团队，陪伴式服务。' data-tw='ADG PAY持有<mark class="hero-license-mark">香港MSO牌照</mark>，專注爲電商、外貿與 SaaS 等跨境企業提供合規、透明、高效的跨境收款與多幣種結算服務。本地團隊，陪伴式服務。'>ADG PAY持有<mark class="hero-license-mark">香港MSO牌照</mark>，专注为电商、外贸与 SaaS 等跨境企业提供合规、透明、高效的跨境收款与多币种结算服务。本地团队，陪伴式服务。</p>
<div class="hero-cta reveal">
<a class="btn btn-primary btn-lg" data-en="Account Opening Consult" data-zh="咨询开户" data-tw="諮詢開戶" href="/contact">咨询开户</a>
<a class="btn btn-outline btn-lg" data-en="View Product Solutions" data-zh="查看产品方案" data-tw="查看產品方案" href="/products">查看产品方案</a>
</div>
</div>
<div class="hero-media reveal">
<HeroVisual />
</div>
</div>
<div class="hero-stats reveal-group">
<div class="stat reveal"><div class="num" data-en="Multi-currency Accounts" data-zh="多币种账户" data-tw="多幣種賬戶">多币种账户</div><div class="label" data-en="Local-currency Collection &amp; Settlement" data-zh="本地币种收款与结算" data-tw="本地幣種收款與結算">本地币种收款与结算</div></div>
<div class="stat reveal"><div class="num" data-en="Transparent Fees" data-zh="费率透明" data-tw="費率透明">费率透明</div><div class="label" data-en="No Hidden Fees" data-zh="无隐藏费用" data-tw="無隱藏費用">无隐藏费用</div></div>
<div class="stat reveal"><div class="num" data-en="Licensed &amp; Compliant" data-zh="持牌合规" data-tw="持牌合規">持牌合规</div><div class="label" data-en="Regulated Fund Services" data-zh="受监管资金服务" data-tw="受監管資金服務">受监管资金服务</div></div>
<div class="stat reveal"><div class="num" data-en="Localized Support" data-zh="本地化支持" data-tw="本地化支持">本地化支持</div><div class="label" data-en="Chinese-speaking Team Service" data-zh="中文团队服务" data-tw="中文團隊服務">中文团队服务</div></div>
</div>
</div>
</section>
<!-- ===== 全球覆盖 · 国旗流动 ===== -->
<FlagMarquee />
<!-- ===== 核心产品 ===== -->
<section class="section products-section">
<div class="container">
<div class="products-split reveal-group">
<div class="products-copy reveal">
<span class="products-kicker" data-en="Core Products" data-zh="核心产品" data-tw="核心產品">核心产品</span>
<h2 data-en="One-stop Cross-border Pay-in &amp; Pay-out" data-zh="一站式的跨境收付能力" data-tw="一站式的跨境收付能力">一站式的跨境收付能力</h2>
<p class="products-lead" data-en="Built around real cross-border trade scenarios — practical, easy to use, and free of unnecessary complexity." data-zh="围绕跨境企业真实贸易场景打造，功能务实、上手简单，不堆砌复杂概念。" data-tw="圍繞跨境企業真實貿易場景打造，功能務實、上手簡單，不堆砌複雜概念。">围绕跨境企业真实贸易场景打造，功能务实、上手简单，不堆砌复杂概念。</p>

<div class="products-tabs" role="tablist" aria-label="产品分类">
<button
  type="button"
  role="tab"
  class="products-tab"
  :class="{ active: productTab === 'methods' }"
  :aria-selected="productTab === 'methods'"
  @click="setTab('methods')"
>
  <span data-en="Pay-in &amp; Pay-out" data-zh="收付方式" data-tw="收付方式">收付方式</span>
</button>
<button
  type="button"
  role="tab"
  class="products-tab"
  :class="{ active: productTab === 'scenarios' }"
  :aria-selected="productTab === 'scenarios'"
  @click="setTab('scenarios')"
>
  <span data-en="Scenarios" data-zh="适配场景" data-tw="適配場景">适配场景</span>
</button>
</div>

<div class="products-acc">
<div
  v-for="(item, index) in products"
  :key="productTab + '-' + item.key"
  class="products-acc-item"
  :class="{ open: openProduct === index }"
>
<button
  class="products-acc-trigger"
  type="button"
  :aria-expanded="openProduct === index"
  @click="selectProduct(index)"
>
<span>{{ item.title }}</span>
<span class="products-acc-icon" aria-hidden="true">{{ openProduct === index ? '−' : '+' }}</span>
</button>
<div class="products-acc-body">
<div class="products-acc-panel">
<p v-if="item.subtitle" class="products-acc-sub">{{ item.subtitle }}</p>
<p>{{ item.desc }}</p>
<ul v-if="item.features?.length" class="products-acc-features">
<li v-for="(f, fi) in item.features" :key="fi">{{ f }}</li>
</ul>
</div>
</div>
</div>
</div>

<a class="btn btn-primary products-cta" :href="ctaHref">
<span data-en="Learn more →" data-zh="了解更多 →" data-tw="了解更多 →">了解更多 →</span>
</a>
</div>

<div class="products-media reveal">
<figure class="products-media-card">
<img
  class="products-media-img"
  src="/images/products-core.jpg"
  alt=""
  width="1280"
  height="853"
  loading="lazy"
  decoding="async"
/>
</figure>
</div>
</div>
</div>
</section>
<!-- ===== 为什么选择我们 ===== -->
<section class="section why-section">
<div class="container">
<div class="why-layout">
<div class="why-main reveal-group">
<div class="why-copy reveal">
<span class="why-kicker" data-en="Why Choose ADG PAY" data-zh="为什么选择 ADG PAY" data-tw="爲什麼選擇 ADG PAY">为什么选择 ADG PAY</span>
<h2 data-en="Focused on Cross-border Enterprises, We Understand Your Business" data-zh="专注跨境企业，更懂你的业务" data-tw="專注跨境企業，更懂你的業務">专注跨境企业，更懂你的业务</h2>
<p data-en="We turn compliance, transparency and localized service into cross-border pay-in/pay-out capabilities that cross-border enterprises can afford." data-zh="我们把合规、透明与本地化服务，做成跨境企业用得起的跨境收付能力。" data-tw="我們把合規、透明與本地化服務，做成跨境企業用得起的跨境收付能力。">我们把合规、透明与本地化服务，做成跨境企业用得起的跨境收付能力。</p>

<div class="why-license">
<strong class="why-license-title" data-en="Regulated Fund Services" data-zh="受监管的资金服务" data-tw="受監管的資金服務">受监管的资金服务</strong>
<p data-en="We hold a Money Service Operator licence issued by Hong Kong Customs (MSO), regulated for anti-money laundering and customer due diligence, providing institutional safeguards for client fund security." data-zh="我们持有香港海关发出的MSO牌照，在反洗黑钱与客户尽职审查方面受监管约束，为客户资金安全提供制度性保障。" data-tw="我們持有香港海關發出的MSO牌照，在反洗黑錢與客戶盡職審查方面受監管約束，爲客戶資金安全提供制度性保障。">我们持有香港海关发出的MSO牌照，在反洗黑钱与客户尽职审查方面受监管约束，为客户资金安全提供制度性保障。</p>

<div class="why-license-kv">
<div class="why-kv">
<span class="k" data-en="Regulatory Authority" data-zh="监管机构" data-tw="監管機構">监管机构</span>
<span class="v" data-en="Customs &amp; Excise Department" data-zh="香港海关" data-tw="香港海關">香港海关（Customs &amp; Excise Department）</span>
</div>
<div class="why-kv">
<span class="k" data-en="Scope of Services" data-zh="服务范围" data-tw="服務範圍">服务范围</span>
<span class="v" data-en="Currency Exchange / Remittance" data-zh="货币兑换 / 汇款" data-tw="貨幣兌換 / 匯款">货币兑换 / 汇款</span>
</div>
<div class="why-kv">
<span class="k" data-en="Fund Arrangement" data-zh="资金安排" data-tw="資金安排">资金安排</span>
<span class="v" data-en="Client Funds Segregated Custody" data-zh="客户资金隔离存放" data-tw="客戶資金隔離存放">客户资金隔离存放</span>
</div>
</div>
<a class="btn btn-primary btn-sm why-license-cta" data-en="View Licence Details" data-zh="查看资质详情" data-tw="查看資質詳情" href="/about#license">查看资质详情</a>
</div>
</div>
<div class="why-globe-wrap reveal">
<WhyGlobe />
</div>
</div>
<div class="why-metrics reveal-group">
<div class="why-metric reveal why-metric--a">
<strong data-en="Licensed &amp; Compliant" data-zh="持牌合规" data-tw="持牌合規">持牌合规</strong>
<span data-en="The Hong Kong MSO licence is supervised by Customs; regulated operations make funds more trustworthy." data-zh="香港 MSO 牌照受海关监管，经营受约束、资金更可信。" data-tw="香港 MSO 牌照受海關監管，經營受約束、資金更可信。">香港 MSO 牌照受海关监管，经营受约束、资金更可信。</span>
</div>
<div class="why-metric reveal why-metric--b">
<strong data-en="Transparent Fees" data-zh="费率透明" data-tw="費率透明">费率透明</strong>
<span data-en="No hidden fees — rates and FX are clearly disclosed before account opening." data-zh="无隐藏费用，费率与汇率在开户前清晰告知。" data-tw="無隱藏費用，費率與匯率在開戶前清晰告知。">无隐藏费用，费率与汇率在开户前清晰告知。</span>
</div>
<div class="why-metric reveal why-metric--c">
<strong data-en="Local Service" data-zh="本地服务" data-tw="本地服務">本地服务</strong>
<span data-en="Chinese / English support team following a unified process for clear, barrier-free communication." data-zh="中文 / English 支持团队，按统一流程跟进，沟通清晰无隔阂。" data-tw="中文 / English 支持團隊，按統一流程跟進，溝通清晰無隔閡。">中文 / English 支持团队，按统一流程跟进，沟通清晰无隔阂。</span>
</div>
<div class="why-metric reveal why-metric--d">
<strong data-en="Fast Response" data-zh="快速响应" data-tw="快速響應">快速响应</strong>
<span data-en="Short decision chains mean faster responses for onboarding and issue resolution." data-zh="决策链路短，开户与问题处理响应更快。" data-tw="決策鏈路短，開戶與問題處理響應更快。">决策链路短，开户与问题处理响应更快。</span>
</div>
</div>
</div>
</div>
</section>
<!-- ===== 如何开始 + CTA ===== -->
<section class="section start-section">
<div class="container">
<div class="start-head reveal">
<span class="products-kicker" data-en="Get Started in Four Steps" data-zh="四步开始" data-tw="四步開始">四步开始</span>
<h2 data-en="A Simple Onboarding &amp; Usage Flow" data-zh="开户与使用的简单流程" data-tw="開戶與使用的簡單流程">开户与使用的简单流程</h2>
<p data-en="Submit online, documents reviewed, and you can start collecting in as few as a few business days." data-zh="线上提交，资料审核，最快数个工作日内即可开始收款。" data-tw="線上提交，資料審核，最快數個工作日內即可開始收款。">线上提交，资料审核，最快数个工作日内即可开始收款。</p>
</div>
<div class="start-steps reveal-group" role="list">
<div class="start-step reveal" role="listitem">
<div class="start-step-inner">
<span class="start-step-n">1</span>
<div class="start-step-copy">
<h4 data-en="Submit Application" data-zh="提交申请" data-tw="提交申請">提交申请</h4>
<p data-en="Fill in company details online and select target currencies and services." data-zh="在线填写企业资料，选择目标币种与服务。" data-tw="在線填寫企業資料，選擇目標幣種與服務。">在线填写企业资料，选择目标币种与服务。</p>
</div>
</div>
</div>
<div class="start-step reveal" role="listitem">
<div class="start-step-inner">
<span class="start-step-n">2</span>
<div class="start-step-copy">
<h4 data-en="Verification" data-zh="资质审核" data-tw="資質審核">资质审核</h4>
<p data-en="Complete KYC and business due diligence; complete documents speed up review." data-zh="完成 KYC 与业务尽调，资料齐全审核更快。" data-tw="完成 KYC 與業務盡調，資料齊全審核更快。">完成 KYC 与业务尽调，资料齐全审核更快。</p>
</div>
</div>
</div>
<div class="start-step reveal" role="listitem">
<div class="start-step-inner">
<span class="start-step-n">3</span>
<div class="start-step-copy">
<h4 data-en="Account Opening" data-zh="开通账户" data-tw="開通賬戶">开通账户</h4>
<p data-en="Get multi-currency virtual accounts and immediately provide collection details to clients." data-zh="获取多币种虚拟账户，可立即向客户提供收款信息。" data-tw="獲取多幣種虛擬賬戶，可立即向客戶提供收款信息。">获取多币种虚拟账户，可立即向客户提供收款信息。</p>
</div>
</div>
</div>
<div class="start-step reveal" role="listitem">
<div class="start-step-inner">
<span class="start-step-n">4</span>
<div class="start-step-copy">
<h4 data-en="Collection &amp; Settlement" data-zh="收款结算" data-tw="收款結算">收款结算</h4>
<p data-en="Collect, hold or settle, with a dedicated manager assisting throughout." data-zh="收款、持有或结算，专属经理全程协助。" data-tw="收款、持有或結算，專屬經理全程協助。">收款、持有或结算，专属经理全程协助。</p>
</div>
</div>
</div>
</div>

<div class="start-cta reveal">
<div class="start-cta-copy">
<h2 data-en="Ready to Make Cross-border Collection Easier?" data-zh="准备好让跨境收款更省心了吗？" data-tw="準備好讓跨境收款更省心了嗎？">准备好让跨境收款更省心了吗？</h2>
<p data-en="Talk to our local team to get a compliant payment solution tailored to your business." data-zh="与我们的本地团队聊聊，获取适合你业务的合规支付方案。" data-tw="與我們的本地團隊聊聊，獲取適合你業務的合規支付方案。">与我们的本地团队聊聊，获取适合你业务的合规支付方案。</p>
</div>
<div class="start-cta-actions">
<a class="btn btn-primary btn-lg" data-en="Free Consultation" data-zh="免费咨询" data-tw="免費諮詢" href="/contact">免费咨询</a>
<a class="btn btn-outline btn-lg" data-en="FAQ" data-zh="常见问题" data-tw="常見問題" href="/faq">常见问题</a>
</div>
</div>
</div>
</section>
</div>
</template>
