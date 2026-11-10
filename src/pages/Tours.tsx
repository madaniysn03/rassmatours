import { useEffect, useState } from 'react'
import { PageHero } from '../components/PageHero'
import { TourCard } from '../components/TourCard'
import { SectionHeading } from '../components/SectionHeading'
import { Faq } from '../components/Faq'
import { CtaBand } from '../components/CtaBand'
import { Button } from '../components/Button'
import { GalleryMarquee } from '../components/GalleryMarquee'
import { galleryRows } from '../data/gallery'
import { rowsFromManifest, type GalleryManifest } from '../lib/gallery-manifest'
import { images } from '../data/images'
import { additionalServices, tours, type TourCategory } from '../data/tours'
import { practicalFaq } from '../data/faq'
import { useHead } from '../lib/head'

type Filter = 'all' | TourCategory

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All tours' },
  { value: 'tangier', label: 'In Tangier' },
  { value: 'excursion', label: 'Day trips' },
]

export function Tours() {
  useHead({
    title: 'Tangier Tours & Day Trips with a Local Guide',
    description:
      'Tangier tours and day trips, all private and led by local guides: medina walking tour, Cap Spartel and Caves of Hercules, food tour, Asilah, Chefchaouen.',
    path: '/tours/',
    image: images.grandSoccoGate,
    preload: { image: images.grandSoccoGate },
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Tours', path: '/tours/' },
    ],
  })
  const [filter, setFilter] = useState<Filter>('all')
  // Galerie : version du dépôt au prérendu, puis celle de l’admin (Netlify Blobs) une fois chargée.
  const [gallery, setGallery] = useState(galleryRows)
  useEffect(() => {
    let cancelled = false
    fetch('/api/gallery', { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok && r.headers.get('content-type')?.includes('json') ? (r.json() as Promise<GalleryManifest>) : null))
      .then((m) => {
        if (!cancelled && m?.items?.length) setGallery(rowsFromManifest(m))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])
  const visible = filter === 'all' ? tours : tours.filter((t) => t.category === filter)

  return (
    <>
      <PageHero
        image={images.grandSoccoGate}
        eyebrow="Tours and day trips"
        height="short"
        title={
          <>
            Tangier tours and day trips, <em className="font-display-italic">days worth remembering</em>
          </>
        }
        text="Five private guided tours and day trips from Tangier, each led by a local guide and shaped around you."
      />

      <section className="py-20 lg:py-28" aria-labelledby="list-title">
        <div className="wrap">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Our tours"
              size="md"
              title={<span id="list-title">Guided tours in Tangier and excursions from the city</span>}
              text="Durations are indicative and adapt to your pace. All tours are private: only you and your group take part."
            />
            <div className="reveal flex flex-wrap gap-2" role="group" aria-label="Filter tours">
              {filters.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={filter === f.value}
                  onClick={() => setFilter(f.value)}
                  className={`h-10 rounded-full px-5 text-[12px] font-medium uppercase tracking-[0.16em] ring-1 transition-colors ${
                    filter === f.value ? 'bg-midnight text-ivory ring-midnight' : 'bg-transparent text-ink ring-ink/25 hover:bg-ink/5'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <p className="sr-only" aria-live="polite">
            {visible.length} tours shown
          </p>

          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((tour, i) => (
              <TourCard key={tour.slug} tour={tour} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-paper py-20 lg:py-28" aria-labelledby="gallery-title">
        <div className="wrap">
          <SectionHeading
            eyebrow="Gallery"
            size="md"
            title={
              <span id="gallery-title">
                Moments from our tours, <em className="font-display-italic">shared by our guests</em>
              </span>
            }
            text="Camel rides on the Atlantic, mint tea above the sea, the ramparts of Asilah and the workshops of the medina: a few days with our guests, as they lived them."
          />
        </div>
        <div className="mt-12">
          <GalleryMarquee rows={gallery} />
        </div>
      </section>

      <section className="bg-midnight py-20 text-ivory lg:py-28" aria-labelledby="services-title">
        <div className="wrap">
          <SectionHeading
            eyebrow="Beyond the tours"
            tone="ivory"
            size="md"
            title={<span id="services-title">Tailor-made Tangier tours and private excursions</span>}
            text="Can’t find what you are looking for? We also arrange tailor-made days, transfers and longer journeys. Tell us what you have in mind."
          />
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {additionalServices.map((s, i) => (
              <li key={s.title} className="reveal border-t border-ivory/15 pt-6" style={{ animationDelay: `${i * 70}ms` } as React.CSSProperties}>
                <h3 className="text-2xl">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ivory/75" style={{ fontWeight: 300 }}>
                  {s.text}
                </p>
              </li>
            ))}
          </ul>
          <div className="reveal mt-12">
            <Button to="/contact/" variant="light" data-cta="request_custom_tour">
              Request a custom tour
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="wrap-narrow">
          <Faq items={practicalFaq} title="Before you book" />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
