import { Link, useParams } from 'react-router-dom'
import { ClosingCta, PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/layout/Seo'
import { Container } from '../components/ui/SectionLabel'
import { getService, services } from '../data/services'
import { absoluteUrl, breadcrumbLd, graphLd } from '../lib/seo'
import NotFound from './NotFound'

export default function ServiceDetail() {
  const { slug = '' } = useParams()
  const service = getService(slug)
  if (!service) return <NotFound />

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: service.title, path: `/services/${service.slug}` },
  ]
  const others = services.filter((item) => item.slug !== service.slug).slice(0, 3)

  return (
    <>
      <Seo
        title={service.seoTitle}
        description={service.seoDescription}
        path={`/services/${service.slug}`}
        jsonLd={graphLd([
          {
            '@type': 'Service',
            name: service.title,
            serviceType: service.title,
            description: service.seoDescription,
            provider: { '@type': 'Organization', name: 'J Homes' },
            areaServed: ['Kochi', 'Ernakulam', 'Kerala'],
            url: absoluteUrl(`/services/${service.slug}`),
          },
          breadcrumbLd(crumbs),
        ])}
      />
      <PageHero
        index="02"
        kicker="Service"
        title={service.headline}
        lede={service.lede}
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Services', to: '/services' },
          { label: service.title },
        ]}
      />
      <article>
        <Container className="grid gap-14 py-16 md:py-24 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-7">
            {service.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-lg text-ink-soft">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="lg:col-span-5">
            <h2 className="label">Includes</h2>
            <ul className="mt-4 border-t border-line">
              {service.includes.map((item) => (
                <li key={item} className="border-b border-line py-3 font-serif text-2xl">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
        <Container className="pb-16 md:pb-24">
          <h2 className="display-3">How this stage is handled</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-2">
            {service.points.map((point, index) => (
              <li key={point.title} className="border-t border-line pt-4">
                <p className="label">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 font-serif text-3xl">{point.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{point.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-14">
            <p className="label">Related</p>
            <ul className="mt-4 flex flex-wrap gap-6">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link to={`/services/${item.slug}`} className="font-serif text-2xl hover:text-crimson" data-cursor="explore">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </article>
      <ClosingCta />
    </>
  )
}
