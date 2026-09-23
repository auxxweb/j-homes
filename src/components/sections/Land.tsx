import { Link } from 'react-router-dom'
import { landPoints } from '../../data/story'
import { Container, SectionLabel } from '../ui/SectionLabel'

export function Land() {
  return (
    <section id="land" className="border-t border-line bg-paper">
      <Container className="grid gap-14 py-20 md:py-28 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-6">
          <SectionLabel index="04" label="Land" />
          <h2 className="display-2 mt-5">Start with the right land.</h2>
          <p className="mt-6 max-w-md text-lg text-ink-soft">
            Before a line is drawn, the site has to make sense. J Homes looks at the plot with you — access, the ground, and whether it can carry the home you want.
          </p>
          <Link to="/services/land-selection" className="label mt-8 inline-block text-crimson" data-cursor="explore">
            Land selection
          </Link>
        </div>
        <div className="lg:col-span-6">
          <svg viewBox="0 0 520 360" className="w-full border border-line" aria-hidden="true">
            <rect width="520" height="360" fill="#F7F4EE" />
            <rect x="70" y="60" width="300" height="220" fill="none" stroke="#161412" />
            <rect x="150" y="120" width="120" height="90" fill="#E7E0D4" stroke="#161412" />
            <path d="M40 300 H470" stroke="#8F9B78" strokeWidth="4" />
            <path d="M70 60 L40 40" stroke="#BC0000" />
            <text x="46" y="34" fill="#7A1218" fontFamily="Manrope, sans-serif" fontSize="11" letterSpacing="2">
              ACCESS
            </text>
            <text x="390" y="80" fill="#5E5852" fontFamily="Manrope, sans-serif" fontSize="11" letterSpacing="2">
              N
            </text>
            <path d="M398 96 V150" stroke="#161412" />
            <path d="M392 104 L398 92 L404 104" fill="none" stroke="#161412" />
          </svg>
          <ol className="mt-8 divide-y divide-line border-y border-line">
            {landPoints.map((point, index) => (
              <li key={point.title} className="grid gap-2 py-5 sm:grid-cols-[6rem_1fr]">
                <span className="label">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-serif text-2xl">{point.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{point.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
