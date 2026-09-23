import { beyondMedia } from '../../data/media'
import { beyondItems } from '../../data/story'
import { Photo } from '../ui/Photo'
import { Container, SectionLabel } from '../ui/SectionLabel'

export function Beyond() {
  return (
    <section className="border-t border-line bg-night text-paper">
      <Container className="py-20 md:py-28">
        <SectionLabel index="12" label="Beyond the building" className="!text-paper/60" />
        <h2 className="display-2 mt-5 max-w-4xl">We don’t stop at the walls.</h2>
        <ul className="mt-12">
          {beyondItems.map((item, index) => (
            <li key={item.title} className="grid gap-4 border-t border-white/15 py-6 md:grid-cols-[9rem_minmax(0,14rem)_1fr] md:items-center">
              <Photo frame={beyondMedia[index]} className="aspect-[4/3] w-full object-cover" />
              <h3 className="font-serif text-4xl tracking-tight uppercase md:text-5xl">{item.title}</h3>
              <p className="max-w-lg text-sm text-paper/65">{item.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
