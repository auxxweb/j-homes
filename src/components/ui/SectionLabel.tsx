import type { ReactNode } from 'react'

export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`mx-auto w-full max-w-[1440px] px-5 md:px-10 lg:px-16 ${className}`}>{children}</div>
}

export function SectionLabel({
  index,
  label,
  className = '',
}: {
  index: string
  label: string
  className?: string
}) {
  return (
    <p className={`label ${className}`}>
      {index}
      <span aria-hidden="true"> / </span>
      {label}
    </p>
  )
}
