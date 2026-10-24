import { useId, useState, type FormEvent } from 'react'
import { tours } from '../data/tours'
import { siteConfig } from '../data/site'
import { mailtoLink, whatsappLink } from '../lib/contact-links'
import {
  emptyInquiry,
  formatInquiry,
  inquiryEndpoint,
  submitInquiry,
  validateInquiry,
  type InquiryErrors,
  type InquiryValues,
} from '../lib/inquiry'
import { Button } from './Button'
import { trackEvent } from '../lib/analytics'
import { CheckIcon, MailIcon, WhatsAppIcon } from './Icons'

type Status = 'idle' | 'sending' | 'sent' | 'ready' | 'error'

type InquiryFormProps = {
  /** Pré-sélectionne une expérience (depuis une fiche). */
  defaultTour?: string
}

/**
 * Formulaire de demande.
 * - Avec VITE_INQUIRY_ENDPOINT : envoi HTTP, confirmation à l’écran.
 * - Sans : le message est préparé et l’utilisateur l’envoie en un clic via WhatsApp ou e-mail.
 */
export function InquiryForm({ defaultTour = '' }: InquiryFormProps) {
  const id = useId()
  const [values, setValues] = useState<InquiryValues>({ ...emptyInquiry, tour: defaultTour })
  const [errors, setErrors] = useState<InquiryErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [touched, setTouched] = useState(false)

  const update = (field: keyof InquiryValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: e.target.value }
    setValues(next)
    if (touched) setErrors(validateInquiry(next))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    const nextErrors = validateInquiry(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(`${id}-${Object.keys(nextErrors)[0]}`)?.focus()
      return
    }
    // Champ piège rempli : un robot. On simule un succès silencieux.
    if (values.company) {
      setStatus('sent')
      return
    }
    if (!inquiryEndpoint) {
      setStatus('ready')
      return
    }
    setStatus('sending')
    try {
      await submitInquiry(values)
      trackEvent('generate_lead', { method: 'form', tour: values.tour || 'undecided' })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const message = formatInquiry(values)
  const subject = `Trip inquiry: ${values.tour || 'Tangier'}`

  if (status === 'sent') {
    return (
      <div className="rounded-3xl bg-paper p-8 shadow-card sm:p-10" role="status" aria-live="polite">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-clay-soft text-clay">
          <CheckIcon size={22} />
        </span>
        <h2 className="mt-5 display-sm">Thank you, {values.name.trim().split(' ')[0]}.</h2>
        <p className="mt-3 text-ink-soft" style={{ fontWeight: 300 }}>
          Your request has been sent. {siteConfig.contact.responseTime} If it is urgent, message us on WhatsApp.
        </p>
        <div className="mt-6">
          <Button href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" variant="outline">
            <WhatsAppIcon size={16} />
            WhatsApp
          </Button>
        </div>
      </div>
    )
  }

  if (status === 'ready') {
    return (
      <div className="rounded-3xl bg-paper p-8 shadow-card sm:p-10" role="status" aria-live="polite">
        <span className="eyebrow mb-4">One last step</span>
        <h2 className="display-sm">Your request is ready, {values.name.trim().split(' ')[0]}.</h2>
        <p className="mt-3 text-ink-soft" style={{ fontWeight: 300 }}>
          Send it the way you prefer. The message below is already written for you; {siteConfig.contact.responseTime.toLowerCase()}
        </p>
        <pre className="mt-6 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-ivory p-5 font-sans text-[14px] leading-relaxed text-ink-soft">
          {message}
        </pre>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" variant="midnight" data-cta="inquiry_whatsapp">
            <WhatsAppIcon size={16} />
            Send via WhatsApp
          </Button>
          <Button href={mailtoLink(subject, message)} variant="outline" data-cta="inquiry_email">
            <MailIcon size={16} />
            Send by email
          </Button>
        </div>
        <button type="button" onClick={() => setStatus('idle')} className="link-line mt-6 text-ink-mute">
          Edit my request
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-3xl bg-paper p-6 shadow-card sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${id}-name`} label="Your name" error={errors.name} required>
          <input id={`${id}-name`} className="field" autoComplete="name" value={values.name} onChange={update('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-error` : undefined} />
        </Field>
        <Field id={`${id}-email`} label="Email" error={errors.email} required>
          <input id={`${id}-email`} className="field" type="email" autoComplete="email" inputMode="email" value={values.email} onChange={update('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id}-email-error` : undefined} />
        </Field>
        <Field id={`${id}-phone`} label="Phone or WhatsApp" hint="Optional, with country code" error={errors.phone}>
          <input id={`${id}-phone`} className="field" type="tel" autoComplete="tel" inputMode="tel" placeholder="+34 …" value={values.phone} onChange={update('phone')} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${id}-phone-error` : undefined} />
        </Field>
        <Field id={`${id}-tour`} label="Experience">
          <select id={`${id}-tour`} className="field" value={values.tour} onChange={update('tour')}>
            <option value="">Not decided yet</option>
            {tours.map((t) => (
              <option key={t.slug} value={t.name}>
                {t.name}
              </option>
            ))}
            <option value="Tailor-made itinerary">Tailor-made itinerary</option>
            <option value="Transfer or multi-day circuit">Transfer or multi-day circuit</option>
          </select>
        </Field>
        <Field id={`${id}-date`} label="Travel date" hint="Optional" error={errors.date}>
          <input id={`${id}-date`} className="field" type="date" value={values.date} onChange={update('date')} aria-invalid={!!errors.date} aria-describedby={errors.date ? `${id}-date-error` : undefined} />
        </Field>
        <Field id={`${id}-travelers`} label="Number of travellers" error={errors.travelers} required>
          <input id={`${id}-travelers`} className="field" type="number" min={1} max={60} inputMode="numeric" value={values.travelers} onChange={update('travelers')} aria-invalid={!!errors.travelers} aria-describedby={errors.travelers ? `${id}-travelers-error` : undefined} />
        </Field>
        <div className="sm:col-span-2">
          <Field id={`${id}-message`} label="Anything we should know?" hint="Interests, pace, arrival by ferry or cruise, dietary needs…" error={errors.message}>
            <textarea id={`${id}-message`} className="field min-h-32" rows={4} value={values.message} onChange={update('message')} aria-invalid={!!errors.message} aria-describedby={errors.message ? `${id}-message-error` : undefined} />
          </Field>
        </div>
        {/* Champ piège, invisible pour les humains. */}
        <div className="hidden" aria-hidden>
          <label htmlFor={`${id}-company`}>Company</label>
          <input id={`${id}-company`} tabIndex={-1} autoComplete="off" value={values.company} onChange={update('company')} />
        </div>
      </div>

      {status === 'error' && (
        <p className="mt-5 rounded-xl bg-clay-soft px-4 py-3 text-sm text-clay-deep" role="alert">
          We could not send your request. Please try again, or send it directly on{' '}
          <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="underline">
            WhatsApp
          </a>{' '}
          or{' '}
          <a href={mailtoLink(subject, message)} className="underline">
            by email
          </a>
          .
        </p>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" variant="midnight" size="lg" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : inquiryEndpoint ? 'Send my request' : 'Prepare my request'}
        </Button>
        <p className="note max-w-xs">
          No account, no payment online. {siteConfig.contact.responseTime}
        </p>
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {required && <span className="text-clay"> *</span>}
        {hint && <span className="ml-2 font-normal text-ink-mute">{hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] text-clay-deep">
          {error}
        </p>
      )}
    </div>
  )
}
