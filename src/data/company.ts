function clean(value: string | undefined) {
  return (value ?? '').trim()
}

const phone = clean(import.meta.env.VITE_PHONE) || '917907938664'
const phoneDisplay = clean(import.meta.env.VITE_PHONE_DISPLAY) || '+91 7907938664'

export let company = {
  name: 'J Homes',
  tagline: 'Design · Construction · Interiors',
  disciplines: ['Design', 'Construction', 'Interiors'] as const,
  promise: 'Your dream home — from first step to final finish.',
  lines: [
    'One team. Every stage.',
    'Design. Build. Finish.',
    'Your vision, crafted by professionals.',
    'Building with quality, driven by trust.',
  ],
  experienceYears: 10,
  completedProjects: 100,
  area: {
    city: 'Kochi',
    district: 'Ernakulam',
    region: 'Kerala',
    country: 'India',
  },
  contact: {
    phone,
    phoneDisplay,
    email: clean(import.meta.env.VITE_EMAIL) || 'jhomesprojects@gmail.com',
    whatsapp: clean(import.meta.env.VITE_WHATSAPP).replace(/[^\d]/g, '') || '917907938664',
    instagram: clean(import.meta.env.VITE_INSTAGRAM) || 'https://www.instagram.com/jhomesconstructions/',
    instagramName: 'J HOMES CONSTRUCTIONS',
    facebook: clean(import.meta.env.VITE_FACEBOOK),
    facebookName: 'J HOMES CONSTRUCTIONS',
    address: [
      'J Homes, Door No 1/493/K, Ezhumanthuruthil Building,',
      'Chottanikkara Road, above Babyhug Store,',
      'Pallithazham, Mulanthuruthy, Kerala,',
      'Pin – 682314',
    ],
    mapUrl: 'https://share.google/y52wnJqt6Sz1TQLOT',
    mapEmbed:
      'https://maps.google.com/maps?q=J+HOMES+Constructions,+Mulanthuruthy&z=16&output=embed',
  },
  logo: {
    webp: '/brand/j-homes-logo.webp',
    png: '/brand/j-homes-logo.png',
    width: 900,
    height: 974,
  },
  brochure: '/brochure/j-homes-brochure.pdf',
  whatsappMessage:
    "Hi J Homes, I'm interested in building my home. I'd like to discuss my project.",
}

export let servicePlaces = [
  'Kochi',
  'Ernakulam',
  'Mulanthuruthy',
  'Eruveli',
  'Thiruvaniyoor',
  'Changanassery',
  'Chottanikkara',
]

export function applyCompanySettings(settings: {
  name?: string
  tagline?: string
  promise?: string
  lines?: string[]
  experienceYears?: number
  completedProjects?: number
  whatsappMessage?: string
  contact?: Partial<(typeof company)['contact']>
  area?: Partial<(typeof company)['area']>
  logo?: Partial<(typeof company)['logo']>
  brochure?: string
  servicePlaces?: string[]
}) {
  company = {
    ...company,
    name: settings.name || company.name,
    tagline: settings.tagline || company.tagline,
    promise: settings.promise || company.promise,
    lines: settings.lines?.length ? settings.lines : company.lines,
    experienceYears: settings.experienceYears || company.experienceYears,
    completedProjects: settings.completedProjects || company.completedProjects,
    whatsappMessage: settings.whatsappMessage || company.whatsappMessage,
    contact: {
      ...company.contact,
      ...settings.contact,
      address: settings.contact?.address?.length ? settings.contact.address : company.contact.address,
    },
    area: { ...company.area, ...settings.area },
    logo: { ...company.logo, ...settings.logo },
    brochure: settings.brochure || company.brochure,
  }
  if (settings.servicePlaces?.length) servicePlaces = settings.servicePlaces
}
