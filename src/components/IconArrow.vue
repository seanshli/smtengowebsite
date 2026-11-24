<template>
  <svg class="icon-arrow" viewBox="0 0 16 16" width="1em" height="1em" fill="none" stroke="currentColor"
    stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path v-if="external" d="M5 11 11 5M6 5h5v5" />
    <path v-else d="M3 8h10M9 4l4 4-4 4" />
  </svg>
</template>

<script setup lang="ts">
// One drawn arrow for the building world, in place of text glyphs (→ ↗).
defineProps<{ external?: boolean }>()
</script>

<style scoped>
.icon-arrow { flex: none; display: inline-block; vertical-align: -0.125em; }
</style>
