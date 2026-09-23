import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { heroFrames } from '../../data/story'
import { ScrollTrigger } from '../../lib/gsap'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useWebGL } from '../../hooks/useWebGL'
import { Button } from '../ui/Button'
import { BlueprintArt } from './BlueprintArt'

const ResidenceScene = lazy(() => import('./ResidenceScene'))

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function HeroCopy({ frame, reduced }: { frame: number; reduced: boolean }) {
  const current = heroFrames[frame] ?? heroFrames[0]
  const copy = 'mx-auto w-full max-w-xl text-center lg:mx-0 lg:text-left'

  if (reduced) {
    return (
      <div className={copy}>
        <h1 className="display">
          <span className="block">Every home</span>
          <span className="block">begins with</span>
          <span className="block text-crimson italic">an idea.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base text-balance text-ink-soft md:text-lg lg:mx-0">
          From land selection and architectural design to construction, interiors and final handover.
        </p>
        <p className="display mt-10 text-crimson-deep">
          <span className="block">From first step</span>
          <span className="block">to final finish.</span>
        </p>
      </div>
    )
  }

  if (frame >= 9) {
    return (
      <div className={copy}>
        <h1 className="sr-only">Every home begins with an idea.</h1>
        <p className="display">
          <span className="block">From first step</span>
          <span className="block">to final finish.</span>
        </p>
      </div>
    )
  }

  if (frame >= 2) {
    return (
      <div className={copy}>
        <h1 className="sr-only">Every home begins with an idea.</h1>
        <p className="display-3 mx-auto max-w-md lg:mx-0" aria-live="polite">
          {current.text}
        </p>
      </div>
    )
  }

  return (
    <div className={copy}>
      <h1 className="display">
        <span className="block">Every home</span>
        <span className="block">begins with</span>
        <span className="block text-crimson italic">an idea.</span>
      </h1>
      <p className="mx-auto mt-5 max-w-md text-base text-balance text-ink-soft md:text-lg lg:mx-0">
        From land selection and architectural design to construction, interiors and final handover.
      </p>
    </div>
  )
}

function Actions() {
  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center lg:justify-start">
      <Button to="/contact" className="!px-3 !py-2">
        Start your home journey
      </Button>
      <Button to="/projects" variant="line" cursor="view" className="!px-3 !py-2">
        View our projects
      </Button>
    </div>
  )
}

function placeModelHint(visual: HTMLElement, wide: boolean) {
  const box = visual.getBoundingClientRect()
  if (box.width < 1 || box.height < 1) return
  const boardWidth = 860
  const boardHeight = 980
  const scale = Math.min(box.width / boardWidth, box.height / boardHeight)
  const width = boardWidth * scale
  const height = boardHeight * scale
  const x = wide ? box.width - width : (box.width - width) / 2
  const y = (box.height - height) / 2
  visual.style.setProperty('--model-x', `${((x + width * (430 / boardWidth)) / box.width) * 100}%`)
  visual.style.setProperty('--model-y', `${((y + height * (450 / boardHeight)) / box.height) * 100}%`)
}

function Visual({
  show3d,
  progressRef,
  reduced,
  active,
  pixelRatio,
  align,
  placeEnd,
}: {
  show3d: boolean
  progressRef: RefObject<number>
  reduced: boolean
  active: boolean
  pixelRatio: number
  align: 'center' | 'end'
  placeEnd: boolean
}) {
  if (show3d) {
    return (
      <SceneBoundary fallback={<BlueprintArt progressRef={progressRef} reduced={reduced} align={align} />}>
        <Suspense fallback={<BlueprintArt progressRef={progressRef} reduced={reduced} align={align} />}>
          <ResidenceScene progressRef={progressRef} active={active} pixelRatio={pixelRatio} placeEnd={placeEnd} />
        </Suspense>
      </SceneBoundary>
    )
  }
  return <BlueprintArt progressRef={progressRef} reduced={reduced} align={align} />
}

export function SignatureHero() {
  const rootRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const reduced = usePrefersReducedMotion()
  const desktop = useMediaQuery('(min-width: 1280px)')
  const wide = useMediaQuery('(min-width: 1024px)')
  const webgl = useWebGL()
  const show3d = webgl && !reduced
  const [frame, setFrame] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [active, setActive] = useState(true)

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: '120px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reduced) return
    const node = rootRef.current
    if (!node) return
    const trigger = ScrollTrigger.create({
      trigger: node,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progressRef.current = self.progress
        const resting = self.progress < 0.012
        setAtStart((current) => (current === resting ? current : resting))
        const next = Math.min(9, Math.floor(self.progress * 9.999))
        setFrame((current) => (current === next ? current : next))
      },
    })
    return () => trigger.kill()
  }, [reduced])

  useEffect(() => {
    const visual = rootRef.current?.querySelector<HTMLElement>('.hero-visual')
    if (!visual) return
    const place = () => placeModelHint(visual, wide)
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [wide])

  return (
    <section ref={rootRef} className={reduced ? 'relative bg-paper' : 'relative h-[460svh] bg-paper'} aria-label="From an idea to a finished home">
      <div className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden lg:block lg:h-[100svh]">
        <div className="hero-stage relative z-10 flex shrink-0 flex-col items-center gap-3 px-5 pt-20 pb-3 text-center md:px-10 lg:absolute lg:top-28 lg:bottom-8 lg:left-0 lg:h-auto lg:w-[min(46%,40rem)] lg:items-start lg:justify-center lg:px-12 lg:pt-0 lg:pb-0 lg:text-left xl:px-16">
          <p className="label">{reduced ? '01 / The idea' : `${heroFrames[frame].key} / ${heroFrames[frame].title}`}</p>
          <HeroCopy frame={reduced ? 0 : frame} reduced={reduced} />
          <Actions />
        </div>
        <div className="hero-visual relative z-0 min-h-[46dvh] w-full flex-1 lg:absolute lg:top-[5.5rem] lg:right-0 lg:bottom-0 lg:left-0 lg:min-h-0" aria-hidden="true">
          <Visual
            show3d={show3d}
            progressRef={progressRef}
            reduced={reduced}
            active={active}
            pixelRatio={desktop ? 1.5 : 1.15}
            align={wide ? 'end' : 'center'}
            placeEnd={wide}
          />
          {!reduced && atStart && (
            <div
              className="pointer-events-none absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: 'var(--model-x, 50%)', top: 'var(--model-y, 46%)' }}
            >
              <p className="label">Scroll to build the house</p>
              <span className="hint-arrow mt-3 block text-ink" aria-hidden="true">
                <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
                  <path d="M9 1v24M2 18l7 7 7-7" stroke="currentColor" strokeWidth="1.25" />
                </svg>
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
