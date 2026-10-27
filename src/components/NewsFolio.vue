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
    <!-- perspective stage for the page turn -->
    <div class="folio-scene">
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
          <span class="folio-plate-brand">{{ $t('brandJournal') }}</span>
          <!-- Every news plate is our own illustration, not a photo of the
               event or of a partner's product. Say so rather than imply it. -->
          <span v-if="current.image" class="folio-plate-note">
            {{ locale.startsWith('zh') ? '示意圖' : 'Illustration' }}
          </span>
          <time>{{ formatDate(current.date) }}</time>
        </figcaption>
      </div>

      <article
        v-for="(item, i) in items"
        :key="item.id"
        ref="pageEls"
        class="folio-page"
        :aria-hidden="i !== page"
        :inert="i !== page ? true : undefined"
      >
        <div class="folio-face" @click="onPageClick">
          <header class="folio-mast">
            <span class="folio-brand">{{ $t('brandJournal') }}</span>
            <time class="folio-date">{{ formatDate(item.date) }}</time>
          </header>

          <h3 class="folio-headline">{{ tr(item.title) }}</h3>

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
      <button
        class="folio-btn"
        :disabled="page === 0 || flipping"
        :aria-label="locale.startsWith('zh') ? '上一頁' : 'Prev'"
        @click="prev"
      >
        <span aria-hidden="true">←</span>
      </button>
      <span class="folio-count">{{ page + 1 }} / {{ items.length }}</span>
      <button
        class="folio-btn"
        :disabled="page === items.length - 1 || flipping"
        :aria-label="locale.startsWith('zh') ? '下一頁' : 'Next'"
        @click="next"
      >
        <span aria-hidden="true">→</span>
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
  padding: 14px 0 34px;

  // a ring, never a shadow
  &:focus-visible .folio-book {
    outline: 2px solid $brand-orange-text;
    outline-offset: 4px;
    border-radius: 18px;
  }
}

// Perspective stage. The perspective must live on an ancestor with NO filter
// (a filter flattens 3D descendants), so nothing here carries one.
.folio-scene {
  position: relative;
  perspective: 1500px;
  perspective-origin: 50% 30%;
}

// The open spread: left half is the plate, right half the live page.
.folio-book {
  position: relative;
  transform-style: preserve-3d;
  // the leaf height, not the line-clamp, was what truncated stories
  aspect-ratio: 2 / 1.28;
  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: 768px) {
    aspect-ratio: 4 / 5;
  }
}

.folio-leftbase {
  position: absolute;
  inset: 0 50% 0 0;
  background: $parchment;
  border: 1px solid $hairline;
  border-right: none;
  border-radius: 18px 0 0 18px;
  // column so the plate can fill the leaf with its caption beneath;
  // padding mirrors .folio-face so both leaves share one margin.
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(18px, 3vw, 34px);

  .folio-watermark {
    font-family: $display-font;
    font-weight: 600;
    font-size: clamp(3rem, 8vw, 6rem);
    letter-spacing: -0.02em;
    color: rgba($ink, 0.06);
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
  border: 1px solid $hairline;
  background: $parchment;
}

.folio-face {
  display: flex;
  flex-direction: column;
  padding: clamp(18px, 3vw, 34px);
  cursor: pointer;
  border-radius: 0 18px 18px 0;

  @media (max-width: 768px) {
    border-radius: 18px;
  }
}

.folio-verso {
  transform: rotateY(180deg);
  display: flex;
  align-items: flex-end;
  padding: 22px;
  border-radius: 18px 0 0 18px;

  .folio-verso-ghost {
    font-size: 14px;
    color: $ink-80;
    opacity: 0.4;
  }
}

.folio-mast {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: clamp(10px, 2vw, 20px);

  .folio-brand {
    font-family: $display-font;
    font-weight: 600;
    font-size: 14px;
    color: $ink;
  }


  .folio-date {
    margin-left: auto;
    font-size: 14px;
    color: $ink-80;
    white-space: nowrap;
  }
}

.folio-headline {
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden;
  font-family: $display-font;
  font-weight: 600;
  font-size: clamp(1.5rem, 3.1vw, 2.45rem);
  line-height: 1.25;
  letter-spacing: -0.02em;
  color: $ink;
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
    // auto, not a fixed 38% of the body: the art is landscape
    flex: 0 0 auto;
    margin: 0;
    border: 1px solid $hairline;
    border-radius: 12px;
    overflow: hidden;

    img {
      width: 100%;
      height: auto;
      max-height: 34vh;
      object-fit: contain;
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
  border: 1px solid $hairline;
  border-radius: 12px;

  img {
    width: 100%;
    height: auto;
    max-height: 100%;
    object-fit: contain;
    display: block;
  }
}

.folio-plate--bare {
  display: grid;
  place-items: center;
  border-style: dashed;
}

.folio-plate-cap {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
  font-size: 14px;
  font-weight: 600;
  color: $ink-80;
}

.folio-plate-brand {
  color: $ink-80;
}

.folio-plate-note {
  margin-right: auto;
  font-size: 14px;
  font-weight: 400;
  color: $ink-80;
}

// Reading size: 17px ink on parchment. The whole right leaf is text,
// so the clamp goes from 7 lines to 14.
.folio-summary {
  font-size: 17px;
  font-weight: 400;
  line-height: 1.7;
  color: $ink;
  display: -webkit-box;
  -webkit-line-clamp: 14;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    -webkit-line-clamp: 8;
  }

  :deep(a) {
    color: $brand-orange-text;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover {
      color: $ink;
    }
  }
}

.folio-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  margin-top: clamp(10px, 2vw, 16px);

  .folio-pageno {
    font-size: 14px;
    color: $ink-80;
  }

  // small orange corner inviting the turn
  .folio-corner {
    width: 20px;
    height: 20px;
    background: $brand-orange-text;
    clip-path: polygon(100% 0, 100% 100%, 0 100%);
    animation: folioPeek 2.6s ease-in-out infinite;
  }
}

// paper shade during the turn: a flat veil, no gradient
.folio-shade {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  background: rgba($ink, 0.4);
}

.folio-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  margin-top: 26px;

  .folio-btn {
    width: 44px;
    height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    line-height: 1;
    color: $ink;
    background: $parchment;
    border: 1px solid $hairline;
    border-radius: 50%;
    padding: 0;
    cursor: pointer;
    transition: color 0.25s ease, opacity 0.25s ease, transform 0.15s ease;

    &:hover:not(:disabled) {
      color: $brand-orange-text;
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
    }

    &:focus-visible {
      outline: 2px solid $brand-orange-text;
      outline-offset: 2px;
    }

    &:disabled {
      opacity: 0.3;
      cursor: default;
    }
  }

  .folio-count {
    font-size: 14px;
    color: $ink-80;
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
