import { qualityPoints } from '../../data/story'
import { Container, SectionLabel } from '../ui/SectionLabel'

export function Quality() {
  return (
    <section id="quality" className="border-t border-line bg-paper">
      <Container className="py-20 md:py-28">
        <SectionLabel index="09" label="Quality" />
        <h2 className="display-2 mt-5 max-w-4xl">Quality is built into the process.</h2>
        <ol className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {qualityPoints.map((point, index) => (
            <li key={point.title} className="bg-paper p-6 md:p-8">
              <p className="label">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-6 font-serif text-3xl leading-tight">{point.title}</h3>
              <p className="mt-3 text-sm text-ink-soft">{point.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
