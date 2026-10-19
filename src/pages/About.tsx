import { Link } from 'react-router-dom'
import { ClosingCta, PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/layout/Seo'
import { Trust } from '../components/sections/Trust'
import { Container } from '../components/ui/SectionLabel'
import { company, servicePlaces } from '../data/company'
import { readPage } from '../data/pageCopy'
import { serviceSteps } from '../data/services'
import { breadcrumbLd, graphLd, organizationLd } from '../lib/seo'

export default function About() {
  const page = readPage('about')
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ]
  return (
    <>
      <Seo
        title={page.seoTitle}
        description={page.seoDescription}
        path="/about"
        jsonLd={graphLd([organizationLd(), breadcrumbLd(crumbs)])}
      />
      <PageHero
        kicker={page.kicker}
        title={page.title}
        lede={page.lede}
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'About' },
        ]}
      />
      <section className="bg-paper">
        <Container className="grid gap-12 py-16 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-lg text-ink-soft">{page.sections[0]?.text}</p>
            <p className="mt-5 text-lg text-ink-soft">{page.sections[1]?.text}</p>
            <p className="mt-5 text-lg text-ink-soft">{page.sections[2]?.text}</p>
            <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="label">{company.experienceYears}+ Years of Experience</span>
              <span className="text-line" aria-hidden="true">|</span>
              <span className="label">{company.completedProjects}+ Completed Projects</span>
              <span className="text-line" aria-hidden="true">|</span>
              <span className="label">Complete Turnkey Solutions</span>
            </p>
            <p className="mt-4 font-serif text-2xl md:text-3xl">Your Dream Home – From First Step to Final Finish.</p>
          </div>
          <aside className="border border-line p-6 lg:col-span-5">
            <p className="label">The steps</p>
            <ol className="mt-4">
              {serviceSteps.map((step, index) => (
                <li key={step.slug} className="border-t border-line">
                  <Link
                    to={`/services/${step.slug}`}
                    className="flex items-baseline gap-3 py-2.5 text-sm hover:text-crimson"
                    data-cursor="explore"
                  >
                    <span className="label w-8 text-crimson">{String(index + 1).padStart(2, '0')}</span>
                    <span>{step.title}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        </Container>
      </section>
      <Trust />
      <section className="border-t border-line">
        <Container className="py-16 md:py-24">
          <h2 className="display-3">{page.sections[3]?.heading || 'Where the work is'}</h2>
          <p className="mt-4 max-w-xl text-ink-soft">
            {page.sections[3]?.text}
          </p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {servicePlaces.map((place) => (
              <li key={place} className={place === 'Mulanthuruthy' ? 'border border-crimson px-4 py-2 text-sm text-crimson' : 'border border-line px-4 py-2 text-sm'}>
                {place}
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <ClosingCta />
    </>
  )
}
