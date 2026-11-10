/**
 * Galerie publique :
 * - GET /api/gallery            : manifeste (lu par la page Tours au chargement).
 * - GET /api/gallery-image/:key : image envoyée depuis l'admin (WebP stocké dans Netlify Blobs).
 */
import type { Config } from '@netlify/functions'
import { error, galleryStore, json, pathParam, readManifest } from '../lib/server'

export default async (req: Request) => {
  if (req.method !== 'GET') return error(405, 'Method not allowed')
  const key = pathParam(req, '/api/gallery-image')

  if (new URL(req.url).pathname.replace(/\/+$/, '') === '/api/gallery') {
    const manifest = await readManifest()
    return json(manifest, 200, { 'Cache-Control': 'public, max-age=60' })
  }

  if (!/^[a-z0-9-]+$/.test(key)) return error(404, 'Not found')
  const entry = await galleryStore().getWithMetadata(`img/${key}`, { type: 'arrayBuffer' })
  if (!entry) return error(404, 'Not found')
  return new Response(entry.data, {
    headers: {
      'Content-Type': String(entry.metadata.contentType ?? 'image/webp'),
      // Chaque envoi reçoit un identifiant neuf : le fichier ne change jamais à cette adresse.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}

export const config: Config = { path: ['/api/gallery', '/api/gallery-image/:key'] }
