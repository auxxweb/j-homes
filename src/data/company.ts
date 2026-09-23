function clean(value: string | undefined) {
  return (value ?? '').trim()
}

const phone = clean(import.meta.env.VITE_PHONE)
const phoneDisplay = clean(import.meta.env.VITE_PHONE_DISPLAY) || phone

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
  completedProjects: 50,
  area: {
    city: 'Kochi',
    district: 'Ernakulam',
    region: 'Kerala',
    country: 'India',
  },
  contact: {
    phone,
    phoneDisplay,
    email: clean(import.meta.env.VITE_EMAIL),
    whatsapp: clean(import.meta.env.VITE_WHATSAPP).replace(/[^\d]/g, ''),
    instagram: clean(import.meta.env.VITE_INSTAGRAM),
    facebook: clean(import.meta.env.VITE_FACEBOOK),
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
