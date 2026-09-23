import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs, type CrumbItem } from '../ui/Breadcrumbs'
import { Container } from '../ui/SectionLabel'

export function PageHero({
  index,
  kicker,
  title,
  lede,
  crumbs,
}: {
  index: string
  kicker: string
  title: string
  lede: string
  crumbs: CrumbItem[]
}) {
  return (
    <header className="sheet-grid border-b border-line pt-28 pb-14 md:pt-36 md:pb-20">
      <Container>
        <Breadcrumbs items={crumbs} />
        <p className="label mt-8">
          {index} / {kicker}
        </p>
        <h1 className="display-2 mt-4 max-w-5xl">{title}</h1>
        <p className="mt-6 max-w-xl text-lg text-ink-soft">{lede}</p>
      </Container>
    </header>
  )
}

export function ClosingCta({ children }: { children?: ReactNode }) {
  return (
    <section className="border-t border-line bg-paper-deep">
      <Container className="flex flex-col gap-8 py-20 md:flex-row md:items-end md:justify-between md:py-28">
        <div>
          <p className="label">12 / Enquire</p>
          <h2 className="display-2 mt-4 max-w-3xl">Let’s build your home.</h2>
          <p className="mt-5 max-w-md text-ink-soft">
            {children ?? 'Tell us where you are in your journey. We’ll help you understand the next step.'}
          </p>
        </div>
        <Link
          to="/contact"
          data-cursor="explore"
          className="inline-flex border border-crimson bg-crimson px-5 py-3 text-[0.72rem] font-semibold tracking-[0.16em] text-white uppercase"
        >
          Start your project
        </Link>
      </Container>
    </section>
  )
}
