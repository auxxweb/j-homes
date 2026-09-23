import { Link } from 'react-router-dom'
import { company } from '../../data/company'
import { footerNav } from '../../data/navigation'
import { services } from '../../data/services'
import { LogoLink } from '../ui/Logo'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-night text-paper">
      <div className="mx-auto grid w-full max-w-[1440px] gap-14 px-5 py-16 md:px-10 lg:grid-cols-12 lg:px-16 lg:py-20">
        <div className="lg:col-span-5">
          <LogoLink className="h-20 w-auto" />
          <p className="label mt-6 !text-paper/60">{company.tagline}</p>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-paper/75">
            Complete turnkey construction and interior solutions for homes in {company.area.city},{' '}
            {company.area.district} and {company.area.region}.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
          <div>
            <p className="label !text-paper/50">Visit</p>
            <ul className="mt-4 space-y-2">
              {footerNav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sm hover:text-white" data-cursor="explore">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label !text-paper/50">Services</p>
            <ul className="mt-4 space-y-2">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link to={`/services/${service.slug}`} className="text-sm hover:text-white" data-cursor="explore">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label !text-paper/50">Service area</p>
            <p className="mt-4 text-sm leading-relaxed text-paper/80">
              {company.area.city}
              <br />
              {company.area.district}
              <br />
              {company.area.region}
            </p>
            {company.contact.phoneDisplay && (
              <a className="mt-4 block text-sm hover:text-white" href={`tel:${company.contact.phone}`}>
                {company.contact.phoneDisplay}
              </a>
            )}
            {company.contact.email && (
              <a className="mt-2 block text-sm hover:text-white" href={`mailto:${company.contact.email}`}>
                {company.contact.email}
              </a>
            )}
            <div className="mt-4 flex gap-4">
              {company.contact.instagram && (
                <a href={company.contact.instagram} className="text-sm underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              )}
              {company.contact.facebook && (
                <a href={company.contact.facebook} className="text-sm underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              )}
            </div>
          </div>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-8 md:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-16">
          <p className="font-serif text-[clamp(1.8rem,4vw,3.4rem)] leading-none tracking-tight uppercase text-paper/90">
            From first step to final finish.
          </p>
          <p className="text-xs tracking-[0.12em] text-paper/50 uppercase">
            © {year} J Homes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
