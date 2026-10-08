import { Link } from 'react-router-dom'
import { ClosingCta, PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/layout/Seo'
import { Trust } from '../components/sections/Trust'
import { Container } from '../components/ui/SectionLabel'
import { company, servicePlaces } from '../data/company'
import { serviceSteps } from '../data/services'
import { breadcrumbLd, graphLd, organizationLd } from '../lib/seo'

export default function About() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ]
  return (
    <>
      <Seo
        title="About J Homes | Design, Construction and Interiors in Kerala"
        description="J Homes is a trusted construction and turnkey company with 10+ years of experience and 100+ completed projects across Kochi, including Mulanthuruthy."
        path="/about"
        jsonLd={graphLd([organizationLd(), breadcrumbLd(crumbs)])}
      />
      <PageHero
        kicker="About"
        title="More than a construction company."
        lede="Your dream home — from first step to final finish."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'About' },
        ]}
      />
      <section className="bg-paper">
        <Container className="grid gap-12 py-16 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-lg text-ink-soft">
              J Homes is a trusted construction and turnkey solutions company with {company.experienceYears}+ years of experience in the construction industry and {company.completedProjects}+ successfully completed projects across {company.area.city}, including <span className="text-crimson">Mulanthuruthy</span>.
            </p>
            <p className="mt-5 text-lg text-ink-soft">
              We specialize in providing end-to-end solutions for residential projects, covering the entire journey from land selection and architectural design to approvals, construction, interiors, furniture and final handover.
            </p>
            <p className="mt-5 text-lg text-ink-soft">
              With a team of experienced professionals and a strong focus on quality, planning, transparency and customer satisfaction, we work closely with every client to turn their ideas and requirements into well-designed, functional and lasting spaces.
            </p>
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
          <h2 className="display-3">Where the work is</h2>
          <p className="mt-4 max-w-xl text-ink-soft">
            Homes in the project record, and the cities the practice is built around. This is a service area, not a list of offices.
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
