import { comparisons } from '../data/media'
import { readPage } from '../data/pageCopy'
import { CompareSlider } from '../components/sections/BeforeAfter'
import { ClosingCta, PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/layout/Seo'
import { Container } from '../components/ui/SectionLabel'
import { breadcrumbLd, graphLd, organizationLd } from '../lib/seo'

export default function BeforeAfterPage() {
  const page = readPage('before-after')
  const rest = comparisons
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Before and after', path: '/before-after' },
  ]

  return (
    <>
      <Seo
        title={page.seoTitle}
        description={page.seoDescription}
        path="/before-after"
        jsonLd={graphLd([organizationLd(), breadcrumbLd(crumbs)])}
      />
      <PageHero
        kicker={page.kicker}
        title={page.title}
        lede={page.lede}
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
