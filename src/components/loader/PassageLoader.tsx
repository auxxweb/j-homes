import { useEffect, useRef, useState } from 'react'
import { company } from '../../data/company'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import './passage.css'

type PassageLoaderProps = {
  isReady: boolean
  onComplete: () => void
}

const MIN_MS = 1100
const REDUCED_MIN_MS = 320
const EXIT_MS = 480
const REDUCED_EXIT_MS = 220
const FORCE_MS = 4500

export function PassageLoader({ isReady, onComplete }: PassageLoaderProps) {
  const reduced = usePrefersReducedMotion()
  const [minMet, setMinMet] = useState(false)
  const [forceReady, setForceReady] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const started = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const min = window.setTimeout(() => setMinMet(true), reduced ? REDUCED_MIN_MS : MIN_MS)
    const cap = window.setTimeout(() => setForceReady(true), FORCE_MS)
    return () => {
      window.clearTimeout(min)
      window.clearTimeout(cap)
    }
  }, [reduced])

  useEffect(() => {
    if (!minMet || !(isReady || forceReady) || started.current) return
    started.current = true
    setLeaving(true)
    const id = window.setTimeout(() => onCompleteRef.current(), reduced ? REDUCED_EXIT_MS : EXIT_MS)
    return () => window.clearTimeout(id)
  }, [forceReady, isReady, minMet, reduced])

  const leaveNow = () => {
    setMinMet(true)
    setForceReady(true)
  }

  return (
    <div
      className={`passage-root fixed inset-0 z-[75] flex items-center justify-center overflow-hidden bg-paper text-ink ${
        reduced ? 'is-reduced' : ''
      } ${leaving ? 'is-leaving' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Opening the next page"
    >
      <div className="sheet-grid pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(188, 0, 0, 0.06), transparent 58%)' }}
      />
      <div className="relative flex flex-col items-center px-6 text-center">
        <p className="font-serif text-[2rem] leading-none tracking-tight md:text-5xl">J HOMES</p>
        <svg viewBox="0 0 160 150" className="mt-8 h-28 w-auto" aria-hidden="true">
          <path
            className="passage-draw"
            pathLength={1}
            d="M34 128 V28 H126 V128"
            stroke="#161412"
            strokeWidth="1.6"
          />
          <path
            className="passage-draw passage-lintel"
            pathLength={1}
            d="M28 28 H132"
            stroke="#BC0000"
            strokeWidth="2.4"
          />
          <path
            className="passage-draw passage-sill"
            pathLength={1}
            d="M22 128 H138"
            stroke="#161412"
            strokeWidth="1.2"
          />
        </svg>
        <p className="label mt-6">
          {company.disciplines.map((name, index) => (
            <span key={name}>
              {index > 0 && <span className="px-2">·</span>}
              <span className="passage-word" style={{ animationDelay: `${0.42 + index * 0.12}s` }}>
                {name}
              </span>
            </span>
          ))}
        </p>
      </div>
      <button
        type="button"
        className="label absolute right-5 bottom-6 underline-offset-4 hover:underline md:right-10"
        onClick={leaveNow}
      >
        Skip
      </button>
    </div>
  )
}
