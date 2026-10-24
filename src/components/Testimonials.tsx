import { siteConfig } from '../data/site'
import { testimonials } from '../data/testimonials'
import { ArrowUpRightIcon } from './Icons'

/**
 * Témoignages repris du site existant (à faire confirmer par le client).
 * Sans témoignage, la section affiche un emplacement propre.
 */
export function Testimonials() {
  return (
    <section className="bg-sand/60 py-24 lg:py-32" aria-labelledby="testimonials-title">
      <div className="wrap">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="eyebrow mb-5">Travellers’ words</span>
          <h2 id="testimonials-title" className="display-md">
            What our guests remember
          </h2>
        </div>

        {testimonials.length === 0 ? (
          <p className="mx-auto mt-12 max-w-md rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-mute">
            Guest reviews will appear here.
          </p>
        ) : (
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <li
                key={t.name}
                className="reveal flex flex-col rounded-2xl bg-paper p-8 shadow-card"
                style={{ animationDelay: `${i * 70}ms` } as React.CSSProperties}
              >
                <span className="font-display text-6xl leading-none text-brass" aria-hidden>
                  “
                </span>
                <blockquote className="-mt-4 flex-1 font-display text-[1.35rem] leading-snug text-ink">{t.quote}</blockquote>
                <footer className="mt-6 text-[12px] font-medium uppercase tracking-[0.18em] text-ink-mute">
                  {t.name} · {t.origin}
                </footer>
              </li>
            ))}
          </ul>
        )}

        <p className="reveal mt-10 text-center">
          <a href={siteConfig.tripadvisorUrl} target="_blank" rel="noopener noreferrer" className="link-line text-ink">
            Read reviews on TripAdvisor
            <ArrowUpRightIcon size={14} />
          </a>
        </p>
      </div>
    </section>
  )
}
