import { useSyncExternalStore } from 'react'
import { Link } from 'react-router'
import { consentBannerNeeded, saveConsent, subscribeConsent } from '../lib/analytics'

/**
 * Bandeau de consentement, affiché uniquement si une mesure d’audience est configurée
 * et qu’aucun choix n’a été enregistré. Rien n’est chargé avant « Accept ».
 * Rendu côté serveur : jamais visible (pas de localStorage), donc pas d’écart d’hydratation.
 */
export function ConsentBanner() {
  const visible = useSyncExternalStore(subscribeConsent, consentBannerNeeded, () => false)
  if (!visible) return null

  return (
    <div role="dialog" aria-labelledby="consent-title" className="fixed inset-x-4 bottom-20 z-50 mx-auto max-w-xl rounded-2xl bg-paper p-5 shadow-float ring-1 ring-line sm:bottom-6">
      <p id="consent-title" className="font-display text-xl">Cookies for audience measurement</p>
      <p className="mt-2 text-[14px] text-ink-soft" style={{ fontWeight: 300 }}>
        We would like to use Google Analytics to understand which pages help travellers plan a trip. Nothing is loaded unless you accept.{' '}
        <Link to="/privacy/" className="underline underline-offset-4">
          Privacy
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => saveConsent('granted')} className="h-10 rounded-full bg-midnight px-5 text-[12px] font-medium uppercase tracking-[0.16em] text-ivory">
          Accept
        </button>
        <button type="button" onClick={() => saveConsent('denied')} className="h-10 rounded-full px-5 text-[12px] font-medium uppercase tracking-[0.16em] text-ink ring-1 ring-ink/25">
          Decline
        </button>
      </div>
    </div>
  )
}
