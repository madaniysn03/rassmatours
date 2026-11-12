import { Link } from 'react-router'
import { PageHero } from '../components/PageHero'
import { SectionHeading } from '../components/SectionHeading'
import { Faq } from '../components/Faq'
import { CtaBand } from '../components/CtaBand'
import { Button } from '../components/Button'
import { ArrowRightIcon } from '../components/Icons'
import { images } from '../data/images'
import { ferryGuide, spainCities } from '../data/spain'
import { useHead } from '../lib/head'

export function FerryGuide() {
  useHead({
    title: 'Tangier Day Trip with Ferry: Routes & Tips',
    description:
      'Tangier day trip with ferry: Tarifa to Tangier Ville or Algeciras to Tanger Med, which port is which, passport and timing tips, and where we meet you.',
    path: '/tangier-ferry-guide/',
    image: images.marinaSunset,
    preload: { image: images.marinaSunset },
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Day trips from Spain', path: '/day-trips-from-spain/' },
      { name: 'Ferry guide', path: '/tangier-ferry-guide/' },
    ],
  })

  return (
    <>
      <PageHero
        image={images.marinaSunset}
        eyebrow="Ferry guide"
        height="short"
        title={
          <>
            Tangier day trip with ferry, <em className="font-display-italic">explained</em>
          </>
        }
        text="Which crossing to take, which port you land in, what to carry, and what happens when the ferry docks."
      />

      <section className="py-20 lg:py-28" aria-labelledby="routes-title">
        <div className="wrap">
          <SectionHeading eyebrow="The crossings" title={<span id="routes-title">Two ferry routes from Spain to Tangier</span>} text="The names look similar; the arrival ports are not. For a day trip, the port matters more than the company." />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {ferryGuide.routes.map((r, i) => (
              <div key={r.name} className="reveal rounded-2xl bg-paper p-7 ring-1 ring-line" style={{ animationDelay: `${i * 70}ms` } as React.CSSProperties}>
                <h3 className="text-3xl">{r.name}</h3>
                <dl className="mt-5 space-y-4">
                  <div>
                    <dt className="eyebrow-plain text-ink-mute">Crossing</dt>
                    <dd className="mt-1 text-[15px] text-ink-soft">{r.crossing}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow-plain text-ink-mute">Arrives</dt>
                    <dd className="mt-1 text-[15px] text-ink-soft">{r.arrives}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow-plain text-ink-mute">Best for</dt>
                    <dd className="mt-1 text-[15px] text-ink-soft">{r.bestFor}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
          <p className="note mt-6">Crossing times are approximate and depend on the vessel and the sea. Timetables and fares are set by the ferry companies and change by season; we check them with you when you book.</p>
        </div>
      </section>

      <section className="bg-paper py-20 lg:py-28" aria-labelledby="check-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Before you board" title={<span id="check-title">The Tangier ferry checklist</span>} text="Five things that decide whether a day trip is relaxed or rushed." />
            <div className="reveal mt-8 flex flex-wrap gap-3">
              <Button to="/day-trips-from-spain/" variant="midnight">
                Day trips by departure city
              </Button>
            </div>
          </div>
          <ol className="lg:col-span-7">
            {ferryGuide.checklist.map((item, i) => (
              <li key={item.title} className="reveal grid gap-2 border-t border-line py-6 sm:grid-cols-5 sm:gap-6">
                <div className="sm:col-span-2">
                  <span className="font-display text-sm text-brass">0{i + 1}</span>
                  <h3 className="mt-1 text-2xl">{item.title}</h3>
                </div>
                <p className="text-[15px] leading-relaxed text-ink-soft sm:col-span-3" style={{ fontWeight: 300 }}>
                  {item.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20 lg:py-28" aria-labelledby="arrival-title">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="When the ferry docks"
              title={<span id="arrival-title">What happens at the port in Tangier</span>}
              text="Passport control, a short walk through the terminal, and your guide at the exit. From the Tangier Ville port the medina is a few minutes away on foot; from Tanger Med a private transfer brings you into the city."
            />
            <div className="prose-editorial reveal mt-8">
              <p>
                The day then runs like any of our private tours: the medina and the Kasbah on foot, or the car out to Cap Spartel and the Caves of Hercules, lunch where locals eat, and the walk back to the terminal in time for your sailing. Nothing is shared with other groups, and the pace is yours.
              </p>
            </div>
            <ul className="reveal mt-8 space-y-3">
              {spainCities.filter((c) => c.hasPage).map((c) => (
                <li key={c.slug}>
                  <Link to={`/day-trips-from-spain/${c.slug}/`} className="link-line text-ink">
                    Tangier day trip from {c.name}
                    <ArrowRightIcon size={14} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <Faq items={ferryGuide.faqs} title="Ferry questions" eyebrow="Questions" />
          </div>
        </div>
      </section>

      <CtaBand eyebrow="Plan your crossing" title={<>Send us your sailings. <em className="font-display-italic">We will be at the port.</em></>} />
    </>
  )
}
