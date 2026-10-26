<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductTabs } from '@/composables/useInteractions'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useLocaleStore } from '@/stores/locale'

const root = ref(null)
const workflowEl = ref(null)
const flowInview = ref(false)
const route = useRoute()
const { active: activeSolution, setTab } = useProductTabs(root)
const activeService = ref('collect')
useScrollReveal(root)

const productHashes = {
  '#b2b': 'b2b',
  '#digital': 'digital',
  '#family': 'family',
  '#trade': 'b2b',
  '#saas': 'digital',
  '#ecom': 'b2b',
}

const serviceHashes = {
  '#collect': 'collect',
  '#pay': 'pay',
  '#fx': 'fx',
}

function setService(key, { scroll = false } = {}) {
  if (!key) return
  activeService.value = key
  if (!scroll || !root.value) return
  root.value.querySelector('#services')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function activateProductHash(hash = route.hash) {
  const solutionTab = productHashes[hash]
  if (solutionTab) {
    setTab(solutionTab, { scroll: true })
    return
  }
  const serviceTab = serviceHashes[hash]
  if (serviceTab) {
    setService(serviceTab, { scroll: true })
  }
}

const locale = useLocaleStore()
function t(zh, en, tw) {
  return locale.t(zh, en, tw)
}

const productsHeroSrc = `${import.meta.env.BASE_URL}images/products-hero.jpg`
const productsHeroWebp = `${import.meta.env.BASE_URL}images/products-hero.webp`
const imgBase = `${import.meta.env.BASE_URL}images/`

/** 服务与渠道（左侧导航 + 单块内容） */
const serviceChannelCards = [
  {
    key: 'collect',
    image: 'global-business.jpg',
    titleZh: '全球收款',
    titleTw: '全球收款',
    titleEn: 'Global Collection',
    subtitleZh: '全球账户，多币种收款',
    subtitleTw: '全球賬戶，多幣種收款',
    subtitleEn: 'Local accounts, multi-currency collection',
    textZh:
      '面向跨境企业，在主要市场提供本地账户与多币种收款，支持多种贸易模式下的资金流入，全球收付加速，资金在同一平台合规管理',
    textTw:
      '面向跨境企業，在主要市場提供本地賬戶與多幣種收款，支持多種貿易模式下的資金流入，全球收付加速，資金在同一平臺合規管理',
    textEn:
      'Local accounts and multi-currency collection in key markets—supporting inflows across trade models, faster global settlement, and compliant fund management on one platform.',
  },
  {
    key: 'pay',
    image: 'intl-payment.jpg',
    titleZh: '国际付款',
    titleTw: '國際付款',
    titleEn: 'International Payouts',
    subtitleZh: '智能路由，静默直达',
    subtitleTw: '智能路由，靜默直達',
    subtitleEn: 'Intelligent routing, seamless delivery',
    textZh:
      '基于付款需求，跨渠道拆分支付指令，利用银行间最优路径降低手续费，避免大额资金被单一机构风控延误。付款进度由专属管家主动同步，无需登录多个网银。资金走到哪里，我们比您更先知道。',
    textTw:
      '基於付款需求，跨渠道拆分支付指令，利用銀行間最優路徑降低手續費，避免大額資金被單一機構風控延誤。付款進度由專屬管家主動同步，無需登錄多個網銀。資金走到哪裏，我們比您更先知道。',
    textEn:
      'We split payout instructions across corridors along optimal interbank paths to reduce fees and avoid single-institution risk delays. Your dedicated relationship manager proactively syncs progress—no juggling multiple bank portals. We know where funds are before you ask.',
  },
  {
    key: 'fx',
    image: 'fx-currency.jpg',
    titleZh: '灵活换汇',
    titleTw: '靈活換匯',
    titleEn: 'Flexible FX',
    subtitleZh: '7×24 在线换汇，实时报价',
    subtitleTw: '7×24 在線換匯，實時報價',
    subtitleEn: '24/7 online FX with live rates',
    textZh:
      '主流币种 7×24 在线换汇，一键操作、实时报价、聚合多家持牌机构汇率、全流程风控，让企业跨境兑换更便捷、更透明、更安全。',
    textTw:
      '主流幣種 7×24 在線換匯，一鍵操作、實時報價、聚合多家持牌機構匯率、全流程風控，讓企業跨境兌換更便捷、更透明、更安全。',
    textEn:
      '24/7 FX in major currencies—one-click execution, live quotes, aggregated rates from licensed institutions, and end-to-end risk controls for clearer, more secure corporate conversion.',
  },
]

function serviceImageSrc(card) {
  return `${imgBase}${card.image}`
}
function serviceImageWebp(card) {
  return card.imageWebp ? `${imgBase}${card.imageWebp}` : ''
}
/** 解决方案：按业务形态定制（左标题区 + 右清单） */
const solutionCards = [
  {
    key: 'b2b',
    titleZh: '外贸 B2B 供应链企业',
    titleTw: '外貿 B2B 供應鏈企業',
    titleEn: 'B2B Trade & Supply Chain',
    leadZh: '面向大额贸易货款收付场景，以时效与汇率成本可控为核心，保障供应链资金不断链。',
    leadTw: '面向大額貿易貨款收付場景，以時效與匯率成本可控為核心，保障供應鏈資金不斷鏈。',
    leadEn: 'Built for large trade pay-ins and payouts—keeping settlement speed and FX costs under control so supply-chain liquidity stays intact.',
    sceneItems: [
      { zh: '大额贸易货款收付', tw: '大額貿易貨款收付', en: 'Large-value trade collection and payouts' },
      { zh: '对到账时效与汇率成本极其敏感', tw: '對到賬時效與匯率成本極其敏感', en: 'Highly sensitive to settlement timing and FX cost' },
    ],
    offerItems: [
      { zh: 'TT 收款专户', tw: 'TT 收款專戶', en: 'Dedicated TT collection accounts' },
      { zh: '大额付款走专设绿通', tw: '大額付款走專設綠通', en: 'Priority processing for large payouts' },
      { zh: '避免银行合规反复问询', tw: '避免銀行合規反復問詢', en: 'Fewer repeated bank compliance queries' },
      { zh: '保障供应链资金不断链', tw: '保障供應鏈資金不斷鏈', en: 'Continuous supply-chain liquidity' },
    ],
  },
  {
    key: 'digital',
    titleZh: '服务贸易与数字企业',
    titleTw: '服務貿易與數字企業',
    titleEn: 'Services Trade & Digital Businesses',
    leadZh: '针对软件服务、咨询费、版权金等无形贸易收款，匹配理解行业的持牌通道，收款更稳、合规更顺。',
    leadTw: '針對軟件服務、諮詢費、版權金等無形貿易收款，匹配理解行業的持牌通道，收款更穩、合規更順。',
    leadEn: 'For intangible receipts—software, consulting and royalties—matched to licensed corridors that understand the sector, for more stable and compliant collection.',
    sceneItems: [
      { zh: '软件服务、咨询费、版权金等无形贸易收款', tw: '軟件服務、諮詢費、版權金等無形貿易收款', en: 'Intangible receipts: software, consulting, royalties' },
      { zh: '易被传统银行拒收或反复核查', tw: '易被傳統銀行拒收或反復核查', en: 'Often declined or repeatedly reviewed by traditional banks' },
    ],
    offerItems: [
      { zh: '匹配理解该行业的特选 MSO 或银行渠道', tw: '匹配理解該行業的特選 MSO 或銀行渠道', en: 'Curated MSO and bank partners that understand the sector' },
      { zh: '确保收款稳定合规', tw: '確保收款穩定合規', en: 'Stable, compliant collection' },
      { zh: '支持支付海外人员薪酬', tw: '支持支付海外人員薪酬', en: 'Support for overseas payroll' },
    ],
  },
  {
    key: 'family',
    titleZh: '投资控股与家族办公室',
    titleTw: '投資控股與家族辦公室',
    titleEn: 'Investment Holding & Family Offices',
    leadZh: '服务资本项下资金调度，以授权可控为前提，构建定制化账户与渠道体系。',
    leadTw: '服務資本項下資金調度，以授權可控為前提，構建定制化賬戶與渠道體系。',
    leadEn: 'Capital-account fund movements under strict authorisation—custom accounts and payment corridors built around your controls.',
    sceneItems: [
      { zh: '资本项下资金调度', tw: '資本項下資金調度', en: 'Capital-account fund movements' },
      { zh: '授权与信息管控要求高', tw: '授權與信息管控要求高', en: 'High standards for authorisation and information control' },
    ],
    offerItems: [
      { zh: '完全定制化的渠道组合', tw: '完全定制化的渠道組合', en: 'Fully customised corridor mix' },
      { zh: '多层级账户体系', tw: '多層級賬戶體系', en: 'Multi-tier account structures' },
      { zh: '专人专办全程跟进', tw: '專人專辦全程跟進', en: 'Dedicated handling end to end' },
      { zh: '操作记录严格在授权范围内流转', tw: '操作記錄嚴格在授權範圍內流轉', en: 'Activity stays strictly within authorised scope' },
    ],
  },
]

function solutionItemText(item) {
  return t(item.zh, item.en, item.tw)
}

const flowSteps = [
  {
    key: 'open',
    titleZh: '开通账户',
    titleTw: '開通賬戶',
    titleEn: 'Account Opening',
    descZh: '提交资料并完成 KYC 审核',
    descTw: '提交資料並完成 KYC 審核',
    descEn: 'Submit documents and complete KYC',
  },
  {
    key: 'collect',
    titleZh: '收款',
    titleTw: '收款',
    titleEn: 'Collection',
    descZh: '本地收款、电汇与订阅收款，覆盖主要进账场景',
    descTw: '本地收款、電匯與訂閱收款，覆蓋主要進賬場景',
    descEn: 'Local, wire and subscription collection for major inbound flows',
  },
  {
    key: 'hold',
    titleZh: '持有',
    titleTw: '持有',
    titleEn: 'Hold',
    descZh: '多币种余额管理，按需持有结算币种',
    descTw: '多幣種餘額管理，按需持有結算幣種',
    descEn: 'Manage multi-currency balances; hold settlement currencies as needed',
  },
  {
    key: 'fx',
    titleZh: '币种兑换',
    titleTw: '幣種兌換',
    titleEn: 'FX',
    descZh: '将余额兑换为所需结算币种',
    descTw: '將餘額兌換為所需結算幣種',
    descEn: 'Convert balances into the required settlement currency',
  },
  {
    key: 'pay',
    titleZh: '付款',
    titleTw: '付款',
    titleEn: 'Payout',
    descZh: '供应商付款，流程留痕可审计',
    descTw: '供應商付款，流程留痕可審計',
    descEn: 'Supplier payouts with audit-ready records',
  },
]

let flowObserver = null

watch(
  () => route.hash,
  (hash) => {
    activateProductHash(hash)
  },
)

onMounted(async () => {
  await nextTick()
  if (productHashes[route.hash] || serviceHashes[route.hash]) {
    activateProductHash()
  } else {
    setTab('b2b', { scroll: false })
    setService('collect', { scroll: false })
  }
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
  flowObserver?.disconnect()
})
</script>

<template>
<!-- 产品页根节点：整页连续背景，避免各 section 光晕被裁切出硬缝 -->
<div ref="root" class="products-page">
<section class="hero hero-page">
  <div class="hero-page-bg" aria-hidden="true">
    <span class="hero-page-orb hero-page-orb--tl"></span>
    <span class="hero-page-orb hero-page-orb--bl"></span>
    <span class="hero-page-orb hero-page-orb--mid"></span>
  </div>
  <div class="container hero-page-inner">
    <div class="hero-page-copy reveal-group">
      <h1 class="reveal" data-en="The dedicated payment infrastructure behind your global business" data-zh="您全球业务背后的专属资金通道" data-tw="您全球業務背後的專屬資金通道">您全球业务背后的专属资金通道</h1>
      <p class="lead reveal" data-en="Backed by licensed credentials and major banking partners, we deliver one-stop cross-border payment services spanning account opening, collection, payouts and FX. Our specialists safeguard compliance and fund security—so you can focus on growing globally." data-zh="依托持牌资质与主流银行渠道，我们提供覆盖开户、收款、付款及换汇的一站式跨境资金服务。跨境合规与资金安全由专业团队保障，企业得以专注全球业务拓展。" data-tw="依托持牌資質與主流銀行渠道，我們提供覆蓋開戶、收款、付款及換匯的一站式跨境資金服務。跨境合規與資金安全由專業團隊保障，企業得以專注全球業務拓展。">依托持牌资质与主流银行渠道，我们提供覆盖开户、收款、付款及换汇的一站式跨境资金服务。跨境合规与资金安全由专业团队保障，企业得以专注全球业务拓展。</p>
    </div>
    <div class="hero-page-media" aria-hidden="true">
      <figure class="hero-page-figure">
        <picture>
          <source :srcset="productsHeroWebp" type="image/webp" />
          <img
            class="hero-page-img"
            :src="productsHeroSrc"
            alt=""
            width="960"
            height="720"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
        </picture>
      </figure>
    </div>
  </div>
</section>
<!-- ===== 解决方案 ===== -->
<section class="section scenario-section" id="solutions">
  <div class="container">
    <div class="scenario-head">
      <h2
        data-en="Tailored solutions for different business models."
        data-zh="为不同业务形态，量身定制的专属方案。"
        data-tw="爲不同業務形態，量身定制的專屬方案。"
      >为不同业务形态，量身定制的专属方案。</h2>
    </div>

    <div class="scenario-layout">
      <div
        class="scenario-tabs tabs"
        role="tablist"
        aria-orientation="vertical"
        :aria-label="t('解决方案', 'Solutions', '解決方案')"
      >
        <button
          v-for="card in solutionCards"
          :id="'tab-' + card.key"
          :key="'tab-' + card.key"
          class="tab"
          :class="{ active: activeSolution === card.key }"
          :data-tab="card.key"
          type="button"
          role="tab"
          :aria-selected="activeSolution === card.key"
          :aria-controls="'panel-' + card.key"
          :tabindex="activeSolution === card.key ? 0 : -1"
          :data-en="card.titleEn"
          :data-zh="card.titleZh"
          :data-tw="card.titleTw"
        >{{ t(card.titleZh, card.titleEn, card.titleTw) }}</button>
      </div>

      <div class="scenario-panels">
        <div
          v-for="card in solutionCards"
          :id="'panel-' + card.key"
          :key="'panel-' + card.key"
          class="panel scenario-panel"
          :class="{ active: activeSolution === card.key }"
          :data-panel="card.key"
          :data-solution="card.key"
          role="tabpanel"
          :aria-labelledby="'tab-' + card.key"
          :hidden="activeSolution !== card.key"
        >
          <div class="scenario-detail">
            <div class="scenario-detail-lists">
              <div class="scenario-detail-group">
                <h4
                  class="scenario-detail-group-title"
                  data-en="Target clients"
                  data-zh="适用客户"
                  data-tw="適用客戶"
                >适用客户</h4>
                <ul class="scenario-detail-list">
                  <li v-for="(item, itemIdx) in card.sceneItems" :key="card.key + '-scene-' + itemIdx">
                    {{ solutionItemText(item) }}
                  </li>
                </ul>
              </div>
              <div class="scenario-detail-group">
                <h4
                  class="scenario-detail-group-title"
                  data-en="Core value"
                  data-zh="核心价值"
                  data-tw="核心價值"
                >核心价值</h4>
                <ul class="scenario-detail-list">
                  <li v-for="(item, itemIdx) in card.offerItems" :key="card.key + '-offer-' + itemIdx">
                    {{ solutionItemText(item) }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="scenario-detail-intro">
              <p class="scenario-detail-lead">{{ t(card.leadZh, card.leadEn, card.leadTw) }}</p>
              <a class="scenario-detail-cta" href="/contact">
                {{ t('预约咨询', 'Book a consultation', '預約諮詢') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<!-- ===== 服务与渠道 ===== -->
<section class="section solution-services-section" id="services">
  <div class="container">
    <div class="services-cards-head">
      <h2
        data-en="Services &amp; Corridors"
        data-zh="服务与渠道"
        data-tw="服務與渠道"
      >服务与渠道</h2>
      <p
        data-en="Payment corridors built around your business."
        data-zh="为您构建的专属通道"
        data-tw="為您構建的專屬通道"
      >为您构建的专属通道</p>
    </div>

    <div
      class="services-tabs"
      role="tablist"
      aria-orientation="horizontal"
      :aria-label="t('服务与渠道', 'Services & Channels', '服務與渠道')"
    >
      <button
        v-for="(card, idx) in serviceChannelCards"
        :id="'service-tab-' + card.key"
        :key="'service-tab-' + card.key"
        class="services-tab"
        :class="{ active: activeService === card.key }"
        type="button"
        role="tab"
        :aria-selected="activeService === card.key"
        :aria-controls="card.key"
        :tabindex="activeService === card.key ? 0 : -1"
        @click="setService(card.key)"
      >
        <span class="services-tab__index" aria-hidden="true">{{ String(idx + 1).padStart(2, '0') }}</span>
        <span
          class="services-tab__label"
          :data-en="card.titleEn"
          :data-zh="card.titleZh"
          :data-tw="card.titleTw"
        >{{ t(card.titleZh, card.titleEn, card.titleTw) }}</span>
      </button>
    </div>

    <div class="services-panels">
      <article
        v-for="card in serviceChannelCards"
        :id="card.key"
        :key="'service-panel-' + card.key"
        class="services-panel"
        :class="{ active: activeService === card.key }"
        role="tabpanel"
        :aria-labelledby="'service-tab-' + card.key"
        :hidden="activeService !== card.key"
      >
        <div class="services-panel__inner">
          <div class="services-band__visual">
            <span class="services-band__glow" aria-hidden="true"></span>
            <figure class="services-band__media">
              <picture>
                <source
                  v-if="serviceImageWebp(card)"
                  :srcset="serviceImageWebp(card)"
                  type="image/webp"
                />
                <img
                  :src="serviceImageSrc(card)"
                  :alt="t(card.titleZh, card.titleEn, card.titleTw)"
                  width="720"
                  height="540"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </figure>
          </div>
          <div class="services-band__copy">
            <h4 class="services-band__title">{{ t(card.titleZh, card.titleEn, card.titleTw) }}</h4>
            <span class="services-band__kicker">{{ t(card.subtitleZh, card.subtitleEn, card.subtitleTw) }}</span>
            <p class="services-band__body">{{ t(card.textZh, card.textEn, card.textTw) }}</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>
<!-- ===== 业务流转 + 能力总览 ===== -->
<section
  class="section flow-slide-section"
  id="workflow"
  ref="workflowEl"
  :class="{ 'flow-inview': flowInview }"
  :aria-label="t('资金链路步骤', 'Payments workflow steps', '資金鏈路步驟')"
>
<div class="container">
<div class="flow-slide-head">
<h2 data-en="From account opening to settlement—one clear payments workflow" data-zh="从开户到资金结算，一条清晰的资金链路" data-tw="從開戶到資金結算，一條清晰的資金鍊路">从开户到资金结算，一条清晰的资金链路</h2>
<p data-en="Around the core of cross-border collection and payout, ADG PAY delivers a connected journey from collection and holding through to settlement—one account suite covering the main fund flows." data-zh="围绕跨境收付的核心环节，ADG PAY 为企业提供从收款、持币到付款结算的连贯服务；一套账户，覆盖主要资金环节。" data-tw="圍繞跨境收付的核心環節，ADG PAY 爲企業提供從收款、持幣到付款結算的連貫服務；一套賬戶，覆蓋主要資金環節。">围绕跨境收付的核心环节，ADG PAY 为企业提供从收款、持币到付款结算的连贯服务；一套账户，覆盖主要资金环节。</p>
</div>

<div class="flow-slide">
<article
  v-for="step in flowSteps"
  :key="step.key"
  class="flow-card"
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
</section>
</div>
</template>
