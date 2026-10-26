# ADG PAY 项目交接文档（return.md）

> 仓库：`Joanna`（Vue 3 官网 + Node/SQLite 管理后台）  
> 正式站点域名（canonical）：https://www.adgpay.com  
> GitHub：https://github.com/abinga136211/Joanna  
> 文档更新日期：2026-10-13

### 近期变更摘要（相对初版交接）

| 方向 | 要点 |
|------|------|
| 配置 | 读写主表改为多语言 `system_config_items`（可增删改、软删）；遗留 `system_config` 仅作空表种子 |
| 岗位 | `jobs` 增加三语字段（`*_zh/*_en/*_tw`）；公开 API 一次返回三语，前端按语言选用；遗留单语列与 `*_zh` 同步；旧库由 `ensureJobsI18nColumns` 补列并回填 |
| 鉴权 | 管理端 Cookie + Bearer（`sessionStorage` 键 `adg_admin_token`）；跨站以 Bearer 为主 |
| API 端口 | 默认 `3003`（原文档曾写 `3001`） |
| 路由语义 | `/privacy` **实际是「加入我们 / Careers」招聘页**（组件仍名 `PrivacyView.vue`）；隐私说明在 `/compliance#privacy` |
| 首页 | 全屏 Hero 图（`hk-skyline.jpg`）+ 品牌名主导标题 → 五卡产品能力 → 专属方案手风琴 → 关于（`WhyGlobe` + 数据条）→ 合规要点 |
| 产品页 | 锚点改为 `#solutions` / `#collect` / `#pay` / `#fx` / `#services` / `#workflow`（旧 `#receive` 等已弃用） |
| 体验 | 多语言 Cookie 同意条；导航下拉锚点；`useAutoRefresh`（官网配置默认约 3s，后台列表/招聘岗多约 2s） |
| 媒体 | 多页 Hero 提供 `.webp` + `.jpg`（`<picture>`）；`public/videos/hero-home.mp4` 现未挂载 |
| 品牌资源 | Favicon / Apple Touch 使用 `public/adg-*-v6.*`；Logo 在 `public/images/logo/` |
| 文档位置 | `COPY.md` / `CREDITS.md` 已迁至 `docs/`；`docs/context-update.md` 为首页文案快照；`docs/COPY.md` 已按 2026-10-13 源码刷新导航、页脚与主要页面结构 |

---

## 1. 项目入口

| 角色 | 入口文件 / 命令 | 说明 |
|------|-----------------|------|
| HTML 挂载点 | `index.html` → `#app` | 加载 `/src/main.js` |
| 前端 JS 入口 | `src/main.js` | 创建 Vue App、Pinia、Router，挂载到 `#app` |
| 根组件 | `src/App.vue` | 官网：Header/Footer + Cookie 同意条 + 路由视图；`/admin` 走后台布局 |
| 路由入口 | `src/router/index.js` | 官网页面 + 管理后台路由与鉴权守卫 |
| 后端入口 | `server/src/index.js` | Express API，默认端口 `3003` |
| 环境变量 | `.env` / `.env.example` / `.env.production` | 本地与构建用；密钥勿提交 Git |
| 本地一键启动 | `npm run dev` | 同时启动 Vite 前端 + Node API |
| 仅前端 | `npm run dev:web` | Vite，默认 `http://localhost:5173` |
| 仅后端 | `npm run dev:server` / `npm run start:server` | API：`http://localhost:3003` |

开发时前端通过 Vite 代理把 `/api` 转到 `http://localhost:3003`（见 `vite.config.js`）。

---

## 2. 技术栈

### 前端

| 技术 | 用途 |
|------|------|
| Vue 3 | SPA 框架 |
| Vite 8 | 构建 / 开发服务器（`base: /Joanna/`） |
| Vue Router 5 | 路由（`createWebHistory`）；hash 锚点平滑滚动 |
| Pinia | 语言状态 `stores/locale.js`（zh / tw / en） |
| d3-geo / topojson-client / world-atlas | 地球路径生成（`scripts/generate-globe-paths.mjs` → `globePaths.js`）；首页 `WhyGlobe` |
| Vitest + Vue Test Utils | 单元测试 |
| ESLint / Oxlint / Prettier | 代码规范 |

### 后端

| 技术 | 用途 |
|------|------|
| Node.js（`^22.18.0 \|\| >=24.12.0`） | 运行时 |
| Express 5 | REST API |
| better-sqlite3 | SQLite 同步驱动 |
| cookie-parser | 管理端 Session Cookie |
| cors | 跨域（生产建议配置 `CORS_ORIGIN`） |
| multer | 简历 PDF 上传（≤5MB） |
| bcryptjs | 可选：管理员密码哈希校验 |

### 数据与部署

| 技术 | 用途 |
|------|------|
| SQLite | 单文件库 `server/data/adgpay.sqlite` |
| gh-pages | 静态前端发布到 GitHub Pages |
| concurrently | 本地并行跑 web + api |

---

## 3. 项目架构

```
浏览器
  ├─ 官网 (Vue SPA)          → 公开 API：配置、岗位、咨询、投递
  └─ 管理后台 (/admin)       → Cookie / Bearer 鉴权 API：CRUD + PDF 预览

Node 服务 (server/)
  ├─ REST /api、/api/admin
  ├─ SQLite 文件
  └─ uploads/resumes/ 简历 PDF

Vite (开发)
  └─ proxy /api → localhost:3003
```

### 目录结构

```
Joanna/
├── index.html                 # 前端 HTML 入口（title/SEO、adg-favicon-v6）
├── vite.config.js             # base=/Joanna/，/api 代理，开发态 favicon 回退
├── package.json
├── .env / .env.example / .env.production
├── return.md                  # 本交接文档
├── src/                       # Vue 官网 + /admin
│   ├── main.js
│   ├── App.vue
│   ├── api/client.js          # apiFetch / Bearer token / VITE_API_BASE
│   ├── router/index.js
│   ├── views/                 # 官网页面（含 NotFoundView）
│   ├── views/admin/           # 后台页面
│   ├── components/
│   │   ├── layout/            # AppHeader、AppFooter、CookieConsent
│   │   ├── home/              # WhyGlobe（在用）；HeroGlobe/HeroVisual/FlagMarquee 现未挂载
│   │   └── chat/              # ChatAssistant（组件在库，当前未挂到 App）
│   ├── composables/           # useSiteConfig、useAutoRefresh、useScrollReveal、useInteractions
│   ├── data/                  # siteConfigDefaults、globePaths、chatKnowledge
│   ├── stores/locale.js       # 简中 / 繁中 / 英文
│   ├── utils/formatAdmin.js
│   └── assets/styles/         # adgpay.css、admin.css
├── server/
│   ├── src/
│   │   ├── index.js           # API 入口
│   │   ├── loadEnv.js
│   │   ├── db/                # SQLite 初始化、migration、seed
│   │   ├── routes/            # 公开 + 管理路由
│   │   ├── middleware/auth.js
│   │   ├── services/
│   │   └── defaults/config.js # 配置硬编码兜底
│   ├── data/                  # *.sqlite（gitignore）
│   └── uploads/               # 简历（gitignore）
├── scripts/                   # spa-github-pages、素材拉取/地球路径等辅助脚本
├── docs/                      # backend 方案、CREDITS、COPY、文案上下文等
├── public/                    # 部署静态资源
│   ├── adg-favicon-v6.* / adg-apple-touch-v6.png
│   ├── images/                # 各页头图（含 .webp）、logo、产品配图等
│   ├── videos/                # 可选视频素材（如 hero-home.mp4，当前未引用）
│   └── adgpay.legacy.html     # 原单页备份
└── image/                     # 本地素材工作区（非构建必需；正式站用 public/images）
```

### 配置兜底策略

- 读写目标表为 `system_config_items`（多语言配置项，可增删改、软删）
- DB 有未删除行 → 使用数据库
- 空表 / 读失败 → `server/src/defaults/config.js` 的 `DEFAULT_CONFIG_ITEMS`（公开 API 返回负 `id`）；前端另有 `src/data/siteConfigDefaults.js`
- 首次空表种子：优先从遗留表 `system_config`（id=1）拷贝邮箱/地址，否则用上述默认值（见 `ensureConfigItemsTable`）

---

## 4. 数据库信息

### 4.1 位置

| 项 | 值 |
|----|-----|
| 默认路径 | `server/data/adgpay.sqlite`（可附带 `-wal` / `-shm`） |
| 环境变量覆盖 | `SQLITE_PATH`（见 `.env`） |
| 简历文件 | `server/uploads/resumes/*.pdf` |
| 初始化 | 启动时 `initDb()`：执行 migration → `ensureColumnMigrations` → `ensureConfigItemsTable`；空岗位表时 `seedJobsIfEmpty()` 写入示例岗位 |

### 4.2 表结构概览

#### `system_config_items`（多语言系统配置项，当前读写主表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK AI | |
| name_zh / name_en / name_tw | TEXT | 名称三语 |
| value_zh / value_en / value_tw | TEXT | 内容三语 |
| sort_order | INTEGER | 排序，越小越靠前 |
| is_deleted | INTEGER | 0/1 软删 |
| created_at / updated_at | TEXT | ISO 时间 |

默认种子通常含：客户邮箱、合作邮箱、办公地址（三语名称 + 对应 value）。

#### `system_config`（遗留单行表，仅作兼容）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | `CHECK (id = 1)` |
| customer_email | TEXT | 客户/客服邮箱 |
| partnership_email | TEXT | 商务合作邮箱 |
| office_address | TEXT | 办公地址 |
| updated_at | TEXT | ISO 时间 |

业务 API 已不再读写此表；仅在 `system_config_items` 首次为空时，用其值做一次性种子。新环境可不依赖该表数据。

#### `inquiries`（联系咨询）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK AI | |
| ip | TEXT | 提交方 IP |
| name / company / phone / email | TEXT NOT NULL | |
| industry | TEXT | ecommerce / trade / saas / other |
| message | TEXT NOT NULL | |
| is_read / is_deleted | INTEGER | 0/1 |
| created_at | TEXT | |

#### `jobs`（招聘岗位，三语 + 遗留单语列）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK AI | |
| title / job_type / experience / work_location / responsibilities / requirements | TEXT | **遗留单语列**，写入时与对应 `*_zh` 同步，便于旧数据兼容 |
| title_zh / title_en / title_tw | TEXT | 岗位名称三语（创建/更新时 `title_zh`、`title_en` 必填；`title_tw` 空则回退为 zh） |
| job_type_* / experience_* / work_location_* | TEXT | 类型、经验、地点三语 |
| responsibilities_* / requirements_* | TEXT | 职责/要求三语（多行文本；公开 API 按行拆成数组） |
| status | TEXT | `published` \| `draft` |
| is_deleted | INTEGER | 软删 |
| created_at / updated_at | TEXT | |

公开 API 一次返回全部三语字段（各语言空则服务端按 `*_lang` → `*_zh` → 遗留单语列回填）；前端按当前语言选用对应键。

#### `applications`（岗位投递）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK AI | |
| job_id | INTEGER FK → jobs.id | |
| name / gender / school / residence / bio | TEXT NOT NULL | |
| phone / email | TEXT | |
| resume_path | TEXT | 相对路径，如 `resumes/xxx.pdf` |
| is_read / is_deleted | INTEGER | |
| created_at | TEXT | |

索引：`idx_config_items_sort`、`idx_inquiries_created`、`idx_jobs_status`、`idx_applications_job`、`idx_applications_created`。

### 4.3 建表 SQL（完整）

源文件：`server/src/db/migrations/001_initial.sql`

```sql
-- Initial schema for ADG PAY admin + forms

CREATE TABLE IF NOT EXISTS system_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  customer_email TEXT NOT NULL DEFAULT '',
  partnership_email TEXT NOT NULL DEFAULT '',
  office_address TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS system_config_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_zh TEXT NOT NULL DEFAULT '',
  name_en TEXT NOT NULL DEFAULT '',
  name_tw TEXT NOT NULL DEFAULT '',
  value_zh TEXT NOT NULL DEFAULT '',
  value_en TEXT NOT NULL DEFAULT '',
  value_tw TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_deleted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_config_items_sort
  ON system_config_items(is_deleted, sort_order, id);

CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  industry TEXT,
  message TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  is_deleted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL DEFAULT '',
  job_type TEXT NOT NULL DEFAULT '',
  experience TEXT NOT NULL DEFAULT '',
  work_location TEXT NOT NULL DEFAULT '',
  responsibilities TEXT NOT NULL DEFAULT '',
  requirements TEXT NOT NULL DEFAULT '',
  title_zh TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  title_tw TEXT NOT NULL DEFAULT '',
  job_type_zh TEXT NOT NULL DEFAULT '',
  job_type_en TEXT NOT NULL DEFAULT '',
  job_type_tw TEXT NOT NULL DEFAULT '',
  experience_zh TEXT NOT NULL DEFAULT '',
  experience_en TEXT NOT NULL DEFAULT '',
  experience_tw TEXT NOT NULL DEFAULT '',
  work_location_zh TEXT NOT NULL DEFAULT '',
  work_location_en TEXT NOT NULL DEFAULT '',
  work_location_tw TEXT NOT NULL DEFAULT '',
  responsibilities_zh TEXT NOT NULL DEFAULT '',
  responsibilities_en TEXT NOT NULL DEFAULT '',
  responsibilities_tw TEXT NOT NULL DEFAULT '',
  requirements_zh TEXT NOT NULL DEFAULT '',
  requirements_en TEXT NOT NULL DEFAULT '',
  requirements_tw TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  is_deleted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  school TEXT NOT NULL,
  residence TEXT NOT NULL,
  bio TEXT NOT NULL,
  resume_path TEXT,
  is_read INTEGER NOT NULL DEFAULT 0,
  is_deleted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_created ON applications(created_at DESC);
```

运行时增量（`server/src/db/index.js`）：

| 步骤 | 作用 |
|------|------|
| `ensureColumnMigrations` | 旧库补加 `applications.phone` / `applications.email`（若缺失）；并调用 `ensureJobsI18nColumns` |
| `ensureJobsI18nColumns` | 旧库补加 `jobs` 全部 `*_zh/*_en/*_tw` 列；若 `*_zh` 为空则从遗留单语列回填 |
| `ensureConfigItemsTable` | 确保 `system_config_items` 存在；空表时从 `system_config` 或 `DEFAULT_CONFIG_ITEMS` 种子 |

### 4.4 相关代码位置

| 文件 | 职责 |
|------|------|
| `server/src/db/index.js` | 打开库、WAL、migration、列/配置项增量、路径常量 |
| `server/src/db/migrations/001_initial.sql` | 建表 |
| `server/src/db/seed.js` | 空表时种子岗位（三语字段 + 遗留列同步为 zh） |
| `server/src/defaults/config.js` | `DEFAULT_CONFIG` / `DEFAULT_CONFIG_ITEMS` 硬编码兜底 |
| `server/src/services/configService.js` | `system_config_items` CRUD + 公开列表兜底 |

---

## 5. 接口信息

基址：

- 本地开发：前端同源 `/api`（Vite 代理到 `3003`）
- 直接调 API：`http://localhost:3003/api/...`
- 生产跨域：设置 `VITE_API_BASE`（如 `https://api.example.com`）

通用约定：

| 项 | 说明 |
|----|------|
| JSON 请求 | `Content-Type: application/json`（body 上限约 1MB） |
| 文件上传 | `Content-Type: multipart/form-data`（仅投递接口） |
| 鉴权 | Cookie（`HttpOnly`，约 7 天）或 `Authorization: Bearer <token>`；跨域需 `credentials: 'include'` |
| 错误体 | `{ "error": "<英文或中文说明>" }`；常见状态码 `400` / `401` / `404` / `500` |
| 未鉴权管理接口 | `{ "error": "Unauthorized" }` → `401` |

默认管理员密码：`ADMIN_PASSWORD=123456`（生产务必修改；也可设 `ADMIN_PASSWORD_HASH`）。  
路由实现：`server/src/routes/`。

### 5.1 公开接口一览

| 方法 | 路径 | Content-Type | 说明 |
|------|------|--------------|------|
| GET | `/api/health` | — | 健康检查 |
| GET | `/api/config` | — | 公开配置项列表（多语言，含兜底） |
| POST | `/api/inquiries` | `application/json` | 提交咨询 |
| GET | `/api/jobs` | — | 已上架岗位列表 |
| GET | `/api/jobs/:id` | — | 单个已上架岗位 |
| POST | `/api/applications` | `multipart/form-data` | 岗位投递 + 简历 PDF |

### 5.2 公开接口：请求 / 响应体

#### `GET /api/health`

**响应 `200`**

```json
{ "ok": true, "service": "adgpay-api" }
```

#### `GET /api/config`

无请求体。空库或读失败时用 `defaults/config.js` 兜底（此时 `id` 为负数）。

**响应 `200`**

```json
{
  "items": [
    {
      "id": 1,
      "name_zh": "客户邮箱",
      "name_en": "Customer Email",
      "name_tw": "客戶郵箱",
      "value_zh": "Athos.xu@adgpay.com",
      "value_en": "Athos.xu@adgpay.com",
      "value_tw": "Athos.xu@adgpay.com",
      "sort_order": 1
    }
  ]
}
```

#### `POST /api/inquiries`

**请求体（JSON）**

| 字段 | 必填 | 说明 |
|------|------|------|
| name | 是 | 姓名 |
| company | 是 | 公司 |
| phone | 是 | 电话 |
| email | 是 | 邮箱（简单格式校验） |
| message | 是 | 留言 |
| industry | 否 | `ecommerce` / `trade` / `saas` / `other`；也接受中文别名（如「跨境电商」→ `ecommerce`） |

```json
{
  "name": "张三",
  "company": "ACME",
  "phone": "13800000000",
  "email": "a@example.com",
  "industry": "ecommerce",
  "message": "想了解收款方案"
}
```

**响应**

| 状态 | 体 |
|------|-----|
| `201` | `{ "ok": true, "id": 12 }` |
| `400` | `{ "error": "Missing required fields" }` / `"Invalid email"` / `"Invalid industry"` |

#### `GET /api/jobs`

**响应 `200`**：每条含三语字段；`responsibilities_*` / `requirements_*` 已按行拆成数组。  
兼容别名 `title` / `job_type` / … 等于对应 `*_zh`（数组字段亦然）。

```json
{
  "items": [
    {
      "id": 1,
      "title_zh": "后端工程师（支付系统）",
      "title_en": "Backend Engineer (Payments)",
      "title_tw": "後端工程師（支付系統）",
      "job_type_zh": "全职",
      "job_type_en": "Full-time",
      "job_type_tw": "全職",
      "experience_zh": "3 年以上",
      "experience_en": "3+ years",
      "experience_tw": "3 年以上",
      "work_location_zh": "香港",
      "work_location_en": "Hong Kong",
      "work_location_tw": "香港",
      "responsibilities_zh": ["负责 API 开发", "维护数据库"],
      "responsibilities_en": ["Build APIs", "Maintain the database"],
      "responsibilities_tw": ["負責 API 開發", "維護資料庫"],
      "requirements_zh": ["熟悉 Node.js", "熟悉 SQL"],
      "requirements_en": ["Solid Node.js", "Solid SQL"],
      "requirements_tw": ["熟悉 Node.js", "熟悉 SQL"],
      "title": "后端工程师（支付系统）",
      "job_type": "全职",
      "experience": "3 年以上",
      "work_location": "香港",
      "responsibilities": ["负责 API 开发", "维护数据库"],
      "requirements": ["熟悉 Node.js", "熟悉 SQL"]
    }
  ]
}
```

#### `GET /api/jobs/:id`

**响应**

| 状态 | 体 |
|------|-----|
| `200` | 单个岗位对象（字段同列表项，无外层 `items`） |
| `404` | `{ "error": "Not found" }` |

#### `POST /api/applications`（上传）

唯一带文件上传的接口。使用 **multer**，字段名必须为 `resume`。

**请求：`multipart/form-data`**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| job_id | text | 是 | 已上架岗位 ID（数字） |
| name | text | 是 | 姓名 |
| gender | text | 是 | 性别 |
| phone | text | 是 | 电话 |
| email | text | 是 | 邮箱 |
| school | text | 是 | 学校 |
| residence | text | 是* | 居住地；也可用别名 `location` |
| bio | text | 是 | 个人简介，≤200 字 |
| resume | file | 是 | PDF 简历；MIME=`application/pdf` 且扩展名 `.pdf`；≤5MB |

\* `residence` 与 `location` 二选一，取非空值。

文件落盘：`server/uploads/resumes/<timestamp>-<random>.pdf`，库中存相对路径如 `resumes/xxx.pdf`。校验失败时会删除已上传的临时文件。

**示例（curl）**

```sh
curl -X POST http://localhost:3003/api/applications \
  -F "job_id=1" \
  -F "name=李四" \
  -F "gender=男" \
  -F "phone=13900000000" \
  -F "email=b@example.com" \
  -F "school=HKU" \
  -F "residence=香港" \
  -F "bio=两年支付相关实习经验" \
  -F "resume=@./resume.pdf;type=application/pdf"
```

**响应**

| 状态 | 体 |
|------|-----|
| `201` | `{ "ok": true, "id": 5 }` |
| `400` | `{ "error": "Missing required fields" }` / `"Invalid email"` / `"Bio must be 200 characters or fewer"` / `"PDF resume required"` / `"Job not available"` / `"Only PDF resumes are allowed"` / `"File too large"`（超 5MB，multer `LIMIT_FILE_SIZE`）/ `"Upload failed"` 等 |

### 5.3 管理接口一览（前缀 `/api/admin`）

除 `login` 外均需鉴权。

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/admin/login` | 登录，写 Cookie 并返回 token |
| POST | `/api/admin/logout` | 登出 |
| GET | `/api/admin/me` | 当前是否已登录 |
| GET | `/api/admin/config` | 配置项列表；query: `include_deleted=1` |
| POST | `/api/admin/config` | 新建配置项 |
| PUT | `/api/admin/config/:id` | 更新配置项 |
| DELETE | `/api/admin/config/:id` | 软删配置项 |
| GET | `/api/admin/inquiries` | 列表；query: `read`, `include_deleted` |
| GET | `/api/admin/inquiries/:id` | 详情 |
| PATCH | `/api/admin/inquiries/:id/read` | 已读/未读 |
| DELETE | `/api/admin/inquiries/:id` | 软删 |
| GET / POST | `/api/admin/jobs` | 列表 / 新建 |
| GET / PUT | `/api/admin/jobs/:id` | 详情 / 更新 |
| PATCH | `/api/admin/jobs/:id/status` | 上架/下架 |
| DELETE | `/api/admin/jobs/:id` | 软删 |
| GET | `/api/admin/applications` | 列表；query: `read`, `job_id`, `include_deleted` |
| GET | `/api/admin/applications/:id` | 详情 |
| PATCH | `/api/admin/applications/:id/read` | 已读/未读 |
| GET | `/api/admin/applications/:id/resume` | 预览 PDF（binary，非 JSON） |
| DELETE | `/api/admin/applications/:id` | 软删并尝试删文件 |
| GET | `/api/admin/tables` | 四表只读浏览汇总 |

### 5.4 管理接口：请求 / 响应体

#### 鉴权

**`POST /api/admin/login`** — JSON `{ "password": "..." }`

| 状态 | 体 | 附带 |
|------|-----|------|
| `200` | `{ "ok": true, "token": "<session>" }` | Set-Cookie（HttpOnly） |
| `400` | `{ "error": "Password required" }` | |
| `401` | `{ "error": "Invalid password" }` | |

**`POST /api/admin/logout`** → `200` `{ "ok": true }`（清除 Cookie）

**`GET /api/admin/me`** → `200` `{ "ok": true }`；未登录 `401` `{ "error": "Unauthorized" }`

#### 配置项 `system_config_items`

**`GET /api/admin/config`** → `200`

```json
{
  "items": [
    {
      "id": 1,
      "name_zh": "客户邮箱",
      "name_en": "Customer Email",
      "name_tw": "客戶郵箱",
      "value_zh": "...",
      "value_en": "...",
      "value_tw": "...",
      "sort_order": 1,
      "is_deleted": 0,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

**`POST /api/admin/config`** / **`PUT /api/admin/config/:id`** — JSON 请求体：

| 字段 | 必填 | 说明 |
|------|------|------|
| name_zh / name_en / name_tw | 是 | 名称三语 |
| value_zh / value_en / value_tw | 是 | 内容三语 |
| sort_order | 否 | 数字，默认 `0` |

| 状态 | 体 |
|------|-----|
| `201`（新建）/ `200`（更新） | 完整配置行对象（含 `id`、`is_deleted`、时间戳） |
| `400` | `{ "error": "名称需填写中文、英文、繁体" }` 或 `"内容需填写中文、英文、繁体"` / `"Invalid id"` |
| `404` | `{ "error": "Not found" }` |

**`DELETE /api/admin/config/:id`** → `200` `{ "ok": true }`

#### 咨询

**`GET /api/admin/inquiries`** — query：`read=0|1`，`include_deleted=1`  
→ `200` `{ "items": [ { id, ip, name, company, phone, email, industry, message, is_read, is_deleted, created_at }, ... ] }`

**`GET /api/admin/inquiries/:id`** → `200` 单行对象；`404` `{ "error": "Not found" }`

**`PATCH /api/admin/inquiries/:id/read`** — JSON `{ "is_read": true|false|0|1 }`（缺省视为已读 `1`）  
→ `200` `{ "ok": true, "id": 1, "is_read": 1 }`

**`DELETE /api/admin/inquiries/:id`** → `200` `{ "ok": true }`

#### 岗位

**`GET /api/admin/jobs`** — query：`include_deleted=1`  
→ `200` `{ "items": [ { ...jobs行（含遗留列 + 三语列）, "application_count": 3 }, ... ] }`（职责/要求为原文 TEXT，不拆数组）

**`GET /api/admin/jobs/:id`** → `200` 岗位行；`404` `{ "error": "Not found" }`

**`POST /api/admin/jobs`** / **`PUT /api/admin/jobs/:id`** — JSON：

| 字段 | 必填 | 说明 |
|------|------|------|
| title_zh / title_en | 是 | 简中、英文岗位名（缺则 `400`：`请填写简体岗位名称` / `请填写英文岗位名称`） |
| title_tw 及各 `*_tw` | 否 | 空则回退为对应 `*_zh` |
| job_type_* / experience_* / work_location_* | 否 | 三语文本 |
| responsibilities_* / requirements_* | 否 | 三语多行文本（换行分隔） |
| title / job_type / …（遗留键） | 否 | 仅当对应 `*_zh` 未传时，作为 zh 回退写入 |
| status | 否 | `published` \| `draft`（其它值按 `draft`） |

服务端会把遗留单语列同步为 `*_zh`。管理端表单按语言 Tab 编辑三语字段。

| 状态 | 体 |
|------|-----|
| `201`（新建）/ `200`（更新） | 完整 `jobs` 行（含遗留列 + 全部三语列） |
| `400` | `{ "error": "请填写简体岗位名称" }` 或 `"请填写英文岗位名称"` |
| `404` | `{ "error": "Not found" }` |

**`PATCH /api/admin/jobs/:id/status`** — `{ "status": "published"|"draft" }`  
→ `200` `{ "ok": true, "id": 1, "status": "published" }`

**`DELETE /api/admin/jobs/:id`** → `200` `{ "ok": true }`（软删并置为 `draft`）

#### 投递

**`GET /api/admin/applications`** — query：`read=0|1`，`job_id=<n>`，`include_deleted=1`  
→ `200` `{ "items": [ { ...applications行, "job_title": "..." }, ... ] }`

**`GET /api/admin/applications/:id`** → `200` 单行（含 `job_title`）；`404` `{ "error": "Not found" }`

**`PATCH /api/admin/applications/:id/read`** — 同咨询已读接口  
→ `200` `{ "ok": true, "id": 1, "is_read": 1 }`

**`GET /api/admin/applications/:id/resume`** — **非 JSON**

| 状态 | 说明 |
|------|------|
| `200` | `Content-Type: application/pdf`；`Content-Disposition: inline; filename="resume-<id>.pdf"`；body 为 PDF 二进制流 |
| `404` | JSON `{ "error": "Not found" }` 或 `{ "error": "File missing" }` |

**`DELETE /api/admin/applications/:id`** → `200` `{ "ok": true }`（软删；尽量删除磁盘上的 PDF）

#### 表浏览

**`GET /api/admin/tables`** — query：默认**不含**已软删；传 `include_deleted=1` 才包含（与后台复选框一致）

**响应 `200` 结构摘要**

```json
{
  "include_deleted": false,
  "summary": {
    "system_config": 3,
    "inquiries": 10,
    "jobs": 3,
    "applications": 5,
    "inquiries_unread": 2,
    "applications_unread": 1,
    "jobs_published": 2
  },
  "tables": {
    "system_config": { "columns": ["id", "name_zh", "..."], "rows": [] },
    "inquiries": { "columns": ["id", "ip", "..."], "rows": [] },
    "jobs": { "columns": ["id", "title", "..."], "rows": [] },
    "applications": { "columns": ["id", "job_id", "job_title", "..."], "rows": [] }
  }
}
```

说明：响应里的 `system_config` **键名未改**，但 `rows` 来自 `system_config_items`（含三语 name/value、`sort_order` 等），不再是旧单行邮箱表。

---

## 6. 网页路由及对应信息

本地开发基址一般为 `http://localhost:5173/Joanna/`（因 `vite.config.js` 中 `base: '/Joanna/'`）。  
GitHub Pages 静态站：`https://abinga136211.github.io/Joanna/`（以仓库 Pages 配置为准）。  
正式品牌域名：`https://www.adgpay.com`（需自备服务器/反代；当前 `deploy` 脚本主要面向 GitHub Pages）。

### 6.1 官网

| 路径 | 名称 | 视图组件 | 说明 |
|------|------|----------|------|
| `/` | home | `HomeView.vue` | 首页（见下「首页结构」） |
| `/products` | products | `ProductsView.vue` | 产品与解决方案；锚点见下表 |
| `/about` | about | `AboutView.vue` | 关于我们 |
| `/compliance` | compliance | `ComplianceView.vue` | 合规与安全；**隐私/数据安全文案在 `#privacy`** |
| `/faq` | faq | `FaqView.vue` | 帮助中心 / FAQ |
| `/contact` | contact | `ContactView.vue` | 联系我们；表单 → `POST /api/inquiries` |
| `/privacy` | privacy | `PrivacyView.vue` | **加入我们 / Careers**（历史路径名未改）；岗位按当前语言取 `*_zh/*_en/*_tw`；投递 → `POST /api/applications` |
| 其它未知路径 | not-found | `NotFoundView.vue` | 404（`/:pathMatch(.*)*`） |

导航文案：顶栏「加入我们 / Careers」指向 `/privacy`；Cookie 条《隐私政策》与页脚「数据与隐私 / Data & Privacy」指向 `/compliance#privacy`（勿与招聘页混淆）。下拉子项与页脚栏目见 `AppHeader.vue` / `AppFooter.vue`，文案摘录见 `docs/COPY.md`（产品导航含「资金链路」`#workflow`，页脚产品列无此项）。

#### 首页结构（`HomeView`）

| 区块 | 要点 |
|------|------|
| Hero | 全屏图 `public/images/hk-skyline.jpg`（`index.html` 已 preload）；标题为品牌名 `ADG PAY` + 导语 + 说明（三语，无 CTA） |
| 核心产品 | 五卡网格：渠道匹配 → `#solutions`，全球收款 → `#collect`，国际付款 → `#pay`，灵活换汇 → `#fx`，专属咨询 → `/contact`（含 UI mock 视觉） |
| 专属方案 | 左图 `career-hero.jpg` + 右侧编号手风琴（开户困局 / 渠道单一 / 服务真空，点击展开对应方案）；「了解更多」→ `/contact` |
| 关于我们 | `WhyGlobe`（`globePaths.js`）+ 文案 → `/about`；下方四条通道数据（30+ / 200+ / 0 / 60%） |
| 合规与安全 | 四点清单 + `compliance-hero.jpg`（webp 优先）→ `/compliance` |

#### 主要页内锚点

| 页面 | 锚点 |
|------|------|
| `/products` | `#solutions`（tabs：`#b2b` `#digital` `#family`；别名 `#trade`/`#ecom`→b2b、`#saas`→digital）；`#services` 下 `#collect` `#pay` `#fx`；`#workflow` |
| `/about` | `#mission` `#advantage` `#team` `#license` |
| `/compliance` | `#framework` `#privacy` `#risk` `#funds` |
| `/faq` | `#guide` `#faq-onboarding` `#faq-fees` `#faq-operations` `#faq-compliance` |
| `/contact` | `#bilingual` `#contact-form` |
| `/privacy`（招聘） | `#values` `#benefits` `#openings` |

#### 全局交互（非路由）

| 模块 | 位置 | 说明 |
|------|------|------|
| Cookie 同意 | `CookieConsent.vue`（挂在 `App.vue`） | Cookie 名 `adgpay-cookie-consent`；政策链到 `/compliance#privacy` |
| 语言 | `stores/locale.js` | `zh` / `tw` / `en`；标题与部分 DOM `data-zh/en/tw` |
| 滚动入场 | `useScrollReveal` | 多页 `.reveal` |
| 聊天助手 | `components/chat/ChatAssistant.vue` | 关键词库 `chatKnowledge.js`；**当前未挂载到 App**，需要时再接入 |

### 6.2 管理后台

| 路径 | 名称 | 说明 |
|------|------|------|
| `/admin/login` | admin-login | 仅密码登录（`AdminLoginView.vue`） |
| `/admin` | — | 布局 `AdminLayout.vue`；空路径重定向到 `tables` |
| `/admin/tables` | admin-tables | 四表只读浏览（配置区展示的是 `system_config_items`，JSON 键名仍为 `system_config`） |
| `/admin/config` | admin-config | 配置项增删改（三语 name/value、搜索/筛选；API 支持 `sort_order`，管理 UI 暂未暴露） |
| `/admin/inquiries` | admin-inquiries | 咨询列表、已读、软删 |
| `/admin/jobs` | admin-jobs | 岗位增删改（三语 Tab）、上架下架；有投递时可「查看简历」跳转投递列表；删除不校验投递数（软删） |
| `/admin/applications` | admin-applications | 投递列表、已读、PDF 预览、软删 |

路由守卫：访问 `meta.requiresAdmin` 的路由前调用 `GET /api/admin/me`；失败则跳转 `/admin/login?redirect=...`（登录页目前登录成功后固定进 `admin-tables`，未消费 `redirect`）。  
后台列表页普遍用 `useAutoRefresh`（约 2s；页签隐藏或编辑/弹窗/PDF 预览打开时暂停）；官网 `useSiteConfig` 默认约 3s（联系页显式 2s），招聘岗列表约 2s。  
管理 Session 存于 API 进程内存 `Map`（约 7 天 TTL）；**重启 API 后全部会话失效**，需重新登录。

### 6.3 前端鉴权与 API 客户端

实现：`src/api/client.js`。

| 项 | 说明 |
|----|------|
| 基址 | `VITE_API_BASE`（空则同源 `/api`，开发靠 Vite 代理） |
| Cookie | 请求带 `credentials: 'include'` |
| Bearer | 登录成功后把 `token` 存入 `sessionStorage` 键 `adg_admin_token`；之后 `apiFetch` 自动加 `Authorization: Bearer …` |
| 跨站场景 | 第三方 Cookie 常被拦；**以后台 Bearer 为主**，Cookie 为辅（`COOKIE_SAMESITE=none` 时写 Secure Cookie） |
| 退出 | 调 logout 并 `clearAdminToken()` |

官网配置：`useSiteConfig` → `GET /api/config`；失败或空列表用 `DEFAULT_SITE_CONFIG_ITEMS`；默认约 3s 自动刷新。招聘页岗位列表同样走 `useAutoRefresh`（约 2s）。

---

## 7. 部署方式

### 7.1 环境变量一览

参考 `.env.example`（本地）与 `.env.production`（构建进前端的公开 API 地址）。

| 变量 | 侧 | 说明 |
|------|----|------|
| `VITE_API_BASE` | 前端 | API 根（无尾斜杠）。开发留空走代理；Pages 构建写在 `.env.production` |
| `PORT` | 后端 | 默认 `3003` |
| `SQLITE_PATH` | 后端 | 库路径；空则 `server/data/adgpay.sqlite` |
| `CORS_ORIGIN` | 后端 | 允许的前端 Origin；空则回显请求 Origin |
| `COOKIE_SAMESITE` | 后端 | 设为 `none` 时跨站 Cookie（需 HTTPS / Secure） |
| `ADMIN_PASSWORD` | 后端 | 后台明文密码，默认 `123456` |
| `ADMIN_PASSWORD_HASH` | 后端 | 可选 bcrypt；有值则忽略明文密码 |
| `VITE_DEV_API_PORT` | 前端开发 | 可选；代理目标端口，默认同 `PORT` / `3003` |

Cookie 名：`adg_admin_session`（HttpOnly）。

### 7.2 本地开发

1. 安装依赖（需本机可编译 `better-sqlite3` 的 Node 版本）：

```sh
npm install
```

2. 复制环境变量：

```sh
# 将 .env.example 复制为 .env，按需修改
# Windows PowerShell 示例：
Copy-Item .env.example .env
```

3. 启动：

```sh
npm run dev
```

- 前端：Vite（`base: /Joanna/`）→ 一般为 `http://localhost:5173/Joanna/`
- 后端：`http://localhost:3003`；`/api` 由 Vite 代理
- 后台：`/admin/login`，密码见 `ADMIN_PASSWORD`
- 开发态访问根路径 `/favicon.ico` 时，Vite 中间件会回退到 `/Joanna/adg-favicon-v6.ico`

其它命令：

```sh
npm run build          # 产出 dist/（会读 .env.production 中的 VITE_*）
npm run preview        # 预览构建结果
npm run start:server   # 仅启动 API
npm run deploy         # 构建 + SPA 404 回退 + gh-pages
npm run test:unit
npm run lint
npm run format         # Prettier 格式化 src/
```

### 7.3 静态前端 → GitHub Pages（现有脚本）

```sh
npm run deploy
```

流程：`vite build` → `scripts/spa-github-pages.mjs`（复制 `index.html` 为 `404.html` 做 SPA 回退）→ `gh-pages -d dist --dotfiles`。

注意：

- `base` 为 `/Joanna/`，适合 `username.github.io/Joanna/`。
- **Pages 只托管静态前端**；API 需另外部署（本机/云主机 + 隧道等）。
- 构建前在 `.env.production` 设置 `VITE_API_BASE`（当前仓库示例为 Cloudflare 隧道 URL；隧道重启会变 hostname，需改后重新 `deploy`）。
- 后端设置 `CORS_ORIGIN` 为 Pages Origin（如 `https://abinga136211.github.io`）。
- 跨站后台：前端依赖 Bearer token；可选 `COOKIE_SAMESITE=none`。

### 7.4 自有服务器（前后端一体或分离，推荐生产）

一期方案中部署细则仍待定（见 `docs/backend-sqlite-plan.md` P8），常见做法如下。

**A. 同机部署（推荐小规模）**

1. 服务器安装 Node（满足 `engines`），克隆仓库并 `npm install`。
2. 生产 `.env` 示例：

```env
PORT=3003
SQLITE_PATH=/var/lib/adgpay/adgpay.sqlite
CORS_ORIGIN=https://www.adgpay.com
ADMIN_PASSWORD=请换成强密码
# 或 ADMIN_PASSWORD_HASH=...
# VITE_API_BASE 在构建机设置；若 Nginx 同源反代 /api 则可留空
```

3. 若生产站点根路径为 `/` 而非 `/Joanna/`，构建前将 `vite.config.js` 的 `base` 改为 `'/'`。
4. 构建前端：`npm run build`，用 Nginx（或 Express 静态）托管 `dist/`。
5. 进程守护启动 API，例如：

```sh
NODE_ENV=production npm run start:server
# 或使用 pm2 / systemd
```

6. Nginx 示例要点：
   - `location /` → 前端静态 + SPA `try_files`
   - `location /api` → `proxy_pass http://127.0.0.1:3003`
   - HTTPS、上传体积限制（简历 ≤5MB）、定期备份 `adgpay.sqlite` 与 `uploads/`

**B. 前后端分离**

- 前端静态 CDN / Pages：构建时 `VITE_API_BASE=https://api.xxx.com`
- 后端：`CORS_ORIGIN` 指向前端 Origin；跨站鉴权以 Bearer 为主，必要时 `COOKIE_SAMESITE=none`

### 7.5 数据备份建议

- 备份文件：`*.sqlite`（及 WAL 时先 checkpoint 或停写后拷贝）
- 备份目录：`server/uploads/resumes/`
- 勿将 `.env`、sqlite、上传简历提交到 Git（已在 `.gitignore` 中忽略）
- `.env.production` 中的 `VITE_API_BASE` 会打进前端包（公开 API 地址，非密钥）；隧道 URL 变更后需重新构建发布

---

## 8. 相关文档

| 文档 | 内容 |
|------|------|
| `README.md` | 快速开始与目录说明 |
| `docs/backend-sqlite-plan.md` | 一期后端方案、表模型与里程碑 |
| `docs/CREDITS.md` | 图片与视觉资源许可（原根目录 `CREDITS.md` 已迁入） |
| `docs/COPY.md` | 文案相关说明（原根目录 `COPY.md` 已迁入） |
| `docs/context-update.md` | 首页 Hero / 产品五卡 / 专属方案 / 关于·数据条 / 合规文案快照 |
| `.env.example` | 本地环境变量说明 |
| `.env.production` | 生产构建用的 `VITE_API_BASE` 等（公开 API 地址，非密钥） |

辅助脚本（非运行时依赖）：`scripts/spa-github-pages.mjs`（部署 SPA 回退）、`scripts/generate-globe-paths.mjs`、Coverr/Mixkit 等素材拉取脚本与 JSON 清单。

---

*文档根据当前仓库实现整理（2026-10-13），若代码变更请以源码与 migration 为准同步更新本文。*
