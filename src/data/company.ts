function clean(value: string | undefined) {
  return (value ?? '').trim()
}

const phone = clean(import.meta.env.VITE_PHONE) || '917907938664'
const phoneDisplay = clean(import.meta.env.VITE_PHONE_DISPLAY) || '+91 7907938664'

export const company = {
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
  whatsappMessage:
    "Hi J Homes, I'm interested in building my home. I'd like to discuss my project.",
} as const

export const servicePlaces = [
  'Kochi',
  'Ernakulam',
  'Mulanthuruthy',
  'Eruveli',
  'Thiruvaniyoor',
  'Changanassery',
  'Chottanikkara',
] as const
