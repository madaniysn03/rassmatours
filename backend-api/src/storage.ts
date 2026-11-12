/**
 * Stockage de l'API, avec deux implémentations interchangeables :
 * - **PostgreSQL** si DATABASE_URL est défini (production, base dans un service séparé) ;
 * - **fichiers** dans DATA_DIR sinon (développement, petit serveur sans base).
 *
 * Données : messages du formulaire de contact, galerie de la page Tours (manifeste), photos envoyées depuis l'admin.
 */
import { mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { randomBytes } from 'node:crypto'
import pg from 'pg'
import { config } from './config.ts'

export type StoredInquiry = {
  id: string
  createdAt: string
  read: boolean
  name: string
  email: string
  phone: string
  tour: string
  date: string
  travelers: string
  message: string
}

export type ManifestItem = {
  id: string
  kind: 'image' | 'video'
  source: 'static' | 'upload'
  src: string
  small?: string
  poster?: string
  alt: string
  width: number
  height: number
  row: 0 | 1
}

export type GalleryManifest = { version: 1; updatedAt: string; items: ManifestItem[] }

type Store = {
  init(): Promise<void>
  close(): Promise<void>
  messages: {
    save(m: StoredInquiry): Promise<void>
    get(id: string): Promise<StoredInquiry | null>
    list(): Promise<StoredInquiry[]>
    remove(id: string): Promise<void>
  }
  gallery: {
    readManifest(): Promise<GalleryManifest | null>
    writeManifest(m: GalleryManifest): Promise<GalleryManifest>
    putImage(key: string, data: Uint8Array, contentType: string): Promise<void>
    getImage(key: string): Promise<{ data: Uint8Array; contentType: string } | null>
    removeImage(key: string): Promise<void>
  }
}

export const newId = () => `${Date.now().toString(36)}-${randomBytes(4).toString('hex')}`

/** Identifiants acceptés (noms de fichiers et clés) : pas de chemin, pas de point. */
export const isSafeId = (id: string) => /^[a-z0-9-]{1,80}$/.test(id)

// --- Fichiers ------------------------------------------------------------------------------------
//   <DATA_DIR>/inquiries/<id>.json · <DATA_DIR>/gallery/manifest.json · <DATA_DIR>/gallery/images/<key>[.json]
// Écritures atomiques (fichier temporaire puis renommage).

function fileStore(dataDir: string): Store {
  const dirs = { inquiries: join(dataDir, 'inquiries'), gallery: join(dataDir, 'gallery'), images: join(dataDir, 'gallery', 'images') }
  const manifestFile = join(dirs.gallery, 'manifest.json')
  const writeAtomic = async (file: string, data: string | Uint8Array) => {
    const tmp = `${file}.${randomBytes(4).toString('hex')}.tmp`
    await writeFile(tmp, data)
    await rename(tmp, file)
  }
  const readJson = async <T>(file: string): Promise<T | null> => {
    try {
      return JSON.parse(await readFile(file, 'utf8')) as T
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null
      throw e
    }
  }
  return {
    async init() {
      await Promise.all(Object.values(dirs).map((d) => mkdir(d, { recursive: true })))
    },
    async close() {},
    messages: {
      save: (m) => writeAtomic(join(dirs.inquiries, `${m.id}.json`), JSON.stringify(m, null, 2)),
      get: async (id) => (isSafeId(id) ? readJson<StoredInquiry>(join(dirs.inquiries, `${id}.json`)) : null),
      async list() {
        const files = (await readdir(dirs.inquiries)).filter((f) => f.endsWith('.json'))
        const items = await Promise.all(files.map((f) => readJson<StoredInquiry>(join(dirs.inquiries, f))))
        return items.filter((m): m is StoredInquiry => m !== null).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      },
      async remove(id) {
        if (isSafeId(id)) await rm(join(dirs.inquiries, `${id}.json`), { force: true })
      },
    },
    gallery: {
      readManifest: () => readJson<GalleryManifest>(manifestFile),
      async writeManifest(manifest) {
        manifest.updatedAt = new Date().toISOString()
        await writeAtomic(manifestFile, JSON.stringify(manifest, null, 2))
        return manifest
      },
      async putImage(key, data, contentType) {
        await writeAtomic(join(dirs.images, key), data)
        await writeAtomic(join(dirs.images, `${key}.json`), JSON.stringify({ contentType }))
      },
      async getImage(key) {
        if (!isSafeId(key)) return null
        const meta = await readJson<{ contentType: string }>(join(dirs.images, `${key}.json`))
        if (!meta) return null
        return { data: await readFile(join(dirs.images, key)), contentType: meta.contentType }
      },
      async removeImage(key) {
        if (!isSafeId(key)) return
        await Promise.all([rm(join(dirs.images, key), { force: true }), rm(join(dirs.images, `${key}.json`), { force: true })])
      },
    },
  }
}

// --- PostgreSQL ----------------------------------------------------------------------------------

const SCHEMA = `
CREATE TABLE IF NOT EXISTS inquiries (
  id         text PRIMARY KEY,
  created_at timestamptz NOT NULL,
  data       jsonb NOT NULL
);
CREATE INDEX IF NOT EXISTS inquiries_created_at ON inquiries (created_at DESC);
CREATE TABLE IF NOT EXISTS gallery_manifest (
  id         smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  data       jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS gallery_images (
  key          text PRIMARY KEY,
  content_type text NOT NULL,
  data         bytea NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);`

function postgresStore(connectionString: string): Store {
  const pool = new pg.Pool({ connectionString, max: 5, ssl: config.databaseSsl ? { rejectUnauthorized: false } : undefined })
  pool.on('error', (err) => console.error('PostgreSQL :', err.message))
  return {
    async init() {
      // Le service base de données peut démarrer après l'API : quelques essais avant d'abandonner.
      for (let attempt = 1; ; attempt++) {
        try {
          await pool.query(SCHEMA)
          return
        } catch (e) {
          if (attempt >= 15) throw e
          console.warn(`PostgreSQL indisponible (${(e as Error).message}), nouvel essai ${attempt}/15…`)
          await new Promise((r) => setTimeout(r, 2000))
        }
      }
    },
    close: () => pool.end(),
    messages: {
      async save(m) {
        await pool.query(
          'INSERT INTO inquiries (id, created_at, data) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data',
          [m.id, m.createdAt, m],
        )
      },
      async get(id) {
        if (!isSafeId(id)) return null
        const { rows } = await pool.query<{ data: StoredInquiry }>('SELECT data FROM inquiries WHERE id = $1', [id])
        return rows[0]?.data ?? null
      },
      async list() {
        const { rows } = await pool.query<{ data: StoredInquiry }>('SELECT data FROM inquiries ORDER BY created_at DESC')
        return rows.map((r) => r.data)
      },
      async remove(id) {
        if (isSafeId(id)) await pool.query('DELETE FROM inquiries WHERE id = $1', [id])
      },
    },
    gallery: {
      async readManifest() {
        const { rows } = await pool.query<{ data: GalleryManifest }>('SELECT data FROM gallery_manifest WHERE id = 1')
        return rows[0]?.data ?? null
      },
      async writeManifest(manifest) {
        manifest.updatedAt = new Date().toISOString()
        await pool.query(
          'INSERT INTO gallery_manifest (id, data, updated_at) VALUES (1, $1, now()) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()',
          [manifest],
        )
        return manifest
      },
      async putImage(key, data, contentType) {
        await pool.query(
          'INSERT INTO gallery_images (key, content_type, data) VALUES ($1, $2, $3) ON CONFLICT (key) DO UPDATE SET content_type = EXCLUDED.content_type, data = EXCLUDED.data',
          [key, contentType, Buffer.from(data)],
        )
      },
      async getImage(key) {
        if (!isSafeId(key)) return null
        const { rows } = await pool.query<{ content_type: string; data: Buffer }>('SELECT content_type, data FROM gallery_images WHERE key = $1', [key])
        return rows[0] ? { data: rows[0].data, contentType: rows[0].content_type } : null
      },
      async removeImage(key) {
        if (isSafeId(key)) await pool.query('DELETE FROM gallery_images WHERE key = $1', [key])
      },
    },
  }
}

const store: Store = config.databaseUrl ? postgresStore(config.databaseUrl) : fileStore(config.dataDir)

export const storageKind = config.databaseUrl ? 'postgres' : 'files'
export const initStorage = () => store.init()
export const closeStorage = () => store.close()
export const messages = store.messages
export const gallery = store.gallery
