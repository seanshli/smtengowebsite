import { onMounted, onUnmounted, type Ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Editorial motion for content pages — one vocabulary, declared in markup:
 *
 *   data-reveal         element rises in once when it scrolls into view
 *   data-reveal-group   its direct children rise in with a stagger
 *   data-tag            section plate gets an `is-in` class (CSS draws its underline)
 *   data-parallax       element drifts up slightly as the page scrolls past it
 *   data-float          element breathes (slow vertical float) while on screen
 *   data-tilt           direct children tilt toward the pointer (hover + fine pointer only)
 *   .interfaces-table   rows cascade in, the ● markers pop
 *
 * Honors prefers-reduced-motion: nothing moves, everything is simply visible.
 * Everything animates transform/opacity only and is torn down on unmount.
 */
export function useEditorialMotion(root: Ref<HTMLElement | null>) {
  let ctx: gsap.Context | null = null
  const cleanups: Array<() => void> = []

  onMounted(() => {
    const el = root.value
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    ctx = gsap.context(() => {
      const q = gsap.utils.selector(el)

      if (reduced) {
        q('[data-tag]').forEach((t) => t.classList.add('is-in'))
        return
      }

      const rise = { y: 28, opacity: 0, duration: 0.9, ease: 'power3.out' }

      q('[data-reveal]').forEach((node) => {
        gsap.from(node, { ...rise, scrollTrigger: { trigger: node, start: 'top 86%', once: true } })
      })

      q('[data-reveal-group]').forEach((group) => {
        const kids = Array.from(group.children)
        if (!kids.length) return
        gsap.from(kids, { ...rise, y: 24, stagger: 0.09, scrollTrigger: { trigger: group, start: 'top 84%', once: true } })
      })

      q('[data-tag]').forEach((tag) => {
        ScrollTrigger.create({ trigger: tag, start: 'top 88%', once: true, onEnter: () => tag.classList.add('is-in') })
      })

      q('[data-parallax]').forEach((node) => {
        const amount = Number(node.getAttribute('data-parallax')) || 40
        gsap.to(node, {
          y: -amount,
          ease: 'none',
          scrollTrigger: { trigger: node, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
        })
      })

      q('[data-float]').forEach((node) => {
        const tween = gsap.to(node, { y: '+=8', duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut', paused: true })
        ScrollTrigger.create({
          trigger: node,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => tween.play(),
          onEnterBack: () => tween.play(),
          onLeave: () => tween.pause(),
          onLeaveBack: () => tween.pause()
        })
      })

      q('.interfaces-table').forEach((table) => {
        const rows = table.querySelectorAll('tbody tr')
        const marks = table.querySelectorAll('.if-yes')
        gsap.from(rows, { opacity: 0, y: 14, duration: 0.6, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: table, start: 'top 80%', once: true } })
        gsap.from(marks, { scale: 0.3, opacity: 0, duration: 0.5, stagger: 0.04, ease: 'back.out(2)', transformOrigin: '50% 50%', scrollTrigger: { trigger: table, start: 'top 80%', once: true } })
      })

      if (finePointer) {
        q('[data-tilt]').forEach((group) => {
          Array.from(group.children).forEach((card) => {
            const c = card as HTMLElement
            const move = (e: PointerEvent) => {
              const r = c.getBoundingClientRect()
              const px = (e.clientX - r.left) / r.width - 0.5
              const py = (e.clientY - r.top) / r.height - 0.5
              gsap.to(c, { rotateY: px * 6, rotateX: -py * 6, transformPerspective: 900, duration: 0.5, ease: 'power2.out' })
            }
            const leave = () => gsap.to(c, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'power3.out' })
            c.addEventListener('pointermove', move)
            c.addEventListener('pointerleave', leave)
            cleanups.push(() => { c.removeEventListener('pointermove', move); c.removeEventListener('pointerleave', leave) })
          })
        })
      }
    }, el)

    // Layout settles after images decode; make sure trigger positions are right.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    cleanups.push(() => window.removeEventListener('load', refresh))
  })

  onUnmounted(() => {
    cleanups.forEach((fn) => fn())
    ctx?.revert()
  })
}
