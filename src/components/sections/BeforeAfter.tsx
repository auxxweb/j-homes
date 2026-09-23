import { useState } from 'react'
import { Link } from 'react-router-dom'
import { comparisons } from '../../data/media'
import { Photo } from '../ui/Photo'
import { Container, SectionLabel } from '../ui/SectionLabel'

export type Comparison = (typeof comparisons)[number]

export function CompareSlider({ pair }: { pair: Comparison }) {
  const [position, setPosition] = useState(50)

  return (
    <figure>
      <div className="compare-frame relative aspect-[16/10] overflow-hidden bg-night select-none">
        <Photo frame={pair.before} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Photo frame={pair.after} className="h-full w-full object-cover" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-[1] w-0.5 bg-paper"
          style={{ left: `${position}%` }}
        >
          <span className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-paper bg-night/80 text-paper">
            <SliderIcon />
          </span>
        </div>
        <p className="label pointer-events-none absolute top-4 left-4 z-[1] !text-paper">Before · {pair.beforeLabel}</p>
        <p className="label pointer-events-none absolute top-4 right-4 z-[1] !text-paper">After · {pair.afterLabel}</p>
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          className="compare-range"
          aria-label={`Compare ${pair.title}. Drag left for before and right for after.`}
          aria-valuetext={`${position} percent toward ${pair.afterLabel}`}
          onChange={(event) => setPosition(Number(event.target.value))}
        />
      </div>
      <figcaption className="mt-4 flex items-baseline justify-between gap-4">
        <span className="font-serif text-3xl tracking-tight uppercase">{pair.title}</span>
        <span className="label !text-paper/60">Drag left and right</span>
      </figcaption>
    </figure>
  )
}

export function BeforeAfter() {
  const featured = comparisons[0]
  const hasMore = comparisons.length > 1

  return (
    <section id="before-after" className="border-t border-line bg-night text-paper">
      <Container className="py-20 md:py-28">
        <SectionLabel index="09" label="Before and after" className="!text-paper/60" />
        <h2 className="display-2 mt-5 max-w-4xl">
          From daylight
          <span className="block">to evening.</span>
        </h2>
        <p className="mt-6 max-w-xl text-lg text-paper/70">
          Move the bar across the elevation. Left is the first view. Right is the later one.
        </p>
        <div className="mt-12">
          <CompareSlider pair={featured} />
        </div>
        {hasMore && (
          <Link
            to="/before-after"
            data-cursor="explore"
            className="mt-10 inline-flex border border-paper px-5 py-3 text-[0.72rem] font-semibold tracking-[0.16em] text-paper uppercase transition-colors hover:bg-paper hover:text-ink"
          >
            View more
          </Link>
        )}
      </Container>
    </section>
  )
}

function SliderIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.6" aria-hidden="true">
      <path d="M9 7 5 12l4 5M15 7l4 5-4 5" />
    </svg>
  )
}
