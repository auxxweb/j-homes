import { ClosingCta, PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/layout/Seo'
import { ProcessTimeline } from '../components/sections/ProcessTimeline'
import { readPage } from '../data/pageCopy'
import { breadcrumbLd, graphLd, organizationLd } from '../lib/seo'

export default function ProcessPage() {
  const page = readPage('process')
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Process', path: '/process' },
  ]
  return (
    <>
      <Seo
        title={page.seoTitle}
        description={page.seoDescription}
        path="/process"
        jsonLd={graphLd([organizationLd(), breadcrumbLd(crumbs)])}
      />
      <PageHero
        kicker={page.kicker}
        title={page.title}
        lede={page.lede}
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Process' },
        ]}
      />
      <ProcessTimeline />
      <ClosingCta />
    </>
  )
}
