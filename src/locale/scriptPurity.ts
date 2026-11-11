// Shared by src/locale/localeParity.test.ts and the /zh-cn shell tests (scripts/prerender-meta.test.ts).
// Characters that exist only in Traditional Chinese (their Simplified forms differ). Tuned against the real
// copy; add a character only if it has no Simplified-identical use. Proper nouns that legitimately keep a
// Traditional form go in ALLOW below with the reason.
export const TRADITIONAL = '們個這來說為與發體區設產線圖點術選擇實際應開關後時間電燈話對於從會讓還進過動務員專業學樣種類藝網據機計運連達護環邊鍵顯換數錄級縣灣臺訊裝備當聯統寫認識場層塊處條續輯複簡經驗廠帳號戶門顧買賣價費購貨訂單質檢測課題風險權責貼儲'
export const ALLOW: string[] = [
    // 「繁體中文」 names the Traditional-Chinese legal documents on purpose.
    '繁體中文'
]
export const stripAllowed = (s: string) => ALLOW.reduce((a, w) => a.split(w).join(''), s)
export const traditionalIn = (s: string) => [...new Set([...stripAllowed(s)].filter((c) => TRADITIONAL.includes(c)))]

