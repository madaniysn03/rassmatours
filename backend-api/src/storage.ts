/**
 * Stockage sur disque, sans base de données :
 *   <DATA_DIR>/inquiries/<id>.json   messages du formulaire de contact
 *   <DATA_DIR>/gallery/manifest.json galerie de la page Tours (ordre, rangées, textes alt)
 *   <DATA_DIR>/gallery/images/<key>  photos envoyées depuis l'admin (+ <key>.json : type MIME)
 * Écritures atomiques (fichier temporaire puis renommage) : un arrêt brutal ne laisse pas de fichier à moitié écrit.
 */
import { mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { randomBytes } from 'node:crypto'
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

const dirs = {
  inquiries: join(config.dataDir, 'inquiries'),
  gallery: join(config.dataDir, 'gallery'),
  images: join(config.dataDir, 'gallery', 'images'),
}
const manifestFile = join(dirs.gallery, 'manifest.json')

export async function initStorage() {
  await Promise.all(Object.values(dirs).map((d) => mkdir(d, { recursive: true })))
}

export const newId = () => `${Date.now().toString(36)}-${randomBytes(4).toString('hex')}`

/** Identifiants acceptés dans les noms de fichiers (pas de chemin, pas de point). */
export const isSafeId = (id: string) => /^[a-z0-9-]{1,80}$/.test(id)

async function writeAtomic(file: string, data: string | Uint8Array) {
  const tmp = `${file}.${randomBytes(4).toString('hex')}.tmp`
  await writeFile(tmp, data)
  await rename(tmp, file)
}

async function readJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(file, 'utf8')) as T
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw e
  }
}

// --- Messages ------------------------------------------------------------------------------------

export const messages = {
  async save(m: StoredInquiry) {
    await writeAtomic(join(dirs.inquiries, `${m.id}.json`), JSON.stringify(m, null, 2))
  },
  async get(id: string) {
    return isSafeId(id) ? readJson<StoredInquiry>(join(dirs.inquiries, `${id}.json`)) : null
  },
  async list() {
    const files = (await readdir(dirs.inquiries)).filter((f) => f.endsWith('.json'))
    const items = await Promise.all(files.map((f) => readJson<StoredInquiry>(join(dirs.inquiries, f))))
    return items.filter((m): m is StoredInquiry => m !== null).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },
  async remove(id: string) {
    if (isSafeId(id)) await rm(join(dirs.inquiries, `${id}.json`), { force: true })
  },
}

// --- Galerie -------------------------------------------------------------------------------------

export const gallery = {
  /** `null` tant que l'admin n'a pas initialisé la galerie (le site affiche alors sa galerie par défaut). */
  readManifest: () => readJson<GalleryManifest>(manifestFile),
  async writeManifest(manifest: GalleryManifest) {
    manifest.updatedAt = new Date().toISOString()
    await writeAtomic(manifestFile, JSON.stringify(manifest, null, 2))
    return manifest
  },
  async putImage(key: string, data: Uint8Array, contentType: string) {
    await writeAtomic(join(dirs.images, key), data)
    await writeAtomic(join(dirs.images, `${key}.json`), JSON.stringify({ contentType }))
  },
  async getImage(key: string) {
    if (!isSafeId(key)) return null
    const meta = await readJson<{ contentType: string }>(join(dirs.images, `${key}.json`))
    if (!meta) return null
    return { data: await readFile(join(dirs.images, key)), contentType: meta.contentType }
  },
  async removeImage(key: string) {
    if (!isSafeId(key)) return
    await Promise.all([rm(join(dirs.images, key), { force: true }), rm(join(dirs.images, `${key}.json`), { force: true })])
  },
}
