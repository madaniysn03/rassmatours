import { Link, useSearchParams } from 'react-router'
import { PageHero } from '../components/PageHero'
import { InquiryForm } from '../components/InquiryForm'
import { Faq } from '../components/Faq'
import { ArrowUpRightIcon, MailIcon, MessageIcon, PhoneIcon, WhatsAppIcon } from '../components/Icons'
import { images } from '../data/images'
import { siteConfig } from '../data/site'
import { practicalFaq } from '../data/faq'
import { mailtoLink, smsLink, telLink, whatsappLink } from '../lib/contact-links'
import { useHead } from '../lib/head'

export function Contact() {
  useHead({
    title: 'Plan Your Trip: Book a Private Tour in Tangier',
    description:
      'Book a private tour in Tangier: tell us your dates, your group and what you would like to see. Reach Rassma Tours by WhatsApp, phone, email or the form.',
    path: '/contact/',
    image: images.bayFromBeach,
    preload: { image: images.bayFromBeach },
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Plan your trip', path: '/contact/' },
    ],
  })
  const [params] = useSearchParams()
  const defaultTour = params.get('tour') ?? ''
  const { contact } = siteConfig

  return (
    <>
      <PageHero
        image={images.bayFromBeach}
        eyebrow="Plan your trip"
        height="short"
        title={
          <>
            Book a private tour: <em className="font-display-italic">let’s plan your days</em>
          </>
        }
        text="A few details are enough to get started. We reply within a day with a proposal and a quote."
      />

      <section className="py-16 lg:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <InquiryForm defaultTour={defaultTour} />
          </div>

          <aside className="lg:col-span-5 lg:pl-4">
            <div className="reveal">
              <span className="eyebrow mb-4">Direct</span>
              <h2 className="display-sm">Prefer to talk?</h2>
              <ul className="mt-7 space-y-4">
                <li>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-2xl bg-paper p-5 shadow-card transition-colors hover:bg-sand/60">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-midnight text-ivory">
                      <WhatsAppIcon size={18} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[12px] uppercase tracking-[0.18em] text-ink-mute">WhatsApp</span>
                      <span className="block font-display text-xl">{contact.phoneDisplay}</span>
                    </span>
                    <ArrowUpRightIcon className="text-brass" />
                  </a>
                </li>
                <li>
                  <a href={telLink} className="group flex items-center gap-4 rounded-2xl bg-paper p-5 shadow-card transition-colors hover:bg-sand/60">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand text-midnight">
                      <PhoneIcon size={18} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[12px] uppercase tracking-[0.18em] text-ink-mute">Call</span>
                      <span className="block font-display text-xl">{contact.phoneDisplay}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={smsLink} className="group flex items-center gap-4 rounded-2xl bg-paper p-5 shadow-card transition-colors hover:bg-sand/60">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand text-midnight">
                      <MessageIcon size={18} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[12px] uppercase tracking-[0.18em] text-ink-mute">SMS</span>
                      <span className="block font-display text-xl">{contact.phoneDisplay}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={mailtoLink()} className="group flex items-center gap-4 rounded-2xl bg-paper p-5 shadow-card transition-colors hover:bg-sand/60">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand text-midnight">
                      <MailIcon size={18} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[12px] uppercase tracking-[0.18em] text-ink-mute">Email</span>
                      <span className="block font-display text-xl break-all">{contact.email}</span>
                    </span>
                  </a>
                </li>
              </ul>

              <div className="mt-9 grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="eyebrow-plain text-ink-mute">Hours</h3>
                  <ul className="mt-3 space-y-1 text-[14px] text-ink-soft">
                    {contact.hours.map((h) => (
                      <li key={h.days}>
                        <span className="text-ink">{h.days}</span>
                        <br />
                        {h.time}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="eyebrow-plain text-ink-mute">Where</h3>
                  <p className="mt-3 text-[14px] text-ink-soft">
                    {contact.city}, {contact.country}
                    <br />
                    Meeting point agreed when booking: your hotel, the port or the ferry terminal.
                  </p>
                  <h3 className="eyebrow-plain mt-6 text-ink-mute">Languages</h3>
                  <p className="mt-3 text-[14px] text-ink-soft">{siteConfig.languages.join(', ')}</p>
                </div>
              </div>

              <div className="mt-9 rounded-2xl border border-line p-6">
                <h3 className="font-display text-2xl">Coming from Spain?</h3>
                <p className="mt-2 text-[15px] text-ink-soft" style={{ fontWeight: 300 }}>
                  The best way to make it from southern Spain is to take a ferry from Tarifa to the Tangier city port. We can help you choose the best ferry schedule for your time and your tour. See our guide to <Link to="/day-trips-from-spain/" className="underline underline-offset-4">Tangier day trips from Spain</Link>.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-paper py-16 lg:py-24">
        <div className="wrap-narrow">
          <Faq items={practicalFaq} title="Frequently asked questions" />
          <Link to="/faq/" className="link-line mt-8 text-ink">
            All our FAQ, including coming from Spain
          </Link>
        </div>
      </section>
    </>
  )
}
