import { Link } from 'react-router'
import type { Destination } from '../data/destinations'
import { SmartImage } from './SmartImage'

type DestinationTileProps = {
  destination: Destination
  index?: number
  className?: string
}

/** Tuile destination : image plein cadre, nom en serif, une ligne d’accroche. */
export function DestinationTile({ destination, index = 0, className = '' }: DestinationTileProps) {
  return (
    <Link
      to={`/destinations/${destination.slug}/`}
      className={`reveal img-zoom group relative block overflow-hidden rounded-2xl bg-midnight ${className}`}
      style={{ animationDelay: `${index * 60}ms` } as React.CSSProperties}
    >
      <SmartImage image={destination.image} className="aspect-[4/5] sm:aspect-[3/4]" imgClassName="opacity-95" sizes="(min-width: 1024px) 33vw, 100vw" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight-deep/85 via-midnight-deep/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-ivory sm:p-8">
        <p className="eyebrow-plain text-brass">{destination.kicker}</p>
        <h3 className="mt-2 text-4xl">{destination.name}</h3>
        <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-ivory/80" style={{ fontWeight: 300 }}>
          {destination.intro}
        </p>
      </div>
    </Link>
  )
}
