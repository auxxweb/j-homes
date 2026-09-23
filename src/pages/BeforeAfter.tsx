import { comparisons } from '../data/media'
import { CompareSlider } from '../components/sections/BeforeAfter'
import { ClosingCta, PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/layout/Seo'
import { Container } from '../components/ui/SectionLabel'
import { breadcrumbLd, graphLd, organizationLd } from '../lib/seo'

export default function BeforeAfterPage() {
  const rest = comparisons.slice(1)
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Before and after', path: '/before-after' },
  ]

  return (
    <>
      <Seo
        title="Before and After | J Homes Residence Studies"
        description="Drag across J Homes elevation studies, from daylight to evening, and from the first view to the finished roof."
        path="/before-after"
        jsonLd={graphLd([organizationLd(), breadcrumbLd(crumbs)])}
      />
      <PageHero
        index="01"
        kicker="Before and after"
        title="More of the same elevation, later in the day."
        lede="Each study has a bar. Move it left for the first view and right for the later one."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Before and after' },
        ]}
      />
      <section className="border-t border-line bg-night text-paper">
        <Container className="grid gap-16 py-16 md:py-24">
          {rest.map((pair) => (
            <CompareSlider key={pair.title} pair={pair} />
          ))}
        </Container>
      </section>
      <ClosingCta />
    </>
  )
}
