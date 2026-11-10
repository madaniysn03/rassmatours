import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Wordmark } from '../components/Wordmark'
import { Button } from '../components/Button'
import { adminApi, ApiError, prepareImage, type AdminMessage } from '../lib/admin-api'
import type { ManifestItem } from '../lib/gallery-manifest'
import { useHead } from '../lib/head'

type Session = 'loading' | 'signed-out' | 'signed-in' | 'unavailable' | 'not-configured'

/**
 * Espace d'administration (/admin/, noindex) : messages du formulaire de contact et galerie de la page Tours.
 * Tout se passe côté navigateur ; le HTML prérendu n'est qu'un écran de chargement.
 */
export function Admin() {
  useHead({ title: 'Admin', description: 'Rassma Tours administration.', path: '/admin/', noindex: true })
  const [session, setSession] = useState<Session>('loading')
  const [tab, setTab] = useState<'messages' | 'gallery'>('messages')

  const refreshSession = useCallback(() => {
    adminApi
      .session()
      .then((s) => setSession(!s.configured ? 'not-configured' : s.signedIn ? 'signed-in' : 'signed-out'))
      .catch(() => setSession('unavailable'))
  }, [])
  useEffect(refreshSession, [refreshSession])

  const onAuthError = useCallback((e: unknown) => {
    if (e instanceof ApiError && e.status === 401) setSession('signed-out')
  }, [])

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <header className="border-b border-line bg-paper">
        <div className="wrap flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Wordmark tone="ink" size="sm" />
            <span className="eyebrow-plain text-[11px] text-ink-mute">Admin</span>
          </div>
          {session === 'signed-in' && (
            <button
              type="button"
              className="text-[13px] text-ink-soft underline-offset-4 hover:underline"
              onClick={() => adminApi.logout().finally(() => setSession('signed-out'))}
            >
              Sign out
            </button>
          )}
        </div>
      </header>

      <main className="wrap py-10 lg:py-14">
        <h1 className="display-sm">{session === 'signed-in' ? (tab === 'messages' ? 'Contact messages' : 'Tours gallery') : 'Rassma Tours admin'}</h1>

        {session === 'loading' && <p className="mt-6 text-ink-soft">Loading…</p>}
        {session === 'unavailable' && (
          <Notice>The admin API is not reachable. On your computer, start the site with “npx netlify dev”; online, check that the Netlify Functions are deployed.</Notice>
        )}
        {session === 'not-configured' && <Notice>Set the ADMIN_PASSWORD environment variable on Netlify (at least 8 characters), then redeploy.</Notice>}
        {session === 'signed-out' && <Login onSignedIn={() => setSession('signed-in')} />}

        {session === 'signed-in' && (
          <>
            <nav className="mt-6 flex gap-2" aria-label="Admin sections">
              {(['messages', 'gallery'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  aria-current={tab === t ? 'page' : undefined}
                  className={`rounded-full px-5 py-2 text-[13px] font-medium uppercase tracking-[0.14em] ring-1 transition-colors ${tab === t ? 'bg-midnight text-ivory ring-midnight' : 'text-ink ring-line hover:bg-ink/5'}`}
                >
                  {t === 'messages' ? 'Messages' : 'Gallery'}
                </button>
              ))}
            </nav>
            <div className="mt-8">{tab === 'messages' ? <Messages onAuthError={onAuthError} /> : <Gallery onAuthError={onAuthError} />}</div>
          </>
        )}
      </main>
    </div>
  )
}

function Notice({ children, tone = 'info' }: { children: React.ReactNode; tone?: 'info' | 'error' }) {
  return (
    <p role={tone === 'error' ? 'alert' : 'status'} className={`mt-6 max-w-2xl rounded-xl px-4 py-3 text-sm ${tone === 'error' ? 'bg-clay-soft text-clay-deep' : 'bg-sand/70 text-ink-soft'}`}>
      {children}
    </p>
  )
}

function Login({ onSignedIn }: { onSignedIn: () => void }) {
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      await adminApi.login(password)
      onSignedIn()
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Sign-in failed')
    } finally {
      setBusy(false)
    }
  }
  return (
    <form onSubmit={submit} className="mt-8 max-w-sm rounded-2xl bg-paper p-6 shadow-card">
      <label htmlFor="admin-password" className="label">
        Password
      </label>
      <input id="admin-password" type="password" className="field" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {err && <Notice tone="error">{err}</Notice>}
      <Button type="submit" variant="midnight" className="mt-5 w-full" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}

// --- Messages ------------------------------------------------------------------------------------

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

function Messages({ onAuthError }: { onAuthError: (e: unknown) => void }) {
  const [messages, setMessages] = useState<AdminMessage[] | null>(null)
  const [err, setErr] = useState('')

  const load = useCallback(() => {
    adminApi
      .messages()
      .then((r) => setMessages(r.messages))
      .catch((e) => {
        onAuthError(e)
        setErr(e instanceof Error ? e.message : 'Could not load messages')
      })
  }, [onAuthError])
  useEffect(load, [load])

  const toggleRead = async (m: AdminMessage) => {
    try {
      const { message } = await adminApi.markRead(m.id, !m.read)
      setMessages((list) => list?.map((x) => (x.id === m.id ? message : x)) ?? null)
    } catch (e) {
      onAuthError(e)
    }
  }
  const remove = async (m: AdminMessage) => {
    if (!window.confirm(`Delete the message from ${m.name}? This cannot be undone.`)) return
    try {
      await adminApi.deleteMessage(m.id)
      setMessages((list) => list?.filter((x) => x.id !== m.id) ?? null)
    } catch (e) {
      onAuthError(e)
    }
  }

  if (err) return <Notice tone="error">{err}</Notice>
  if (!messages) return <p className="text-ink-soft">Loading messages…</p>
  if (messages.length === 0) return <Notice>No messages yet. Requests sent from the contact form will appear here.</Notice>

  const unread = messages.filter((m) => !m.read).length
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-ink-soft">
          {messages.length} message{messages.length > 1 ? 's' : ''}
          {unread > 0 && ` · ${unread} unread`}
        </p>
        <button type="button" onClick={load} className="text-[13px] text-ink-soft underline-offset-4 hover:underline">
          Refresh
        </button>
      </div>
      <ul className="mt-4 space-y-4">
        {messages.map((m) => {
          const reply = `Hello ${m.name.split(' ')[0]}, thank you for your request to Rassma Tours.`
          return (
            <li key={m.id} className={`rounded-2xl bg-paper p-5 shadow-card sm:p-6 ${m.read ? 'opacity-75' : 'ring-2 ring-brass/60'}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="font-display text-2xl">
                  {!m.read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-clay align-middle" aria-label="Unread" />}
                  {m.name}
                </h2>
                <time dateTime={m.createdAt} className="text-[13px] text-ink-mute">
                  {formatDate(m.createdAt)}
                </time>
              </div>
              <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                <Info label="Email" value={<a className="underline" href={`mailto:${m.email}`}>{m.email}</a>} />
                {m.phone && <Info label="Phone / WhatsApp" value={m.phone} />}
                <Info label="Tour" value={m.tour || 'Not decided yet'} />
                <Info label="Travel date" value={m.date || '—'} />
                <Info label="Travellers" value={m.travelers} />
              </dl>
              {m.message && <p className="mt-4 whitespace-pre-line rounded-xl bg-ivory p-4 text-[15px] leading-relaxed">{m.message}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button href={`mailto:${m.email}?subject=${encodeURIComponent('Your trip with Rassma Tours')}&body=${encodeURIComponent(reply)}`} size="sm" variant="midnight">
                  Reply by email
                </Button>
                {m.phone && (
                  <Button href={`https://wa.me/${m.phone.replace(/\D/g, '')}?text=${encodeURIComponent(reply)}`} target="_blank" rel="noopener noreferrer" size="sm" variant="outline">
                    WhatsApp
                  </Button>
                )}
                <Button type="button" size="sm" variant="outline" onClick={() => toggleRead(m)}>
                  {m.read ? 'Mark as unread' : 'Mark as read'}
                </Button>
                <Button type="button" size="sm" variant="outline" className="!text-clay-deep" onClick={() => remove(m)}>
                  Delete
                </Button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <dt className="text-ink-mute">{label}:</dt>
      <dd className="min-w-0 break-words">{value}</dd>
    </div>
  )
}

// --- Galerie -------------------------------------------------------------------------------------

function Gallery({ onAuthError }: { onAuthError: (e: unknown) => void }) {
  const [items, setItems] = useState<ManifestItem[] | null>(null)
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ tone: 'info' | 'error'; text: string } | null>(null)

  const fail = useCallback(
    (e: unknown) => {
      onAuthError(e)
      setMsg({ tone: 'error', text: e instanceof Error ? e.message : 'Something went wrong' })
    },
    [onAuthError],
  )

  useEffect(() => {
    adminApi
      .gallery()
      .then((m) => setItems(m.items))
      .catch(fail)
  }, [fail])

  const update = (id: string, patch: Partial<ManifestItem>) => {
    setItems((list) => list?.map((m) => (m.id === id ? { ...m, ...patch } : m)) ?? null)
    setDirty(true)
  }
  const move = (index: number, delta: number) => {
    setItems((list) => {
      if (!list) return list
      const next = [...list]
      const target = index + delta
      if (target < 0 || target >= next.length) return list
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
    setDirty(true)
  }
  const save = async () => {
    if (!items) return
    setBusy(true)
    try {
      const m = await adminApi.saveGallery(items.map(({ id, alt, row }) => ({ id, alt, row })))
      setItems(m.items)
      setDirty(false)
      setMsg({ tone: 'info', text: 'Gallery saved. The Tours page shows the changes within a minute.' })
    } catch (e) {
      fail(e)
    } finally {
      setBusy(false)
    }
  }
  const remove = async (item: ManifestItem) => {
    const extra = item.source === 'static' ? ' It stays in the website files and can be added back by a developer.' : ' The uploaded file is deleted.'
    if (!window.confirm(`Remove this ${item.kind} from the gallery?${extra}`)) return
    setBusy(true)
    try {
      const m = await adminApi.deleteGalleryItem(item.id)
      setItems(m.items)
      setMsg({ tone: 'info', text: 'Removed from the gallery.' })
    } catch (e) {
      fail(e)
    } finally {
      setBusy(false)
    }
  }

  if (!items) return msg ? <Notice tone={msg.tone}>{msg.text}</Notice> : <p className="text-ink-soft">Loading gallery…</p>

  return (
    <div>
      <Upload
        disabled={busy}
        onUploaded={(list) => {
          setItems(list)
          setDirty(false)
          setMsg({ tone: 'info', text: 'Photo added at the start of its row.' })
        }}
        onError={fail}
      />

      <div className="sticky top-0 z-10 -mx-4 mt-10 flex flex-wrap items-center justify-between gap-3 bg-ivory/95 px-4 py-3 backdrop-blur">
        <p className="text-sm text-ink-soft">
          {items.length} items · row 1 scrolls left, row 2 scrolls right · order = order on the page
        </p>
        <Button type="button" variant="midnight" size="sm" onClick={save} disabled={!dirty || busy}>
          {dirty ? 'Save changes' : 'Saved'}
        </Button>
      </div>
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}

      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m, i) => (
          <li key={m.id} className="flex flex-col overflow-hidden rounded-2xl bg-paper shadow-card">
            <div className="relative aspect-[4/3] bg-sand">
              {m.kind === 'video' ? (
                <video src={m.src} poster={m.poster} muted playsInline controls preload="none" className="h-full w-full object-cover" />
              ) : (
                <img src={m.small ?? m.src} alt="" loading="lazy" className="h-full w-full object-cover" />
              )}
              <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em]">
                {m.kind === 'video' ? 'Video' : m.source === 'upload' ? 'Uploaded' : 'Photo'} · #{i + 1}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div>
                <label htmlFor={`alt-${m.id}`} className="label">
                  Description (for Google and screen readers)
                </label>
                <textarea id={`alt-${m.id}`} className="field min-h-20 text-sm" value={m.alt} maxLength={300} onChange={(e) => update(m.id, { alt: e.target.value })} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label htmlFor={`row-${m.id}`} className="sr-only">
                  Row
                </label>
                <select id={`row-${m.id}`} className="field !w-auto !py-2 text-sm" value={m.row} onChange={(e) => update(m.id, { row: e.target.value === '1' ? 1 : 0 })}>
                  <option value={0}>Row 1</option>
                  <option value={1}>Row 2</option>
                </select>
                <IconButton label="Move earlier" onClick={() => move(i, -1)} disabled={i === 0}>
                  ←
                </IconButton>
                <IconButton label="Move later" onClick={() => move(i, 1)} disabled={i === items.length - 1}>
                  →
                </IconButton>
                <button type="button" onClick={() => remove(m)} disabled={busy} className="ml-auto text-[13px] text-clay-deep underline-offset-4 hover:underline disabled:opacity-50">
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function IconButton({ label, children, ...rest }: { label: string; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" aria-label={label} title={label} className="h-9 w-9 rounded-full text-ink ring-1 ring-line hover:bg-ink/5 disabled:opacity-30" {...rest}>
      {children}
    </button>
  )
}

function Upload({ disabled, onUploaded, onError }: { disabled: boolean; onUploaded: (items: ManifestItem[]) => void; onError: (e: unknown) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [alt, setAlt] = useState('')
  const [row, setRow] = useState<0 | 1>(0)
  const [busy, setBusy] = useState(false)
  // Change de clé pour vider le champ fichier après un envoi.
  const [inputKey, setInputKey] = useState(0)

  const choose = (next: File | null) => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(next)
    setPreview(next ? URL.createObjectURL(next) : '')
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!file) return
    setBusy(true)
    try {
      const { full, small } = await prepareImage(file)
      const ext = full.blob.type === 'image/webp' ? 'webp' : 'jpg'
      const form = new FormData()
      form.set('file', full.blob, `photo.${ext}`)
      form.set('small', small.blob, `photo-small.${ext}`)
      form.set('width', String(full.width))
      form.set('height', String(full.height))
      form.set('alt', alt)
      form.set('row', String(row))
      const { manifest } = await adminApi.uploadGalleryImage(form)
      onUploaded(manifest.items)
      choose(null)
      setAlt('')
      setInputKey((k) => k + 1)
    } catch (e) {
      onError(e)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-2xl bg-paper p-5 shadow-card sm:p-6 md:grid-cols-[220px_1fr]">
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-sand">
        {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-ink-mute">No photo selected</div>}
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-2xl">Add a photo</h2>
        <div>
          <label htmlFor="gallery-file" className="label">
            Photo (JPEG, PNG or WebP)
          </label>
          <input key={inputKey} id="gallery-file" type="file" accept="image/jpeg,image/png,image/webp" className="block text-sm" onChange={(e) => choose(e.target.files?.[0] ?? null)} required />
        </div>
        <div>
          <label htmlFor="gallery-alt" className="label">
            Description (required)
          </label>
          <input id="gallery-alt" className="field text-sm" value={alt} maxLength={300} placeholder="e.g. Guests on a camel ride on the Atlantic beach" onChange={(e) => setAlt(e.target.value)} required />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="gallery-row" className="sr-only">
            Row
          </label>
          <select id="gallery-row" className="field !w-auto !py-2 text-sm" value={row} onChange={(e) => setRow(e.target.value === '1' ? 1 : 0)}>
            <option value={0}>Row 1</option>
            <option value={1}>Row 2</option>
          </select>
          <Button type="submit" variant="midnight" size="sm" disabled={!file || !alt.trim() || busy || disabled}>
            {busy ? 'Uploading…' : 'Upload photo'}
          </Button>
        </div>
      </div>
    </form>
  )
}
