import { Link } from 'react-router'
import { PageHero } from '../components/PageHero'
import { DestinationTile } from '../components/DestinationTile'
import { SectionHeading } from '../components/SectionHeading'
import { CtaBand } from '../components/CtaBand'
import { Button } from '../components/Button'
import { ArrowRightIcon, ClockIcon } from '../components/Icons'
import { images } from '../data/images'
import { destinations } from '../data/destinations'
import { tours } from '../data/tours'
import { useHead } from '../lib/head'

export function Destinations() {
  useHead({
    title: 'Day Trip Destinations from Tangier',
    description:
      'Day trip destinations from Tangier: the city and its coast, the white town of Asilah on the Atlantic, and Chefchaouen, blue city of the Rif Mountains.',
    path: '/destinations/',
    image: images.capSpartelSunset,
    preload: { image: images.capSpartelSunset },
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Destinations', path: '/destinations/' },
    ],
  })

  return (
    <>
      <PageHero
        image={images.capSpartelSunset}
        eyebrow="Destinations"
        height="short"
        title={
          <>
            Day trip destinations from Tangier, <em className="font-display-italic">up close</em>
          </>
        }
        text="Three places within a day of each other, each with its own light and tempo. Our tours start in Tangier and reach the coast and the mountains."
      />

      <section className="py-20 lg:py-28" aria-labelledby="dest-title">
        <div className="wrap">
          <SectionHeading
            eyebrow="Where we take you"
            title={<span id="dest-title">Tangier, Asilah and Chefchaouen</span>}
            text="The city on the strait, the white town on the Atlantic and the blue town in the mountains. Each page tells you what to see, how to get there and which of our tours goes."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {destinations.map((d, i) => (
              <DestinationTile key={d.slug} destination={d} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-20 lg:py-28" aria-labelledby="bydest-title">
        <div className="wrap">
          <SectionHeading eyebrow="Tours by destination" size="md" title={<span id="bydest-title">Day trips and tours by destination</span>} />
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {destinations.map((d) => {
              const dTours = d.tourSlugs.map((s) => tours.find((t) => t.slug === s)).filter((t): t is NonNullable<typeof t> => !!t)
              return (
                <div key={d.slug} className="reveal">
                  <h3 className="text-3xl">
                    <Link to={`/destinations/${d.slug}/`} className="hover:underline hover:underline-offset-4">
                      {d.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-[14px] text-ink-mute">{d.kicker}</p>
                  <ul className="mt-5 space-y-3">
                    {dTours.map((t) => (
                      <li key={t.slug}>
                        <Link to={`/tours/${t.slug}/`} className="group flex items-center justify-between gap-4 rounded-2xl bg-sand/70 px-5 py-4 transition-colors hover:bg-sand">
                          <span>
                            <span className="block font-display text-xl">{t.name}</span>
                            <span className="mt-0.5 inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.16em] text-ink-mute">
                              <ClockIcon size={13} /> {t.duration}
                            </span>
                          </span>
                          <ArrowRightIcon size={18} className="shrink-0 text-brass transition-transform group-hover:translate-x-1" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-midnight py-20 text-ivory lg:py-24">
        <div className="wrap grid items-center gap-10 lg:grid-cols-12">
          <div className="reveal lg:col-span-8">
            <span className="eyebrow mb-4">Further afield</span>
            <h2 className="display-md">Fes, Casablanca, Rabat, Marrakech</h2>
            <p className="mt-4 max-w-2xl text-lg text-ivory/75" style={{ fontWeight: 300 }}>
              We arrange private transfers between Tangier and Morocco’s other cities, and personalised multi-day circuits for travellers who want to go further.
            </p>
          </div>
          <div className="reveal lg:col-span-4 lg:text-right">
            <Button to="/contact/" variant="light" data-cta="plan_longer_journey">
              Plan a longer journey
            </Button>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
