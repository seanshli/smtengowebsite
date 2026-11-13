import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/** Optional copy for the three further locales; a missing entry falls back to English. */
export interface ExtraLocaleText {
  ja?: string
  fr?: string
  es?: string
}

/** Locales that carry their own inline copy besides zh / zhCN / en. */
export const EXTRA_LOCALES = ['ja', 'fr', 'es'] as const

/**
 * Inline copy for every locale: Traditional Chinese (`zh`), Simplified Chinese (`zhCN`), English, and
 * Japanese / French / Mexican Spanish (`ja` / `fr` / `es`) in the optional fourth argument.
 *
 *   tx('繁體', '简体', 'English', { ja: '日本語', fr: 'Français', es: 'Español' })
 *
 * Use it for short template strings that do not warrant a key in all six locale files. Keep the Simplified
 * string in step with the Traditional one (`npm run i18n:zhcn` converts data files; for inline strings convert
 * with the same OpenCC `twp` profile, see scripts/fill-zhcn.mjs). A ja / fr / es string that is left out falls
 * back to English; `src/composables/useLocaleText.test.ts` fails if a `tx(` call in src/ omits one of them.
 */
export function pickText(
  locale: string,
  zh: string,
  zhCN: string,
  en: string,
  more?: ExtraLocaleText
): string {
  if (locale === 'zhCN') return zhCN
  if (locale.startsWith('zh')) return zh
  if (locale === 'ja' || locale === 'fr' || locale === 'es') return more?.[locale] || en
  return en
}

/**
 * Pick from a `{ zh, zhCN, en, ja, fr, es }` object (or `{ zhBody, zhCNBody, enBody, jaBody, ... }` with a
 * suffix). ja / fr / es prefer their own field, then fall back to English, then Traditional Chinese.
 */
export function pickField(locale: string, o: any, suffix = ''): any {
  if (!o) return ''
  if (locale === 'zhCN') return o['zhCN' + suffix] ?? o['zh' + suffix] ?? o['en' + suffix] ?? ''
  if (locale.startsWith('zh')) return o['zh' + suffix] ?? o['en' + suffix] ?? ''
  if (locale === 'ja' || locale === 'fr' || locale === 'es') {
    return o[locale + suffix] ?? o['en' + suffix] ?? o['zh' + suffix] ?? ''
  }
  return o['en' + suffix] ?? o['zh' + suffix] ?? ''
}

export function useLocaleText() {
  const { locale } = useI18n()
  const isZh = computed(() => locale.value.startsWith('zh'))
  const isCN = computed(() => locale.value === 'zhCN')
  const tx = (zh: string, zhCN: string, en: string, more?: ExtraLocaleText): string =>
    pickText(locale.value, zh, zhCN, en, more)
  const lt = (o: any, suffix = ''): any => pickField(locale.value, o, suffix)
  return { locale, isZh, isCN, tx, lt }
}
