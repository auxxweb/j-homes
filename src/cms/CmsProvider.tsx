import { useEffect, useState, type ReactNode } from 'react'
import { applyCms, publishCms, subscribeCms, type CmsPayload } from './applyCms'

export function cmsApi() {
  return (import.meta.env.VITE_CMS_API ?? '').trim().replace(/\/$/, '')
}

export function cmsSite() {
  return (import.meta.env.VITE_CMS_SITE ?? 'j-homes').trim() || 'j-homes'
}

export function CmsProvider({ children }: { children: ReactNode }) {
  const [, setRevision] = useState(0)

  useEffect(() => subscribeCms(() => setRevision((value) => value + 1)), [])

  useEffect(() => {
    const endpoint = cmsApi()
    if (!endpoint) return
    const controller = new AbortController()
    fetch(`${endpoint}/api/public/${cmsSite()}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((payload: CmsPayload & { ok?: boolean }) => {
        if (!payload?.ok) return
        applyCms(payload)
        publishCms()
      })
      .catch(() => undefined)
    return () => controller.abort()
  }, [])

  return children
}
