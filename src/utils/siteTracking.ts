// Site-wide behaviour tracking that we own.
//
// GTM already forwards `trackEvent` calls to GA4 / Ads / Meta. That data lives
// in Google's UI. This module gives the site its own copy of the events that
// describe attention (what people look at, what they click, how far they
// scroll) so the admin dashboard can show them without leaving the site.
//
// Privacy: no identifiers. A row is (event, page path, section, label, locale,
// time). No query strings, no user agent, no IP (the API drops it), no cookie.
//
// Three sources feed the queue:
//   1. every `trackEvent` whose name is in KEEP (see utils/analytics.ts)
//   2. delegated clicks on any element carrying `data-track="section:label"`,
//      plus outbound links (target=_blank or a foreign host)
//   3. section visibility (`section_view`, once per section per page view)
//      and scroll depth (25/50/75/100, once each per page view)
import type { Router } from 'vue-router'

export type SiteEvent = {
    event: string
    page: string
    section?: string
    label?: string
    locale?: string
    ts: string
}

// Events worth keeping in our own table. Everything else stays GTM-only.
export const KEEP = new Set([
    'page_view', 'section_view', 'ui_click', 'cta_click', 'outbound_click', 'scroll_depth',
    'howto_open', 'faq_click', 'tutorial_card_click', 'case_click', 'filter_cases',
    'buy_now_click', 'form_submit_success', 'click_contact_line',
    'chatbot_open', 'chatbot_search', 'chatbot_line_handoff',
])

const ENDPOINT = '/api/track'
const FLUSH_MS = 3000
const MAX_BATCH = 50
const queue: SiteEvent[] = []
let timer: ReturnType<typeof setTimeout> | null = null
let disabled = false   // set once the API says the table does not exist yet

const clip = (v: unknown, n = 80) => (typeof v === 'string' ? v.slice(0, n) : undefined)
export const pagePath = () => (typeof window === 'undefined' ? '/' : window.location.pathname.slice(0, 200))
const currentLocale = () => (typeof document === 'undefined' ? undefined : document.documentElement.lang || undefined)

// The three events this module originates (section_view, scroll_depth, ui_click /
// outbound_click) are pushed to GTM here as well, so GA4 sees the same attention
// data the admin dashboard does. Everything else already arrives via trackEvent.
function emit(event: string, params: Record<string, any>) {
    if (typeof window !== 'undefined' && (window as any).dataLayer) (window as any).dataLayer.push({ event, ...params })
    recordSiteEvent(event, params)
}

/** Called by utils/analytics.ts for every trackEvent. Cheap no-op for events we do not keep. */
export function recordSiteEvent(event: string, params: Record<string, any> = {}) {
    if (disabled || !KEEP.has(event) || typeof window === 'undefined') return
    // page_view carries the target path itself (router.afterEach fires before the URL settles here).
    const page = clip(params.page_path, 200) || pagePath()
    // Chatbot searches are free text typed by visitors: keep the event, drop the text.
    const label = event === 'chatbot_search' ? undefined
        : clip(params.label ?? params.location ?? params.module ?? params.faq_id ?? params.case_id ?? params.category ?? params.href ?? params.depth ?? params.tutorial_id ?? params.productType)
    const section = clip(params.section ?? (event === 'section_view' ? params.id : undefined))
    queue.push({ event, page, section, label, locale: currentLocale(), ts: new Date().toISOString() })
    if (queue.length >= MAX_BATCH) flush(false)
    else if (!timer) timer = setTimeout(() => flush(false), FLUSH_MS)
}

export function flush(useBeacon: boolean) {
    if (timer) { clearTimeout(timer); timer = null }
    if (!queue.length || disabled) return
    const body = JSON.stringify({ events: queue.splice(0, MAX_BATCH) })
    try {
        if (useBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
            navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }))
            return
        }
        fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true })
            .then(async (r) => {
                // 202 + table_missing: the Supabase table has not been created yet. Stop
                // sending for this page load rather than 4xx-ing every few seconds.
                if (r.status === 202) { const j = await r.json().catch(() => ({})); if (j?.reason === 'table_missing') disabled = true }
                // No API behind this origin (vite dev, a static mirror): stop for this page load.
                if (r.status === 404 || r.status === 405) disabled = true
            })
            .catch(() => { /* analytics must never break the page */ })
    } catch { /* ignore */ }
}

// ── page-scoped state: reset on every route change ──────────────────────────
const seenSections = new Set<string>()
const seenDepths = new Set<number>()
let observer: IntersectionObserver | null = null

function observeSections() {
    if (observer) observer.disconnect()
    if (typeof IntersectionObserver === 'undefined') return
    observer = new IntersectionObserver((entries) => {
        for (const e of entries) {
            const id = (e.target as HTMLElement).id
            if (e.isIntersecting && id && !seenSections.has(id)) {
                seenSections.add(id)
                emit('section_view', { id, section: id })
            }
        }
    }, { threshold: 0.4 })
    document.querySelectorAll<HTMLElement>('main section[id], .howto-module[id], #faq, #howto').forEach((el) => observer!.observe(el))
}

/** Call from an existing scroll handler with the page's scroll fraction (0..1). */
export function noteScrollProgress(fraction: number) {
    for (const d of [25, 50, 75, 100]) {
        if (fraction * 100 >= d && !seenDepths.has(d)) {
            seenDepths.add(d)
            emit('scroll_depth', { depth: String(d) })
        }
    }
}

function onDocumentClick(e: MouseEvent) {
    const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track], a[href]')
    if (!target) return
    const tag = target.getAttribute('data-track')
    if (tag) {
        const [section, label] = tag.includes(':') ? tag.split(':', 2) : [undefined, tag]
        emit('ui_click', { section, label })
        return
    }
    const a = target as HTMLAnchorElement
    if (a.href && /^https?:/.test(a.href)) {
        try {
            const url = new URL(a.href)
            if (url.host !== window.location.host) emit('outbound_click', { label: url.host, section: a.closest('section[id]')?.id })
        } catch { /* ignore */ }
    }
}

let installed = false
export function installSiteTracking(router: Router) {
    if (installed || typeof window === 'undefined') return
    installed = true
    document.addEventListener('click', onDocumentClick, { capture: true, passive: true })
    window.addEventListener('pagehide', () => flush(true))
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(true) })
    const rearm = () => {
        seenSections.clear(); seenDepths.clear()
        // sections render after the route's component mounts; observe on the next frame
        requestAnimationFrame(() => requestAnimationFrame(observeSections))
    }
    router.afterEach(rearm)
    rearm()
}
