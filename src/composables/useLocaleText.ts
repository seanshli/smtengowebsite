import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * Inline copy for the three fully written locales: Traditional Chinese (`zh`), Simplified Chinese (`zhCN`)
 * and English. Every other locale (ja / fr / es) reads the English string until its own copy exists.
 *
 *   tx('繁體', '简体', 'English')
 *
 * Use it for short template strings that do not warrant a key in all six locale files. Keep the Simplified
 * string in step with the Traditional one (`npm run i18n:zhcn` converts data files; for inline strings convert
 * with the same OpenCC `twp` profile, see scripts/fill-zhcn.mjs).
 */
export function useLocaleText() {
  const { locale } = useI18n()
  const isZh = computed(() => locale.value.startsWith('zh'))
  const isCN = computed(() => locale.value === 'zhCN')
  const tx = (zh: string, zhCN: string, en: string): string =>
    isCN.value ? zhCN : isZh.value ? zh : en
  /** Pick from a `{ zh, zhCN, en }` object (or `{ zhBody, zhCNBody, enBody }` with a suffix). */
  const lt = (o: any, suffix = ''): any => {
    if (!o) return ''
    const key = isCN.value ? 'zhCN' : isZh.value ? 'zh' : 'en'
    return o[key + suffix] ?? o['zh' + suffix] ?? o['en' + suffix] ?? ''
  }
  return { locale, isZh, isCN, tx, lt }
}
