// Per-route prerender of <head> meta so non-JS crawlers and social scrapers
// (Facebook / LINE / X) get correct title + Open Graph per page.
// Writes dist/<route>/index.html clones of the SPA shell with route-specific
// meta. Vercel serves these static files before the catch-all rewrite.
//
// Invoked two ways (belt + suspenders): as a Vite closeBundle plugin (see
// vite.config.ts, which delegates here so the route table cannot drift) and as
// an npm postbuild CLI.
//
// THREE INDEXED LOCALES. Traditional Chinese is the default and stays unprefixed
// so every existing URL and backlink keeps working; English mirrors under /en and
// Simplified Chinese under /zh-cn (lowercase only). Each shell declares all three
// as hreflang alternates (zh-Hant, zh-Hans, en, plus x-default), which is what makes the
// annotation valid — a hreflang set whose entries all resolve to one URL is
// discarded by Google, which is what this site used to ship.
//
// SOURCE OF TRUTH for page titles and descriptions. The zh strings are mirrored
// in seo.* of src/locale/zh.ts, the zhCN strings in src/locale/zhCN.ts and the en strings in src/locale/en.ts, because
// seo.ts sets document.title from those after hydration; src/utils/seoParity.test.ts
// fails when the two drift. Edit here first, then copy into the locale files.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = 'https://www.smtengo.com'
const EN_PREFIX = '/en'
// Keep in step with LOCALE_PREFIXES in src/utils/localePaths.ts (a test compares them).
export const PREFIXES = { zh: '', zhCN: '/zh-cn', en: EN_PREFIX }
export const LANGS = ['zh', 'zhCN', 'en']
const HTML_LANG = { zh: 'zh-Hant', zhCN: 'zh-Hans', en: 'en' }
const OG_LOCALE = { zh: 'zh_TW', zhCN: 'zh_CN', en: 'en_US' }
const urlFor = (route, lang) => BASE + PREFIXES[lang] + (route === '/' && PREFIXES[lang] ? '' : route)

// route -> { zh: [title, desc], zhCN: [title, desc], en: [title, desc] }
export const ROUTES = {
  '/': {
    zh: ['enGo - 住家與社區合一的智慧生活系統', 'enGo 是住家與社區合一的智慧生活系統：牆掛平板、手機 App 與雲端服務，管理家中照明、空調、窗簾與感測器，以及社區公告、報修、公設預約；enGo 安購商城提供社區訂閱與鄰里市集。'],
    zhCN: ['enGo - 住家与社区合一的智慧生活系统', 'enGo 是住家与社区合一的智慧生活系统：墙挂平板、手机 App 与云端服务，管理家中照明、空调、窗帘与传感器，以及社区公告、报修、公设预约；enGo 安购商城提供社区订阅与邻里市集。'],
    en: ['enGo Smart Home: AI for Sunlight, Air, Water & Food', 'enGo integrates sunlight, air, water and food with AI, connecting your whole home through one intelligent hub.']
  },
  '/core': {
    zh: ['核心價值 | enGo 的設計理念', 'enGo 以 AI 整合陽光、空氣、水與食物，從健康、安心到便利，打造智慧生活的核心價值。'],
    zhCN: ['核心价值 | enGo 的设计理念', 'enGo 以 AI 整合阳光、空气、水与食物，从健康、安心到便利，打造智慧生活的核心价值。'],
    en: ['Core Values | The enGo Design Philosophy', 'enGo brings sunlight, air, water and food together with AI, with health, safety and ease as the core of smart living.']
  },
  '/brand': {
    zh: ['品牌故事 | enGo 的起源', '了解 enGo 的創立初衷與品牌故事，我們如何用科技讓每個家庭享有高品質的智慧生活。'],
    zhCN: ['品牌故事 | enGo 的起源', '了解 enGo 的创立初衷与品牌故事，我们如何用科技让每个家庭享有高品质的智慧生活。'],
    en: ['Brand Story | The Origin of enGo', 'How enGo began, and why we build technology that gives every household a genuinely better everyday life.']
  },
  '/mission': {
    zh: ['我們的使命 | enGo', 'enGo 的使命：運用 AIoT 技術，讓智慧居家成為人人都能負擔的生活必需品。'],
    zhCN: ['我们的使命 | enGo', 'enGo 的使命：运用 AIoT 技术，让智慧居家成为人人都能负担的生活必需品。'],
    en: ['Our Mission | enGo Smart Home', 'Using AIoT to make the smart home an affordable necessity rather than a luxury.']
  },
  '/team': {
    zh: ['經營團隊 | enGo', '認識 enGo 的創始團隊與董事顧問：跨越 AI、營運、設計與技術戰略的四位掌舵者。'],
    zhCN: ['经营团队 | enGo', '认识 enGo 的创始团队与董事顾问：跨越 AI、运营、设计与技术战略的四位掌舵者。'],
    en: ['Leadership Team | enGo Smart Home', 'Meet the founders and board advisor behind enGo, spanning AI, operations, design and technology strategy.']
  },
  '/enviro': {
    zh: ['智慧環控 | enGo', '整合陽光、空氣、水與智慧廚房的全方位環控方案：動態控溫、空氣淨化監測、智慧水務與廚房安全。'],
    zhCN: ['智慧环控 | enGo', '整合阳光、空气、水与智慧厨房的全方位环控方案：动态控温、空气净化监测、智慧水务与厨房安全，一套系统全部联动。'],
    en: ['Environmental Control | enGo Smart Home', 'One system for sunlight and temperature, air quality, water management and kitchen safety.']
  },
  '/vision': {
    zh: ['未來願景 | enGo', 'enGo 的願景：整合雲端倉儲、聯網設備與生活採購，打造定義未來的一站式智慧生活平台。'],
    zhCN: ['未来愿景 | enGo', 'enGo 的愿景：整合云端仓储、联网设备与生活采购，打造定义未来的一站式智慧生活平台。'],
    en: ['Our Vision | enGo Smart Home', 'Cloud storage, connected devices and everyday purchasing on a single platform for the smart home.']
  },
  '/ecosystem': {
    zh: ['智慧生態系 | enGo AIoT 整合平台', '探索 enGo 智慧生態系：牆掛平板、手機 App 與 enGo 商城三個入口，五條產品線與合作夥伴，串連家中每一個智慧裝置。'],
    zhCN: ['智慧生态系 | enGo AIoT 整合平台', '探索 enGo 智慧生态系：墙挂平板、手机 App 与 enGo 商城三个入口，五条产品线与合作伙伴，串连家中每一个智慧设备。'],
    en: ['Smart Ecosystem | The enGo AIoT Platform', 'The wall tablet, the phone app and enGo Shop as three doors into one system, five product lines, and the partners behind them.']
  },
  '/product': {
    zh: ['產品介紹 | enGo AI智慧中控系統、淨水系統與 enGo 商城', '探索 enGo AI智慧中控平板、水維氧智慧淨水系統與智慧環控，以及 enGo 安購商城的社區訂閱與鄰里市集。'],
    zhCN: ['产品介绍 | enGo AI智慧中控系统、净水系统与 enGo 商城', '探索 enGo AI智慧中控平板、水维氧智慧净水系统与智慧环控，以及 enGo 安购商城的社区订阅与邻里市集。'],
    en: ['Products | enGo AI Hub, Water System & enGo Shop', 'The enGo AI control tablet, the Shui Wei Yang smart water system, environmental control, and enGo Shop for community subscriptions and a neighbourhood marketplace.']
  },
  '/packages': {
    zh: ['套裝方案 | enGo', '挑選最適合您的智慧家庭套裝方案，提升家居舒適度與安全性。'],
    zhCN: ['套装方案 | enGo', '挑选最适合您的智慧家庭套装方案，提升家居舒适度与安全性。'],
    en: ['Packages | enGo Smart Home', 'Choose the smart home package that fits your space, your budget and how you actually live.']
  },
  '/tutorial': {
    zh: ['使用教學 | 開啟您的智慧生活', '詳細的 enGo 產品使用教學與影音指南，幫助您輕鬆上手智慧家庭系統。'],
    zhCN: ['使用教学 | 开启您的智慧生活', '详细的 enGo 产品使用教学与影音指南，帮助您轻松上手智慧家庭系统。'],
    en: ['Tutorials | Getting Started with enGo', 'Step-by-step guides and videos for setting up and living with your enGo system.']
  },
  '/cases': {
    zh: ['案例分享 | 智慧家居實作紀錄', '查看我們在住宅、辦公室及各式建築中的智慧家居實作案例，見證生活品質的提升。'],
    zhCN: ['案例分享 | 智慧家居实作纪录', '查看我们在住宅、办公室及各式建筑中的智慧家居实作案例，见证生活品质的提升。'],
    en: ['Case Studies | enGo Installations', 'Real homes, offices and developments running enGo, what was installed and what changed.']
  },
  '/legal': {
    zh: ['法務文件中心 | 服務條款、隱私權政策、退貨與保固政策', '商城買家、住戶、建案與社區、合作夥伴適用的全部法律文件，繁體中文與英文版本，並可留下審閱確認。'],
    zhCN: ['法务文件中心 | 服务条款、隐私权政策、退货与保固政策', '商城买家、住户、建案与社区、合作伙伴适用的全部法律文件，繁体中文与英文版本，并可留下审阅确认。'],
    en: ['Legal Center | Terms, Privacy, Returns & Warranty', 'Every legal document for store customers, households, developments and partners, in Traditional Chinese and English, with a review acknowledgement form.']
  },
  '/contact': {
    zh: ['聯絡我們 | 諮詢 enGo 智慧家居解決方案', '對我們的產品有興趣？立即填寫表單或透過 LINE 聯繫我們，專人將竭誠為您服務。'],
    zhCN: ['联络我们 | 咨询 enGo 智慧家居解决方案', '对我们的产品有兴趣？立即填写表单或透过 LINE 联系我们，专人将竭诚为您服务。'],
    en: ['Contact Us | Talk to enGo', 'Interested in enGo? Send us a message or reach us on LINE and a specialist will get back to you.']
  }
}

const HERE = dirname(fileURLToPath(import.meta.url))
const readJson = (rel) => JSON.parse(readFileSync(join(HERE, '..', rel), 'utf-8'))
// Markdown links / bold → plain text for schema.org `text` fields.
const plain = (s) => String(s || '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\*\*/g, '').replace(/\s*\n+\s*/g, ' ').trim()
const pickL = (o, L) => (o && (o[L] ?? o.zh ?? o.en)) || ''

/**
 * Structured data for crawlers and answer engines (AI-SEO). Lives in the static
 * shells, not the SPA bundle, so it is there before any JavaScript runs.
 * Claims mirror KB-001 / the site copy; nothing new is asserted here.
 */
export function jsonLdFor(route, lang) {
  const L = lang === 'en' || lang === 'zhCN' ? lang : 'zh'
  // Legal name: Chinese on the Chinese shells (same characters in both scripts), the English name on /en.
  const LEGAL_NAME = L === 'en' ? 'Smart enGo Home Technology Corp.' : '智管家科技股份有限公司'
  const prefix = PREFIXES[L]
  const blocks = []
  if (route === '/' || route === '/product') {
    blocks.push({
      '@context': 'https://schema.org', '@type': 'MobileApplication',
      name: 'enGo智慧管家',
      operatingSystem: 'iOS, Android', applicationCategory: 'LifestyleApplication',
      description: L === 'en'
        ? 'Companion app for the enGo home management system: device control, scenes, device data and community services on iPhone, iPad and Android. Listed on both stores as enGo智慧管家.'
        : L === 'zhCN'
          ? 'enGo AI智慧中控系统的手机 App：家电控制、情境、设备数据与社区服务，iPhone、iPad 与 Android 皆可用，商店名称为 enGo智慧管家。'
          : 'enGo AI智慧中控系統的手機 App：家電控制、情境、設備數據與社區服務，iPhone、iPad 與 Android 皆可用，商店名稱為 enGo智慧管家。',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'TWD' },
      installUrl: ['https://apps.apple.com/app/id6680188565', 'https://play.google.com/store/apps/details?id=tw.smtengo.engohome.android'],
      publisher: { '@type': 'Organization', name: LEGAL_NAME, url: BASE },
    })
    // enGo 安購商城: the fifth product line (2026-09-27). Its own site, so it is an
    // OnlineStore entity owned by the company, not a Product sold on this site.
    blocks.push({
      '@context': 'https://schema.org', '@type': 'OnlineStore',
      name: L === 'en' ? 'enGo Shop' : L === 'zhCN' ? 'enGo 安购商城' : 'enGo 安購商城', alternateName: ['enGo Shop', 'enGo 商城'],
      url: 'https://shoph5.smtengo.com/',
      description: L === 'en'
        ? 'Community subscriptions and a neighbourhood marketplace for enGo residents: fresh food, daily essentials and smart-home add-ons, delivered to the community lobby.'
        : L === 'zhCN'
          ? '给 enGo 社区住户的社区订阅与邻里市集：生鲜、日用与智慧家居配件，送到社区大厅。'
          : '給 enGo 社區住戶的社區訂閱與鄰里市集：生鮮、日用與智慧家居配件，送到社區大廳。',
      areaServed: 'TW', inLanguage: 'zh-Hant',
      parentOrganization: { '@type': 'Organization', name: LEGAL_NAME, url: BASE },
      sameAs: [`${BASE}${prefix}/product#shop`],
    })
  }
  if (route === '/tutorial') {
    const faqs = readJson('src/data/faqs.json')
    const howto = readJson('src/data/howto.json').modules || []
    blocks.push({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faqs.slice(0, 30).map((f) => ({
        '@type': 'Question', name: plain(pickL(f.question, L)),
        acceptedAnswer: { '@type': 'Answer', text: plain(pickL(f.answer, L)) },
      })),
    })
    blocks.push({
      '@context': 'https://schema.org', '@type': 'ItemList',
      name: L === 'en' ? 'enGo how-to guides' : 'enGo 操作指南',
      itemListElement: howto.map((m, i) => {
        const shot = (m.steps || []).find((s) => s.image)
        return {
          '@type': 'ListItem', position: i + 1,
          item: {
            '@type': 'HowTo', name: pickL(m.title, L), description: plain(pickL(m.summary, L)),
            url: `${BASE}${prefix}/tutorial#howto-${m.id}`,
            ...(shot ? { image: BASE + shot.image } : {}),
            step: (m.steps || []).map((s, j) => ({
              '@type': 'HowToStep', position: j + 1, name: pickL(s.title, L), text: plain(pickL(s.body, L)),
              ...(s.image ? { image: BASE + s.image } : {}),
            })),
          },
        }
      }),
    })
  }
  return blocks
}

const ldScripts = (route, lang) => jsonLdFor(route, lang)
  .map((b) => `  <script type="application/ld+json" data-prerender>${JSON.stringify(b).replace(/</g, '\\u003c')}</script>`)
  .join('\n')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// ---- Crawlable fallback content ------------------------------------------------
// AI crawlers and link scrapers mostly do not run JavaScript, so a shell whose
// <body> is an empty #app shows them nothing. We ship real, visible text inside
// #app; Vue's app.mount('#app') clears the container, so it is replaced on
// hydration with no runtime code. Deliberately NOT display:none: hidden duplicate
// text can be read as cloaking.
const shortTitle = (t) => t.split(/ [|-] /)[0].trim()
const PF_STYLE = `  <style data-prerender>.pf{max-width:60ch;margin:0 auto;padding:24px;font-family:'Noto Sans TC',system-ui,sans-serif;color:#152939}.pf ul{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:8px 16px}</style>`
const PF_LINKS = {
  zhCN: { nav: '网站导览', app: 'enGo智慧管家 App', shop: 'enGo 商城', phone: '电话 02-27510218，周一至周五 09:00-18:00', kb: '知识库' },
  zh: { nav: '網站導覽', app: 'enGo智慧管家 App', shop: 'enGo 商城', phone: '電話 02-27510218，週一至週五 09:00-18:00', kb: '知識庫' },
  en: { nav: 'Site navigation', app: 'enGo智慧管家 App', shop: 'enGo Shop', phone: 'Phone 02-27510218, Mon to Fri 09:00-18:00', kb: 'Knowledge base' }
}

function fallbackBlock(route, lang) {
  const t = PF_LINKS[lang]
  const [title, desc] = ROUTES[route][lang]
  const prefix = PREFIXES[lang]
  const href = (r) => (r === '/' ? prefix || '/' : prefix + r)
  const items = Object.keys(ROUTES).map((r) => `<li><a href="${esc(href(r))}">${esc(shortTitle(ROUTES[r][lang][0]))}</a></li>`)
  items.push(
    `<li><a href="https://apps.apple.com/app/id6680188565">${esc(t.app)} (App Store)</a></li>`,
    `<li><a href="https://play.google.com/store/apps/details?id=tw.smtengo.engohome.android">${esc(t.app)} (Google Play)</a></li>`,
    `<li><a href="https://shoph5.smtengo.com/">${esc(t.shop)}</a></li>`
  )
  return `<!--prerender:fallback--><main class="pf" lang="${HTML_LANG[lang]}"><h1>${esc(shortTitle(title))}</h1><p>${esc(desc)}</p><nav aria-label="${esc(t.nav)}"><ul>${items.join('')}</ul></nav><p class="pf-contact">${esc(t.phone)} <a href="/knowledge-base.md">${esc(t.kb)}</a></p></main><!--/prerender:fallback-->`
}

/** Real alternates: three distinct URLs, which is what makes hreflang valid. */
function hreflangBlock(route) {
  const zhUrl = urlFor(route, 'zh')
  return [
    `  <link rel="alternate" hreflang="zh-Hant" href="${esc(zhUrl)}" />`,
    `  <link rel="alternate" hreflang="zh-Hans" href="${esc(urlFor(route, 'zhCN'))}" />`,
    `  <link rel="alternate" hreflang="en" href="${esc(urlFor(route, 'en'))}" />`,
    `  <link rel="alternate" hreflang="x-default" href="${esc(zhUrl)}" />`
  ].join('\n')
}

export function buildHtml(template, route, lang) {
  const [title, desc] = ROUTES[route][lang]
  const url = urlFor(route, lang)

  // Idempotency: the "/" zh shell is written over dist/index.html, which the
  // postbuild pass then reads back as its template. Without stripping first,
  // every shell inherits the home page's alternates on top of its own.
  let html = template.replace(/[ \t]*<link rel="alternate" hreflang="[^"]*"[^>]*>\n?/g, '')
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
  html = html.replace(/<meta name="description"[\s\S]*?\/>/, `<meta name="description" content="${esc(desc)}" />`)
  html = html.replace(/<meta property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${esc(title)}" />`)
  html = html.replace(/<meta property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${esc(desc)}" />`)
  html = html.replace(/<meta property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${esc(url)}" />`)
  html = html.replace(/<meta property="og:locale"[^>]*\/>/, `<meta property="og:locale" content="${OG_LOCALE[lang]}" />`)
  // Same idempotency need as the alternates above: twitter:description is not
  // in index.html, this pass adds it, and the postbuild pass reads dist/index.html
  // back as its template — without stripping, every shell ends up with two.
  html = html.replace(/[ \t]*<meta name="twitter:description"[^>]*\/>\n?/g, "")
  html = html.replace(/<meta name="twitter:title"[\s\S]*?\/>/, `<meta name="twitter:title" content="${esc(title)}" />\n  <meta name="twitter:description" content="${esc(desc)}" />`)
  // Replace, don't append — index.html ships its own canonical, and two
  // canonicals per shell would point the whole site at "/".
  html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${esc(url)}" />\n${hreflangBlock(route)}`)
  // The served document should declare the language it is actually in.
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${HTML_LANG[lang]}"`)
  // Structured data: strip what a previous pass injected (idempotency, same reason
  // as the alternates above), then add this route's blocks right before </head>.
  html = html.replace(/[ \t]*<script type="application\/ld\+json" data-prerender>[\s\S]*?<\/script>\n?/g, '')
  const ld = ldScripts(route, lang)
  if (ld) html = html.replace('</head>', `${ld}\n</head>`)
  // Crawlable fallback content (see fallbackBlock). Strip first: the postbuild
  // pass reads dist/index.html, which already carries the home shell's block.
  html = html.replace(/<!--prerender:fallback-->[\s\S]*?<!--\/prerender:fallback-->/g, '')
  html = html.replace(/[ \t]*<style data-prerender>[\s\S]*?<\/style>\n?/g, '')
  html = html.replace('</head>', `${PF_STYLE}\n</head>`)
  html = html.replace(/<div id="app">\s*<\/div>/, () => `<div id="app">${fallbackBlock(route, lang)}</div>`)
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
    for (const lang of LANGS) {
      const html = buildHtml(template, route, lang)
      // zh "/" is dist/index.html itself; everything else gets its own folder.
      const rel = PREFIXES[lang] + (route === '/' && PREFIXES[lang] ? '' : route)
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
