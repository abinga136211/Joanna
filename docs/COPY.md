# ADG PAY 全站文案

- Extraction date: 2026-10-13（导航 / 页脚 / 首页 / 产品 / 关于 / 合规 Hero / 联系 / 招聘结构已与源码对齐；首页亦可对照 `docs/context-update.md`）
- Note: 文案来源见各章节对应源文件；修改网站文案请改源码后同步更新本文件。
- 语种：ZH（简体）/ TW（繁体）/ EN（英文）。

> 本文档从 Vue views、`locale.js`、`chatKnowledge.js` 及 layout / home / chat 组件中提取全部中英文用户可见文案，供文档与翻译对照使用。不含 CSS、业务逻辑或图片路径。

## 文案源文件索引

- `src/views/*.vue`（HomeView、ProductsView、AboutView、ComplianceView、FaqView、ContactView、PrivacyView）
- `src/stores/locale.js`
- `src/data/chatKnowledge.js`
- `src/components/layout/AppHeader.vue`, `AppFooter.vue`
- `src/components/chat/ChatAssistant.vue`
- `src/components/home/FlagMarquee.vue`, `HeroVisual.vue`

---

## 全局 · locale.js

### 页面标题（TITLES）

| 路由 key | ZH | TW | EN |
|---|---|---|---|
| home | ADG PAY \| 持牌跨境支付与收款解决方案 | ADG PAY \| 持牌跨境支付與收款解決方案 | ADG PAY \| Licensed cross-border payment solutions |
| products | 产品与解决方案 \| ADG PAY | 產品與解決方案 \| ADG PAY | Products & Solutions \| ADG PAY |
| about | 关于我们 \| ADG PAY | 關於我們 \| ADG PAY | About Us \| ADG PAY |
| compliance | 合规与安全 \| ADG PAY | 合規與安全 \| ADG PAY | Compliance & Security \| ADG PAY |
| faq | 帮助中心 / 常见问题 \| ADG PAY | 幫助中心 / 常見問題 \| ADG PAY | Help Center / FAQ \| ADG PAY |
| contact | 联系我们 \| ADG PAY | 聯繫我們 \| ADG PAY | Contact \| ADG PAY |
| privacy | 加入我们 \| ADG PAY | 加入我們 \| ADG PAY | Join Us \| ADG PAY |
| notFound | 页面未找到 \| ADG PAY | 頁面未找到 \| ADG PAY | Page Not Found \| ADG PAY |

### 导航标签（NAV_LABELS）

顶栏英文用短标签；页面 `<title>` 仍用上表较长文案（如 Join Us vs Careers）。

| key | ZH | TW | EN |
|---|---|---|---|
| home | 首页 | 首頁 | Home |
| products | 产品与解决方案 | 產品與解決方案 | Products |
| about | 关于我们 | 關於我們 | About |
| compliance | 合规与安全 | 合規與安全 | Compliance |
| faq | 帮助中心 | 幫助中心 | Help |
| contact | 联系我们 | 聯繫我們 | Contact |
| privacy | 加入我们 | 加入我們 | Careers |

### 其他

- **contactCta** — ZH: 联系咨询 / TW: 聯繫諮詢 / EN: Contact us（`locale.js` 仍导出；**Header 未使用**，联系按钮用 `navLabel('contact')`）
- **brandTag** — ZH/TW: 跨境支付 / EN: Cross-border payments（**Header 未展示**）

---

## 全局 · AppHeader.vue

- **品牌名：** ADG Pay（logo + 文字；无 brandTag 副标）
- **语言：** 三语下拉；按钮显示 简 / 繁 / EN；选项 简体 / 繁體 / English
- **联系 CTA：** `navLabel('contact')`（联系我们 / 聯繫我們 / Contact）→ `/contact`
- **无障碍：** ADG PAY首页；主导航；选择语言；打开菜单；展开子菜单 / Open submenu / 展開子選單

### 主导航 + 下拉（子项文案在 `AppHeader.vue` 的 `links`）

| 顶栏 | 子项 ZH / TW / EN | 链接 |
|---|---|---|
| 首页 | （无下拉） | `/` |
| 产品与解决方案 | 行业专属方案 / 行業專屬方案 / Industry Solutions | `/products#solutions` |
| | 全球收款 / 全球收款 / Global Collection | `/products#collect` |
| | 国际付款 / 國際付款 / International Payouts | `/products#pay` |
| | 灵活换汇 / 靈活換匯 / Flexible FX | `/products#fx` |
| | 资金链路 / 資金鏈路 / Payments Workflow | `/products#workflow` |
| 关于我们 | 使命 / 使命 / Mission | `/about#mission` |
| | 我们的优势 / 我們的優勢 / Our Strengths | `/about#advantage` |
| | 核心团队 / 核心團隊 / Team | `/about#team` |
| | 香港 MSO 牌照 / 香港 MSO 牌照 / HK MSO Licence | `/about#license` |
| 合规与安全 | 监管合规 / 監管合規 / Regulatory Compliance | `/compliance#framework` |
| | 数据与隐私 / 數據與隱私 / Data & Privacy | `/compliance#privacy` |
| | 多层风控 / 多層風控 / Multi-layer Risk Control | `/compliance#risk` |
| | 资金隔离存放 / 資金隔離存放 / Fund Segregation | `/compliance#funds` |
| 帮助中心 | 使用指南 / 使用指南 / Guides | `/faq#guide` |
| | 开户相关 / 開戶相關 / Account Opening | `/faq#faq-onboarding` |
| | 费率与结算 / 費率與結算 / Fees & Settlement | `/faq#faq-fees` |
| | 全球账户与操作 / 全球賬戶與操作 / Accounts & Operations | `/faq#faq-operations` |
| | 安全与合规 / 安全與合規 / Security & Compliance | `/faq#faq-compliance` |
| 加入我们 | 价值观 / 價值觀 / Our Values | `/privacy#values` |
| | 津贴和福利 / 津貼和福利 / Benefits | `/privacy#benefits` |
| | 职位空缺 / 職位空缺 / Open Roles | `/privacy#openings` |

---

## 全局 · AppFooter.vue

### 品牌简介

- **ZH:** ADG PAY 为跨境企业打造专业资金通道，覆盖全球收款、国际付款与灵活换汇，以合规、精准的方式助力跨境资金流转
- **TW:** ADG PAY 為跨境企業打造專業資金通道，覆蓋全球收款、國際付款與靈活換匯，以合規、精準的方式助力跨境資金流轉
- **EN:** ADG PAY builds licensed cross-border payment infrastructure for enterprises—covering global collection, international payouts and flexible FX with compliance and precision.

### 栏目 · 产品

- **标题** — ZH: 产品 / TW: 產品 / EN: Products
- **链接**（页脚无「资金链路」；导航有）
  - ZH: 行业专属方案 / TW: 行業專屬方案 / EN: Industry Solutions → `/products#solutions`
  - ZH: 全球收款 / TW: 全球收款 / EN: Global Collection → `/products#collect`
  - ZH: 国际付款 / TW: 國際付款 / EN: International Payouts → `/products#pay`
  - ZH: 灵活换汇 / TW: 靈活換匯 / EN: Flexible FX → `/products#fx`

### 栏目 · 公司

- **标题** — ZH: 公司 / TW: 公司 / EN: Company
- **链接**
  - ZH: 关于我们 / TW: 關於我們 / EN: About Us → `/about`
  - ZH: 香港 MSO 牌照 / TW: 香港 MSO 牌照 / EN: HK MSO Licence → `/about#license`
  - ZH: 合规与安全 / TW: 合規與安全 / EN: Compliance & Security → `/compliance`
  - ZH: 加入我们 / TW: 加入我們 / EN: Careers → `/privacy`
  - ZH: 联系我们 / TW: 聯繫我們 / EN: Contact Us → `/contact`

### 栏目 · 支持

- **标题** — ZH: 支持 / TW: 支持 / EN: Support
- **链接**
  - ZH: 帮助中心 / TW: 幫助中心 / EN: Help Center → `/faq`
  - ZH: 开户相关 / TW: 開戶相關 / EN: Account Opening → `/faq#faq-onboarding`
  - ZH: 费率与结算 / TW: 費率與結算 / EN: Fees & Settlement → `/faq#faq-fees`
  - ZH: 数据与隐私 / TW: 數據與隱私 / EN: Data & Privacy → `/compliance#privacy`

### 页脚底部

- **版权** — ZH: © 2026 AD GLOBAL (HONG KONG) LIMITED. 保留所有权利。 / TW: © 2026 AD GLOBAL (HONG KONG) LIMITED. 保留所有權利。 / EN: © 2026 AD GLOBAL (HONG KONG) LIMITED. All rights reserved.
- **风险提示** — ZH: 风险提示：本网站所示信息以正式协议及当地监管规定为准；支付服务的具体可用范围、费率与到账时间，请与我们的团队确认。 / TW: 風險提示：本網站所示信息以正式協議及當地監管規定為準；支付服務的具體可用範圍、費率與到賬時間，請與我們的團隊確認。 / EN: Risk notice: Information on this website is subject to the formal agreement and applicable local regulations. Please confirm service availability, fees and settlement times with our team.

---

## 首页 · HomeView.vue

> 与 [`docs/context-update.md`](./context-update.md) 同步（2026-10-13）。源码：`src/views/HomeView.vue`。

### Hero

视觉：全屏 `hk-skyline.jpg`（`index.html` preload）；无 CTA。

- **品牌** — ADG PAY
- **导语** — ZH: 一个专为跨境企业打造的资金通道平台 / TW: 一個專為跨境企業打造的資金通道平台 / EN: Cross-border payments infrastructure built for global enterprises
- **说明** — ZH: 我们不做“超市型”金融服务，而做“私人银行”级别的稀缺渠道整合者——以深度掌控的顶级牌照网络，为您的每一笔跨境资金，提供精准的专属通路。 / TW: 我們不做「超市型」金融服務，而做「私人銀行」級別的稀缺渠道整合者——以深度掌控的頂級牌照網絡，為您的每一筆跨境資金，提供精準的專屬通路。 / EN: We don’t run a one-size-fits-all financial supermarket. We curate scarce, high-quality licensed corridors—so every transfer has a precise, dedicated path.

### 核心产品（五卡）

- **Kicker** — ZH: 为什么选择 ADG PAY？ / TW: 為什麼選擇 ADG PAY？ / EN: Why choose ADG PAY?
- **H2** — ZH: 为全球化企业打造功能强大的解决方案 / TW: 為全球化企業打造功能強大的解決方案 / EN: Powerful solutions built for global enterprises
- **Lead** — ZH: 从渠道匹配、全球收款到国际付款、灵活换汇与专属咨询，一站式覆盖跨境资金全链路。 / TW: 從渠道匹配、全球收款到國際付款、靈活換匯與專屬諮詢，一站式覆蓋跨境資金全鏈路。 / EN: From corridor matching and global collection to international payouts, FX and dedicated advisory—an end-to-end payments stack for cross-border funds.

| 标题 ZH / EN | 说明 ZH | 说明 EN | 说明 TW | 链接 |
|---|---|---|---|---|
| 渠道匹配 / Corridor Matching | 快速匹配收款与持牌通道 | Match the right collection and licensed payment corridors | 快速匹配收款與持牌通道 | `/products#solutions` |
| 全球收款 / Global Collection | 覆盖超20+国家收款和15类币种 | Collect in 20+ markets across 15+ currencies | 覆蓋超20+國家收款和15類幣種 | `/products#collect` |
| 国际付款 / International Payouts | 向全球供应商与合作伙伴高效完成合规付款 | Pay suppliers and partners worldwide through compliant payout rails | 向全球供應商與合作夥伴高效完成合規付款 | `/products#pay` |
| 灵活换汇 / Flexible FX | 主流币种 7×24 在线换汇，实时报价与全流程风控 | 24/7 FX in major currencies—live rates with end-to-end risk controls | 主流幣種 7×24 在線換匯，實時報價與全流程風控 | `/products#fx` |
| 专属咨询 / Dedicated Advisory | 一对一专属顾问，定制个性化跨境资金方案 | Dedicated advisors who design tailored cross-border payment solutions | 一對一專屬顧問，定制個性化跨境資金方案 | `/contact` |

### 专属方案（手风琴）

- **Kicker** — ZH: 产品与解决方案 / TW: 產品與解決方案 / EN: Products & Solutions
- **底链** — ZH/TW: 了解更多 > / EN: Learn More > → `/contact`
- 非英文界面标题/方案名附带英文副标题；英文界面仅英文。

| # | 困局 ZH / EN | 方案 ZH / EN | 困局说明 ZH | 方案说明 ZH |
|---|---|---|---|---|
| 01 | 开户困局 / Onboarding Friction | 专属咨询 / Dedicated Advisory | 漫长的开户排期、反复的合规问询、多头对接的沟通成本 | 签署保密协议，深入梳理您的业务模式、交易币种、额度与目的地，直接呈上有效的渠道，匹配最适合您背景的账户。 |
| 02 | 渠道单一 / Single-Corridor Constraints | 渠道匹配 / Corridor Matching | 单一机构的汇率、时效与风控，难以满足多元且动态的资金需求。 | 为您搭建 “1+N” 多渠道组合，自由路由、分散风险、捕捉最优资金路径；推荐最优产品与解决方案和全程服务。 |
| 03 | 服务真空 / Service Gaps | 持续运营 / Ongoing Operations | 邮件来回数天、问题跟进缓慢，关键时刻求助无门 | 每位客户配备专属资金管家，直接对接决策层，渠道问题 24 小时内介入协调；账户启用后持续提供多币种收款、跨境付款与渠道关系维护。 |

### 关于我们 + 通道数据

- **Kicker** — ZH: 关于我们 / TW: 關於我們 / EN: About Us
- **H2** — ZH: 专注跨境企业，更懂你的业务 / TW: 專注跨境企業，更懂你的業務 / EN: Focused on Cross-border Enterprises, We Understand Your Business
- **Lead** — ZH: ADG PAY 持有多地支付牌照，面向跨境集团、跨境电商、外贸出口与 SaaS 等企业，提供全球收款、国际和本土付款以及多币种换汇与结算等服务。 / TW: ADG PAY 持有多地支付牌照，面向跨境集團、跨境電商、外貿出口與 SaaS 等企業，提供全球收款、國際和本土付款以及多幣種換匯與結算等服務。 / EN: ADG PAY holds payment licences across multiple regions and serves enterprises such as cross-border groups, e-commerce, trade export and SaaS with global collection, international and local payouts, and multi-currency FX and settlement.
- **CTA** — ZH/TW: 了解更多 > / EN: Learn More > → `/about`

| 数值 | 说明 ZH | 说明 EN | 说明 TW |
|---|---|---|---|
| 30+ | 深度合作的香港及海外持牌银行与 MSO 机构 | Licensed bank and MSO partners across Hong Kong and overseas | 深度合作的香港及海外持牌銀行與 MSO 機構 |
| 200+ | 已建立专属资金通道的企业客户 | Enterprise clients with dedicated payment corridors | 已建立專屬資金通道的企業客戶 |
| 0 | 公开泄露的客户信息（严格保密协议全面执行） | Public client-data breaches (mutual NDAs enforced) | 公開泄露的客戶信息（嚴格保密協議全面執行） |
| 60% | 平均为客户节省的对公开户与合规沟通时间 | Average time saved on public onboarding and compliance coordination | 平均為客戶節省的對公開戶與合規溝通時間 |

### 合规与安全（首页面板）

> **状态：** 已从首页移除（内容仍见 `/compliance`）。

---

## 首页组件 · FlagMarquee.vue（覆盖地区）

> **状态：** 组件仍在仓库，**当前未挂载到** `HomeView` / `App`。下列为组件内地区名（若重新挂载可用）。

| ZH | TW | EN |
|---|---|---|
| 香港 | 香港 | Hong Kong |
| 新加坡 | 新加坡 | Singapore |
| 台湾 | 台灣 | Taiwan |
| 韩国 | 韓國 | South Korea |
| 澳大利亚 | 澳大利亞 | Australia |
| 加拿大 | 加拿大 | Canada |
| 南非 | 南非 | South Africa |
| 法国 | 法國 | France |
| 意大利 | 意大利 | Italy |
| 阿联酋 | 阿聯酋 | UAE |
| 美国 | 美國 | United States |
| 英国 | 英國 | United Kingdom |
| 日本 | 日本 | Japan |
| 马来西亚 | 馬來西亞 | Malaysia |
| 泰国 | 泰國 | Thailand |
| 印度尼西亚 | 印度尼西亞 | Indonesia |
| 德国 | 德國 | Germany |
| 荷兰 | 荷蘭 | Netherlands |
| 菲律宾 | 菲律賓 | Philippines |
| 越南 | 越南 | Vietnam |
| 新西兰 | 新西蘭 | New Zealand |
| 瑞士 | 瑞士 | Switzerland |

---

## 首页组件 · HeroVisual.vue（装饰 UI，仅中文）

> **状态：** 组件仍在仓库，**当前未挂载到** `HomeView`（首页 Hero 为 `hk-skyline` 全屏图）。

| ZH | TW |
|---|---|
| 跨境结算 | 跨境結算 |
| 实时入账 | 實時入賬 |
| 多币种收款账户 | 多幣種收款賬戶 |
| 本地收款 · 统一结算至 HKD | 本地收款 · 統一結算至 HKD |
| 今日净流入 | 今日淨流入 |

---

## 产品页 · ProductsView.vue

### Hero

- **H1** — ZH: 您全球业务背后的专属资金通道 / TW: 您全球業務背後的專屬資金通道 / EN: The dedicated payment infrastructure behind your global business
- **Lead** — ZH: 依托持牌资质与主流银行渠道，我们提供覆盖开户、收款、付款及换汇的一站式跨境资金服务。跨境合规与资金安全由专业团队保障，企业得以专注全球业务拓展。 / TW: 依托持牌資質與主流銀行渠道，我們提供覆蓋開戶、收款、付款及換匯的一站式跨境資金服務。跨境合規與資金安全由專業團隊保障，企業得以專注全球業務拓展。 / EN: Backed by licensed credentials and major banking partners, we deliver one-stop cross-border payment services spanning account opening, collection, payouts and FX. Our specialists safeguard compliance and fund security—so you can focus on growing globally.
- 无 kicker / 无 Hero CTA。

### 行业专属方案 `#solutions`

- **H2** — ZH: 为不同业务形态，量身定制的专属方案。 / TW: 爲不同業務形態，量身定制的專屬方案。 / EN: Tailored solutions for different business models.
- **Tabs / 卡片 id：** `b2b` · `digital` · `family`（hash 别名 `#trade`/`#ecom`→b2b、`#saas`→digital）
- **组标题** — ZH: 适用客户 / 核心价值 / TW: 適用客戶 / 核心價值 / EN: Target clients / Core value
- **卡内 CTA** — ZH: 预约咨询 / TW: 預約諮詢 / EN: Book a consultation → `/contact`

#### b2b · 外贸 B2B 供应链企业 / B2B Trade & Supply Chain

- **Lead** — ZH: 面向大额贸易货款收付场景，以时效与汇率成本可控为核心，保障供应链资金不断链。 / EN: Built for large trade pay-ins and payouts—keeping settlement speed and FX costs under control so supply-chain liquidity stays intact. / TW: 面向大額貿易貨款收付場景，以時效與匯率成本可控為核心，保障供應鏈資金不斷鏈。
- **适用客户** — 大额贸易货款收付；对到账时效与汇率成本极其敏感
- **核心价值** — TT 收款专户；大额付款走专设绿通；避免银行合规反复问询；保障供应链资金不断链

#### digital · 服务贸易与数字企业 / Services Trade & Digital Businesses

- **Lead** — ZH: 针对软件服务、咨询费、版权金等无形贸易收款，匹配理解行业的持牌通道，收款更稳、合规更顺。 / EN: For intangible receipts—software, consulting and royalties—matched to licensed corridors that understand the sector, for more stable and compliant collection. / TW: 針對軟件服務、諮詢費、版權金等無形貿易收款，匹配理解行業的持牌通道，收款更穩、合規更順。
- **适用客户** — 软件服务、咨询费、版权金等无形贸易收款；易被传统银行拒收或反复核查
- **核心价值** — 匹配理解该行业的特选 MSO 或银行渠道；确保收款稳定合规；支持支付海外人员薪酬

#### family · 投资控股与家族办公室 / Investment Holding & Family Offices

- **Lead** — ZH: 服务资本项下资金调度，以授权可控为前提，构建定制化账户与渠道体系。 / EN: Capital-account fund movements under strict authorisation—custom accounts and payment corridors built around your controls. / TW: 服務資本項下資金調度，以授權可控為前提，構建定制化賬戶與渠道體系。
- **适用客户** — 资本项下资金调度；授权与信息管控要求高
- **核心价值** — 完全定制化的渠道组合；多层级账户体系；专人专办全程跟进；操作记录严格在授权范围内流转

### 服务与渠道 `#services`（`#collect` / `#pay` / `#fx`）

区头以源码 `#services` 为准。三卡：

| key | 标题 ZH / EN | 副标 ZH | 正文要点 ZH |
|---|---|---|---|
| collect | 全球收款 / Global Collection | 全球账户，多币种收款 / Local accounts, multi-currency collection | 面向跨境企业，在主要市场提供本地账户与多币种收款，支持多种贸易模式下的资金流入，全球收付加速，资金在同一平台合规管理 |
| pay | 国际付款 / International Payouts | 智能路由，静默直达 / Intelligent routing, seamless delivery | 跨渠道拆分支付指令；银行间最优路径；专属管家同步进度 |
| fx | 灵活换汇 / Flexible FX | 7×24 在线换汇，实时报价 / 24/7 online FX with live rates | 主流币种 7×24 在线换汇，一键操作、实时报价、聚合多家持牌机构汇率、全流程风控，让企业跨境兑换更便捷、更透明、更安全。 |

### 业务流转 `#workflow`

- **H2** — EN: From account opening to settlement—one clear payments workflow
- **导语** — EN: Around the core of cross-border collection and payout, ADG PAY delivers a connected journey from collection and holding through to settlement—one account suite covering the main fund flows.
- **Aria** — ZH: 资金链路步骤 / TW: 資金鏈路步驟 / EN: Payments workflow steps；上一步 / Previous；下一步 / Next

#### flowSteps

| 标题 ZH | 标题 TW | 标题 EN | 描述 ZH | 描述 TW | 描述 EN |
|---|---|---|---|---|---|
| 开通账户 | 開通賬戶 | Account Opening | 提交资料并完成 KYC 审核 | 提交資料並完成 KYC 審核 | Submit documents and complete KYC |
| 收款 | 收款 | Collection | 本地收款、电汇与订阅收款，覆盖主要进账场景 | 本地收款、電匯與訂閱收款，覆蓋主要進賬場景 | Local, wire and subscription collection for major inbound flows |
| 持有 | 持有 | Hold | 多币种余额管理，按需持有结算币种 | 多幣種餘額管理，按需持有結算幣種 | Manage multi-currency balances; hold settlement currencies as needed |
| 币种兑换 | 幣種兌換 | FX | 将余额兑换为所需结算币种 | 將餘額兌換為所需結算幣種 | Convert balances into the required settlement currency |
| 付款 | 付款 | Payout | 供应商付款，流程留痕可审计 | 供應商付款，流程留痕可審計 | Supplier payouts with audit-ready records |

（页末「客户好评」CTA 区块已移除。）

---

## 关于我们 · AboutView.vue

### Hero

- **H1** — ZH: 专注跨境企业，更懂你的业务伙伴 / TW: 專注跨境企業，更懂你的業務夥伴 / EN: Built for cross-border enterprises—a partner that understands your business
- **Lead 1** — ZH: ADG PAY 持有多地支付牌照，面向跨境集团、跨境电商、外贸出口与 SaaS 等企业，提供全球收款、国际和本土付款以及多币种换汇与结算等服务。 / TW: ADG PAY 持有多地支付牌照，面向跨境集團、跨境電商、外貿出口與 SaaS 等企業，提供全球收款、國際和本土付款以及多幣種換匯與結算等服務。 / EN: ADG PAY holds payment licences across multiple regions and serves cross-border groups, e-commerce, trade exporters and SaaS companies with global collection, international and local payouts, and multi-currency FX and settlement.
- **Lead 2** — ZH: 合规金融，不止服务大型企业。我们整合牌照优势、透明费率与本地化服务，助力跨境中小企业便捷启用、成本可控、安心托付。 / TW: 合規金融，不止服務大型企業。我們整合牌照優勢、透明費率與本地化服務，助力跨境中小企業便捷啓用、成本可控、安心託付。 / EN: Compliant financial services should not be reserved for large enterprises alone. We combine licensing strength, transparent pricing and localised support so cross-border SMEs can onboard efficiently, control costs and operate with confidence.
- **要点**
  - ZH: 亚太、北美、澳洲、欧洲以及南非等地持牌经营 / TW: 亞太、北美、澳洲、歐洲以及南非等地持牌經營 / EN: Licensed operations across Asia-Pacific, North America, Australia, Europe and South Africa
  - ZH: 聚焦跨境企业贸易、电商和SaaS服务等真实场景 / TW: 聚焦跨境企業貿易、電商和SaaS服務等真實場景 / EN: Focused on real use cases in cross-border trade, e-commerce and SaaS
  - ZH: 多语言团队，多时区客户服务支持 / TW: 多語言團隊，多時區客戶服務支持 / EN: Multilingual team with multi-timezone client support
- 无「我们的定位」kicker。

### 使命 `#mission`

- **H2** — ZH/TW: 使命 | Mission / EN: Mission
- **P1** — ZH: 为跨境企业提供高效便捷的全球资金方案，打通资金流转的显性及隐性壁垒。 / TW: 為跨境企業提供高效便捷的全球資金方案，打通資金流轉的顯性及隱性壁壘。 / EN: Deliver efficient, reliable global payment solutions for cross-border enterprises—and remove both visible and hidden barriers in fund flows.
- **P2** — ZH: 真正的便捷，源自对顶级渠道的深度把控，坚守不容妥协的合规安全底线。 / TW: 真正的便捷，源自對頂級渠道的深度把控，堅守不容妥協的合規安全底線。 / EN: True convenience comes from deep mastery of top-tier corridors—and an uncompromising compliance and security baseline.

### 我们的优势 `#advantage`

- **H2** — ZH: 我们的优势 / TW: 我們的優勢 / EN: Our Strengths
- **Lead** — ZH: 我们以合规为基石、以专业为驱动，凭借对渠道的深度把控与管家式专属服务，持续为客户构筑稳健、可控的跨境资金通路。 / TW: 我們以合規為基石、以專業為驅動，憑藉對渠道的深度把控與管家式專屬服務，持續為客戶構築穩健、可控的跨境資金通路。 / EN: With compliance as our foundation and expertise as our drive, we combine deep corridor control with dedicated relationship management to build steady, controllable cross-border payment rails for clients.

| 标题 ZH | 标题 TW | 标题 EN | 正文 ZH | 正文 EN |
|---|---|---|---|---|
| 全球化跨境支付网络 | 全球化跨境支付網絡 | Global Cross-border Payment Network | 核心创始团队拥有大型银行、支付行业资深从业背景，具备多元金融专业能力；携手一众拥有行业影响力的生态伙伴，为客户打造一体化、高价值的综合解决方案与全流程服务。 | Our founding team brings senior experience from major banks and the payments industry, with multidisciplinary financial expertise. Together with influential ecosystem partners, we deliver integrated, high-value solutions and end-to-end service. |
| 专业合规团队 | 專業合規團隊 | Professional Compliance Team | 团队深度洞悉跨境业务场景，始终恪守不容逾越的合规准则，以安全合规为核心，为大、中小型企业客户打造全链路稳健的账户管理与支付体验。 | We understand cross-border business scenarios in depth and uphold non-negotiable compliance standards. With safety and compliance at the core, we deliver robust end-to-end account management and payment experiences for enterprises of all sizes. |
| 管家式文化 | 管家式文化 | Concierge-level Service Culture | 全流程专属管家服务——我们为每位客户配备专属客户经理，业务咨询将于工作日内获得快速响应，无需等候通用客服队列。 | End-to-end dedicated service—each client is assigned a relationship manager, and business inquiries receive a prompt response within business days, without waiting in a general support queue. |

（「发展足迹」时间线与页末 About CTA 已移除。）

### 核心团队 `#team`

- **H2** — ZH: 务实而有经验的团队 / TW: 務實而有經驗的團隊 / EN: A pragmatic, experienced team
- **P** — ZH: 核心成员来自支付、风控与跨境贸易领域，对跨境企业的经营痛点有切身体会。 / TW: 核心成員來自支付、風控與跨境貿易領域，對跨境企業的經營痛點有切身體會。 / EN: Core members come from payments, risk and cross-border trade, with first-hand understanding of the challenges enterprises face.

| 角色 ZH | 角色 TW | 角色 EN | 描述 ZH | 描述 EN |
|---|---|---|---|---|
| 管理 / 战略 | 管理 / 戰略 | Management / Strategy | 负责合规方向与整体经营，确保业务在监管框架内稳健运行。 | Sets compliance direction and overall operations, keeping the business running steadily within the regulatory framework. |
| 风控 / 合规 | 風控 / 合規 | Risk / Compliance | 统筹 KYC、AML 与交易监控，守住资金与合规底线。 | Owns KYC, AML and transaction monitoring—safeguarding funds and the compliance baseline. |
| 技术与产品 | 技術與產品 | Technology & Product | 打磨收款、结算与对账体验，让系统稳定好用。 | Refines collection, settlement and reconciliation so the platform stays stable and easy to use. |
| 客户成功 | 客戶成功 | Customer Success | 一对一 客户经理，陪伴开户与日常使用全过程。 | A dedicated account manager supports onboarding and day-to-day operations end to end. |

### 监管资质 `#license`

- **H2** — ZH/TW: 香港 MSO 牌照 / EN: Hong Kong MSO Licence
- **P1** — ZH: MSO牌照由香港海关发出，涵盖货币兑换与汇款服务。 / TW: MSO牌照由香港海關發出，涵蓋貨幣兌換與匯款服務。 / EN: The Money Service Operator licence is issued by Hong Kong Customs, covering currency exchange and remittance services.
- **P2** — ZH: 持牌意味着我们须遵守AML、客户尽职审查与客户资金处理等相关规定，并接受监管机构的监督。这是我们向客户承诺合规的基础。 / TW: 持牌意味著我們須遵守AML、客戶盡職審查與客戶資金處理等相關規定，並接受監管機構的監督。這是我們向客戶承諾合規的基礎。 / EN: Being licensed means we must comply with AML, customer due diligence and client-fund handling rules, and accept regulator supervision. That is the foundation of our compliance commitment to clients.
- **按钮** — ZH: 了解合规与安全 / TW: 了解合規與安全 / EN: Learn about Compliance & Security → `/compliance`

---

## 合规与安全 · ComplianceView.vue

### Hero

- **H1** — ZH: 隐私与安全，是我们服务的基础设施 / TW: 隱私與安全，是我們服務的基礎設施 / EN: Privacy and security are the infrastructure of our service
- **要点**
  - ZH: 签署双向 NDA，所有商业数据在传输与存储全程加密。 / TW: 簽署雙向 NDA，所有商業數據在傳輸與存儲全程加密。 / EN: Mutual NDAs; all business data uses encryption in transit and at rest.
  - ZH: 客户档案分片管理。 / TW: 客戶檔案分片管理。 / EN: Client files are sharded.
  - ZH: 您的企业成长故事不会成为我们营销案例，除非获得明确授权 / TW: 您的企業成長故事不會成為我們營銷案例，除非獲得明確授權 / EN: Your enterprise growth story will not become our marketing case unless we have explicit authorization.
- 无 kicker / 无 Hero CTA。

### 合规框架 `#framework`

- **H2** — ZH: 在监管之下开展业务 / TW: 在監管之下開展業務 / EN: Operating Under Regulation
- **P** — ZH: 我们持有香港 MSO 牌照，受香港海关监管，遵守AML与客户尽职审查等相关规定。 / TW: 我們持有香港 MSO 牌照，受香港海關監管，遵守AML與客戶盡職審查等相關規定。 / EN: We hold a Hong Kong MSO licence, supervised by Hong Kong Customs, and comply with anti-money laundering and customer due diligence rules.

| 标题 ZH | 标题 TW | 标题 EN | 正文 ZH | 正文 TW | 正文 EN |
|---|---|---|---|---|---|
| 持牌经营 | 持牌經營 | Licensed Operations | MSO牌照由香港海关发出，经营受监管约束，并接受监督。 | MSO牌照由香港海關發出，經營受監管約束，並接受監督。 | The Money Service Operator licence is issued by Hong Kong Customs; operations are regulated and supervised. |
| 客户尽调 | 客戶盡調 | Client Due Diligence | 为每一位客户进行完整的客户尽调，为每一笔收付款进行合规风控，保障客户交易顺畅，资金更安全。 | 為每一位客戶進行完整的客戶盡調，為每一筆收付款進行合規風控，保障客戶交易順暢，資金更安全。 | We conduct full client due diligence for every customer and compliance risk controls for every collection and payout—keeping transactions smooth and funds safer. |
| 风控审查 | 風控審查 | Risk Review | 建立AML制度与可疑交易识别流程，配合监管要求报送。 | 建立AML制度與可疑交易識別流程，配合監管要求報送。 | Establish an anti-money laundering system and suspicious transaction identification process, reporting per regulatory requirements. |

### 数据安全 `#privacy`

- **H2** — ZH: 保护你的数据与隐私 / TW: 保護你的數據與隱私 / EN: Protect Your Data & Privacy

| 标题 ZH | 标题 TW | 标题 EN | 正文 ZH | 正文 TW | 正文 EN |
|---|---|---|---|---|---|
| 传输与存储加密 | 傳輸與存儲加密 | Encryption in Transit & Storage | 采用行业通用的加密技术保护数据传输与存储，降低信息泄露风险。 | 採用行業通用的加密技術保護數據傳輸與存儲，降低信息洩露風險。 | Use industry-standard encryption to protect data in transit and at rest, reducing information leakage risk. |
| 最小权限访问 | 最小權限訪問 | Least-privilege Access | 内部采用基于角色的访问控制，仅授权人员在必要范围内接触数据。 | 內部採用基於角色的訪問控制，僅授權人員在必要範圍內接觸數據。 | Role-based internal access control ensures only authorized personnel access data within necessary scope. |
| 操作留痕 | 操作留痕 | Operation Logging | 关键操作记录日志，便于审计与追溯，提升整体可问责性。 | 關鍵操作記錄日誌，便於審計與追溯，提升整體可問責性。 | Key operations are logged for audit and traceability, improving overall accountability. |
| 持续监测 | 持續監測 | Continuous Monitoring | 对系统进行安全监测与定期评估，及时发现并处置异常。 | 對系統進行安全監測與定期評估，及時發現並處置異常。 | Continuously monitor and periodically assess the system to detect and handle anomalies promptly. |

### 风控体系 `#risk`

- **H2** — ZH: 多层风控，守护每笔资金 / TW: 多層風控，守護每筆資金 / EN: Multi-layer Risk Control, Safeguarding Every Fund
- **P** — ZH: 从开户到交易，每个环节为客户进行风控保障，使用更安心 / TW: 從開戶到交易，每個環節為客戶進行風控保障，使用更安心 / EN: From onboarding to transactions, risk controls at every stage give customers greater peace of mind.

| # | 标题 ZH | 标题 TW | 标题 EN | 正文 ZH | 正文 TW | 正文 EN |
|---|---|---|---|---|---|---|
| 01 | 准入审核 | 准入審核 | Access Review | 开户 KYC 与业务背景核验，筛除高风险主体。 | 開戶 KYC 與業務背景核驗，篩除高風險主體。 | Onboarding KYC and business background checks filter out high-risk entities. |
| 02 | 交易监控 | 交易監控 | Transaction Monitoring | 对交易进行规则与人工结合的风险识别。 | 對交易進行規則與人工結合的風險識別。 | Combine rule-based and manual risk identification for transactions. |
| 03 | 异常复核 | 異常複核 | Exception Review | 对可疑交易启动复核与必要的限制措施。 | 對可疑交易啟動複核與必要的限制措施。 | Initiate review and necessary restrictions for suspicious transactions. |
| 04 | 合规报送 | 合規報送 | Compliance Reporting | 依监管要求履行可疑交易识别与报送义务。 | 依監管要求履行可疑交易識別與報送義務。 | Fulfill suspicious transaction identification and reporting obligations per regulatory requirements. |

### 资金隔离 `#funds`

- **H2** — ZH: 客户资金隔离存放 / TW: 客戶資金隔離存放 / EN: Client Funds Segregated Custody
- **P** — ZH: 客户资金与公司自有资金分离管理，按牌照与监管要求以隔离方式存放，降低资金被挪用的风险。 / TW: 客戶資金與公司自有資金分離管理，按牌照與監管要求以隔離方式存放，降低資金被挪用的風險。 / EN: Client funds are managed separately from company own funds and held in segregated custody per licence and regulatory requirements, reducing misappropriation risk.

| Label ZH | Label TW | Label EN | Value ZH | Value TW | Value EN |
|---|---|---|---|---|---|
| 账户隔离 | 賬戶隔離 | Account Segregation | 客户 / 自有分离 | 客戶 / 自有分離 | Client / Own Funds Separated |
| 存放方式 | 存放方式 | Custody Method | 隔离存放（受监管） | 隔離存放（受監管） | Segregated Custody (Regulated) |
| 用途限制 | 用途限制 | Usage Restriction | 仅用于客户指令 | 僅用於客戶指令 | Used Only for Client Instructions |
| 审计 | 審計 | Audit | 定期核对与留存 | 定期核對與留存 | Periodic Reconciliation & Retention |

（页末 Compliance CTA 已移除。）

---

## 帮助中心 · FaqView.vue

### Hero

- **H1** — ZH: 帮助中心 / TW: 幫助中心 / EN: Help Center
- **Lead** — ZH: 关于开户、费率、收款与合规的常见问题都在这里。 / TW: 關於開戶、費率、收款與合規的常見問題都在這裡。 / EN: Common questions about onboarding, fees, collection and compliance are all here.
- **按钮** — ZH: 联系客服 / TW: 聯繫客服 / EN: Contact Support → `/contact`

### 快速入口 `#guide`

- **H2** — ZH: 从一份指引开始 / TW: 從一份指引開始 / EN: Start with a Guide
- **P** — ZH: 先跳到你关心的主题，或直接浏览下方常见问题。 / TW: 先跳到你關心的主題，或直接瀏覽下方常見問題。 / EN: Jump to the topic you need, or browse the FAQ below.

| 标题 ZH | 标题 TW | 标题 EN | 描述 ZH | 描述 TW | 描述 EN |
|---|---|---|---|---|---|
| 开户指南 | 開戶指南 | Account Opening Guide | 所需资料、审核流程与预计时长一览。 | 所需資料、審核流程與預計時長一覽。 | Required documents, review process and estimated timeline at a glance. |
| 收款操作指引 | 收款操作指引 | Collection Guide | 如何获取收款账户、发起与核对收款。 | 如何獲取收款賬戶、發起與核對收款。 | How to get a collection account, initiate and reconcile collections. |
| 安全与合规说明 | 安全與合規說明 | Security & Compliance | 了解我们的合规框架与资金安全措施。 | 了解我們的合規框架與資金安全措施。 | Learn about our compliance framework and fund security measures. |

### FAQ 区头

- **H2** — ZH: 你可能想了解 / TW: 你可能想了解 / EN: Things You May Want to Know

### 开户相关 / Account Opening

**Q1**
- **ZH:** 开通账户需要哪些资料？
- **TW:** 開通賬戶需要哪些資料？
- **EN:** What documents are required to open an account?
- **A ZH:** 通常需要企业注册文件、受益所有人信息、业务说明与银行账户资料等。具体清单以开户表单与 KYC 要求为准，资料越齐全审核越快。
- **A TW:** 通常需要企業註冊文件、受益所有人信息、業務說明與銀行賬戶資料等。具體清單以開戶表單與 KYC 要求為準，資料越齊全審核越快。
- **A EN:** Usually corporate registration documents, beneficial owner information, business description and bank account details, etc. The exact list depends on the onboarding form and KYC requirements; more complete documents mean faster review.

**Q2**
- **ZH:** 开户审核需要多久？
- **TW:** 開戶審核需要多久？
- **EN:** How long does account review take?
- **A ZH:** 在资料完整的情况下，通常数个工作日内完成。复杂或需补充材料的个案会相应延长，客户经理会同步进度。
- **A TW:** 在資料完整的情況下，通常數個工作日內完成。複雜或需補充材料的個案會相應延長，客戶經理會同步進度。
- **A EN:** With complete documents, usually within a few business days. Complex cases or those needing supplemental materials take longer; the account manager will keep you updated.

**Q3**
- **ZH:** 个人可以开户吗？
- **TW:** 個人可以開戶嗎？
- **EN:** Can individuals open an account?
- **A ZH:** 当前服务主要面向企业客户（如跨境电商、外贸与 SaaS 公司）。个人业务以正式说明为准。
- **A TW:** 當前服務主要面向企業客戶（如跨境電商、外貿與 SaaS 公司）。個人業務以正式說明為準。
- **A EN:** Current services mainly target corporate clients (e.g., cross-border e-commerce, trade and SaaS companies). Individual services are subject to official notice.

### 费率与结算 / Fees & Settlement

**Q1**
- **ZH:** 费率是如何计算的？
- **TW:** 費率是如何計算的？
- **EN:** How are fees calculated?
- **A ZH:** 费率通常由收款/付款手续费与换汇点差组成。我们以透明方式在开户前告知，具体以你的行业、币种与交易量为准。
- **A TW:** 費率通常由收款/付款手續費與換匯點差組成。我們以透明方式在開戶前告知，具體以你的行業、幣種與交易量為準。
- **A EN:** Fees usually consist of collection/payment handling fees and FX spread. We disclose them transparently before onboarding; specifics depend on your industry, currency and volume.

**Q2**
- **ZH:** 支持哪些币种结算？
- **TW:** 支持哪些幣種結算？
- **EN:** Which currencies can be settled?
- **A ZH:** 支持多种主流结算币种（如 USD、EUR、GBP、HKD 等），具体可结算币种以账户开通时的服务范围为准。
- **A TW:** 支持多種主流結算幣種（如 USD、EUR、GBP、HKD 等），具體可結算幣種以賬戶開通時的服務範圍為準。
- **A EN:** Multiple major settlement currencies are supported (e.g., USD, EUR, GBP, HKD); the exact settlable currencies depend on the service scope at account opening.

**Q3**
- **ZH:** 资金一般多久到账？
- **TW:** 資金一般多久到賬？
- **EN:** How long does funding usually take to arrive?
- **A ZH:** 到账时间取决于币种、通道与合规审核，部分通道可较快到账。实际时效以交易时的提示与协议约定为准。
- **A TW:** 到賬時間取決於幣種、通道與合規審核，部分通道可較快到賬。實際時效以交易時的提示與協議約定為準。
- **A EN:** Arrival time depends on currency, channel and compliance review; some channels are faster. Actual timing is per the transaction prompt and agreement.

### 全球账户与操作 / Global Account & Operations

**Q1**
- **ZH:** 全球账户申请后可以查看哪些信息？
- **TW:** 全球賬戶申請後可以查看哪些信息？
- **EN:** What information can I view after applying for a global account?
- **A ZH:** 可以在已开通的服务范围内查看账户地区、币种、账号信息和当前状态；申请记录用于跟进开通进度，具体可用功能以账户页面实际展示为准。
- **A TW:** 可以在已開通的服務範圍內查看賬戶地區、幣種、賬號信息和當前狀態；申請記錄用於跟進開通進度，具體可用功能以賬戶頁面實際展示為準。
- **A EN:** Within the activated service scope you can view account region, currency, account number and current status; application records track onboarding progress; actual features are per the account page.

**Q2**
- **ZH:** 如何核对收款和入账凭证？
- **TW:** 如何核對收款和入賬憑證？
- **EN:** How do I reconcile collections and entry vouchers?
- **A ZH:** 在收款记录中按账户、币种或时间筛选交易，确认入账后可在入账凭证管理中查看或留存对应凭证，实际下载权限以账户服务范围为准。
- **A TW:** 在收款記錄中按賬戶、幣種或時間篩選交易，確認入賬後可在入賬憑證管理中查看或留存對應憑證，實際下載權限以賬戶服務範圍為準。
- **A EN:** Filter transactions by account, currency or time in collection records; after confirming credit, view or retain the corresponding voucher in voucher management; actual download rights depend on account service scope.

**Q3**
- **ZH:** 支持团队可以用英文沟通吗？
- **TW:** 支持團隊可以用英文溝通嗎？
- **EN:** Can the support team communicate in English?
- **A ZH:** 可以。支持团队可使用中文和英文处理开户、KYC、账户申请、收款核对、兑换和付款状态跟进。提交咨询时请注明偏好语言。
- **A TW:** 可以。支持團隊可使用中文和英文處理開戶、KYC、賬戶申請、收款核對、兌換和付款狀態跟進。提交諮詢時請註明偏好語言。
- **A EN:** Yes. The support team can handle onboarding, KYC, account application, collection verification, exchange and payment status follow-up in Chinese and English. Please indicate your preferred language when submitting an inquiry.

### 合规与安全 / Compliance & Security

**Q1**
- **ZH:** 你们有支付牌照吗？
- **TW:** 你們有支付牌照嗎？
- **EN:** Do you have a payment licence?
- **A ZH:** 我们持有香港MSO牌照，受香港海关监管。牌照编号与登记信息见「关于我们 - 牌照资质」页面。
- **A TW:** 我們持有香港MSO牌照，受香港海關監管。牌照編號與登記信息見「關於我們 - 牌照資質」頁面。
- **A EN:** We hold a Hong Kong Money Service Operator (MSO) licence, supervised by Hong Kong Customs. Licence number and registration details are on the 'About Us – Licence' page.

**Q2**
- **ZH:** 我的资金安全如何保障？
- **TW:** 我的資金安全如何保障？
- **EN:** How is my fund security ensured?
- **A ZH:** 客户资金与公司自有资金隔离存放，系统采用加密与访问控制等安全措施。详见「合规与安全」页面。
- **A TW:** 客戶資金與公司自有資金隔離存放，系統採用加密與訪問控制等安全措施。詳見「合規與安全」頁面。
- **A EN:** Client funds are segregated from company own funds, and the system uses encryption and access control. See the 'Compliance & Security' page.

**Q3**
- **ZH:** 为什么有时需要补充材料？
- **TW:** 為什麼有時需要補充材料？
- **EN:** Why are supplemental documents sometimes required?
- **A ZH:** 为履行 KYC 与AML义务，我们会就交易背景进行核验。补充材料是合规流程的一部分，旨在保护双方资金安全。
- **A TW:** 為履行 KYC 與AML義務，我們會就交易背景進行核驗。補充材料是合規流程的一部分，旨在保護雙方資金安全。
- **A EN:** To meet KYC and anti-money laundering obligations, we verify transaction backgrounds. Supplemental documents are part of compliance, protecting both parties' fund security.

（页末 FAQ CTA 已移除。）

---

## 联系我们 · ContactView.vue

### Hero

- **H1** — ZH: 联系我们 / TW: 聯繫我們 / EN: Contact Us
- **Lead** — ZH: 留下信息，我们的团队会尽快与你联系。 / TW: 留下信息，我們的團隊會儘快與你聯繫。 / EN: Leave your details and our team will get back to you soon.
- **按钮** — ZH: 留下你的需求 / TW: 留下你的需求 / EN: Leave Your Details → `#contact-form`
- 无「本地团队服务」kicker。

### 侧栏 · 联系方式

- **Kicker** — ZH: 联系方式 / TW: 聯繫方式 / EN: Contact Details
- 客服/合作邮箱、办公地址等由 `GET /api/config`（`system_config_items`）驱动；空则用 `siteConfigDefaults` 兜底。
- **服务时间** — ZH: 周一至周五 9:00–18:00（香港时间） / TW: 周一至周五 9:00–18:00（香港時間） / EN: Monday to Friday 9:00–18:00 (Hong Kong Time)

### 侧栏 · 中英双语

- **P** — ZH: 支持团队可使用中文与英文处理开户咨询、KYC 资料沟通、全球账户申请、收款核对、币种兑换及付款状态跟进。 / TW: 支持團隊可使用中文與英文處理開戶諮詢、KYC 資料溝通、全球賬戶申請、收款核對、幣種兌換及付款狀態跟進。 / EN: The support team can handle onboarding consultation, KYC document communication, global account application, collection verification, currency exchange and payment status follow-up in Chinese and English.
- **服务方式** — ZH: 中文 / 英文邮件与在线沟通 / TW: 中文 / 英文郵件與在線溝通 / EN: Chinese / English Email & Online Communication
- **脚注** — ZH: 以上为我们的常用联系方式，欢迎随时来信或到访。 / TW: 以上爲我們的常用聯繫方式，歡迎隨時來信或到訪。 / EN: The above are our common contact details; feel free to write or visit anytime.

### 表单

- **H2** — ZH: 留下你的需求 / TW: 留下你的需求 / EN: Leave Your Details
- **Lead** — ZH: 带 * 为必填项。 / TW: 帶 * 為必填項。 / EN: Fields marked with an asterisk (*) are required.

| 字段 | Label ZH | Label TW | Label EN | Placeholder ZH | Placeholder TW | Placeholder EN |
|---|---|---|---|---|---|---|
| name | 姓名 | 姓名 | Name | 您的称呼 | 您的稱呼 | Your name |
| company | 公司名称 | 公司名稱 | Company Name | 企业全称 | 企業全稱 | Company legal name |
| phone | 联系电话 | 聯繫電話 | Phone | 含区号 | 含區號 | Include country code |
| email | 邮箱 | 郵箱 | Email | 请输入邮箱地址 | 請輸入郵箱地址 | name@company.com |
| industry | 行业场景 | 行業場景 | Industry / Use Case | — | — | — |
| message | 需求说明 | 需求說明 | Inquiry Details | 请简要描述您的收款/付款场景与需求 | 請簡要描述您的收款/付款場景與需求 | Briefly describe your collection/payment scenario and needs |

#### 行业场景选项

- ZH: 请选择 / TW: 請選擇 / EN: Please select
- ZH: 货物贸易 / TW: 貨物貿易 / EN: Goods Trade
- ZH: 服务贸易 / TW: 服務貿易 / EN: Services Trade
- ZH: 灵活换汇 / TW: 靈活換匯 / EN: Flexible FX

- **协议说明** — ZH: 提交即表示您同意我们就此次咨询与您联系。我们不会将您的信息用于其他用途。 / TW: 提交即表示您同意我們就此諮詢與您聯繫。我們不會將您的信息用於其他用途。 / EN: By submitting, you agree that we may contact you about this inquiry. We will not use your information for other purposes.

### FM 对象（脚本消息）

| Key | ZH | TW | EN |
|---|---|---|---|
| err | 请完整填写带 * 的必填项，并确保邮箱格式正确。 | 請完整填寫帶 * 的必填項，並確保郵箱格式正確。 | Please complete all required fields (*) and ensure the email format is correct. |
| submitting | 提交中… | 提交中… | Submitting… |
| success | 已收到您的信息，我们会尽快与您联系！ | 已收到您的信息，我們會盡快與您聯繫！ | We have received your information and will contact you shortly! |
| submit | 提交咨询 | 提交諮詢 | Submit Inquiry |
| failPrefix | 提交失败： | 提交失敗： | Submission failed: |
| failDefault | 请稍后重试，或直接邮件联系我们。 | 請稍後重試，或直接郵件聯繫我們。 | Please try again later, or email us directly. |
| net | 网络异常，提交未成功。请稍后重试，或直接邮件联系我们。 | 網絡異常，提交未成功。請稍後重試，或直接郵件聯繫我們。 | Network error, submission failed. Please try again later, or email us directly. |

---

## 加入我们 · PrivacyView.vue（招聘页）

### Hero

- **H1** — ZH: 加入我们 / TW: 加入我們 / EN: Join Us
- **Lead** — ZH: 加入我们，共同打造持牌、透明的跨境支付方案。 / TW: 加入我們，共同打造持牌、透明的跨境支付方案。 / EN: Join us to build licensed, transparent cross-border payment solutions.
- **按钮** — ZH: 职位空缺 / TW: 職位空缺 / EN: Open Roles → `#openings`；ZH: 联系我们 / TW: 聯繫我們 / EN: Contact Us → `/contact`
- 无「就业机会」kicker。

### 我们的价值观 `#values`

- **H2** — ZH: 我们的价值观 / TW: 我們的價值觀 / EN: Our Values
- **Intro** — ZH: 我们凭着在支付与合规方面的专业能力，贴近跨境企业真实需求，提供务实创新的解决方案，帮助客户提升竞争力。 / TW: 我們憑著在支付與合規方面的專業能力，貼近跨境企業真實需求，提供務實創新的解決方案，幫助客戶提升競爭力。 / EN: With expertise in payments and compliance, we stay close to real cross-border needs and deliver practical, innovative solutions for enterprises.

| 标题 ZH | 标题 TW | 标题 EN | 正文 ZH | 正文 TW | 正文 EN |
|---|---|---|---|---|---|
| 愿景 | 願景 | Vision | 通过持牌、稳定的支付能力，让跨境收款与结算更简单。 | 通過持牌、穩定的支付能力，讓跨境收款與結算更簡單。 | Make cross-border collection and settlement simpler through licensed, stable payment capabilities. |
| 创新 | 創新 | Innovation | 持续打磨产品与体验，让客户拥有更清晰的流程与更好用的工具。 | 持續打磨產品與體驗，讓客戶擁有更清晰的流程與更好用的工具。 | We keep refining products and experience so clients get clearer flows and better tools. |
| 可靠 | 可靠 | Reliability | 合规、安全与透明费率，是我们与客户长期合作的基础。 | 合規、安全與透明費率，是我們與客戶長期合作的基礎。 | Compliance, security and transparent fees are the foundation of every client relationship. |
| 决心 | 決心 | Commitment | 面对挑战保持务实与协作，把结果做到客户信得过。 | 面對挑戰保持務實與協作，把結果做到客戶信得過。 | We face challenges together, stay pragmatic, and deliver results clients can trust. |

### 津贴和福利 `#benefits`

- **H2** — ZH: 津贴和福利 / TW: 津貼和福利 / EN: Benefits

| 标题 ZH | 标题 TW | 标题 EN | 描述 ZH | 描述 TW | 描述 EN |
|---|---|---|---|---|---|
| 地点 | 地點 | Location | 香港甲级写字楼，交通便利 | 香港甲級寫字樓，交通便利 | Hong Kong office in a convenient business district |
| 保险 | 保險 | Insurance | 合资格员工享有医疗保障 | 合資格員工享有醫療保障 | Medical coverage for eligible employees |
| 奖金 | 獎金 | Bonus | 酌情年终奖金 | 酌情年終獎金 | Discretionary year-end bonus |
| 职业发展 | 職業發展 | Career | 支付与合规领域的成长空间 | 支付與合規領域的成長空間 | Clear growth path in payments and compliance |

### 职位空缺 `#openings`（动态）

- **H2** — ZH: 现有职位空缺 / TW: 現有職位空缺 / EN: Open Roles
- 列表来自 `GET /api/jobs`（三语字段按当前语言选用）；**无**地区/部门筛选 UI；**无**「我们的业务」区块。
- **空态** — ZH: 当前暂无开放职位。欢迎稍后再来，或通过联系页与我们沟通。 / TW: 當前暫無開放職位。歡迎稍後再來，或通過聯繫頁與我們溝通。 / EN: No open roles right now. Please check back later or contact us.
- 投递表单文案见 `PrivacyView.vue` 的 `LABEL_PACKS`（姓名、邮箱、电话、简历 PDF、自我介绍等）。

### （历史）硬编码岗位摘录

> 下列示例岗位文案已不再写死在前端；仅作参考，以 API / 后台 / `seed.js` 为准。

### 职位 · 前端工程师 / Frontend Engineer

- **类型** — ZH: 全职 / TW: 全職 / EN: Full-time
- **部门** — ZH: 科技部门 / TW: 科技部門 / EN: Technology
- **岗位职责 ZH：**
  1. 负责官网与商户后台的前端开发与体验优化
  2. 与产品、设计协作，落地跨境支付相关页面与交互
  3. 维护组件库与前端工程规范，保障多语言与多端适配
- **岗位职责 TW：**
  1. 負責官網與商戶後台的前端開發與體驗優化
  2. 與產品、設計協作，落地跨境支付相關頁面與交互
  3. 維護組件庫與前端工程規範，保障多語言與多端適配
- **岗位职责 EN：**
  1. Build and improve the website and merchant dashboard frontend
  2. Work with product and design on cross-border payment UX
  3. Maintain component standards, i18n and responsive quality
- **岗位要求 ZH：**
  1. 熟悉 Vue 3 / TypeScript，有实际项目经验
  2. 了解前端性能、无障碍与基础安全实践
  3. 沟通清晰，能独立推进功能交付
- **岗位要求 TW：**
  1. 熟悉 Vue 3 / TypeScript，有實際項目經驗
  2. 了解前端性能、無障礙與基礎安全實踐
  3. 溝通清晰，能獨立推進功能交付
- **岗位要求 EN：**
  1. Solid Vue 3 / TypeScript experience
  2. Aware of performance, accessibility and basic frontend security
  3. Clear communicator who can ship features independently

### 职位 · 后端工程师（支付系统） / Backend Engineer (Payments)

- **类型** — ZH: 全职 / TW: 全職 / EN: Full-time
- **岗位职责 ZH：**
  1. 参与收款、结算与对账相关服务的设计与开发
  2. 对接银行 / 通道接口，保障交易链路稳定与可观测
  3. 编写接口文档与单元测试，参与代码评审
- **岗位职责 TW：**
  1. 參與收款、結算與對賬相關服務的設計與開發
  2. 對接銀行 / 通道接口，保障交易鏈路穩定與可觀測
  3. 編寫接口文檔與單元測試，參與代碼評審
- **岗位职责 EN：**
  1. Design and develop collection, settlement and reconciliation services
  2. Integrate bank / channel APIs with reliable monitoring
  3. Write API docs and tests; participate in code reviews
- **岗位要求 ZH：**
  1. 熟悉 Java 或 Node.js，了解常见数据库与消息队列
  2. 有金融 / 支付 / 清结算相关经验优先
  3. 重视数据一致性、幂等与异常处理
- **岗位要求 TW：**
  1. 熟悉 Java 或 Node.js，了解常見數據庫與消息隊列
  2. 有金融 / 支付 / 清結算相關經驗優先
  3. 重視數據一致性、冪等與異常處理
- **岗位要求 EN：**
  1. Strong Java or Node.js; comfortable with databases and queues
  2. Payments / clearing experience is a plus
  3. Care about consistency, idempotency and failure handling

### 职位 · 合规专员（AML / KYC） / Compliance Officer (AML / KYC)

- **类型** — ZH: 全职 / TW: 全職 / EN: Full-time
- **岗位职责 ZH：**
  1. 执行客户尽职调查（CDD / EDD）与持续监控
  2. 识别可疑交易，协助提交可疑交易报告（STR）相关材料
  3. 维护 AML 政策与操作指引，配合监管检查与内部审计
- **岗位职责 TW：**
  1. 執行客戶盡職調查（CDD / EDD）與持續監控
  2. 識別可疑交易，協助提交可疑交易報告（STR）相關材料
  3. 維護 AML 政策與操作指引，配合監管檢查與內部審計
- **岗位职责 EN：**
  1. Perform CDD / EDD and ongoing monitoring
  2. Escalate suspicious activity and support STR-related work
  3. Maintain AML policies and support regulatory / audit reviews
- **岗位要求 ZH：**
  1. 了解香港《打击洗钱及恐怖分子资金筹集条例》及海关 MSO 监管要求
  2. 具备金融、法律或合规相关学历 / 工作经验
  3. 细心严谨，能独立完成尽调与档案留存
- **岗位要求 TW：**
  1. 了解香港《打擊洗錢及恐怖分子資金籌集條例》及海關 MSO 監管要求
  2. 具備金融、法律或合規相關學歷 / 工作經驗
  3. 細心嚴謹，能獨立完成盡調與檔案留存
- **岗位要求 EN：**
  1. Familiar with Hong Kong AML laws and MSO supervisory expectations
  2. Background in finance, law or compliance preferred
  3. Detail-oriented; able to complete CDD and maintain records

### 职位 · 风控分析师 / Risk Analyst

- **类型** — ZH: 全职 / TW: 全職 / EN: Full-time
- **岗位职责 ZH：**
  1. 监控商户交易行为，识别异常模式与欺诈风险
  2. 制定与优化风控规则，推动系统策略落地
  3. 与合规、运营协作处理高风险案例与客户沟通
- **岗位职责 TW：**
  1. 監控商戶交易行為，識別異常模式與欺詐風險
  2. 制定與優化風控規則，推動系統策略落地
  3. 與合規、運營協作處理高風險案例與客戶溝通
- **岗位职责 EN：**
  1. Monitor merchant activity and spot unusual / fraud patterns
  2. Design and refine risk rules for system enforcement
  3. Collaborate with compliance and operations on high-risk cases
- **岗位要求 ZH：**
  1. 熟悉支付风控、反欺诈或数据分析工具优先
  2. 具备 Excel / SQL 等数据处理能力
  3. 抗压能力强，能快速响应交易异常
- **岗位要求 TW：**
  1. 熟悉支付風控、反欺詐或數據分析工具優先
  2. 具備 Excel / SQL 等數據處理能力
  3. 抗壓能力強，能快速響應交易異常
- **岗位要求 EN：**
  1. Experience in payment risk, anti-fraud or data analysis preferred
  2. Comfortable with Excel / SQL for investigation
  3. Able to respond quickly under operational pressure

### 职位 · 运营专员（商户支持） / Operations Specialist (Merchant Support)

- **类型** — ZH: 全职 / TW: 全職 / EN: Full-time
- **岗位职责 ZH：**
  1. 跟进商户开户、资料补件与日常业务咨询
  2. 协调对账、退款与异常交易的处理进度
  3. 整理运营报表，反馈产品改进建议
- **岗位职责 TW：**
  1. 跟進商戶開戶、資料補件與日常業務諮詢
  2. 協調對賬、退款與異常交易的處理進度
  3. 整理運營報表，反饋產品改進建議
- **岗位职责 EN：**
  1. Support merchant onboarding, document follow-ups and daily inquiries
  2. Coordinate reconciliation, refunds and exception handling
  3. Prepare ops reports and share product improvement feedback
- **岗位要求 ZH：**
  1. 具备客户服务或金融运营经验优先
  2. 中英双语沟通流利，工作条理清晰
  3. 熟悉跨境贸易或支付业务者优先
- **岗位要求 TW：**
  1. 具備客戶服務或金融運營經驗優先
  2. 中英雙語溝通流利，工作條理清晰
  3. 熟悉跨境貿易或支付業務者優先
- **岗位要求 EN：**
  1. Customer service or financial operations experience preferred
  2. Fluent in Chinese and English; highly organized
  3. Cross-border trade or payments exposure is a plus

### 职位 · 结算运营专员 / Settlement Operations Specialist

- **类型** — ZH: 全职 / TW: 全職 / EN: Full-time
- **岗位职责 ZH：**
  1. 负责日终 / 周期结算流程与资金核对
  2. 跟踪通道到账情况，处理延迟与差异
  3. 维护结算台账，配合财务完成对账闭环
- **岗位职责 TW：**
  1. 負責日終 / 週期結算流程與資金核對
  2. 跟蹤通道到賬情況，處理延遲與差異
  3. 維護結算台賬，配合財務完成對賬閉環
- **岗位职责 EN：**
  1. Run daily / periodic settlement and fund checks
  2. Track channel arrivals and resolve delays or mismatches
  3. Maintain settlement ledgers and close the loop with finance
- **岗位要求 ZH：**
  1. 细心、数字敏感，有财务或清算相关经验优先
  2. 熟悉 Excel，能独立排查账务差异
  3. 可接受与结算节奏相关的时效要求
- **岗位要求 TW：**
  1. 細心、數字敏感，有財務或清算相關經驗優先
  2. 熟悉 Excel，能獨立排查賬務差異
  3. 可接受與結算節奏相關的時效要求
- **岗位要求 EN：**
  1. Detail-oriented; finance or clearing experience preferred
  2. Strong Excel skills for variance investigation
  3. Comfortable with time-sensitive settlement cycles

---

## 全局 · CookieConsent.vue

> 挂载于 `App.vue`（非 admin）。Cookie 名 `adgpay-cookie-consent`；隐私与 Cookie 政策链均指向 `/compliance#privacy`。

| 字段 | ZH | TW | EN |
|---|---|---|---|
| 标题 | Cookie 偏好设定 | Cookie 偏好設定 | Cookie Preferences |
| 前文 | 本网站使用 Cookie 为您提供更好的体验，继续浏览即表示您同意我们的 | 本網站使用 Cookie 為您提供更好的體驗，繼續瀏覽即表示您同意我們的 | This website uses cookies to improve your experience. By continuing, you agree to our |
| 隐私链 | 《隐私政策》 | 《隱私政策》 | 《Privacy Policy》 |
| Cookie 链 | 《Cookie 政策》 | 《Cookie 政策》 | 《Cookie Policy》 |
| 同意 | 同意 | 同意 | Agree |
| 拒绝 | 拒绝 | 拒绝 | Decline |

---

## 智能助手 · ChatAssistant.vue

> **状态：** 组件与 `chatKnowledge.js` 仍在仓库，**当前未挂载到** `App.vue`（需要时再接入）。以下为组件内文案快照。



- **面板标题** — ZH: ADG PAY 智能助手 / TW: ADG PAY 智能助手 / EN: ADG PAY Assistant
- **状态** — ZH: 在线 · 即时回复 / TW: 在線 · 即時回覆 / EN: Online · Instant reply
- **输入占位** — ZH: 输入您的问题… / TW: 輸入您的問題… / EN: Type your question…
- **欢迎语 ZH:** 您好！我是 ADG PAY 智能助手 👋 / 我可以帮您了解牌照资质、开户流程、收款付款、多币种与合规安全等常见问题。您想了解什么？
- **欢迎语 TW:** 您好！我是 ADG PAY 智能助手 👋 / 我可以幫您了解牌照資質、開戶流程、收款付款、多幣種與合規安全等常見問題。您想了解什麼？
- **欢迎语 EN:** Hi! I'm the ADG PAY assistant 👋 / I can help with licensing, onboarding, collection & payments, multi-currency and compliance. What would you like to know?
- **快捷问题 ZH:** 如何开户？；持有哪类牌照？；支持哪些币种？；怎么联系你们？
- **快捷问题 TW:** 如何開戶？；持有哪類牌照？；支持哪些幣種？；怎麼聯繫你們？
- **快捷问题 EN:** How to open an account?；What license do you hold?；Which currencies?；How to contact you?
- **联系按钮** — ZH: 前往「联系我们」留资 / TW: 前往「聯繫我們」留資 / EN: Go to Contact page
- **兜底回复 ZH:** 这个问题我暂时无法直接解答。您可以点击下方按钮留下联系方式，或前往「联系我们」页面，我们的团队会尽快为您详细回复。
- **兜底回复 TW:** 這個問題我暫時無法直接解答。您可以點擊下方按鈕留下聯繫方式，或前往「聯繫我們」頁面，我們的團隊會盡快為您詳細回覆。
- **兜底回复 EN:** I can't answer that one automatically yet. Tap the button below to leave your details, or visit the Contact page — our team will follow up shortly.

---

## 聊天知识库 · chatKnowledge.js（CHAT_KB）

### 1. 牌照 / License

- **Keywords:** 牌照, mso, 金钱服务, 监管, 合规, license, licensed, regulated, regulatory, legal, 海关
- **ZH:** ADG PAY 持有香港海关发出的MSO牌照，受《打击洗钱及恐怖分子资金筹集条例》规管，提供货币兑换与汇款服务，并执行严格的AML与KYC审查及交易监控。
- **TW:** ADG PAY 持有香港海關發出的MSO牌照，受《打擊洗錢及恐怖分子資金籌集條例》規管，提供貨幣兌換與匯款服務，並執行嚴格的AML與KYC審查及交易監控。
- **EN:** ADG PAY holds a Hong Kong Customs & Excise Department Money Service Operator (MSO) license, regulated under the Anti-Money Laundering and Counter-Terrorist Financing Ordinance, providing money changing and remittance with strict AML/KYC due diligence and transaction monitoring.

### 2. 开户 / Onboarding

- **Keywords:** 开户, 注册, 申请, onboard, open account, register, sign up, 申请账户, 开通, 入驻
- **ZH:** 开户流程很简单：① 在线提交企业资料与申请；② 完成KYC与业务核验；③ 审核通过后开通多币种账户。全程在线办理，合规团队会协助您准备材料。
- **TW:** 開戶流程很簡單：① 在線提交企業資料與申請；② 完成KYC與業務核驗；③ 審核通過後開通多幣種賬戶。全程在線辦理，合規團隊會協助您準備材料。
- **EN:** Onboarding is simple: 1) Submit your company details and application online; 2) Complete KYC identity and business verification; 3) Your multi-currency account is activated after approval. Our compliance team assists with the documents.

### 3. 收款 / Collection

- **Keywords:** 收款, 收钱, 收取, collection, receive, 收款账户, 收汇, collect, 收款项
- **ZH:** 您可通过 ADG PAY 开立多币种收款账户，向合作方提供本地收款信息以收取跨境款项，资金隔离存放、安全持有。
- **TW:** 您可通過 ADG PAY 開立多幣種收款賬戶，向合作方提供本地收款信息以收取跨境款項，資金隔離存放、安全持有。
- **EN:** Open multi-currency collection accounts with ADG PAY and share local receiving details with partners to collect cross-border payments, held safely in segregated funds.

### 4. 付款 / Payment

- **Keywords:** 付款, 打款, 支付, pay, send, disburse, 付款给, global pay, 汇款, remit, 转账
- **ZH:** ADG PAY 支持向全球供应商、员工与合作伙伴付款，覆盖主流币种，流程为：持有币种 → 按需兑换 → 发起对外付款。
- **TW:** ADG PAY 支持向全球供應商、員工與合作夥伴付款，覆蓋主流幣種，流程為：持有幣種 → 按需兌換 → 發起對外付款。
- **EN:** ADG PAY supports paying suppliers, employees and partners worldwide across major currencies: hold funds → exchange as needed → send outward payments.

### 5. 币种 / Currency

- **Keywords:** 币种, 货币, 多币种, currency, fx, foreign exchange, 换汇, 兑换, exchange, 多货币, 持有
- **ZH:** 我们提供多币种持有与货币兑换服务，您可在同一账户内持有多种货币，并按需进行兑换，降低汇兑成本。
- **TW:** 我們提供多幣種持有與貨幣兌換服務，您可在同一賬戶內持有多種貨幣，並按需進行兌換，降低匯兌成本。
- **EN:** We provide multi-currency holding and exchange — hold several currencies in one account and convert on demand to reduce FX costs.

### 6. 费率 / Fees

- **Keywords:** 费率, 手续费, 收费, fee, charge, cost, price, 价格, 多少钱, 报价, 费用
- **ZH:** 具体费率根据您的业务规模与币种组合定制。请留下联系方式，我们的商务团队会为您一对一提供透明报价。
- **TW:** 具體費率根據您的業務規模與幣種組合定制。請留下聯繫方式，我們的商務團隊會為您一對一提供透明報價。
- **EN:** Pricing is tailored to your business volume and currency mix. Leave your contact details and our team will share a transparent quote with you.

### 7. 到账 / Settlement timing

- **Keywords:** 到账, 多久, 时间, speed, settle, settlement, 时效, 几天, 处理时间
- **ZH:** 到账时间取决于币种与通道，多数主流币种付款可在 1–2 个工作日内处理。具体时效建议您联系我们按场景确认。
- **TW:** 到賬時間取決於幣種與通道，多數主流幣種付款可在 1–2 個工作日內處理。具體時效建議您聯繫我們按場景確認。
- **EN:** Settlement depends on currency and corridor; most major-currency payments are processed within 1–2 business days. Contact us for timing on your scenario.

### 8. 安全 / Security

- **Keywords:** 安全, 资金, 隔离, security, safe, segregat, 资金安全, 加密, 保护, 风控
- **ZH:** 客户资金隔离存放于受监管金融机构账户，与平台自有资金分离；全链路采用银行级加密与访问控制，保障资金与数据安全。
- **TW:** 客戶資金隔離存放於受監管金融機構賬戶，與平台自有資金分離；全鏈路採用銀行級加密與訪問控制，保障資金與數據安全。
- **EN:** Client funds are held in segregated accounts at regulated financial institutions, separate from company funds. Bank-grade encryption and access controls protect funds and data.

### 9. 语言 / Bilingual

- **Keywords:** 语言, 双语, 中英文, chinese, english, language, bilingual, 中文, 英文
- **ZH:** 我们提供中英双语服务，网站与客服团队均支持中文与英文沟通，方便不同地区合作伙伴对接。
- **TW:** 我們提供中英雙語服務，網站與客服團隊均支持中文與英文溝通，方便不同地區合作夥伴對接。
- **EN:** We provide bilingual (Chinese & English) service — both the website and our support team communicate in Chinese and English.

### 10. 客户 / Industries

- **Keywords:** 客户, 行业, 谁, 适合, industry, who, partner, 适用, 电商, 外贸, 业务
- **ZH:** ADG PAY 服务于有跨境收款、付款与换汇需求的企业，覆盖电商、外贸、服务贸易、数字业务等多种行业。
- **TW:** ADG PAY 服務於有跨境收款、付款與換匯需求的企業，覆蓋電商、外貿、服務貿易、數字業務等多種行業。
- **EN:** ADG PAY serves businesses with cross-border collection, payment and FX needs — e-commerce, trade, service export, digital businesses and more.

### 11. 联系 / Contact

- **Keywords:** 联系, 客服, 电话, 邮箱, contact, email, phone, reach, 怎么找, 人工, 沟通
- **ZH:** 您可访问「联系我们」页面提交咨询，我们会尽快与您取得联系；需要人工协助时也可直接邮件沟通。
- **TW:** 您可訪問「聯繫我們」頁面提交諮詢，我們會盡快與您取得聯繫；需要人工協助時也可直接郵件溝通。
- **EN:** Visit the Contact page to submit an inquiry and we'll get back to you promptly; email is also available for direct assistance.

### 12. 公司 / About

- **Keywords:** 公司, 关于, 介绍, about, company, 你们是, who are you, 是什么, 做什么
- **ZH:** ADG PAY 是持有香港MSO牌照的跨境支付服务提供商，专注为企业的全球收款、多币种持有、货币兑换与对外付款提供合规、稳定的金融基础设施。
- **TW:** ADG PAY 是持有香港MSO牌照的跨境支付服務提供商，專注為企業的全球收款、多幣種持有、貨幣兌換與對外付款提供合規、穩定的金融基礎設施。
- **EN:** ADG PAY is a Hong Kong MSO-licensed cross-border payment provider, offering compliant and reliable infrastructure for global collection, multi-currency holding, FX and outbound payments.
