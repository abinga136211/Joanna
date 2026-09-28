<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useLocaleStore } from '@/stores/locale'

const locale = useLocaleStore()
const route = useRoute()
const open = ref(false)
const scrolled = ref(false)
const langOpen = ref(false)
const langWrap = ref(null)

const links = [
  { key: 'home', to: '/' },
  { key: 'products', to: '/products' },
  { key: 'about', to: '/about' },
  { key: 'compliance', to: '/compliance' },
  { key: 'faq', to: '/faq' },
  { key: 'contact', to: '/contact' },
  { key: 'privacy', to: '/privacy' },
]

function isActive(to) {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(`${to}/`)
}

function toggleMenu() {
  open.value = !open.value
  langOpen.value = false
}

function closeMenu() {
  open.value = false
}

function toggleLangMenu() {
  langOpen.value = !langOpen.value
}

function pickLang(code) {
  locale.setLanguage(code)
  langOpen.value = false
}

watch(
  () => route.fullPath,
  () => {
    closeMenu()
    langOpen.value = false
  },
)

function onScroll() {
  scrolled.value = window.scrollY > 24
}

function onDocClick(e) {
  if (!langOpen.value) return
  if (langWrap.value && !langWrap.value.contains(e.target)) {
    langOpen.value = false
  }
}

function onDocKey(e) {
  if (e.key === 'Escape') langOpen.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onDocKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onDocKey)
})
</script>

<template>
  <header class="nav" :class="{ open, scrolled }" id="nav">
    <div class="container nav-inner">
      <RouterLink aria-label="ADG PAY首页" class="brand" to="/" @click="closeMenu">
        <span class="logo-mark">ADG</span>
        <span>ADG PAY<small>{{ locale.brandTag() }}</small></span>
      </RouterLink>

      <div class="nav-right">
        <nav aria-label="主导航">
          <ul class="nav-links">
            <li v-for="link in links" :key="link.key">
              <RouterLink
                :class="{ active: isActive(link.to) }"
                :to="link.to"
                @click="closeMenu"
              >
                {{ locale.navLabel(link.key) }}
              </RouterLink>
            </li>
          </ul>
        </nav>
        <div class="nav-cta">
          <RouterLink class="btn btn-primary btn-sm" to="/contact" @click="closeMenu">
            {{ locale.contactCta() }}
          </RouterLink>
          <div ref="langWrap" class="lang-switch" :class="{ open: langOpen }">
            <button
              aria-haspopup="listbox"
              :aria-expanded="langOpen"
              aria-label="选择语言"
              class="lang-toggle"
              type="button"
              @click.stop="toggleLangMenu"
            >
              {{ locale.langToggleLabel() }}
            </button>
            <ul
              v-show="langOpen"
              class="lang-menu"
              role="listbox"
              :aria-label="locale.t('选择语言', 'Select language', '選擇語言')"
            >
              <li v-for="code in locale.langs" :key="code" role="option" :aria-selected="locale.language === code">
                <button
                  type="button"
                  class="lang-option"
                  :class="{ active: locale.language === code }"
                  @click="pickLang(code)"
                >
                  {{ locale.langOptionLabel(code) }}
                </button>
              </li>
            </ul>
          </div>
          <button
            :aria-expanded="open"
            aria-label="打开菜单"
            class="nav-toggle"
            type="button"
            @click="toggleMenu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
