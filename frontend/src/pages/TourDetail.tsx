import { Link, useParams } from 'react-router'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Button } from '../components/Button'
import { SmartImage } from '../components/SmartImage'
import { TourCard } from '../components/TourCard'
import { Faq } from '../components/Faq'
import { CtaBand } from '../components/CtaBand'
import { SpainNotes } from '../components/SpainNotes'
import { ArrowRightIcon, CarIcon, CheckIcon, ClockIcon, LanguageIcon, PinIcon, UsersIcon, WhatsAppIcon } from '../components/Icons'
import { getTour, tours } from '../data/tours'
import { destinations } from '../data/destinations'
import { dirhamsFaq, practicalFaq } from '../data/faq'
import { siteConfig } from '../data/site'
import { absoluteUrl, useHead } from '../lib/head'
import { tourInquiryMessage, whatsappLink } from '../lib/contact-links'
import { NotFound } from './NotFound'

export function TourDetail() {
  const { slug = '' } = useParams()
  const tour = getTour(slug)
  if (!tour) return <NotFound />
  return <TourPage tour={tour} />
}

function TourPage({ tour }: { tour: NonNullable<ReturnType<typeof getTour>> }) {
  const path = `/tours/${tour.slug}/`
  const related = tour.relatedSlugs.map((s) => tours.find((t) => t.slug === s)).filter((t): t is NonNullable<typeof t> => !!t)
  const tourDestinations = tour.destinationSlugs.map((s) => destinations.find((d) => d.slug === s)).filter((d): d is NonNullable<typeof d> => !!d)
  const drives = tour.category === 'excursion' || tour.slug === 'cap-spartel-hercules-caves'

  useHead({
    title: tour.seo.title,
    description: tour.seo.description,
    path,
    image: tour.image,
    preload: { image: tour.image },
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tours', path: '/tours/' },
      { name: tour.name, path },
    ],
    jsonLd: [
      {
        // Propriétés limitées à ce qui est publié : pas de prix, pas de disponibilité, pas d’avis.
        '@type': 'TouristTrip',
        '@id': `${absoluteUrl(path)}#trip`,
        name: tour.name,
        alternateName: tour.headline !== tour.name ? tour.headline : undefined,
        description: tour.seo.description,
        url: absoluteUrl(path),
        image: [absoluteUrl(tour.image.src), absoluteUrl(tour.imagePortrait.src)],
        inLanguage: ['en', 'fr', 'es', 'ar'],
        provider: { '@id': `${siteConfig.url}/#organization` },
        touristType: 'Private group',
        itinerary: {
          '@type': 'ItemList',
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          numberOfItems: tour.day.length,
          itemListElement: tour.day.map((step, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: { '@type': 'Place', name: step.place, description: step.text },
          })),
        },
        subjectOf: { '@id': `${absoluteUrl(path)}#webpage` },
      },
    ],
  })

  const category = tour.category === 'tangier' ? 'In Tangier' : 'Day trip from Tangier'
  const contactHref = `/contact/?tour=${encodeURIComponent(tour.name)}`
  const whatsapp = whatsappLink(tourInquiryMessage(tour.name))

  return (
    <>
      {/* Visuel d’ouverture */}
      <section className="relative flex min-h-[70svh] items-end overflow-hidden bg-midnight-deep text-ivory lg:min-h-[78svh]">
        <SmartImage image={tour.image} priority fill sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-deep/90 via-midnight-deep/35 to-midnight-deep/25" />
        <div className="wrap relative pb-14 pt-44 lg:pb-20">
          <div className="enter" style={{ '--enter-delay': '60ms' } as React.CSSProperties}>
            <Breadcrumbs tone="ivory" items={[{ label: 'Home', to: '/' }, { label: 'Tours', to: '/tours/' }, { label: tour.shortName }]} />
          </div>
          <span className="enter eyebrow mt-8 mb-5" style={{ '--enter-delay': '140ms' } as React.CSSProperties}>
            {category}
            {tour.bestseller && ' · Bestseller'}
          </span>
          <h1 className="enter display-lg max-w-4xl" style={{ '--enter-delay': '220ms' } as React.CSSProperties}>
            {tour.headline}
          </h1>
          <ul className="enter mt-7 flex flex-wrap gap-x-7 gap-y-2 text-[13px] uppercase tracking-[0.16em] text-ivory/85" style={{ '--enter-delay': '320ms' } as React.CSSProperties}>
            <li className="inline-flex items-center gap-2">
              <ClockIcon size={16} className="text-brass" /> {tour.duration}
            </li>
            <li className="inline-flex items-center gap-2">
              <UsersIcon size={16} className="text-brass" /> Private tour
            </li>
            <li className="inline-flex items-center gap-2">
              <LanguageIcon size={16} className="text-brass" /> EN · FR · ES · AR
            </li>
          </ul>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="lead reveal">{tour.summary}</p>
            <div className="prose-editorial reveal mt-10">
              {tour.story.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>

            <div className="reveal mt-14">
              <span className="eyebrow mb-4">Your day</span>
              <h2 className="display-sm">Your {tour.ref} itinerary</h2>
              <ol className="mt-8 space-y-7 border-l border-line pl-8">
                {tour.day.map((step, i) => (
                  <li key={step.title} className="relative">
                    <span className="absolute -left-[2.45rem] top-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-ivory font-display text-sm text-brass ring-1 ring-line">
                      {i + 1}
                    </span>
                    <h3 className="text-xl">{step.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft" style={{ fontWeight: 300 }}>
                      {step.text}
                    </p>
                  </li>
                ))}
              </ol>
              <p className="note mt-6">The order and timing adapt to your pace, the weather and your arrival time.</p>
            </div>

            <div className="reveal mt-14">
              <span className="eyebrow mb-4">Highlights</span>
              <h2 className="display-sm">Highlights of the {tour.ref}</h2>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {tour.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-[15px] text-ink-soft">
                    <CheckIcon size={18} className="mt-0.5 shrink-0 text-brass" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal mt-14 grid gap-10 sm:grid-cols-2">
              <div>
                <span className="eyebrow mb-4">Included</span>
                <h2 className="display-sm">What comes with it</h2>
                <ul className="mt-6 space-y-3">
                  {tour.included.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] text-ink-soft">
                      <CheckIcon size={18} className="mt-0.5 shrink-0 text-brass" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="note mt-5">Entrance fees, meals and gratuities are detailed in your quote.</p>
              </div>
              <div>
                <span className="eyebrow mb-4">Meeting point</span>
                <h2 className="display-sm">Where we meet</h2>
                <p className="mt-6 flex items-start gap-3 text-[15px] text-ink-soft" style={{ fontWeight: 300 }}>
                  <PinIcon size={18} className="mt-0.5 shrink-0 text-brass" />
                  {siteConfig.contact.meetingPoint}
                </p>
                <p className="mt-3 text-[15px] text-ink-soft" style={{ fontWeight: 300 }}>
                  Start time: chosen with you, around your ferry, flight or cruise schedule.
                </p>
              </div>
            </div>
          </div>

          {/* Encadré de demande */}
          <aside className="lg:col-span-5">
            <div className="reveal sticky top-28 rounded-3xl bg-paper p-7 shadow-card sm:p-9">
              <span className="eyebrow mb-4">Inquire</span>
              <h2 className="text-3xl">Ask about this experience</h2>
              <p className="mt-3 text-[15px] text-ink-soft" style={{ fontWeight: 300 }}>
                Tell us your dates and the size of your group. {siteConfig.contact.responseTime}
              </p>
              <dl className="mt-7 space-y-3 border-y border-line py-5 text-[14px]">
                <div className="flex items-center gap-3">
                  <ClockIcon size={16} className="text-brass" />
                  <dt className="w-24 text-ink-mute">Duration</dt>
                  <dd className="text-ink">{tour.duration}</dd>
                </div>
                <div className="flex items-center gap-3">
                  <UsersIcon size={16} className="text-brass" />
                  <dt className="w-24 text-ink-mute">Group</dt>
                  <dd className="text-ink">Private, your party only</dd>
                </div>
                <div className="flex items-center gap-3">
                  <LanguageIcon size={16} className="text-brass" />
                  <dt className="w-24 text-ink-mute">Languages</dt>
                  <dd className="text-ink">{siteConfig.languages.join(', ')}</dd>
                </div>
                {drives && (
                  <div className="flex items-center gap-3">
                    <CarIcon size={16} className="text-brass" />
                    <dt className="w-24 text-ink-mute">Transport</dt>
                    <dd className="text-ink">Private air-conditioned vehicle</dd>
                  </div>
                )}
              </dl>
              <div className="mt-7 flex flex-col gap-3">
                <Button to={contactHref} variant="midnight" size="lg" data-cta="request_tour">
                  Request this experience
                </Button>
                <Button href={whatsapp} target="_blank" rel="noopener noreferrer" variant="outline" size="lg" data-cta="tour_whatsapp">
                  <WhatsAppIcon size={16} />
                  Ask on WhatsApp
                </Button>
              </div>
              <p className="note mt-5">Prices are confirmed with your quote. Payment in cash, in dirhams or euros, at the end of the tour; a deposit is required for some tours and dates.</p>
            </div>
          </aside>
        </div>
      </section>

      {/* Depuis l'Espagne */}
      <section className="pb-16 lg:pb-24">
        <div className="wrap">
          <SpainNotes
            fit={
              tour.category === 'excursion'
                ? `Fit: at ${tour.duration}, the ${tour.ref} is a full day from Tangier and does not fit between two same-day sailings; combine it with a night in Tangier, or ask us about the earliest crossings.`
                : `Fit: at ${tour.duration}, the ${tour.ref} fits comfortably between a morning crossing and an evening return, with time for lunch.`
            }
          />
        </div>
      </section>

      {/* Galerie */}
      <section className="bg-paper py-16 lg:py-24" aria-label="Gallery">
        <div className="wrap">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-5">
            {tour.gallery.map((img, i) => (
              <SmartImage
                key={img.src}
                image={img}
                className={`reveal-image rounded-2xl ${i === 0 || tour.galleryWide?.includes(img) ? 'col-span-2 aspect-[16/10] md:col-span-2' : 'aspect-[4/5] md:aspect-[4/5]'}`}
                sizes="(min-width: 768px) 33vw, 50vw"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bon à savoir, FAQ et destination */}
      <section className="py-16 lg:py-24">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="reveal">
              <span className="eyebrow mb-4">Practical</span>
              <h2 className="display-md">Practical information for the {tour.ref}</h2>
              <ul className="mt-7 space-y-3">
                {tour.goodToKnow.map((g) => (
                  <li key={g} className="flex items-start gap-3 text-[15px] text-ink-soft">
                    <CheckIcon size={18} className="mt-0.5 shrink-0 text-brass" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-14">
              <Faq items={[...tour.faqs, ...practicalFaq.slice(0, 3).filter((q) => tour.category !== 'excursion' || q !== dirhamsFaq)]} title={`Questions about the ${tour.ref}`} eyebrow="Questions" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="reveal">
              <span className="eyebrow mb-4">Destination</span>
              {tourDestinations.map((d) => (
                <Link key={d.slug} to={`/destinations/${d.slug}/`} className="img-zoom group mt-4 block overflow-hidden rounded-2xl bg-midnight text-ivory">
                  <SmartImage image={d.imageSecondary} className="aspect-[3/2]" imgClassName="opacity-90" sizes="(min-width: 1024px) 40vw, 100vw" />
                  <div className="p-6">
                    <p className="eyebrow-plain text-brass">{d.kicker}</p>
                    <h3 className="mt-1 text-3xl">{d.name}</h3>
                    <span className="link-line mt-3 text-ivory/85">
                      Things to do in {d.name}
                      <ArrowRightIcon size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Expériences liées */}
      {related.length > 0 && (
        <section className="bg-paper py-20 lg:py-28" aria-labelledby="related-title">
          <div className="wrap">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="reveal">
                <span className="eyebrow mb-4">Keep exploring</span>
                <h2 id="related-title" className="display-md">
                  You may also like
                </h2>
              </div>
              <Link to="/tours/" className="link-line reveal text-ink">
                All tours
                <ArrowRightIcon size={15} />
              </Link>
            </div>
            <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2">
              {related.map((t, i) => (
                <TourCard key={t.slug} tour={t} layout="landscape" index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand eyebrow="Ready?" title={<>Let us plan your <em className="font-display-italic">{tour.ref}</em>.</>} />
    </>
  )
}
