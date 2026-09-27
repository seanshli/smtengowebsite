// 安購商城 / 智管家商城 (enGo Store). Sean 2026-09-27: every store link lands on
// the FRONT page of the new storefront (no deep links into single products).
// Verified live the same day: https://shoph5.smtengo.com/ (Next.js on Vercel,
// title「Shop · 智管家商城」). The previous H5 mall was https://h5.smtengo.com/.
export const SHOP_URL = 'https://shoph5.smtengo.com/'

export function openShop(): void {
  window.open(SHOP_URL, '_blank', 'noopener')
}
