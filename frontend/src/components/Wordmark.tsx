import { siteConfig } from '../data/site'

type WordmarkProps = {
  tone?: 'ink' | 'ivory'
  size?: 'sm' | 'md' | 'lg'
}

/** Logo horizontal officiel (symbole étoile + nom), détouré depuis le fichier du client : public/images/brand/. */
const LOGO = { width: 619, height: 160 }
const src = (tone: 'navy' | 'ivory', ext: 'webp' | 'png') => `/images/brand/logo-horizontal-${tone}.${ext}`

// En-tête (sm) : 44 px sur mobile, 48 px sur ordinateur, pour que « TOURS » reste lisible.
const heights = { sm: 'h-11 lg:h-12', md: 'h-14', lg: 'h-16' }

/**
 * Les deux versions (bleu nuit et ivoire) sont dans la page : l'en-tête passe de l'une à l'autre au défilement
 * sans attendre de téléchargement.
 */
export function Wordmark({ tone = 'ink', size = 'md' }: WordmarkProps) {
  const name = siteConfig.brand.name
  return (
    <span className={`inline-block ${heights[size]}`} style={{ aspectRatio: `${LOGO.width} / ${LOGO.height}` }}>
      {(['navy', 'ivory'] as const).map((t) => {
        const visible = (t === 'ivory') === (tone === 'ivory')
        return (
          <picture key={t} className={visible ? 'contents' : 'hidden'}>
            <source type="image/webp" srcSet={src(t, 'webp')} />
            <img
              src={src(t, 'png')}
              alt={visible ? name : ''}
              width={LOGO.width}
              height={LOGO.height}
              decoding="async"
              className="h-full w-auto"
            />
          </picture>
        )
      })}
    </span>
  )
}
