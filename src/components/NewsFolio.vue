<template>
  <div
    class="folio"
    ref="root"
    tabindex="0"
    role="region"
    :aria-label="$t('newsTitle')"
    @keydown.left.prevent="prev"
    @keydown.right.prevent="next"
  >
    <!-- perspective stage: the book lies tilted on the desk -->
    <div class="folio-scene">
      <div class="folio-desk" aria-hidden="true"></div>
      <div class="folio-book" ref="book">
      <!-- Left leaf. Was a decorative watermark over half the book; now it carries
           the current article's plate, which frees the whole right leaf for text.
           Sits under the turning pages, revealed as each page lifts. -->
      <div class="folio-leftbase">
        <figure v-if="current && current.image" class="folio-plate">
          <img :src="current.image" :alt="tr(current.title)" decoding="async" />
        </figure>
        <div v-else class="folio-plate folio-plate--bare" aria-hidden="true">
          <span class="folio-watermark">enGo</span>
        </div>
        <figcaption v-if="current" class="folio-plate-cap">
          <span class="folio-plate-brand">enGo 生活誌</span>
          <!-- Every news plate is our own illustration, not a photo of the
               event or of a partner's product. Say so rather than imply it. -->
          <span v-if="current.image" class="folio-plate-note">
            {{ locale.startsWith('zh') ? '示意圖' : 'Illustration' }}
          </span>
          <time>{{ formatDate(current.date) }}</time>
        </figcaption>
      </div>

      <!-- unread page-stack edge, right side -->
      <div class="folio-stack" aria-hidden="true"></div>

      <article
        v-for="(item, i) in items"
        :key="item.id"
        ref="pageEls"
        class="folio-page"
        :aria-hidden="i !== page"
      >
        <div class="folio-face" @click="onPageClick">
          <header class="folio-mast">
            <span class="folio-brand">enGo 生活誌</span>
            <span class="folio-issue">N°{{ String(i + 1).padStart(2, '0') }}</span>
            <time class="folio-date">{{ formatDate(item.date) }}</time>
          </header>

          <h4 class="folio-headline">{{ tr(item.title) }}</h4>

          <div class="folio-body" :class="{ 'has-image': !!item.image }">
            <!-- mobile only: the page covers the left leaf below 768px, so the
                 plate has to come inline or the article loses its image entirely -->
            <figure v-if="item.image" class="folio-figure">
              <img :src="item.image" :alt="tr(item.title)" loading="lazy" />
            </figure>
            <p class="folio-summary" v-html="tr(item.summary)"></p>
          </div>

          <footer class="folio-foot">
            <span class="folio-pageno">{{ i + 1 }} ／ {{ items.length }}</span>
            <span v-if="i < items.length - 1" class="folio-corner" aria-hidden="true"></span>
          </footer>

          <!-- sweeping paper shadow during the turn -->
          <div class="folio-shade" ref="shadeEls" aria-hidden="true"></div>
        </div>

        <!-- paper back, visible on the left pile after the turn -->
        <div class="folio-verso" aria-hidden="true">
          <span class="folio-verso-ghost">{{ tr(item.title) }}</span>
        </div>
      </article>
      </div>
    </div>

    <div class="folio-controls">
      <button class="folio-btn" :disabled="page === 0 || flipping" @click="prev">
        ← {{ locale.startsWith('zh') ? '上一頁' : 'Prev' }}
      </button>
      <span class="folio-count">{{ page + 1 }} / {{ items.length }}</span>
      <button class="folio-btn" :disabled="page === items.length - 1 || flipping" @click="next">
        {{ locale.startsWith('zh') ? '下一頁' : 'Next' }} →
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'

type NewsLocale = 'zh' | 'zhCN' | 'en' | 'fr' | 'ja' | 'es'

interface NewsItem {
  id: number
  date: string
  image?: string
  title: Record<NewsLocale, string>
  summary: Record<NewsLocale, string>
}

export default defineComponent({
  name: 'NewsFolio',
  props: {
    items: { type: Array as PropType<NewsItem[]>, required: true }
  },
  setup(props) {
    const { locale } = useI18n()
    const root = ref<HTMLElement | null>(null)
    const book = ref<HTMLElement | null>(null)
    const pageEls = ref<HTMLElement[]>([])
    const shadeEls = ref<HTMLElement[]>([])
    const page = ref(0)
    const flipping = ref(false)

    const tr = (field: Record<NewsLocale, string>): string =>
      field[locale.value as NewsLocale] || field.en

    // the article whose plate the left leaf is showing
    const current = computed<NewsItem | undefined>(() => props.items[page.value])

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr)
      const loc = locale.value as NewsLocale
      const dateLocale =
        loc === 'zh' || loc === 'zhCN' ? 'zh-TW' :
        loc === 'ja' ? 'ja-JP' :
        loc === 'fr' ? 'fr-FR' :
        loc === 'es' ? 'es-ES' : 'en-US'
      return date.toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })
    }

    const isMobile = () => window.matchMedia('(max-width: 768px)').matches
    const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // z-index model: unread stack descends from 100; the left (read) pile
    // ascends from 10 so later-flipped pages rest on top; a page in motion
    // floats above everything at 300.
    const settle = (el: HTMLElement, i: number, flipped: boolean) => {
      el.style.zIndex = String(flipped ? 10 + i : 100 - i)
      // A page that has finished turning comes to rest face-down over the left
      // leaf and hid the plate — the photo appeared for the length of the flip
      // and then vanished. The left leaf IS the plate, so read pages retire.
      if (flipped) el.style.visibility = 'hidden'
    }

    onMounted(() => {
      pageEls.value.forEach((el, i) => {
        gsap.set(el, { rotationY: 0, transformOrigin: 'left center' })
        settle(el, i, false)
      })
    })

    const flip = (dir: 1 | -1) => {
      if (flipping.value) return
      const idx = dir === 1 ? page.value : page.value - 1
      if (idx < 0 || idx >= props.items.length) return
      if (dir === 1 && page.value >= props.items.length - 1) return

      const el = pageEls.value[idx]
      const shade = shadeEls.value[idx]
      // ponytail: mobile has no left panel, so the page exits at -104° instead
      // of resting at -180; a desktop<->mobile resize mid-session won't
      // re-settle flipped pages — acceptable for a prototype.
      const restAngle = isMobile() ? -104 : -180
      const dur = reduced() ? 0 : 0.9

      flipping.value = true
      el.style.zIndex = '300'
      el.style.visibility = 'visible'

      // The page lifts off the book (translateZ) while it turns, then settles —
      // the lift is what sells the 3D against the tilted book.
      const tl = gsap.timeline({
        onComplete: () => {
          settle(el, idx, dir === 1)
          page.value += dir
          flipping.value = false
        }
      })
      tl.to(el, {
        rotationY: dir === 1 ? restAngle : 0,
        duration: dur,
        ease: 'power2.inOut'
      }, 0)
      if (dur > 0) {
        tl.to(el, { z: 70, duration: dur / 2, ease: 'power1.out' }, 0)
          .to(el, { z: 0, duration: dur / 2, ease: 'power1.in' }, dur / 2)
      }
      if (dur > 0) {
        gsap.fromTo(
          shade,
          { opacity: dir === 1 ? 0 : 0.35 },
          { opacity: dir === 1 ? 0.35 : 0, duration: dur / 2, yoyo: true, repeat: 1, ease: 'sine.inOut' }
        )
      }
    }

    const next = () => flip(1)
    const prev = () => flip(-1)

    // Clicking anywhere on the live page turns it — except on real links.
    const onPageClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button')) return
      next()
    }

    return { locale, root, book, pageEls, shadeEls, page, flipping, current, tr, formatDate, next, prev, onPageClick }
  }
})
</script>

<style scoped lang="scss">
@import '../css/utils/variables';

.folio {
  outline: none;
  // breathing room so the tilt + desk shadow don't clip
  padding: 14px 0 34px;

  &:focus-visible .folio-book {
    box-shadow: 0 0 0 3px rgba($brand-orange, 0.35);
  }
}

// Perspective stage. The perspective must live on an ancestor with NO filter
// (a filter flattens 3D descendants), so shadows are separate elements.
.folio-scene {
  position: relative;
  perspective: 1500px;
  perspective-origin: 50% 30%;
}

// Soft desk shadow under the tilted book — a gradient, not a filter,
// to keep the 3D rendering context intact.
.folio-desk {
  position: absolute;
  left: 4%;
  right: 4%;
  bottom: -30px;
  height: 54px;
  background: radial-gradient(50% 100% at 50% 0, rgba(21, 41, 57, 0.3), transparent 72%);
  pointer-events: none;
}

// The open spread, lying on the desk: left half read pile, right half live page.
.folio-book {
  position: relative;
  transform: rotateX(8deg);
  transform-style: preserve-3d;
  // 1.05 -> 1.28: the leaf height, not the line-clamp, was what truncated
  // stories. A deeper book buys ~160px of copy per page at 1100px wide.
  aspect-ratio: 2 / 1.28;
  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: 768px) {
    aspect-ratio: 4 / 5;
    transform: rotateX(4deg);
  }
}

// Unread page-stack: stacked paper edges peeking out right + bottom.
.folio-stack {
  position: absolute;
  inset: 3px -7px -7px calc(50% + 6px);
  background:
    repeating-linear-gradient(to right, rgba($grey-blue3, 0.35) 0 1px, $warm-bg-light 1px 3px);
  border: 1px solid rgba($grey-blue3, 0.3);

  @media (max-width: 768px) {
    left: 6px;
  }
}

.folio-leftbase {
  position: absolute;
  inset: 0 50% 0 0;
  background:
    linear-gradient(to right, rgba(21, 41, 57, 0.05), rgba(21, 41, 57, 0) 12%),
    $warm-bg-light;
  border: 1px solid rgba($grey-blue3, 0.28);
  border-right: none;
  // spine gutter: the left page darkens toward the fold
  box-shadow: inset -16px 0 26px -18px rgba(21, 41, 57, 0.4);
  // column so the plate can fill the leaf with its caption beneath;
  // padding mirrors .folio-face so both leaves share one margin.
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(18px, 3vw, 34px);

  .folio-watermark {
    font-family: 'Noto Serif TC', serif;
    font-weight: 900;
    font-size: clamp(3rem, 8vw, 6rem);
    color: rgba($grey-blue3, 0.06);
    user-select: none;
  }

  @media (max-width: 768px) {
    display: none;
  }
}

.folio-page {
  position: absolute;
  inset: 0 0 0 50%;
  transform-style: preserve-3d;

  @media (max-width: 768px) {
    inset: 0;
  }
}

.folio-face,
.folio-verso {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border: 1px solid rgba($grey-blue3, 0.32);
  background:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E"),
    $warm-bg-light;
}

.folio-face {
  display: flex;
  flex-direction: column;
  padding: clamp(18px, 3vw, 34px);
  cursor: pointer;
  // spine shading: the page darkens slightly toward the fold
  box-shadow: inset 14px 0 24px -18px rgba(21, 41, 57, 0.35);
}

.folio-verso {
  transform: rotateY(180deg);
  display: flex;
  align-items: flex-end;
  padding: 22px;

  .folio-verso-ghost {
    font-family: 'Noto Serif TC', serif;
    font-size: 0.8rem;
    color: rgba($grey-blue3, 0.28);
  }
}

.folio-mast {
  display: flex;
  align-items: baseline;
  gap: 14px;
  border-bottom: 3px double rgba($grey-blue3, 0.55);
  padding-bottom: 10px;
  margin-bottom: clamp(10px, 2vw, 20px);

  .folio-brand {
    font-family: 'Noto Serif TC', serif;
    font-weight: 900;
    font-size: clamp(0.95rem, 1.6vw, 1.2rem);
    color: $grey-blue3;
  }

  .folio-issue {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    color: $brand-orange;
  }

  .folio-date {
    margin-left: auto;
    font-size: 0.78rem;
    color: $dark-grey;
    white-space: nowrap;
  }
}

.folio-headline {
  font-family: 'Noto Serif TC', serif;
  font-weight: 900;
  font-size: clamp(1.5rem, 3.1vw, 2.45rem);
  line-height: 1.32;
  letter-spacing: 0.01em;
  color: $grey-blue3;
  margin-bottom: clamp(10px, 2vw, 18px);
}

.folio-body {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: clamp(14px, 2vw, 24px);

  &.has-image .folio-summary {
    flex: 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

// Desktop puts the plate on the left leaf, so the inline copy is mobile-only.
.folio-figure {
  display: none;

  @media (max-width: 768px) {
    display: block;
    flex: 0 0 38%;
    margin: 0;
    border: 1px solid rgba($grey-blue3, 0.3);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
}

// ─── left leaf: the plate ───
// The plate hugs the photo instead of filling the leaf: news art is landscape
// (1200x655) and the leaf is portrait, so `flex: 1` + cover was cropping most
// of every image away.
.folio-plate {
  position: relative;
  flex: 0 1 auto;
  min-height: 0;
  margin: 0;
  overflow: hidden;
  border: 1px solid rgba($grey-blue3, 0.42);
  box-shadow: 0 16px 34px -24px rgba(21, 41, 57, 0.6);

  img {
    width: 100%;
    height: auto;
    max-height: 100%;
    object-fit: contain;
    display: block;
    filter: saturate(0.94) contrast(1.05);
  }
}

.folio-plate--bare {
  display: grid;
  place-items: center;
  border-style: dashed;
  border-color: rgba($grey-blue3, 0.28);
}

.folio-plate-cap {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
  font-size: 0.92rem;
  font-weight: 700;
  color: rgba($grey-blue3, 0.75);
}

.folio-plate-brand {
  color: $brand-orange;
  letter-spacing: 0.16em;
}

.folio-plate-note {
  margin-right: auto;
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: rgba($grey-blue3, 0.45);
}

// letterpress: navy ink at reading size. #4c4c4c on cream is what read as faint.
// The whole right leaf is text now, so the clamp goes from 7 lines to 14.
.folio-summary {
  font-size: clamp(1.02rem, 1.32vw, 1.2rem);
  font-weight: 500;
  line-height: 1.92;
  color: $grey-blue2;
  display: -webkit-box;
  -webkit-line-clamp: 14;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    -webkit-line-clamp: 8;
  }

  :deep(a) {
    color: $brand-orange;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover {
      color: $orange2;
    }
  }
}

.folio-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba($grey-blue3, 0.25);
  padding-top: 10px;
  margin-top: clamp(10px, 2vw, 16px);

  .folio-pageno {
    font-family: 'Noto Serif TC', serif;
    font-size: 0.82rem;
    color: $dark-grey;
    letter-spacing: 0.12em;
  }

  // dog-eared corner inviting the turn
  .folio-corner {
    width: 26px;
    height: 26px;
    background: linear-gradient(135deg, transparent 50%, rgba($brand-orange, 0.55) 50%);
    animation: folioPeek 2.6s ease-in-out infinite;
  }
}

.folio-shade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  background: linear-gradient(100deg, rgba(21, 41, 57, 0.42), rgba(21, 41, 57, 0) 55%);
}

.folio-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  margin-top: 26px;

  .folio-btn {
    font-family: 'Noto Serif TC', serif;
    font-weight: 700;
    font-size: 0.98rem;
    color: $grey-blue3;
    background: none;
    border: none;
    border-bottom: 2px solid $brand-orange;
    padding: 2px 4px 4px;
    cursor: pointer;
    transition: color 0.25s ease, opacity 0.25s ease;

    &:hover:not(:disabled) {
      color: $brand-orange;
    }

    &:disabled {
      opacity: 0.3;
      cursor: default;
    }
  }

  .folio-count {
    font-size: 0.85rem;
    color: $dark-grey;
    letter-spacing: 0.15em;
    min-width: 56px;
    text-align: center;
  }
}

@keyframes folioPeek {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-3px, -3px); }
}

@media (prefers-reduced-motion: reduce) {
  .folio-corner {
    animation: none;
  }
}
</style>
