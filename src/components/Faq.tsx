import type { FaqItem } from '../data/faq'
import { PlusIcon } from './Icons'

type FaqProps = {
  items: FaqItem[]
  title?: string
  eyebrow?: string
}

/** Accordéon natif (details/summary) : accessible, sans JavaScript, texte présent dans le HTML. */
export function Faq({ items, title = 'Good to know', eyebrow = 'Questions' }: FaqProps) {
  return (
    <div className="reveal">
      <span className="eyebrow mb-5">{eyebrow}</span>
      <h2 className="display-md">{title}</h2>
      <div className="mt-8 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <details key={item.question} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-display text-xl text-ink marker:content-none [&::-webkit-details-marker]:hidden">
              <h3 className="text-xl font-medium">{item.question}</h3>
              <PlusIcon className="shrink-0 text-brass transition-transform duration-300 group-open:rotate-45" />
            </summary>
            <p className="pb-6 text-[15px] leading-relaxed text-ink-soft" style={{ fontWeight: 300 }}>
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  )
}
