/**
 * Gestion de la galerie, réservée à l'admin :
 * - POST   /api/admin/gallery      : multipart { file, small, alt, row, width, height } → nouvelle image.
 *   L'admin redimensionne et convertit en WebP dans le navigateur avant l'envoi.
 * - PUT    /api/admin/gallery      : { items } → enregistre l'ordre, les rangées et les textes alt.
 * - DELETE /api/admin/gallery/:id  : retire l'élément (et supprime le fichier s'il a été envoyé depuis l'admin).
 */
import type { Config } from '@netlify/functions'
import type { ManifestItem } from '../../src/lib/gallery-manifest'
import { error, galleryStore, json, newId, pathParam, readManifest, requireAdmin, writeManifest } from '../lib/server'

const MAX_BYTES = 3_000_000
const TYPES = new Set(['image/webp', 'image/jpeg'])

export default async (req: Request) => {
  const denied = requireAdmin(req)
  if (denied) return denied
  const id = pathParam(req, '/api/admin/gallery')
  const manifest = await readManifest()

  if (!id && req.method === 'GET') return json(manifest)

  if (!id && req.method === 'POST') {
    const form = await req.formData().catch(() => null)
    const file = form?.get('file')
    const small = form?.get('small')
    if (!(file instanceof File) || !(small instanceof File)) return error(400, 'Missing image')
    if (!TYPES.has(file.type) || !TYPES.has(small.type)) return error(415, 'Images must be WebP or JPEG')
    if (file.size > MAX_BYTES || small.size > MAX_BYTES) return error(413, 'Image too large')
    const width = Math.round(Number(form!.get('width')))
    const height = Math.round(Number(form!.get('height')))
    if (!(width > 0 && height > 0 && width <= 4000 && height <= 4000)) return error(400, 'Invalid dimensions')
    const alt = String(form!.get('alt') ?? '').trim().slice(0, 300)
    if (!alt) return error(400, 'A description (alt text) is required')
    const row = form!.get('row') === '1' ? 1 : 0

    const key = `up-${newId()}`
    const store = galleryStore()
    await store.set(`img/${key}`, await file.arrayBuffer(), { metadata: { contentType: file.type } })
    await store.set(`img/${key}-small`, await small.arrayBuffer(), { metadata: { contentType: small.type } })
    const item: ManifestItem = {
      id: key,
      kind: 'image',
      source: 'upload',
      src: `/api/gallery-image/${key}`,
      small: `/api/gallery-image/${key}-small`,
      alt,
      width,
      height,
      row,
    }
    manifest.items.unshift(item)
    await writeManifest(manifest)
    return json({ item, manifest }, 201)
  }

  if (!id && req.method === 'PUT') {
    const body = (await req.json().catch(() => null)) as { items?: { id: string; alt: string; row: number }[] } | null
    if (!body?.items || !Array.isArray(body.items)) return error(400, 'Missing items')
    const byId = new Map(manifest.items.map((m) => [m.id, m]))
    const next: ManifestItem[] = []
    for (const patch of body.items) {
      const item = byId.get(patch.id)
      if (!item) continue
      const alt = String(patch.alt ?? '').trim().slice(0, 300)
      next.push({ ...item, alt: alt || item.alt, row: patch.row === 1 ? 1 : 0 })
      byId.delete(patch.id)
    }
    // Les éléments absents de la requête sont conservés en fin de liste (pas de suppression implicite).
    manifest.items = [...next, ...byId.values()]
    await writeManifest(manifest)
    return json(manifest)
  }

  if (id && req.method === 'DELETE') {
    const item = manifest.items.find((m) => m.id === id)
    if (!item) return error(404, 'Not found')
    manifest.items = manifest.items.filter((m) => m.id !== id)
    await writeManifest(manifest)
    if (item.source === 'upload') {
      const store = galleryStore()
      await Promise.all([store.delete(`img/${id}`), store.delete(`img/${id}-small`)])
    }
    return json(manifest)
  }

  return error(405, 'Method not allowed')
}

export const config: Config = { path: ['/api/admin/gallery', '/api/admin/gallery/:id'] }
