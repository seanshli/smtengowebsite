export function useAnalytics() {
    const trackEvent = (eventName: string, params: object = {}) => {
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
