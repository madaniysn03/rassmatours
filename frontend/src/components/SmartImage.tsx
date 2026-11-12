import { useState, type CSSProperties } from 'react'
import type { ImageAsset } from '../data/images'
import { srcSetFor } from '../lib/images'

type SmartImageProps = {
  image: ImageAsset | null
  /** Classes du conteneur (ratio, arrondi…). */
  className?: string
  style?: CSSProperties
  imgClassName?: string
  /** Image prioritaire (hero) : chargement immédiat, priorité haute, pas de lazy-loading. */
  priority?: boolean
  sizes?: string
  /** Remplace le texte alternatif du catalogue si le contexte l’exige ; `""` pour une image décorative. */
  alt?: string
  /** Libellé du repli quand l’image manque. */
  fallbackLabel?: string
  /** Remplit son parent positionné (visuel d’arrière-plan). */
  fill?: boolean
  /** Variante portrait servie aux écrans étroits (direction artistique mobile). */
  portrait?: ImageAsset | null
}

const PORTRAIT_MEDIA = '(max-width: 767px) and (orientation: portrait)'

/**
 * Image responsive : WebP avec repli JPEG, srcset 600/900/1400 px et maitre, dimensions explicites (pas de décalage
 * de mise en page), lazy-loading hors hero. Si l’image manque ou échoue, un motif sable prend la place.
 */
export function SmartImage({
  image,
  className = '',
  style,
  imgClassName = '',
  priority = false,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  alt,
  fallbackLabel = 'Photo to come',
  fill = false,
  portrait = null,
}: SmartImageProps) {
  const [failed, setFailed] = useState(false)
  const showFallback = !image || failed

  return (
    <div className={`${fill ? 'absolute inset-0' : 'relative'} overflow-hidden bg-sand ${className}`} style={style}>
      {showFallback ? (
        <div role="img" aria-label={alt ?? image?.alt ?? fallbackLabel} className="pattern-lines absolute inset-0 flex items-end p-4">
          <span className="rounded-full bg-paper/85 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-ink-soft">
            {fallbackLabel}
          </span>
        </div>
      ) : (
        <picture>
          {portrait && <source media={PORTRAIT_MEDIA} type="image/webp" srcSet={srcSetFor(portrait, 'webp')} sizes="100vw" />}
          {portrait && <source media={PORTRAIT_MEDIA} srcSet={srcSetFor(portrait, 'jpg')} sizes="100vw" />}
          <source type="image/webp" srcSet={srcSetFor(image, 'webp')} sizes={sizes} />
          <img
            src={image.src}
            srcSet={srcSetFor(image, 'jpg')}
            sizes={sizes}
            alt={alt ?? image.alt}
            width={image.width}
            height={image.height}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority ? 'high' : 'auto'}
            onError={() => setFailed(true)}
            className={`h-full w-full object-cover ${imgClassName}`}
          />
        </picture>
      )}
    </div>
  )
}
