/**
 * Serveur statique minimal reproduisant un hébergeur : slash final canonique (301), redirections
 * de dist/_redirects, compression gzip des ressources texte, cache long pour assets/ et fonts/,
 * fichiers servis tels quels, sinon dist/404.html avec le statut 404.
 * Usage : node scripts/serve.mjs [port]  (par défaut 5175)
 */
import { createServer } from 'node:http'
import { createReadStream, existsSync, readFileSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import { dirname, extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createGzip } from 'node:zlib'

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const port = Number(process.argv[2] ?? process.env.PORT ?? 5175)

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
}
const compressible = new Set(['.html', '.js', '.css', '.svg', '.xml', '.txt', '.json'])

const redirects = existsSync(join(dist, '_redirects'))
  ? readFileSync(join(dist, '_redirects'), 'utf8')
      .split('\n')
      .map((l) => l.trim().split(/\s+/))
      .filter((p) => p.length === 3 && p[2] === '301')
      .map(([from, to]) => ({ from, to }))
  : []

const isFile = async (p) => {
  try {
    return (await stat(p)).isFile()
  } catch {
    return false
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const pathname = decodeURIComponent(url.pathname)
  const redirect = redirects.find((r) => r.from === pathname)
  if (redirect) {
    res.writeHead(301, { Location: redirect.to + url.search })
    res.end()
    return
  }
  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '')
  const direct = join(dist, safe)
  // Slash final canonique : /about -> /about/ quand un index existe.
  if (!pathname.endsWith('/') && !extname(pathname) && (await isFile(join(direct, 'index.html')))) {
    res.writeHead(301, { Location: `${pathname}/${url.search}` })
    res.end()
    return
  }
  let file = null
  for (const c of [direct, join(direct, 'index.html')]) {
    if (c.startsWith(dist) && (await isFile(c))) {
      file = c
      break
    }
  }
  const status = file ? 200 : 404
  if (!file) file = join(dist, '404.html')
  const ext = extname(file)
  const immutable = /^\/(assets|fonts)\//.test(pathname)
  const gzip = compressible.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '')
  const headers = {
    'Content-Type': types[ext] ?? 'application/octet-stream',
    'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
    Vary: 'Accept-Encoding',
  }
  // Requêtes partielles (Range) pour les médias : indispensables au défilement dans une vidéo.
  const range = status === 200 && !gzip ? /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '') : null
  if (range) {
    const size = (await stat(file)).size
    const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]))
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1
    if (start >= size || start > end) {
      res.writeHead(416, { 'Content-Range': `bytes */${size}` })
      res.end()
      return
    }
    res.writeHead(206, { ...headers, 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 })
    createReadStream(file, { start, end }).pipe(res)
    return
  }
  res.writeHead(status, { ...headers, ...(gzip ? { 'Content-Encoding': 'gzip' } : { 'Accept-Ranges': 'bytes' }) })
  const stream = createReadStream(file)
  if (gzip) stream.pipe(createGzip()).pipe(res)
  else stream.pipe(res)
}).listen(port, () => {
  console.log(`Static preview of dist/ at http://localhost:${port}`)
})
