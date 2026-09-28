/**
 * One-shot migration: public/adgpay.html → Vue 3 SFCs + CSS
 * Run: node scripts/migrate-adgpay.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const htmlPath = path.join(root, 'public', 'adgpay.html')
const html = fs.readFileSync(htmlPath, 'utf8')

const VIEW_MAP = {
  home: { file: 'HomeView.vue', route: '/' },
  products: { file: 'ProductsView.vue', route: '/products' },
  about: { file: 'AboutView.vue', route: '/about' },
  compliance: { file: 'ComplianceView.vue', route: '/compliance' },
  faq: { file: 'FaqView.vue', route: '/faq' },
  contact: { file: 'ContactView.vue', route: '/contact' },
  privacy: { file: 'PrivacyView.vue', route: '/privacy' },
}

const ANCHOR_ROUTES = {
  receive: '/products',
  settle: '/products',
  va: '/products',
  pay: '/products',
  workflow: '/products',
  bilingual: '/contact',
  license: '/about',
  guide: '/faq',
  faq: '/compliance',
}

function rewriteLinks(content) {
  let out = content
  // #view-xxx → /path
  out = out.replace(/href="#view-([a-z]+)"/g, (_, view) => {
    const route = VIEW_MAP[view]?.route ?? '/'
    return `href="${route}"`
  })
  // known anchors
  out = out.replace(/href="#([a-z][\w-]*)"/g, (full, id) => {
    if (id.startsWith('view-')) return full
    const base = ANCHOR_ROUTES[id]
    if (base) return `href="${base}#${id}"`
    return full
  })
  return out
}

function extractBetween(src, startMarker, endMarker) {
  const start = src.indexOf(startMarker)
  if (start < 0) throw new Error(`Missing start: ${startMarker}`)
  const from = start + startMarker.length
  const end = src.indexOf(endMarker, from)
  if (end < 0) throw new Error(`Missing end: ${endMarker}`)
  return src.slice(from, end)
}

// ——— CSS ———
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/)
if (!styleMatch) throw new Error('No <style> found')
let css = styleMatch[1]
// SPA .view display rules no longer needed with router
css = css.replace(
  /\/\* ---------- SPA 视图切换 ---------- \*\/\s*\.view \{ display: none; \}\s*\.view\.active \{ display: block; \}\s*/m,
  '/* views are routed by vue-router */\n',
)
fs.writeFileSync(path.join(root, 'src/assets/styles/adgpay.css'), css.trim() + '\n')
console.log('✓ CSS')

// ——— Header ———
const headerRaw = extractBetween(html, '<!-- ===== 顶部导航（共享） ===== -->', '<main>')
const headerInner = headerRaw
  .replace(/<header class="nav" id="nav">/, '')
  .replace(/<\/header>\s*$/, '')
  .trim()

// ——— Footer ———
const footerRaw = extractBetween(html, '<!-- ===== 页脚（共享） ===== -->', '<script>')
const footerInner = footerRaw
  .replace(/<footer class="footer">/, '')
  .replace(/<\/footer>\s*$/, '')
  .trim()

// ——— Chat widget HTML (after scripts) ———
const chatMatch = html.match(/<!-- ===== ADG PAY 智能助手插件 ===== -->([\s\S]*?)<\/body>/)
const chatHtml = chatMatch
  ? chatMatch[1]
      .replace(/<div class="adg-chat" id="adgChat">/, '')
      .replace(/<\/div>\s*$/, '')
      .trim()
  : ''

// ——— Views ———
const mainMatch = html.match(/<main>([\s\S]*?)<\/main>/)
if (!mainMatch) throw new Error('No <main>')
const main = mainMatch[1]

for (const [view, meta] of Object.entries(VIEW_MAP)) {
  const re = new RegExp(
    `<section class="view(?: active)?" data-view="${view}">([\\s\\S]*?)</section>\\s*(?=<!-- =+|<section class="view"|$)`,
  )
  // Nested sections make naive regex hard — find opening then match depth
  const openRe = new RegExp(`<section class="view(?: active)?" data-view="${view}">`)
  const openMatch = openRe.exec(main)
  if (!openMatch) {
    console.warn(`! view not found: ${view}`)
    continue
  }
  let i = openMatch.index + openMatch[0].length
  let depth = 1
  while (i < main.length && depth > 0) {
    const nextOpen = main.indexOf('<section', i)
    const nextClose = main.indexOf('</section>', i)
    if (nextClose < 0) break
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth++
      i = nextOpen + 8
    } else {
      depth--
      if (depth === 0) {
        const inner = main.slice(openMatch.index + openMatch[0].length, nextClose)
        const template = rewriteLinks(inner.trim())
        const vue = `<script setup>
import { onMounted, onUpdated, watch } from 'vue'
import { useLocaleStore } from '@/stores/locale'

const locale = useLocaleStore()

onMounted(() => locale.applyDom())
onUpdated(() => locale.applyDom())
watch(() => locale.language, () => locale.applyDom())
</script>

<template>
${template}
</template>
`
        fs.writeFileSync(path.join(root, 'src/views', meta.file), vue)
        console.log(`✓ ${meta.file}`)
        break
      }
      i = nextClose + 10
    }
  }
}

fs.writeFileSync(
  path.join(root, 'scripts/_extracted-header.html'),
  rewriteLinks(headerInner),
)
fs.writeFileSync(
  path.join(root, 'scripts/_extracted-footer.html'),
  rewriteLinks(footerInner),
)
fs.writeFileSync(path.join(root, 'scripts/_extracted-chat.html'), chatHtml)
console.log('✓ extracted header/footer/chat snippets')
console.log('Done.')
