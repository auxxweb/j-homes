import { AboutBand } from '../components/sections/AboutBand'
import { BeforeAfter } from '../components/sections/BeforeAfter'
import { Approvals } from '../components/sections/Approvals'
import { Beyond } from '../components/sections/Beyond'
import { Construction } from '../components/sections/Construction'
import { Design } from '../components/sections/Design'
import { Furniture } from '../components/sections/Furniture'
import { Gallery } from '../components/sections/Gallery'
import { Interiors } from '../components/sections/Interiors'
import { Journey } from '../components/sections/Journey'
import { Land } from '../components/sections/Land'
import { ProcessTimeline } from '../components/sections/ProcessTimeline'
import { Quality } from '../components/sections/Quality'
import { Trust } from '../components/sections/Trust'
import { SignatureHero } from '../components/hero/SignatureHero'
import { ProjectShowcase } from '../components/projects/ProjectShowcase'
import { ContactForm } from '../components/forms/ContactForm'
import { Seo } from '../components/layout/Seo'
import { Container } from '../components/ui/SectionLabel'
import { company } from '../data/company'
import { graphLd, organizationLd, websiteLd } from '../lib/seo'

export default function Home() {
  return (
    <>
      <Seo
        title="J Homes | House Construction & Turnkey Solutions in Kochi, Kerala"
        description="J Homes provides residential construction, architectural design, interiors and complete turnkey home solutions across Kochi, Ernakulam and Kerala."
        path="/"
        jsonLd={graphLd([organizationLd(), websiteLd()])}
      />
      <SignatureHero />
      <Trust />
      <Journey />
      <Land />
      <Design />
      <Approvals />
      <Construction />
      <Interiors />
      <Furniture />
      <BeforeAfter />
      <Quality />
      <ProjectShowcase />
      <Gallery />
      <AboutBand />
      <Beyond />
      <ProcessTimeline />
      <section id="contact" className="border-t border-line bg-paper-deep">
        <Container className="py-20 md:py-28">
          <p className="label">14 / Contact</p>
          <h2 className="display-2 mt-5 max-w-4xl">Let’s build your home.</h2>
          <p className="mt-5 max-w-xl text-lg text-ink-soft">
            Tell us where you are in your journey. We’ll help you understand the next step.
          </p>
          <p className="mt-4 max-w-xl text-sm text-muted">
            {company.promise} Serving {company.area.city}, {company.area.district} and {company.area.region}.
          </p>
          <div className="mt-12 max-w-3xl">
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  )
}
