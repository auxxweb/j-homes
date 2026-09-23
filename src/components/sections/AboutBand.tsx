import { Link } from 'react-router-dom'
import { company } from '../../data/company'
import { Container, SectionLabel } from '../ui/SectionLabel'

export function AboutBand() {
  return (
    <section className="border-t border-line bg-paper">
      <Container className="grid gap-10 py-20 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel index="11" label="About" />
        </div>
        <div className="lg:col-span-8">
          <h2 className="display-2">More than a construction company.</h2>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            J Homes brings design, engineering, construction, interiors, furniture and turnkey execution into one coordinated process. {company.experienceYears}+ years and {company.completedProjects}+ completed projects sit behind that way of working — in {company.area.city}, {company.area.district} and across {company.area.region}.
          </p>
          <Link to="/about" className="label mt-8 inline-block text-crimson" data-cursor="explore">
            About J Homes
          </Link>
        </div>
      </Container>
    </section>
  )
}
