import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { gsap, ScrollTrigger } from '../lib/gsap'

const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
  return useContext(LenisContext)
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (reduced) return
    const instance = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      autoRaf: false,
    })
    instance.on('scroll', ScrollTrigger.update)
    const ticker = (time: number) => {
      instance.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)
    const refresh = () => ScrollTrigger.refresh()
    const frame = requestAnimationFrame(refresh)
    document.fonts.ready.then(refresh).catch(() => undefined)
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

    return () => {
      cancelAnimationFrame(frame)
      gsap.ticker.remove(ticker)
      instance.destroy()
      setLenis(null)
    }
  }, [reduced])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
