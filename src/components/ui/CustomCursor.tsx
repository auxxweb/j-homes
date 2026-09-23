import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

type Mode = 'default' | 'link' | 'explore' | 'view' | 'native'

const labels: Record<Mode, string> = {
  default: '',
  link: '',
  explore: '',
  view: 'View project',
  native: '',
}

export function CustomCursor() {
  const fine = useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 1024px)')
  const reduced = usePrefersReducedMotion()
  const active = fine && !reduced
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const modeRef = useRef<Mode>('default')
  const shownRef = useRef(false)
  const [mode, setMode] = useState<Mode>('default')

  useEffect(() => {
    if (!active) return
    document.body.classList.add('has-cursor')
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let cx = x
    let cy = y
    let frame = 0

    const render = () => {
      cx += (x - cx) * 0.18
      cy += (y - cy) * 0.18
      const scale = modeRef.current === 'view' ? 2.4 : modeRef.current === 'link' || modeRef.current === 'explore' ? 1.65 : 1
      const hidden = !shownRef.current || modeRef.current === 'native'
      if (dotRef.current) {
        dotRef.current.style.opacity = hidden ? '0' : '1'
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      }
      if (ringRef.current) {
        ringRef.current.style.opacity = hidden ? '0' : '1'
        ringRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) scale(${scale})`
      }
      frame = requestAnimationFrame(render)
    }

    const onMove = (event: PointerEvent) => {
      x = event.clientX
      y = event.clientY
      const target = event.target instanceof Element ? event.target : null
      let next: Mode = 'default'
      if (target?.closest('input, textarea, select')) next = 'native'
      else if (target?.closest('[data-cursor="view"]')) next = 'view'
      else if (target?.closest('[data-cursor="explore"]')) next = 'explore'
      else if (target?.closest('a, button')) next = 'link'
      if (next !== modeRef.current) {
        modeRef.current = next
        setMode(next)
      }
      shownRef.current = true
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    frame = requestAnimationFrame(render)
    return () => {
      document.body.classList.remove('has-cursor')
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [active])

  if (!active) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80]">
      <div ref={dotRef} className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-crimson opacity-0" />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-ink/80 bg-paper/80 text-[0.55rem] font-semibold tracking-[0.14em] uppercase text-ink opacity-0"
      >
        {labels[mode]}
      </div>
    </div>
  )
}
