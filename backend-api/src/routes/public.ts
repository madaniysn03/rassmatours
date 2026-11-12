/**
 * Routes publiques :
 * - POST /api/inquiry              demande du formulaire de contact (champ piège `company`, limite par IP)
 * - GET  /api/gallery              galerie de la page Tours (items vides : le site garde sa galerie par défaut)
 * - GET  /api/gallery-image/:key   photo envoyée depuis l'admin
 */
import { Hono, type Context } from 'hono'
import { getConnInfo } from '@hono/node-server/conninfo'
import { config } from '../config.ts'
import { gallery, messages, newId, type StoredInquiry } from '../storage.ts'

const LIMITS: Record<string, number> = { name: 120, email: 200, phone: 40, tour: 200, date: 20, travelers: 4, message: 2000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WINDOW_MS = 10 * 60_000

// Limite simple en mémoire (un seul processus) : n envois par IP et par tranche de 10 minutes.
const hits = new Map<string, number[]>()
function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= config.inquiryRateLimit) return true
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k)
  return false
}

export function clientIp(c: Context) {
  if (config.trustProxy) {
    const forwarded = c.req.header('x-forwarded-for')?.split(',')[0].trim()
    if (forwarded) return forwarded
  }
  return getConnInfo(c).remote.address ?? 'unknown'
}

export const publicRoutes = new Hono()

publicRoutes.post('/inquiry', async (c) => {
  if (Number(c.req.header('content-length') ?? 0) > 20_000) return c.json({ error: 'Too large' }, 413)
  let body: Record<string, unknown>
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400)
  }
  // Champ piège rempli : un robot. Réponse positive, rien n'est enregistré.
  if (typeof body.company === 'string' && body.company.trim()) return c.json({ ok: true })
  if (rateLimited(clientIp(c))) return c.json({ error: 'Too many requests, please try again later or write to us on WhatsApp.' }, 429)

  const field = (k: string) => (typeof body[k] === 'string' ? (body[k] as string).trim() : '')
  const v = Object.fromEntries(Object.keys(LIMITS).map((k) => [k, field(k)])) as Record<string, string>
  for (const [k, max] of Object.entries(LIMITS)) if (v[k].length > max) return c.json({ error: `Field ${k} is too long` }, 400)
  if (v.name.length < 2 || !EMAIL_RE.test(v.email)) return c.json({ error: 'Name and a valid email are required' }, 400)

  const inquiry: StoredInquiry = {
    id: newId(),
    createdAt: new Date().toISOString(),
    read: false,
    name: v.name,
    email: v.email,
    phone: v.phone,
    tour: v.tour,
    date: v.date,
    travelers: v.travelers,
    message: v.message,
  }
  await messages.save(inquiry)
  return c.json({ ok: true }, 201)
})

publicRoutes.get('/gallery', async (c) => {
  const manifest = await gallery.readManifest()
  c.header('Cache-Control', 'public, max-age=60')
  return c.json(manifest ?? { version: 1, updatedAt: null, items: [] })
})

publicRoutes.get('/gallery-image/:key', async (c) => {
  const image = await gallery.getImage(c.req.param('key'))
  if (!image) return c.json({ error: 'Not found' }, 404)
  return c.body(new Uint8Array(image.data), 200, {
    'Content-Type': image.contentType,
    // Chaque envoi reçoit un identifiant neuf : le fichier ne change jamais à cette adresse.
    'Cache-Control': 'public, max-age=31536000, immutable',
  })
})
