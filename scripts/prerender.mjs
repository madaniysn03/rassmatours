/**
 * Prérendu statique : un index.html par route dans dist/, plus sitemap.xml, robots.txt et 404.html.
 * Lancé par `npm run build` après le build client (dist/) et le build SSR (dist-ssr/).
 *
 * Variables d’environnement lues au build (résolues par Vite : .env, .env.production ou shell) :
 * - VITE_SITE_URL : domaine public (canonical, sitemap). Obligatoire, sauf en recette : le build échoue sinon.
 * - VITE_NOINDEX=true : environnement de recette, tout est noindex et robots.txt interdit l’exploration.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const ssrEntry = join(root, 'dist-ssr', 'entry-server.js')

const template = await readFile(join(dist, 'index.html'), 'utf8')
const { render, staticPaths, legacyRedirects, siteConfig, buildEnv } = await import(pathToFileURL(ssrEntry).href)

const siteUrl = siteConfig.url.replace(/\/$/, '')
const noindexAll = buildEnv.noindexAll

// Un build indexable sans domaine explicite publierait des canonical vers l’URL de repli : on l’interdit.
const siteUrlError = !buildEnv.siteUrl
  ? 'VITE_SITE_URL is not set'
  : !/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}\/?$/i.test(buildEnv.siteUrl)
    ? `VITE_SITE_URL must be an https origin without a path (got "${buildEnv.siteUrl}")`
    : null
if (siteUrlError && !noindexAll) {
  console.error(`\n[prerender] ERROR: ${siteUrlError}. Set it to the production origin, or set VITE_NOINDEX=true for a staging build.\n`)
  process.exit(1)
}
if (siteUrlError) console.warn(`\n[prerender] WARNING: ${siteUrlError}; staging build (VITE_NOINDEX=true) continues with ${siteUrl}.\n`)

let count = 0
for (const route of staticPaths) {
  const { html, head } = render(route.path)
  const page = template.replace('<!--app-head-->', head).replace('<!--app-html-->', html)
  const outDir = route.path === '/' ? dist : join(dist, route.path)
  await mkdir(outDir, { recursive: true })
  await writeFile(join(outDir, 'index.html'), page, 'utf8')
  count += 1
}

// Page 404 : les hébergeurs statiques servent 404.html avec le statut 404.
const notFound = render('/404')
await writeFile(join(dist, '404.html'), template.replace('<!--app-head-->', notFound.head).replace('<!--app-html-->', notFound.html), 'utf8')

// Pas de <lastmod> : la date du build n’est pas la date de modification du contenu,
// et Google ignore un lastmod systématiquement inexact.
const indexable = noindexAll ? [] : staticPaths.filter((r) => r.indexable)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable
  .map(
    (r) => `  <url>
    <loc>${siteUrl}${r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`
await writeFile(join(dist, 'sitemap.xml'), sitemap, 'utf8')

const robots = noindexAll
  ? `# Environnement de recette : exploration interdite (VITE_NOINDEX=true)\nUser-agent: *\nDisallow: /\n`
  : // /privacy/ reste explorable : un Disallow empêcherait Google de lire son noindex.
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
await writeFile(join(dist, 'robots.txt'), robots, 'utf8')

// Redirections pour Netlify (_redirects) ; vercel.json est maintenu à la racine du projet.
const redirects = [
  ...legacyRedirects.map((r) => `${r.from}  ${r.to}  301`),
  ...legacyRedirects.map((r) => `${r.from}/  ${r.to}  301`),
  `/*  /404.html  404`,
]
await writeFile(join(dist, '_redirects'), `${redirects.join('\n')}\n`, 'utf8')

await rm(join(root, 'dist-ssr'), { recursive: true, force: true })
console.log(`Prerendered ${count} pages + 404.html, sitemap.xml (${indexable.length} URLs), robots.txt${noindexAll ? ' [NOINDEX]' : ''} and _redirects into dist/`)
