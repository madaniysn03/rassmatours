const items = [
  'Private tours only',
  'Local guides',
  'Tangier · Asilah · Chefchaouen',
  'English, French, Spanish, Arabic',
  'Tailor-made itineraries',
  'Ferry assistance from Spain',
]

/** Bandeau défilant du pied de page, doublé pour une boucle continue. */
export function Ticker() {
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden border-y border-ivory/10 py-4" aria-hidden>
      <div className="ticker gap-10 px-5 text-[11px] font-medium uppercase tracking-[0.26em] text-ivory/60">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            {item}
            <span className="h-1 w-1 rounded-full bg-brass" />
          </span>
        ))}
      </div>
    </div>
  )
}
