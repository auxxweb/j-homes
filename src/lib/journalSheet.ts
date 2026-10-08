import { articles as fallbackArticles, type JournalArticle, type JournalBlock } from '../data/journal'

export function journalSheetId() {
  return (import.meta.env.VITE_JOURNAL_SHEET_ID ?? '').trim()
}

export function journalEndpoint() {
  return (import.meta.env.VITE_JOURNAL_ENDPOINT ?? '').trim()
}

export function journalConfigured() {
  return Boolean(journalEndpoint() || journalSheetId())
}

const STORAGE_KEY = 'jhomes-journal'
let cached: JournalArticle[] | null = null
let pending: Promise<JournalArticle[]> | null = null

export function journalSnapshot() {
  return cached ?? readStored() ?? fallbackArticles
}

export function loadJournal() {
  if (cached) return Promise.resolve(cached)
  if (pending) return pending
  pending = fetchJournal()
    .then((articles) => {
      remember(articles)
      return articles
    })
    .catch(() => journalSnapshot())
    .finally(() => {
      pending = null
    })
  return pending
}

function fetchJournal() {
  const endpoint = journalEndpoint()
  if (endpoint) {
    return fetch(endpoint)
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status))
        return response.json() as Promise<{ ok?: boolean; rows?: unknown[][]; error?: string }>
      })
      .then((data) => {
        if (!data.ok || !Array.isArray(data.rows)) throw new Error(data.error || 'Journal was not returned.')
        const rows = data.rows.map((row) => (Array.isArray(row) ? row.map((cell) => (cell == null ? '' : String(cell))) : []))
        return articlesFromTable(rows)
      })
  }
  const id = journalSheetId()
  if (!id) return Promise.resolve(fallbackArticles)
  const url = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(id)}/gviz/tq?tqx=out:csv&sheet=Journal`
  return fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(String(response.status))
      return response.text()
    })
    .then((text) => articlesFromCsv(text))
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || !parsed.every(isArticle)) return null
    return parsed
  } catch {
    return null
  }
}

function remember(articles: JournalArticle[]) {
  cached = articles
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
  } catch {
    // Storage can be blocked. The posts are still on the page.
  }
}

function isArticle(value: unknown): value is JournalArticle {
  if (!value || typeof value !== 'object') return false
  const article = value as JournalArticle
  return typeof article.slug === 'string' && article.slug.length > 0 && typeof article.title === 'string' && Array.isArray(article.blocks)
}

export function articlesFromCsv(text: string) {
  return articlesFromTable(parseCsv(text))
}

export function articlesFromTable(table: string[][]): JournalArticle[] {
  const rows = table.filter((row) => row.some((cell) => cell.trim()))
  if (rows.length < 2) return []
  const headers = rows[0].map((header) => header.replace(/^\uFEFF/, '').trim().toLowerCase())
  const column = (name: string) => headers.indexOf(name)
  const slugColumn = column('slug')
  const titleColumn = column('title')
  const textColumn = column('text')
  if (slugColumn < 0 || titleColumn < 0 || textColumn < 0) throw new Error('Journal sheet is missing Slug, Title, or Text.')

  const descriptionColumn = column('description')
  const seoColumn = column('seo title')
  const kickerColumn = column('kicker')
  const orderColumn = column('order')
  const typeColumn = column('block type')

  const drafts = new Map<
    string,
    { title: string; description: string; seoTitle: string; kicker: string; blocks: { order: number; type: JournalBlock['type']; text: string }[] }
  >()
  const orderOfSlug: string[] = []
  let carriedSlug = ''

  rows.slice(1).forEach((row, index) => {
    const slug = cell(row, slugColumn) || carriedSlug
    if (!slug) return
    carriedSlug = slug
    const draft = drafts.get(slug) ?? { title: '', description: '', seoTitle: '', kicker: '', blocks: [] }
    if (!drafts.has(slug)) {
      drafts.set(slug, draft)
      orderOfSlug.push(slug)
    }
    draft.title = draft.title || cell(row, titleColumn)
    draft.description = draft.description || cell(row, descriptionColumn)
    draft.seoTitle = draft.seoTitle || cell(row, seoColumn)
    draft.kicker = draft.kicker || cell(row, kickerColumn)
    const text = cell(row, textColumn)
    if (!text) return
    const orderValue = cell(row, orderColumn)
    const order = orderValue && Number.isFinite(Number(orderValue)) ? Number(orderValue) : index + 1
    const kind = cell(row, typeColumn).toLowerCase()
    draft.blocks.push({ order, type: kind.startsWith('h') ? 'h2' : 'p', text })
  })

  return orderOfSlug.flatMap((slug) => {
    const draft = drafts.get(slug)
    if (!draft?.title) return []
    const blocks = [...draft.blocks].sort((a, b) => a.order - b.order).map(({ type, text }) => ({ type, text }))
    return [
      {
        slug,
        title: draft.title,
        description: draft.description,
        seoTitle: draft.seoTitle,
        kicker: draft.kicker,
        blocks,
      },
    ]
  })
}

function cell(row: string[], index: number) {
  if (index < 0) return ''
  return (row[index] ?? '').trim()
}

function parseCsv(text: string) {
  const rows: string[][] = []
  let row: string[] = []
  let value = ''
  let quoted = false
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    if (quoted) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          value += '"'
          index += 1
        } else {
          quoted = false
        }
      } else {
        value += char
      }
      continue
    }
    if (char === '"') {
      quoted = true
    } else if (char === ',') {
      row.push(value)
      value = ''
    } else if (char === '\n') {
      row.push(value)
      rows.push(row)
      row = []
      value = ''
    } else if (char !== '\r') {
      value += char
    }
  }
  if (value.length > 0 || row.length > 0) {
    row.push(value)
    rows.push(row)
  }
  return rows
}
