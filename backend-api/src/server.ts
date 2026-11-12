/**
 * Serveur de l'API Rassma Tours (Node.js + Hono).
 *   /api/inquiry, /api/gallery, /api/gallery-image/:key   public
 *   /api/admin/*                                          admin (session)
 *   le reste                                              site statique si FRONTEND_DIR est défini
 */
import { existsSync } from 'node:fs'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { secureHeaders } from 'hono/secure-headers'
import { config } from './config.ts'
import { initStorage } from './storage.ts'
import { publicRoutes } from './routes/public.ts'
import { adminRoutes } from './routes/admin.ts'
import { createStaticHandler } from './static.ts'

await initStorage()

const app = new Hono()

const api = new Hono()
api.use('*', secureHeaders({ crossOriginResourcePolicy: 'same-origin', contentSecurityPolicy: undefined }))
api.use('*', bodyLimit({ maxSize: 8 * 1024 * 1024, onError: (c) => c.json({ error: 'Too large' }, 413) }))
api.get('/health', (c) => c.json({ ok: true }))
api.route('/', publicRoutes)
api.route('/admin', adminRoutes)
api.all('*', (c) => c.json({ error: 'Not found' }, 404))
api.onError((err, c) => {
  console.error(err)
  return c.json({ error: 'Server error' }, 500)
})
app.route('/api', api)

if (config.frontendDir) {
  if (!existsSync(config.frontendDir)) {
    console.error(`FRONTEND_DIR introuvable : ${config.frontendDir} (lancer d'abord le build du frontend)`)
    process.exit(1)
  }
  const serveStatic = createStaticHandler(config.frontendDir)
  app.on(['GET', 'HEAD'], '*', serveStatic)
}

serve({ fetch: app.fetch, port: config.port, hostname: config.host }, (info) => {
  console.log(`Rassma Tours API sur http://${info.address}:${info.port}/api/`)
  console.log(`Données : ${config.dataDir}`)
  if (config.frontendDir) console.log(`Site servi depuis : ${config.frontendDir}`)
  if (config.usingTestPassword) console.warn('ATTENTION : ADMIN_PASSWORD absent, mot de passe de test « admin1234 » actif.')
})
