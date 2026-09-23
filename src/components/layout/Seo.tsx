import { useEffect } from 'react'
import { absoluteUrl } from '../../lib/seo'

interface SeoProps {
  title: string
  description: string
  path: string
  image?: string
  jsonLd?: unknown
  noIndex?: boolean
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

export function Seo({ title, description, path, image, jsonLd, noIndex = false }: SeoProps) {
  const serialized = JSON.stringify(jsonLd ?? null)
  const imageUrl = absoluteUrl(image ?? '/brand/j-homes-logo.png')
  const url = absoluteUrl(path)

  useEffect(() => {
    document.title = title
    setMeta('name', 'description', description)
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow')
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', 'J Homes')
    setMeta('property', 'og:locale', 'en_IN')
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', imageUrl)
    setMeta('property', 'og:image:alt', 'J Homes logo')
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', imageUrl)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)

    const existing = document.getElementById('ld-json')
    if (!jsonLd) {
      existing?.remove()
      return
    }
    const script = existing ?? document.createElement('script')
    script.id = 'ld-json'
    script.setAttribute('type', 'application/ld+json')
    script.textContent = serialized
    if (!existing) document.head.appendChild(script)
  }, [description, imageUrl, jsonLd, noIndex, path, serialized, title, url])

  return null
}
