import { Link } from 'react-router'
import type { Tour } from '../data/tours'
import { SmartImage } from './SmartImage'
import { ArrowRightIcon, ClockIcon } from './Icons'

type TourCardProps = {
  tour: Tour
  /** Format portrait pour les grilles éditoriales, paysage pour les listes. */
  layout?: 'portrait' | 'landscape'
  /** Décalage d’animation pour les grilles (ms). */
  index?: number
}

export function TourCard({ tour, layout = 'portrait', index = 0 }: TourCardProps) {
  const href = `/tours/${tour.slug}/`
  const image = layout === 'portrait' ? tour.imagePortrait : tour.image
  const ratio = layout === 'portrait' ? 'aspect-[4/5]' : 'aspect-[3/2]'
  const category = tour.category === 'tangier' ? 'In Tangier' : 'Day trip'

  return (
    <article
      className="reveal group relative flex flex-col"
      style={{ animationDelay: `${index * 60}ms` } as React.CSSProperties}
    >
      <Link to={href} className="img-zoom block overflow-hidden rounded-2xl" tabIndex={-1} aria-hidden>
        <SmartImage image={image} className={ratio} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
      </Link>
      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-brass">
          <span>{category}</span>
          <span className="h-px w-5 bg-brass/60" />
          <span className="inline-flex items-center gap-1.5 text-ink-mute">
            <ClockIcon size={14} />
            {tour.duration}
          </span>
        </div>
        <h3 className="mt-3 text-2xl leading-tight sm:text-[1.7rem]">
          <Link to={href} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
            {tour.headline}
          </Link>
        </h3>
        <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft" style={{ fontWeight: 300 }}>
          {tour.teaser}
        </p>
        <span className="link-line mt-5 text-ink group-hover:after:scale-x-100">
          See the {tour.ref}
          <ArrowRightIcon size={15} />
        </span>
      </div>
    </article>
  )
}
