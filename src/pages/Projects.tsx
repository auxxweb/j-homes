import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClosingCta, PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/layout/Seo'
import { ImageViewer } from '../components/ui/ImageViewer'
import { Container } from '../components/ui/SectionLabel'
import { formatCent, formatSqFt, projects } from '../data/projects'
import { breadcrumbLd, graphLd, organizationLd } from '../lib/seo'

export default function Projects() {
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const frames = projects.flatMap((project) => project.images)
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
        kicker="Projects"
        title="Homes we’ve brought to life."
        lede="Each record lists the place, the floors, the built-up area and the land. Open an image to see it larger."
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
              <button
                type="button"
                className="aspect-[4/3] w-full overflow-hidden border border-line bg-paper-deep"
                data-cursor="view"
                aria-label={`Expand the ${project.location} image`}
                onClick={() => setOpen(index)}
              >
                {project.images[0] && (
                  <img
                    src={project.images[0].src}
                    alt={project.images[0].alt}
                    width={project.images[0].width}
                    height={project.images[0].height}
                    className="h-full w-full object-cover"
                  />
                )}
              </button>
            </Container>
          </article>
        ))}
      </section>
      <ClosingCta />
      {open !== null && <ImageViewer images={frames} index={open} onChange={setOpen} onClose={close} />}
    </>
  )
}
