import { useEffect, useRef, type CSSProperties } from 'react'
import type { GalleryItem } from '../data/gallery'
import { SmartImage } from './SmartImage'

/** Hauteur maximale d'une vignette (lg), sert au calcul de `sizes`. */
const TILE_MAX_HEIGHT = 320

/**
 * Vidéo muette en boucle : demandée seulement à l'approche, lue quand elle est visible, en pause sinon.
 * Avec « réduire les animations », elle reste sur son affiche et se lance à la demande.
 */
function GalleryVideo({ item, decorative }: { item: Extract<GalleryItem, { kind: 'video' }>; decorative: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.controls = true
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) video.src = item.src
          void video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { rootMargin: '200px' },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [item.src])

  return (
    <video
      ref={ref}
      poster={item.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={decorative ? undefined : item.label}
      aria-hidden={decorative || undefined}
      className="h-full w-full object-cover"
    />
  )
}

function Tile({ item, decorative }: { item: GalleryItem; decorative: boolean }) {
  const { width, height } = item.kind === 'image' ? item.image : item
  const sizes = `${Math.round((TILE_MAX_HEIGHT * width) / height)}px`
  const style = { aspectRatio: `${width} / ${height}` } as CSSProperties
  return (
    <li className="gallery-marquee__tile shrink-0 overflow-hidden rounded-2xl bg-sand" style={style} aria-hidden={decorative || undefined}>
      {item.kind === 'image' ? (
        <SmartImage
          image={item.image}
          alt={decorative ? '' : undefined}
          className="h-full w-full"
          sizes={sizes}
        />
      ) : item.kind === 'upload' ? (
        <img
          src={item.src}
          srcSet={`${item.small} ${Math.round((width * 400) / height)}w, ${item.src} ${width}w`}
          sizes={sizes}
          alt={decorative ? '' : item.alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <GalleryVideo item={item} decorative={decorative} />
      )}
    </li>
  )
}

/**
 * Bandeaux de photos qui défilent en continu, une rangée dans chaque sens. Chaque rangée est doublée pour
 * boucler sans à-coup ; la copie est masquée aux lecteurs d'écran. Pause au survol ; sans animation
 * (préférence système), la rangée devient un simple défilement horizontal.
 */
export function GalleryMarquee({ rows }: { rows: GalleryItem[][] }) {
  return (
    <div className="gallery-marquee flex flex-col gap-4 lg:gap-5">
      {rows.map((row, r) => (
        <div key={r} className="gallery-marquee__row">
          <ul
            className={`gallery-marquee__track ${r % 2 ? 'gallery-marquee__track--reverse' : ''}`}
            style={{ '--marquee-duration': `${row.length * 7}s` } as CSSProperties}
          >
            {row.map((item, i) => (
              <Tile key={`a${i}`} item={item} decorative={false} />
            ))}
            {row.map((item, i) => (
              <Tile key={`b${i}`} item={item} decorative />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
