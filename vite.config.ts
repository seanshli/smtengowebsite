import { fileURLToPath, URL } from 'node:url'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// Per-route <head> meta so non-JS crawlers / social scrapers (FB, LINE, X) get the
// correct title + Open Graph per page. Inlined here so it runs on any `vite build`.
// Keep strings in sync with seo.* in src/locale/zh.ts (Traditional Chinese = default).
const BASE = 'https://www.smtengo.com'
const ROUTES: Record<string, [string, string]> = {
  '/core':      ['核心價值 | enGo智管家的設計理念', 'enGo 以 AI 整合陽光、空氣、水與食物，從健康、安心到便利，打造智慧生活的核心價值。'],
  '/brand':     ['品牌故事 | enGo「安購」的起源', '了解 enGo「安購」的創立初衷與品牌故事，我們如何用科技讓每個家庭享有高品質的智慧生活。'],
  '/mission':   ['我們的使命 | enGo智管家', 'enGo 的使命：運用 AIoT 技術，讓智慧居家成為人人都能負擔的生活必需品。'],
  '/vision':    ['未來願景 | enGo智管家', 'enGo 的願景——整合雲端倉儲、聯網設備與生活採購，打造定義未來的一站式智慧生活平台。'],
  '/ecosystem': ['智慧生態系 | enGo AIoT 整合平台', '探索 enGo 智慧生態系，從 AI 中控、智慧淨水到空氣清淨，串連家中每一個智慧裝置。'],
  '/product':   ['產品介紹 | enGo AI智慧中控系統 & 淨水系統', '探索 enGo AI智慧中控平板與水維氧智慧淨水系統，提升家居舒適度與安全性。'],
  '/packages':  ['套裝方案 | enGo智管家 - 智慧家居第一品牌', '挑選最適合您的智慧家庭套裝方案，提升家居舒適度與安全性。'],
  '/tutorial':  ['使用教學 | 開啟您的智慧生活', '詳細的 enGo 產品使用教學與影音指南，幫助您輕鬆上手智慧家庭系統。'],
  '/cases':     ['案例分享 | 智慧家居實作紀錄', '查看我們在住宅、辦公室及各式建築中的智慧家居實作案例，見證生活品質的提升。'],
  '/contact':   ['聯絡我們 | 諮詢 enGo 智慧家居解決方案', '對我們的產品有興趣？立即填寫表單或透過 LINE 聯繫我們，專人將竭誠為您服務。']
}
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function prerenderMeta() {
  return {
    name: 'engo-prerender-meta',
    apply: 'build' as const,
    closeBundle() {
      const dist = fileURLToPath(new URL('./dist', import.meta.url))
      const indexPath = join(dist, 'index.html')
      if (!existsSync(indexPath)) { console.warn('[prerender] dist/index.html missing, skip'); return }
      const tpl = readFileSync(indexPath, 'utf-8')
      let n = 0
      for (const [route, [title, desc]] of Object.entries(ROUTES)) {
        const url = BASE + route
        let html = tpl
        html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
        html = html.replace(/<meta name="description"[\s\S]*?\/>/, `<meta name="description" content="${esc(desc)}" />`)
        html = html.replace(/<meta property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${esc(title)}" />`)
        html = html.replace(/<meta property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${esc(desc)}" />`)
        html = html.replace(/<meta property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${esc(url)}" />`)
        html = html.replace(/<meta name="twitter:title"[\s\S]*?\/>/, `<meta name="twitter:title" content="${esc(title)}" />\n  <meta name="twitter:description" content="${esc(desc)}" />`)
        html = html.replace(/<\/head>/, `  <link rel="canonical" href="${esc(url)}" />\n</head>`)
        const outDir = join(dist, route)
        mkdirSync(outDir, { recursive: true })
        writeFileSync(join(outDir, 'index.html'), html, 'utf-8')
        console.log(`[prerender] ${route}/index.html -> ${title}`)
        n++
      }
      console.log(`[prerender] ${n} route shells written`)
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), prerenderMeta()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  css: { modules: { localsConvention: 'camelCase' } }
})
