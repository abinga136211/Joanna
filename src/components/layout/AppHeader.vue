<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useLocaleStore } from '@/stores/locale'
import { useNavLinks } from '@/composables/useNavLinks'

const locale = useLocaleStore()
const route = useRoute()
const open = ref(false)
const scrolled = ref(false)
const langOpen = ref(false)
const langWrap = ref(null)
const openSub = ref('')
const { links } = useNavLinks()

const overHero = computed(() =>
  route.path === '/compliance' ||
  route.path === '/faq' ||
  route.path === '/contact' ||
  route.path === '/privacy',
)
const logoSrc = `${import.meta.env.BASE_URL}images/logo/adg-logo.png?v=4`

function isActive(to) {
  const path = to.split('#')[0] || to
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}

function childLabel(child) {
  return locale.t(child.zh, child.en, child.tw)
}

function toggleMenu() {
  open.value = !open.value
  langOpen.value = false
  openSub.value = ''
}

function closeMenu() {
  open.value = false
  openSub.value = ''
}

function toggleSub(key) {
  openSub.value = openSub.value === key ? '' : key
}

function onParentEnter(key) {
  if (window.matchMedia('(max-width: 760px)').matches) return
  openSub.value = key
}

function onNavLeave() {
  if (window.matchMedia('(max-width: 760px)').matches) return
  openSub.value = ''
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
  if (langOpen.value && langWrap.value && !langWrap.value.contains(e.target)) {
    langOpen.value = false
  }
}

function onDocKey(e) {
  if (e.key === 'Escape') {
    langOpen.value = false
    openSub.value = ''
  }
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
  <header class="nav" :class="{ open, scrolled, 'nav-over-hero': overHero }" id="nav">
    <div class="container nav-inner">
      <RouterLink aria-label="ADG PAY首页" class="brand" to="/" @click="closeMenu">
        <img class="logo-mark" :src="logoSrc" alt="ADG" width="110" height="28" />
        <span>ADG Pay</span>
      </RouterLink>

      <div class="nav-right">
        <nav aria-label="主导航" @mouseleave="onNavLeave">
          <ul class="nav-links">
            <li
              v-for="link in links"
              :key="link.key"
              class="nav-item"
              :class="{ 'has-sub': !!link.children?.length, open: openSub === link.key }"
              @mouseenter="link.children?.length && onParentEnter(link.key)"
            >
              <div v-if="link.children?.length" class="nav-parent">
                <RouterLink
                  class="nav-link"
                  :class="{ active: isActive(link.to) }"
                  :to="link.to"
                  @click="closeMenu"
                >
                  {{ locale.navLabel(link.key) }}
                </RouterLink>
                <button
                  type="button"
                  class="nav-caret"
                  :aria-expanded="openSub === link.key"
                  :aria-label="locale.t('展开子菜单', 'Open submenu', '展開子選單')"
                  @click.stop="toggleSub(link.key)"
                ></button>
              </div>
              <RouterLink
                v-else
                class="nav-link"
                :class="{ active: isActive(link.to) }"
                :to="link.to"
                @click="closeMenu"
              >
                {{ locale.navLabel(link.key) }}
              </RouterLink>
              <ul v-if="link.children?.length" class="nav-sub">
                <li v-for="child in link.children" :key="child.to">
                  <RouterLink :to="child.to" @click="closeMenu">
                    {{ childLabel(child) }}
                  </RouterLink>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <div class="nav-cta">
          <RouterLink class="btn btn-primary btn-sm" to="/contact" @click="closeMenu">
            {{ locale.navLabel('contact') }}
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
