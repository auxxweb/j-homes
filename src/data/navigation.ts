export interface NavItem {
  label: string
  to: string
}

export let mainNav: NavItem[] = [
  { label: 'Projects', to: '/projects' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Process', to: '/process' },
  { label: 'Contact', to: '/contact' },
]

export let mobileNav: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Services', to: '/services' },
  { label: 'Process', to: '/process' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export let footerNav: NavItem[] = [
  ...mainNav,
  { label: 'Journal', to: '/blog' },
  { label: 'Gallery', to: '/gallery' },
]

export function applyNavigation(navigation: { main?: NavItem[]; mobile?: NavItem[]; footer?: NavItem[] }) {
  if (navigation.main?.length) mainNav = navigation.main
  if (navigation.mobile?.length) mobileNav = navigation.mobile
  if (navigation.footer?.length) footerNav = navigation.footer
}
