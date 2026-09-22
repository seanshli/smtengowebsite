// 型別宣告，比照 prerender-meta.d.mts —— vite.config.ts 會 import 這支 .mjs，
// 沒有宣告檔的話 vue-tsc 會報 TS7016（implicitly any）。
export function generateKnowledgeMd(): string
