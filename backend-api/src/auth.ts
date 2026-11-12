/**
 * Session admin : mot de passe vérifié côté serveur, puis cookie signé (HMAC-SHA256), HttpOnly, SameSite=Strict,
 * limité à /api/, valable 12 h. Les écritures exigent en plus l'en-tête X-Admin-Request (protection CSRF).
 */
import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { config } from './config.ts'

const COOKIE = 'rt_admin'
const SESSION_HOURS = 12

const key = createHash('sha256').update(`rassma-admin:${config.sessionSecret || config.adminPassword}`).digest()
const sign = (payload: string) => createHmac('sha256', key).update(payload).digest('base64url')

const safeEqual = (a: string, b: string) =>
  timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest())

export const adminConfigured = () => config.adminPassword.length >= 8
export const checkPassword = (password: string) => adminConfigured() && safeEqual(password, config.adminPassword)

/** HTTPS vu par le visiteur (directement, ou d'après le reverse proxy si TRUST_PROXY=1). */
export const isHttps = (c: Context) =>
  new URL(c.req.url).protocol === 'https:' || (config.trustProxy && c.req.header('x-forwarded-proto')?.split(',')[0].trim() === 'https')

export function sessionCookie(c: Context) {
  const payload = String(Date.now() + SESSION_HOURS * 3600_000)
  const secure = isHttps(c) ? '; Secure' : ''
  return `${COOKIE}=${payload}.${sign(payload)}; Path=/api/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_HOURS * 3600}${secure}`
}

export const clearCookie = () => `${COOKIE}=; Path=/api/; HttpOnly; SameSite=Strict; Max-Age=0`

export function isAdmin(c: Context) {
  if (!adminConfigured()) return false
  const raw = getCookie(c, COOKIE)
  if (!raw) return false
  const [payload, sig] = raw.split('.')
  if (!payload || !sig || !safeEqual(sig, sign(payload))) return false
  return Number(payload) > Date.now()
}

/** Middleware des routes /api/admin/* (hors connexion). */
export async function requireAdmin(c: Context, next: Next) {
  if (!isAdmin(c)) return c.json({ error: 'Not signed in' }, 401)
  if (c.req.method !== 'GET' && c.req.header('x-admin-request') !== '1') return c.json({ error: 'Missing admin header' }, 403)
  await next()
}
