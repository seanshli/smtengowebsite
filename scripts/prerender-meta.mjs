// Per-route prerender of <head> meta so non-JS crawlers and social scrapers
// (Facebook / LINE / X) get correct title + Open Graph per page.
// Writes dist/<route>/index.html clones of the SPA shell with route-specific
// meta. Vercel serves these static files before the catch-all rewrite.
//
// Invoked two ways (belt + suspenders): as a Vite closeBundle plugin (see
// vite.config.ts, which delegates here so the route table cannot drift) and as
// an npm postbuild CLI.
//
// TWO INDEXED LOCALES. Traditional Chinese is the default and stays unprefixed
// so every existing URL and backlink keeps working; English mirrors under /en.
// Each shell declares both as hreflang alternates, which is what makes the
// annotation valid — a hreflang set whose entries all resolve to one URL is
// discarded by Google, which is what this site used to ship.
//
// NOTE: keep the zh strings in sync with seo.* in src/locale/zh.ts, and the en
// strings with src/locale/en.ts.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = 'https://www.smtengo.com'
const EN_PREFIX = '/en'

// route -> { zh: [title, desc], en: [title, desc] }
const ROUTES = {
  '/': {
    zh: ['enGo智管家 - 智慧家居第一品牌', 'enGo理家，蝦咪攏嗯驚！智管家用 AI 技術整合雲端倉儲、聯網設備管理與生活採購，打造一站式整合智慧平台。'],
    en: ['enGo Smart Home — AI for Sunlight, Air, Water & Food', 'enGo integrates sunlight, air, water and food with AI, connecting your whole home through one intelligent hub.']
  },
  '/core': {
    zh: ['核心價值 | enGo智管家的設計理念', 'enGo 以 AI 整合陽光、空氣、水與食物，從健康、安心到便利，打造智慧生活的核心價值。'],
    en: ['Core Values | The enGo Design Philosophy', 'enGo brings sunlight, air, water and food together with AI — health, safety and ease as the core of smart living.']
  },
  '/brand': {
    zh: ['品牌故事 | enGo「安購」的起源', '了解 enGo「安購」的創立初衷與品牌故事，我們如何用科技讓每個家庭享有高品質的智慧生活。'],
    en: ['Brand Story | The Origin of enGo', 'How enGo began, and why we build technology that gives every household a genuinely better everyday life.']
  },
  '/mission': {
    zh: ['我們的使命 | enGo智管家', 'enGo 的使命：運用 AIoT 技術，讓智慧居家成為人人都能負擔的生活必需品。'],
    en: ['Our Mission | enGo Smart Home', 'Using AIoT to make the smart home an affordable necessity rather than a luxury.']
  },
  '/team': {
    zh: ['經營團隊 | enGo智管家', '認識 enGo 智管家的創始團隊與董事顧問：跨越 AI、營運、設計與技術戰略的四位掌舵者。'],
    en: ['Leadership Team | enGo Smart Home', 'Meet the founders and board advisor behind enGo, spanning AI, operations, design and technology strategy.']
  },
  '/enviro': {
    zh: ['智慧環控 | enGo智管家', '整合陽光、空氣、水與智慧廚房的全方位環控方案——動態控溫、空氣淨化監測、智慧水務與廚房安全。'],
    en: ['Environmental Control | enGo Smart Home', 'One system for sunlight and temperature, air quality, water management and kitchen safety.']
  },
  '/vision': {
    zh: ['未來願景 | enGo智管家', 'enGo 的願景——整合雲端倉儲、聯網設備與生活採購，打造定義未來的一站式智慧生活平台。'],
    en: ['Our Vision | enGo Smart Home', 'Cloud storage, connected devices and everyday purchasing on a single platform for the smart home.']
  },
  '/ecosystem': {
    zh: ['智慧生態系 | enGo AIoT 整合平台', '探索 enGo 智慧生態系，從 AI 中控、智慧淨水到空氣清淨，串連家中每一個智慧裝置。'],
    en: ['Smart Ecosystem | The enGo AIoT Platform', 'From the AI hub to water purification and air quality — every device in your home, connected.']
  },
  '/product': {
    zh: ['產品介紹 | enGo AI智慧中控系統 & 淨水系統', '探索 enGo AI智慧中控平板與水維氧智慧淨水系統，提升家居舒適度與安全性。'],
    en: ['Products | enGo AI Control Hub & Water System', 'The enGo AI control tablet and the Shui Wei Yang smart water system, for a safer and more comfortable home.']
  },
  '/packages': {
    zh: ['套裝方案 | enGo智管家 - 智慧家居第一品牌', '挑選最適合您的智慧家庭套裝方案，提升家居舒適度與安全性。'],
    en: ['Packages | enGo Smart Home', 'Choose the smart home package that fits your space, your budget and how you actually live.']
  },
  '/tutorial': {
    zh: ['使用教學 | 開啟您的智慧生活', '詳細的 enGo 產品使用教學與影音指南，幫助您輕鬆上手智慧家庭系統。'],
    en: ['Tutorials | Getting Started with enGo', 'Step-by-step guides and videos for setting up and living with your enGo system.']
  },
  '/cases': {
    zh: ['案例分享 | 智慧家居實作紀錄', '查看我們在住宅、辦公室及各式建築中的智慧家居實作案例，見證生活品質的提升。'],
    en: ['Case Studies | enGo Installations', 'Real homes, offices and developments running enGo — what was installed and what changed.']
  },
  '/contact': {
    zh: ['聯絡我們 | 諮詢 enGo 智慧家居解決方案', '對我們的產品有興趣？立即填寫表單或透過 LINE 聯繫我們，專人將竭誠為您服務。'],
    en: ['Contact Us | Talk to enGo', 'Interested in enGo? Send us a message or reach us on LINE and a specialist will get back to you.']
  }
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Real alternates: two distinct URLs, which is what makes hreflang valid. */
function hreflangBlock(route) {
  const zhUrl = BASE + route
  const enUrl = BASE + EN_PREFIX + (route === '/' ? '' : route)
  return [
    `  <link rel="alternate" hreflang="zh-Hant" href="${esc(zhUrl)}" />`,
    `  <link rel="alternate" hreflang="en" href="${esc(enUrl)}" />`,
    `  <link rel="alternate" hreflang="x-default" href="${esc(zhUrl)}" />`
  ].join('\n')
}

function buildHtml(template, route, lang) {
  const [title, desc] = ROUTES[route][lang]
  const url = BASE + (lang === 'en' ? EN_PREFIX + (route === '/' ? '' : route) : route)

  // Idempotency: the "/" zh shell is written over dist/index.html, which the
  // postbuild pass then reads back as its template. Without stripping first,
  // every shell inherits the home page's alternates on top of its own.
  let html = template.replace(/[ \t]*<link rel="alternate" hreflang="[^"]*"[^>]*>\n?/g, '')
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
  html = html.replace(/<meta name="description"[\s\S]*?\/>/, `<meta name="description" content="${esc(desc)}" />`)
  html = html.replace(/<meta property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${esc(title)}" />`)
  html = html.replace(/<meta property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${esc(desc)}" />`)
  html = html.replace(/<meta property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${esc(url)}" />`)
  html = html.replace(/<meta property="og:locale"[^>]*\/>/, `<meta property="og:locale" content="${lang === 'en' ? 'en_US' : 'zh_TW'}" />`)
  html = html.replace(/<meta name="twitter:title"[\s\S]*?\/>/, `<meta name="twitter:title" content="${esc(title)}" />\n  <meta name="twitter:description" content="${esc(desc)}" />`)
  // Replace, don't append — index.html ships its own canonical, and two
  // canonicals per shell would point the whole site at "/".
  html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${esc(url)}" />\n${hreflangBlock(route)}`)
  // The served document should declare the language it is actually in.
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${lang === 'en' ? 'en' : 'zh-Hant'}"`)
  return html
}

export function generatePrerenderShells(distDir) {
  const indexPath = join(distDir, 'index.html')
  if (!existsSync(indexPath)) {
    console.warn('[prerender] dist/index.html missing, skip')
    return 0
  }
  const template = readFileSync(indexPath, 'utf-8')
  let n = 0

  for (const route of Object.keys(ROUTES)) {
    for (const lang of ['zh', 'en']) {
      const html = buildHtml(template, route, lang)
      // zh "/" is dist/index.html itself; everything else gets its own folder.
      const rel = lang === 'en' ? EN_PREFIX + (route === '/' ? '' : route) : route
      const outDir = join(distDir, rel)
      mkdirSync(outDir, { recursive: true })
      writeFileSync(join(outDir, 'index.html'), html, 'utf-8')
      console.log(`[prerender] ${rel === '/' ? '' : rel}/index.html  ->  ${ROUTES[route][lang][0]}`)
      n++
    }
  }

  console.log(`[prerender] ${n} route shells written to ${distDir}`)
  return n
}

// CLI usage: `node scripts/prerender-meta.mjs`
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
  generatePrerenderShells(dist)
}
