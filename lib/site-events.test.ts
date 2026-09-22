import { describe, it, expect } from 'vitest'
import { sanitizeEvents, aggregateSiteEvents } from './site-events'

describe('sanitizeEvents', () => {
    it('keeps well-formed events, strips query strings and clips lengths', () => {
        const rows = sanitizeEvents([
            { event: 'page_view', page: '/product?utm_source=line&email=a@b.c#x', locale: 'zh-Hant' },
            { event: 'ui_click', page: '/', section: 'nav', label: 'x'.repeat(200) },
        ])
        expect(rows).toHaveLength(2)
        expect(rows[0].page).toBe('/product')
        expect(rows[1].label).toHaveLength(80)
    })
    it('drops malformed events without throwing', () => {
        expect(sanitizeEvents(null)).toEqual([])
        expect(sanitizeEvents([{ event: 'DROP TABLE', page: '/' }, { event: 'ok_event', page: 'nope' }, 'junk', {}])).toEqual([])
    })
    it('caps a batch at 50', () => {
        const many = Array.from({ length: 80 }, () => ({ event: 'page_view', page: '/' }))
        expect(sanitizeEvents(many)).toHaveLength(50)
    })
})

describe('aggregateSiteEvents', () => {
    const row = (event: string, page = '/', extra: Partial<{ section: string; label: string }> = {}) =>
        ({ event, page, section: extra.section ?? null, label: extra.label ?? null, locale: 'zh-Hant' })
    const out = aggregateSiteEvents([
        row('page_view'), row('page_view'), row('page_view', '/product'),
        row('section_view', '/', { section: 'interfaces' }), row('section_view', '/', { section: 'interfaces' }), row('section_view', '/', { section: 'proof' }),
        row('ui_click', '/', { section: 'nav', label: 'contact' }),
        row('cta_click', '/', { label: 'hero' }),
        row('outbound_click', '/product', { label: 'apps.apple.com' }),
        row('scroll_depth', '/', { label: '25' }), row('scroll_depth', '/', { label: '25' }), row('scroll_depth', '/', { label: '50' }),
    ])
    it('counts page views and ranks pages and sections', () => {
        expect(out.totals.pageViews).toBe(3)
        expect(out.topPages[0]).toEqual({ key: '/', count: 2 })
        expect(out.topSections[0]).toEqual({ key: '/#interfaces', count: 2 })
    })
    it('labels clicks, CTA locations and outbound hosts', () => {
        expect(out.topClicks[0].key).toBe('nav:contact')
        expect(out.ctaByLocation[0].key).toBe('/ · hero')
        expect(out.topOutbound[0].key).toBe('apps.apple.com')
    })
    it('expresses scroll depth as the share of page views reaching it', () => {
        expect(out.scrollDepth['25']).toBeCloseTo(2 / 3)
        expect(out.scrollDepth['50']).toBeCloseTo(1 / 3)
        expect(out.scrollDepth['100']).toBe(0)
    })
})
