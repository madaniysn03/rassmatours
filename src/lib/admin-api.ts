/** Appels de /admin/ vers les Netlify Functions (cookie de session HttpOnly, en-tête anti-CSRF). */
import type { GalleryManifest } from './gallery-manifest'

export type AdminMessage = {
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

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  if (init.method && init.method !== 'GET') headers.set('X-Admin-Request', '1')
  if (init.body && typeof init.body === 'string') headers.set('Content-Type', 'application/json')
  const res = await fetch(path, { ...init, headers, credentials: 'same-origin' })
  const isJson = res.headers.get('content-type')?.includes('json')
  const data = isJson ? await res.json() : null
  if (!res.ok) throw new ApiError(res.status, (data as { error?: string } | null)?.error ?? `Request failed (${res.status})`)
  if (!isJson) throw new ApiError(500, 'The admin API is not available here (run the site with Netlify).')
  return data as T
}

export const adminApi = {
  session: () => call<{ signedIn: boolean; configured: boolean }>('/api/admin/session'),
  login: (password: string) => call<{ ok: true }>('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) }),
  logout: () => call<{ ok: true }>('/api/admin/logout', { method: 'POST' }),

  messages: () => call<{ messages: AdminMessage[] }>('/api/admin/messages'),
  markRead: (id: string, read: boolean) =>
    call<{ message: AdminMessage }>(`/api/admin/messages/${id}`, { method: 'PATCH', body: JSON.stringify({ read }) }),
  deleteMessage: (id: string) => call<{ ok: true }>(`/api/admin/messages/${id}`, { method: 'DELETE' }),

  gallery: () => call<GalleryManifest>('/api/admin/gallery'),
  saveGallery: (items: { id: string; alt: string; row: number }[]) =>
    call<GalleryManifest>('/api/admin/gallery', { method: 'PUT', body: JSON.stringify({ items }) }),
  deleteGalleryItem: (id: string) => call<GalleryManifest>(`/api/admin/gallery/${id}`, { method: 'DELETE' }),
  uploadGalleryImage: (form: FormData) => call<{ manifest: GalleryManifest }>('/api/admin/gallery', { method: 'POST', body: form }),
}

/**
 * Prépare une photo pour la galerie dans le navigateur : orientation corrigée, version pleine
 * (900 px de haut au plus) et réduite (400 px), en WebP (JPEG si le navigateur ne sait pas encoder le WebP).
 */
export async function prepareImage(file: File) {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new Error('This file could not be read. Please use a JPEG, PNG or WebP photo (iPhone HEIC photos must be exported as JPEG).')
  }
  const encode = async (maxHeight: number, maxWidth: number) => {
    const scale = Math.min(1, maxHeight / bitmap.height, maxWidth / bitmap.width)
    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, w, h)
    const toBlob = (type: string, q: number) => new Promise<Blob | null>((r) => canvas.toBlob(r, type, q))
    let blob = await toBlob('image/webp', 0.82)
    if (!blob || blob.type !== 'image/webp') blob = await toBlob('image/jpeg', 0.85)
    if (!blob) throw new Error('The photo could not be converted.')
    return { blob, width: w, height: h }
  }
  const full = await encode(900, 1600)
  const small = await encode(400, 720)
  bitmap.close()
  return { full, small }
}
