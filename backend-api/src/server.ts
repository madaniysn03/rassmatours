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
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { config } from './config.ts'
import { closeStorage, initStorage, storageKind } from './storage.ts'
import { publicRoutes } from './routes/public.ts'
import { adminRoutes } from './routes/admin.ts'
import { createStaticHandler } from './static.ts'

await initStorage()

const app = new Hono()

const api = new Hono()
// same-site : le site (rassmatours.com) peut afficher les photos servies par l'API (api.rassmatours.com).
api.use('*', secureHeaders({ crossOriginResourcePolicy: 'same-site', contentSecurityPolicy: undefined }))
// Site et API sur des domaines différents : CORS avec cookies, limité aux origines de ALLOWED_ORIGINS.
if (config.allowedOrigins.length) {
  api.use(
    '*',
    cors({
      origin: (origin) => (config.allowedOrigins.includes(origin) ? origin : null),
      credentials: true,
      allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'X-Admin-Request'],
      maxAge: 600,
    }),
  )
}
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
  console.log(storageKind === 'postgres' ? 'Données : PostgreSQL' : `Données : fichiers dans ${config.dataDir}`)
  if (config.allowedOrigins.length) console.log(`CORS : ${config.allowedOrigins.join(', ')}`)
  if (config.frontendDir) console.log(`Site servi depuis : ${config.frontendDir}`)
  if (config.usingTestPassword) console.warn('ATTENTION : ADMIN_PASSWORD absent, mot de passe de test « admin1234 » actif.')
})

// Arrêt propre (redéploiement, docker stop) : on ferme les connexions à la base.
for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => {
    closeStorage().finally(() => process.exit(0))
  })
}
