import { useEffect, useRef, type RefObject } from 'react'
import { gsap } from '../lib/gsap'

export function useHorizontalPin(
  pinRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  onProgress?: (progress: number) => void,
) {
  const onProgressRef = useRef(onProgress)
  onProgressRef.current = onProgress

  useEffect(() => {
    if (!enabled) return
    const pin = pinRef.current
    const track = trackRef.current
    if (!pin || !track) return

    const distance = () => Math.max(0, track.scrollWidth - pin.clientWidth)
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => `+=${Math.max(1, distance())}`,
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => onProgressRef.current?.(self.progress),
      },
    })

    return () => {
      gsap.set(track, { clearProps: 'transform' })
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [enabled, pinRef, trackRef])
}

export function useReveal(scope: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const root = scope.current
    if (!root || !enabled) return
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 28,
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 88%' },
        })
      })
    }, root)
    return () => context.revert()
  }, [enabled, scope])
}
