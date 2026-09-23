type AnalyticsWindow = Window & {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
}

export function initAnalytics() {
  const id = (import.meta.env.VITE_GA_ID ?? '').trim()
  if (!id || typeof window === 'undefined') return
  const w = window as AnalyticsWindow
  if (w.gtag) return
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(script)
  w.dataLayer = w.dataLayer ?? []
  w.gtag = (...args: unknown[]) => {
    w.dataLayer?.push(args)
  }
  w.gtag('js', new Date())
  w.gtag('config', id, { anonymize_ip: true })
}

export function track(event: string, params?: Record<string, string>) {
  if (typeof window === 'undefined') return
  const w = window as AnalyticsWindow
  w.gtag?.('event', event, params)
}
