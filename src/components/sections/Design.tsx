import { Link } from 'react-router-dom'
import { designPhoto } from '../../data/media'
import { drawings } from '../../data/story'
import { Photo } from '../ui/Photo'
import { Container, SectionLabel } from '../ui/SectionLabel'

export function Design() {
  return (
    <section id="design" className="sheet-grid border-t border-line">
      <Container className="py-20 md:py-28">
        <SectionLabel index="05" label="Design" />
        <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <h2 className="display-2 max-w-3xl">Turn your idea into a design.</h2>
          <Link to="/services/architectural-design" className="label text-crimson" data-cursor="explore">
            Architectural design
          </Link>
        </div>
        <p className="mt-6 max-w-xl text-lg text-ink-soft">
          The house is drawn before it is built. Plans, elevations and service layouts stay in one set, so construction and interiors are reading the same page.
        </p>
        <figure className="mt-10">
          <Photo frame={designPhoto} className="aspect-[16/8] w-full object-cover" />
          <figcaption className="label mt-3">Elevation study</figcaption>
        </figure>
        <ol className="mt-14 border-t border-line">
          {drawings.map((drawing) => (
            <li key={drawing.code} className="grid grid-cols-[5.5rem_1fr] items-baseline gap-4 border-b border-line py-4 md:grid-cols-[7rem_1fr_auto]">
              <span className="label !text-crimson">{drawing.code}</span>
              <h3 className="font-serif text-2xl md:text-3xl">{drawing.title}</h3>
              <span className="label hidden md:block">Sheet</span>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
