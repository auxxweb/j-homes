import { Link } from 'react-router-dom'
import { interiorMedia } from '../../data/media'
import { interiorScopes } from '../../data/story'
import { Photo } from '../ui/Photo'
import { SectionLabel } from '../ui/SectionLabel'

export function Interiors() {
  return (
    <section id="interiors" className="border-t border-line bg-paper py-20 md:py-28">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 md:flex-row md:items-end md:justify-between md:px-10 lg:px-16">
        <div>
          <SectionLabel index="08" label="Interiors" />
          <h2 className="display-2 mt-5 max-w-3xl">Inside the house, with the same team.</h2>
        </div>
        <Link to="/services/interior-design" className="label text-crimson" data-cursor="explore">
          Interior design
        </Link>
      </div>
      <div
        className="mt-12 flex gap-4 overflow-x-auto px-5 pb-4 snap-x snap-mandatory md:px-10 lg:px-16"
        tabIndex={0}
        aria-label="Interior scopes, scroll horizontally"
      >
        {interiorScopes.map((scope, index) => (
          <article
            key={scope.title}
            className="flex w-[82vw] shrink-0 snap-start flex-col border border-line bg-paper-deep md:w-[42vw] lg:w-[28vw]"
          >
            <Photo frame={interiorMedia[index]} className="aspect-[4/5] w-full object-cover" />
            <div className="flex flex-1 flex-col justify-between p-7">
              <p className="label">{String(index + 1).padStart(2, '0')}</p>
              <div className="mt-10">
                <h3 className="font-serif text-4xl leading-none">{scope.title}</h3>
                <p className="mt-4 text-sm text-ink-soft">{scope.text}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
