<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useLocaleStore } from '@/stores/locale'

const COOKIE_NAME = 'adgpay-cookie-consent'
/** 1 year */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365
const locale = useLocaleStore()
const visible = ref(false)
/** @type {import('vue').Ref<null | 'privacy' | 'cookie'>} */
const policyModal = ref(null)

function readCookie(name) {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`),
  )
  return match ? decodeURIComponent(match[1]) : null
}

function writeCookie(name, value, maxAge = COOKIE_MAX_AGE) {
  const secure = typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
}

function openPolicy(type, e) {
  e.preventDefault()
  e.stopPropagation()
  policyModal.value = type
}

function closePolicy() {
  policyModal.value = null
}

function onKeydown(e) {
  if (e.key === 'Escape' && policyModal.value) closePolicy()
}

const COPY = {
  zh: {
    title: 'Cookie 偏好设定',
    before: '本网站使用 Cookie 为您提供更好的体验，继续浏览即表示您同意我们的',
    privacy: '《隐私政策》',
    mid: '及',
    cookie: '《Cookie 政策》',
    after: '。',
    decline: '拒绝',
    agree: '同意',
    close: '关闭',
    privacyTitle: '隐私政策',
    cookieTitle: 'Cookie 政策',
    privacyBody: [
      'AD GLOBAL (HONG KONG) LIMITED（「本公司」「我们」）重视您的隐私。本政策说明我们在您访问或使用网站、产品与服务，或与我们沟通、申请账户时，如何收集、使用、披露、保留及保护个人资料。',
      '我们可能收集账户与联系资料、身份核验与合规资料、业务与交易资料，以及设备、日志与 Cookie 等技术信息，用于提供服务、履行 KYC/AML 等合规义务、防范欺诈、保障安全，并在法律允许范围内改进体验。',
      '我们可能在必要范围内向集团公司、身份核验与风控服务商、银行与支付合作方、监管与执法机关等披露资料，并在跨境传输时采取适当保障措施。',
      '视适用法律，您可请求访问、更正、删除或限制处理个人资料，或撤回同意。如有疑问，请联系 Athos.xu@adgpay.com。',
    ],
    cookieBody: [
      '我们使用 Cookie、本地存储及类似技术，用于维持网站基本功能、记住语言与 Cookie 偏好、保障账户与交易安全，并在同意后用于了解站点使用情况与改进服务。',
      '必要 Cookie：保障页面正常运行、安全与偏好记忆所必需，通常无法关闭，否则部分功能可能不可用。',
      '分析 / 体验 Cookie：帮助我们了解访问情况与页面表现；仅在您同意后启用，您可随时通过本提示条重新选择。',
      '您也可在浏览器设置中屏蔽或删除 Cookie。拒绝非必要 Cookie 不影响浏览本站的基本内容，但部分个性化或统计功能可能受限。',
    ],
  },
  tw: {
    title: 'Cookie 偏好設定',
    before: '本網站使用 Cookie 為您提供更好的體驗，繼續瀏覽即表示您同意我們的',
    privacy: '《隱私政策》',
    mid: '及',
    cookie: '《Cookie 政策》',
    after: '。',
    decline: '拒絕',
    agree: '同意',
    close: '關閉',
    privacyTitle: '隱私政策',
    cookieTitle: 'Cookie 政策',
    privacyBody: [
      'AD GLOBAL (HONG KONG) LIMITED（「本公司」「我們」）重視您的隱私。本政策說明我們在您造訪或使用網站、產品與服務，或與我們溝通、申請帳戶時，如何收集、使用、披露、保留及保護個人資料。',
      '我們可能收集帳戶與聯絡資料、身份核驗與合規資料、業務與交易資料，以及裝置、日誌與 Cookie 等技術資訊，用於提供服務、履行 KYC/AML 等合規義務、防範欺詐、保障安全，並在法律允許範圍內改進體驗。',
      '我們可能在必要範圍內向集團公司、身份核驗與風控服務商、銀行與支付合作方、監管與執法機關等披露資料，並在跨境傳輸時採取適當保障措施。',
      '視適用法律，您可請求存取、更正、刪除或限制處理個人資料，或撤回同意。如有疑問，請聯繫 Athos.xu@adgpay.com。',
    ],
    cookieBody: [
      '我們使用 Cookie、本地儲存及類似技術，用於維持網站基本功能、記住語言與 Cookie 偏好、保障帳戶與交易安全，並在同意後用於了解站點使用情況與改進服務。',
      '必要 Cookie：保障頁面正常運行、安全與偏好記憶所必需，通常無法關閉，否則部分功能可能不可用。',
      '分析 / 體驗 Cookie：幫助我們了解造訪情況與頁面表現；僅在您同意後啟用，您可隨時透過本提示條重新選擇。',
      '您也可在瀏覽器設定中屏蔽或刪除 Cookie。拒絕非必要 Cookie 不影響瀏覽本站的基本內容，但部分個人化或統計功能可能受限。',
    ],
  },
  en: {
    title: 'Cookie Preferences',
    before:
      'This website uses cookies to provide you with a better experience. By continuing to browse, you agree to our ',
    privacy: '《Privacy Policy》',
    mid: 'and',
    cookie: '《Cookie Policy》',
    after: '.',
    decline: 'Decline',
    agree: 'Agree',
    close: 'Close',
    privacyTitle: 'Privacy Policy',
    cookieTitle: 'Cookie Policy',
    privacyBody: [
      'AD GLOBAL (HONG KONG) LIMITED (“we”, “us” or “our”) respects your privacy. This notice explains how we collect, use, disclose, retain and protect personal data when you visit or use our websites, products and services, communicate with us, or apply for an account.',
      'We may collect account and contact details, identity and compliance information, business and transaction data, and technical data such as device, log and cookie identifiers. We use this information to provide services, meet KYC/AML and other legal duties, prevent fraud, protect security, and improve our experience where permitted by law.',
      'Where necessary, we may share data with group companies, identity and risk vendors, banking and payment partners, and regulators or law-enforcement bodies, and apply appropriate safeguards for cross-border transfers.',
      'Depending on applicable law, you may request access to, correction or deletion of, or restriction of processing of personal data, or withdraw consent. For questions, contact Athos.xu@adgpay.com.',
    ],
    cookieBody: [
      'We use cookies, local storage and similar technologies to keep the site working, remember language and cookie preferences, protect account and transaction security, and—with your consent—understand usage and improve our services.',
      'Essential cookies: required for basic operation, security and preference memory. These usually cannot be switched off without breaking parts of the site.',
      'Analytics / experience cookies: help us understand visits and page performance. They are used only after you agree, and you may change your choice via this banner.',
      'You can also block or delete cookies in your browser settings. Declining non-essential cookies does not block basic browsing, but some personalisation or analytics may be limited.',
    ],
  },
}

const copy = computed(() => COPY[locale.language] || COPY.zh)

const modalTitle = computed(() =>
  policyModal.value === 'cookie' ? copy.value.cookieTitle : copy.value.privacyTitle,
)

const modalBody = computed(() =>
  policyModal.value === 'cookie' ? copy.value.cookieBody : copy.value.privacyBody,
)

watch(policyModal, (open) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  if (!readCookie(COOKIE_NAME)) visible.value = true
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})

function dismiss(choice) {
  writeCookie(COOKIE_NAME, choice)
  visible.value = false
  closePolicy()
}
</script>

<template>
  <Transition name="cookie-banner">
    <div
      v-if="visible"
      class="cookie-consent"
      role="dialog"
      aria-live="polite"
      :aria-label="copy.title"
    >
      <div class="cookie-consent__inner">
        <div class="cookie-consent__copy">
          <strong class="cookie-consent__title">{{ copy.title }}</strong>
          <p class="cookie-consent__text">
            {{ copy.before }}<a
              class="cookie-consent__link"
              href="#privacy-policy"
              @click="openPolicy('privacy', $event)"
              >{{ copy.privacy }}</a
            >{{ copy.mid }}<a
              class="cookie-consent__link"
              href="#cookie-policy"
              @click="openPolicy('cookie', $event)"
              >{{ copy.cookie }}</a
            >{{ copy.after }}
          </p>
        </div>
        <div class="cookie-consent__actions">
          <button class="cookie-consent__btn cookie-consent__btn--decline" type="button" @click="dismiss('declined')">
            {{ copy.decline }}
          </button>
          <button class="cookie-consent__btn cookie-consent__btn--agree" type="button" @click="dismiss('accepted')">
            {{ copy.agree }}
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <Teleport to="body">
    <Transition name="cookie-policy">
      <div
        v-if="policyModal"
        class="cookie-policy-overlay"
        role="presentation"
        @click.self="closePolicy"
      >
        <div
          class="cookie-policy-modal"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="'cookie-policy-title'"
        >
          <div class="cookie-policy-modal__head">
            <h2 id="cookie-policy-title">{{ modalTitle }}</h2>
            <button
              class="cookie-policy-modal__close"
              type="button"
              :aria-label="copy.close"
              @click="closePolicy"
            >
              ×
            </button>
          </div>
          <div class="cookie-policy-modal__body">
            <p v-for="(para, i) in modalBody" :key="i">{{ para }}</p>
          </div>
          <div class="cookie-policy-modal__foot">
            <button class="cookie-consent__btn cookie-consent__btn--agree" type="button" @click="closePolicy">
              {{ copy.close }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
