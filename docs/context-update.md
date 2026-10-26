# Context Update — 首页文案快照

来源：`src/views/HomeView.vue`  
更新日期：2026-10-23（英文按专业金融用语润色；中文/繁体不变）

---

# Hero

来源：`section.hero-home` → `h1.hero-home-title`  
视觉：全屏图 `public/images/hk-skyline.jpg`（`index.html` preload）；品牌名 + 导语 + 说明；CTA：Get started / Products & Solutions

| 字段 | 简中 | English | 繁中 |
| --- | --- | --- | --- |
| 品牌 | ADG PAY | ADG PAY | ADG PAY |
| 导语 | 一个专为跨境企业打造的资金通道平台 | Cross-border payments infrastructure built for global enterprises | 一個專為跨境企業打造的資金通道平台 |
| 说明 | 我们不做“超市型”金融服务，而做“私人银行”级别的稀缺渠道整合者——以深度掌控的顶级牌照网络，为您的每一笔跨境资金，提供精准的专属通路。 | We don’t run a one-size-fits-all financial supermarket. We curate scarce, high-quality licensed corridors—so every transfer has a precise, dedicated path. | 我們不做「超市型」金融服務，而做「私人銀行」級別的稀缺渠道整合者——以深度掌控的頂級牌照網絡，為您的每一筆跨境資金，提供精準的專屬通路。 |

---

# 核心产品（五卡）

来源：`section.products-section` → `.products-feature-grid`  
布局：标题区 + 五张能力卡（含 UI mock 视觉）

## 区头

| 字段 | 简中 | English | 繁中 |
| --- | --- | --- | --- |
| Kicker | 为什么选择 ADG PAY？ | Why choose ADG PAY? | 為什麼選擇 ADG PAY？ |
| 标题 | 为全球化企业打造功能强大的解决方案 | Powerful solutions built for global enterprises | 為全球化企業打造功能強大的解決方案 |
| 导语 | 从渠道匹配、全球收款到国际付款、灵活换汇与专属咨询，一站式覆盖跨境资金全链路。 | From corridor matching and global collection to international payouts, FX and dedicated advisory—an end-to-end payments stack for cross-border funds. | 從渠道匹配、全球收款到國際付款、靈活換匯與專屬諮詢，一站式覆蓋跨境資金全鏈路。 |

## 能力卡

| 标题 | 简中说明 | English | 繁中说明 | 链接 |
| --- | --- | --- | --- | --- |
| 渠道匹配 / Corridor Matching | 快速匹配收款与持牌通道 | Match the right collection and licensed payment corridors | 快速匹配收款與持牌通道 | `/products#solutions` |
| 全球收款 / Global Collection | 覆盖超20+国家收款和15类币种 | Collect in 20+ markets across 15+ currencies | 覆蓋超20+國家收款和15類幣種 | `/products#collect` |
| 国际付款 / International Payouts | 向全球供应商与合作伙伴高效完成合规付款 | Pay suppliers and partners worldwide through compliant payout rails | 向全球供應商與合作夥伴高效完成合規付款 | `/products#pay` |
| 灵活换汇 / Flexible FX | 主流币种 7×24 在线换汇，实时报价与全流程风控 | 24/7 FX in major currencies—live rates with end-to-end risk controls | 主流幣種 7×24 在線換匯，實時報價與全流程風控 | `/products#fx` |
| 专属咨询 / Dedicated Advisory | 一对一专属顾问，定制个性化跨境资金方案 | Dedicated advisors who design tailored cross-border payment solutions | 一對一專屬顧問，定制個性化跨境資金方案 | `/contact` |

---

# 专属方案（手风琴）

来源：`section.compare-section`  
布局：左图 `public/images/career-hero.jpg` + 右侧编号列表（点击困局展开方案）  
Kicker：产品与解决方案 / Products & Solutions / 產品與解決方案  
底链：「了解更多 >」→ `/contact`

| # | 困局 | 方案 | 困局说明（简中） | 方案说明（简中） |
| --- | --- | --- | --- | --- |
| 01 | 开户困局 / Onboarding Friction | 专属咨询 / Dedicated Advisory | 漫长的开户排期、反复的合规问询、多头对接的沟通成本 | 签署保密协议，深入梳理您的业务模式、交易币种、额度与目的地，直接呈上有效的渠道，匹配最适合您背景的账户。 |
| 02 | 渠道单一 / Single-Corridor Constraints | 渠道匹配 / Corridor Matching | 单一机构的汇率、时效与风控，难以满足多元且动态的资金需求。 | 为您搭建 “1+N” 多渠道组合，自由路由、分散风险、捕捉最优资金路径；推荐最优产品与解决方案和全程服务。 |
| 03 | 服务真空 / Service Gaps | 持续运营 / Ongoing Operations | 邮件来回数天、问题跟进缓慢，关键时刻求助无门 | 每位客户配备专属资金管家，直接对接决策层，渠道问题 24 小时内介入协调；账户启用后持续提供多币种收款、跨境付款与渠道关系维护。 |

非英文界面下标题/方案名会附带英文副标题；英文界面仅显示英文。

---

# 关于我们 + 通道数据

来源：`section.start-section` → `.start-channel`  
布局：`WhyGlobe` 背景 + 文案；下方四条数据条

| 字段 | 简中 | English | 繁中 |
| --- | --- | --- | --- |
| Kicker | 关于我们 | About Us | 關於我們 |
| 标题 | 专注跨境企业，更懂你的业务 | Built for cross-border enterprises—we understand your business | 專注跨境企業，更懂你的業務 |
| 导语 | ADG PAY 持有多地支付牌照，面向跨境集团、跨境电商、外贸出口与 SaaS 等企业，提供全球收款、国际和本土付款以及多币种换汇与结算等服务。 | ADG PAY holds payment licences across multiple regions and serves cross-border groups, e-commerce, trade exporters and SaaS companies with global collection, international and local payouts, and multi-currency FX and settlement. | ADG PAY 持有多地支付牌照，面向跨境集團、跨境電商、外貿出口與 SaaS 等企業，提供全球收款、國際和本土付款以及多幣種換匯與結算等服務。 |
| CTA | 了解更多 > | Learn More > | 了解更多 > |

链接：`/about`

### 数据条

| 数值 | 简中 | English | 繁中 |
| --- | --- | --- | --- |
| 30+ | 深度合作的香港及海外持牌银行与 MSO 机构 | Licensed bank and MSO partners across Hong Kong and overseas | 深度合作的香港及海外持牌銀行與 MSO 機構 |
| 200+ | 已建立专属资金通道的企业客户 | Enterprise clients with dedicated payment corridors | 已建立專屬資金通道的企業客戶 |
| 0 | 公开泄露的客户信息（严格保密协议全面执行） | Public client-data breaches (mutual NDAs enforced) | 公開泄露的客戶信息（嚴格保密協議全面執行） |
| 60% | 平均为客户节省的对公开户与合规沟通时间 | Average time saved on public onboarding and compliance coordination | 平均為客戶節省的對公開戶與合規溝通時間 |
