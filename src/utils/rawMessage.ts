/**
 * Walk a vue-i18n message tree for a dotted key and return the raw string, unparsed.
 *
 * vue-i18n compiles " | " as a plural separator, so t('seo.home.title') for
 * '首頁 | enGo智管家 - 智慧家居第一品牌' returns only '首頁'. Page titles use the pipe
 * on purpose (they mirror the prerendered shells), so seo.ts reads them raw.
 */
export function rawMessageIn(messages: unknown, key: string): string | undefined {
  let node: any = messages
  for (const part of key.split('.')) {
    if (node == null || typeof node !== 'object') return undefined
    node = node[part]
  }
  return typeof node === 'string' ? node : undefined
}
