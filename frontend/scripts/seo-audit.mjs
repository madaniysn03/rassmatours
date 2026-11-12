/**
 * Audit SEO du dossier dist/ : titres, descriptions, canonical, robots, H1, alt, liens internes,
 * JSON-LD valide. Usage : node scripts/seo-audit.mjs (après `npm run build`). Code de sortie 1 si problème.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const dist = 'dist'
const pages = []
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f)
    if (statSync(p).isDirectory()) walk(p)
    else if (f === 'index.html' || f === '404.html') pages.push(p)
  }
}
walk(dist)

const toRoute = (p) => '/' + relative(dist, p).split('\\').join('/').replace(/index\.html$/, '')
const routes = new Set(pages.map(toRoute))
const titles = new Map()
const descs = new Map()
const issues = []
let totalLinks = 0
let badLinks = 0
let imgs = 0
let noAlt = 0
let noDims = 0
const sitemap = existsSync(join(dist, 'sitemap.xml')) ? readFileSync(join(dist, 'sitemap.xml'), 'utf8') : ''
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
const robotsTxt = existsSync(join(dist, 'robots.txt')) ? readFileSync(join(dist, 'robots.txt'), 'utf8') : ''
const indexableRoutes = []
const noindexRoutes = []
const canonicalOrigins = new Set()

for (const p of pages) {
  const html = readFileSync(p, 'utf8')
  const route = toRoute(p)
  const is404 = p.endsWith('404.html')
  const title = (html.match(/<title>([^<]*)/) || [])[1] || ''
  const desc = (html.match(/name="description" content="([^"]*)"/) || [])[1] || ''
  const canonical = (html.match(/rel="canonical" href="([^"]*)"/) || [])[1] || ''
  const robots = (html.match(/name="robots" content="([^"]*)"/) || [])[1] || ''
  const h1 = (html.match(/<h1[\s>]/g) || []).length
  const ldBlocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1])
  for (const block of ldBlocks) {
    try {
      JSON.parse(block)
    } catch (e) {
      issues.push(`${route}: invalid JSON-LD (${e.message})`)
    }
  }
  const imgTags = html.match(/<img [^>]*>/g) || []
  imgs += imgTags.length
  noAlt += imgTags.filter((t) => !/ alt="/.test(t)).length
  noDims += imgTags.filter((t) => !/ width="/.test(t) || !/ height="/.test(t)).length
  const links = [...html.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1])
  for (const l of links) {
    if (/^\/(images|assets|fonts|video|favicon|apple-touch-icon|icon-)/.test(l)) continue
    totalLinks++
    const ok = routes.has(l) || routes.has(`${l}/`) || routes.has(l.replace(/\/$/, ''))
    if (!ok) {
      badLinks++
      issues.push(`${route}: link to missing route ${l}`)
    } else if (!l.endsWith('/')) {
      issues.push(`${route}: internal link without trailing slash ${l}`)
    }
  }
  if (!title) issues.push(`${route}: no title`)
  if (!desc) issues.push(`${route}: no description`)
  if (title.length > 65) issues.push(`${route}: title ${title.length} chars (>65)`)
  if (desc.length > 160) issues.push(`${route}: description ${desc.length} chars (>160)`)
  if (h1 !== 1) issues.push(`${route}: ${h1} h1`)
  if (titles.has(title)) issues.push(`${route}: duplicate title with ${titles.get(title)}`)
  titles.set(title, route)
  if (descs.has(desc)) issues.push(`${route}: duplicate description with ${descs.get(desc)}`)
  descs.set(desc, route)
  const indexable = !/noindex/.test(robots)
  if (!is404 && indexable) {
    if (!canonical.endsWith(route)) issues.push(`${route}: canonical ${canonical} does not match route`)
    if (!sitemapUrls.some((u) => u.endsWith(route))) issues.push(`${route}: indexable page missing from sitemap`)
  }
  if (!is404 && !indexable && sitemapUrls.some((u) => u.endsWith(route))) issues.push(`${route}: noindex page listed in sitemap`)
  if (!indexable && canonical) issues.push(`${route}: noindex page declares a canonical (${canonical})`)
  if (!indexable && /property="og:url"/.test(html)) issues.push(`${route}: noindex page declares og:url`)
  if (indexable) indexableRoutes.push(route)
  else noindexRoutes.push(route)
  if (canonical) canonicalOrigins.add(new URL(canonical).origin)
  console.log(`${route.padEnd(36)} title=${String(title.length).padStart(2)}ch desc=${String(desc.length).padStart(3)}ch h1=${h1} ld=${ldBlocks.length} ${robots.padEnd(16)} ${canonical}`)
}

// robots.txt, sitemap et balises robots doivent raconter la même histoire.
const disallows = [...robotsTxt.matchAll(/^Disallow:\s*(\S+)/gim)].map((m) => m[1])
const blocksAll = disallows.includes('/')
if (!robotsTxt) issues.push('robots.txt: missing')
if (blocksAll && indexableRoutes.length) issues.push(`robots.txt: Disallow: / while ${indexableRoutes.length} pages are indexable`)
if (!blocksAll && indexableRoutes.length === 0) issues.push('robots.txt: crawling allowed but every page is noindex (staging build?)')
if (blocksAll && sitemapUrls.length) issues.push('sitemap.xml: lists URLs while robots.txt blocks everything')
for (const r of noindexRoutes) {
  const blocking = disallows.find((d) => d !== '/' && r.startsWith(d))
  if (blocking) issues.push(`robots.txt: Disallow: ${blocking} hides the noindex of ${r} from crawlers`)
}
if (!blocksAll && !/^Sitemap:\s*https:\/\//im.test(robotsTxt)) issues.push('robots.txt: no absolute Sitemap line')
const lastmods = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1])
if (lastmods.length > 1 && new Set(lastmods).size === 1) issues.push(`sitemap.xml: every lastmod is ${lastmods[0]} (build date, not content date)`)
for (const u of sitemapUrls) {
  if (!u.startsWith('https://')) issues.push(`sitemap.xml: non-https URL ${u}`)
  else if (canonicalOrigins.size && !canonicalOrigins.has(new URL(u).origin)) issues.push(`sitemap.xml: ${u} not on the canonical origin`)
}
if (canonicalOrigins.size > 1) issues.push(`canonicals use several origins: ${[...canonicalOrigins].join(', ')}`)

console.log(`\n${pages.length} pages, ${sitemapUrls.length} sitemap URLs, ${totalLinks} internal links (${badLinks} broken), ${imgs} img tags (${noAlt} without alt, ${noDims} without width/height)`)
console.log(issues.length ? `ISSUES (${issues.length}):\n${issues.join('\n')}` : 'No issues')
process.exitCode = issues.length ? 1 : 0
