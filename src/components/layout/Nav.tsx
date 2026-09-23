import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { mainNav } from '../../data/navigation'
import { LogoLink } from '../ui/Logo'

export function Nav({ open, onMenu }: { open: boolean; onMenu: () => void }) {
  const [solid, setSolid] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid || open ? 'border-b border-line bg-paper/92 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[4.75rem] w-full max-w-[1600px] items-center justify-between gap-6 px-5 md:px-10 lg:px-12">
        <LogoLink className="h-14 w-auto md:h-16" />
        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              data-cursor="explore"
              className={`text-[0.72rem] font-semibold tracking-[0.16em] uppercase transition-colors hover:text-crimson ${
                pathname === item.to || pathname.startsWith(`${item.to}/`) ? 'text-crimson' : 'text-ink'
              }`}
              aria-current={pathname === item.to ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/contact"
            data-cursor="explore"
            className="border border-crimson bg-crimson px-4 py-2.5 text-[0.68rem] font-semibold tracking-[0.16em] text-white uppercase transition-colors hover:bg-crimson-deep"
          >
            Start your project
          </Link>
        </nav>
        <button
          type="button"
          className="nav-menu"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={onMenu}
        >
          {open ? <X size={22} strokeWidth={1.25} /> : <Menu size={22} strokeWidth={1.25} />}
        </button>
      </div>
    </header>
  )
}
