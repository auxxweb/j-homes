import { Link, useLocation } from 'react-router-dom'
import { Seo } from '../components/layout/Seo'
import { Container } from '../components/ui/SectionLabel'

export default function NotFound() {
  const { pathname } = useLocation()
  return (
    <>
      <Seo
        title="Page not found | J Homes"
        description="This page is not part of the J Homes site."
        path={pathname}
        noIndex
      />
      <section className="pt-36 pb-24">
        <Container>
          <p className="label">404</p>
          <h1 className="display-2 mt-4">This page is not on the drawing.</h1>
          <p className="mt-5 max-w-md text-ink-soft">The address does not match a J Homes page. Return home, or look through the projects.</p>
          <div className="mt-8 flex gap-6">
            <Link to="/" className="label text-crimson">
              Home
            </Link>
            <Link to="/projects" className="label text-crimson">
              Projects
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
