import { images } from '../data/images'
import { whatsappLink } from '../lib/contact-links'
import { Button } from './Button'
import { SmartImage } from './SmartImage'
import { WhatsAppIcon } from './Icons'

type CtaBandProps = {
  eyebrow?: string
  title?: React.ReactNode
  text?: string
}

/** Invitation finale : grand visuel sombre, titre serif, deux actions. */
export function CtaBand({
  eyebrow = 'Plan your trip',
  title = (
    <>
      Tell us when you arrive. <em className="font-display-italic">We will do the rest.</em>
    </>
  ),
  text = 'Share your dates, your interests and the pace you like. We reply within a day with a proposal built around you.',
}: CtaBandProps) {
  return (
    <section className="relative overflow-hidden bg-midnight-deep text-ivory">
      <SmartImage image={images.marinaSunset} fill imgClassName="opacity-55" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-midnight-deep/90 via-midnight-deep/60 to-midnight-deep/30" />
      <div className="wrap relative py-24 lg:py-32">
        <div className="reveal max-w-2xl">
          <span className="eyebrow mb-5">{eyebrow}</span>
          <h2 className="display-lg">{title}</h2>
          <p className="mt-6 max-w-lg text-lg text-ivory/80" style={{ fontWeight: 300 }}>
            {text}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button to="/contact/" variant="light" size="lg" data-cta="band_plan_trip">
              Plan your trip
            </Button>
            <Button href={whatsappLink()} target="_blank" rel="noopener noreferrer" variant="outline-light" size="lg">
              <WhatsAppIcon size={18} />
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
