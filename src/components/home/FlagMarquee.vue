<script setup>
import { computed } from 'vue'
import { useLocaleStore } from '@/stores/locale'

const locale = useLocaleStore()

/** ISO 3166-1 alpha-2 — flagcdn.com */
const regions = [
  { code: 'hk', zh: '香港', tw: '香港', en: 'Hong Kong' },
  { code: 'sg', zh: '新加坡', tw: '新加坡', en: 'Singapore' },
  { code: 'tw', zh: '台湾', tw: '台灣', en: 'Taiwan' },
  { code: 'kr', zh: '韩国', tw: '韓國', en: 'South Korea' },
  { code: 'au', zh: '澳大利亚', tw: '澳大利亞', en: 'Australia' },
  { code: 'ca', zh: '加拿大', tw: '加拿大', en: 'Canada' },
  { code: 'za', zh: '南非', tw: '南非', en: 'South Africa' },
  { code: 'fr', zh: '法国', tw: '法國', en: 'France' },
  { code: 'it', zh: '意大利', tw: '意大利', en: 'Italy' },
  { code: 'ae', zh: '阿联酋', tw: '阿聯酋', en: 'UAE' },
  { code: 'us', zh: '美国', tw: '美國', en: 'United States' },
  { code: 'gb', zh: '英国', tw: '英國', en: 'United Kingdom' },
  { code: 'jp', zh: '日本', tw: '日本', en: 'Japan' },
  { code: 'my', zh: '马来西亚', tw: '馬來西亞', en: 'Malaysia' },
  { code: 'th', zh: '泰国', tw: '泰國', en: 'Thailand' },
  { code: 'id', zh: '印度尼西亚', tw: '印度尼西亞', en: 'Indonesia' },
  { code: 'de', zh: '德国', tw: '德國', en: 'Germany' },
  { code: 'nl', zh: '荷兰', tw: '荷蘭', en: 'Netherlands' },
  { code: 'ph', zh: '菲律宾', tw: '菲律賓', en: 'Philippines' },
  { code: 'vn', zh: '越南', tw: '越南', en: 'Vietnam' },
  { code: 'nz', zh: '新西兰', tw: '新西蘭', en: 'New Zealand' },
  { code: 'ch', zh: '瑞士', tw: '瑞士', en: 'Switzerland' },
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
