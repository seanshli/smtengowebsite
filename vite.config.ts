import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// Per-route <head> meta lives in scripts/prerender-meta.mjs — the same module
// npm postbuild runs. Delegating here rather than keeping a second copy of the
// route table: the two drifted before, and the build-time copy silently won.
// /knowledge-base.md 是給機器抓的單檔知識庫，由 src/data/*.json 產生。
// 做成 plugin 而不是 npm prebuild 的理由見 scripts/gen-knowledge-md.mjs 的註解：
// Vercel 不跑 npm run build，掛在 npm 生命週期上等於在 production 不存在。
// buildStart 早於 vite 複製 publicDir，所以產物一定進得了 dist。
function knowledgeBase() {
  return {
    name: 'engo-knowledge-base',
    async buildStart() {
      const { generateKnowledgeMd } = await import('./scripts/gen-knowledge-md.mjs')
      generateKnowledgeMd()
    }
  }
}

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
  plugins: [vue(), knowledgeBase(), prerenderMeta()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  css: { modules: { localsConvention: 'camelCase' } },
  // host: true binds IPv4 + IPv6 + LAN. Without it Vite sometimes binds
  // [::1] only, and browsers resolving localhost to 127.0.0.1 get
  // connection refused — "the dev site is down" while curl says 200.
  server: { host: true }
})
