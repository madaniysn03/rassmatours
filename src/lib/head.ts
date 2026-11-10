import { createContext, useContext, useEffect } from 'react'
import { siteConfig } from '../data/site'
import type { ImageAsset } from '../data/images'
import { srcSetFor } from './images'

/**
 * Métadonnées par page, sans dépendance.
 * - Prérendu : chaque page transmet ses métadonnées à un collecteur, injectées dans le HTML statique.
 * - Client : le même hook met à jour le document à chaque navigation.
 */
export type HeadData = {
  /** Titre sans la marque (ajoutée automatiquement), 50 caractères maximum recommandés. */
  title: string
  /** 150 caractères maximum recommandés. */
  description: string
  /** Chemin canonique de la page, avec slash final (ex. /tours/). */
  path: string
  /** Image de partage : un actif du catalogue (dimensions connues). */
  image?: ImageAsset
  /** Image à précharger pour le LCP (hero), avec sa variante portrait éventuelle. */
  preload?: { image: ImageAsset; portrait?: ImageAsset }
  /** Données structurées : un ou plusieurs objets, fusionnés dans un @graph. */
  jsonLd?: Record<string, unknown>[]
  /** Fil d’Ariane (BreadcrumbList) : nom + chemin, la page courante en dernier. */
  breadcrumbs?: { name: string; path: string }[]
  /** Versions linguistiques (hreflang). Vide tant qu’une seule langue est publiée. */
  alternates?: { lang: string; path: string }[]
  noindex?: boolean
}

export type HeadCollect = (data: HeadData) => void
export const HeadContext = createContext<HeadCollect | null>(null)

const SITE_NAME = siteConfig.brand.name
const DEFAULT_OG = { src: '/images/hero/tangier-bay-dusk-og.jpg', width: 1200, height: 630 }
/** `VITE_NOINDEX=true` sur un environnement de recette : tout le site passe en noindex. */
export const NOINDEX_ALL = (import.meta.env.VITE_NOINDEX as string | undefined) === 'true'

export const absoluteUrl = (path: string) => {
  const base = siteConfig.url.replace(/\/$/, '')
  return path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`
}

const fullTitle = (title: string) => (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`)
const ogImage = (data: HeadData) =>
  data.image ? { src: data.image.src, width: data.image.width, height: data.image.height, alt: data.image.alt } : { ...DEFAULT_OG, alt: 'Tangier bay at dusk' }

/** Entité organisation, identique sur toutes les pages (informations vérifiées uniquement). */
export const organizationNode = () => ({
  '@type': 'TravelAgency',
  '@id': `${siteConfig.url}/#organization`,
  name: siteConfig.brand.name,
  url: `${siteConfig.url}/`,
  logo: { '@type': 'ImageObject', url: absoluteUrl(siteConfig.brand.logo), width: 986, height: 909 },
  image: absoluteUrl(DEFAULT_OG.src),
  telephone: siteConfig.contact.phoneE164,
  email: siteConfig.contact.email,
  address: { '@type': 'PostalAddress', addressLocality: siteConfig.contact.city, addressCountry: 'MA' },
  areaServed: [
    { '@type': 'City', name: 'Tangier' },
    { '@type': 'City', name: 'Asilah' },
    { '@type': 'City', name: 'Chefchaouen' },
  ],
  availableLanguage: siteConfig.languages,
  sameAs: [siteConfig.tripadvisorUrl, ...siteConfig.social.map((s) => s.href)].filter(Boolean),
  ...(siteConfig.googleBusinessProfileUrl ? { hasMap: siteConfig.googleBusinessProfileUrl } : {}),
})

const websiteNode = () => ({
  '@type': 'WebSite',
  '@id': `${siteConfig.url}/#website`,
  url: `${siteConfig.url}/`,
  name: siteConfig.brand.name,
  inLanguage: siteConfig.lang,
  publisher: { '@id': `${siteConfig.url}/#organization` },
})

const webPageNode = (data: HeadData) => {
  const img = ogImage(data)
  return {
    '@type': 'WebPage',
    '@id': `${absoluteUrl(data.path)}#webpage`,
    url: absoluteUrl(data.path),
    name: fullTitle(data.title),
    description: data.description,
    inLanguage: siteConfig.lang,
    isPartOf: { '@id': `${siteConfig.url}/#website` },
    about: { '@id': `${siteConfig.url}/#organization` },
    primaryImageOfPage: { '@type': 'ImageObject', url: absoluteUrl(img.src), width: img.width, height: img.height },
    ...(data.breadcrumbs ? { breadcrumb: { '@id': `${absoluteUrl(data.path)}#breadcrumb` } } : {}),
  }
}

const breadcrumbNode = (data: HeadData) =>
  data.breadcrumbs
    ? {
        '@type': 'BreadcrumbList',
        '@id': `${absoluteUrl(data.path)}#breadcrumb`,
        itemListElement: data.breadcrumbs.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
          item: absoluteUrl(b.path),
        })),
      }
    : null

/** Graphe complet de la page : organisation, site, page, fil d’Ariane, nœuds spécifiques. */
export function buildJsonLd(data: HeadData) {
  if (!siteConfig.seo.enableStructuredData || data.noindex) return null
  const graph = [organizationNode(), websiteNode(), webPageNode(data), breadcrumbNode(data), ...(data.jsonLd ?? [])].filter(Boolean)
  return { '@context': 'https://schema.org', '@graph': graph }
}

export function useHead(data: HeadData) {
  const collect = useContext(HeadContext)
  // Prérendu : la collecte pendant le rendu est le seul moyen d’obtenir les métadonnées.
  if (collect) collect(data)

  useEffect(() => {
    const noindex = data.noindex || NOINDEX_ALL
    const img = ogImage(data)
    const url = absoluteUrl(data.path)
    document.title = fullTitle(data.title)
    setMeta('name', 'description', data.description)
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:locale', 'en_US')
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:title', fullTitle(data.title))
    setMeta('property', 'og:description', data.description)
    setMeta('property', 'og:image', absoluteUrl(img.src))
    setMeta('property', 'og:image:width', String(img.width))
    setMeta('property', 'og:image:height', String(img.height))
    setMeta('property', 'og:image:alt', img.alt)
    setMeta('property', 'og:url', noindex ? null : url)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', fullTitle(data.title))
    setMeta('name', 'twitter:description', data.description)
    setMeta('name', 'twitter:image', absoluteUrl(img.src))
    setLink('canonical', noindex ? null : url)
    const ld = buildJsonLd(data)
    setJsonLd(ld)
  }, [data])
}

/** `null` retire la balise (page noindex atteinte par navigation client). */
function setMeta(attr: 'name' | 'property', key: string, content: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (content === null) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function setLink(rel: string, href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (href === null) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

function setJsonLd(jsonLd: object | null) {
  const id = 'ld-json'
  let el = document.getElementById(id)
  if (!jsonLd) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.setAttribute('type', 'application/ld+json')
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(jsonLd)
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')


/** Sérialise les métadonnées en balises HTML pour le prérendu. */
export function renderHeadTags(data: HeadData): string {
  const noindex = data.noindex || NOINDEX_ALL
  const title = fullTitle(data.title)
  const img = ogImage(data)
  const url = absoluteUrl(data.path)
  // Page noindex : pas de canonical ni d’og:url (signal contradictoire, et /404 n’est pas une URL réelle).
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(data.description)}" />`,
    `<meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}" />`,
    ...(noindex ? [] : [`<link rel="canonical" href="${url}" />`]),
    ...(data.alternates ?? []).map((a) => `<link rel="alternate" hreflang="${a.lang}" href="${absoluteUrl(a.path)}" />`),
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(data.description)}" />`,
    `<meta property="og:image" content="${absoluteUrl(img.src)}" />`,
    `<meta property="og:image:width" content="${img.width}" />`,
    `<meta property="og:image:height" content="${img.height}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(img.alt)}" />`,
    ...(noindex ? [] : [`<meta property="og:url" content="${url}" />`]),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(data.description)}" />`,
    `<meta name="twitter:image" content="${absoluteUrl(img.src)}" />`,
  ]
  if (data.preload) {
    const { image, portrait } = data.preload
    if (portrait) {
      tags.push(
        `<link rel="preload" as="image" type="image/webp" media="(max-width: 767px) and (orientation: portrait)" imagesrcset="${srcSetFor(portrait, 'webp')}" imagesizes="100vw" />`,
      )
      tags.push(
        `<link rel="preload" as="image" type="image/webp" media="(min-width: 768px), (orientation: landscape)" imagesrcset="${srcSetFor(image, 'webp')}" imagesizes="100vw" />`,
      )
    } else {
      tags.push(`<link rel="preload" as="image" type="image/webp" imagesrcset="${srcSetFor(image, 'webp')}" imagesizes="100vw" />`)
    }
  }
  const ld = buildJsonLd(data)
  if (ld) {
    tags.push(`<script id="ld-json" type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`)
  }
  return tags.join('\n    ')
}
