export const config = {
  hostname: '/engo'
}

// ponytail: temporary kill-switch for the EAP-01 四合一智氛AI多功能空氣清淨機.
// Flip back to true to restore the product section, header/footer nav links,
// and the Product JSON-LD schema in one move. Consumed by:
//   src/views/product.vue, src/layout/header.vue, src/layout/footer.vue,
//   src/utils/productSchema.ts
export const SHOW_AIR_PURIFIER = false
