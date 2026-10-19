import { useEffect, useRef, useState, type FormEvent } from 'react'
import { api, apiBase, token, type Account, type ChatMessage, type ChatThread, type KnowledgeDoc } from './api'

function listedAt(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

function roleLabel(role: string) {
  return role === 'staff' ? 'Staff' : 'Super admin'
}

function fileSize(bytes: number) {
  if (!bytes) return '—'
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function UsersPage() {
  const [users, setUsers] = useState<Account[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('staff')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  function load() {
    api<{ users: Account[] }>('/api/users').then((result) => setUsers(result.users)).catch(() => setUsers([]))
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setEditing('new')
    setName('')
    setEmail('')
    setPassword('')
    setRole('staff')
    setMessage('')
  }

  function openEdit(user: Account) {
    setEditing(user._id)
    setName(user.name)
    setEmail(user.email)
    setPassword('')
    setRole(user.role === 'staff' ? 'staff' : 'superadmin')
    setMessage('')
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    if (!editing || busy) return
    setBusy(true)
    setMessage('')
    try {
      if (editing === 'new') {
        await api('/api/users', { method: 'POST', body: JSON.stringify({ name, email, password, role }) })
        setMessage('User added. They can sign in with that email and password.')
      } else {
        await api(`/api/users/${editing}`, { method: 'PATCH', body: JSON.stringify({ name, role, password: password || undefined }) })
        setMessage('User updated.')
      }
      setEditing(null)
      load()
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'The user could not be saved.')
    } finally {
      setBusy(false)
    }
  }

  async function remove(user: Account) {
    if (!window.confirm(`Remove ${user.name}? They will no longer be able to sign in.`)) return
    try {
      await api(`/api/users/${user._id}`, { method: 'DELETE' })
      setUsers((current) => current.filter((item) => item._id !== user._id))
      if (editing === user._id) setEditing(null)
      setMessage('User removed.')
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'The user could not be removed.')
    }
  }

  return (
    <main className="content">
      <div className="page-title">
        <p className="eyebrow">People</p>
        <h1>Users</h1>
        <p className="note">A super admin can add someone with an email and password. Staff can sign in and ask the assistant.</p>
      </div>
      <div className="row">
        <button className="btn accent" type="button" onClick={openNew}>Add a user</button>
      </div>
      {editing ? (
        <form className="card editor-card" onSubmit={(event) => void save(event)}>
          <h2 className="serif">{editing === 'new' ? 'New user' : 'Edit user'}</h2>
          <div className="pair">
            <label className="field"><span>Name</span><input value={name} onChange={(event) => setName(event.target.value)} required /></label>
            <label className="field"><span>Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={editing !== 'new'} /></label>
          </div>
          <div className="pair">
            <label className="field">
              <span>{editing === 'new' ? 'Password' : 'New password'}</span>
              <input type="text" value={password} onChange={(event) => setPassword(event.target.value)} required={editing === 'new'} placeholder={editing === 'new' ? '' : 'Leave blank to keep the current password'} autoComplete="off" />
            </label>
            <label className="field">
              <span>Role</span>
              <select value={role} onChange={(event) => setRole(event.target.value)}>
                <option value="staff">Staff</option>
                <option value="superadmin">Super admin</option>
              </select>
            </label>
          </div>
          {message ? <p className="note">{message}</p> : null}
          <div className="row">
            <button className="btn accent" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
            <button className="btn ghost" type="button" onClick={() => { setEditing(null); setMessage('') }}>Cancel</button>
          </div>
        </form>
      ) : null}
      {message && !editing ? <p className="note">{message}</p> : null}
      {users.length === 0 ? <p className="card muted-box note">No users yet.</p> : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{roleLabel(user.role)}</td>
                  <td>{listedAt(user.createdAt)}</td>
                  <td>
                    <div className="row">
                      <button className="btn ghost" type="button" onClick={() => openEdit(user)}>Edit</button>
                      <button className="btn danger" type="button" onClick={() => void remove(user)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

export function KnowledgePage({ siteId }: { siteId: string }) {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([])
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  function load() {
    if (!siteId) return
    api<{ documents: KnowledgeDoc[] }>(`/api/sites/${siteId}/documents`).then((result) => setDocuments(result.documents)).catch(() => setDocuments([]))
  }

  useEffect(() => { load() }, [siteId])

  useEffect(() => {
    if (!documents.some((item) => item.status === 'processing')) return
    const timer = window.setInterval(load, 2000)
    return () => window.clearInterval(timer)
  }, [documents, siteId])

  async function upload(event: FormEvent) {
    event.preventDefault()
    if (!siteId || !file || busy) return
    setBusy(true)
    setMessage('')
    const body = new FormData()
    body.set('file', file)
    if (title.trim()) body.set('title', title.trim())
    try {
      const result = await api<{ document: KnowledgeDoc }>(`/api/sites/${siteId}/documents`, { method: 'POST', body })
      setDocuments((current) => [result.document, ...current.filter((item) => item._id !== result.document._id)])
      setTitle('')
      setFile(null)
      if (input.current) input.current.value = ''
      setMessage('Uploaded. The assistant is reading it once, then it can answer from it.')
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'The file could not be uploaded.')
    } finally {
      setBusy(false)
    }
  }

  async function reindex(doc: KnowledgeDoc) {
    await api(`/api/documents/${doc._id}/reindex`, { method: 'POST' })
    setDocuments((current) => current.map((item) => (item._id === doc._id ? { ...item, status: 'processing', error: '' } : item)))
  }

  async function remove(doc: KnowledgeDoc) {
    if (!window.confirm(`Remove ${doc.title}? The assistant will stop using it.`)) return
    await api(`/api/documents/${doc._id}`, { method: 'DELETE' })
    setDocuments((current) => current.filter((item) => item._id !== doc._id))
  }

  async function download(doc: KnowledgeDoc) {
    const response = await fetch(`${apiBase}/api/documents/${doc._id}/file`, { headers: { Authorization: `Bearer ${token()}` } })
    if (!response.ok) return
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = doc.filename
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="content">
      <div className="page-title">
        <p className="eyebrow">Assistant</p>
        <h1>Knowledge</h1>
        <p className="note">Upload policies, process notes, quote sheets or any office document. Each file is read once. Later questions use the saved passages, so the whole file is not sent again.</p>
      </div>
      <form className="card editor-card" onSubmit={(event) => void upload(event)}>
        <h2 className="serif">Add a document</h2>
        <div className="pair">
          <label className="field"><span>Title</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Optional. The file name is used when this is empty." /></label>
          <label className="field">
            <span>File</span>
            <input ref={input} type="file" accept=".pdf,.docx,.txt,.md,.csv,.xlsx,.xls,application/pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} required />
          </label>
        </div>
        <p className="note">PDF, Word (.docx), Excel, CSV or text. Up to 20 MB. Save older Word files as .docx first.</p>
        {message ? <p className="note">{message}</p> : null}
        <div className="row">
          <button className="btn accent" type="submit" disabled={busy || !file}>{busy ? 'Uploading…' : 'Upload'}</button>
        </div>
      </form>
      {documents.length === 0 ? <p className="card muted-box note">No documents yet.</p> : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Title</th>
                <th>File</th>
                <th>Size</th>
                <th>Status</th>
                <th>Passages</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc._id}>
                  <td>
                    {doc.title}
                    {doc.note ? <div className="meta">{doc.note}</div> : null}
                    {doc.error ? <div className="meta">{doc.error}</div> : null}
                  </td>
                  <td>{doc.filename}</td>
                  <td>{fileSize(doc.bytes)}</td>
                  <td><span className={`status ${doc.status}`}>{doc.status}</span></td>
                  <td>{doc.chunkCount || '—'}</td>
                  <td>
                    <div className="row">
                      <button className="btn ghost" type="button" onClick={() => void download(doc)}>Download</button>
                      <button className="btn ghost" type="button" onClick={() => void reindex(doc)}>Read again</button>
                      <button className="btn danger" type="button" onClick={() => void remove(doc)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

export function ChatPage({ siteId }: { siteId: string }) {
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [threadId, setThreadId] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const scroller = useRef<HTMLDivElement>(null)

  function loadThreads() {
    if (!siteId) return
    api<{ threads: ChatThread[] }>(`/api/sites/${siteId}/threads`).then((result) => setThreads(result.threads)).catch(() => setThreads([]))
  }

  useEffect(() => {
    setThreadId('')
    setMessages([])
    loadThreads()
  }, [siteId])

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight })
  }, [messages, busy])

  async function openThread(id: string) {
    setThreadId(id)
    setError('')
    const result = await api<{ messages: ChatMessage[] }>(`/api/threads/${id}`)
    setMessages(result.messages)
  }

  function startNew() {
    setThreadId('')
    setMessages([])
    setError('')
    setDraft('')
  }

  async function removeThread(id: string) {
    if (!window.confirm('Delete this chat?')) return
    await api(`/api/threads/${id}`, { method: 'DELETE' })
    setThreads((current) => current.filter((item) => item._id !== id))
    if (threadId === id) startNew()
  }

  async function send(event: FormEvent) {
    event.preventDefault()
    const content = draft.trim()
    if (!siteId || !content || busy) return
    setBusy(true)
    setError('')
    setDraft('')
    const pending: ChatMessage = { _id: 'pending', role: 'user', content, sources: [], createdAt: new Date().toISOString() }
    setMessages((current) => [...current, pending])
    try {
      let id = threadId
      if (!id) {
        const created = await api<{ thread: ChatThread }>(`/api/sites/${siteId}/threads`, { method: 'POST', body: JSON.stringify({ title: 'New chat' }) })
        id = created.thread._id
        setThreadId(id)
        setThreads((current) => [created.thread, ...current])
      }
      const result = await api<{ message: ChatMessage; thread: ChatThread }>(`/api/threads/${id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      })
      setMessages((current) => [...current.filter((item) => item._id !== 'pending'), { ...pending, _id: `user-${result.message._id}` }, result.message])
      setThreads((current) => current.map((item) => (item._id === id ? result.thread : item)))
    } catch (reason) {
      setMessages((current) => current.filter((item) => item._id !== 'pending'))
      setDraft(content)
      setError(reason instanceof Error ? reason.message : 'The assistant could not answer.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="chat-layout">
      <aside className="thread-pane">
        <button className="btn accent" type="button" onClick={startNew}>New chat</button>
        <div className="thread-list">
          {threads.map((thread) => (
            <button key={thread._id} className={`thread ${thread._id === threadId ? 'active' : ''}`} type="button" onClick={() => void openThread(thread._id)}>
              <strong>{thread.title}</strong>
              <div className="meta">{listedAt(thread.updatedAt)}</div>
            </button>
          ))}
        </div>
      </aside>
      <section className="chat-pane">
        <div className="messages" ref={scroller}>
          {messages.length === 0 ? (
            <p className="note">Ask about a policy, a process, a task or a project quote. The answer comes from the documents in Knowledge.</p>
          ) : null}
          {messages.map((message) => (
            <article key={message._id} className={`bubble ${message.role === 'user' ? 'user' : 'assistant'}`}>
              {message.content}
              {message.role === 'assistant' && message.sources?.length ? (
                <div className="sources">
                  {message.sources.map((source) => (
                    <p key={`${source.title}-${source.page}-${source.excerpt}`} className="meta">
                      From {source.title}{source.page ? `, page ${source.page}` : ''}
                    </p>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
          {busy ? <p className="note">Reading the documents…</p> : null}
          {error ? <p className="error">{error}</p> : null}
        </div>
        <form className="composer" onSubmit={(event) => void send(event)}>
          <textarea
            value={draft}
            placeholder="Ask a question"
            rows={2}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
          />
          <button className="btn accent" type="submit" disabled={busy || !draft.trim()}>{busy ? 'Sending…' : 'Send'}</button>
        </form>
        {threadId ? (
          <div className="row" style={{ padding: '0 16px 14px' }}>
            <button className="btn ghost" type="button" onClick={() => void removeThread(threadId)}>Delete this chat</button>
          </div>
        ) : null}
      </section>
    </div>
  )
}
