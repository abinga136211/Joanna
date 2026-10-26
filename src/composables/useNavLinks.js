import { computed } from 'vue'
import { useFaqTopics } from '@/composables/useFaqTopics'

/** 主导航静态子项（帮助中心子项由 FAQ 主题动态注入） */
const PRODUCT_CHILDREN = [
  { to: '/products#solutions', zh: '行业专属方案', tw: '行業專屬方案', en: 'Industry Solutions' },
  { to: '/products#collect', zh: '全球收款', tw: '全球收款', en: 'Global Collection' },
  { to: '/products#pay', zh: '国际付款', tw: '國際付款', en: 'International Payouts' },
  { to: '/products#fx', zh: '灵活换汇', tw: '靈活換匯', en: 'Flexible FX' },
  { to: '/products#workflow', zh: '资金链路', tw: '資金鏈路', en: 'Payments Workflow' },
]

const COMPLIANCE_CHILDREN = [
  { to: '/compliance#framework', zh: '监管合规', tw: '監管合規', en: 'Regulatory Compliance' },
  { to: '/compliance#privacy', zh: '数据与隐私', tw: '數據與隱私', en: 'Data & Privacy' },
  { to: '/compliance#risk', zh: '多层风控', tw: '多層風控', en: 'Multi-layer Risk Control' },
  { to: '/compliance#funds', zh: '资金隔离存放', tw: '資金隔離存放', en: 'Fund Segregation' },
]

/**
 * 导航与页脚共用链接源，避免两边文案/锚点漂移。
 */
export function useNavLinks() {
  const { navChildren: faqNavChildren } = useFaqTopics()

  const links = computed(() => [
    { key: 'home', to: '/' },
    {
      key: 'products',
      to: '/products',
      children: PRODUCT_CHILDREN,
    },
    {
      key: 'compliance',
      to: '/compliance',
      children: COMPLIANCE_CHILDREN,
    },
    {
      key: 'faq',
      to: '/faq',
      children: faqNavChildren.value,
    },
    {
      key: 'about',
      to: '/about',
    },
    {
      key: 'privacy',
      to: '/privacy',
    },
  ])

  /** 页脚栏目：与主导航分组一致（不含首页） */
  const footerColumns = computed(() => {
    const cols = []
    for (const link of links.value) {
      if (link.key === 'home') continue
      if (link.children?.length) {
        cols.push({
          key: link.key,
          to: link.to,
          children: link.children,
        })
      }
    }
    // 无子菜单的顶栏项 + 联系我们 CTA，归入「公司」栏
    cols.push({
      key: 'company',
      to: '/about',
      children: [
        { to: '/about', zh: '关于我们', tw: '關於我們', en: 'About Us' },
        { to: '/privacy', zh: '加入我们', tw: '加入我們', en: 'Careers' },
        { to: '/contact', zh: '联系我们', tw: '聯繫我們', en: 'Contact Us' },
      ],
    })
    return cols
  })

  return { links, footerColumns }
}
