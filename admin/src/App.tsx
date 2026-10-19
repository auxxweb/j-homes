import { createContext, Fragment, useContext, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  api,
  isSuper,
  savedSiteId,
  saveSiteId,
  setToken,
  token,
  type ChecklistAnswer,
  type ChecklistRecord,
  type EnquiryRecord,
  type EntryRecord,
  type MediaRecord,
  type PageContent,
  type PageRecord,
  type Site,
  type User,
} from './api'
import { ChatPage, KnowledgePage, UsersPage } from './assistant'
import { Editor } from './editor'
import { collections, contentGroups, schemaFor } from './schema'

interface SiteState {
  site?: Site
  sites: Site[]
  setSiteId: (id: string) => void
}

const SiteContext = createContext<SiteState>({ sites: [], setSiteId: () => undefined })

function useSiteState() {
  return useContext(SiteContext)
}

export function AdminApp() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!token()) {
      setReady(true)
      return
    }
    api<{ user: User }>('/api/auth/me')
      .then((result) => setUser(result.user))
      .catch(() => setToken(''))
      .finally(() => setReady(true))
  }, [])

  if (!ready) return <p className="content note">Opening the admin panel…</p>
  if (!user) return <Login onSuccess={setUser} />

  return <Shell user={user} onSignOut={() => { setToken(''); setUser(null) }} />
}

function Login({ onSuccess }: { onSuccess: (user: User) => void }) {
  const [email, setEmail] = useState('admin@jhomes.in')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const result = await api<{ token: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setToken(result.token)
      onSuccess(result.user)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Sign in failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="login">
      <aside className="login-aside">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 style={{ fontSize: '4rem', marginTop: 16 }}>Edit the website.</h1>
        </div>
        <p style={{ maxWidth: 360, color: '#b7aea3' }}>Pages, photographs, project cards and enquiries. Staff can also sign in here to ask about policies, process and quotes.</p>
      </aside>
      <section className="login-panel">
        <form className="card login-card stack" onSubmit={submit}>
          <div>
            <p className="eyebrow">Sign in</p>
            <h2 className="serif" style={{ fontSize: '2.2rem', marginTop: 8 }}>J Homes Admin</h2>
          </div>
          <label className="field">
            <span>Email</span>
            <input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button className="btn accent" disabled={busy} type="submit">{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </section>
    </main>
  )
}

function Shell({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  const [open, setOpen] = useState(false)
  const sites = useSites()
  const [siteId, setSiteId] = useState(savedSiteId())
  const site = sites.find((item) => item._id === siteId) || sites[0]

  useEffect(() => {
    if (site && site._id !== siteId) {
      setSiteId(site._id)
      saveSiteId(site._id)
    }
  }, [site, siteId])

  const value = useMemo(() => ({ site, sites, setSiteId: (id: string) => { setSiteId(id); saveSiteId(id) } }), [site, sites])
  const superUser = isSuper(user)

  return (
    <SiteContext.Provider value={value}>
      <div className="shell">
        {open ? <button className="backdrop" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}
        <aside className={`sidebar ${open ? 'drawer' : 'closed'}`}>
          <div className="brand">
            <img src="/icons/icon-192.png" alt="" />
            <div>
              <strong>J Homes</strong>
              <small>{user.name}</small>
            </div>
          </div>
          <label className="field">
            <span style={{ color: '#b7aea3' }}>Website</span>
            <select
              className="site-select"
              value={site?._id || ''}
              onChange={(event) => {
                setSiteId(event.target.value)
                saveSiteId(event.target.value)
                setOpen(false)
              }}
            >
              {sites.map((item) => (
                <option key={item._id} value={item._id}>{item.name}</option>
              ))}
            </select>
          </label>
          <nav className="nav" onClick={() => setOpen(false)}>
            {superUser ? (
              <>
                <NavLink to="/" end>Dashboard</NavLink>
                <NavLink to="/pages">Pages</NavLink>
                <NavLink to="/content">Website content</NavLink>
                <NavLink to="/enquiries">Enquiries</NavLink>
                <NavLink to="/checklists">Checklists</NavLink>
                <NavLink to="/media">Media</NavLink>
                <NavLink to="/settings">Settings</NavLink>
                <NavLink to="/websites">Websites</NavLink>
                <p className="group">Assistant</p>
              </>
            ) : null}
            <NavLink to="/chat">Chat</NavLink>
            {superUser ? (
              <>
                <NavLink to="/knowledge">Knowledge</NavLink>
                <NavLink to="/users">Users</NavLink>
              </>
            ) : null}
          </nav>
          <button className="btn ghost signout" type="button" onClick={onSignOut} style={{ color: '#fff', borderColor: '#3a342e' }}>
            Sign out
          </button>
        </aside>
        <div className="workspace">
          <header className="topbar">
            <button className="icon-btn menu-toggle" type="button" aria-label="Open menu" onClick={() => setOpen(true)}>
              Menu
            </button>
            <div>
              <strong>{site?.name || 'Website'}</strong>
              <div className="meta">{site?.domain || 'No domain yet'}</div>
            </div>
          </header>
          <div className="workspace-scroll">
            <Routes>
              <Route index element={superUser ? <Dashboard /> : <ChatPage siteId={site?._id || ''} />} />
              <Route path="chat" element={<ChatPage siteId={site?._id || ''} />} />
              <Route path="knowledge" element={<SuperOnly allow={superUser}><KnowledgePage siteId={site?._id || ''} /></SuperOnly>} />
              <Route path="users" element={<SuperOnly allow={superUser}><UsersPage /></SuperOnly>} />
              <Route path="websites" element={<SuperOnly allow={superUser}><Websites /></SuperOnly>} />
              <Route path="pages" element={<SuperOnly allow={superUser}><Pages /></SuperOnly>} />
              <Route path="pages/:id" element={<SuperOnly allow={superUser}><PageEditor /></SuperOnly>} />
              <Route path="content" element={<SuperOnly allow={superUser}><ContentHub /></SuperOnly>} />
              <Route path="content/:collection" element={<SuperOnly allow={superUser}><CollectionEditor /></SuperOnly>} />
              <Route path="enquiries" element={<SuperOnly allow={superUser}><Enquiries /></SuperOnly>} />
              <Route path="checklists" element={<SuperOnly allow={superUser}><Checklists /></SuperOnly>} />
              <Route path="media" element={<SuperOnly allow={superUser}><MediaLibrary /></SuperOnly>} />
              <Route path="settings" element={<SuperOnly allow={superUser}><Settings /></SuperOnly>} />
              <Route path="*" element={superUser ? <Dashboard /> : <ChatPage siteId={site?._id || ''} />} />
            </Routes>
          </div>
        </div>
      </div>
    </SiteContext.Provider>
  )
}

function SuperOnly({ allow, children }: { allow: boolean; children: ReactNode }) {
  if (!allow) return <Navigate to="/chat" replace />
  return children
}

function useSites() {
  const [sites, setSites] = useState<Site[]>([])
  useEffect(() => {
    api<{ sites: Site[] }>('/api/sites').then((result) => setSites(result.sites)).catch(() => setSites([]))
  }, [])
  return sites
}

function Dashboard() {
  const { site } = useSiteState()
  const [counts, setCounts] = useState({ pages: 0, enquiries: 0, checklists: 0, media: 0 })
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([])
  const [checklists, setChecklists] = useState<ChecklistRecord[]>([])
  useEffect(() => {
    if (!site) return
    Promise.all([
      api<{ pages: PageRecord[] }>(`/api/sites/${site._id}/pages`),
      api<{ enquiries: EnquiryRecord[] }>(`/api/sites/${site._id}/enquiries`),
      api<{ checklists: ChecklistRecord[] }>(`/api/sites/${site._id}/checklists`),
      api<{ media: MediaRecord[] }>(`/api/sites/${site._id}/media`),
    ]).then(([pages, enquiryResult, checklistResult, media]) => {
      setEnquiries(enquiryResult.enquiries)
      setChecklists(checklistResult.checklists)
      setCounts({
        pages: pages.pages.length,
        enquiries: enquiryResult.enquiries.filter((item) => item.status === 'new').length,
        checklists: checklistResult.checklists.filter((item) => item.status === 'new').length,
        media: media.media.length,
      })
    }).catch(() => undefined)
  }, [site])
  return (
    <main className="content">
      <div className="page-title">
        <p className="eyebrow">Dashboard</p>
        <h1>What needs attention</h1>
        <p className="note">New requirement checklists and contact enquiries arrive here, with the checklist answers and PDF.</p>
      </div>
      <section className="grid stats">
        <article className="card stat"><span className="label">New checklists</span><b>{counts.checklists}</b></article>
        <article className="card stat"><span className="label">New enquiries</span><b>{counts.enquiries}</b></article>
        <article className="card stat"><span className="label">Pages</span><b>{counts.pages}</b></article>
        <article className="card stat"><span className="label">Uploads</span><b>{counts.media}</b></article>
      </section>
      <section className="list">
        <h2 className="serif" style={{ fontSize: '1.7rem' }}>Requirement checklists</h2>
        <ChecklistTable items={checklists} empty="No checklists yet. A finished client chat will appear here with its PDF." />
      </section>
      <section className="list">
        <h2 className="serif" style={{ fontSize: '1.7rem' }}>Enquiries</h2>
        <EnquiryTable items={enquiries} empty="No enquiries yet." />
      </section>
    </main>
  )
}

function Websites() {
  const { sites, setSiteId } = useSiteState()
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [list, setList] = useState<Site[]>([])
  useEffect(() => setList(sites), [sites])

  async function createSite(event: FormEvent) {
    event.preventDefault()
    setError('')
    try {
      const result = await api<{ site: Site }>('/api/sites', { method: 'POST', body: JSON.stringify({ name, domain }) })
      setList((current) => [...current, result.site])
      setSiteId(result.site._id)
      setName('')
      setDomain('')
      navigate('/pages')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not add the website.')
    }
  }

  return (
    <main className="content">
      <div className="page-title">
        <p className="eyebrow">Websites</p>
        <h1>This panel can edit more than one site</h1>
        <p className="note">J Homes is already here. Add another website when you build one, then edit its pages, images and enquiries with the same screens.</p>
      </div>
      <div className="list">
        {list.map((site) => (
          <article className="item" key={site._id}>
            <h3>{site.name}</h3>
            <p className="meta">{site.domain || 'No domain'} · {site.status} · {site.template}</p>
            <button className="btn" type="button" onClick={() => { setSiteId(site._id); navigate('/pages') }}>Edit this website</button>
          </article>
        ))}
      </div>
      <form className="card editor" onSubmit={createSite}>
        <h2 className="serif" style={{ fontSize: '1.6rem' }}>Add a website</h2>
        <div className="pair">
          <label className="field"><span>Name</span><input value={name} onChange={(event) => setName(event.target.value)} required /></label>
          <label className="field"><span>Domain</span><input value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="https://example.com" /></label>
        </div>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn accent" type="submit">Create website</button>
      </form>
    </main>
  )
}

function Pages() {
  const { site } = useSiteState()
  const [pages, setPages] = useState<PageRecord[]>([])
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    if (!site) return
    api<{ pages: PageRecord[] }>(`/api/sites/${site._id}/pages`).then((result) => setPages(result.pages)).catch(() => setPages([]))
  }, [site])

  async function addPage() {
    if (!site) return
    const result = await api<{ page: PageRecord }>(`/api/sites/${site._id}/pages`, {
      method: 'POST',
      body: JSON.stringify({ title: 'New page', kicker: 'Page' }),
    })
    navigate(`/pages/${result.page._id}`)
  }

  async function restore() {
    if (!site || busy) return
    const changed = pages.filter(unpublished).length
    if (!changed) return
    const sure = window.confirm(`Put ${changed} edited page${changed === 1 ? '' : 's'} back to the version on the website now? Unpublished edits will be removed.`)
    if (!sure) return
    setBusy(true)
    setMessage('')
    try {
      const result = await api<{ pages: PageRecord[] }>(`/api/sites/${site._id}/pages/restore`, { method: 'POST' })
      setPages(result.pages)
      setMessage('Every page matches the current website again.')
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'The pages could not be restored.')
    } finally {
      setBusy(false)
    }
  }

  const changed = pages.filter(unpublished).length

  return (
    <main className="content">
      <div className="page-title">
        <p className="eyebrow">Pages</p>
        <h1>Every page on {site?.name}</h1>
        <p className="note">Restore puts unpublished edits back to the version that is on the website now.</p>
      </div>
      <div className="row">
        <button className="btn accent" type="button" onClick={() => void addPage()}>Add a page</button>
        <button className="btn" type="button" disabled={!changed || busy} onClick={() => void restore()}>
          {busy ? 'Restoring…' : 'Restore current website'}
        </button>
      </div>
      {message ? <p className="note">{message}</p> : null}
      <div className="list">
        {pages.map((page) => (
          <article className="item" key={page._id}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <p className="eyebrow">{page.kicker || 'Page'}</p>
              {unpublished(page) ? <span className="status">Unpublished</span> : null}
            </div>
            <h3>{page.title || page.slug}</h3>
            <p className="meta">{page.path}</p>
            <button className="btn" type="button" onClick={() => navigate(`/pages/${page._id}`)}>Edit page</button>
          </article>
        ))}
      </div>
    </main>
  )
}

function liveContent(page: PageRecord): PageContent {
  return {
    slug: page.slug,
    path: page.path,
    title: page.title,
    kicker: page.kicker,
    lede: page.lede,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    sections: page.sections || [],
  }
}

function sameContent(left: PageContent, right: PageContent) {
  return JSON.stringify(left) === JSON.stringify(right)
}

function unpublished(page: PageRecord) {
  return Boolean(page.draft && !sameContent(page.draft, liveContent(page)))
}

function EyeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function PreviewButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button className={`icon-btn preview-toggle ${open ? 'on' : ''}`} type="button" aria-label="View preview" aria-pressed={open} onClick={onClick}>
      <EyeIcon />
    </button>
  )
}

function imageSources(value: unknown, found: string[] = []): string[] {
  if (!value || typeof value !== 'object') return found
  if (Array.isArray(value)) {
    value.forEach((item) => imageSources(item, found))
    return found
  }
  const record = value as Record<string, unknown>
  if (typeof record.src === 'string' && record.src) found.push(record.src)
  Object.entries(record).forEach(([key, child]) => {
    if (key !== 'src') imageSources(child, found)
  })
  return found
}

function EntryPreview({ data }: { data: Record<string, unknown> }) {
  const title = String(data.title || data.headline || data.location || data.code || 'Untitled')
  const kicker = String(data.kicker || data.number || data.key || '')
  const lede = String(data.lede || data.summary || data.description || data.text || data.alt || '')
  const images = imageSources(data).slice(0, 2)
  const points = Array.isArray(data.points) ? data.points as { title?: string; text?: string }[] : []
  const blocks = Array.isArray(data.blocks) ? data.blocks as { text?: string }[] : []
  return (
    <section className="preview" aria-label="Item preview">
      <div className="preview-bar">
        <strong>Preview</strong>
        <span className="meta">Updates as you edit</span>
      </div>
      <div className="preview-stage">
        {kicker ? <p className="preview-kicker">{kicker}</p> : null}
        <h2 className="preview-title">{title}</h2>
        {lede ? <p className="preview-lede">{lede}</p> : null}
        {images.length ? (
          <div className="pair" style={{ marginTop: 16 }}>
            {images.map((src) => <img key={src} className="thumb" src={src} alt="" />)}
          </div>
        ) : null}
        {points.slice(0, 3).map((point, index) => (
          <article className="preview-section" key={index}>
            {point.title ? <h3>{point.title}</h3> : null}
            {point.text ? <p>{point.text}</p> : null}
          </article>
        ))}
        {blocks.slice(0, 2).map((block, index) => (
          <article className="preview-section" key={`block-${index}`}>
            <p>{block.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function ContentHub() {
  const navigate = useNavigate()
  return (
    <main className="content">
      <div className="page-title">
        <p className="eyebrow">Website content</p>
        <h1>Choose what to edit</h1>
        <p className="note">Projects, services, pictures and homepage sections are grouped here, so the menu stays short.</p>
      </div>
      <div className="hub">
        {contentGroups.map((group) => (
          <section key={group.title}>
            <h2 className="serif" style={{ fontSize: '1.7rem', marginBottom: 6 }}>{group.title}</h2>
            <p className="note" style={{ marginBottom: 12 }}>{group.text}</p>
            <div className="hub-grid">
              {group.ids.map((id) => {
                const item = collections.find((entry) => entry.id === id)
                if (!item) return null
                return (
                  <button className="hub-card" key={item.id} type="button" onClick={() => navigate(`/content/${item.id}`)}>
                    <strong>{item.label}</strong>
                    <span className="note">{item.hint}</span>
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}

function PagePreview({ draft }: { draft: PageContent }) {
  return (
    <section className="preview" aria-label="Page preview">
      <div className="preview-bar">
        <strong>Preview</strong>
        <span className="meta">{draft.path || '/'}</span>
      </div>
      <div className="preview-stage">
        {draft.kicker ? <p className="preview-kicker">{draft.kicker}</p> : null}
        <h2 className="preview-title">{draft.title || 'Untitled page'}</h2>
        {draft.lede ? <p className="preview-lede">{draft.lede}</p> : null}
        {draft.sections.map((section, index) => (
          <article className="preview-section" key={index}>
            {section.heading ? <h3>{section.heading}</h3> : null}
            {section.text ? <p>{section.text}</p> : null}
          </article>
        ))}
      </div>
    </section>
  )
}

function PageEditor() {
  const { id } = useParams()
  const { site } = useSiteState()
  const [page, setPage] = useState<PageRecord | null>(null)
  const [draft, setDraft] = useState<PageContent | null>(null)
  const [live, setLive] = useState<PageContent | null>(null)
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const savedKey = useRef('')

  useEffect(() => {
    if (!site || !id) return
    api<{ pages: PageRecord[] }>(`/api/sites/${site._id}/pages`).then((result) => {
      const found = result.pages.find((item) => item._id === id) || null
      setPage(found)
      if (!found) return
      const published = liveContent(found)
      const next = found.draft ? structuredClone(found.draft) : structuredClone(published)
      savedKey.current = JSON.stringify(next)
      setLive(published)
      setDraft(next)
    }).catch(() => setPage(null))
  }, [site, id])

  useEffect(() => {
    if (!draft || !id) return
    const key = JSON.stringify(draft)
    if (savedKey.current === key) return
    const handle = window.setTimeout(() => {
      setStatus('Saving preview…')
      api<{ page: PageRecord }>(`/api/pages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ draft }),
      })
        .then((result) => {
          savedKey.current = key
          setPage(result.page)
          setStatus('Preview saved. The website is unchanged until you publish.')
        })
        .catch(() => setStatus('The preview could not be saved.'))
    }, 500)
    return () => window.clearTimeout(handle)
  }, [draft, id])

  if (!page || !draft || !live) return <main className="content"><p className="note">Loading the page…</p></main>

  const pending = !sameContent(draft, live)

  function update(next: PageContent) {
    setDraft(next)
  }

  async function publish() {
    setBusy(true)
    setStatus('')
    try {
      const result = await api<{ page: PageRecord }>(`/api/pages/${page!._id}/publish`, {
        method: 'POST',
        body: JSON.stringify({ draft }),
      })
      const published = liveContent(result.page)
      savedKey.current = JSON.stringify(published)
      setPage(result.page)
      setLive(published)
      setDraft(structuredClone(published))
      setStatus('Published. The website now shows this version.')
    } catch (reason) {
      setStatus(reason instanceof Error ? reason.message : 'Publish failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="content">
      <div className="editor-top">
        <div className="page-title">
          <p className="eyebrow">{live.path}</p>
          <h1>Edit page</h1>
          <p className="note">Open the eye to see this page. Publish is what changes the website.</p>
        </div>
        <PreviewButton open={previewOpen} onClick={() => setPreviewOpen((open) => !open)} />
      </div>
      {previewOpen ? <PagePreview draft={draft} /> : null}
      <div className="row">
        {pending ? <span className="status">Unpublished changes</span> : <span className="status read">Live</span>}
        <button className="btn accent" type="button" disabled={!pending || busy} onClick={() => void publish()}>
          {busy ? 'Publishing…' : 'Publish'}
        </button>
      </div>
      <form className="card editor" onSubmit={(event) => event.preventDefault()}>
        <div className="pair">
          <label className="field"><span>Kicker</span><input value={draft.kicker} onChange={(event) => update({ ...draft, kicker: event.target.value })} /></label>
          <label className="field"><span>Path</span><input value={draft.path} onChange={(event) => update({ ...draft, path: event.target.value })} /></label>
        </div>
        <label className="field"><span>Title</span><input value={draft.title} onChange={(event) => update({ ...draft, title: event.target.value })} /></label>
        <label className="field"><span>Introduction</span><textarea value={draft.lede} onChange={(event) => update({ ...draft, lede: event.target.value })} /></label>
        <div className="pair">
          <label className="field"><span>SEO title</span><input value={draft.seoTitle} onChange={(event) => update({ ...draft, seoTitle: event.target.value })} /></label>
          <label className="field"><span>SEO description</span><textarea value={draft.seoDescription} onChange={(event) => update({ ...draft, seoDescription: event.target.value })} /></label>
        </div>
        <div className="field">
          <span>Sections</span>
          <div className="stack">
            {draft.sections.map((section, index) => (
              <div className="repeat" key={index}>
                <textarea value={section.heading} placeholder="Heading" onChange={(event) => update({ ...draft, sections: draft.sections.map((item, itemIndex) => itemIndex === index ? { ...item, heading: event.target.value } : item) })} />
                <textarea value={section.text} placeholder="Text" onChange={(event) => update({ ...draft, sections: draft.sections.map((item, itemIndex) => itemIndex === index ? { ...item, text: event.target.value } : item) })} />
                <button className="btn ghost" type="button" onClick={() => update({ ...draft, sections: draft.sections.filter((_, itemIndex) => itemIndex !== index) })}>Remove section</button>
              </div>
            ))}
            <button className="btn ghost" type="button" onClick={() => update({ ...draft, sections: [...draft.sections, { heading: '', text: '' }] })}>Add section</button>
          </div>
        </div>
        {status ? <p className="note">{status}</p> : null}
      </form>
    </main>
  )
}

function CollectionEditor() {
  const { collection = '' } = useParams()
  const [params] = useSearchParams()
  const requested = params.get('entry') || ''
  const schema = schemaFor(collection)
  const { site } = useSiteState()
  const [entries, setEntries] = useState<EntryRecord[]>([])
  const [active, setActive] = useState<string>('')
  const [draft, setDraft] = useState<Record<string, unknown>>({})
  const [message, setMessage] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)

  useEffect(() => {
    if (!site || !collection) return
    api<{ entries: EntryRecord[] }>(`/api/sites/${site._id}/entries?collection=${collection}`).then((result) => {
      const chosen = result.entries.find((entry) => entry._id === requested) || result.entries[0]
      setEntries(result.entries)
      setActive(chosen?._id || '')
      setDraft(chosen?.data || {})
    }).catch(() => setEntries([]))
  }, [site, collection, requested])

  const current = entries.find((entry) => entry._id === active)

  async function addItem() {
    if (!site || !schema) return
    const result = await api<{ entry: EntryRecord }>(`/api/sites/${site._id}/entries`, {
      method: 'POST',
      body: JSON.stringify({ collection, title: `New ${schema.label}`, data: { title: `New ${schema.label}` } }),
    })
    setEntries((items) => [...items, result.entry])
    setActive(result.entry._id)
    setDraft(result.entry.data)
  }

  async function save() {
    if (!current) return
    const title = String(draft.title || draft.location || current.title)
    const result = await api<{ entry: EntryRecord }>(`/api/entries/${current._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ data: draft, title, published: current.published }),
    })
    setEntries((items) => items.map((item) => (item._id === result.entry._id ? result.entry : item)))
    setMessage('Saved.')
  }

  async function remove() {
    if (!current) return
    await api(`/api/entries/${current._id}`, { method: 'DELETE' })
    const next = entries.filter((item) => item._id !== current._id)
    setEntries(next)
    setActive(next[0]?._id || '')
    setDraft(next[0]?.data || {})
  }

  if (!schema || !site) return <main className="content"><p className="note">This section is not available.</p></main>
  return (
    <main className="content">
      <div className="editor-top">
        <div className="page-title">
          <p className="eyebrow">{schema.label}</p>
          <h1>{schema.label}</h1>
          <p className="note">{schema.hint}</p>
        </div>
        <PreviewButton open={previewOpen} onClick={() => setPreviewOpen((open) => !open)} />
      </div>
      {previewOpen && current ? <EntryPreview data={draft} /> : null}
      <div className="row">
        <button className="btn accent" type="button" onClick={() => void addItem()}>Add {schema.label.toLowerCase()}</button>
      </div>
      <div className="split">
        <div className="list">
          {entries.map((entry) => (
            <button
              className="item"
              key={entry._id}
              type="button"
              onClick={() => { setActive(entry._id); setDraft(entry.data); setMessage('') }}
              style={{ textAlign: 'left', borderColor: entry._id === active ? '#8f1d1d' : undefined }}
            >
              <strong>{entry.title || 'Untitled'}</strong>
              <span className="meta">{entry.published ? 'Visible' : 'Hidden'}</span>
            </button>
          ))}
        </div>
        {current ? (
          <form className="card editor" onSubmit={(event) => { event.preventDefault(); void save() }}>
            <Editor fields={schema.fields} value={draft} siteId={site._id} onChange={setDraft} />
            <label className="field">
              <span>Visibility</span>
              <select
                value={current.published ? 'yes' : 'no'}
                onChange={(event) => setEntries((items) => items.map((item) => item._id === current._id ? { ...item, published: event.target.value === 'yes' } : item))}
              >
                <option value="yes">Show on the website</option>
                <option value="no">Hide</option>
              </select>
            </label>
            {message ? <p className="note">{message}</p> : null}
            <div className="row">
              <button className="btn accent" type="submit">Save</button>
              <button className="btn danger" type="button" onClick={() => void remove()}>Delete</button>
            </div>
          </form>
        ) : <p className="card muted-box note">Add the first item for this section.</p>}
      </div>
    </main>
  )
}

function listedAt(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value || '—'
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

function ChecklistTable({
  items,
  empty,
  onStatus,
  onEdit,
  onDelete,
}: {
  items: ChecklistRecord[]
  empty: string
  onStatus?: (id: string, status: string) => void
  onEdit?: (item: ChecklistRecord) => void
  onDelete?: (item: ChecklistRecord) => void
}) {
  const [open, setOpen] = useState('')
  if (items.length === 0) return <p className="card muted-box note">{empty}</p>
  const hasActions = Boolean(onStatus || onEdit || onDelete)
  const columns = hasActions ? 8 : 7
  return (
    <div className="table-wrap">
      <table className="data">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th>Status</th>
            <th>PDF</th>
            <th>Received</th>
            {hasActions ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const expanded = open === item._id
            return (
              <Fragment key={item._id}>
                <tr className="clickable" onClick={() => setOpen(expanded ? '' : item._id)}>
                  <td>{item.name || 'Checklist'}</td>
                  <td>{item.phone || '—'}</td>
                  <td>{item.location || '—'}</td>
                  <td>{item.checklistDate || '—'}</td>
                  <td><span className={`status ${item.status}`}>{item.status}</span></td>
                  <td>
                    {item.pdfUrl
                      ? <a href={item.pdfUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>Open PDF</a>
                      : '—'}
                  </td>
                  <td>{listedAt(item.submittedAt || item.createdAt)}</td>
                  {hasActions ? (
                    <td>
                      <div className="row" onClick={(event) => event.stopPropagation()}>
                        {onEdit ? <button className="btn ghost" type="button" onClick={() => onEdit(item)}>Edit</button> : null}
                        {onStatus ? <button className="btn ghost" type="button" onClick={() => onStatus(item._id, 'read')}>Read</button> : null}
                        {onStatus ? <button className="btn ghost" type="button" onClick={() => onStatus(item._id, 'archived')}>Archive</button> : null}
                        {onDelete ? <button className="btn danger" type="button" onClick={() => onDelete(item)}>Delete</button> : null}
                      </div>
                    </td>
                  ) : null}
                </tr>
                {expanded ? (
                  <tr className="detail">
                    <td colSpan={columns}>
                      <table className="data inner">
                        <thead>
                          <tr>
                            <th>Section</th>
                            <th>Question</th>
                            <th>Answer</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(item.answers || []).map((row) => (
                            <tr key={`${row.section}-${row.label}`}>
                              <td>{row.section || '—'}</td>
                              <td>{row.label}</td>
                              <td>{row.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {item.signature ? <p className="meta">Signed {item.signature}</p> : null}
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const stageLabels: Record<string, string> = {
  'have-land': 'I have land',
  'need-land': 'I need land',
  'have-design': 'I have a design',
  turnkey: 'I want complete turnkey',
}

const budgetLabels: Record<string, string> = {
  discuss: 'Prefer to discuss',
  'under-25': 'Under ₹25 lakh',
  '25-50': '₹25–50 lakh',
  '50-100': '₹50 lakh–1 crore',
  'above-100': 'Above ₹1 crore',
}

function EnquiryTable({
  items,
  empty,
  onStatus,
  onEdit,
  onDelete,
}: {
  items: EnquiryRecord[]
  empty: string
  onStatus?: (id: string, status: string) => void
  onEdit?: (item: EnquiryRecord) => void
  onDelete?: (item: EnquiryRecord) => void
}) {
  if (items.length === 0) return <p className="card muted-box note">{empty}</p>
  const hasActions = Boolean(onStatus || onEdit || onDelete)
  return (
    <div className="table-wrap">
      <table className="data">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Location</th>
            <th>Stage</th>
            <th>Budget</th>
            <th>Message</th>
            <th>Status</th>
            <th>Received</th>
            {hasActions ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.name || '—'}</td>
              <td>{item.phone || '—'}</td>
              <td>{item.email || '—'}</td>
              <td>{item.location || '—'}</td>
              <td>{stageLabels[item.stage] || item.stage || '—'}</td>
              <td>{item.budget ? budgetLabels[item.budget] || item.budget : '—'}</td>
              <td>{item.message || '—'}</td>
              <td><span className={`status ${item.status}`}>{item.status}</span></td>
              <td>{listedAt(item.createdAt)}</td>
              {hasActions ? (
                <td>
                  <div className="row">
                    {onEdit ? <button className="btn ghost" type="button" onClick={() => onEdit(item)}>Edit</button> : null}
                    {onStatus ? <button className="btn ghost" type="button" onClick={() => onStatus(item._id, 'read')}>Read</button> : null}
                    {onStatus ? <button className="btn ghost" type="button" onClick={() => onStatus(item._id, 'archived')}>Archive</button> : null}
                    {onDelete ? <button className="btn danger" type="button" onClick={() => onDelete(item)}>Delete</button> : null}
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const statusOptions = [
  { id: 'new', label: 'New' },
  { id: 'read', label: 'Read' },
  { id: 'archived', label: 'Archived' },
]

interface EnquiryDraft {
  name: string
  phone: string
  email: string
  location: string
  budget: string
  stage: string
  message: string
  status: string
}

function blankEnquiry(): EnquiryDraft {
  return { name: '', phone: '', email: '', location: '', budget: '', stage: '', message: '', status: 'new' }
}

function enquiryDraft(item: EnquiryRecord): EnquiryDraft {
  return {
    name: item.name || '',
    phone: item.phone || '',
    email: item.email || '',
    location: item.location || '',
    budget: item.budget || '',
    stage: item.stage || '',
    message: item.message || '',
    status: item.status || 'new',
  }
}

interface ChecklistDraft {
  name: string
  phone: string
  location: string
  checklistDate: string
  signature: string
  pdfUrl: string
  status: string
  answers: ChecklistAnswer[]
}

function blankChecklist(): ChecklistDraft {
  return { name: '', phone: '', location: '', checklistDate: '', signature: '', pdfUrl: '', status: 'new', answers: [] }
}

function checklistDraft(item: ChecklistRecord): ChecklistDraft {
  return {
    name: item.name || '',
    phone: item.phone || '',
    location: item.location || '',
    checklistDate: item.checklistDate || '',
    signature: item.signature || '',
    pdfUrl: item.pdfUrl || '',
    status: item.status || 'new',
    answers: (item.answers || []).map((row) => ({ section: row.section || '', label: row.label || '', value: row.value || '' })),
  }
}

function optionList(known: Record<string, string>, current: string) {
  const options = Object.entries(known).map(([id, label]) => ({ id, label }))
  if (current && !known[current]) options.push({ id: current, label: current })
  return options
}

function Checklists() {
  const { site } = useSiteState()
  const [items, setItems] = useState<ChecklistRecord[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState<ChecklistDraft>(blankChecklist())
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (!site) return
    api<{ checklists: ChecklistRecord[] }>(`/api/sites/${site._id}/checklists`).then((result) => setItems(result.checklists)).catch(() => setItems([]))
  }, [site])

  function openNew() {
    setEditing('new')
    setDraft(blankChecklist())
    setMessage('')
  }

  function openEdit(item: ChecklistRecord) {
    setEditing(item._id)
    setDraft(checklistDraft(item))
    setMessage('')
  }

  async function update(id: string, status: string) {
    const result = await api<{ checklist: ChecklistRecord }>(`/api/checklists/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
    setItems((current) => current.map((item) => (item._id === id ? result.checklist : item)))
    if (editing === id) setDraft((current) => ({ ...current, status }))
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    if (!site || !editing || busy) return
    setBusy(true)
    setMessage('')
    try {
      if (editing === 'new') {
        const result = await api<{ checklist: ChecklistRecord }>(`/api/sites/${site._id}/checklists`, { method: 'POST', body: JSON.stringify(draft) })
        setItems((current) => [result.checklist, ...current])
        setEditing(null)
        setMessage('Checklist added.')
      } else {
        const result = await api<{ checklist: ChecklistRecord }>(`/api/checklists/${editing}`, { method: 'PATCH', body: JSON.stringify(draft) })
        setItems((current) => current.map((item) => (item._id === editing ? result.checklist : item)))
        setEditing(null)
        setMessage('Checklist updated.')
      }
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'The checklist could not be saved.')
    } finally {
      setBusy(false)
    }
  }

  async function remove(item: ChecklistRecord) {
    if (!window.confirm(`Delete the checklist for ${item.name || 'this client'}?`)) return
    await api(`/api/checklists/${item._id}`, { method: 'DELETE' })
    setItems((current) => current.filter((row) => row._id !== item._id))
    if (editing === item._id) setEditing(null)
    setMessage('Checklist deleted.')
  }

  function setAnswer(index: number, key: keyof ChecklistAnswer, value: string) {
    setDraft((current) => ({
      ...current,
      answers: current.answers.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)),
    }))
  }

  return (
    <main className="content">
      <div className="page-title">
        <p className="eyebrow">Inbox</p>
        <h1>Requirement checklists</h1>
        <p className="note">Add a checklist, open a row to read the answers, then edit or delete it.</p>
      </div>
      <div className="row">
        <button className="btn accent" type="button" onClick={openNew}>Add a checklist</button>
      </div>
      {editing ? (
        <form className="card editor-card" onSubmit={(event) => void save(event)}>
          <h2 className="serif">{editing === 'new' ? 'New checklist' : 'Edit checklist'}</h2>
          <div className="pair">
            <label className="field"><span>Name</span><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required /></label>
            <label className="field"><span>Phone</span><input value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} required /></label>
          </div>
          <div className="pair">
            <label className="field"><span>Location</span><input value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} /></label>
            <label className="field"><span>Date</span><input type="date" value={draft.checklistDate} onChange={(event) => setDraft({ ...draft, checklistDate: event.target.value })} /></label>
          </div>
          <div className="pair">
            <label className="field"><span>Signature</span><input value={draft.signature} onChange={(event) => setDraft({ ...draft, signature: event.target.value })} /></label>
            <label className="field">
              <span>Status</span>
              <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
                {statusOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
          </div>
          <label className="field"><span>PDF link</span><input value={draft.pdfUrl} onChange={(event) => setDraft({ ...draft, pdfUrl: event.target.value })} placeholder="https://" /></label>
          <div className="stack">
            <span className="label">Answers</span>
            {draft.answers.map((row, index) => (
              <div className="answer-grid" key={index}>
                <label className="field"><span>Section</span><input value={row.section} onChange={(event) => setAnswer(index, 'section', event.target.value)} /></label>
                <label className="field"><span>Question</span><input value={row.label} onChange={(event) => setAnswer(index, 'label', event.target.value)} /></label>
                <label className="field"><span>Answer</span><input value={row.value} onChange={(event) => setAnswer(index, 'value', event.target.value)} /></label>
                <button className="btn ghost" type="button" onClick={() => setDraft({ ...draft, answers: draft.answers.filter((_, rowIndex) => rowIndex !== index) })}>Remove</button>
              </div>
            ))}
            <div className="row">
              <button className="btn ghost" type="button" onClick={() => setDraft({ ...draft, answers: [...draft.answers, { section: '', label: '', value: '' }] })}>Add an answer</button>
            </div>
          </div>
          {message ? <p className="note">{message}</p> : null}
          <div className="row">
            <button className="btn accent" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
            <button className="btn ghost" type="button" onClick={() => { setEditing(null); setMessage('') }}>Cancel</button>
          </div>
        </form>
      ) : null}
      {message && !editing ? <p className="note">{message}</p> : null}
      <ChecklistTable
        items={items}
        empty="No checklists yet."
        onStatus={(id, status) => void update(id, status)}
        onEdit={openEdit}
        onDelete={(item) => void remove(item)}
      />
    </main>
  )
}

function Enquiries() {
  const { site } = useSiteState()
  const [items, setItems] = useState<EnquiryRecord[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState<EnquiryDraft>(blankEnquiry())
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (!site) return
    api<{ enquiries: EnquiryRecord[] }>(`/api/sites/${site._id}/enquiries`).then((result) => setItems(result.enquiries)).catch(() => setItems([]))
  }, [site])

  function openNew() {
    setEditing('new')
    setDraft(blankEnquiry())
    setMessage('')
  }

  function openEdit(item: EnquiryRecord) {
    setEditing(item._id)
    setDraft(enquiryDraft(item))
    setMessage('')
  }

  async function update(id: string, status: string) {
    const result = await api<{ enquiry: EnquiryRecord }>(`/api/enquiries/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
    setItems((current) => current.map((item) => (item._id === id ? result.enquiry : item)))
    if (editing === id) setDraft((current) => ({ ...current, status }))
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    if (!site || !editing || busy) return
    setBusy(true)
    setMessage('')
    try {
      if (editing === 'new') {
        const result = await api<{ enquiry: EnquiryRecord }>(`/api/sites/${site._id}/enquiries`, { method: 'POST', body: JSON.stringify(draft) })
        setItems((current) => [result.enquiry, ...current])
        setEditing(null)
        setMessage('Enquiry added.')
      } else {
        const result = await api<{ enquiry: EnquiryRecord }>(`/api/enquiries/${editing}`, { method: 'PATCH', body: JSON.stringify(draft) })
        setItems((current) => current.map((item) => (item._id === editing ? result.enquiry : item)))
        setEditing(null)
        setMessage('Enquiry updated.')
      }
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'The enquiry could not be saved.')
    } finally {
      setBusy(false)
    }
  }

  async function remove(item: EnquiryRecord) {
    if (!window.confirm(`Delete the enquiry from ${item.name || 'this client'}?`)) return
    await api(`/api/enquiries/${item._id}`, { method: 'DELETE' })
    setItems((current) => current.filter((row) => row._id !== item._id))
    if (editing === item._id) setEditing(null)
    setMessage('Enquiry deleted.')
  }

  const stages = optionList(stageLabels, draft.stage)
  const budgets = optionList(budgetLabels, draft.budget)

  return (
    <main className="content">
      <div className="page-title">
        <p className="eyebrow">Inbox</p>
        <h1>Enquiries</h1>
        <p className="note">Add an enquiry, read it in the table, then edit or delete it.</p>
      </div>
      <div className="row">
        <button className="btn accent" type="button" onClick={openNew}>Add an enquiry</button>
      </div>
      {editing ? (
        <form className="card editor-card" onSubmit={(event) => void save(event)}>
          <h2 className="serif">{editing === 'new' ? 'New enquiry' : 'Edit enquiry'}</h2>
          <div className="pair">
            <label className="field"><span>Name</span><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required /></label>
            <label className="field"><span>Phone</span><input value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} required /></label>
          </div>
          <div className="pair">
            <label className="field"><span>Email</span><input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></label>
            <label className="field"><span>Location</span><input value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} /></label>
          </div>
          <div className="pair">
            <label className="field">
              <span>Stage</span>
              <select value={draft.stage} onChange={(event) => setDraft({ ...draft, stage: event.target.value })}>
                <option value="">Select a stage</option>
                {stages.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Budget</span>
              <select value={draft.budget} onChange={(event) => setDraft({ ...draft, budget: event.target.value })}>
                <option value="">Select a budget</option>
                {budgets.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
          </div>
          <label className="field">
            <span>Status</span>
            <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
              {statusOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
          </label>
          <label className="field"><span>Message</span><textarea value={draft.message} onChange={(event) => setDraft({ ...draft, message: event.target.value })} /></label>
          {message ? <p className="note">{message}</p> : null}
          <div className="row">
            <button className="btn accent" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
            <button className="btn ghost" type="button" onClick={() => { setEditing(null); setMessage('') }}>Cancel</button>
          </div>
        </form>
      ) : null}
      {message && !editing ? <p className="note">{message}</p> : null}
      <EnquiryTable
        items={items}
        empty="No enquiries yet."
        onStatus={(id, status) => void update(id, status)}
        onEdit={openEdit}
        onDelete={(item) => void remove(item)}
      />
    </main>
  )
}

function MediaLibrary() {
  const { site } = useSiteState()
  const [items, setItems] = useState<MediaRecord[]>([])
  const [error, setError] = useState('')
  useEffect(() => {
    if (!site) return
    api<{ media: MediaRecord[] }>(`/api/sites/${site._id}/media`).then((result) => setItems(result.media)).catch(() => setItems([]))
  }, [site])

  async function upload(file: File) {
    if (!site) return
    setError('')
    const body = new FormData()
    body.set('file', file)
    try {
      const result = await api<{ media: MediaRecord }>(`/api/sites/${site._id}/media`, { method: 'POST', body })
      setItems((current) => [result.media, ...current])
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Upload failed.')
    }
  }

  return (
    <main className="content">
      <div className="page-title">
        <p className="eyebrow">Library</p>
        <h1>Images and video</h1>
        <p className="note">Each file lists where it appears on the website. Open a line to edit that place.</p>
      </div>
      <label className="btn" style={{ width: 'fit-content' }}>
        Upload
        <input hidden type="file" accept="image/*,video/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file) }} />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <div className="gallery-grid">
        {items.map((item) => (
          <article className="item" key={item._id}>
            {item.resourceType === 'video' ? <video className="thumb" src={item.url} controls /> : <img className="thumb" src={item.url} alt={item.alt} />}
            <p className="meta">{item.alt || item.resourceType}</p>
            <div className="uses">
              <p className="meta">Used in</p>
              {(item.uses || []).length === 0 ? <p className="note">Not used on the website</p> : null}
              {(item.uses || []).map((use) => (
                <Link key={`${use.href}-${use.detail}-${use.label}`} to={use.href}>
                  {use.label}{use.detail ? ` · ${use.detail}` : ''}
                </Link>
              ))}
            </div>
            <button className="btn ghost" type="button" onClick={() => navigator.clipboard.writeText(item.url)}>Copy address</button>
          </article>
        ))}
      </div>
    </main>
  )
}

function Settings() {
  const { site, setSiteId } = useSiteState()
  const [settings, setSettings] = useState<Record<string, unknown>>({})
  const [message, setMessage] = useState('')
  useEffect(() => {
    setSettings(site?.settings || {})
  }, [site])
  if (!site) return null
  const contact = (settings.contact || {}) as Record<string, unknown>
  const area = (settings.area || {}) as Record<string, unknown>

  function setContact(key: string, value: string) {
    setSettings({ ...settings, contact: { ...contact, [key]: value } })
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    await api(`/api/sites/${site!._id}`, { method: 'PATCH', body: JSON.stringify({ settings, name: settings.name || site!.name }) })
    setSiteId(site!._id)
    setMessage('Saved. Reload the public site to see contact details update.')
  }

  return (
    <main className="content">
      <div className="page-title">
        <p className="eyebrow">Settings</p>
        <h1>Business details</h1>
      </div>
      <form className="card editor" onSubmit={(event) => void save(event)}>
        <div className="pair">
          <label className="field"><span>Name</span><input value={String(settings.name || '')} onChange={(event) => setSettings({ ...settings, name: event.target.value })} /></label>
          <label className="field"><span>Tagline</span><input value={String(settings.tagline || '')} onChange={(event) => setSettings({ ...settings, tagline: event.target.value })} /></label>
        </div>
        <label className="field"><span>Promise</span><input value={String(settings.promise || '')} onChange={(event) => setSettings({ ...settings, promise: event.target.value })} /></label>
        <div className="pair">
          <label className="field"><span>Phone display</span><input value={String(contact.phoneDisplay || '')} onChange={(event) => setContact('phoneDisplay', event.target.value)} /></label>
          <label className="field"><span>Email</span><input value={String(contact.email || '')} onChange={(event) => setContact('email', event.target.value)} /></label>
        </div>
        <label className="field"><span>Address</span><textarea value={Array.isArray(contact.address) ? contact.address.join('\n') : ''} onChange={(event) => setSettings({ ...settings, contact: { ...contact, address: event.target.value.split('\n') } })} /></label>
        <div className="pair">
          <label className="field"><span>City</span><input value={String(area.city || '')} onChange={(event) => setSettings({ ...settings, area: { ...area, city: event.target.value } })} /></label>
          <label className="field"><span>Instagram</span><input value={String(contact.instagram || '')} onChange={(event) => setContact('instagram', event.target.value)} /></label>
        </div>
        {message ? <p className="note">{message}</p> : null}
        <button className="btn accent" type="submit">Save settings</button>
      </form>
    </main>
  )
}
