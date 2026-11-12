import type { ImageAsset } from '../data/images'

/** Largeurs des variantes générées par scripts/image-variants.sh (plus le fichier maître). */
export const VARIANT_WIDTHS = [600, 900, 1400] as const

const base = (src: string) => src.replace(/\.jpg$/, '')

/**
 * `srcset` d’un actif : variantes 600/900/1400 px plus le maître, en WebP ou en JPEG.
 * Les variantes plus larges que le maître (portraits de 1200 px) sont ignorées.
 */
export function srcSetFor(asset: ImageAsset, format: 'webp' | 'jpg'): string {
  const ext = format === 'webp' ? '.webp' : '.jpg'
  const root = base(asset.src)
  const entries = VARIANT_WIDTHS.filter((w) => w < asset.width).map((w) => `${root}-${w}${ext} ${w}w`)
  entries.push(`${root}${ext} ${asset.width}w`)
  return entries.join(', ')
}
