import { ClosingCta, PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/layout/Seo'
import { GalleryFrames } from '../components/sections/Gallery'
import { Container } from '../components/ui/SectionLabel'
import { breadcrumbLd, graphLd, organizationLd } from '../lib/seo'

export default function GalleryPage() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
  ]
  return (
    <>
      <Seo
        title="Gallery | J Homes Residences"
        description="A closer look at J Homes elevation studies. Open any frame to see it larger."
        path="/gallery"
        jsonLd={graphLd([organizationLd(), breadcrumbLd(crumbs)])}
      />
      <PageHero
        kicker="Gallery"
        title="A closer look."
        lede="Open any frame to see it larger, then move through the set."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Gallery' },
        ]}
      />
      <section className="border-t border-line">
        <Container className="py-16 md:py-24">
          <GalleryFrames />
        </Container>
      </section>
      <ClosingCta />
    </>
  )
}
