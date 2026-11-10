/**
 * Messages du formulaire de contact, réservés à l'admin :
 * - GET    /api/admin/messages      : liste, plus récents d'abord.
 * - PATCH  /api/admin/messages/:id  : { read: boolean }.
 * - DELETE /api/admin/messages/:id  : suppression définitive.
 */
import type { Config } from '@netlify/functions'
import { error, json, messagesStore, pathParam, requireAdmin } from '../lib/server'
import type { StoredInquiry } from './inquiry.mts'

export default async (req: Request) => {
  const denied = requireAdmin(req)
  if (denied) return denied
  const store = messagesStore()
  const id = pathParam(req, '/api/admin/messages')

  if (!id && req.method === 'GET') {
    const { blobs } = await store.list({ prefix: 'msg/' })
    const items = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' }) as Promise<StoredInquiry | null>))
    const messages = items.filter((m): m is StoredInquiry => m !== null).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return json({ messages })
  }

  if (!id || !/^[a-z0-9-]+$/.test(id)) return error(404, 'Not found')
  const key = `msg/${id}`
  const current = (await store.get(key, { type: 'json' })) as StoredInquiry | null
  if (!current) return error(404, 'Not found')

  if (req.method === 'PATCH') {
    const body = (await req.json().catch(() => ({}))) as { read?: unknown }
    const updated = { ...current, read: Boolean(body.read) }
    await store.setJSON(key, updated)
    return json({ message: updated })
  }

  if (req.method === 'DELETE') {
    await store.delete(key)
    return json({ ok: true })
  }

  return error(405, 'Method not allowed')
}

export const config: Config = { path: ['/api/admin/messages', '/api/admin/messages/:id'] }
