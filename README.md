# ADG PAY（Vue 3）

由 `public/adgpay.html` 重构而来的 Vue 3 + Vite 官网项目，便于后续按页面/组件修改。

## 本地开发

```sh
npm install
npm run dev
```

## 目录结构

```
src/
  assets/styles/adgpay.css   # 原站样式
  components/layout/         # 顶栏、页脚
  components/chat/           # 智能助手
  views/                     # 首页 / 产品 / 关于 / 合规 / FAQ / 联系 / 隐私
  stores/locale.js           # 中英双语
  router/index.js            # 路由（原 hash 视图 → 路径）
```

密钥放在 `.env`（参考 `.env.example`），勿提交到仓库。原单页备份为 `public/adgpay.legacy.html`。

图片与视觉资源的来源、许可及商用说明见 [`CREDITS.md`](./CREDITS.md)。

## 构建

```sh
npm run build
```

```sh
npm run test:unit
```

```sh
npm run lint
```
