import { onMounted, onUnmounted } from 'vue'

/**
 * Reveal-on-scroll. Elements sit at opacity 0 in CSS and get `revealedClass`
 * once they scroll into view.
 *
 * ponytail: the failure mode that actually hurts is content stuck at opacity 0
 * forever — no IntersectionObserver, observer never fires, or a JS error before
 * observe() runs. Invisible content is worse than un-animated content, so every
 * path through here ends with the element revealed.
 */
export function useScrollReveal(selector = '.scroll-reveal', revealedClass = 'revealed') {
  let observer: IntersectionObserver | null = null
  let safetyTimer: number | undefined

  onMounted(() => {
    const els = Array.from(document.querySelectorAll(selector))
    if (!els.length) return

    const reveal = (el: Element) => el.classList.add(revealedClass)

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(reveal)
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target)
            observer?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    els.forEach((el) => observer?.observe(el))

    // ponytail: rescue only what is already on screen, so below-the-fold items
    // keep their animation. Upgrade path: drop this if the observer proves reliable.
    safetyTimer = window.setTimeout(() => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight && r.bottom > 0) reveal(el)
      })
    }, 1500)
  })

  onUnmounted(() => {
    observer?.disconnect()
    if (safetyTimer) clearTimeout(safetyTimer)
  })
}
