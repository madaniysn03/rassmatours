/**
 * Service optionnel du site construit (FRONTEND_DIR = frontend/dist), avec le comportement d'un hébergeur statique :
 * redirections 301 de _redirects, slash final canonique, 404.html avec le statut 404, en-têtes de _headers,
 * cache long pour /assets/ et /fonts/, compression gzip du texte, requêtes partielles (Range) pour les vidéos.
 * Inutile si nginx ou Apache sert le site et ne relaie que /api/ vers ce serveur.
 */
import { createReadStream, existsSync, readFileSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, join, normalize, sep } from 'node:path'
import { Readable } from 'node:stream'
import { createGzip } from 'node:zlib'
import type { Context } from 'hono'

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
}
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.svg', '.xml', '.txt', '.json'])

type HeaderRule = { pattern: RegExp; headers: [string, string][] }

/** Lit dist/_headers (format Netlify/Cloudflare : un chemin, puis des lignes indentées « Nom: valeur »). */
function parseHeaders(file: string): HeaderRule[] {
  if (!existsSync(file)) return []
  const rules: HeaderRule[] = []
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    if (!/^\s/.test(line)) {
      const glob = line.trim().replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')
      rules.push({ pattern: new RegExp(`^${glob}$`), headers: [] })
    } else if (rules.length) {
      const i = line.indexOf(':')
      if (i > 0) rules[rules.length - 1].headers.push([line.slice(0, i).trim(), line.slice(i + 1).trim()])
    }
  }
  return rules
}

export function createStaticHandler(dist: string) {
  const redirects = existsSync(join(dist, '_redirects'))
    ? readFileSync(join(dist, '_redirects'), 'utf8')
        .split(/\r?\n/)
        .map((l) => l.trim().split(/\s+/))
        .filter((p) => p.length === 3 && p[2] === '301')
        .map(([from, to]) => ({ from, to }))
    : []
  const headerRules = parseHeaders(join(dist, '_headers'))
  const isFile = async (p: string) => {
    try {
      return (await stat(p)).isFile()
    } catch {
      return false
    }
  }

  return async (c: Context) => {
    const url = new URL(c.req.url)
    let pathname: string
    try {
      pathname = decodeURIComponent(url.pathname)
    } catch {
      return c.text('Bad request', 400)
    }
    const redirect = redirects.find((r) => r.from === pathname)
    if (redirect) return c.redirect(redirect.to + url.search, 301)

    const direct = join(dist, normalize(pathname).replace(/^(\.\.[/\\])+/, ''))
    if (!direct.startsWith(dist + sep) && direct !== dist) return c.text('Not found', 404)
    if (!pathname.endsWith('/') && !extname(pathname) && (await isFile(join(direct, 'index.html')))) {
      return c.redirect(`${pathname}/${url.search}`, 301)
    }
    let file: string | null = null
    for (const candidate of [direct, join(direct, 'index.html')]) {
      if (await isFile(candidate)) {
        file = candidate
        break
      }
    }
    const status = file ? 200 : 404
    file ??= join(dist, '404.html')
    const ext = extname(file)

    const headers = new Headers({
      'Content-Type': TYPES[ext] ?? 'application/octet-stream',
      'Cache-Control': /^\/(assets|fonts)\//.test(pathname) ? 'public, max-age=31536000, immutable' : 'no-cache',
      Vary: 'Accept-Encoding',
    })
    for (const rule of headerRules) if (rule.pattern.test(pathname)) for (const [k, v] of rule.headers) headers.set(k, v)

    const size = (await stat(file)).size
    const gzip = COMPRESSIBLE.has(ext) && /\bgzip\b/.test(c.req.header('accept-encoding') ?? '')
    const range = status === 200 && !gzip ? /^bytes=(\d*)-(\d*)$/.exec(c.req.header('range') ?? '') : null
    if (range) {
      const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]))
      const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1
      if (start >= size || start > end) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } })
      headers.set('Accept-Ranges', 'bytes')
      headers.set('Content-Range', `bytes ${start}-${end}/${size}`)
      headers.set('Content-Length', String(end - start + 1))
      return new Response(Readable.toWeb(createReadStream(file, { start, end })) as ReadableStream, { status: 206, headers })
    }
    if (c.req.method === 'HEAD') return new Response(null, { status, headers })
    if (gzip) {
      headers.set('Content-Encoding', 'gzip')
      return new Response(Readable.toWeb(createReadStream(file).pipe(createGzip())) as ReadableStream, { status, headers })
    }
    headers.set('Accept-Ranges', 'bytes')
    headers.set('Content-Length', String(size))
    return new Response(Readable.toWeb(createReadStream(file)) as ReadableStream, { status, headers })
  }
}
