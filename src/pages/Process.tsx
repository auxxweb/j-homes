import { ClosingCta, PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/layout/Seo'
import { ProcessTimeline } from '../components/sections/ProcessTimeline'
import { breadcrumbLd, graphLd, organizationLd } from '../lib/seo'

export default function ProcessPage() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Process', path: '/process' },
  ]
  return (
    <>
      <Seo
        title="The J Homes Process | From Land to Handover"
        description="Discover, plan, design, engineer, build, finish and hand over. The J Homes sequence for a residence in Kerala."
        path="/process"
        jsonLd={graphLd([organizationLd(), breadcrumbLd(crumbs)])}
      />
      <PageHero
        index="01"
        kicker="Process"
        title="From the first conversation to the keys."
        lede="Seven steps. The same team. Nothing in the sequence is there for decoration — each one prepares the next."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Process' },
        ]}
      />
      <ProcessTimeline index="02" />
      <ClosingCta />
    </>
  )
}
