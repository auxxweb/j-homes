import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { company } from '../../data/company'
import { mobileNav } from '../../data/navigation'

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const firstLink = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!open) return
    firstLink.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, open])

  if (!open) return null

  return (
    <div id="site-menu" className="fixed inset-0 z-40 bg-paper pt-24" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="flex h-full flex-col justify-between px-6 pb-10">
        <ol className="mt-4">
          {mobileNav.map((item, index) => (
            <li key={item.to} className="border-t border-line">
              <Link
                ref={index === 0 ? firstLink : undefined}
                to={item.to}
                onClick={onClose}
                className="flex items-baseline gap-4 py-3"
                data-cursor="explore"
              >
                <span className="label w-8">{String(index + 1).padStart(2, '0')}</span>
                <span className="font-serif text-[clamp(2.4rem,10vw,4.2rem)] leading-none tracking-tight uppercase">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <div className="border-t border-line pt-6">
          <p className="label">{company.tagline}</p>
          <Link
            to="/contact"
            onClick={onClose}
            className="mt-5 inline-flex border border-crimson bg-crimson px-5 py-3 text-[0.72rem] font-semibold tracking-[0.16em] text-white uppercase"
            data-cursor="explore"
          >
            Start your project
          </Link>
        </div>
      </div>
    </div>
  )
}
