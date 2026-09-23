import { furnitureMedia } from '../../data/media'
import { furniturePieces } from '../../data/story'
import { Photo } from '../ui/Photo'
import { Container, SectionLabel } from '../ui/SectionLabel'

export function Furniture() {
  return (
    <section id="furniture" className="border-t border-line bg-paper-deep">
      <Container className="grid gap-12 py-20 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionLabel index="08" label="Furniture" />
          <h2 className="display-2 mt-5">Then, make it yours.</h2>
          <p className="mt-6 max-w-md text-lg text-ink-soft">
            Furnishing is part of the finish, not a shopping list after handover. The pieces are chosen for rooms that already have a plan.
          </p>
        </div>
        <ul className="lg:col-span-5">
          {furniturePieces.map((piece, index) => (
            <li key={piece.title} className="grid grid-cols-[4.25rem_1fr] items-center gap-4 border-t border-line py-4">
              <Photo frame={furnitureMedia[index]} className="aspect-square w-full object-cover" />
              <div>
                <p className="label">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-1 font-serif text-3xl">{piece.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{piece.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
