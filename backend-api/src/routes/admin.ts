/**
 * Routes de l'admin (/api/admin/*) :
 * - GET  session · POST login · POST logout
 * - GET  messages · PATCH messages/:id { read } · DELETE messages/:id
 * - GET  gallery (manifest ou null) · POST gallery/init { items } (première initialisation depuis la galerie du site)
 *   POST gallery (multipart file, small, alt, row, width, height) · PUT gallery { items } (ordre, rangée, alt)
 *   DELETE gallery/:id
 */
import { Hono } from 'hono'
import { adminConfigured, checkPassword, clearCookie, isAdmin, requireAdmin, sessionCookie } from '../auth.ts'
import { gallery, isSafeId, messages, newId, type GalleryManifest, type ManifestItem } from '../storage.ts'

const MAX_BYTES = 3_000_000
const TYPES = new Set(['image/webp', 'image/jpeg'])

export const adminRoutes = new Hono()

// --- Session (sans authentification) -------------------------------------------------------------

adminRoutes.get('/session', (c) => c.json({ signedIn: isAdmin(c), configured: adminConfigured() }, 200, { 'Cache-Control': 'no-store' }))

adminRoutes.post('/login', async (c) => {
  if (!adminConfigured()) return c.json({ error: 'ADMIN_PASSWORD is not set on the server' }, 503)
  const body = (await c.req.json().catch(() => ({}))) as { password?: unknown }
  if (!checkPassword(String(body.password ?? ''))) {
    // Ralentit les essais en rafale.
    await new Promise((r) => setTimeout(r, 800))
    return c.json({ error: 'Wrong password' }, 401)
  }
  c.header('Set-Cookie', sessionCookie(c))
  return c.json({ ok: true })
})

adminRoutes.post('/logout', (c) => {
  c.header('Set-Cookie', clearCookie())
  return c.json({ ok: true })
})

// --- Tout le reste exige une session --------------------------------------------------------------

const secured = new Hono()
secured.use('*', requireAdmin)
secured.use('*', async (c, next) => {
  await next()
  c.header('Cache-Control', 'no-store')
})

secured.get('/messages', async (c) => c.json({ messages: await messages.list() }))

secured.patch('/messages/:id', async (c) => {
  const current = await messages.get(c.req.param('id'))
  if (!current) return c.json({ error: 'Not found' }, 404)
  const body = (await c.req.json().catch(() => ({}))) as { read?: unknown }
  const updated = { ...current, read: Boolean(body.read) }
  await messages.save(updated)
  return c.json({ message: updated })
})

secured.delete('/messages/:id', async (c) => {
  const current = await messages.get(c.req.param('id'))
  if (!current) return c.json({ error: 'Not found' }, 404)
  await messages.remove(current.id)
  return c.json({ ok: true })
})

secured.get('/gallery', async (c) => c.json({ manifest: await gallery.readManifest() }))

/** Valide un élément envoyé par l'admin lors de l'initialisation (galerie par défaut du site). */
function cleanItem(raw: unknown): ManifestItem | null {
  const m = raw as Partial<ManifestItem>
  if (!m || typeof m.id !== 'string' || !isSafeId(m.id)) return null
  if (m.kind !== 'image' && m.kind !== 'video') return null
  if (m.source !== 'static') return null
  const path = (v: unknown) => typeof v === 'string' && /^\/(images|video)\/[\w./-]+$/.test(v) && !v.includes('..')
  if (!path(m.src) || (m.poster !== undefined && !path(m.poster))) return null
  const width = Number(m.width)
  const height = Number(m.height)
  if (!(width > 0 && height > 0 && width <= 6000 && height <= 6000)) return null
  return {
    id: m.id,
    kind: m.kind,
    source: 'static',
    src: m.src as string,
    ...(m.poster ? { poster: m.poster } : {}),
    alt: String(m.alt ?? '').trim().slice(0, 300),
    width,
    height,
    row: m.row === 1 ? 1 : 0,
  }
}

secured.post('/gallery/init', async (c) => {
  const existing = await gallery.readManifest()
  if (existing) return c.json({ manifest: existing })
  const body = (await c.req.json().catch(() => null)) as { items?: unknown[] } | null
  if (!Array.isArray(body?.items) || body.items.length > 200) return c.json({ error: 'Missing items' }, 400)
  const items = body.items.map(cleanItem)
  if (items.some((i) => i === null)) return c.json({ error: 'Invalid gallery item' }, 400)
  const manifest = await gallery.writeManifest({ version: 1, updatedAt: '', items: items as ManifestItem[] })
  return c.json({ manifest }, 201)
})

async function requireManifest(): Promise<GalleryManifest | null> {
  return gallery.readManifest()
}

secured.post('/gallery', async (c) => {
  const manifest = await requireManifest()
  if (!manifest) return c.json({ error: 'Gallery not initialised' }, 409)
  const form = await c.req.formData().catch(() => null)
  const file = form?.get('file')
  const small = form?.get('small')
  if (!(file instanceof File) || !(small instanceof File)) return c.json({ error: 'Missing image' }, 400)
  if (!TYPES.has(file.type) || !TYPES.has(small.type)) return c.json({ error: 'Images must be WebP or JPEG' }, 415)
  if (file.size > MAX_BYTES || small.size > MAX_BYTES) return c.json({ error: 'Image too large' }, 413)
  const width = Math.round(Number(form!.get('width')))
  const height = Math.round(Number(form!.get('height')))
  if (!(width > 0 && height > 0 && width <= 4000 && height <= 4000)) return c.json({ error: 'Invalid dimensions' }, 400)
  const alt = String(form!.get('alt') ?? '').trim().slice(0, 300)
  if (!alt) return c.json({ error: 'A description (alt text) is required' }, 400)

  const key = `up-${newId()}`
  await gallery.putImage(key, new Uint8Array(await file.arrayBuffer()), file.type)
  await gallery.putImage(`${key}-small`, new Uint8Array(await small.arrayBuffer()), small.type)
  const item: ManifestItem = {
    id: key,
    kind: 'image',
    source: 'upload',
    src: `/api/gallery-image/${key}`,
    small: `/api/gallery-image/${key}-small`,
    alt,
    width,
    height,
    row: form!.get('row') === '1' ? 1 : 0,
  }
  manifest.items.unshift(item)
  return c.json({ item, manifest: await gallery.writeManifest(manifest) }, 201)
})

secured.put('/gallery', async (c) => {
  const manifest = await requireManifest()
  if (!manifest) return c.json({ error: 'Gallery not initialised' }, 409)
  const body = (await c.req.json().catch(() => null)) as { items?: { id: string; alt: string; row: number }[] } | null
  if (!Array.isArray(body?.items)) return c.json({ error: 'Missing items' }, 400)
  const byId = new Map(manifest.items.map((m) => [m.id, m]))
  const next: ManifestItem[] = []
  for (const patch of body.items) {
    const item = byId.get(patch.id)
    if (!item) continue
    const alt = String(patch.alt ?? '').trim().slice(0, 300)
    next.push({ ...item, alt: alt || item.alt, row: patch.row === 1 ? 1 : 0 })
    byId.delete(patch.id)
  }
  // Les éléments absents de la requête sont gardés en fin de liste (pas de suppression implicite).
  manifest.items = [...next, ...byId.values()]
  return c.json({ manifest: await gallery.writeManifest(manifest) })
})

secured.delete('/gallery/:id', async (c) => {
  const manifest = await requireManifest()
  if (!manifest) return c.json({ error: 'Gallery not initialised' }, 409)
  const id = c.req.param('id')
  const item = manifest.items.find((m) => m.id === id)
  if (!item) return c.json({ error: 'Not found' }, 404)
  manifest.items = manifest.items.filter((m) => m.id !== id)
  await gallery.writeManifest(manifest)
  if (item.source === 'upload') await Promise.all([gallery.removeImage(id), gallery.removeImage(`${id}-small`)])
  return c.json({ manifest })
})

adminRoutes.route('/', secured)
