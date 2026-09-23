import { processMedia } from '../../data/media'
import { processSteps } from '../../data/story'
import { Photo } from '../ui/Photo'
import { Container, SectionLabel } from '../ui/SectionLabel'

export function ProcessTimeline({ index = '13' }: { index?: string }) {
  return (
    <section id="process" className="border-t border-line bg-paper">
      <Container className="py-20 md:py-28">
        <SectionLabel index={index} label="Process" />
        <h2 className="display-2 mt-5 max-w-3xl">A calm sequence.</h2>
        <ol className="mt-16">
          {processSteps.map((step, index) => (
            <li key={step.number} className="grid gap-6 border-t border-line py-8 md:grid-cols-[7rem_minmax(0,12rem)_1fr_14rem] md:items-center">
              <p className="numeral text-[clamp(3rem,6vw,5rem)] text-crimson">{step.number}</p>
              <h3 className="font-serif text-4xl uppercase">{step.title}</h3>
              <p className="max-w-md text-ink-soft">{step.text}</p>
              <Photo frame={processMedia[index]} className="aspect-[4/3] w-full object-cover" />
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
