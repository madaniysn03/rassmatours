import { whatsappLink } from '../lib/contact-links'
import { WhatsAppIcon } from './Icons'

/** Bouton WhatsApp flottant, discret, pensé pour le mobile. */
export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message us on WhatsApp"
      className="fixed right-4 bottom-4 z-40 inline-flex h-13 w-13 items-center justify-center rounded-full bg-midnight text-ivory shadow-float ring-1 ring-ivory/20 transition-transform hover:scale-105 motion-reduce:transition-none sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon size={22} />
    </a>
  )
}
