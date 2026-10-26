<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import WhyGlobe from '@/components/home/WhyGlobe.vue'
import HeroVisual from '@/components/home/HeroVisual.vue'
import FlagMarquee from '@/components/home/FlagMarquee.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useLocaleStore } from '@/stores/locale'

const root = ref(null)
useScrollReveal(root)

const assetBase = import.meta.env.BASE_URL
const locale = useLocaleStore()
const t = (...args) => locale.t(...args)

/** 首页产品能力卡片 → 产品页对应锚点；专属咨询 → 联系我们 */
const productCards = computed(() => [
  {
    key: 'match',
    theme: 'match',
    to: '/products#solutions',
    title: t('渠道匹配', 'Corridor Matching', '渠道匹配'),
    desc: t(
      '快速匹配收款与持牌通道',
      'Match the right collection and licensed payment corridors',
      '快速匹配收款與持牌通道',
    ),
    showCtaText: false,
  },
  {
    key: 'collect',
    theme: 'collect',
    to: '/products#collect',
    title: t('全球收款', 'Global Collection', '全球收款'),
    desc: t(
      '覆盖超20+国家收款和15类币种',
      'Collect in 20+ markets across 15+ currencies',
      '覆蓋超20+國家收款和15類幣種',
    ),
    showCtaText: false,
  },
  {
    key: 'pay',
    theme: 'pay',
    to: '/products#pay',
    title: t('国际付款', 'International Payouts', '國際付款'),
    desc: t(
      '向全球供应商与合作伙伴高效完成合规付款',
      'Pay suppliers and partners worldwide through compliant payout rails',
      '向全球供應商與合作夥伴高效完成合規付款',
    ),
    showCtaText: false,
  },
  {
    key: 'fx',
    theme: 'fx',
    to: '/products#fx',
    title: t('灵活换汇', 'Flexible FX', '靈活換匯'),
    desc: t(
      '主流币种 7×24 在线换汇，实时报价与全流程风控',
      '24/7 FX in major currencies—live rates with end-to-end risk controls',
      '主流幣種 7×24 在線換匯，實時報價與全流程風控',
    ),
    showCtaText: false,
  },
  {
    key: 'consult',
    theme: 'consult',
    to: '/contact',
    title: t('专属咨询', 'Dedicated Advisory', '專屬諮詢'),
    desc: t(
      '一对一专属顾问，定制个性化跨境资金方案',
      'Dedicated advisors who design tailored cross-border payment solutions',
      '一對一專屬顧問，定制個性化跨境資金方案',
    ),
    showCtaText: false,
  },
])

/** 编号列表：点击困局下滑展开对应方案 */
const compareImageSrc = `${assetBase}images/career-hero.jpg`
const openCompareNum = ref('')
function toggleCompare(num) {
  openCompareNum.value = openCompareNum.value === num ? '' : num
}
const compareItems = computed(() => {
  const rows = [
    {
      num: '01',
      titleZh: '开户困局',
      titleTw: '開戶困局',
      titleEn: 'Onboarding Friction',
      text: t(
        '漫长的开户排期、反复的合规问询、多头对接的沟通成本',
        'Long onboarding queues, repeated compliance follow-ups, and the cost of juggling multiple counterparties',
        '漫長的開戶排期、反復的合規問詢、多頭對接的溝通成本',
      ),
      solutionZh: '专属咨询',
      solutionTw: '專屬諮詢',
      solutionEn: 'Dedicated Advisory',
      solutionText: t(
        '签署保密协议，深入梳理您的业务模式、交易币种、额度与目的地，直接呈上有效的渠道，匹配最适合您背景的账户。',
        'Under NDA, we map your business model, currencies, volumes and destinations—then recommend licensed corridors and accounts that fit your profile.',
        '簽署保密協議，深入梳理您的業務模式、交易幣種、額度與目的地，直接呈上有效的渠道，匹配最適合您背景的賬戶。',
      ),
    },
    {
      num: '02',
      titleZh: '渠道单一',
      titleTw: '渠道單一',
      titleEn: 'Single-Corridor Constraints',
      text: t(
        '单一机构的汇率、时效与风控，难以满足多元且动态的资金需求。',
        'Relying on one institution for FX, settlement speed and risk controls rarely covers diverse, fast-changing payment needs.',
        '單一機構的匯率、時效與風控，難以滿足多元且動態的資金需求。',
      ),
      solutionZh: '渠道匹配',
      solutionTw: '渠道匹配',
      solutionEn: 'Corridor Matching',
      solutionText: t(
        '为您搭建 “1+N” 多渠道组合，自由路由、分散风险、捕捉最优资金路径；推荐最优产品与解决方案和全程服务。',
        'We design a “1+N” corridor mix with intelligent routing, diversified risk and optimal settlement paths—then recommend the right products with end-to-end support.',
        '為您搭建「1+N」多渠道組合，自由路由、分散風險、捕捉最優資金路徑；推薦最優產品與解決方案和全程服務。',
      ),
    },
    {
      num: '03',
      titleZh: '服务真空',
      titleTw: '服務真空',
      titleEn: 'Service Gaps',
      text: t(
        '邮件来回数天、问题跟进缓慢，关键时刻求助无门',
        'Email threads drag on for days, follow-ups stall, and there is no one to call when it matters',
        '郵件來回數天、問題跟進緩慢，關鍵時刻求助無門',
      ),
      solutionZh: '持续运营',
      solutionTw: '持續運營',
      solutionEn: 'Ongoing Operations',
      solutionText: t(
        '每位客户配备专属资金管家，直接对接决策层，渠道问题 24 小时内介入协调；账户启用后持续提供多币种收款、跨境付款与渠道关系维护。',
        'Every client has a dedicated relationship manager with direct access to decision-makers; corridor issues are escalated within 24 hours. After go-live we continue to support multi-currency collection, cross-border payouts and partner relationships.',
        '每位客戶配備專屬資金管家，直接對接決策層，渠道問題 24 小時內介入協調；賬戶啟用後持續提供多幣種收款、跨境付款與渠道關係維護。',
      ),
    },
  ]
  return rows.map((item) => {
    const isEn = locale.language === 'en'
    const zh = locale.language === 'tw' ? item.titleTw : item.titleZh
    const primary = isEn ? item.titleEn : zh
    const solutionZh = locale.language === 'tw' ? item.solutionTw : item.solutionZh
    const solutionPrimary = isEn ? item.solutionEn : solutionZh
    // 简中 / 繁中仅显示对应文案，不附带英文副标题
    return {
      num: item.num,
      primary,
      secondary: '',
      text: item.text,
      solutionPrimary,
      solutionSecondary: '',
      solutionText: item.solutionText,
    }
  })
})

/** 首页通道能力区：关键数据 */
const channelStats = computed(() => [
  {
    value: '30+',
    label: t(
      '深度合作的香港及海外持牌银行与 MSO 机构',
      'Licensed bank and MSO partners across Hong Kong and overseas',
      '深度合作的香港及海外持牌銀行與 MSO 機構',
    ),
  },
  {
    value: '200+',
    label: t(
      '已建立专属资金通道的企业客户',
      'Enterprise clients with dedicated payment corridors',
      '已建立專屬資金通道的企業客戶',
    ),
  },
  {
    value: '0',
    label: t(
      '公开泄露的客户信息（严格保密协议全面执行）',
      'Public client-data breaches (mutual NDAs enforced)',
      '公開泄露的客戶信息（嚴格保密協議全面執行）',
    ),
  },
  {
    value: '60%',
    label: t(
      '平均为客户节省的对公开户与合规沟通时间',
      'Average time saved on public onboarding and compliance coordination',
      '平均為客戶節省的對公開戶與合規溝通時間',
    ),
  },
])

</script>

<template>
<div ref="root">
<!-- ===== Hero ===== -->
<section class="hero hero-home">
  <div class="container hero-home-grid">
    <div class="hero-home-copy reveal-group">
      <h1 class="hero-home-title reveal">
        <span class="hero-home-brand">ADG PAY</span>
        <span class="hero-home-lead">{{
          t(
            '一个专为跨境企业打造的资金通道平台',
            'Cross-border payments infrastructure built for global enterprises',
            '一個專為跨境企業打造的資金通道平台',
          )
        }}</span>
      </h1>
      <p class="hero-home-desc reveal">{{
        t(
          '我们不做“超市型”金融服务，而做“私人银行”级别的稀缺渠道整合者——以深度掌控的顶级牌照网络，为您的每一笔跨境资金，提供精准的专属通路。',
          'We don’t run a one-size-fits-all financial supermarket. We curate scarce, high-quality licensed corridors—so every transfer has a precise, dedicated path.',
          '我們不做「超市型」金融服務，而做「私人銀行」級別的稀缺渠道整合者——以深度掌控的頂級牌照網絡，為您的每一筆跨境資金，提供精準的專屬通路。',
        )
      }}</p>
      <div class="hero-cta hero-home-cta reveal">
        <RouterLink class="btn btn-primary btn-lg" to="/contact">{{
          t('咨询开户', 'Get started', '諮詢開戶')
        }}</RouterLink>
        <RouterLink class="btn btn-outline btn-lg" to="/products">{{
          t('产品与解决方案', 'Products & Solutions', '產品與解決方案')
        }}</RouterLink>
      </div>
    </div>
    <div class="hero-home-visual reveal">
      <HeroVisual />
    </div>
  </div>
</section>
<!-- ===== 覆盖地区 · 国旗流动 ===== -->
<FlagMarquee />
<!-- ===== 核心产品 ===== -->
<section class="section products-section">
  <div class="container">
    <div class="products-showcase reveal-group">
      <header class="products-showcase-head reveal">
        <p
          class="products-showcase-kicker"
          data-en="Why choose ADG PAY?"
          data-zh="为什么选择 ADG PAY？"
          data-tw="為什麼選擇 ADG PAY？"
        >为什么选择 ADG PAY？</p>
        <h2
          data-en="Powerful solutions built for global enterprises"
          data-zh="为全球化企业打造功能强大的解决方案"
          data-tw="為全球化企業打造功能強大的解決方案"
        >为全球化企业打造功能强大的解决方案</h2>
        <p
          class="products-showcase-lead"
          data-en="From corridor matching and global collection to international payouts, FX and dedicated advisory—an end-to-end payments stack for cross-border funds."
          data-zh="从渠道匹配、全球收款到国际付款、灵活换汇与专属咨询，一站式覆盖跨境资金全链路。"
          data-tw="從渠道匹配、全球收款到國際付款、靈活換匯與專屬諮詢，一站式覆蓋跨境資金全鏈路。"
        >从渠道匹配、全球收款到国际付款、灵活换汇与专属咨询，一站式覆盖跨境资金全链路。</p>
      </header>

      <div class="products-feature-grid">
        <RouterLink
          v-for="card in productCards"
          :key="card.key"
          class="products-feature-card reveal"
          :class="`products-feature-card--${card.theme}`"
          :to="card.to"
        >
          <div class="products-feature-card__top">
            <h3 class="products-feature-card__title">{{ card.title }}</h3>
            <p class="products-feature-card__desc">{{ card.desc }}</p>
            <span class="products-feature-card__cta">
              <template v-if="card.showCtaText">{{ t('了解更多', 'Learn more', '了解更多') }}</template>
              <span aria-hidden="true">→</span>
            </span>
          </div>

          <!-- 全球收款：账户看板 + 手机 -->
          <div v-if="card.key === 'collect'" class="products-feature-card__visual" aria-hidden="true">
            <div class="pf-mock pf-mock--panel">
              <div class="pf-mock__head">
                <span class="pf-dot"></span><span class="pf-dot"></span><span class="pf-dot"></span>
              </div>
              <div class="pf-mock__kpi">
                <span></span><span></span><span></span>
              </div>
              <div class="pf-mock__bars">
                <i style="--h:58%"></i><i style="--h:78%"></i><i style="--h:46%"></i><i style="--h:88%"></i><i style="--h:64%"></i>
              </div>
            </div>
            <div class="pf-mock pf-mock--phone">
              <span class="pf-mock__notch"></span>
              <span class="pf-mock__pill"></span>
              <span class="pf-mock__line"></span>
              <span class="pf-mock__line pf-mock__line--sm"></span>
            </div>
          </div>

          <!-- 国际付款：付款列表 -->
          <div v-else-if="card.key === 'pay'" class="products-feature-card__visual" aria-hidden="true">
            <div class="pf-mock pf-mock--list">
              <div class="pf-mock__head">
                <span class="pf-dot"></span><span class="pf-dot"></span><span class="pf-dot"></span>
              </div>
              <div class="pf-list-row" v-for="n in 4" :key="'pay-row-' + n">
                <span class="pf-avatar"></span>
                <span class="pf-lines"><i></i><i></i></span>
                <span class="pf-amount"></span>
              </div>
            </div>
            <div class="pf-mock pf-mock--phone pf-mock--phone-right">
              <span class="pf-mock__notch"></span>
              <span class="pf-mock__pill"></span>
              <span class="pf-mock__line"></span>
            </div>
          </div>

          <!-- 灵活换汇：汇率卡片 -->
          <div v-else-if="card.key === 'fx'" class="products-feature-card__visual" aria-hidden="true">
            <div class="pf-mock pf-mock--fx">
              <div class="pf-fx-card">
                <span class="pf-fx-pair"></span>
                <span class="pf-fx-rate"></span>
                <span class="pf-fx-spark"></span>
              </div>
              <div class="pf-fx-card pf-fx-card--alt">
                <span class="pf-fx-pair"></span>
                <span class="pf-fx-rate"></span>
                <span class="pf-fx-spark"></span>
              </div>
            </div>
          </div>

          <!-- 渠道匹配：表单/通道 -->
          <div v-else-if="card.key === 'match'" class="products-feature-card__visual" aria-hidden="true">
            <div class="pf-mock pf-mock--form">
              <span class="pf-form-label"></span>
              <span class="pf-form-field"></span>
              <span class="pf-form-label"></span>
              <span class="pf-form-field"></span>
              <span class="pf-form-btn"></span>
              <div class="pf-channel-tags">
                <i></i><i></i><i></i>
              </div>
            </div>
          </div>

          <!-- 专属咨询：对话/顾问 -->
          <div v-else class="products-feature-card__visual" aria-hidden="true">
            <div class="pf-mock pf-mock--chat">
              <div class="pf-chat-bubble pf-chat-bubble--in"></div>
              <div class="pf-chat-bubble pf-chat-bubble--out"></div>
              <div class="pf-chat-bubble pf-chat-bubble--in pf-chat-bubble--short"></div>
            </div>
            <div class="pf-mock pf-mock--phone pf-mock--phone-right">
              <span class="pf-mock__notch"></span>
              <span class="pf-mock__pill"></span>
              <span class="pf-mock__line"></span>
              <span class="pf-mock__line pf-mock__line--sm"></span>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</section>
<!-- ===== 专属方案：圆形主视觉 + 编号文案列表 ===== -->
<section class="section compare-section">
  <div class="container">
    <div class="compare-grid reveal-group">
      <div class="compare-visual reveal" aria-hidden="true">
        <img :src="compareImageSrc" alt="" loading="lazy" decoding="async" />
      </div>
      <div class="compare-list-wrap">
        <span
          class="why-panel-kicker compare-kicker reveal"
          data-en="Products &amp; Solutions"
          data-zh="产品与解决方案"
          data-tw="產品與解決方案"
        >产品与解决方案</span>
        <ol class="compare-list" role="list">
          <li
            v-for="item in compareItems"
            :key="item.num"
            class="compare-item reveal"
            :data-open="openCompareNum === item.num ? 'true' : undefined"
          >
            <button
              type="button"
              class="compare-item__trigger"
              :aria-expanded="openCompareNum === item.num"
              :aria-controls="`compare-solution-${item.num}`"
              @click="toggleCompare(item.num)"
            >
              <span class="compare-item__num">{{ item.num }}</span>
              <div class="compare-item__main">
                <h3 class="compare-item__title">
                  <span class="compare-item__title-primary">{{ item.primary }}</span>
                  <template v-if="item.secondary">
                    <span class="compare-item__title-sep"> / </span>
                    <span class="compare-item__title-secondary">{{ item.secondary }}</span>
                  </template>
                </h3>
                <p class="compare-item__text">{{ item.text }}</p>
              </div>
              <span
                class="compare-item__hint"
                aria-hidden="true"
                :title="openCompareNum === item.num
                  ? t('收起方案', 'Collapse', '收起方案')
                  : t('展开方案', 'Expand', '展開方案')"
              ></span>
            </button>
            <div
              :id="`compare-solution-${item.num}`"
              class="compare-item__solution"
              :aria-hidden="openCompareNum !== item.num"
            >
              <div class="compare-item__solution-inner">
                <h4 class="compare-item__solution-title">
                  <span class="compare-item__title-primary">{{ item.solutionPrimary }}</span>
                  <template v-if="item.solutionSecondary">
                    <span class="compare-item__title-sep"> / </span>
                    <span class="compare-item__title-secondary">{{ item.solutionSecondary }}</span>
                  </template>
                </h4>
                <p class="compare-item__solution-text">{{ item.solutionText }}</p>
              </div>
            </div>
          </li>
        </ol>
        <a class="why-panel-link compare-more" href="/contact">
          <span data-en="Learn More >" data-zh="了解更多 >" data-tw="了解更多 >">了解更多 ></span>
        </a>
      </div>
    </div>
  </div>
</section>
<!-- ===== 关于我们 + 全球专属资金通道 ===== -->
<section class="section start-section">
  <div class="container start-channel reveal-group">
    <div class="start-channel-main">
      <div class="start-channel-media" aria-hidden="true">
        <WhyGlobe id-prefix="start" />
      </div>
      <div class="start-channel-copy reveal">
        <span
          class="why-panel-kicker"
          data-en="About Us"
          data-zh="关于我们"
          data-tw="關於我們"
        >关于我们</span>
        <h2
          data-en="Built for cross-border enterprises—we understand your business"
          data-zh="专注跨境企业，更懂你的业务"
          data-tw="專注跨境企業，更懂你的業務"
        >专注跨境企业，更懂你的业务</h2>
        <p
          data-en="ADG PAY holds payment licences across multiple regions and serves cross-border groups, e-commerce, trade exporters and SaaS companies with global collection, international and local payouts, and multi-currency FX and settlement."
          data-zh="ADG PAY 持有多地支付牌照，面向跨境集团、跨境电商、外贸出口与 SaaS 等企业，提供全球收款、国际和本土付款以及多币种换汇与结算等服务。"
          data-tw="ADG PAY 持有多地支付牌照，面向跨境集團、跨境電商、外貿出口與 SaaS 等企業，提供全球收款、國際和本土付款以及多幣種換匯與結算等服務。"
        >ADG PAY 持有多地支付牌照，面向跨境集团、跨境电商、外贸出口与 SaaS 等企业，提供全球收款、国际和本土付款以及多币种换汇与结算等服务。</p>
        <a class="why-panel-link" href="/about">
          <span data-en="Learn More >" data-zh="了解更多 >" data-tw="了解更多 >">了解更多 ></span>
        </a>
      </div>
    </div>
    <div class="start-stats reveal" role="list">
      <div
        v-for="stat in channelStats"
        :key="stat.value + stat.label"
        class="start-stat"
        role="listitem"
      >
        <div class="start-stat-value">{{ stat.value }}</div>
        <div class="start-stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</section>
</div>
</template>
