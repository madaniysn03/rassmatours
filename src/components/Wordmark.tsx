import { brandSymbol } from '../data/brand-symbol'
import { siteConfig } from '../data/site'

type WordmarkProps = {
  tone?: 'ink' | 'ivory'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Logo horizontal : le symbole « Le Détroit » (étoile marocaine fendue par le
 * détroit, soleil laiton) et le nom en capitales serif. Fichiers de référence
 * dans public/images/brand/. Remplacé par `brand.logo` si un fichier est fourni.
 */
export function Wordmark({ tone = 'ink', size = 'md' }: WordmarkProps) {
  const { brand } = siteConfig
  const color = tone === 'ivory' ? 'text-ivory' : 'text-midnight'
  const textSize = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-[1.35rem]' : 'text-2xl'
  // En-tête (sm) : même encombrement que l'ancien monogramme, la navigation tient sur une ligne dès 1024 px.
  const symbolSize = size === 'lg' ? 40 : size === 'sm' ? 28 : 34

  if (brand.logo) {
    return <img src={brand.logo} alt={brand.name} className={size === 'lg' ? 'h-12' : 'h-9'} />
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${color}`}>
      <svg width={symbolSize} height={symbolSize} viewBox="0 0 100 100" aria-hidden className="shrink-0">
        <path d={brandSymbol.star} fill="currentColor" fillRule="evenodd" />
        <circle cx={brandSymbol.sun.cx} cy={brandSymbol.sun.cy} r={brandSymbol.sun.r} className="fill-brass" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`font-display font-semibold uppercase tracking-[0.14em] ${textSize}`}>Rassma</span>
        <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.42em] opacity-80">Tours</span>
      </span>
    </span>
  )
}
