<template>
  <nav class="section-dots" :aria-label="ariaLabel">
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      class="section-dot"
      :class="{ 'is-active': item.id === activeId }"
      :aria-current="item.id === activeId ? 'true' : undefined"
      @click="go(item.id)"
    >
      <span class="section-dot-label">{{ item.label }}</span>
      <span class="section-dot-mark" aria-hidden="true"></span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Right-edge section navigator for long editorial pages. Marks the section
 * currently occupying the middle of the viewport; desktop only (see styles).
 */
const props = defineProps<{ items: Array<{ id: string; label: string }>; ariaLabel?: string }>()
const activeId = ref(props.items[0]?.id ?? '')
let observer: IntersectionObserver | null = null

const go = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}

onMounted(() => {
  if (!('IntersectionObserver' in window)) return
  observer = new IntersectionObserver(
    (entries) => {
      // The entry whose section crosses the middle band of the viewport wins.
      const hit = entries.find((e) => e.isIntersecting)
      if (hit) activeId.value = (hit.target as HTMLElement).id
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  )
  props.items.forEach((item) => {
    const el = document.getElementById(item.id)
    if (el) observer!.observe(el)
  })
})

onUnmounted(() => observer?.disconnect())
</script>

<style scoped lang="scss">
.section-dots {
  position: fixed;
  right: 22px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 14px;
  z-index: 40;

  @media (max-width: 1100px) {
    display: none;
  }
}

.section-dot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 4px 0;
  background: none;
  border: 0;
  cursor: pointer;
  color: #fff;

  &-mark {
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.35);
    box-shadow: 0 0 0 1px rgba(4, 54, 85, 0.35);
    transition: transform 0.3s ease, background 0.3s ease;
  }

  &-label {
    font-size: 12px;
    letter-spacing: 0.08em;
    padding: 4px 10px;
    color: #fff;
    background: rgba(4, 54, 85, 0.85);
    opacity: 0;
    transform: translateX(6px);
    transition: opacity 0.25s ease, transform 0.25s ease;
    pointer-events: none;
    white-space: nowrap;
  }

  &:hover .section-dot-label,
  &:focus-visible .section-dot-label {
    opacity: 1;
    transform: translateX(0);
  }

  &:focus-visible {
    outline: 2px solid #12B5A8;
    outline-offset: 2px;
  }

  &.is-active .section-dot-mark {
    background: #12B5A8;
    transform: scale(1.5);
  }
}

@media (prefers-reduced-motion: reduce) {
  .section-dot-mark,
  .section-dot-label {
    transition: none;
  }
}
</style>
