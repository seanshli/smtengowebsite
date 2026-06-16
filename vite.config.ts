import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { generatePrerenderShells } from './scripts/prerender-meta.mjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      // Generate per-route static HTML shells with correct title/OG meta
      // after the bundle is written. Runs on any `vite build`.
      name: 'engo-prerender-meta',
      apply: 'build',
      closeBundle() {
        generatePrerenderShells(fileURLToPath(new URL('./dist', import.meta.url)))
      }
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  }
})
