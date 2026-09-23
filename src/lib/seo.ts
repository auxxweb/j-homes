import { company } from '../data/company'

export function siteOrigin() {
  const configured = (import.meta.env.VITE_SITE_URL ?? '').trim().replace(/\/$/, '')
  if (configured) return configured
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

export function absoluteUrl(path: string) {
  const origin = siteOrigin()
  const normalized = path.startsWith('/') ? path : `/${path}`
  return origin ? `${origin}${normalized}` : normalized
}

export interface Crumb {
  name: string
  path: string
}

export function organizationLd() {
  const url = absoluteUrl('/')
  const data: Record<string, unknown> = {
    '@type': 'Organization',
    name: company.name,
    slogan: 'From first step to final finish.',
    description:
      'J Homes provides residential construction, architectural design, interiors and complete turnkey home solutions across Kochi, Ernakulam and Kerala.',
    areaServed: [
      { '@type': 'City', name: 'Kochi' },
      { '@type': 'AdministrativeArea', name: 'Ernakulam' },
      { '@type': 'AdministrativeArea', name: 'Kerala' },
    ],
    logo: absoluteUrl(company.logo.png),
    knowsAbout: [
      'Residential construction',
      'Architectural design',
      'Interior design',
      'Turnkey homes',
    ],
  }
  if (url.startsWith('http')) data.url = url
  if (company.contact.phone) data.telephone = company.contact.phone
  if (company.contact.email) data.email = company.contact.email
  return data
}

export function websiteLd() {
  const url = absoluteUrl('/')
  return {
    '@type': 'WebSite',
    name: company.name,
    ...(url.startsWith('http') ? { url } : {}),
    publisher: { '@type': 'Organization', name: company.name },
  }
}

export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  }
}

export function graphLd(nodes: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  }
}
