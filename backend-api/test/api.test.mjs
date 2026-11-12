/**
 * Tests de bout en bout de l'API : un vrai serveur est lancé sur un port libre avec un dossier de données temporaire.
 * Usage : npm test (dans backend-api/).
 */
import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:net'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PASSWORD = 'test-password-123'
let server
let base
let dataDir
let cookie = ''

const freePort = () =>
  new Promise((ok) => {
    const s = createServer().listen(0, () => {
      const { port } = s.address()
      s.close(() => ok(port))
    })
  })

before(async () => {
  dataDir = await mkdtemp(join(tmpdir(), 'rassma-api-'))
  const port = await freePort()
  base = `http://127.0.0.1:${port}`
  server = spawn(process.execPath, ['--import', 'tsx', 'src/server.ts'], {
    cwd: root,
    env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', DATA_DIR: dataDir, ADMIN_PASSWORD: PASSWORD, ADMIN_SESSION_SECRET: 'secret-for-tests', FRONTEND_DIR: '', INQUIRY_RATE_LIMIT: '3' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  await new Promise((ok, ko) => {
    server.stdout.on('data', (d) => d.toString().includes('/api/') && ok())
    server.stderr.on('data', (d) => process.stderr.write(d))
    server.on('exit', (code) => ko(new Error(`server exited ${code}`)))
  })
})

after(async () => {
  server?.kill()
  await rm(dataDir, { recursive: true, force: true })
})

const api = (path, init = {}) => fetch(base + path, { ...init, headers: { ...(cookie ? { Cookie: cookie } : {}), ...init.headers } })
const admin = (path, init = {}) => api(path, { ...init, headers: { 'X-Admin-Request': '1', ...init.headers } })
const json = (body) => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

test('health', async () => {
  assert.deepEqual(await (await api('/api/health')).json(), { ok: true })
  assert.equal((await api('/api/nope')).status, 404)
})

test('contact form', async () => {
  const ok = await api('/api/inquiry', json({ name: 'Guest One', email: 'guest@example.com', tour: 'Asilah', travelers: '2', message: 'Hello' }))
  assert.equal(ok.status, 201)
  assert.equal((await api('/api/inquiry', json({ name: 'Bot', email: 'b@x.io', company: 'spam' }))).status, 200)
  assert.equal((await api('/api/inquiry', json({ name: 'X', email: 'not-an-email' }))).status, 400)
  assert.equal((await api('/api/inquiry', json({ name: 'Guest', email: 'g@example.com', message: 'x'.repeat(2001) }))).status, 400)
})

test('admin login and session', async () => {
  assert.equal((await api('/api/admin/messages')).status, 401)
  assert.equal((await api('/api/admin/login', json({ password: 'wrong' }))).status, 401)
  const res = await api('/api/admin/login', json({ password: PASSWORD }))
  assert.equal(res.status, 200)
  const setCookie = res.headers.get('set-cookie')
  assert.match(setCookie, /HttpOnly/)
  assert.match(setCookie, /SameSite=Strict/)
  cookie = setCookie.split(';')[0]
  assert.deepEqual(await (await api('/api/admin/session')).json(), { signedIn: true, configured: true })
  const forged = await fetch(base + '/api/admin/messages', { headers: { Cookie: 'rt_admin=99999999999999.abc' } })
  assert.equal(forged.status, 401)
})

test('messages', async () => {
  const { messages } = await (await api('/api/admin/messages')).json()
  assert.equal(messages.length, 1, 'honeypot and invalid submissions are not stored')
  const id = messages[0].id
  assert.equal((await api(`/api/admin/messages/${id}`, { method: 'PATCH', body: '{"read":true}' })).status, 403, 'needs X-Admin-Request')
  const patched = await (await admin(`/api/admin/messages/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: '{"read":true}' })).json()
  assert.equal(patched.message.read, true)
  assert.equal((await admin('/api/admin/messages/../../etc', { method: 'DELETE' })).status, 404)
  assert.equal((await admin(`/api/admin/messages/${id}`, { method: 'DELETE' })).status, 200)
  assert.equal((await (await api('/api/admin/messages')).json()).messages.length, 0)
})

test('gallery', async () => {
  assert.deepEqual((await (await api('/api/gallery')).json()).items, [], 'empty until initialised')
  assert.equal((await admin('/api/admin/gallery/init', { ...json({ items: [{ id: 'static-x', kind: 'image', source: 'static', src: '/etc/passwd', alt: 'x', width: 1, height: 1, row: 0 }] }), headers: { 'X-Admin-Request': '1', 'Content-Type': 'application/json' } })).status, 400)
  const seed = [
    { id: 'static-a', kind: 'image', source: 'static', src: '/images/gallery/a.jpg', alt: 'A', width: 1200, height: 900, row: 0 },
    { id: 'static-v', kind: 'video', source: 'static', src: '/video/v.mp4', poster: '/video/v.jpg', alt: 'V', width: 540, height: 960, row: 1 },
  ]
  const init = await admin('/api/admin/gallery/init', { method: 'POST', headers: { 'X-Admin-Request': '1', 'Content-Type': 'application/json' }, body: JSON.stringify({ items: seed }) })
  assert.equal(init.status, 201)

  const png = new Uint8Array([0xff, 0xd8, 0xff, 0xd9])
  const form = new FormData()
  form.set('file', new Blob([png], { type: 'image/jpeg' }), 'p.jpg')
  form.set('small', new Blob([png], { type: 'image/jpeg' }), 'p-small.jpg')
  form.set('width', '800')
  form.set('height', '600')
  form.set('alt', 'Uploaded photo')
  form.set('row', '1')
  const up = await admin('/api/admin/gallery', { method: 'POST', body: form })
  assert.equal(up.status, 201)
  const { item, manifest } = await up.json()
  assert.equal(manifest.items.length, 3)
  const img = await api(item.src)
  assert.equal(img.status, 200)
  assert.equal(img.headers.get('content-type'), 'image/jpeg')

  const reordered = manifest.items.map((m) => ({ id: m.id, alt: m.id === 'static-a' ? 'A edited' : m.alt, row: m.row })).reverse()
  const put = await (await admin('/api/admin/gallery', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: reordered }) })).json()
  assert.deepEqual(put.manifest.items.map((m) => m.id), reordered.map((m) => m.id), 'order saved')
  assert.equal(put.manifest.items.find((m) => m.id === 'static-a').alt, 'A edited')

  assert.equal((await admin(`/api/admin/gallery/${item.id}`, { method: 'DELETE' })).status, 200)
  assert.equal((await api(item.src)).status, 404)
  assert.equal((await (await api('/api/gallery')).json()).items.length, 2)
})

test('contact form rate limit', async () => {
  const send = () => api('/api/inquiry', json({ name: 'Guest', email: 'g@example.com' }))
  const statuses = []
  for (let i = 0; i < 4; i++) statuses.push((await send()).status)
  assert.ok(statuses.includes(429), `expected a 429 after the limit, got ${statuses}`)
})

test('logout', async () => {
  const res = await api('/api/admin/logout', { method: 'POST' })
  assert.match(res.headers.get('set-cookie'), /Max-Age=0/)
})
