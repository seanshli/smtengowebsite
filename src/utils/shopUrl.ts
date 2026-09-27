import { ref } from 'vue'

// 安購商城 (enGo Store) links. Sean 2026-09-27: the store is moving to a new
// platform at www.smtengoh5.com and every store link should land on its FRONT
// page (no more deep links into single products).
//
// On 2026-09-27 that domain had no DNS at all (NXDOMAIN on 8.8.8.8 and 1.1.1.1),
// while the current shop was serving. Pointing purchase buttons at a dead host
// would kill every sale, so the links start on the current shop and switch to
// the new one automatically the moment it answers: a no-cors probe resolves
// (opaque response) once the host exists, and rejects while it does not.
// Click handlers read `shopUrl.value` synchronously, so window.open stays
// inside the user gesture and popup blockers leave it alone.
export const SHOP_NEXT_URL = 'https://www.smtengoh5.com/'
export const SHOP_CURRENT_URL = 'https://h5.smtengo.com/'

export const shopUrl = ref(SHOP_CURRENT_URL)

let probed = false
export function probeNewShop(): void {
  if (probed || typeof window === 'undefined' || typeof fetch !== 'function') return
  probed = true
  fetch(SHOP_NEXT_URL, { mode: 'no-cors', cache: 'no-store', credentials: 'omit' })
    .then(() => { shopUrl.value = SHOP_NEXT_URL })
    .catch(() => { /* not live yet: keep the current shop */ })
}

export function openShop(): void {
  window.open(shopUrl.value, '_blank', 'noopener')
}

probeNewShop()
