<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useLocaleStore } from '@/stores/locale'

const props = defineProps({
  modelValue: { type: String, default: '' },
  invalid: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const locale = useLocaleStore()
const open = ref(false)
const rootRef = ref(null)
const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth()) // 0-based

const isEn = computed(() => locale.language === 'en')
const placeholder = computed(() => (isEn.value ? 'mm/dd/yyyy' : 'yyyy/mm/dd'))

const WEEKDAYS = {
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  zh: ['日', '一', '二', '三', '四', '五', '六'],
  tw: ['日', '一', '二', '三', '四', '五', '六'],
}
const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const weekdays = computed(() => WEEKDAYS[locale.language] || WEEKDAYS.zh)

const monthLabel = computed(() => {
  if (isEn.value) return `${MONTHS_EN[viewMonth.value]} ${viewYear.value}`
  return `${viewYear.value}年${viewMonth.value + 1}月`
})

const displayValue = computed(() => formatDate(props.modelValue))

const today = computed(() => todayIso())

const cells = computed(() => {
  const y = viewYear.value
  const m = viewMonth.value
  const first = new Date(y, m, 1)
  const startPad = first.getDay()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const list = []
  for (let i = 0; i < startPad; i += 1) list.push(null)
  for (let d = 1; d <= daysInMonth; d += 1) {
    const iso = `${y}-${pad2(m + 1)}-${pad2(d)}`
    list.push({
      day: d,
      iso,
      disabled: iso < today.value,
      selected: iso === props.modelValue,
      isToday: iso === today.value,
    })
  }
  return list
})

function pad2(n) {
  return String(n).padStart(2, '0')
}

function todayIso() {
  const d = new Date()
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = String(iso).split('-')
  if (!y || !m || !d) return ''
  return isEn.value ? `${m}/${d}/${y}` : `${y}/${m}/${d}`
}

function syncViewToValue() {
  if (props.modelValue) {
    const [y, m] = props.modelValue.split('-').map(Number)
    if (y && m) {
      viewYear.value = y
      viewMonth.value = m - 1
      return
    }
  }
  const now = new Date()
  viewYear.value = now.getFullYear()
  viewMonth.value = now.getMonth()
}

function toggle() {
  open.value = !open.value
  if (open.value) syncViewToValue()
}

function close() {
  open.value = false
}

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value -= 1
  } else {
    viewMonth.value -= 1
  }
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value += 1
  } else {
    viewMonth.value += 1
  }
}

function selectDay(cell) {
  if (!cell || cell.disabled) return
  emit('update:modelValue', cell.iso)
  close()
}

function onDocPointerDown(e) {
  if (!open.value) return
  if (rootRef.value && !rootRef.value.contains(e.target)) close()
}

function onKeydown(e) {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocPointerDown)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocPointerDown)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div
    ref="rootRef"
    class="contact-date-field"
    :class="{ 'is-invalid': invalid, 'is-open': open }"
  >
    <button
      id="appointment_date"
      type="button"
      class="contact-date-field__trigger"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-label="locale.t('预约日期', 'Preferred Date', '預約日期')"
      @click="toggle"
    >
      <span v-if="displayValue" class="contact-date-field__value">{{ displayValue }}</span>
      <span v-else class="contact-date-field__placeholder">{{ placeholder }}</span>
    </button>

    <div v-if="open" class="contact-date-field__popup" role="dialog" :aria-label="monthLabel">
      <div class="contact-date-field__nav">
        <button type="button" class="contact-date-field__nav-btn" aria-label="Previous month" @click="prevMonth">‹</button>
        <div class="contact-date-field__month">{{ monthLabel }}</div>
        <button type="button" class="contact-date-field__nav-btn" aria-label="Next month" @click="nextMonth">›</button>
      </div>
      <div class="contact-date-field__weekdays">
        <span v-for="w in weekdays" :key="w">{{ w }}</span>
      </div>
      <div class="contact-date-field__grid">
        <button
          v-for="(cell, idx) in cells"
          :key="idx"
          type="button"
          class="contact-date-field__day"
          :class="{
            'is-empty': !cell,
            'is-disabled': cell?.disabled,
            'is-selected': cell?.selected,
            'is-today': cell?.isToday,
          }"
          :disabled="!cell || cell.disabled"
          @click="selectDay(cell)"
        >
          {{ cell?.day || '' }}
        </button>
      </div>
    </div>
  </div>
</template>
