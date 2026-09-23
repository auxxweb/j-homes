import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

type Variant = 'solid' | 'line' | 'ghost'

interface ButtonProps {
  children: ReactNode
  to?: string
  href?: string
  onClick?: () => void
  variant?: Variant
  className?: string
  type?: 'button' | 'submit'
  cursor?: 'explore' | 'view'
  disabled?: boolean
}

const variants: Record<Variant, string> = {
  solid: 'bg-crimson text-white border-crimson hover:bg-crimson-deep',
  line: 'bg-transparent text-ink border-ink hover:bg-ink hover:text-paper',
  ghost: 'bg-transparent text-paper border-paper/40 hover:border-paper hover:bg-paper hover:text-ink',
}

export function Button({
  children,
  to,
  href,
  onClick,
  variant = 'solid',
  className = '',
  type = 'button',
  cursor = 'explore',
  disabled = false,
}: ButtonProps) {
  const classes = `group inline-flex items-center justify-center gap-3 border px-5 py-3 text-[0.72rem] font-semibold tracking-[0.16em] uppercase transition-colors duration-300 disabled:opacity-50 ${variants[variant]} ${className}`
  const content = (
    <>
      <span>{children}</span>
      {href ? (
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
      ) : (
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
      )}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} data-cursor={cursor} onClick={onClick}>
        {content}
      </Link>
    )
  }

  if (href) {
    const external = href.startsWith('http')
    return (
      <a
        href={href}
        className={classes}
        data-cursor={cursor}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }

  return (
    <button type={type} className={classes} data-cursor={cursor} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  )
}
