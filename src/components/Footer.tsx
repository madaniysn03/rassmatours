import { Link } from 'react-router'
import { siteConfig } from '../data/site'
import { tours } from '../data/tours'
import { destinations } from '../data/destinations'
import { mailtoLink, smsLink, telLink, whatsappLink } from '../lib/contact-links'
import { Wordmark } from './Wordmark'
import { Ticker } from './Ticker'
import { ArrowUpRightIcon } from './Icons'

/** Année courante, calculée une fois au chargement du module. */
const year = new Date().getFullYear()

export function Footer() {
  const { contact } = siteConfig

  return (
    <footer className="bg-midnight text-ivory">
      <div className="wrap grid gap-12 py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="lg:col-span-4">
          <Wordmark tone="ivory" size="md" />
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ivory/75" style={{ fontWeight: 300 }}>
            Private tours and excursions in Tangier and northern Morocco, led by local guides. {siteConfig.brand.tagline}
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-brass">Languages</p>
          <p className="mt-1 text-sm text-ivory/80">{siteConfig.languages.join(' · ')}</p>
        </div>

        <div className="lg:col-span-2">
          <h2 className="eyebrow-plain font-sans text-brass">Tours</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {tours.map((t) => (
              <li key={t.slug}>
                <Link to={`/tours/${t.slug}/`} className="text-ivory/85 transition-colors hover:text-ivory">
                  {t.headline}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className="eyebrow-plain font-sans text-brass">Destinations</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {destinations.map((d) => (
              <li key={d.slug}>
                <Link to={`/destinations/${d.slug}/`} className="text-ivory/85 transition-colors hover:text-ivory">
                  {d.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/day-trips-from-spain/" className="text-ivory/85 transition-colors hover:text-ivory">
                Day trips from Spain
              </Link>
            </li>
            <li>
              <Link to="/tangier-ferry-guide/" className="text-ivory/85 transition-colors hover:text-ivory">
                Ferry guide
              </Link>
            </li>
            <li>
              <Link to="/about/" className="text-ivory/85 transition-colors hover:text-ivory">
                About us
              </Link>
            </li>
            <li>
              <Link to="/faq/" className="text-ivory/85 transition-colors hover:text-ivory">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact/" className="text-ivory/85 transition-colors hover:text-ivory">
                Plan your trip
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-4">
          <h2 className="eyebrow-plain font-sans text-brass">Contact</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-ivory/85 hover:text-ivory">
                WhatsApp {contact.phoneDisplay}
                <ArrowUpRightIcon size={14} />
              </a>
            </li>
            <li>
              <a href={telLink} className="text-ivory/85 hover:text-ivory">
                Call {contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={smsLink} className="text-ivory/85 hover:text-ivory">
                SMS {contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={mailtoLink()} className="text-ivory/85 hover:text-ivory">
                {contact.email}
              </a>
            </li>
            <li className="text-ivory/85">
              {contact.city}, {contact.country}
            </li>
          </ul>
          <ul className="mt-5 space-y-1 text-[13px] text-ivory/60">
            {contact.hours.map((h) => (
              <li key={h.days}>
                {h.days}: {h.time}
              </li>
            ))}
          </ul>
          {siteConfig.tripadvisorUrl && (
            <a
              href={siteConfig.tripadvisorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line mt-6 text-ivory/85 hover:text-ivory"
            >
              Reviews on TripAdvisor
              <ArrowUpRightIcon size={14} />
            </a>
          )}
          {siteConfig.googleBusinessProfileUrl && (
            <a href={siteConfig.googleBusinessProfileUrl} target="_blank" rel="noopener noreferrer" className="link-line mt-3 block text-ivory/85 hover:text-ivory">
              Find us on Google
              <ArrowUpRightIcon size={14} />
            </a>
          )}
        </div>
      </div>

      <Ticker />

      <div className="wrap flex flex-col gap-3 py-6 text-[12px] text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} {siteConfig.brand.name}. All rights reserved.</p>
        <ul className="flex flex-wrap gap-5">
          <li>
            <Link to="/privacy/" className="hover:text-ivory">
              Privacy
            </Link>
          </li>
          <li>
            <Link to="/contact/" className="hover:text-ivory">
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
