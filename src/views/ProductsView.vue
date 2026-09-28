<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useProductTabs } from '@/composables/useInteractions'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useLocaleStore } from '@/stores/locale'

const root = ref(null)
const workflowEl = ref(null)
const flowTrack = ref(null)
const flowInview = ref(false)
useProductTabs(root)
useScrollReveal(root)

const locale = useLocaleStore()
function t(zh, en, tw) {
  return locale.t(zh, en, tw)
}

const flowSteps = [
  {
    key: 'open',
    titleZh: '开通账户',
    titleTw: '開通賬戶',
    titleEn: 'Account Opening',
    descZh: '提交资料并完成 KYC 审核',
    descTw: '提交資料並完成 KYC 審核',
    descEn: 'Submit documents and complete KYC review',
  },
  {
    key: 'collect',
    titleZh: '收款',
    titleTw: '收款',
    titleEn: 'Collection',
    descZh: '本地收款、电汇与订阅收款，覆盖主要进账场景',
    descTw: '本地收款、電匯與訂閱收款，覆蓋主要進賬場景',
    descEn: 'Local, wire and subscription collection for major inbound scenarios',
  },
  {
    key: 'hold',
    titleZh: '持有',
    titleTw: '持有',
    titleEn: 'Holding',
    descZh: '多币种余额管理，按需持有结算币种',
    descTw: '多幣種餘額管理，按需持有結算幣種',
    descEn: 'Multi-currency balances, hold settlement currencies on demand',
  },
  {
    key: 'fx',
    titleZh: '币种兑换',
    titleTw: '幣種兌換',
    titleEn: 'Currency Exchange',
    descZh: '将余额兑换为所需结算币种',
    descTw: '將餘額兌換為所需結算幣種',
    descEn: 'Exchange balances into the required settlement currency',
  },
  {
    key: 'pay',
    titleZh: '付款',
    titleTw: '付款',
    titleEn: 'Payment',
    descZh: '供应商与批量付款，流程留痕可审计',
    descTw: '供應商與批量付款，流程留痕可審計',
    descEn: 'Supplier and batch payments with audit-ready records',
  },
]

const flowIndex = ref(0)
const flowLast = computed(() => flowSteps.length - 1)

function flowCardStep() {
  const track = flowTrack.value
  if (!track) return 0
  const card = track.querySelector('.flow-card')
  if (!card) return 0
  const styles = getComputedStyle(track)
  const gap = parseFloat(styles.columnGap || styles.gap) || 20
  return card.getBoundingClientRect().width + gap
}

function updateFlowPages() {
  syncFlowIndex()
}

function syncFlowIndex() {
  const track = flowTrack.value
  const step = flowCardStep()
  if (!track || !step) return
  flowIndex.value = Math.min(flowLast.value, Math.max(0, Math.round(track.scrollLeft / step)))
}

function stepFlow(dir) {
  goFlow(flowIndex.value + dir)
}

function goFlow(i) {
  const track = flowTrack.value
  const step = flowCardStep()
  const next = Math.min(flowLast.value, Math.max(0, i))
  flowIndex.value = next
  if (!track || !step) return
  track.scrollTo({ left: next * step, behavior: 'smooth' })
}

function onFlowScroll() {
  syncFlowIndex()
}

function onWorkflowKey(e) {
  if (!workflowEl.value) return
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    stepFlow(1)
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    stepFlow(-1)
  }
}

let flowObserver = null

onMounted(async () => {
  await nextTick()
  updateFlowPages()
  flowTrack.value?.addEventListener('scroll', onFlowScroll, { passive: true })
  workflowEl.value?.addEventListener('keydown', onWorkflowKey)
  window.addEventListener('resize', updateFlowPages)
  if (workflowEl.value) {
    flowObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        flowInview.value = true
        flowObserver?.disconnect()
        flowObserver = null
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )
    flowObserver.observe(workflowEl.value)
  }
})

onBeforeUnmount(() => {
  flowTrack.value?.removeEventListener('scroll', onFlowScroll)
  workflowEl.value?.removeEventListener('keydown', onWorkflowKey)
  window.removeEventListener('resize', updateFlowPages)
  flowObserver?.disconnect()
})
</script>

<template>
<div ref="root">
<section class="hero hero-page">
<div class="container">
<div class="hero-page-layout">
<div class="hero-page-copy reveal-group">
<span class="hero-page-kicker reveal" data-en="Hong Kong MSO Licensed Institution" data-zh="香港 MSO持牌机构" data-tw="香港 MSO持牌機構">香港 MSO持牌机构</span>
<h1 class="reveal" data-en="Products &amp; Solutions" data-zh="产品与解决方案" data-tw="產品與解決方案">产品与解决方案</h1>
<p class="lead reveal" data-en="From collection to settlement, covering the core fund flows of cross-border business. Choose the solution that fits your industry scenario." data-zh="从收款到结算，覆盖跨境业务的核心资金环节。按行业场景选择适合你的方案。" data-tw="從收款到結算，覆蓋跨境業務的核心資金環節。按行業場景選擇適合你的方案。">从收款到结算，覆盖跨境业务的核心资金环节。按行业场景选择适合你的方案。</p>
<a class="btn btn-primary btn-lg reveal" data-en="Get a Quote" data-zh="免费咨询" data-tw="免費諮詢" href="/contact">免费咨询</a>
</div>
<div class="hero-page-media">
<figure class="hero-page-figure">
<img
  class="hero-page-img"
  src="/images/products-hero.jpg"
  alt=""
  width="960"
  height="720"
  loading="eager"
  decoding="async"
/>
</figure>
</div>
</div>
</div>
</section>
<!-- ===== 按行业筛选 ===== -->
<section class="section scenario-section">
<div class="container">
<div class="scenario-head">
<span class="scenario-kicker" data-en="By Industry Scenario" data-zh="按行业场景" data-tw="按行業場景">按行业场景</span>
<h2 data-en="Choose the Right Solution for You" data-zh="选择适合你的方案" data-tw="選擇適合你的方案">选择适合你的方案</h2>
<p data-en="Different industries face different collection and settlement pain points, so we organize our product portfolio accordingly." data-zh="不同行业的收款与结算痛点不同，我们据此组织产品组合。" data-tw="不同行業的收款與結算痛點不同，我們據此組織產品組合。">不同行业的收款与结算痛点不同，我们据此组织产品组合。</p>
</div>
<div class="scenario-layout">
<div class="scenario-tabs tabs" role="tablist" aria-label="行业场景">
<button class="tab active" data-en="Cross-border E-commerce" data-tab="ecom" data-zh="跨境电商" data-tw="跨境電商" type="button">跨境电商</button>
<button class="tab" data-en="Cross-border Trade / Export" data-tab="trade" data-zh="外贸出口" data-tw="外貿出口" type="button">外贸出口</button>
<button class="tab" data-en="SaaS / Software" data-tab="saas" data-zh="软件服务" data-tw="軟件服務" type="button">SaaS / 软件</button>
<button class="tab" data-en="All Capabilities" data-tab="all" data-zh="全部能力" data-tw="全部能力" type="button">全部能力</button>
</div>
<div class="scenario-panels">
<!-- 跨境电商 -->
<div class="panel panel-grid active" data-panel="ecom">
<article class="scenario-card">
<div class="scenario-card-icon" aria-hidden="true"><svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M3 7h18v10H3z"/><path d="M3 11h18"/><path d="M7 15h4"/></svg></div>
<span class="scenario-card-tag" data-en="Local Collection" data-zh="本地收款" data-tw="本地收款">本地收款</span>
<h3 data-en="Platform Local Collection Account" data-zh="平台本地收款账户" data-tw="平臺本地收款賬戶">平台本地收款账户</h3>
<p data-en="Provide local-currency collection accounts for stores; buyers pay locally, reducing intermediary steps." data-zh="为店铺提供本地币种收款账户，买家以本地方式付款，减少中转环节。" data-tw="爲店鋪提供本地幣種收款賬戶，買家以本地方式付款，減少中轉環節。">为店铺提供本地币种收款账户，买家以本地方式付款，减少中转环节。</p>
<ul class="feature-list">
<li><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg><span data-en="Multi-store Fund Aggregation" data-zh="多店铺资金归集" data-tw="多店鋪資金歸集">多店铺资金归集</span></li>
<li><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg><span data-en="Traceable Payouts" data-zh="回款可追踪" data-tw="回款可追蹤">回款可追踪</span></li>
</ul>
</article>
<article class="scenario-card">
<div class="scenario-card-icon" aria-hidden="true"><svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 010 18"/></svg></div>
<span class="scenario-card-tag" data-en="Settlement" data-zh="结算" data-tw="結算">结算</span>
<h3 data-en="Multi-currency Hold &amp; Settlement" data-zh="多币种持有与结算" data-tw="多幣種持有與結算">多币种持有与结算</h3>
<p data-en="Choose settlement timing to your business rhythm, reducing unnecessary FX loss." data-zh="按业务节奏选择结算时点，减少不必要的换汇损耗。" data-tw="按業務節奏選擇結算時點，減少不必要的換匯損耗。">按业务节奏选择结算时点，减少不必要的换汇损耗。</p>
<ul class="feature-list">
<li><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg><span data-en="Exchange on Demand" data-zh="按需换汇" data-tw="按需換匯">按需换汇</span></li>
<li><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg><span data-en="Transparent Fees" data-zh="费率透明" data-tw="費率透明">费率透明</span></li>
</ul>
</article>
<article class="scenario-card">
<div class="scenario-card-icon" aria-hidden="true"><svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M3 3h18v18H3z"/><path d="M3 9h18M9 21V9"/></svg></div>
<span class="scenario-card-tag" data-en="Reconciliation" data-zh="对账" data-tw="對賬">对账</span>
<h3 data-en="Automated Reconciliation" data-zh="自动对账" data-tw="自動對賬">自动对账</h3>
<p data-en="Clear, exportable statements lighten the finance reconciliation burden." data-zh="流水清晰可导出，减轻财务对账负担。" data-tw="流水清晰可導出，減輕財務對賬負擔。">流水清晰可导出，减轻财务对账负担。</p>
<ul class="feature-list">
<li><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg><span data-en="Exportable Details" data-zh="明细可导出" data-tw="明細可導出">明细可导出</span></li>
<li><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg><span data-en="Multi-account View" data-zh="多账户视图" data-tw="多賬戶視圖">多账户视图</span></li>
</ul>
</article>
</div>
<!-- 外贸出口 -->
<div class="panel panel-grid" data-panel="trade">
<article class="scenario-card" id="receive">
<div class="scenario-card-icon" aria-hidden="true"><svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 3v12"/><path d="M8 11l4 4 4-4"/><path d="M4 19h16"/></svg></div>
<span class="scenario-card-tag" data-en="Collection" data-zh="收款" data-tw="收款">收款</span>
<h3 data-en="Wire Collection" data-zh="电汇收款" data-tw="電匯收款">电汇收款</h3>
<p data-en="Cross-border wire collection from overseas buyers, with clear collection details and traceable records." data-zh="面向海外买家的跨境电汇收款，提供清晰收款信息，流水留痕。" data-tw="面向海外買家的跨境電匯收款，提供清晰收款信息，流水留痕。">面向海外买家的跨境电汇收款，提供清晰收款信息，流水留痕。</p>
<ul class="feature-list">
<li><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg><span data-en="Multi-currency Credit" data-zh="多币种入账" data-tw="多幣種入賬">多币种入账</span></li>
<li><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg><span data-en="Arrival Notification" data-zh="到账通知" data-tw="到賬通知">到账通知</span></li>
</ul>
</article>
<article class="scenario-card" id="pay">
<div class="scenario-card-icon" aria-hidden="true"><svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M4 12h14"/><path d="M13 7l5 5-5 5"/></svg></div>
<span class="scenario-card-tag" data-en="Payment" data-zh="付款" data-tw="付款">付款</span>
<h3 data-en="Batch Supplier Payments" data-zh="供应商批量付款" data-tw="供應商批量付款">供应商批量付款</h3>
<p data-en="Batch payments to overseas suppliers with compliant processes, complete documents and easy audit." data-zh="向海外供应商批量付款，流程合规、单据齐全、便于审计。" data-tw="向海外供應商批量付款，流程合規、單據齊全、便於審計。">向海外供应商批量付款，流程合规、单据齐全、便于审计。</p>
<ul class="feature-list">
<li><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg><span data-en="Batch Processing" data-zh="批量处理" data-tw="批量處理">批量处理</span></li>
<li><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg><span data-en="Traceable Payments" data-zh="付款留痕" data-tw="付款留痕">付款留痕</span></li>
</ul>
</article>
<article class="scenario-card">
<div class="scenario-card-icon" aria-hidden="true"><svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 3l8 4v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z"/><path d="M9 12l2 2 4-4"/></svg></div>
<span class="scenario-card-tag" data-en="Compliance" data-zh="合规" data-tw="合規">合规</span>
<h3 data-en="Trade Background Review" data-zh="贸易背景审核" data-tw="貿易背景審核">贸易背景审核</h3>
<p data-en="Verify trade authenticity per regulatory requirements to ensure compliant fund flows." data-zh="依据监管要求完成贸易真实性核验，保障资金合规流动。" data-tw="依據監管要求完成貿易真實性核驗，保障資金合規流動。">依据监管要求完成贸易真实性核验，保障资金合规流动。</p>
<ul class="feature-list">
<li><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg><span data-en="KYC / Due Diligence" data-zh="KYC / 业务尽调" data-tw="KYC / 業務盡調">KYC / 尽调</span></li>
<li><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg><span data-en="Risk Monitoring" data-zh="风控监控" data-tw="風控監控">风控监控</span></li>
</ul>
</article>
</div>
<!-- SaaS -->
<div class="panel panel-grid" data-panel="saas">
<article class="scenario-card">
<div class="scenario-card-icon" aria-hidden="true"><svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M8 15h3"/></svg></div>
<span class="scenario-card-tag" data-en="Subscription" data-zh="订阅" data-tw="訂閱">订阅</span>
<h3 data-en="Global Subscription Collection" data-zh="全球订阅收款" data-tw="全球訂閱收款">全球订阅收款</h3>
<p data-en="Let global users pay locally, with funds unified into multi-currency accounts." data-zh="支持全球用户以本地方式付费，资金统一归集到多币种账户。" data-tw="支持全球用戶以本地方式付費，資金統一歸集到多幣種賬戶。">支持全球用户以本地方式付费，资金统一归集到多币种账户。</p>
<ul class="feature-list">
<li><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg><span data-en="Local Collection Experience" data-zh="本地收款体验" data-tw="本地收款體驗">本地收款体验</span></li>
<li><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg><span data-en="Unified Aggregation" data-zh="统一归集" data-tw="統一歸集">统一归集</span></li>
</ul>
</article>
<article class="scenario-card" id="va">
<div class="scenario-card-icon" aria-hidden="true"><svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><path d="M8 15h8"/></svg></div>
<span class="scenario-card-tag" data-en="Account" data-zh="账户" data-tw="賬戶">账户</span>
<h3 data-en="Virtual Account Splitting" data-zh="虚拟账户分账" data-tw="虛擬賬戶分賬">虚拟账户分账</h3>
<p data-en="Open virtual accounts by product or region for clear revenue visibility and easy split accounting." data-zh="按产品或区域开立虚拟账户，收入一目了然，便于分账核算。" data-tw="按產品或區域開立虛擬賬戶，收入一目了然，便於分賬核算。">按产品或区域开立虚拟账户，收入一目了然，便于分账核算。</p>
<ul class="feature-list">
<li><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg><span data-en="Multi-account Management" data-zh="多账户管理" data-tw="多賬戶管理">多账户管理</span></li>
<li><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg><span data-en="Clear Split Accounting" data-zh="清晰分账" data-tw="清晰分賬">清晰分账</span></li>
</ul>
</article>
<article class="scenario-card">
<div class="scenario-card-icon" aria-hidden="true"><svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/></svg></div>
<span class="scenario-card-tag" data-en="Settlement" data-zh="结算" data-tw="結算">结算</span>
<h3 data-en="Multi-currency Settlement" data-zh="多币种结算" data-tw="多幣種結算">多币种结算</h3>
<p data-en="Hold subscription income and settle to local currency on demand, smoothing FX volatility." data-zh="持有订阅收入，按需结算为本币，平滑汇率波动。" data-tw="持有訂閱收入，按需結算爲本幣，平滑匯率波動。">持有订阅收入，按需结算为本币，平滑汇率波动。</p>
<ul class="feature-list">
<li><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg><span data-en="Settle on Demand" data-zh="按需结算" data-tw="按需結算">按需结算</span></li>
<li><svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10"/></svg><span data-en="Transparent FX Rates" data-zh="汇率透明" data-tw="匯率透明">汇率透明</span></li>
</ul>
</article>
</div>
<!-- 全部能力 -->
<div class="panel panel-grid" data-panel="all">
<article class="scenario-card scenario-card-compact">
<div class="scenario-card-icon" aria-hidden="true"><svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M3 7h18v10H3z"/><path d="M3 11h18"/></svg></div>
<h3 data-en="Cross-border Collection" data-zh="跨境收款" data-tw="跨境收款" id="settle">跨境收款</h3>
<p data-en="Local-currency collection accounts reduce intermediaries and FX loss." data-zh="本地币种收款账户，减少中转与汇损。" data-tw="本地幣種收款賬戶，減少中轉與匯損。">本地币种收款账户，减少中转与汇损。</p>
</article>
<article class="scenario-card scenario-card-compact">
<div class="scenario-card-icon" aria-hidden="true"><svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/></svg></div>
<h3 data-en="Multi-currency Settlement" data-zh="多币种结算" data-tw="多幣種結算">多币种结算</h3>
<p data-en="Hold and settle multiple currencies, flexibly timing your exchange." data-zh="持有与结算多币种，灵活把握换汇时点。" data-tw="持有與結算多幣種，靈活把握換匯時點。">持有与结算多币种，灵活把握换汇时点。</p>
</article>
<article class="scenario-card scenario-card-compact">
<div class="scenario-card-icon" aria-hidden="true"><svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect height="13" rx="2" width="18" x="3" y="6"/><path d="M3 10h18"/></svg></div>
<h3 data-en="Virtual Accounts" data-zh="虚拟账户" data-tw="虛擬賬戶">虚拟账户</h3>
<p data-en="Independent virtual accounts keep funds clearly separable." data-zh="独立虚拟账户，资金清晰可分。" data-tw="獨立虛擬賬戶，資金清晰可分。">独立虚拟账户，资金清晰可分。</p>
</article>
<article class="scenario-card scenario-card-compact">
<div class="scenario-card-icon" aria-hidden="true"><svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M4 12h14"/><path d="M13 7l5 5-5 5"/></svg></div>
<h3 data-en="Supplier Payments" data-zh="供应商付款" data-tw="供應商付款">供应商付款</h3>
<p data-en="Multi-currency batch payments, compliant and traceable." data-zh="多币种批量付款，合规可查。" data-tw="多幣種批量付款，合規可查。">多币种批量付款，合规可查。</p>
</article>
<article class="scenario-card scenario-card-compact">
<div class="scenario-card-icon" aria-hidden="true"><svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20"/></svg></div>
<h3 data-en="Currency Exchange" data-zh="货币兑换" data-tw="貨幣兌換">货币兑换</h3>
<p data-en="Currency exchange services within licence scope." data-zh="牌照范围内的货币兑换服务。" data-tw="牌照範圍內的貨幣兌換服務。">牌照范围内的货币兑换服务。</p>
</article>
<article class="scenario-card scenario-card-compact">
<div class="scenario-card-icon" aria-hidden="true"><svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M3 3h18v18H3z"/><path d="M3 9h18M9 21V9"/></svg></div>
<h3 data-en="Reconciliation &amp; Reporting" data-zh="对账与报表" data-tw="對賬與報表">对账与报表</h3>
<p data-en="Statement export and detail lookup facilitate financial accounting." data-zh="流水导出、明细可查，便于财务核算。" data-tw="流水導出、明細可查，便於財務核算。">流水导出、明细可查，便于财务核算。</p>
</article>
</div>
</div>
</div>
</div>
</section>
<!-- ===== 业务流转 + 能力总览 ===== -->
<section
  class="section flow-slide-section"
  id="workflow"
  ref="workflowEl"
  tabindex="0"
  :class="{ 'flow-inview': flowInview }"
  :aria-label="t('资金链路步骤', 'Fund chain steps', '資金鏈路步驟')"
>
<div class="container">
<div class="flow-slide-head">
<span class="flow-slide-kicker" data-en="How It Works · Capabilities" data-zh="业务流转 · 能力总览" data-tw="業務流轉 · 能力總覽">业务流转 · 能力总览</span>
<h2 data-en="From account opening to fund settlement, one clear fund chain" data-zh="从开户到资金结算，一条清晰的资金链路" data-tw="從開戶到資金結算，一條清晰的資金鍊路">从开户到资金结算，一条清晰的资金链路</h2>
<p data-en="Around the core of cross-border pay-in/out, ADG PAY provides coherent services from collection and holding to payment settlement — one account suite covering major fund flows." data-zh="围绕跨境收付的核心环节，ADG PAY 为企业提供从收款、持币到付款结算的连贯服务；一套账户，覆盖主要资金环节。" data-tw="圍繞跨境收付的核心環節，ADG PAY 爲企業提供從收款、持幣到付款結算的連貫服務；一套賬戶，覆蓋主要資金環節。">围绕跨境收付的核心环节，ADG PAY 为企业提供从收款、持币到付款结算的连贯服务；一套账户，覆盖主要资金环节。</p>
</div>

<div class="flow-slide">
<button
  class="flow-slide-nav"
  type="button"
  :aria-label="t('上一步', 'Previous', '上一步')"
  :disabled="flowIndex === 0"
  @click="stepFlow(-1)"
>
<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>
</button>

<div class="flow-slide-viewport">
<div class="flow-slide-track" ref="flowTrack">
<article
  v-for="(step, i) in flowSteps"
  :key="step.key"
  class="flow-card"
  :class="{ active: flowIndex === i }"
  role="button"
  tabindex="0"
  :aria-current="flowIndex === i ? 'true' : undefined"
  @click="goFlow(i)"
  @keydown.enter.prevent="goFlow(i)"
>
  <div class="flow-card-icon" aria-hidden="true">
    <svg v-if="step.key === 'open'" viewBox="0 0 64 64" fill="none"><rect x="12" y="10" width="40" height="44" rx="6" fill="#FFF5F4" stroke="#E1251B" stroke-width="2"/><path d="M22 24h20M22 32h16M22 40h12" stroke="#E1251B" stroke-width="2" stroke-linecap="round"/><circle cx="44" cy="46" r="8" fill="#E1251B"/><path d="M41 46l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <svg v-else-if="step.key === 'collect'" viewBox="0 0 64 64" fill="none"><rect x="8" y="18" width="48" height="30" rx="6" fill="#FFF5F4" stroke="#E1251B" stroke-width="2"/><path d="M8 28h48" stroke="#E1251B" stroke-width="2"/><circle cx="20" cy="40" r="3" fill="#E1251B"/><path d="M32 14v8M28 18h8" stroke="#F04438" stroke-width="2" stroke-linecap="round"/><path d="M38 38h12" stroke="#E1251B" stroke-width="2" stroke-linecap="round"/></svg>
    <svg v-else-if="step.key === 'hold'" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="20" fill="#FFF5F4" stroke="#E1251B" stroke-width="2"/><path d="M32 18v28M18 32h28" stroke="#E1251B" stroke-width="2" stroke-linecap="round"/><path d="M24 24c4-4 12-4 16 0M24 40c4 4 12 4 16 0" stroke="#F04438" stroke-width="2" stroke-linecap="round"/></svg>
    <svg v-else-if="step.key === 'fx'" viewBox="0 0 64 64" fill="none"><path d="M18 38c0-10 6-18 14-18s14 8 14 18" fill="#FFF5F4" stroke="#E1251B" stroke-width="2"/><circle cx="32" cy="24" r="8" fill="#fff" stroke="#E1251B" stroke-width="2"/><path d="M22 46h20" stroke="#E1251B" stroke-width="2" stroke-linecap="round"/><path d="M26 52h12" stroke="#F04438" stroke-width="2" stroke-linecap="round"/><path d="M40 20l8-6M44 28l10 2" stroke="#F04438" stroke-width="2" stroke-linecap="round"/></svg>
    <svg v-else viewBox="0 0 64 64" fill="none"><rect x="10" y="20" width="34" height="24" rx="5" fill="#FFF5F4" stroke="#E1251B" stroke-width="2"/><path d="M44 28h8l4 6v10h-12V28z" fill="#fff" stroke="#E1251B" stroke-width="2"/><path d="M18 32h14M18 38h10" stroke="#E1251B" stroke-width="2" stroke-linecap="round"/><path d="M48 40h4" stroke="#F04438" stroke-width="2" stroke-linecap="round"/></svg>
  </div>
  <strong>{{ t(step.titleZh, step.titleEn, step.titleTw) }}</strong>
  <p>{{ t(step.descZh, step.descEn, step.descTw) }}</p>
</article>
</div>
</div>

<button
  class="flow-slide-nav"
  type="button"
  :aria-label="t('下一步', 'Next', '下一步')"
  :disabled="flowIndex >= flowLast"
  @click="stepFlow(1)"
>
<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
</button>
</div>

<div class="flow-slide-dots" role="tablist" :aria-label="t('资金链路步骤', 'Fund chain steps', '資金鏈路步驟')">
<button
  v-for="(step, i) in flowSteps"
  :key="step.key"
  type="button"
  class="flow-slide-dot"
  :class="{ active: flowIndex === i }"
  :aria-label="t(step.titleZh, step.titleEn, step.titleTw)"
  :aria-current="flowIndex === i ? 'true' : undefined"
  @click="goFlow(i)"
></button>
</div>
</div>
</section>
<!-- ===== 客户方案匹配 / 好评引导 ===== -->
<section class="section quote-section" id="match">
<div class="container">
<div class="quote-head">
<span class="quote-kicker" data-en="Customer Stories" data-zh="客户好评" data-tw="客戶好評">客户好评</span>
<h2 data-en="Not sure which solution fits you?" data-zh="不确定哪套方案适合你？" data-tw="不確定哪套方案適合你？">不确定哪套方案适合你？</h2>
<p data-en="Tell us about your business and collection scenario, and our local team will match one for you." data-zh="告诉我们你的业务与收款场景，由本地团队为你匹配。" data-tw="告訴我們你的業務與收款場景，由本地團隊爲你匹配。">告诉我们你的业务与收款场景，由本地团队为你匹配。</p>
</div>

<div class="quote-trust" aria-hidden="true">
<span data-en="Cross-border E-commerce" data-zh="跨境电商" data-tw="跨境電商">跨境电商</span>
<span data-en="Trade Export" data-zh="外贸出口" data-tw="外貿出口">外贸出口</span>
<span data-en="SaaS" data-zh="SaaS / 软件" data-tw="SaaS / 軟件">SaaS / 软件</span>
<span data-en="MSO Licensed" data-zh="MSO 持牌" data-tw="MSO 持牌">MSO 持牌</span>
<span data-en="Transparent Fees" data-zh="费率透明" data-tw="費率透明">费率透明</span>
<span data-en="Local Team" data-zh="本地团队" data-tw="本地團隊">本地团队</span>
</div>

<div class="quote-actions">
<a class="btn btn-primary btn-lg" data-en="Contact an Advisor" data-zh="联系顾问" data-tw="聯繫顧問" href="/contact">联系顾问</a>
</div>
</div>
</section>
</div>
</template>
