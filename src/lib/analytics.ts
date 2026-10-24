/**
 * Mesure d’audience optionnelle (Google Analytics 4) et événements de conversion.
 * - Rien n’est chargé sans identifiant (`VITE_GA4_ID`) ni sans consentement explicite.
 * - Les identifiants sont des variables d’environnement de build, jamais des secrets.
 * - Les événements sont émis même sans GA (no-op), ce qui permet de brancher GTM ou un autre outil.
 */
export const GA4_ID = ((import.meta.env.VITE_GA4_ID as string | undefined) ?? '').trim()
const CONSENT_KEY = 'rt-consent'

type Consent = 'granted' | 'denied' | null
type GtagFn = (...args: unknown[]) => void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: GtagFn
  }
}

export const analyticsEnabled = () => GA4_ID.length > 0

export function readConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

const listeners = new Set<() => void>()
let sessionChoice: Consent = null

/** Abonnement aux changements de consentement (useSyncExternalStore). */
export function subscribeConsent(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Vrai quand le bandeau doit s’afficher : mesure configurée et aucun choix enregistré. */
export const consentBannerNeeded = () => analyticsEnabled() && sessionChoice === null && readConsent() === null

export function saveConsent(value: Exclude<Consent, null>) {
  sessionChoice = value
  try {
    localStorage.setItem(CONSENT_KEY, value)
  } catch {
    // Stockage indisponible (navigation privée) : le choix ne vaut que pour la session.
  }
  if (value === 'granted') loadGa4()
  listeners.forEach((l) => l())
}

let loaded = false

/** Charge gtag.js une seule fois, après consentement. */
export function loadGa4() {
  if (loaded || !analyticsEnabled() || typeof document === 'undefined') return
  loaded = true
  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args)
  }
  window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
  window.gtag('js', new Date())
  window.gtag('config', GA4_ID, { anonymize_ip: true, send_page_view: true })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`
  document.head.appendChild(script)
}

/** À appeler au démarrage : charge GA si le consentement a déjà été donné. */
export function initAnalytics() {
  if (readConsent() === 'granted') loadGa4()
}

/** Page vue lors des navigations internes (GA4 ne les voit pas seul dans une SPA). */
export function trackPageView(path: string) {
  window.gtag?.('event', 'page_view', { page_path: path, page_location: window.location.href, page_title: document.title })
}

export type ConversionEvent = 'whatsapp_click' | 'email_click' | 'phone_click' | 'cta_click' | 'generate_lead'

/** Événement de conversion ; `generate_lead` est réservé à une demande réellement envoyée. */
export function trackEvent(name: ConversionEvent, params: Record<string, string | number | undefined> = {}) {
  window.gtag?.('event', name, params)
}

/**
 * Suivi global des clics par délégation : WhatsApp, e-mail, téléphone et boutons marqués `data-cta`.
 * Un seul écouteur, aucune modification des composants.
 */
export function attachClickTracking(): () => void {
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement | HTMLButtonElement>('a, button')
    if (!a) return
    const href = a instanceof HTMLAnchorElement ? a.href : ''
    const cta = a.dataset.cta
    const page = window.location.pathname
    if (cta?.startsWith('inquiry_')) {
      trackEvent('generate_lead', { method: cta.replace('inquiry_', ''), page })
      return
    }
    if (href.startsWith('https://wa.me/')) trackEvent('whatsapp_click', { page, label: cta ?? a.textContent?.trim().slice(0, 40) })
    else if (href.startsWith('mailto:')) trackEvent('email_click', { page })
    else if (href.startsWith('tel:')) trackEvent('phone_click', { page })
    else if (cta) trackEvent('cta_click', { page, label: cta })
  }
  document.addEventListener('click', onClick)
  return () => document.removeEventListener('click', onClick)
}
