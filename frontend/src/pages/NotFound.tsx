import { Button } from '../components/Button'
import { SmartImage } from '../components/SmartImage'
import { images } from '../data/images'
import { useHead } from '../lib/head'

export function NotFound() {
  useHead({
    title: 'Page not found',
    description: 'This page does not exist. Find our tours, destinations and contact details from the home page.',
    path: '/404',
    noindex: true,
  })

  return (
    <section className="relative flex min-h-[80svh] items-end overflow-hidden bg-midnight-deep text-ivory">
      <SmartImage image={images.medinaLane} priority fill sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-midnight-deep/90 via-midnight-deep/40 to-midnight-deep/30" />
      <div className="wrap relative pb-20 pt-40">
        <span className="eyebrow mb-5">Error 404</span>
        <h1 className="display-lg max-w-2xl">
          This lane leads <em className="font-display-italic">nowhere</em>
        </h1>
        <p className="mt-5 max-w-md text-lg text-ivory/80" style={{ fontWeight: 300 }}>
          The page you are looking for does not exist or has moved. Let us take you back to the main square.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button to="/" variant="light">
            Back to home
          </Button>
          <Button to="/tours/" variant="outline-light">
            See the tours
          </Button>
        </div>
      </div>
    </section>
  )
}
