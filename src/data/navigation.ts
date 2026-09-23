export const mainNav = [
  { label: 'Projects', to: '/projects' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Process', to: '/process' },
  { label: 'Contact', to: '/contact' },
] as const

export const mobileNav = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Services', to: '/services' },
  { label: 'Process', to: '/process' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
] as const

export const footerNav = [
  ...mainNav,
  { label: 'Journal', to: '/blog' },
] as const
