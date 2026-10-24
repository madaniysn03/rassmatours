import { Link, useParams } from 'react-router'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Button } from '../components/Button'
import { SmartImage } from '../components/SmartImage'
import { TourCard } from '../components/TourCard'
import { Faq } from '../components/Faq'
import { CtaBand } from '../components/CtaBand'
import { ArrowRightIcon } from '../components/Icons'
import { destinations, getDestination } from '../data/destinations'
import { tours } from '../data/tours'
import { absoluteUrl, useHead } from '../lib/head'
import { NotFound } from './NotFound'

export function DestinationDetail() {
  const { slug = '' } = useParams()
  const destination = getDestination(slug)
  if (!destination) return <NotFound />
  return <DestinationPage destination={destination} />
}

function DestinationPage({ destination: d }: { destination: NonNullable<ReturnType<typeof getDestination>> }) {
  const path = `/destinations/${d.slug}/`
  const dTours = d.tourSlugs.map((s) => tours.find((t) => t.slug === s)).filter((t): t is NonNullable<typeof t> => !!t)
  const others = destinations.filter((o) => o.slug !== d.slug)

  useHead({
    title: d.seo.title,
    description: d.seo.description,
    path,
    image: d.imageSecondary,
    preload: { image: d.imageSecondary },
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Destinations', path: '/destinations/' },
      { name: d.name, path },
    ],
    jsonLd: [
      {
        '@type': 'TouristDestination',
        '@id': `${absoluteUrl(path)}#destination`,
        name: d.name,
        description: d.intro,
        url: absoluteUrl(path),
        image: absoluteUrl(d.imageSecondary.src),
        containedInPlace: { '@type': 'Country', name: 'Morocco' },
        includesAttraction: d.places.map((p) => ({ '@type': 'TouristAttraction', name: p.name, description: p.text })),
      },
    ],
  })

  return (
    <>
      <section className="relative flex min-h-[62svh] items-end overflow-hidden bg-midnight-deep text-ivory lg:min-h-[70svh]">
        <SmartImage image={d.imageSecondary} priority fill sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-deep/90 via-midnight-deep/35 to-midnight-deep/25" />
        <div className="wrap relative pb-14 pt-44 lg:pb-20">
          <div className="enter" style={{ '--enter-delay': '60ms' } as React.CSSProperties}>
            <Breadcrumbs tone="ivory" items={[{ label: 'Home', to: '/' }, { label: 'Destinations', to: '/destinations/' }, { label: d.name }]} />
          </div>
          <span className="enter eyebrow mt-8 mb-5" style={{ '--enter-delay': '140ms' } as React.CSSProperties}>
            {d.kicker}
          </span>
          <h1 className="enter display-lg max-w-3xl" style={{ '--enter-delay': '220ms' } as React.CSSProperties}>
            {d.h1}
          </h1>
          <p className="enter mt-5 max-w-xl text-lg text-ivory/85 sm:text-xl" style={{ fontWeight: 300, '--enter-delay': '300ms' } as React.CSSProperties}>
            {d.intro}
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="prose-editorial reveal">
              {d.paragraphs.map((p) => (
                <p key={p.slice(0, 30)}>{p}</p>
              ))}
            </div>

            <div className="reveal mt-14">
              <span className="eyebrow mb-4">What to see</span>
              <h2 className="display-sm">What to see in {d.name}</h2>
              <dl className="mt-7 divide-y divide-line border-y border-line">
                {d.places.map((pl) => (
                  <div key={pl.name} className="grid gap-1 py-4 sm:grid-cols-5 sm:gap-6">
                    <dt className="font-display text-xl sm:col-span-2">{pl.name}</dt>
                    <dd className="text-[14px] leading-relaxed text-ink-soft sm:col-span-3" style={{ fontWeight: 300 }}>
                      {pl.text}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="reveal mt-14">
              <span className="eyebrow mb-4">Practical</span>
              <h2 className="display-sm">Planning a visit to {d.name}</h2>
              <dl className="mt-7 grid gap-6 sm:grid-cols-2">
                {d.practical.map((p) => (
                  <div key={p.label} className="border-t border-line pt-4">
                    <dt className="font-display text-xl">{p.label}</dt>
                    <dd className="mt-1.5 text-[14px] leading-relaxed text-ink-soft" style={{ fontWeight: 300 }}>
                      {p.text}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="reveal sticky top-28">
              <SmartImage image={d.image} className="aspect-[4/5] rounded-2xl" sizes="(min-width: 1024px) 40vw, 100vw" />
              <div className="mt-6 rounded-3xl bg-paper p-7 shadow-card">
                <span className="eyebrow mb-3">Our tours in {d.name}</span>
                <ul className="mt-2 space-y-3">
                  {dTours.map((t) => (
                    <li key={t.slug}>
                      <Link to={`/tours/${t.slug}/`} className="group flex items-center justify-between gap-4 rounded-2xl bg-sand/70 px-5 py-4 transition-colors hover:bg-sand">
                        <span>
                          <span className="block font-display text-xl">{t.name}</span>
                          <span className="mt-0.5 block text-[12px] uppercase tracking-[0.16em] text-ink-mute">{t.duration}</span>
                        </span>
                        <ArrowRightIcon size={18} className="shrink-0 text-brass transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <Button to="/contact/" variant="midnight" data-cta="plan_trip_destination">
                    Plan a day in {d.name}
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-paper py-16 lg:py-24">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Faq items={d.faqs} title={`Questions about ${d.name}`} eyebrow="Good to know" />
          </div>
          <div className="lg:col-span-5">
            <div className="reveal">
              <span className="eyebrow mb-4">Other destinations</span>
              <ul className="mt-2 space-y-3">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link to={`/destinations/${o.slug}/`} className="img-zoom group flex items-center gap-4 rounded-2xl bg-ivory p-3 ring-1 ring-line transition-colors hover:bg-sand/60">
                      <SmartImage image={o.image} className="h-20 w-20 shrink-0 rounded-xl" sizes="80px" />
                      <span>
                        <span className="eyebrow-plain block text-ink-mute">{o.kicker}</span>
                        <span className="block font-display text-2xl">{o.name}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {dTours.length > 1 && (
        <section className="py-16 lg:py-24" aria-labelledby="tours-title">
          <div className="wrap">
            <div className="reveal">
              <span className="eyebrow mb-4">Experiences</span>
              <h2 id="tours-title" className="display-md">
                Private tours in {d.name}
              </h2>
            </div>
            <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {dTours.map((t, i) => (
                <TourCard key={t.slug} tour={t} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand eyebrow="Plan your trip" title={<>A day in {d.name}, <em className="font-display-italic">your way.</em></>} />
    </>
  )
}
