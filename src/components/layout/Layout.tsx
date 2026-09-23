import { Suspense, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ScrollTrigger } from '../../lib/gsap'
import { initAnalytics } from '../../lib/analytics'
import { useLenis } from '../../hooks/useLenis'
import { Nav } from './Nav'
import { MobileMenu } from './MobileMenu'
import { Footer } from './Footer'
import { JHomesConstructionLoader } from '../loader/JHomesConstructionLoader'
import { PassageLoader } from '../loader/PassageLoader'
import { ActionDock } from '../ui/ActionDock'
import { CustomCursor } from '../ui/CustomCursor'

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center px-6 pt-28">
      <p className="label">J Homes</p>
    </div>
  )
}

function RouteReady({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady()
  }, [onReady])
  return null
}

export function Layout() {
  const [open, setOpen] = useState(false)
  const [booting, setBooting] = useState(true)
  const [passing, setPassing] = useState(false)
  const [appReady, setAppReady] = useState(false)
  const { pathname, hash } = useLocation()
  const [trackedPath, setTrackedPath] = useState(pathname)
  const lenis = useLenis()
  const bar = useRef<HTMLDivElement>(null)
  const markReady = useRef(() => setAppReady(true))
  const finishPassage = useRef(() => setPassing(false))

  if (trackedPath !== pathname) {
    setTrackedPath(pathname)
    setAppReady(false)
    setBooting(false)
    setPassing(true)
  }

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    let live = true
    const mark = () => {
      if (live) setAppReady(true)
    }
    const cap = window.setTimeout(mark, 8000)
    const fonts = document.fonts?.ready ?? Promise.resolve()
    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', () => resolve(), { once: true })
    })
    Promise.all([fonts.catch(() => undefined), loaded]).then(mark)
    return () => {
      live = false
      window.clearTimeout(cap)
    }
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const locked = open || booting || passing
    document.documentElement.classList.toggle('menu-lock', locked)
    if (!lenis) return
    if (locked) lenis.stop()
    else lenis.start()
    return () => {
      document.documentElement.classList.remove('menu-lock')
      lenis.start()
    }
  }, [booting, lenis, open, passing])

  useEffect(() => {
    const toTop = () => {
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
      window.scrollTo(0, 0)
    }
    if (hash) {
      const target = document.querySelector(hash)
      if (target instanceof HTMLElement) {
        if (lenis) lenis.scrollTo(target, { offset: -12, immediate: true, force: true })
        else target.scrollIntoView()
      } else {
        toTop()
      }
    } else {
      toTop()
    }
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      if (!hash) toTop()
    })
    return () => cancelAnimationFrame(frame)
  }, [hash, lenis, pathname, passing])

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight
      const progress = height > 0 ? window.scrollY / height : 0
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <div ref={bar} aria-hidden="true" className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-crimson" />
      <Nav open={open} onMenu={() => setOpen((value) => !value)} />
      <MobileMenu open={open} onClose={() => setOpen(false)} />
      <main id="content" tabIndex={-1}>
        <Suspense fallback={<PageFallback />}>
          <Outlet />
          <RouteReady key={pathname} onReady={() => markReady.current()} />
        </Suspense>
      </main>
      <Footer />
      {!open && <ActionDock />}
      <CustomCursor />
      {booting && (
        <JHomesConstructionLoader isReady={appReady} onComplete={() => setBooting(false)} />
      )}
      {passing && (
        <PassageLoader key={pathname} isReady={appReady} onComplete={() => finishPassage.current()} />
      )}
    </>
  )
}
