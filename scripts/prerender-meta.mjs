// Post-build prerender of per-route <head> meta so non-JS crawlers and social
// scrapers (Facebook / LINE / X) get correct title + Open Graph per page.
// Writes dist/<route>/index.html clones of the SPA shell with route-specific meta.
// Vercel serves these static files before the catch-all rewrite in vercel.json.
//
// NOTE: keep these strings in sync with the seo.* keys in src/locale/zh.ts
// (zh = Traditional Chinese is the primary/default locale for www.smtengo.com).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const BASE = 'https://www.smtengo.com'

const ROUTES = {
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

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const template = readFileSync(join(DIST, 'index.html'), 'utf-8')

function buildHtml(route, title, desc) {
  const url = BASE + route
  let html = template
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
  html = html.replace(/<meta name="description"[\s\S]*?\/>/, `<meta name="description" content="${esc(desc)}" />`)
  html = html.replace(/<meta property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${esc(title)}" />`)
  html = html.replace(/<meta property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${esc(desc)}" />`)
  html = html.replace(/<meta property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${esc(url)}" />`)
  html = html.replace(/<meta name="twitter:title"[\s\S]*?\/>/, `<meta name="twitter:title" content="${esc(title)}" />\n  <meta name="twitter:description" content="${esc(desc)}" />`)
  // add canonical (not present in source shell)
  html = html.replace(/<\/head>/, `  <link rel="canonical" href="${esc(url)}" />\n</head>`)
  return html
}

let n = 0
for (const [route, [title, desc]] of Object.entries(ROUTES)) {
  const outDir = join(DIST, route)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), buildHtml(route, title, desc), 'utf-8')
  console.log(`prerendered ${route}/index.html  ->  ${title}`)
  n++
}
console.log(`\nDone: ${n} route shells written to dist/`)
