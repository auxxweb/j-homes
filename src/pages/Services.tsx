import { Link } from 'react-router-dom'
import { ClosingCta, PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/layout/Seo'
import { Container } from '../components/ui/SectionLabel'
import { serviceSteps } from '../data/services'
import { readPage } from '../data/pageCopy'
import { breadcrumbLd, graphLd, organizationLd } from '../lib/seo'

export default function Services() {
  const page = readPage('services')
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
  ]
  return (
    <>
      <Seo
        title={page.seoTitle}
        description={page.seoDescription}
        path="/services"
        jsonLd={graphLd([organizationLd(), breadcrumbLd(crumbs)])}
      />
      <PageHero
        kicker={page.kicker}
        title={page.title}
        lede={page.lede}
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Services' },
        ]}
      />
      <section>
        <Container className="py-8 md:py-12">
          <ol>
            {serviceSteps.map((service, index) => (
              <li key={service.slug} className="border-t border-line">
                <Link to={`/services/${service.slug}`} className="grid gap-4 py-8 md:grid-cols-[5rem_1fr_1.2fr] md:items-baseline" data-cursor="explore">
                  <span className="label">{String(index + 1).padStart(2, '0')}</span>
                  <h2 className="font-serif text-4xl">{service.title}</h2>
                  <p className="text-ink-soft">{service.lede}</p>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <ClosingCta />
    </>
  )
}
