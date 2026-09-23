import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatCent, formatSqFt, projects } from '../../data/projects'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useHorizontalPin } from '../../hooks/useScrollAnimation'
import { SectionLabel } from '../ui/SectionLabel'
import { ProjectPlate } from './ProjectPlate'

export function ProjectShowcase() {
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const pinned = !reduced
  const [active, setActive] = useState(0)

  useHorizontalPin(pinRef, trackRef, pinned, (progress) => {
    const next = Math.round(progress * (projects.length - 1))
    setActive((current) => (current === next ? current : next))
  })

  return (
    <section id="projects" className="border-t border-line bg-paper">
      <div ref={pinRef} className={pinned ? 'rail-pin relative flex flex-col overflow-hidden pt-[4.75rem]' : 'relative'}>
        <div className="mx-auto w-full max-w-[1440px] shrink-0 px-5 pt-8 pb-5 md:px-10 lg:px-16">
          <SectionLabel index="10" label="Projects" />
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="display-2 max-w-4xl">Homes we’ve brought to life.</h2>
            <p className="max-w-sm text-ink-soft">
              Six residences from the project record. Areas, floors and land are listed as supplied.
            </p>
          </div>
        </div>
        <div className={pinned ? 'rail-viewport relative flex min-h-0 w-full min-w-0 flex-1 items-center overflow-hidden' : 'px-5 pb-16 md:px-10'}>
          <div ref={trackRef} className={pinned ? 'rail-track-wide' : 'mx-auto flex w-full max-w-3xl flex-col gap-8'}>
            {projects.map((project, index) => {
              const current = !pinned || active === index
              return (
                <article
                  key={project.slug}
                  className={`flex flex-col justify-center gap-6 border bg-paper p-4 sm:p-6 lg:flex-row lg:items-center lg:gap-10 lg:p-8 ${
                    pinned ? 'rail-card-wide' : 'w-full'
                  } ${current ? 'border-ink' : 'border-line'}`}
                >
                  <div className="lg:w-[42%]">
                    <p className="label">
                      {String(index + 1).padStart(2, '0')} / {project.type}
                    </p>
                    <h3 className="mt-3 font-serif text-3xl leading-none tracking-tight lg:text-4xl">{project.location}</h3>
                    <p className="mt-2 text-ink-soft">{project.region}</p>
                    <dl className="mt-6 grid grid-cols-3 gap-4">
                      <div>
                        <dt className="label">Floors</dt>
                        <dd className="mt-1 font-serif text-xl lg:text-2xl">{project.floors}</dd>
                      </div>
                      <div>
                        <dt className="label">Built-up</dt>
                        <dd className="mt-1 font-serif text-xl lg:text-2xl">{formatSqFt(project.builtUpSqFt)}</dd>
                      </div>
                      <div>
                        <dt className="label">Land</dt>
                        <dd className="mt-1 font-serif text-xl lg:text-2xl">{formatCent(project.landCent)}</dd>
                      </div>
                    </dl>
                    <Link
                      to={`/projects/${project.slug}`}
                      data-cursor="view"
                      className="mt-6 inline-flex text-[0.72rem] font-semibold tracking-[0.16em] text-crimson uppercase"
                    >
                      View project
                    </Link>
                  </div>
                  <div className="h-40 w-full border border-line bg-paper-deep sm:h-52 lg:h-auto lg:w-[54%] lg:max-h-[38vh] lg:self-stretch">
                    <ProjectPlate project={project} />
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
