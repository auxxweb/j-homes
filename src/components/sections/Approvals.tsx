import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { approvalFlow } from '../../data/story'
import { Container, SectionLabel } from '../ui/SectionLabel'

export function Approvals() {
  const ref = useRef<HTMLDivElement>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDrawn(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setDrawn(true)
      },
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="approvals" className="border-t border-line bg-paper">
      <Container className="py-20 md:py-28">
        <SectionLabel index="06" label="Approvals & engineering" />
        <h2 className="display-2 mt-5 max-w-4xl">Plan. Engineer. Approve. Build.</h2>
        <p className="mt-6 max-w-xl text-lg text-ink-soft">
          Drawings, structure and services are coordinated, then taken through the authority path — including K-SMART where that is the local process — before execution.
        </p>
        <div ref={ref} className="mt-14">
          <svg viewBox="0 0 960 80" className="w-full" aria-hidden="true">
            <line
              x1="40"
              y1="40"
              x2="920"
              y2="40"
              stroke="#BC0000"
              strokeWidth="1"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={drawn ? 0 : 1}
              style={{ transition: 'stroke-dashoffset 1.1s ease' }}
            />
            {approvalFlow.map((_, index) => (
              <circle key={index} cx={40 + index * 293} cy="40" r="4" fill="#161412" />
            ))}
          </svg>
          <ol className="grid gap-8 md:grid-cols-4">
            {approvalFlow.map((step, index) => (
              <li key={step.title} className="border-t border-line pt-5">
                <p className="label">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 font-serif text-3xl">{step.title}</h3>
                <p className="mt-3 text-sm text-ink-soft">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <Link to="/services/engineering" className="label mt-10 inline-block text-crimson" data-cursor="explore">
          Engineering
        </Link>
      </Container>
    </section>
  )
}
