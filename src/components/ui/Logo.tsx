import { Link } from 'react-router-dom'
import { company } from '../../data/company'
import { asset } from '../../lib/assets'

export function Logo({ className = 'h-16 w-auto' }: { className?: string }) {
  return (
    <picture>
      <source srcSet={asset(company.logo.webp)} type="image/webp" />
      <img
        src={asset(company.logo.png)}
        alt=""
        width={company.logo.width}
        height={company.logo.height}
        className={className}
        decoding="async"
      />
    </picture>
  )
}

export function LogoLink({ className = 'h-16 w-auto' }: { className?: string }) {
  return (
    <Link to="/" aria-label="J Homes, home" className="inline-flex shrink-0" data-cursor="explore">
      <Logo className={className} />
    </Link>
  )
}
