/**
 * Outils communs aux Netlify Functions : réponses JSON, session admin signée, stockage Netlify Blobs.
 *
 * Variables d'environnement (Netlify > Site configuration > Environment variables) :
 * - ADMIN_PASSWORD (obligatoire) : mot de passe de /admin/.
 * - ADMIN_SESSION_SECRET (recommandé) : clé de signature des sessions ; à défaut, dérivée du mot de passe.
 */
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { getStore } from '@netlify/blobs'
import { defaultManifest, type GalleryManifest } from '../../src/lib/gallery-manifest'

export const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  })

export const error = (status: number, message: string) => json({ error: message }, status)

/** Segment après `prefix` dans le chemin (ex. /api/admin/messages/<id>), sans dépendre de context.params. */
export const pathParam = (req: Request, prefix: string) => {
  const path = new URL(req.url).pathname.replace(/\/+$/, '')
  return path.startsWith(`${prefix}/`) ? decodeURIComponent(path.slice(prefix.length + 1)) : ''
}

export const newId = () => `${Date.now().toString(36)}-${randomBytes(4).toString('hex')}`

const env = (key: string) => process.env[key] ?? ''

// --- Session admin -------------------------------------------------------------------------------

const COOKIE = 'rt_admin'
const SESSION_HOURS = 12

const secret = () => {
  const s = env('ADMIN_SESSION_SECRET') || env('ADMIN_PASSWORD')
  return createHash('sha256').update(`rassma-admin:${s}`).digest()
}
const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url')

const safeEqual = (a: string, b: string) => {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export const adminConfigured = () => env('ADMIN_PASSWORD').length >= 8

export const checkPassword = (password: string) => adminConfigured() && safeEqual(password, env('ADMIN_PASSWORD'))

export function sessionCookie(req: Request) {
  const exp = Date.now() + SESSION_HOURS * 3600_000
  const payload = String(exp)
  const secure = new URL(req.url).protocol === 'https:' ? '; Secure' : ''
  return `${COOKIE}=${payload}.${sign(payload)}; Path=/api/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_HOURS * 3600}${secure}`
}

export const clearCookie = () => `${COOKIE}=; Path=/api/; HttpOnly; SameSite=Strict; Max-Age=0`

export function isAdmin(req: Request) {
  if (!adminConfigured()) return false
  const raw = (req.headers.get('cookie') ?? '').split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`))
  if (!raw) return false
  const [payload, sig] = raw.slice(COOKIE.length + 1).split('.')
  if (!payload || !sig || !safeEqual(sig, sign(payload))) return false
  return Number(payload) > Date.now()
}

/**
 * Requêtes d'écriture de l'admin : session valide + en-tête maison (un formulaire d'un autre site
 * ne peut pas l'ajouter), en plus du cookie SameSite=Strict.
 */
export function requireAdmin(req: Request): Response | null {
  if (!isAdmin(req)) return error(401, 'Not signed in')
  if (req.method !== 'GET' && req.headers.get('x-admin-request') !== '1') return error(403, 'Missing admin header')
  return null
}

// --- Stockage ------------------------------------------------------------------------------------

export const messagesStore = () => getStore({ name: 'inquiries', consistency: 'strong' })
export const galleryStore = () => getStore({ name: 'gallery', consistency: 'strong' })

const MANIFEST_KEY = 'manifest.json'

export async function readManifest(): Promise<GalleryManifest> {
  const stored = (await galleryStore().get(MANIFEST_KEY, { type: 'json' })) as GalleryManifest | null
  return stored ?? defaultManifest()
}

export async function writeManifest(manifest: GalleryManifest) {
  manifest.updatedAt = new Date().toISOString()
  await galleryStore().setJSON(MANIFEST_KEY, manifest)
}
