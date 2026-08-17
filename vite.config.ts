import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// Per-route <head> meta lives in scripts/prerender-meta.mjs — the same module
// npm postbuild runs. Delegating here rather than keeping a second copy of the
// route table: the two drifted before, and the build-time copy silently won.
function prerenderMeta() {
  return {
    name: 'engo-prerender-meta',
    apply: 'build' as const,
    async closeBundle() {
      const { generatePrerenderShells } = await import('./scripts/prerender-meta.mjs')
      generatePrerenderShells(fileURLToPath(new URL('./dist', import.meta.url)))
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), prerenderMeta()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  css: { modules: { localsConvention: 'camelCase' } },
  // host: true binds IPv4 + IPv6 + LAN. Without it Vite sometimes binds
  // [::1] only, and browsers resolving localhost to 127.0.0.1 get
  // connection refused — "the dev site is down" while curl says 200.
  server: { host: true }
})
