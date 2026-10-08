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
            <dl className="space-y-6">
              <div>
                <dt className="label">Gmail</dt>
                <dd className="mt-2">
                  <a className="break-all hover:text-crimson" href={`mailto:${company.contact.email}`}>
                    {company.contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label">Instagram</dt>
                <dd className="mt-2">
                  <a
                    className="hover:text-crimson"
                    href={company.contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {company.contact.instagramName}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label">Facebook</dt>
                <dd className="mt-2">
                  {company.contact.facebook ? (
                    <a className="hover:text-crimson" href={company.contact.facebook} target="_blank" rel="noopener noreferrer">
                      {company.contact.facebookName}
                    </a>
                  ) : (
                    company.contact.facebookName
                  )}
                </dd>
              </div>
              <div>
                <dt className="label">WhatsApp Business</dt>
                <dd className="mt-2">
                  {wa ? (
                    <a
                      className="hover:text-crimson"
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track('whatsapp_click')}
                    >
                      {company.contact.phoneDisplay}
                    </a>
                  ) : (
                    company.contact.phoneDisplay
                  )}
                </dd>
              </div>
              <div>
                <dt className="label">Address</dt>
                <dd>
                  <address className="mt-2 text-sm leading-relaxed text-ink-soft not-italic">
                    {company.contact.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </dd>
              </div>
              <div>
                <dt className="label">Phone Number</dt>
                <dd className="mt-2">
                  <a className="hover:text-crimson" href={`tel:+${company.contact.phone.replace(/[^\d]/g, '')}`}>
                    {company.contact.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label">Location</dt>
                <dd className="mt-2">
                  <a
                    className="break-all text-sm text-crimson"
                    href={company.contact.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {company.contact.mapUrl}
                  </a>
                  <div className="relative mt-4 border border-line">
                    <iframe
                      title="J Homes, Mulanthuruthy"
                      src={company.contact.mapEmbed}
                      className="pointer-events-none h-64 w-full md:h-80"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <a
                      href={company.contact.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0"
                      aria-label="Open J Homes on Google Maps"
                    />
                  </div>
                </dd>
              </div>
            </dl>
            <p className="label mt-10">Service area</p>
            <p className="mt-3 font-serif text-3xl">
              {company.area.city}
              <br />
              {company.area.district}
              <br />
              <span className="text-crimson">Mulanthuruthy</span>
              <br />
              {company.area.region}
            </p>
            <p className="mt-8 text-sm text-muted">{company.promise}</p>
          </aside>
        </Container>
      </section>
    </>
  )
}
