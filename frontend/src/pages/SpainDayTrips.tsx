import { Link } from 'react-router'
import { PageHero } from '../components/PageHero'
import { SectionHeading } from '../components/SectionHeading'
import { SmartImage } from '../components/SmartImage'
import { TourCard } from '../components/TourCard'
import { Faq } from '../components/Faq'
import { CtaBand } from '../components/CtaBand'
import { Button } from '../components/Button'
import { ArrowRightIcon, CheckIcon } from '../components/Icons'
import { images } from '../data/images'
import { spainCities, ferryGuide } from '../data/spain'
import { tours } from '../data/tours'
import { useHead } from '../lib/head'

const dayTripTours = ['tangier-walking-tour', 'cap-spartel-hercules-caves', 'tangier-food-tour'].map((s) => tours.find((t) => t.slug === s)!)

export function SpainDayTrips() {
  useHead({
    title: 'Tangier Day Trip from Spain: Ferry & Guide',
    description:
      'Plan a Tangier day trip from Spain: ferries from Tarifa and Algeciras, road times from Marbella, Malaga and Seville, and a private guide waiting at the port.',
    path: '/day-trips-from-spain/',
    image: images.bayFromBeach,
    preload: { image: images.bayFromBeach },
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Day trips from Spain', path: '/day-trips-from-spain/' },
    ],
  })

  const withPage = spainCities.filter((c) => c.hasPage)
  const sections = spainCities.filter((c) => !c.hasPage)

  return (
    <>
      <PageHero
        image={images.bayFromBeach}
        eyebrow="From southern Spain"
        height="short"
        title={
          <>
            Tangier day trip from Spain, <em className="font-display-italic">done properly</em>
          </>
        }
        text="Cross in the morning, meet your private guide at the port, see the medina and the coast, and sail back in the evening. Here is how it works from each city."
      />

      <section className="py-20 lg:py-28" aria-labelledby="how-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="How a day trip works"
              title={<span id="how-title">Fourteen kilometres of water, one day on the other side</span>}
              text="Tangier is the closest point of Africa to Europe. From Tarifa the fast ferry takes about an hour and docks in the city centre, which is what makes a Spain to Tangier day trip realistic."
            />
            <ul className="reveal mt-8 space-y-3">
              {[
                'We meet you at the exit of the port in Tangier: no taxi to find, no office to reach.',
                'Every tour is private and planned around your sailings, in English, French, Spanish or Arabic.',
                'We help you choose the crossings and buy the ferry tickets if you wish, and we walk you back for the return.',
                'Our service starts in Tangier. The Spanish leg, road and ferry, is yours to arrange; this guide tells you how.',
              ].map((p) => (
                <li key={p} className="flex items-start gap-3 text-[15px] text-ink-soft">
                  <CheckIcon size={18} className="mt-0.5 shrink-0 text-brass" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="reveal mt-9 flex flex-wrap gap-3">
              <Button to="/contact/" variant="midnight" data-cta="spain_plan_trip">
                Plan my day trip
              </Button>
              <Button to="/tangier-ferry-guide/" variant="outline">
                Read the ferry guide
              </Button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <SmartImage image={images.kasbahOverPort} className="reveal-image aspect-[4/5] rounded-2xl lg:ml-10" sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
        </div>
      </section>

      <section className="bg-paper py-20 lg:py-28" aria-labelledby="ports-title">
        <div className="wrap">
          <SectionHeading eyebrow="Ferry ports" title={<span id="ports-title">Two ferry routes, two very different arrivals</span>} text="Tarifa lands you in the city; Algeciras lands you at Tanger Med, 45 kilometres away. Each has its own page." />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {withPage.map((c, i) => (
              <Link
                key={c.slug}
                to={`/day-trips-from-spain/${c.slug}/`}
                className="reveal img-zoom group flex flex-col overflow-hidden rounded-2xl bg-ivory ring-1 ring-line transition-colors hover:bg-sand/60"
                style={{ animationDelay: `${i * 70}ms` } as React.CSSProperties}
              >
                <SmartImage image={c.image} className="aspect-[16/9]" sizes="(min-width: 768px) 50vw, 100vw" />
                <div className="p-7">
                  <span className="eyebrow-plain text-brass">{c.kind === 'direct-ferry' ? 'Direct ferry to the city' : 'Ferry to Tanger Med'}</span>
                  <h3 className="mt-2 text-3xl">Tangier day trip from {c.name}</h3>
                  <p className="mt-3 text-[15px] text-ink-soft" style={{ fontWeight: 300 }}>
                    {c.summary}
                  </p>
                  <span className="link-line mt-5 text-ink">
                    From {c.name}, step by step
                    <ArrowRightIcon size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28" aria-labelledby="cities-title">
        <div className="wrap">
          <SectionHeading
            eyebrow="Further along the coast"
            title={<span id="cities-title">From Marbella, Malaga and Seville</span>}
            text="No ferry leaves from these cities: the day trip means driving to Tarifa first. Here is what is realistic from each."
          />
          <div className="mt-12 space-y-12">
            {sections.map((c) => (
              <article key={c.slug} id={c.slug} className="reveal grid gap-8 border-t border-line pt-10 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-7">
                  <h3 className="display-sm">Tangier day trip from {c.name}</h3>
                  <p className="mt-3 text-lg text-ink-soft" style={{ fontWeight: 300 }}>
                    {c.summary}
                  </p>
                  <ol className="mt-6 space-y-3">
                    {c.logistics.map((l, i) => (
                      <li key={l} className="flex items-start gap-3 text-[15px] text-ink-soft">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sand font-display text-sm text-brass">{i + 1}</span>
                        {l}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-5 text-[15px] text-ink" style={{ fontWeight: 300 }}>
                    {c.verdict}
                  </p>
                </div>
                <dl className="grid gap-4 self-start rounded-2xl bg-paper p-6 ring-1 ring-line lg:col-span-5">
                  {c.timing.map((t) => (
                    <div key={t.label}>
                      <dt className="eyebrow-plain text-ink-mute">{t.label}</dt>
                      <dd className="mt-1 font-display text-xl">{t.value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
          <p className="note mt-8">Road times are approximate, by car and outside peak traffic. Ferry schedules change by season: we check them with you when you book.</p>
        </div>
      </section>

      <section className="bg-paper py-20 lg:py-28" aria-labelledby="tours-title">
        <div className="wrap">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="Tours that fit a day trip" title={<span id="tours-title">What to do in Tangier between two sailings</span>} text="Private guided tours that start at the port and end there, timed around your ferry." />
            <Link to="/tours/" className="link-line reveal shrink-0 text-ink">
              All tours
              <ArrowRightIcon size={15} />
            </Link>
          </div>
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {dayTripTours.map((t, i) => (
              <TourCard key={t.slug} tour={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="wrap-narrow">
          <Faq items={ferryGuide.faqs} title="Questions about Tangier day trips from Spain" eyebrow="Before you cross" />
        </div>
      </section>

      <CtaBand eyebrow="Plan your crossing" title={<>Tell us your sailings. <em className="font-display-italic">We will be at the port.</em></>} />
    </>
  )
}
