import { Link } from 'react-router'
import { ArrowRightIcon, CheckIcon } from './Icons'

type SpainNotesProps = {
  /** Phrase propre au tour (durée, compatibilité avec une traversée). */
  fit: string
}

/**
 * Bloc « depuis l’Espagne » des fiches tours : répond aux questions des visiteurs qui traversent
 * pour la journée, avec les faits vérifiés (accueil au port, aide aux billets) et sans horaires ni prix.
 */
export function SpainNotes({ fit }: SpainNotesProps) {
  const points = [
    'Start: at the exit of the Tangier Ville port, where the Tarifa ferry docks, or at Tanger Med with a transfer if you cross from Algeciras.',
    'Ferry: the Tarifa crossing takes about an hour and lands in the city centre. Tickets are bought from the ferry company; we help you choose sailings and buy them if you wish.',
    fit,
    'Documents: a valid passport is required to enter Morocco; check the rules for your nationality.',
    'Return: tell us your sailing and we bring you back to the terminal with a margin.',
  ]
  return (
    <div className="reveal rounded-3xl border border-line p-7 sm:p-9">
      <span className="eyebrow mb-4">Coming from Spain for the day</span>
      <h2 className="display-sm">Doing this tour as a Tangier day trip from Spain</h2>
      <ul className="mt-6 space-y-3">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-3 text-[15px] text-ink-soft">
            <CheckIcon size={18} className="mt-0.5 shrink-0 text-brass" />
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
        <Link to="/day-trips-from-spain/" className="link-line text-ink">
          Tangier day trips from Spain
          <ArrowRightIcon size={14} />
        </Link>
        <Link to="/tangier-ferry-guide/" className="link-line text-ink">
          Ferry guide
          <ArrowRightIcon size={14} />
        </Link>
      </div>
    </div>
  )
}
