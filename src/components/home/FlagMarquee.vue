<script setup>
import { computed } from 'vue'
import { useLocaleStore } from '@/stores/locale'

const locale = useLocaleStore()

/** ISO 3166-1 alpha-2 — flagcdn.com；EEA 用 EU 旗 */
const regions = [
  { code: 'sg', zh: '新加坡', tw: '新加坡', en: 'Singapore' },
  { code: 'hk', zh: '香港', tw: '香港', en: 'Hong Kong' },
  { code: 'us', zh: '美国', tw: '美國', en: 'United States of America' },
  { code: 'id', zh: '印度尼西亚', tw: '印度尼西亞', en: 'Indonesia' },
  { code: 'vn', zh: '越南', tw: '越南', en: 'Vietnam' },
  { code: 'my', zh: '马来西亚', tw: '馬來西亞', en: 'Malaysia' },
  { code: 'ph', zh: '菲律宾', tw: '菲律賓', en: 'Philippines' },
  { code: 'tr', zh: '土耳其', tw: '土耳其', en: 'Turkey' },
  { code: 'ae', zh: '阿联酋', tw: '阿聯酋', en: 'UAE' },
  { code: 'kr', zh: '韩国', tw: '韓國', en: 'South Korea' },
  { code: 'au', zh: '澳大利亚', tw: '澳大利亞', en: 'Australia' },
  { code: 'gb', zh: '英国', tw: '英國', en: 'United Kingdom' },
  { code: 'sa', zh: '沙特阿拉伯', tw: '沙烏地阿拉伯', en: 'Saudi Arabia' },
  { code: 'eg', zh: '埃及', tw: '埃及', en: 'Egypt' },
  { code: 'in', zh: '印度', tw: '印度', en: 'India' },
  { code: 'pk', zh: '巴基斯坦', tw: '巴基斯坦', en: 'Pakistan' },
  { code: 'ma', zh: '摩洛哥', tw: '摩洛哥', en: 'Morocco' },
  { code: 'bd', zh: '孟加拉国', tw: '孟加拉', en: 'Bangladesh' },
  { code: 'ar', zh: '阿根廷', tw: '阿根廷', en: 'Argentina' },
  { code: 'cl', zh: '智利', tw: '智利', en: 'Chile' },
  { code: 'br', zh: '巴西', tw: '巴西', en: 'Brazil' },
  { code: 'th', zh: '泰国', tw: '泰國', en: 'Thailand' },
  { code: 'cn', zh: '中国', tw: '中國', en: 'China' },
  { code: 'ca', zh: '加拿大', tw: '加拿大', en: 'Canada' },
  { code: 'eu', zh: '欧洲经济区', tw: '歐洲經濟區', en: 'EEA' },
]

const labeled = computed(() =>
  regions.map((r) => ({
    ...r,
    name: locale.t(r),
  })),
)

function flagUrl(code) {
  return `https://flagcdn.com/w320/${code}.png`
}
</script>

<template>
  <section class="flag-flow" aria-label="覆盖地区">
    <div class="flag-flow-track-wrap">
      <div class="flag-flow-track" aria-hidden="true">
        <div v-for="dup in 2" :key="'a-' + dup" class="flag-flow-row">
          <div
            v-for="item in labeled"
            :key="'a-' + dup + '-' + item.code"
            class="flag-chip"
            :title="item.name"
          >
            <img
              :src="flagUrl(item.code)"
              :alt="item.name"
              loading="lazy"
              width="128"
              height="96"
            />
          </div>
        </div>
      </div>
    </div>

    <ul class="visually-hidden">
      <li v-for="item in labeled" :key="'sr-' + item.code">{{ item.name }}</li>
    </ul>
  </section>
</template>
