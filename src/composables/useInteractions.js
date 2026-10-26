import { ref, onMounted, onBeforeUnmount } from 'vue'

/** FAQ accordion behavior matching the original site */
export function useAccordion(rootRef) {
  function onClick(e) {
    const btn = e.target.closest('.acc-trigger')
    if (!btn || !rootRef.value?.contains(btn)) return
    const item = btn.parentElement
    const body = item.querySelector('.acc-body')
    if (!body) return
    const isOpen = item.classList.contains('open')
    item.parentElement.querySelectorAll('.acc-item').forEach((s) => {
      s.classList.remove('open')
      const b = s.querySelector('.acc-body')
      if (b) b.style.maxHeight = null
    })
    if (!isOpen) {
      item.classList.add('open')
      body.style.maxHeight = `${body.scrollHeight}px`
    }
  }

  onMounted(() => {
    rootRef.value?.addEventListener('click', onClick)
  })
  onBeforeUnmount(() => {
    rootRef.value?.removeEventListener('click', onClick)
  })
}

/** Solution tabs on Products page — switch left nav + right panel */
export function useProductTabs(rootRef) {
  const active = ref('b2b')

  function setTab(key, { scroll = false } = {}) {
    if (!key || !rootRef.value) return
    active.value = key
    rootRef.value.querySelectorAll('.scenario-tabs .tab').forEach((t) => {
      t.classList.toggle('active', t.getAttribute('data-tab') === key)
      const selected = t.getAttribute('data-tab') === key
      t.setAttribute('aria-selected', selected ? 'true' : 'false')
      t.tabIndex = selected ? 0 : -1
    })
    rootRef.value.querySelectorAll('[data-solution]').forEach((card) => {
      card.classList.toggle('is-active', card.getAttribute('data-solution') === key)
    })
    rootRef.value.querySelectorAll('.panel').forEach((p) => {
      const on = p.getAttribute('data-panel') === key
      p.classList.toggle('active', on)
      p.hidden = !on
    })
    if (!scroll) return
    const target =
      rootRef.value.querySelector(`#solutions`) ||
      rootRef.value.querySelector(`[data-solution="${key}"]`) ||
      rootRef.value.querySelector(`#${CSS.escape(key)}`)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function onClick(e) {
    const tab = e.target.closest('.scenario-tabs .tab')
    if (!tab || !rootRef.value?.contains(tab)) return
    const key = tab.getAttribute('data-tab')
    if (!key) return
    setTab(key, { scroll: false })
  }

  onMounted(() => {
    rootRef.value?.addEventListener('click', onClick)
  })
  onBeforeUnmount(() => {
    rootRef.value?.removeEventListener('click', onClick)
  })

  return { active, setTab }
}
