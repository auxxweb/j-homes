import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { company } from '../../data/company'
import { gsap } from '../../lib/gsap'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { Logo } from '../ui/Logo'
import { ConstructionScene } from './ConstructionScene'
import {
  LOADER_DURATION,
  MIN_DISPLAY_MS,
  MOBILE_MIN_DISPLAY_MS,
  READY_FALLBACK_MS,
  REDUCED_MIN_DISPLAY_MS,
  STAGE,
} from './loaderData'
import { createConstructionTimeline, playLoaderExit, prepareConstruction } from './loaderAnimation'
import './loader.css'

type JHomesConstructionLoaderProps = {
  isReady: boolean
  onComplete: () => void
}

export function JHomesConstructionLoader({ isReady, onComplete }: JHomesConstructionLoaderProps) {
  const reduced = usePrefersReducedMotion()
  const [visible] = useState(true)
  const [variant] = useState<'desktop' | 'mobile'>(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop',
  )
  const [failed, setFailed] = useState(false)
  const [phase, setPhase] = useState('')
  const [finaleOn, setFinaleOn] = useState(reduced)
  const [animDone, setAnimDone] = useState(false)
  const [minMet, setMinMet] = useState(false)
  const [forceReady, setForceReady] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)
  const ctxRef = useRef<gsap.Context | null>(null)
  const buildRef = useRef<gsap.core.Timeline | null>(null)
  const exitRef = useRef<gsap.core.Timeline | null>(null)
  const stageRef = useRef<(label: string) => void>(() => undefined)
  const exiting = useRef(false)
  const finished = useRef(false)

  useEffect(() => {
    stageRef.current = (label: string) => {
      if (label === STAGE.finale) setFinaleOn(true)
      else setPhase(label)
    }
  })

  useLayoutEffect(() => {
    document.getElementById('preloader')?.remove()
    if (!visible || reduced) return
    const root = rootRef.current
    if (!root) return

    try {
      const ctx = gsap.context(() => {
        prepareConstruction(root)
        const timeline = createConstructionTimeline(root, {
          compact: variant === 'mobile',
          onStage: (label) => stageRef.current(label),
        })
        buildRef.current = timeline
        timeline.eventCallback('onComplete', () => setAnimDone(true))
        timeline.play()
      }, root)
      ctxRef.current = ctx
    } catch {
      setFailed(true)
      setAnimDone(true)
      setFinaleOn(true)
    }

    return () => {
      exitRef.current?.kill()
      ctxRef.current?.revert()
      ctxRef.current = null
      buildRef.current = null
      const navLogo = document.querySelector<HTMLElement>('[aria-label="J Homes, home"]')
      if (navLogo) gsap.set(navLogo, { clearProps: 'opacity,visibility' })
    }
  }, [reduced, variant, visible])

  useEffect(() => {
    if (!visible) return
    const wait = reduced ? REDUCED_MIN_DISPLAY_MS : variant === 'mobile' ? MOBILE_MIN_DISPLAY_MS : MIN_DISPLAY_MS
    const minimum = window.setTimeout(() => setMinMet(true), wait)
    const fallback = window.setTimeout(() => setForceReady(true), READY_FALLBACK_MS)
    const stuck = window.setTimeout(() => setAnimDone(true), LOADER_DURATION * 1000 + 2500)
    return () => {
      window.clearTimeout(minimum)
      window.clearTimeout(fallback)
      window.clearTimeout(stuck)
    }
  }, [reduced, variant, visible])

  useEffect(() => {
    if (!visible || reduced || failed) return
    const root = rootRef.current
    if (!root) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine || variant === 'mobile') return

    const back = root.querySelector('[data-depth="back"]')
    const fore = root.querySelector('[data-depth="fore"]')
    const grid = root.querySelector('[data-loader="grid"]')

    const onMove = (event: PointerEvent) => {
      if (exiting.current) return
      const x = event.clientX / window.innerWidth - 0.5
      const y = event.clientY / window.innerHeight - 0.5
      if (grid) gsap.to(grid, { x: x * -16, y: y * -8, duration: 0.8, overwrite: 'auto', ease: 'power2.out' })
      if (back) gsap.to(back, { x: x * -10, y: y * -4, duration: 0.8, overwrite: 'auto', ease: 'power2.out' })
      if (fore) gsap.to(fore, { x: x * 12, y: y * 5, duration: 0.8, overwrite: 'auto', ease: 'power2.out' })
    }

    root.addEventListener('pointermove', onMove)
    return () => {
      root.removeEventListener('pointermove', onMove)
      ;[grid, back, fore].forEach((node) => {
        if (node) gsap.killTweensOf(node)
      })
    }
  }, [failed, reduced, variant, visible])

  useEffect(() => {
    if (!visible || !animDone || isReady || forceReady || reduced) return
    const glow = rootRef.current?.querySelectorAll('[data-part="glow"]')
    if (!glow?.length) return
    const breath = gsap.to(glow, { opacity: 0.45, duration: 1.3, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    return () => {
      breath.kill()
    }
  }, [animDone, forceReady, isReady, reduced, visible])

  const finish = () => {
    if (finished.current) return
    finished.current = true
    onComplete()
  }

  const startExit = (fast: boolean) => {
    const root = rootRef.current
    if (!root || exiting.current) return
    exiting.current = true
    buildRef.current?.pause()
    exitRef.current = playLoaderExit(root, finish, fast)
  }

  const storyDone = reduced || failed || animDone
  const canExit = visible && storyDone && minMet && (isReady || forceReady)

  useEffect(() => {
    if (!canExit) return
    startExit(reduced)
  }, [canExit, reduced])

  if (!visible) return null

  const frozen = reduced || failed

  return (
    <div
      ref={rootRef}
      className={`loader-root fixed inset-0 z-[75] overflow-hidden bg-paper text-ink ${frozen ? 'is-static' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="J Homes is preparing the page"
    >
      <div data-loader="grid" className="sheet-grid pointer-events-none absolute inset-0" />
      <div
        data-loader="evening"
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 46%, rgba(188, 0, 0, 0.07), transparent 58%)',
        }}
      />
      <div className="relative flex h-full flex-col items-center px-5">
        <div data-loader="intro" className="pt-[5vh] text-center">
          <p className="font-serif text-[2.4rem] leading-none tracking-tight text-ink md:text-5xl">J HOMES</p>
          <p className="label mt-3">{company.tagline}</p>
        </div>
        <p data-loader="phase" className="label mt-4 h-4">
          {phase}
        </p>
        <div data-loader="scene" className="loader-scene flex min-h-0 w-full max-w-[1080px] flex-1 items-center justify-center">
          <ConstructionScene variant={variant} />
        </div>
        <div data-loader="finale" aria-hidden={finaleOn ? undefined : true} className="w-full max-w-3xl pb-[max(3.25rem,5vh)] text-center">
          <div data-loader="logo" className="flex justify-center">
            <Logo className="h-16 w-auto md:h-24" />
          </div>
          <div data-loader="finale-copy">
            <span data-loader="finale-rule" className="mx-auto mt-3 block h-px w-14 origin-center bg-crimson" />
            <p className="label mt-3">{company.tagline}</p>
            <p className="mt-3 font-serif text-[1.35rem] leading-none tracking-tight text-ink uppercase sm:text-[2rem] sm:whitespace-nowrap">
              From first step to final finish.
            </p>
            <p className="label mt-4 text-crimson">Welcome home</p>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="label absolute right-5 bottom-6 underline-offset-4 hover:underline md:right-10"
        onClick={() => startExit(true)}
      >
        Skip
      </button>
    </div>
  )
}
