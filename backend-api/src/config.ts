/**
 * Configuration lue dans l'environnement (fichier backend-api/.env chargé au démarrage s'il existe).
 */
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const envFile = resolve(root, '.env')
if (existsSync(envFile)) process.loadEnvFile(envFile)

const str = (key: string, fallback = '') => (process.env[key] ?? '').trim() || fallback
const num = (key: string, fallback: number) => {
  const n = Number(process.env[key])
  return Number.isFinite(n) && n > 0 ? n : fallback
}

/**
 * Mot de passe de test, utilisé tant que ADMIN_PASSWORD n'est pas défini (même comportement que la version
 * Netlify). NON SÉCURISÉ : définir ADMIN_PASSWORD avant de donner l'accès, ou vider cette constante.
 */
const TEST_PASSWORD = 'admin1234'

const resolvePath = (value: string) => (value ? resolve(root, value) : '')

export const config = {
  port: num('PORT', 3001),
  host: str('HOST', '127.0.0.1'),
  adminPassword: str('ADMIN_PASSWORD') || TEST_PASSWORD,
  usingTestPassword: !str('ADMIN_PASSWORD'),
  sessionSecret: str('ADMIN_SESSION_SECRET'),
  dataDir: resolvePath(str('DATA_DIR', './data')),
  frontendDir: resolvePath(str('FRONTEND_DIR')),
  trustProxy: str('TRUST_PROXY') === '1' || str('TRUST_PROXY') === 'true',
  inquiryRateLimit: num('INQUIRY_RATE_LIMIT', 5),
}
