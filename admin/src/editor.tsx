import { useState } from 'react'
import type { Field } from './schema'
import { readPath, writePath } from './schema'
import { api, apiBase, type MediaRecord } from './api'

export function Editor({
  fields,
  value,
  siteId,
  onChange,
}: {
  fields: Field[]
  value: Record<string, unknown>
  siteId: string
  onChange: (next: Record<string, unknown>) => void
}) {
  return (
    <div className="stack">
      {fields.map((field) => (
        <FieldControl key={field.path} field={field} value={value} siteId={siteId} onChange={onChange} />
      ))}
    </div>
  )
}

function FieldControl({
  field,
  value,
  siteId,
  onChange,
}: {
  field: Field
  value: Record<string, unknown>
  siteId: string
  onChange: (next: Record<string, unknown>) => void
}) {
  const current = readPath(value, field.path)
  const set = (next: unknown) => onChange(writePath(value, field.path, next))

  if (field.type === 'area') {
    return (
      <label className="field">
        <span>{field.label}</span>
        <textarea value={typeof current === 'string' ? current : ''} onChange={(event) => set(event.target.value)} />
      </label>
    )
  }
  if (field.type === 'number') {
    return (
      <label className="field">
        <span>{field.label}</span>
        <input type="number" value={typeof current === 'number' ? current : Number(current || 0)} onChange={(event) => set(Number(event.target.value))} />
      </label>
    )
  }
  if (field.type === 'image') {
    return <ImageField label={field.label} url={typeof current === 'string' ? current : ''} siteId={siteId} onChange={set} />
  }
  if (field.type === 'list') {
    const items = Array.isArray(current) ? current.map(String) : []
    return (
      <div className="field">
        <span>{field.label}</span>
        <div className="stack">
          {items.map((item, index) => (
            <div className="row" key={index}>
              <input
                value={item}
                onChange={(event) => set(items.map((entry, entryIndex) => (entryIndex === index ? event.target.value : entry)))}
              />
              <button className="btn ghost" type="button" onClick={() => set(items.filter((_, entryIndex) => entryIndex !== index))}>
                Remove
              </button>
            </div>
          ))}
          <button className="btn ghost" type="button" onClick={() => set([...items, ''])}>
            Add line
          </button>
        </div>
      </div>
    )
  }
  if (field.type === 'cards') {
    const items = Array.isArray(current) ? (current as { title?: string; text?: string }[]) : []
    return (
      <div className="field">
        <span>{field.label}</span>
        <div className="stack">
          {items.map((item, index) => (
            <div className="repeat" key={index}>
              <input
                value={item.title || ''}
                placeholder="Title"
                onChange={(event) => set(items.map((entry, entryIndex) => (entryIndex === index ? { ...entry, title: event.target.value } : entry)))}
              />
              <textarea
                value={item.text || ''}
                placeholder="Text"
                onChange={(event) => set(items.map((entry, entryIndex) => (entryIndex === index ? { ...entry, text: event.target.value } : entry)))}
              />
              <button className="btn ghost" type="button" onClick={() => set(items.filter((_, entryIndex) => entryIndex !== index))}>
                Remove
              </button>
            </div>
          ))}
          <button className="btn ghost" type="button" onClick={() => set([...items, { title: '', text: '' }])}>
            Add card
          </button>
        </div>
      </div>
    )
  }
  if (field.type === 'blocks') {
    const items = Array.isArray(current) ? (current as { type?: string; text?: string }[]) : []
    return (
      <div className="field">
        <span>{field.label}</span>
        <div className="stack">
          {items.map((item, index) => (
            <div className="repeat" key={index}>
              <select
                value={item.type === 'h2' ? 'h2' : 'p'}
                onChange={(event) => set(items.map((entry, entryIndex) => (entryIndex === index ? { ...entry, type: event.target.value } : entry)))}
              >
                <option value="p">Paragraph</option>
                <option value="h2">Heading</option>
              </select>
              <textarea
                value={item.text || ''}
                onChange={(event) => set(items.map((entry, entryIndex) => (entryIndex === index ? { ...entry, text: event.target.value } : entry)))}
              />
              <button className="btn ghost" type="button" onClick={() => set(items.filter((_, entryIndex) => entryIndex !== index))}>
                Remove
              </button>
            </div>
          ))}
          <button className="btn ghost" type="button" onClick={() => set([...items, { type: 'p', text: '' }])}>
            Add block
          </button>
        </div>
      </div>
    )
  }
  if (field.type === 'images') {
    const items = Array.isArray(current) ? (current as { src?: string; alt?: string }[]) : []
    return (
      <div className="field">
        <span>{field.label}</span>
        <div className="stack">
          {items.map((item, index) => (
            <div className="repeat" key={index}>
              <ImageField
                label="Photo"
                url={item.src || ''}
                siteId={siteId}
                onChange={(url) => set(items.map((entry, entryIndex) => (entryIndex === index ? { ...entry, src: url } : entry)))}
              />
              <input
                value={item.alt || ''}
                placeholder="Description"
                onChange={(event) => set(items.map((entry, entryIndex) => (entryIndex === index ? { ...entry, alt: event.target.value } : entry)))}
              />
              <button className="btn ghost" type="button" onClick={() => set(items.filter((_, entryIndex) => entryIndex !== index))}>
                Remove photo
              </button>
            </div>
          ))}
          <button className="btn ghost" type="button" onClick={() => set([...items, { src: '', alt: '' }])}>
            Add photo
          </button>
        </div>
      </div>
    )
  }
  return (
    <label className="field">
      <span>{field.label}</span>
      <input value={typeof current === 'string' ? current : ''} onChange={(event) => set(event.target.value)} />
    </label>
  )
}

export function ImageField({
  label,
  url,
  siteId,
  onChange,
}: {
  label: string
  url: string
  siteId: string
  onChange: (url: string) => void
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function upload(file: File) {
    setBusy(true)
    setError('')
    try {
      const body = new FormData()
      body.set('file', file)
      body.set('alt', label)
      const result = await api<{ media: MediaRecord }>(`/api/sites/${siteId}/media`, { method: 'POST', body })
      onChange(result.media.url)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Upload failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <label className="field">
      <span>{label}</span>
      {url ? <img className="thumb" src={url.startsWith('http') ? url : `${apiBase}${url}`} alt="" /> : null}
      <input value={url} onChange={(event) => onChange(event.target.value)} placeholder="Image address" />
      <input
        type="file"
        accept="image/*,video/*"
        disabled={busy}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void upload(file)
        }}
      />
      {busy ? <p className="note">Uploading…</p> : null}
      {error ? <p className="error">{error}</p> : null}
    </label>
  )
}
