import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const response = (status = 200, json: unknown = {}) => ({
    status,
    json: vi.fn().mockResolvedValue(json),
})

describe('site tracking', () => {
    let fetchMock: ReturnType<typeof vi.fn>
    let sendBeaconMock: ReturnType<typeof vi.fn>

    beforeEach(() => {
        vi.resetModules()
        vi.useFakeTimers()
        fetchMock = vi.fn().mockResolvedValue(response())
        sendBeaconMock = vi.fn().mockReturnValue(true)
        vi.stubGlobal('fetch', fetchMock)
        Object.defineProperty(navigator, 'sendBeacon', {
            configurable: true,
            value: sendBeaconMock,
        })
        document.documentElement.lang = 'zh-TW'
        window.history.replaceState({}, '', '/')
        delete (window as any).dataLayer
    })

    afterEach(() => {
        vi.clearAllTimers()
        vi.useRealTimers()
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
    })

    it('ignores events outside KEEP and records kept events with a clipped pathname', async () => {
        window.history.replaceState({}, '', `/${'p'.repeat(250)}`)
        const { flush, recordSiteEvent } = await import('./siteTracking')

        recordSiteEvent('not_kept', { label: 'ignored' })
        recordSiteEvent('cta_click')
        flush(false)

        expect(fetchMock).toHaveBeenCalledOnce()
        const body = JSON.parse(fetchMock.mock.calls[0][1].body)
        expect(body.events).toHaveLength(1)
        expect(body.events[0]).toMatchObject({
            event: 'cta_click',
            page: window.location.pathname.slice(0, 200),
            locale: 'zh-TW',
        })
    })

    it('keeps chatbot_search without its free-text label', async () => {
        const { flush, recordSiteEvent } = await import('./siteTracking')

        recordSiteEvent('chatbot_search', { label: 'private search text' })
        flush(false)

        const event = JSON.parse(fetchMock.mock.calls[0][1].body).events[0]
        expect(event.event).toBe('chatbot_search')
        expect(event.label).toBeUndefined()
    })

    it('clips labels to 80 characters', async () => {
        const { flush, recordSiteEvent } = await import('./siteTracking')

        recordSiteEvent('ui_click', { label: 'x'.repeat(100) })
        flush(false)

        const event = JSON.parse(fetchMock.mock.calls[0][1].body).events[0]
        expect(event.label).toBe('x'.repeat(80))
    })

    it('flushes after 3000ms with the expected fetch request', async () => {
        const { recordSiteEvent } = await import('./siteTracking')
        recordSiteEvent('cta_click', { label: 'buy' })

        expect(fetchMock).not.toHaveBeenCalled()
        vi.advanceTimersByTime(2999)
        expect(fetchMock).not.toHaveBeenCalled()
        vi.advanceTimersByTime(1)

        expect(fetchMock).toHaveBeenCalledWith('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: expect.any(String),
            keepalive: true,
        })
        expect(JSON.parse(fetchMock.mock.calls[0][1].body).events).toHaveLength(1)
    })

    it('flushes immediately when 50 events are queued', async () => {
        const { recordSiteEvent } = await import('./siteTracking')

        for (let i = 0; i < 49; i++) recordSiteEvent('ui_click', { label: String(i) })
        expect(fetchMock).not.toHaveBeenCalled()
        recordSiteEvent('ui_click', { label: '49' })

        expect(fetchMock).toHaveBeenCalledOnce()
        expect(JSON.parse(fetchMock.mock.calls[0][1].body).events).toHaveLength(50)
    })

    it('uses sendBeacon with a Blob when flush(true) is requested', async () => {
        const { flush, recordSiteEvent } = await import('./siteTracking')
        recordSiteEvent('page_view')

        flush(true)

        expect(sendBeaconMock).toHaveBeenCalledWith('/api/track', expect.any(Blob))
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it.each([
        ['a 202 table_missing response', 202, { reason: 'table_missing' }],
        ['a 404 response', 404, {}],
    ])('ignores later events for the module lifetime after %s', async (_name, status, json) => {
        fetchMock.mockResolvedValueOnce(response(status as number, json))
        const { flush, recordSiteEvent } = await import('./siteTracking')

        recordSiteEvent('cta_click', { label: 'first' })
        flush(false)
        await vi.runAllTimersAsync()
        expect(fetchMock).toHaveBeenCalledOnce()

        recordSiteEvent('cta_click', { label: 'ignored' })
        vi.advanceTimersByTime(3000)
        flush(false)

        expect(fetchMock).toHaveBeenCalledOnce()
    })

    it('records each scroll depth once and never records the same depth twice', async () => {
        const { flush, noteScrollProgress } = await import('./siteTracking')

        noteScrollProgress(0.25)
        noteScrollProgress(0.5)
        noteScrollProgress(0.75)
        noteScrollProgress(1)
        noteScrollProgress(1)
        flush(false)

        const events = JSON.parse(fetchMock.mock.calls[0][1].body).events
        expect(events.map((event: { event: string }) => event.event)).toEqual([
            'scroll_depth', 'scroll_depth', 'scroll_depth', 'scroll_depth',
        ])
        expect(events.map((event: { label: string }) => event.label)).toEqual(['25', '50', '75', '100'])
    })
})

describe('useAnalytics', () => {
    afterEach(() => {
        vi.doUnmock('./siteTracking')
        vi.restoreAllMocks()
    })

    it('records an event even when dataLayer is undefined', async () => {
        const recordSiteEvent = vi.fn()
        vi.resetModules()
        vi.doMock('./siteTracking', () => ({ recordSiteEvent }))
        delete (window as any).dataLayer
        const { useAnalytics } = await import('./analytics')

        useAnalytics().trackEvent('cta_click', { label: 'contact' })

        expect(recordSiteEvent).toHaveBeenCalledWith('cta_click', { label: 'contact' })
    })

  describe('internal traffic exclusion', () => {
    let fetchMock: ReturnType<typeof vi.fn>
    beforeEach(() => {
        vi.resetModules()
        fetchMock = vi.fn().mockResolvedValue({ status: 200, json: vi.fn().mockResolvedValue({}) })
        vi.stubGlobal('fetch', fetchMock)
        window.history.replaceState({}, '', '/')
        delete (window as any).dataLayer
    })
    afterEach(() => {
        localStorage.removeItem('smtengo_qa')
        delete (navigator as any).webdriver
        vi.unstubAllGlobals()
    })

    it('drops events when navigator.webdriver is set (Lighthouse, Playwright, devtools automation)', async () => {
        Object.defineProperty(navigator, 'webdriver', { configurable: true, value: true })
        const { flush, recordSiteEvent, isInternalTraffic } = await import('./siteTracking')
        expect(isInternalTraffic()).toBe(true)
        recordSiteEvent('cta_click')
        flush(false)
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it('?qa=1 marks the browser as internal and persists it; ?qa=0 clears it', async () => {
        window.history.replaceState({}, '', '/?qa=1')
        const { isInternalTraffic } = await import('./siteTracking')
        expect(isInternalTraffic()).toBe(true)
        window.history.replaceState({}, '', '/product')
        expect(isInternalTraffic()).toBe(true)
        expect(localStorage.getItem('smtengo_qa')).toBe('1')
        window.history.replaceState({}, '', '/?qa=0')
        expect(isInternalTraffic()).toBe(false)
        expect(localStorage.getItem('smtengo_qa')).toBeNull()
    })

    it('keeps GTM clean too: trackEvent skips dataLayer for internal sessions', async () => {
        localStorage.setItem('smtengo_qa', '1')
        ;(window as any).dataLayer = []
        const { useAnalytics } = await import('./analytics')
        useAnalytics().trackEvent('cta_click', { location: 'line' })
        expect((window as any).dataLayer).toHaveLength(0)
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it('a normal visitor is not internal', async () => {
        const { isInternalTraffic } = await import('./siteTracking')
        expect(isInternalTraffic()).toBe(false)
    })
  })
})
