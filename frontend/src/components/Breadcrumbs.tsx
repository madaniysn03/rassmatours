import { Link } from 'react-router'

type Crumb = { label: string; to?: string }

export function Breadcrumbs({ items, tone = 'ink' }: { items: Crumb[]; tone?: 'ink' | 'ivory' }) {
  const color = tone === 'ivory' ? 'text-ivory/70' : 'text-ink-mute'
  return (
    <nav aria-label="Breadcrumb" className={`text-[11px] font-medium uppercase tracking-[0.2em] ${color}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {item.to ? (
              <Link to={item.to} className="hover:underline hover:underline-offset-4">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
