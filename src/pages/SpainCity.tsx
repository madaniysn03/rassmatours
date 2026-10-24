import { Link, useParams } from 'react-router'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Button } from '../components/Button'
import { SmartImage } from '../components/SmartImage'
import { TourCard } from '../components/TourCard'
import { Faq } from '../components/Faq'
import { CtaBand } from '../components/CtaBand'
import { ArrowRightIcon, WhatsAppIcon } from '../components/Icons'
import { getSpainCity, spainCities } from '../data/spain'
import { tours } from '../data/tours'
import { siteConfig } from '../data/site'
import { useHead } from '../lib/head'
import { whatsappLink } from '../lib/contact-links'
import { NotFound } from './NotFound'

export function SpainCity() {
  const { slug = '' } = useParams()
  const city = getSpainCity(slug)
  if (!city || !city.hasPage) return <NotFound />
  return <SpainCityPage city={city} />
}

function SpainCityPage({ city: c }: { city: NonNullable<ReturnType<typeof getSpainCity>> }) {
  const path = `/day-trips-from-spain/${c.slug}/`
  const fitTours = ['tangier-walking-tour', 'cap-spartel-hercules-caves', 'tangier-food-tour'].map((s) => tours.find((t) => t.slug === s)!)
  const others = spainCities.filter((o) => o.hasPage && o.slug !== c.slug)
  const message = `Hello Rassma Tours, I am planning a Tangier day trip from ${c.name}. Could you help me with the sailings and a private tour?`

  useHead({
    title: c.seo.title,
    description: c.seo.description,
    path,
    image: c.image,
    preload: { image: c.image },
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Day trips from Spain', path: '/day-trips-from-spain/' },
      { name: c.name, path },
    ],
  })

  return (
    <>
      <section className="relative flex min-h-[62svh] items-end overflow-hidden bg-midnight-deep text-ivory lg:min-h-[70svh]">
        <SmartImage image={c.image} priority fill sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-deep/90 via-midnight-deep/35 to-midnight-deep/25" />
        <div className="wrap relative pb-14 pt-44 lg:pb-20">
          <div className="enter" style={{ '--enter-delay': '60ms' } as React.CSSProperties}>
            <Breadcrumbs tone="ivory" items={[{ label: 'Home', to: '/' }, { label: 'Day trips from Spain', to: '/day-trips-from-spain/' }, { label: c.name }]} />
          </div>
          <span className="enter eyebrow mt-8 mb-5" style={{ '--enter-delay': '140ms' } as React.CSSProperties}>
            {c.kind === 'direct-ferry' ? 'Direct ferry to the city' : 'Ferry to Tanger Med, then the city'}
          </span>
          <h1 className="enter display-lg max-w-3xl" style={{ '--enter-delay': '220ms' } as React.CSSProperties}>
            Tangier day trip from {c.name}
          </h1>
          <p className="enter mt-5 max-w-xl text-lg text-ivory/85 sm:text-xl" style={{ fontWeight: 300, '--enter-delay': '300ms' } as React.CSSProperties}>
            {c.summary}
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="reveal">
              <span className="eyebrow mb-4">Step by step</span>
              <h2 className="display-sm">From {c.name} to the medina and back</h2>
              <ol className="mt-8 space-y-7 border-l border-line pl-8">
                {c.logistics.map((step, i) => (
                  <li key={step} className="relative">
                    <span className="absolute -left-[2.45rem] top-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-ivory font-display text-sm text-brass ring-1 ring-line">
                      {i + 1}
                    </span>
                    <p className="text-[15px] leading-relaxed text-ink-soft" style={{ fontWeight: 300 }}>
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-[15px] text-ink" style={{ fontWeight: 300 }}>
                {c.verdict}
              </p>
            </div>

            <div className="reveal mt-14">
              <span className="eyebrow mb-4">What our part includes</span>
              <h2 className="display-sm">A private guide from the port to the port</h2>
              <ul className="mt-6 space-y-3 text-[15px] text-ink-soft">
                <li>Private local guide for your group only, in English, French, Spanish or Arabic.</li>
                <li>Meeting at the ferry terminal exit and return to the terminal for your sailing.</li>
                <li>Help choosing sailings and buying ferry tickets if you wish, and port accompaniment.</li>
                <li>Private air-conditioned vehicle on tours that leave the old town (Cap Spartel, Caves of Hercules).</li>
              </ul>
              <p className="note mt-5">The ferry ticket, entrance fees, meals and gratuities are not part of the tour unless your quote says so. Prices are confirmed with your quote; payment in cash on the day.</p>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="reveal sticky top-28 rounded-3xl bg-paper p-7 shadow-card sm:p-9">
              <span className="eyebrow mb-4">At a glance</span>
              <dl className="space-y-4">
                {c.timing.map((t) => (
                  <div key={t.label}>
                    <dt className="eyebrow-plain text-ink-mute">{t.label}</dt>
                    <dd className="mt-1 font-display text-xl">{t.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-7 flex flex-col gap-3">
                <Button to={`/contact/?tour=${encodeURIComponent(`Day trip from ${c.name}`)}`} variant="midnight" size="lg" data-cta={`spain_${c.slug}_request`}>
                  Request a quote
                </Button>
                <Button href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" variant="outline" size="lg">
                  <WhatsAppIcon size={16} />
                  Ask on WhatsApp
                </Button>
              </div>
              <p className="note mt-5">{siteConfig.contact.responseTime} Durations are approximate; ferry schedules change by season.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-paper py-16 lg:py-24" aria-labelledby="fit-title">
        <div className="wrap">
          <div className="reveal">
            <span className="eyebrow mb-4">Tours that fit</span>
            <h2 id="fit-title" className="display-md">
              What to do in Tangier from {c.name}
            </h2>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {fitTours.map((t, i) => (
              <TourCard key={t.slug} tour={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Faq items={c.faqs} title={`Questions about the day trip from ${c.name}`} eyebrow="Good to know" />
          </div>
          <div className="lg:col-span-5">
            <div className="reveal space-y-3">
              <span className="eyebrow mb-4">Also from Spain</span>
              {others.map((o) => (
                <Link key={o.slug} to={`/day-trips-from-spain/${o.slug}/`} className="group flex items-center justify-between gap-4 rounded-2xl bg-sand/70 px-5 py-4 transition-colors hover:bg-sand">
                  <span className="font-display text-xl">Tangier day trip from {o.name}</span>
                  <ArrowRightIcon size={18} className="shrink-0 text-brass transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
              <Link to="/day-trips-from-spain/" className="group flex items-center justify-between gap-4 rounded-2xl bg-sand/70 px-5 py-4 transition-colors hover:bg-sand">
                <span className="font-display text-xl">Marbella, Malaga, Seville and the ferry guide</span>
                <ArrowRightIcon size={18} className="shrink-0 text-brass transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/tangier-ferry-guide/" className="group flex items-center justify-between gap-4 rounded-2xl bg-sand/70 px-5 py-4 transition-colors hover:bg-sand">
                <span className="font-display text-xl">Tangier ferry guide</span>
                <ArrowRightIcon size={18} className="shrink-0 text-brass transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand eyebrow="Plan your crossing" title={<>Tell us your sailings from {c.name}. <em className="font-display-italic">We will be at the port.</em></>} />
    </>
  )
}
