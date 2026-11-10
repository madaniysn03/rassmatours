/**
 * Galerie modifiable depuis /admin/ : format partagé entre le site (page Tours), l'admin et les
 * Netlify Functions. Le manifeste est stocké dans Netlify Blobs ; tant qu'il n'existe pas, la galerie
 * par défaut (src/data/gallery.ts) sert de point de départ.
 */
import { galleryRows, type GalleryItem } from '../data/gallery'
import type { ImageAsset } from '../data/images'

export type ManifestItem = {
  id: string
  kind: 'image' | 'video'
  /** `static` : fichier du dépôt (public/), avec ses variantes ; `upload` : image envoyée depuis l'admin. */
  source: 'static' | 'upload'
  src: string
  /** Variante réduite (uploads) ou affiche (vidéo). */
  small?: string
  poster?: string
  alt: string
  width: number
  height: number
  row: 0 | 1
}

export type GalleryManifest = { version: 1; updatedAt: string; items: ManifestItem[] }

const slugOf = (src: string) => src.split('/').pop()!.replace(/\.[a-z0-9]+$/i, '')

export function defaultManifest(): GalleryManifest {
  const items: ManifestItem[] = galleryRows.flatMap((row, r) =>
    row.map((item): ManifestItem =>
      item.kind === 'video'
        ? { id: `static-${slugOf(item.src)}`, kind: 'video', source: 'static', src: item.src, poster: item.poster, alt: item.label, width: item.width, height: item.height, row: r as 0 | 1 }
        : item.kind === 'image'
          ? { id: `static-${slugOf(item.image.src)}`, kind: 'image', source: 'static', src: item.image.src, alt: item.image.alt, width: item.image.width, height: item.image.height, row: r as 0 | 1 }
          : { id: item.id, kind: 'image', source: 'upload', src: item.src, small: item.small, alt: item.alt, width: item.width, height: item.height, row: r as 0 | 1 },
    ),
  )
  return { version: 1, updatedAt: new Date(0).toISOString(), items }
}

/** Manifeste → rangées affichées par GalleryMarquee. */
export function rowsFromManifest(manifest: GalleryManifest): GalleryItem[][] {
  const rows: GalleryItem[][] = [[], []]
  for (const m of manifest.items) {
    if (m.kind === 'video') {
      rows[m.row].push({ kind: 'video', src: m.src, poster: m.poster ?? '', label: m.alt, width: m.width, height: m.height })
    } else if (m.source === 'static') {
      const image: ImageAsset = { src: m.src, src900: m.src, alt: m.alt, width: m.width, height: m.height, credit: 'Rassma Tours' }
      rows[m.row].push({ kind: 'image', image })
    } else {
      rows[m.row].push({ kind: 'upload', id: m.id, src: m.src, small: m.small ?? m.src, alt: m.alt, width: m.width, height: m.height })
    }
  }
  // Une rangée vide casserait la boucle : on rééquilibre.
  if (rows[1].length === 0 && rows[0].length > 1) rows[1] = rows[0].splice(Math.ceil(rows[0].length / 2))
  if (rows[0].length === 0 && rows[1].length > 1) rows[0] = rows[1].splice(Math.ceil(rows[1].length / 2))
  return rows.filter((r) => r.length > 0)
}
