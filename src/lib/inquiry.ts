/**
 * Formulaire de demande : validation côté client, message pré-rempli pour WhatsApp / e-mail,
 * et envoi optionnel vers un point de terminaison HTTP (VITE_INQUIRY_ENDPOINT).
 */
export type InquiryValues = {
  name: string
  email: string
  phone: string
  tour: string
  date: string
  travelers: string
  message: string
  /** Champ piège anti-robots : doit rester vide. */
  company: string
}

export type InquiryErrors = Partial<Record<keyof InquiryValues, string>>

export const emptyInquiry: InquiryValues = {
  name: '',
  email: '',
  phone: '',
  tour: '',
  date: '',
  travelers: '2',
  message: '',
  company: '',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateInquiry(values: InquiryValues): InquiryErrors {
  const errors: InquiryErrors = {}
  if (values.name.trim().length < 2) errors.name = 'Please tell us your name.'
  if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Please enter a valid email address.'
  if (values.phone.trim() && values.phone.replace(/[^\d+]/g, '').length < 6) {
    errors.phone = 'Please enter a valid phone or WhatsApp number, or leave it blank.'
  }
  if (values.date) {
    const d = new Date(values.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (Number.isNaN(d.getTime()) || d < today) errors.date = 'Please choose a date from today onwards.'
  }
  const n = Number(values.travelers)
  if (!Number.isInteger(n) || n < 1 || n > 60) errors.travelers = 'Please enter a number of travellers between 1 and 60.'
  if (values.message.trim().length > 2000) errors.message = 'Please keep your message under 2000 characters.'
  return errors
}

/** Texte de la demande, utilisé pour WhatsApp, l’e-mail et l’envoi HTTP. */
export function formatInquiry(values: InquiryValues): string {
  const lines = [
    `Hello Rassma Tours, I would like to plan a trip.`,
    ``,
    `Name: ${values.name.trim()}`,
    `Email: ${values.email.trim()}`,
    values.phone.trim() ? `Phone / WhatsApp: ${values.phone.trim()}` : null,
    `Experience: ${values.tour || 'Not decided yet'}`,
    values.date ? `Travel date: ${values.date}` : null,
    `Travellers: ${values.travelers}`,
    values.message.trim() ? `` : null,
    values.message.trim() ? `Requests: ${values.message.trim()}` : null,
  ].filter((l): l is string => l !== null)
  return lines.join('\n')
}

export const inquiryEndpoint = (import.meta.env.VITE_INQUIRY_ENDPOINT as string | undefined) || ''

/** Envoi HTTP si un point de terminaison est configuré. Lève une erreur sinon ou en cas d’échec. */
export async function submitInquiry(values: InquiryValues): Promise<void> {
  if (!inquiryEndpoint) throw new Error('NO_ENDPOINT')
  const response = await fetch(inquiryEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...values, formatted: formatInquiry(values), source: 'rassma-tours-website' }),
  })
  if (!response.ok) throw new Error(`HTTP_${response.status}`)
}
