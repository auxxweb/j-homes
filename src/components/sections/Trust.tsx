import { useEffect, useRef } from 'react'
import { company } from '../../data/company'
import { gsap } from '../../lib/gsap'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { Container, SectionLabel } from '../ui/SectionLabel'

function Count({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (reduced) {
      node.textContent = String(value)
      return
    }
    const state = { n: 0 }
    const tween = gsap.to(state, {
      n: value,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: { trigger: node, start: 'top 88%' },
      onUpdate: () => {
        node.textContent = String(Math.round(state.n))
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [reduced, value])

  return <span ref={ref}>0</span>
}

export function Trust() {
  return (
    <section className="border-t border-line bg-paper" aria-label="Experience">
      <Container className="py-20 md:py-28">
        <SectionLabel index="02" label="Trust" />
        <h2 className="display-2 mt-5 max-w-4xl">Built on experience.</h2>
        <dl className="mt-16 grid gap-12 border-t border-line pt-10 md:grid-cols-3 md:gap-0">
          <div className="md:border-r md:border-line md:pr-10" aria-label="10 plus years of experience">
            <dt className="sr-only">Years of experience</dt>
            <dd>
              <p className="numeral" aria-hidden="true">
                <Count value={company.experienceYears} />+
              </p>
              <p className="label mt-4">Years of experience</p>
            </dd>
          </div>
          <div className="md:border-r md:border-line md:px-10" aria-label="50 plus completed projects">
            <dt className="sr-only">Completed projects</dt>
            <dd>
              <p className="numeral" aria-hidden="true">
                <Count value={company.completedProjects} />+
              </p>
              <p className="label mt-4">Completed projects</p>
            </dd>
          </div>
          <div className="md:pl-10" aria-label="Complete turnkey solutions">
            <dt className="sr-only">Turnkey solutions</dt>
            <dd>
              <p className="font-serif text-[clamp(3rem,6vw,5.5rem)] leading-none tracking-tight uppercase">Complete</p>
              <p className="label mt-4">Turnkey solutions</p>
            </dd>
          </div>
        </dl>
      </Container>
    </section>
  )
}
