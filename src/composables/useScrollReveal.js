import { onMounted, onBeforeUnmount } from 'vue'

/**
 * Scroll-reveal: adds .reveal-visible to elements with .reveal when they enter viewport.
 * Supports stagger via .reveal-group parent (children .reveal get incremental transition-delay).
 */
export function useScrollReveal(rootRef) {
  let observer = null

  function observe(root) {
    if (!root) return
    const targets = root.querySelectorAll('.reveal')

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('reveal-visible')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    // Stagger: children of .reveal-group get incremental delay
    root.querySelectorAll('.reveal-group').forEach((group) => {
      const isHeroCopy =
        group.classList.contains('hero-copy') ||
        group.classList.contains('hero-page-copy') ||
        group.classList.contains('hero-about-copy') ||
        group.classList.contains('license-copy')
      const isSplit =
        group.classList.contains('products-split') ||
        group.classList.contains('why-main')
      const list =
        isHeroCopy || isSplit
          ? group.querySelectorAll(':scope > .reveal')
          : group.querySelectorAll('.reveal')
      const step = isHeroCopy || isSplit ? 140 : 100
      const base = isHeroCopy || isSplit ? 80 : 0
      list.forEach((el, i) => {
        el.style.transitionDelay = `${base + i * step}ms`
      })
    })

    targets.forEach((el) => observer.observe(el))
  }

  onMounted(() => observe(rootRef?.value ?? document))

  onBeforeUnmount(() => {
    observer?.disconnect()
  })
}
