/**
 * POST /api/inquiry : enregistre une demande du formulaire de contact (Netlify Blobs, magasin « inquiries »).
 * Lisible ensuite dans /admin/. Champ piège `company` rempli : réponse positive sans enregistrement.
 */
import type { Config } from '@netlify/functions'
import { error, json, messagesStore, newId } from '../lib/server'

export type StoredInquiry = {
  id: string
  createdAt: string
  read: boolean
  name: string
  email: string
  phone: string
  tour: string
  date: string
  travelers: string
  message: string
}

const LIMITS: Record<string, number> = { name: 120, email: 200, phone: 40, tour: 200, date: 20, travelers: 4, message: 2000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async (req: Request) => {
  if (req.method !== 'POST') return error(405, 'Method not allowed')
  if ((req.headers.get('content-length') ? Number(req.headers.get('content-length')) : 0) > 20_000) return error(413, 'Too large')

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return error(400, 'Invalid JSON')
  }
  if (typeof body.company === 'string' && body.company.trim()) return json({ ok: true })

  const field = (k: string) => (typeof body[k] === 'string' ? (body[k] as string).trim() : '')
  const values = Object.fromEntries(Object.keys(LIMITS).map((k) => [k, field(k)])) as Record<string, string>
  for (const [k, max] of Object.entries(LIMITS)) if (values[k].length > max) return error(400, `Field ${k} is too long`)
  if (values.name.length < 2 || !EMAIL_RE.test(values.email)) return error(400, 'Name and a valid email are required')

  const inquiry: StoredInquiry = {
    id: newId(),
    createdAt: new Date().toISOString(),
    read: false,
    name: values.name,
    email: values.email,
    phone: values.phone,
    tour: values.tour,
    date: values.date,
    travelers: values.travelers,
    message: values.message,
  }
  await messagesStore().setJSON(`msg/${inquiry.id}`, inquiry)
  return json({ ok: true }, 201)
}

export const config: Config = { path: '/api/inquiry' }
