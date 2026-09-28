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

/** Industry tabs on Products page */
export function useProductTabs(rootRef) {
  const active = ref('ecom')

  function onClick(e) {
    const tab = e.target.closest('.tab')
    if (!tab || !rootRef.value?.contains(tab)) return
    const key = tab.getAttribute('data-tab')
    if (!key) return
    active.value = key
    rootRef.value.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'))
    tab.classList.add('active')
    rootRef.value.querySelectorAll('.panel').forEach((p) => {
      p.classList.toggle('active', p.getAttribute('data-panel') === key)
    })
  }

  onMounted(() => {
    rootRef.value?.addEventListener('click', onClick)
  })
  onBeforeUnmount(() => {
    rootRef.value?.removeEventListener('click', onClick)
  })

  return { active }
}
