import { applyArticles } from '../data/journal'
import type { JournalArticle } from '../data/journal'
import { applyMedia, applyJourneyPhotos, type Frame } from '../data/media'
import { applyPages, type PageCopy } from '../data/pageCopy'
import { applyProjects, type Project } from '../data/projects'
import { applyServices, type Service } from '../data/services'
import { applyStory } from '../data/story'
import { applyCompanySettings } from '../data/company'
import { applyNavigation, type NavItem } from '../data/navigation'

export interface CmsPayload {
  settings?: {
    name?: string
    tagline?: string
    promise?: string
    lines?: string[]
    experienceYears?: number
    completedProjects?: number
    whatsappMessage?: string
    contact?: Record<string, unknown>
    area?: Record<string, string>
    logo?: { webp?: string; png?: string; width?: number; height?: number }
    brochure?: string
    servicePlaces?: string[]
    navigation?: { main?: NavItem[]; mobile?: NavItem[]; footer?: NavItem[] }
  }
  pages?: PageCopy[]
  collections?: Record<string, unknown[]>
}

function frameOf(value: unknown): Frame | null {
  if (!value || typeof value !== 'object') return null
  const record = value as { src?: string; alt?: string; width?: number; height?: number }
  if (!record.src) return null
  return { src: record.src, alt: record.alt || '', width: record.width || 1200, height: record.height || 800 }
}

function cards(items: unknown[] | undefined) {
  return (items || []).map((item) => {
    const record = item as { number?: string; title?: string; text?: string; code?: string; key?: string; image?: unknown }
    return record
  })
}

export function applyCms(payload: CmsPayload) {
  if (payload.settings) {
    const settings = payload.settings
    applyCompanySettings({
      name: settings.name,
      tagline: settings.tagline,
      promise: settings.promise,
      lines: settings.lines,
      experienceYears: settings.experienceYears,
      completedProjects: settings.completedProjects,
      whatsappMessage: settings.whatsappMessage,
      contact: settings.contact as never,
      area: settings.area,
      logo: settings.logo,
      brochure: settings.brochure,
      servicePlaces: settings.servicePlaces,
    })
    if (settings.navigation) applyNavigation(settings.navigation)
  }
  if (payload.pages?.length) applyPages(payload.pages)
  const collections = payload.collections || {}
  if (Array.isArray(collections.projects)) applyProjects(collections.projects as Project[])
  if (Array.isArray(collections.services)) applyServices(collections.services as Service[])
  if (Array.isArray(collections.journal)) applyArticles(collections.journal as JournalArticle[])
  const withImage = (name: string) => cards(collections[name]).map((item) => frameOf(item.image)).filter((item): item is Frame => Boolean(item))
  applyStory({
    journey: cards(collections.journey).map((item) => ({ number: item.number || '', title: item.title || '', text: item.text || '' })),
    process: cards(collections.process).map((item) => ({ number: item.number || '', title: item.title || '', text: item.text || '' })),
    land: cards(collections.land).map((item) => ({ title: item.title || '', text: item.text || '' })),
    drawings: cards(collections.drawings).map((item) => ({ code: item.code || '', title: item.title || '' })),
    approvals: cards(collections.approvals).map((item) => ({ title: item.title || '', text: item.text || '' })),
    construction: cards(collections.construction).map((item) => ({ number: item.number || '', title: item.title || '', text: item.text || '' })),
    interiors: cards(collections.interiors).map((item) => ({ title: item.title || '', text: item.text || '' })),
    furniture: cards(collections.furniture).map((item) => ({ title: item.title || '', text: item.text || '' })),
    quality: cards(collections.quality).map((item) => ({ title: item.title || '', text: item.text || '' })),
    beyond: cards(collections.beyond).map((item) => ({ title: item.title || '', text: item.text || '' })),
    hero: cards(collections.hero).map((item) => ({ key: item.key || '', title: item.title || '', text: item.text || '' })),
  })
  applyJourneyPhotos(cards(collections.journey).map((item) => frameOf(item.image)))
  const design = cards(collections.design)[0]
  applyMedia({
    gallery: (collections.gallery || []).map(frameOf).filter((item): item is Frame => Boolean(item)),
    comparisons: collections.comparisons as unknown as typeof import('../data/media').comparisons,
    process: withImage('process'),
    interiors: withImage('interiors'),
    furniture: withImage('furniture'),
    beyond: withImage('beyond'),
    design: design ? frameOf(design.image) || undefined : undefined,
    construction: withImage('construction')[0],
  })
}

let revision = 0
const listeners = new Set<() => void>()

export function cmsRevision() {
  return revision
}

export function subscribeCms(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function publishCms() {
  revision += 1
  listeners.forEach((listener) => listener())
}
