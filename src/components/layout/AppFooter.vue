<script setup>
import { RouterLink } from 'vue-router'
import { useLocaleStore } from '@/stores/locale'
import { useNavLinks } from '@/composables/useNavLinks'

const locale = useLocaleStore()
const { footerColumns } = useNavLinks()
const logoSrc = `${import.meta.env.BASE_URL}images/logo/adg-logo.png?v=4`

function columnTitle(col) {
  if (col.key === 'company') {
    return locale.t('公司', 'Company', '公司')
  }
  return locale.navLabel(col.key)
}

function childLabel(child) {
  return locale.t(child.zh, child.en, child.tw)
}
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <RouterLink class="brand" to="/" style="margin-bottom: 14px">
            <img class="logo-mark" :src="logoSrc" alt="ADG" width="110" height="28" />
            <span>ADG Pay</span>
          </RouterLink>
          <p
            data-en="ADG PAY builds licensed cross-border payment infrastructure for enterprises—covering global collection, international payouts and flexible FX with compliance and precision."
            data-zh="ADG PAY 为跨境企业打造专业资金通道，覆盖全球收款、国际付款与灵活换汇，以合规、精准的方式助力跨境资金流转"
            data-tw="ADG PAY 為跨境企業打造專業資金通道，覆蓋全球收款、國際付款與靈活換匯，以合規、精準的方式助力跨境資金流轉"
            style="color: #aebfdc; font-size: 0.92rem; max-width: 320px"
          >
            ADG PAY 为跨境企业打造专业资金通道，覆盖全球收款、国际付款与灵活换汇，以合规、精准的方式助力跨境资金流转
          </p>
        </div>
        <div v-for="col in footerColumns" :key="col.key" class="footer-col">
          <h4>
            <RouterLink class="footer-col-title" :to="col.to">{{ columnTitle(col) }}</RouterLink>
          </h4>
          <ul>
            <li v-for="child in col.children" :key="child.to">
              <RouterLink :to="child.to">{{ childLabel(child) }}</RouterLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span
          data-en="© 2026 AD GLOBAL (HONG KONG) LIMITED. All rights reserved."
          data-zh="© 2026 AD GLOBAL (HONG KONG) LIMITED. 保留所有权利。"
          data-tw="© 2026 AD GLOBAL (HONG KONG) LIMITED. 保留所有權利。"
          >© 2026 AD GLOBAL (HONG KONG) LIMITED. 保留所有权利。</span
        >
        <span
          class="disclaimer"
          data-en="Risk notice: Information on this website is subject to the formal agreement and applicable local regulations. Please confirm service availability, fees and settlement times with our team."
          data-zh="风险提示：本网站所示信息以正式协议及当地监管规定为准；支付服务的具体可用范围、费率与到账时间，请与我们的团队确认。"
          data-tw="風險提示：本網站所示信息以正式協議及當地監管規定為準；支付服務的具體可用範圍、費率與到賬時間，請與我們的團隊確認。"
          >风险提示：本网站所示信息以正式协议及当地监管规定为准；支付服务的具体可用范围、费率与到账时间，请与我们的团队确认。</span
        >
      </div>
    </div>
  </footer>
</template>
