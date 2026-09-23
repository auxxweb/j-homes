import { ContactForm } from '../components/forms/ContactForm'
import { PageHero } from '../components/layout/PageHero'
import { Seo } from '../components/layout/Seo'
import { Container } from '../components/ui/SectionLabel'
import { company } from '../data/company'
import { whatsappUrl } from '../lib/enquiry'
import { breadcrumbLd, graphLd, organizationLd } from '../lib/seo'
import { track } from '../lib/analytics'

export default function Contact() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ]
  const wa = whatsappUrl(company.whatsappMessage)
  return (
    <>
      <Seo
        title="Start Your Project | J Homes Kochi"
        description="Tell J Homes where you are in your home journey. Land, design, construction or a complete turnkey residence in Kochi and Kerala."
        path="/contact"
        jsonLd={graphLd([organizationLd(), breadcrumbLd(crumbs)])}
      />
      <PageHero
        index="01"
        kicker="Contact"
        title="Let’s build your home."
        lede="Tell us where you are in your journey. We’ll help you understand the next step."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Contact' },
        ]}
      />
      <section>
        <Container className="grid gap-12 py-16 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <aside className="lg:col-span-5">
            <p className="label">Service area</p>
            <p className="mt-3 font-serif text-3xl">
              {company.area.city}
              <br />
              {company.area.district}
              <br />
              {company.area.region}
            </p>
            {company.contact.phoneDisplay && (
              <a className="mt-6 block" href={`tel:${company.contact.phone}`}>
                {company.contact.phoneDisplay}
              </a>
            )}
            {company.contact.email && (
              <a className="mt-2 block" href={`mailto:${company.contact.email}`}>
                {company.contact.email}
              </a>
            )}
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="label mt-8 inline-block text-crimson"
                onClick={() => track('whatsapp_click')}
              >
                WhatsApp J Homes
              </a>
            )}
            <p className="mt-8 text-sm text-muted">{company.promise}</p>
          </aside>
        </Container>
      </section>
    </>
  )
}
