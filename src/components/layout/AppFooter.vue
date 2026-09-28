<script setup>
import { RouterLink } from 'vue-router'
import { useLocaleStore } from '@/stores/locale'

const locale = useLocaleStore()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <RouterLink class="brand" to="/" style="margin-bottom: 14px">
            <span class="logo-mark">ADG</span
            ><span>ADG PAY<small>{{ locale.brandTag() }}</small></span>
          </RouterLink>
          <p
            data-en="A payment service provider holding a Hong Kong MSO licence, focused on compliant and transparent cross-border payment and collection solutions for cross-border enterprises."
            data-zh="持有香港 MSO牌照的支付服务提供商，专注为跨境企业提供合规、透明的跨境支付与收款方案。" data-tw="持有香港 MSO牌照的支付服務提供商，專注爲跨境企業提供合規、透明的跨境支付與收款方案。"
            style="color: #aebfdc; font-size: 0.92rem; max-width: 320px"
          >
            持有香港 MSO
            牌照的支付服务提供商，专注为跨境企业提供合规、透明的跨境支付与收款方案。
          </p>
        </div>
        <div>
          <h4 data-en="Products" data-zh="产品" data-tw="產品">产品</h4>
          <ul>
            <li>
              <RouterLink data-en="Cross-border Collection" data-zh="跨境收款" data-tw="跨境收款" to="/products#receive"
                >跨境收款</RouterLink
              >
            </li>
            <li>
              <RouterLink
                data-en="Multi-currency Settlement"
                data-zh="多币种结算" data-tw="多幣種結算"
                to="/products#settle"
                >多币种结算</RouterLink
              >
            </li>
            <li>
              <RouterLink data-en="Virtual Accounts" data-zh="虚拟账户" data-tw="虛擬賬戶" to="/products#va"
                >虚拟账户</RouterLink
              >
            </li>
            <li>
              <RouterLink data-en="Supplier Payments" data-zh="供应商付款" data-tw="供應商付款" to="/products#pay"
                >供应商付款</RouterLink
              >
            </li>
          </ul>
        </div>
        <div>
          <h4 data-en="Company" data-zh="公司" data-tw="公司">公司</h4>
          <ul>
            <li>
              <RouterLink data-en="About Us" data-zh="关于我们" data-tw="關於我們" to="/about">关于我们</RouterLink>
            </li>
            <li>
              <RouterLink
                data-en="Licence &amp; Qualifications"
                data-zh="牌照资质" data-tw="牌照資質"
                to="/about#license"
                >牌照资质</RouterLink
              >
            </li>
            <li>
              <RouterLink data-en="Compliance &amp; Security" data-zh="合规与安全" data-tw="合規與安全" to="/compliance"
                >合规与安全</RouterLink
              >
            </li>
            <li>
              <RouterLink data-en="Contact Us" data-zh="联系我们" data-tw="聯繫我們" to="/contact">联系我们</RouterLink>
            </li>
          </ul>
        </div>
        <div>
          <h4 data-en="Support" data-zh="支持" data-tw="支持">支持</h4>
          <ul>
            <li>
              <RouterLink data-en="Help Center" data-zh="帮助中心" data-tw="幫助中心" to="/faq"
                >帮助中心 / FAQ</RouterLink
              >
            </li>
            <li>
              <RouterLink data-en="User Guides" data-zh="使用指南" data-tw="使用指南" to="/faq#guide"
                >使用指南</RouterLink
              >
            </li>
            <li>
              <RouterLink data-en="Security Notes" data-zh="安全说明" data-tw="安全說明" to="/compliance"
                >安全说明</RouterLink
              >
            </li>
            <li>
              <RouterLink data-en="Business Cooperation" data-zh="商务合作" data-tw="商務合作" to="/contact"
                >商务合作</RouterLink
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span
          data-en="© 2026 AD GLOBAL (HONG KONG) LIMITED. All rights reserved."
          data-zh="© 2026 AD GLOBAL (HONG KONG) LIMITED. 保留所有权利。" data-tw="© 2026 AD GLOBAL (HONG KONG) LIMITED. 保留所有權利。"
          >© 2026 AD GLOBAL (HONG KONG) LIMITED. 保留所有权利。</span
        >
        <span
          class="disclaimer"
          data-en="Risk notice: Information on this website is subject to the formal agreement and local regulations; please confirm the specific availability, fees and arrival times of payment services with our team."
          data-zh="风险提示：本网站所示信息以正式协议及当地监管规定为准；支付服务的具体可用范围、费率与到账时间，请与我们的团队确认。" data-tw="風險提示：本網站所示信息以正式協議及當地監管規定為準；支付服務的具體可用範圍、費率與到賬時間，請與我們的團隊確認。"
          >风险提示：本网站所示信息以正式协议及当地监管规定为准；支付服务的具体可用范围、费率与到账时间，请与我们的团队确认。</span
        >
      </div>
    </div>
  </footer>
</template>
