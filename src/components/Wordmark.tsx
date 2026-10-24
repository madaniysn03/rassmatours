import { siteConfig } from '../data/site'

type WordmarkProps = {
  tone?: 'ink' | 'ivory'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Wordmark typographique provisoire : un petit monogramme (soleil sur le détroit)
 * et le nom en capitales serif. Remplacé par `brand.logo` si le client fournit un fichier.
 */
export function Wordmark({ tone = 'ink', size = 'md' }: WordmarkProps) {
  const { brand } = siteConfig
  const color = tone === 'ivory' ? 'text-ivory' : 'text-midnight'
  const accent = 'text-brass'
  const textSize = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-[1.35rem]' : 'text-2xl'

  if (brand.logo) {
    return <img src={brand.logo} alt={brand.name} className={size === 'lg' ? 'h-12' : 'h-9'} />
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${color}`}>
      <svg width={size === 'lg' ? 34 : 26} height={size === 'lg' ? 34 : 26} viewBox="0 0 32 32" aria-hidden className="shrink-0">
        <circle cx="16" cy="13.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" className={accent} />
        <path d="M5 23h22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 27.5h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className={accent} opacity=".8" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`font-display font-semibold uppercase tracking-[0.14em] ${textSize}`}>Rassma</span>
        <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.42em] opacity-80">Tours</span>
      </span>
    </span>
  )
}
