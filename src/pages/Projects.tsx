import { Link } from 'react-router-dom'
import { ClosingCta, PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/layout/Seo'
import { ProjectPlate } from '../components/projects/ProjectPlate'
import { Container } from '../components/ui/SectionLabel'
import { formatCent, formatSqFt, projects } from '../data/projects'
import { breadcrumbLd, graphLd, organizationLd } from '../lib/seo'

export default function Projects() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
  ]
  return (
    <>
      <Seo
        title="Homes by J Homes | Residential Projects in Kerala"
        description="Residential projects by J Homes in Mulanthuruthy, Eruveli, Thiruvaniyoor, Changanassery and Chottanikkara."
        path="/projects"
        jsonLd={graphLd([organizationLd(), breadcrumbLd(crumbs)])}
      />
      <PageHero
        index="01"
        kicker="Projects"
        title="Homes we’ve brought to life."
        lede="Each record lists the place, the floors, the built-up area and the land. Diagrams are studies from those facts, not construction drawings."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Projects' },
        ]}
      />
      <section>
        {projects.map((project, index) => (
          <article key={project.slug} className="border-t border-line">
            <Container className="grid items-center gap-8 py-12 md:py-16 lg:grid-cols-2">
              <div className={index % 2 ? 'lg:order-2' : ''}>
                <p className="label">
                  {String(index + 1).padStart(2, '0')} / {project.floors}
                </p>
                <h2 className="display-3 mt-3">{project.location}</h2>
                <p className="mt-2 text-ink-soft">{project.region}</p>
                <p className="mt-4 max-w-md text-ink-soft">{project.summary}</p>
                <dl className="mt-6 flex flex-wrap gap-8">
                  <div>
                    <dt className="label">Built-up</dt>
                    <dd className="font-serif text-2xl">{formatSqFt(project.builtUpSqFt)}</dd>
                  </div>
                  <div>
                    <dt className="label">Land</dt>
                    <dd className="font-serif text-2xl">{formatCent(project.landCent)}</dd>
                  </div>
                </dl>
                <Link to={`/projects/${project.slug}`} className="label mt-6 inline-block text-crimson" data-cursor="view">
                  View project
                </Link>
              </div>
              <div className="border border-line bg-paper-deep">
                <ProjectPlate project={project} view={index % 3 === 1 ? 'plan' : index % 3 === 2 ? 'section' : 'elevation'} />
              </div>
            </Container>
          </article>
        ))}
      </section>
      <ClosingCta />
    </>
  )
}
