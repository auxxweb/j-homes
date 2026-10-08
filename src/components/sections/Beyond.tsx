import { beyondMedia } from '../../data/media'
import { beyondItems } from '../../data/story'
import { Photo } from '../ui/Photo'
import { Container, SectionLabel } from '../ui/SectionLabel'

export function Beyond() {
  return (
    <section className="border-t border-line bg-night text-paper">
      <Container className="py-20 md:py-28">
        <SectionLabel label="Beyond the building" className="!text-paper/60" />
        <h2 className="display-2 mt-5 max-w-4xl">We don’t stop at the walls.</h2>
        <ul className="mt-12">
          {beyondItems.map((item, index) => (
            <li
              key={item.title}
              className="grid gap-5 border-t border-white/15 py-6 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:items-center sm:gap-8 md:grid-cols-[9rem_minmax(0,1fr)]"
            >
              <Photo frame={beyondMedia[index]} className="aspect-[4/3] w-full object-cover" />
              <div className="min-w-0">
                <h3 className="font-serif text-4xl leading-[0.9] tracking-tight uppercase md:text-5xl">{item.title}</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/65">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
