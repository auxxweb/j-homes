import { constructionPhoto } from '../../data/media'
import { constructionStages } from '../../data/story'
import { Photo } from '../ui/Photo'
import { Container, SectionLabel } from '../ui/SectionLabel'

export function Construction() {
  return (
    <section id="construction" className="sheet-grid-light border-t border-line bg-night text-paper">
      <Container className="py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <SectionLabel index="07" label="Construction" className="!text-paper/60" />
            <h2 className="display-2 mt-5">Built to last.</h2>
            <p className="mt-6 max-w-md text-paper/70">
              The house is made in stages. Each one is supervised before the next trade covers it — from the ground to the finished surface.
            </p>
            <Photo frame={constructionPhoto} className="mt-8 aspect-[16/10] w-full object-cover" />
          </div>
          <ol className="lg:col-span-7">
            {constructionStages.map((stage) => (
              <li key={stage.number} className="grid grid-cols-[4.5rem_1fr] gap-4 border-t border-white/15 py-7">
                <span className="label !text-paper/45">{stage.number}</span>
                <div>
                  <h3 className="font-serif text-4xl tracking-tight uppercase md:text-5xl">{stage.title}</h3>
                  <p className="mt-3 max-w-md text-sm text-paper/65">{stage.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
