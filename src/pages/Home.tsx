import { Link } from 'react-router'
import { Button } from '../components/Button'
import { PageHero } from '../components/PageHero'
import { SectionHeading } from '../components/SectionHeading'
import { SmartImage } from '../components/SmartImage'
import { TourCard } from '../components/TourCard'
import { DestinationTile } from '../components/DestinationTile'
import { Testimonials } from '../components/Testimonials'
import { CtaBand } from '../components/CtaBand'
import { ScrollVideo } from '../components/ScrollVideo'
import { spainCities } from '../data/spain'
import { ArrowRightIcon, CarIcon, LanguageIcon, PinIcon, UsersIcon } from '../components/Icons'
import { images } from '../data/images'
import { tours } from '../data/tours'
import { destinations } from '../data/destinations'
import { siteConfig } from '../data/site'
import { useHead } from '../lib/head'

const featured = ['cap-spartel-hercules-caves', 'tangier-walking-tour', 'chefchaouen-day-trip']
  .map((slug) => tours.find((t) => t.slug === slug)!)

/** Atouts réels de l’agence, tels que publiés sur le site existant. */
const pillars = [
  {
    icon: PinIcon,
    title: 'Local guides',
    text: 'Our guides are from Tangier. They know every corner and every story of the city and its region, and they share it as hosts, not as readers of a script.',
  },
  {
    icon: UsersIcon,
    title: 'Private and personal',
    text: 'Every tour is private: only you and your group take part. The pace, the stops and the detours are tailored to your interests.',
  },
  {
    icon: LanguageIcon,
    title: 'Your language',
    text: 'Our guides speak English, French, Spanish and Arabic, so nothing gets lost between the place and you.',
  },
  {
    icon: CarIcon,
    title: 'Comfort and safety',
    text: 'Private, modern, air-conditioned vehicles with accredited guides and drivers. Your comfort and safety come first.',
  },
]

export function Home() {
  useHead({
    title: 'Tangier Day Trips from Spain & Private Tours',
    description:
      'Tangier day trips from Spain and private tours with local guides: we meet you at the ferry port for the medina, Cap Spartel, a food tour, Asilah or Chefchaouen.',
    path: '/',
    image: images.heroTangierBay,
    preload: { image: images.heroTangierBay, portrait: images.heroTangierBayPortrait },
  })

  return (
    <>
      <PageHero
        image={images.heroTangierBay}
        imagePortrait={images.heroTangierBayPortrait}
        eyebrow={`${siteConfig.brand.tagline} · ${siteConfig.contact.city}, ${siteConfig.contact.country}`}
        height="tall"
        title={
          <>
            Enjoy Tangier and Morocco in a <em className="font-display-italic">relaxed</em>, easy and comfortable way.
          </>
        }
        text="Rassma Tours is a local tour company based in Tangier, Morocco. We’ll provide you with the best possible service and tours. Our guides are attentively selected, our transport is modern and air conditioned, our drivers are caring and professional and, most importantly, our tours are 100% stress free."
      >
        <Button to="/tours/" variant="light" size="lg" data-cta="hero_explore_tours">
          Explore our tours
          <ArrowRightIcon size={16} />
        </Button>
        <Button to="/contact/" variant="outline-light" size="lg" data-cta="hero_plan_trip">
          Plan your experience
        </Button>
      </PageHero>

      {/* Introduction */}
      <section className="py-24 lg:py-32" aria-labelledby="intro-title">
        <div className="wrap grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="Rassma Tours"
              as="h2"
              title={
                <span id="intro-title">
                  A city is best discovered with someone who calls it <em className="font-display-italic">home.</em>
                </span>
              }
            />
            <div className="prose-editorial reveal mt-8 max-w-xl">
              <p>
                Tangier is far more enjoyable when you have some professionals on the ground paying attention to the very
                small details that make your experience in Morocco truly exceptional. At Rassma Tours, your comfort is our joy.
              </p>
              <p>
                Every tour we run is private. You travel with your own guide and your own driver, in your language, at the
                pace that suits you. If you have a few hours between two ferries or a full week, we build the days around you.
              </p>
            </div>
            <div className="reveal mt-9 flex flex-wrap items-center gap-6">
              <Button to="/about/" variant="outline">
                About us
              </Button>
              <Link to="/tours/" className="link-line text-ink">
                Our tours
                <ArrowRightIcon size={15} />
              </Link>
            </div>
          </div>
          <div className="relative lg:col-span-6">
            <SmartImage image={images.kasbahOverPort} className="reveal-image aspect-[4/5] rounded-2xl lg:ml-12" sizes="(min-width: 1024px) 45vw, 100vw" />
            <SmartImage
              image={images.mintTea}
              className="reveal-image absolute -bottom-8 left-0 hidden w-2/5 rounded-2xl shadow-card ring-8 ring-ivory sm:block lg:-left-2"
              style={{ aspectRatio: '3 / 2' }}
              sizes="20vw"
            />
          </div>
        </div>
      </section>

      {/* Expériences phares */}
      <section className="bg-paper py-24 lg:py-32" aria-labelledby="featured-title">
        <div className="wrap">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Experiences"
              title={<span id="featured-title">Private tours and day trips from Tangier</span>}
              text="Walking tours, landmarks, food and two day trips along the coast and into the mountains. All private, all led by local guides."
            />
            <Link to="/tours/" className="link-line reveal shrink-0 text-ink">
              View all tours
              <ArrowRightIcon size={15} />
            </Link>
          </div>
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((tour, i) => (
              <TourCard key={tour.slug} tour={tour} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi nous */}
      <section className="bg-midnight py-24 text-ivory lg:py-32" aria-labelledby="why-title">
        <div className="wrap">
          <SectionHeading
            eyebrow="Rassma Tours"
            tone="ivory"
            align="center"
            title={<span id="why-title">Why travel with us</span>}
            text="Our tours are 100% stress free, carefully designed to suit your wishes, preferences and time constraints. Our transportation is modern and air-conditioned, driven by professional drivers, and our guides are fully accredited by the Ministry of Tourism, knowledgeable and highly skilled."
          />
          <ul className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {pillars.map((p, i) => (
              <li key={p.title} className="reveal border-t border-ivory/15 pt-7" style={{ animationDelay: `${i * 70}ms` } as React.CSSProperties}>
                <p.icon size={24} className="text-brass" />
                <h3 className="mt-5 text-2xl">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ivory/75" style={{ fontWeight: 300 }}>
                  {p.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Depuis l’Espagne : objectif commercial principal */}
      <section className="py-24 lg:py-32" aria-labelledby="spain-title">
        <div className="wrap">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Coming from Spain"
              title={
                <span id="spain-title">
                  A Tangier day trip from Spain, <em className="font-display-italic">met at the port</em>
                </span>
              }
              text="Cross from Tarifa in about an hour, or from Algeciras via Tanger Med. Your private guide waits at the exit of the terminal, and the day is planned around your sailings."
            />
            <Link to="/day-trips-from-spain/" className="link-line reveal shrink-0 text-ink">
              How it works from each city
              <ArrowRightIcon size={15} />
            </Link>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {spainCities
              .filter((c) => c.hasPage)
              .map((c, i) => (
                <Link
                  key={c.slug}
                  to={`/day-trips-from-spain/${c.slug}/`}
                  className="reveal img-zoom group block overflow-hidden rounded-2xl bg-paper ring-1 ring-line transition-colors hover:bg-sand/60"
                  style={{ animationDelay: `${i * 70}ms` } as React.CSSProperties}
                >
                  <SmartImage image={c.image} className="aspect-[16/10]" sizes="(min-width: 768px) 33vw, 100vw" />
                  <div className="p-6">
                    <span className="eyebrow-plain text-brass">{c.timing[0].value}</span>
                    <h3 className="mt-2 text-2xl">Tangier day trip from {c.name}</h3>
                    <span className="link-line mt-4 text-ink">
                      Step by step
                      <ArrowRightIcon size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            <Link
              to="/tangier-ferry-guide/"
              className="reveal flex flex-col justify-between rounded-2xl bg-midnight p-6 text-ivory transition-colors hover:bg-midnight-deep"
              style={{ animationDelay: '140ms' } as React.CSSProperties}
            >
              <div>
                <span className="eyebrow-plain text-brass">Ferry guide</span>
                <h3 className="mt-2 text-2xl">Tangier day trip with ferry: routes, ports and tips</h3>
                <p className="mt-3 text-[15px] text-ivory/75" style={{ fontWeight: 300 }}>
                  Tarifa or Algeciras, Tangier Ville or Tanger Med, passport and timing, and what happens when the ferry docks. Also Marbella, Malaga and Seville.
                </p>
              </div>
              <span className="link-line mt-6 text-ivory/85">
                Read the guide
                <ArrowRightIcon size={14} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Vidéo pilotée par le défilement : survol de la médina jusqu’à la baie */}
      <ScrollVideo
        src="/video/tangier-medina-drone-1280.mp4"
        srcNarrow="/video/tangier-medina-drone-768.mp4"
        poster="/images/video/tangier-medina-drone-poster.jpg"
        label="Aerial video of the Tangier medina rising to reveal the bay, played as you scroll"
        credit="Video: Muhamed Abghour, Pexels"
        captions={[
          {
            eyebrow: 'Tangier from above',
            title: 'The Kasbah walls',
            text: 'The old fortifications still hold the top of the hill, with the governor’s palace and the terraces our walking tour climbs to.',
          },
          {
            eyebrow: 'Tangier from above',
            title: 'Rooftops of the medina',
            text: 'White cubes, painted terraces and lanes you cannot see from the street: this is the maze a local guide reads for you.',
          },
          {
            eyebrow: 'Tangier from above',
            title: 'The bay and the strait',
            text: 'Fourteen kilometres of water to Spain. Ferries from Tarifa arrive here, and most of our tours start a few steps away.',
          },
        ]}
      />

      {/* Découvrir Tanger */}
      <section className="py-24 lg:py-32" aria-labelledby="tangier-title">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Discover Tangier"
                title={
                  <span id="tangier-title">
                    Where Africa looks at <em className="font-display-italic">Europe</em>
                  </span>
                }
              />
              <div className="prose-editorial reveal mt-8">
                <p>
                  Fourteen kilometres of water separate Tangier from Spain, and on a clear day you can see the other shore
                  from the Kasbah. The city has been Phoenician, Roman, Portuguese and British, and for half of the twentieth
                  century an International Zone that drew writers, painters and anyone who wanted to disappear for a while.
                </p>
                <p>
                  Today the medina still slopes from the Grand Socco to the port, the fishermen still land their catch each
                  morning, and the coast runs west to Cap Spartel, where the Mediterranean meets the Atlantic, and to the
                  Caves of Hercules.
                </p>
              </div>
              <ul className="reveal mt-8 grid gap-3 text-[15px] sm:grid-cols-2">
                {['The medina and the Petit Socco', 'The Kasbah and its terraces', 'The Grand Socco and the Cinema Rif', 'Cap Spartel and the Caves of Hercules'].map((place) => (
                  <li key={place} className="flex items-start gap-3 text-ink-soft">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                    {place}
                  </li>
                ))}
              </ul>
              <div className="reveal mt-9">
                <Button to="/destinations/" variant="midnight">
                  Explore the destinations
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:col-span-7 lg:gap-5">
              <SmartImage image={images.medinaRooftopsDusk} className="reveal-image col-span-2 aspect-[16/10] rounded-2xl" sizes="(min-width: 1024px) 55vw, 100vw" />
              <SmartImage image={images.cinemaRif} className="reveal-image aspect-[4/3] rounded-2xl" sizes="(min-width: 1024px) 27vw, 50vw" />
              <SmartImage image={images.herculesCavesWindow} className="reveal-image aspect-[4/3] rounded-2xl" sizes="(min-width: 1024px) 27vw, 50vw" />
            </div>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="bg-paper py-24 lg:py-32" aria-labelledby="destinations-title">
        <div className="wrap">
          <SectionHeading
            eyebrow="Destinations"
            align="center"
            title={<span id="destinations-title">Tangier, Asilah and Chefchaouen</span>}
            text="The city on the strait, the white town on the Atlantic and the blue town in the mountains."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {destinations.map((d, i) => (
              <DestinationTile key={d.slug} destination={d} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Sur mesure */}
      <section className="py-24 lg:py-32" aria-labelledby="custom-title">
        <div className="wrap grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="order-2 lg:order-1 lg:col-span-6">
            <SmartImage image={images.camelsBeach} className="reveal-image aspect-[4/3] rounded-2xl" sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
          <div className="order-1 lg:order-2 lg:col-span-6 lg:pl-8">
            <SectionHeading
              eyebrow="Tailor-made"
              title={
                <span id="custom-title">
                  Customised Tangier tours, <em className="font-display-italic">your way</em>
                </span>
              }
              text="Can’t find exactly what you are looking for? We build customised tours around your interests and your schedule."
            />
            <ul className="reveal mt-8 space-y-4">
              {[
                ['Tailor-made itineraries', 'A few hours or several days, in Tangier or beyond.'],
                ['Transfers and multi-day circuits', 'Private transport to Fes, Casablanca, Rabat or Marrakech, and longer journeys across Morocco.'],
                ['Arriving from Spain', 'Help with ferry tickets and port accompaniment for a day trip from Tarifa or Algeciras; see our guide to Tangier day trips from Spain.'],
              ].map(([title, text]) => (
                <li key={title} className="border-l-2 border-brass pl-5">
                  <h3 className="text-xl">{title}</h3>
                  <p className="mt-1 text-[15px] text-ink-soft" style={{ fontWeight: 300 }}>
                    {text}
                  </p>
                </li>
              ))}
            </ul>
            <div className="reveal mt-9">
              <Button to="/contact/" variant="primary" data-cta="request_custom_tour">
                Request a custom tour
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
      <CtaBand />
    </>
  )
}
