import { tours } from './data/tours'
import { destinations } from './data/destinations'
import { spainCities } from './data/spain'

export type StaticRoute = { path: string; priority: number; changefreq: string; indexable: boolean }

/**
 * Chemins statiques à prérendre (scripts/prerender.mjs). Convention : minuscules, slash final.
 * Seules les routes `indexable` figurent dans le sitemap.
 */
export const staticPaths: StaticRoute[] = [
  { path: '/', priority: 1, changefreq: 'weekly', indexable: true },
  { path: '/tours/', priority: 0.9, changefreq: 'weekly', indexable: true },
  ...tours.map((t) => ({ path: `/tours/${t.slug}/`, priority: 0.8, changefreq: 'monthly', indexable: true })),
  { path: '/destinations/', priority: 0.7, changefreq: 'monthly', indexable: true },
  ...destinations.map((d) => ({ path: `/destinations/${d.slug}/`, priority: 0.7, changefreq: 'monthly', indexable: true })),
  { path: '/day-trips-from-spain/', priority: 0.9, changefreq: 'monthly', indexable: true },
  ...spainCities.filter((c) => c.hasPage).map((c) => ({ path: `/day-trips-from-spain/${c.slug}/`, priority: 0.8, changefreq: 'monthly', indexable: true })),
  { path: '/tangier-ferry-guide/', priority: 0.8, changefreq: 'monthly', indexable: true },
  { path: '/about/', priority: 0.6, changefreq: 'monthly', indexable: true },
  { path: '/faq/', priority: 0.7, changefreq: 'monthly', indexable: true },
  { path: '/contact/', priority: 0.8, changefreq: 'monthly', indexable: true },
  { path: '/privacy/', priority: 0.1, changefreq: 'yearly', indexable: false },
]

/** Anciennes URL (v1 du site et site existant) redirigées de façon permanente. */
export const legacyRedirects: { from: string; to: string }[] = [
  { from: '/experiences', to: '/tours/' },
  { from: '/experiences/tangier-highlights', to: '/tours/cap-spartel-hercules-caves/' },
  ...tours.filter((t) => t.slug !== 'cap-spartel-hercules-caves').map((t) => ({ from: `/experiences/${t.slug}`, to: `/tours/${t.slug}/` })),
  { from: '/tours/tangier-highlights', to: '/tours/cap-spartel-hercules-caves/' },
]
