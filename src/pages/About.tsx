import { Link } from 'react-router-dom'
import { ClosingCta, PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/layout/Seo'
import { Trust } from '../components/sections/Trust'
import { Container } from '../components/ui/SectionLabel'
import { company, servicePlaces } from '../data/company'
import { services } from '../data/services'
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
        description="J Homes is a residential team for design, engineering, construction, interiors and turnkey handover across Kochi, Ernakulam and Kerala."
        path="/about"
        jsonLd={graphLd([organizationLd(), breadcrumbLd(crumbs)])}
      />
      <PageHero
        index="01"
        kicker="About"
        title="More than a construction company."
        lede="Design, engineering, construction, interiors, furniture and handover, held in one process."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'About' },
        ]}
      />
      <section className="bg-paper">
        <Container className="grid gap-12 py-16 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-lg text-ink-soft">
              J Homes is for people who want the whole residence looked after by one team. The work covers land selection, planning, architectural design, approvals, engineering, construction, interior design, furniture, furnishing, landscaping and final handover.
            </p>
            <p className="mt-5 text-lg text-ink-soft">
              The practice is rooted in {company.area.city} and {company.area.district}, with residential projects elsewhere in {company.area.region}. {company.experienceYears}+ years of experience and {company.completedProjects}+ completed projects are the record behind that process. The line we work to is simple: your dream home, from first step to final finish.
            </p>
            <p className="mt-5 text-lg text-ink-soft">
              {company.lines[3]} One team. Every stage. Your vision, crafted by professionals — without splitting the house between people who have never shared a drawing.
            </p>
          </div>
          <aside className="border border-line p-6 lg:col-span-5">
            <p className="label">Disciplines</p>
            <ul className="mt-4 space-y-3">
              {company.disciplines.map((item) => (
                <li key={item} className="font-serif text-3xl uppercase">
                  {item}
                </li>
              ))}
            </ul>
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
              <li key={place} className="border border-line px-4 py-2 text-sm">
                {place}
              </li>
            ))}
          </ul>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link to={`/services/${service.slug}`} className="block border-t border-line py-4 font-serif text-2xl hover:text-crimson" data-cursor="explore">
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <ClosingCta />
    </>
  )
}
