import { onMounted, onUnmounted } from 'vue'

/**
 * Reveal-on-scroll. Elements sit at opacity 0 in CSS and get `revealedClass`
 * once they scroll into view.
 *
 * ponytail: the failure mode that actually hurts is content stuck at opacity 0
 * forever — no IntersectionObserver, observer never fires, or a JS error before
 * observe() runs. Invisible content is worse than un-animated content, so every
 * path through here ends with the element revealed.
 *
 * The scan repeats on DOM mutation, not just at mount. Nodes that appear later
 * — filtering /cases re-renders the whole grid — were never observed by the
 * mount-time query and stayed invisible permanently, because the 1500ms safety
 * sweep had long since fired. Every caller shares that grid-or-filter pattern,
 * so this is fixed here rather than in each view.
 */
export function useScrollReveal(selector = '.scroll-reveal', revealedClass = 'revealed') {
  let observer: IntersectionObserver | null = null
  let mutations: MutationObserver | null = null
  let safetyTimer: number | undefined
  let rescanQueued = false

  onMounted(() => {
    const reveal = (el: Element) => el.classList.add(revealedClass)
    const seen = new WeakSet<Element>()

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const canObserve = !reduceMotion && 'IntersectionObserver' in window

    if (canObserve) {
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
    }

    /** Pick up any element we have not handled yet, whenever it appeared. */
    const scan = () => {
      document.querySelectorAll(selector).forEach((el) => {
        if (seen.has(el)) return
        seen.add(el)
        if (canObserve) observer!.observe(el)
        else reveal(el)
      })
    }

    scan()

    // Re-scan on DOM changes, coalesced to one pass per frame so a filter
    // re-render does not trigger a query per inserted node.
    mutations = new MutationObserver(() => {
      if (rescanQueued) return
      rescanQueued = true
      requestAnimationFrame(() => {
        rescanQueued = false
        scan()
      })
    })
    mutations.observe(document.body, { childList: true, subtree: true })

    // ponytail: rescue only what is already on screen, so below-the-fold items
    // keep their animation. Upgrade path: drop this if the observer proves reliable.
    safetyTimer = window.setTimeout(() => {
      document.querySelectorAll(selector).forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight && r.bottom > 0) reveal(el)
      })
    }, 1500)
  })

  onUnmounted(() => {
    observer?.disconnect()
    mutations?.disconnect()
    if (safetyTimer) clearTimeout(safetyTimer)
  })
}
