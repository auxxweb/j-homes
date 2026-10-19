import { ClosingCta, PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/layout/Seo'
import { readPage } from '../data/pageCopy'
import { GalleryFrames } from '../components/sections/Gallery'
import { Container } from '../components/ui/SectionLabel'
import { breadcrumbLd, graphLd, organizationLd } from '../lib/seo'

export default function GalleryPage() {
  const page = readPage('gallery')
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
  ]
  return (
    <>
      <Seo
        title={page.seoTitle}
        description={page.seoDescription}
        path="/gallery"
        jsonLd={graphLd([organizationLd(), breadcrumbLd(crumbs)])}
      />
      <PageHero
        kicker={page.kicker}
        title={page.title}
        lede={page.lede}
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
