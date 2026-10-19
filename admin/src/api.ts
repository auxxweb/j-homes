export const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '')

const TOKEN_KEY = 'jhomes-admin-token'
const SITE_KEY = 'jhomes-admin-site'

export function token() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setToken(value: string) {
  if (value) localStorage.setItem(TOKEN_KEY, value)
  else localStorage.removeItem(TOKEN_KEY)
}

export function savedSiteId() {
  return localStorage.getItem(SITE_KEY) || ''
}

export function saveSiteId(id: string) {
  localStorage.setItem(SITE_KEY, id)
}

export class ApiError extends Error {}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (!(init.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  const auth = token()
  if (auth) headers.set('Authorization', `Bearer ${auth}`)
  const response = await fetch(`${apiBase}${path}`, { ...init, headers })
  const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string }
  if (!response.ok || data.ok === false) throw new ApiError(data.error || 'The request could not be completed.')
  return data as T
}

export interface User {
  email: string
  name: string
  role: string
}

export function isSuper(user: User | null) {
  return user?.role === 'superadmin' || user?.role === 'admin'
}

export interface Account {
  _id: string
  email: string
  name: string
  role: string
  createdAt: string
}

export interface KnowledgeDoc {
  _id: string
  title: string
  filename: string
  mime: string
  bytes: number
  status: string
  error: string
  note: string
  chunkCount: number
  createdAt: string
}

export interface ChatSource {
  title: string
  page: string
  excerpt: string
}

export interface ChatMessage {
  _id: string
  role: string
  content: string
  sources: ChatSource[]
  createdAt: string
}

export interface ChatThread {
  _id: string
  title: string
  updatedAt: string
}

export interface Site {
  _id: string
  name: string
  slug: string
  domain: string
  template: string
  status: string
  settings: Record<string, unknown>
}

export interface PageContent {
  slug: string
  path: string
  title: string
  kicker: string
  lede: string
  seoTitle: string
  seoDescription: string
  sections: { heading: string; text: string; image?: string }[]
}

export interface PageRecord extends PageContent {
  _id: string
  order: number
  draft?: PageContent | null
}

export interface EntryRecord {
  _id: string
  collection: string
  slug: string
  title: string
  order: number
  published: boolean
  data: Record<string, unknown>
}

export interface ChecklistAnswer {
  section: string
  label: string
  value: string
}

export interface ChecklistRecord {
  _id: string
  name: string
  phone: string
  location: string
  checklistDate: string
  signature: string
  answers: ChecklistAnswer[]
  pdfUrl: string
  status: string
  submittedAt: string
  createdAt: string
}

export interface EnquiryRecord {
  _id: string
  name: string
  phone: string
  email: string
  location: string
  budget: string
  stage: string
  message: string
  source: string
  status: string
  createdAt: string
}

export interface MediaUse {
  label: string
  detail: string
  href: string
}

export interface MediaRecord {
  _id: string
  url: string
  alt: string
  resourceType: string
  width: number
  height: number
  uses?: MediaUse[]
}
