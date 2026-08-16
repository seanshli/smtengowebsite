// Consent Mode v2 wiring. The defaults are set inline in index.html (they have
// to run before GTM loads); this module only records the visitor's answer and
// tells Google about it.

export type ConsentChoice = 'granted' | 'denied'

const KEY = 'cookieConsent'
const LEGACY_KEY = 'acceptCookie' // pre-consent-mode banner

/** The stored answer, or null if the visitor has not been asked yet. */
export const getConsent = (): ConsentChoice | null => {
  try {
    const stored = localStorage.getItem(KEY)
    if (stored === 'granted' || stored === 'denied') return stored
    // Someone who accepted the old banner has already answered.
    return localStorage.getItem(LEGACY_KEY) === 'yes' ? 'granted' : null
  } catch {
    return null // private mode — ask again rather than assume consent
  }
}

export const setConsent = (choice: ConsentChoice): void => {
  try {
    localStorage.setItem(KEY, choice)
  } catch {
    /* still signal Google below, even if we cannot remember the answer */
  }

  // gtag() is declared by the inline script in index.html. Call it rather than
  // pushing to dataLayer by hand: the consent API expects the arguments object
  // that gtag builds, not a plain array.
  const gtag = (window as any).gtag
  if (typeof gtag !== 'function') return

  gtag('consent', 'update', {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
    functionality_storage: choice,
    personalization_storage: choice,
    security_storage: 'granted'
  })
}
