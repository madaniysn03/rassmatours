import type { ReactNode } from 'react'
import type { ImageAsset } from '../data/images'
import { SmartImage } from './SmartImage'

type PageHeroProps = {
  image: ImageAsset
  /** Cadrage portrait pour les telephones. */
  imagePortrait?: ImageAsset
  eyebrow?: string
  title: ReactNode
  text?: ReactNode
  children?: ReactNode
  /** Hauteur : `tall` pour la page d’accueil, `short` pour les pages intérieures. */
  height?: 'tall' | 'medium' | 'short'
  align?: 'left' | 'center'
}

/** Visuel d’ouverture plein cadre, sombre vers le bas pour la lisibilité du texte. */
export function PageHero({ image, imagePortrait, eyebrow, title, text, children, height = 'medium', align = 'left' }: PageHeroProps) {
  const h =
    height === 'tall'
      ? 'min-h-[100svh]'
      : height === 'short'
        ? 'min-h-[52svh] lg:min-h-[58svh]'
        : 'min-h-[68svh] lg:min-h-[74svh]'
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start'

  return (
    <section className={`relative flex ${h} items-end overflow-hidden bg-midnight-deep text-ivory`}>
      <SmartImage image={image} portrait={imagePortrait} priority fill imgClassName="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-midnight-deep/90 via-midnight-deep/35 to-midnight-deep/20" />
      <div className={`wrap relative flex flex-col ${alignClass} pb-16 pt-40 sm:pb-20 lg:pb-24`}>
        {eyebrow && (
          <span className="enter eyebrow mb-6 !text-brass" style={{ '--enter-delay': '80ms' } as React.CSSProperties}>
            {eyebrow}
          </span>
        )}
        <h1 className={`enter max-w-4xl ${height === 'tall' ? 'display-xl' : 'display-lg'}`} style={{ '--enter-delay': '160ms' } as React.CSSProperties}>
          {title}
        </h1>
        {text && (
          <p
            className="enter mt-6 max-w-xl text-lg leading-relaxed text-ivory/85 sm:text-xl"
            style={{ fontWeight: 300, '--enter-delay': '280ms' } as React.CSSProperties}
          >
            {text}
          </p>
        )}
        {children && (
          <div className="enter mt-9 flex flex-wrap gap-3" style={{ '--enter-delay': '400ms' } as React.CSSProperties}>
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
