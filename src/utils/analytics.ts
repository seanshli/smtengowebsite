import { recordSiteEvent } from './siteTracking'

export function useAnalytics() {
    const trackEvent = (eventName: string, params: object = {}) => {
        // our own copy (site_events) — independent of whether GTM loaded
        recordSiteEvent(eventName, params as Record<string, any>)
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
            (window as any).dataLayer.push({
                event: eventName,
                ...params
            })
            console.log(`[Analytics] Tracked event: ${eventName}`, params)
        }
    }

    const trackPageView = (pagePath: string) => {
        trackEvent('page_view', { page_path: pagePath })
    }

    return {
        trackEvent,
        trackPageView
    }
}
