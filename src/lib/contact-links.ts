import { siteConfig } from '../data/site'

/** Lien WhatsApp avec message pré-rempli (le numéro est celui publié par l’agence). */
export const whatsappLink = (message?: string) => {
  const base = `https://wa.me/${siteConfig.contact.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const telLink = `tel:${siteConfig.contact.phoneE164}`

export const mailtoLink = (subject?: string, body?: string) => {
  const params = new URLSearchParams()
  if (subject) params.set('subject', subject)
  if (body) params.set('body', body)
  const query = params.toString()
  return `mailto:${siteConfig.contact.email}${query ? `?${query}` : ''}`
}

/** Message WhatsApp proposé depuis une fiche expérience. */
export const tourInquiryMessage = (tourName: string) =>
  `Hello Rassma Tours, I would like to know more about the "${tourName}". Could you tell me about availability?`
