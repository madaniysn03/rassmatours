/**
 * Session de /admin/ :
 * - GET  /api/admin/session : état de connexion (et si ADMIN_PASSWORD est configuré).
 * - POST /api/admin/login   : { password } → cookie de session signé (12 h).
 * - POST /api/admin/logout  : efface le cookie.
 */
import type { Config } from '@netlify/functions'
import { adminConfigured, checkPassword, clearCookie, error, isAdmin, json, sessionCookie } from '../lib/server'

export default async (req: Request) => {
  const action = new URL(req.url).pathname.split('/').filter(Boolean).pop()

  if (action === 'session' && req.method === 'GET') {
    return json({ signedIn: isAdmin(req), configured: adminConfigured() })
  }

  if (action === 'logout' && req.method === 'POST') {
    return json({ ok: true }, 200, { 'Set-Cookie': clearCookie() })
  }

  if (action === 'login' && req.method === 'POST') {
    if (!adminConfigured()) return error(503, 'ADMIN_PASSWORD is not set on the server')
    let password = ''
    try {
      password = String(((await req.json()) as { password?: unknown }).password ?? '')
    } catch {
      return error(400, 'Invalid JSON')
    }
    if (!checkPassword(password)) {
      // Ralentit les essais en rafale.
      await new Promise((r) => setTimeout(r, 800))
      return error(401, 'Wrong password')
    }
    return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(req) })
  }

  return error(404, 'Not found')
}

export const config: Config = { path: ['/api/admin/session', '/api/admin/login', '/api/admin/logout'] }
