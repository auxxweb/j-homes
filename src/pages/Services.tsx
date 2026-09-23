import { Link } from 'react-router-dom'
import { ClosingCta, PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/layout/Seo'
import { Container } from '../components/ui/SectionLabel'
import { services } from '../data/services'
import { breadcrumbLd, graphLd, organizationLd } from '../lib/seo'

export default function Services() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
  ]
  return (
    <>
      <Seo
        title="Residential Construction Services in Kochi | J Homes"
        description="House construction, architectural design, interiors, engineering, land selection and turnkey homes by J Homes in Kochi, Ernakulam and Kerala."
        path="/services"
        jsonLd={graphLd([organizationLd(), breadcrumbLd(crumbs)])}
      />
      <PageHero
        index="01"
        kicker="Services"
        title="Design. Build. Finish."
        lede="Six parts of one residential practice. Take the stage you need, or the full turnkey path."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Services' },
        ]}
      />
      <section>
        <Container className="py-8 md:py-12">
          <ol>
            {services.map((service, index) => (
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
