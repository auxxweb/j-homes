import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ClosingCta, PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/layout/Seo'
import { ProjectPlate } from '../components/projects/ProjectPlate'
import { ImageViewer } from '../components/ui/ImageViewer'
import { Container } from '../components/ui/SectionLabel'
import { adjacentProjects, formatCent, formatSqFt, getProject } from '../data/projects'
import { absoluteUrl, breadcrumbLd, graphLd } from '../lib/seo'
import NotFound from './NotFound'

export default function ProjectDetail() {
  const { slug = '' } = useParams()
  const project = getProject(slug)
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])
  if (!project) return <NotFound />
  const { previous, next } = adjacentProjects(project.slug)
  const path = `/projects/${project.slug}`
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: `${project.location} ${project.floors}`, path },
  ]
  const facts = [
    ['Location', `${project.location}, ${project.region}`],
    ['Building type', project.type],
    ['Floors', project.floors],
    ['Built-up area', formatSqFt(project.builtUpSqFt)],
    ['Land area', formatCent(project.landCent)],
  ] as const
  const chapters = [
    ['Project story', project.story],
    ['Design', project.design],
    ['Construction', project.construction],
    ['Interior', project.interior],
    ['Final result', project.result],
  ] as const

  return (
    <>
      <Seo
        title={`${project.location} Residence ${project.floors} | J Homes`}
        description={`J Homes residential project in ${project.location}: ${project.floors}, ${formatSqFt(project.builtUpSqFt)} on ${formatCent(project.landCent)}.`}
        path={path}
        jsonLd={graphLd([
          {
            '@type': 'CreativeWork',
            name: `${project.location} residence`,
            description: project.summary,
            creator: { '@type': 'Organization', name: 'J Homes' },
            locationCreated: project.region,
            url: absoluteUrl(path),
          },
          breadcrumbLd(crumbs),
        ])}
      />
      <PageHero
        kicker="Project"
        title={`${project.location}`}
        lede={project.summary}
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Projects', to: '/projects' },
          { label: `${project.floors}` },
        ]}
      />
      <div className="border-b border-line bg-paper-deep">
        <Container className="py-8">
          {project.images[0] && (
            <button
              type="button"
              className="block w-full overflow-hidden border border-line"
              data-cursor="view"
              aria-label={`Expand the ${project.location} image`}
              onClick={() => setOpen(0)}
            >
              <img
                src={project.images[0].src}
                alt={project.images[0].alt}
                width={project.images[0].width}
                height={project.images[0].height}
                className="aspect-[16/10] w-full object-cover"
              />
            </button>
          )}
          <p className="label mt-3">Open the image to see it full size.</p>
        </Container>
      </div>
      <section>
        <Container className="py-14 md:py-20">
          <h2 className="label">Project information</h2>
          <dl className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="label">{label}</dt>
                <dd className="mt-2 font-serif text-2xl">{value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>
      <article>
        {chapters.map(([title, text]) => (
          <section key={title} className="border-t border-line">
            <Container className="grid gap-6 py-12 md:grid-cols-12 md:py-16">
              <h2 className="font-serif text-3xl md:col-span-4">{title}</h2>
              <p className="text-lg text-ink-soft md:col-span-7">{text}</p>
            </Container>
          </section>
        ))}
      </article>
      <section className="border-t border-line">
        <Container className="py-14 md:py-20">
          <h2 className="display-3">Gallery</h2>
          <p className="mt-3 max-w-xl text-sm text-muted">Open an image to see it full size.</p>
          {project.images.length > 0 && (
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {project.images.map((image, index) => (
                <li key={image.src}>
                  <button
                    type="button"
                    className="block w-full overflow-hidden border border-line"
                    data-cursor="view"
                    aria-label={`Expand image ${index + 1} of the ${project.location} residence`}
                    onClick={() => setOpen(index)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <ul className="mt-8 grid gap-4 lg:grid-cols-3">
            {(['elevation', 'plan', 'section'] as const).map((view) => (
              <li key={view}>
                <p className="label mb-3">{view}</p>
                <div className="border border-line bg-paper-deep">
                  <ProjectPlate project={project} view={view} />
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      {previous && next && (
        <nav aria-label="More projects" className="border-t border-line">
          <Container className="grid gap-6 py-10 sm:grid-cols-2">
            <Link to={`/projects/${previous.slug}`} className="block" data-cursor="view">
              <span className="label">Previous</span>
              <span className="mt-2 block font-serif text-3xl">{previous.location}</span>
            </Link>
            <Link to={`/projects/${next.slug}`} className="block sm:text-right" data-cursor="view">
              <span className="label">Next</span>
              <span className="mt-2 block font-serif text-3xl">{next.location}</span>
            </Link>
          </Container>
        </nav>
      )}
      <ClosingCta>Talk to J Homes about a home of your own.</ClosingCta>
      {open !== null && <ImageViewer images={project.images} index={open} onChange={setOpen} onClose={close} />}
    </>
  )
}
