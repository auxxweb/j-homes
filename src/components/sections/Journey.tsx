import { useRef, useState } from 'react'
import { journeyMedia } from '../../data/media'
import { journey } from '../../data/story'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useHorizontalPin } from '../../hooks/useScrollAnimation'
import { Photo } from '../ui/Photo'
import { SectionLabel } from '../ui/SectionLabel'

export function Journey() {
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const pinned = !reduced
  const [active, setActive] = useState(0)

  useHorizontalPin(pinRef, trackRef, pinned, (progress) => {
    const next = Math.round(progress * (journey.length - 1))
    setActive((current) => (current === next ? current : next))
  })

  return (
    <section id="journey" className="border-t border-line bg-paper-deep [--rail-fade:var(--color-paper-deep)]">
      <div ref={pinRef} className={pinned ? 'rail-pin relative flex flex-col overflow-hidden pt-[4.75rem]' : 'relative'}>
        <div className="mx-auto w-full max-w-[1440px] shrink-0 px-5 pt-8 pb-5 md:px-10 lg:px-16">
          <SectionLabel index="03" label="The journey" />
          <h2 className="display-2 mt-4 max-w-4xl">
            One team.
            <span className="block">Every stage.</span>
          </h2>
        </div>
        <div className={pinned ? 'rail-viewport relative flex min-h-0 w-full min-w-0 flex-1 items-center overflow-hidden' : 'px-5 pb-16 md:px-10'}>
          <div ref={trackRef} className={pinned ? 'rail-track' : 'mx-auto flex w-full max-w-xl flex-col gap-5'}>
            {journey.map((stage, index) => {
              const media = journeyMedia[index]
              const current = !pinned || active === index
              return (
                <article
                  key={stage.number}
                  className={`flex h-full flex-col bg-paper ${pinned ? 'rail-card' : 'w-full'} ${
                    current ? 'shadow-[0_22px_44px_-30px_rgba(22,20,18,0.55)]' : ''
                  }`}
                >
                  <div className={`flex items-end justify-between gap-4 border-t-2 px-5 pt-4 pb-4 ${current ? 'border-crimson' : 'border-line'}`}>
                    <p className="font-serif text-[3.4rem] leading-[0.8] tracking-tight text-crimson">{stage.number}</p>
                    <p className="label pb-1">
                      Stage
                      <span className="text-muted"> {String(index + 1).padStart(2, '0')} / {String(journey.length).padStart(2, '0')}</span>
                    </p>
                  </div>
                  <div className="px-3">
                    <Photo frame={media.photo} className="h-48 w-full object-cover sm:h-52" />
                  </div>
                  <div className="flex flex-1 flex-col px-5 pt-5 pb-6">
                    <h3 className="font-serif text-[2.15rem] leading-none tracking-tight">{stage.title}</h3>
                    <span className="mt-4 block h-px w-10 bg-crimson" aria-hidden="true" />
                    <p className="mt-4 max-w-[28rem] text-[0.95rem] leading-relaxed text-ink-soft">{stage.text}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
