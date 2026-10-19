import { writeFileSync, mkdirSync } from 'node:fs'
import { createServer } from 'vite'

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

const companyMod = await vite.ssrLoadModule('/src/data/company.ts')
const navMod = await vite.ssrLoadModule('/src/data/navigation.ts')
const storyMod = await vite.ssrLoadModule('/src/data/story.ts')
const mediaMod = await vite.ssrLoadModule('/src/data/media.ts')
const projectsMod = await vite.ssrLoadModule('/src/data/projects.ts')
const servicesMod = await vite.ssrLoadModule('/src/data/services.ts')
const journalMod = await vite.ssrLoadModule('/src/data/journal.ts')

function plain(value) {
  return JSON.parse(JSON.stringify(value))
}

function zip(items, images) {
  return items.map((item, index) => ({
    ...item,
    image: images[index] ?? null,
  }))
}

const pages = [
  {
    slug: 'home',
    path: '/',
    title: 'J Homes | House Construction & Turnkey Solutions in Kochi, Kerala',
    kicker: 'Design · Construction · Interiors',
    lede: 'Your dream home — from first step to final finish.',
    seoTitle: 'J Homes | House Construction & Turnkey Solutions in Kochi, Kerala',
    seoDescription:
      'J Homes provides residential construction, architectural design, interiors and complete turnkey home solutions across Kochi, Ernakulam and Kerala.',
    sections: [
      { heading: 'Let’s build your home.', text: 'Tell us where you are in your journey. We’ll help you understand the next step.' },
      { heading: 'A closer\nlook.', text: 'Open any frame to see it larger, then move through the set.' },
    ],
  },
  {
    slug: 'about',
    path: '/about',
    title: 'More than a construction company.',
    kicker: 'About',
    lede: 'Your dream home — from first step to final finish.',
    seoTitle: 'About J Homes | Design, Construction and Interiors in Kerala',
    seoDescription:
      'J Homes is a trusted construction and turnkey company with 10+ years of experience and 100+ completed projects across Kochi, including Mulanthuruthy.',
    sections: [
      {
        heading: 'Introduction',
        text: 'J Homes is a trusted construction and turnkey solutions company with 10+ years of experience in the construction industry and 100+ successfully completed projects across Kochi, including Mulanthuruthy.',
      },
      {
        heading: 'What we do',
        text: 'We specialize in providing end-to-end solutions for residential projects, covering the entire journey from land selection and architectural design to approvals, construction, interiors, furniture and final handover.',
      },
      {
        heading: 'How we work',
        text: 'With a team of experienced professionals and a strong focus on quality, planning, transparency and customer satisfaction, we work closely with every client to turn their ideas and requirements into well-designed, functional and lasting spaces.',
      },
      { heading: 'Where the work is', text: 'Homes in the project record, and the cities the practice is built around. This is a service area, not a list of offices.' },
    ],
  },
  {
    slug: 'services',
    path: '/services',
    title: 'Design. Build. Finish.',
    kicker: 'Services',
    lede: 'Seven steps of one residential practice, from the land to the last piece of furniture.',
    seoTitle: 'Residential Construction Services in Kochi | J Homes',
    seoDescription:
      'Land selection, architectural design, budget management, house construction, interiors, landscaping and loose furniture by J Homes in Kochi, Ernakulam and Kerala.',
    sections: [],
  },
  {
    slug: 'projects',
    path: '/projects',
    title: 'Homes we’ve brought to life.',
    kicker: 'Projects',
    lede: 'Each record lists the place, the floors, the built-up area and the land. Open an image to see it larger.',
    seoTitle: 'Homes by J Homes | Residential Projects in Kerala',
    seoDescription:
      'Residential projects by J Homes in Mulanthuruthy, Eruveli, Thiruvaniyoor, Changanassery and Chottanikkara.',
    sections: [],
  },
  {
    slug: 'process',
    path: '/process',
    title: 'From the first conversation to the keys.',
    kicker: 'Process',
    lede: 'Seven steps. The same team. Nothing in the sequence is there for decoration — each one prepares the next.',
    seoTitle: 'The J Homes Process | From Land to Handover',
    seoDescription: 'Discover, plan, design, engineer, build, finish and hand over. The J Homes sequence for a residence in Kerala.',
    sections: [],
  },
  {
    slug: 'before-after',
    path: '/before-after',
    title: 'More of the same elevation, later in the day.',
    kicker: 'Before and after',
    lede: 'Each study has a bar. Move it left for the first view and right for the later one.',
    seoTitle: 'Before and After | J Homes Residence Studies',
    seoDescription: 'Drag across J Homes elevation studies, from daylight to evening, and from the first view to the finished roof.',
    sections: [],
  },
  {
    slug: 'gallery',
    path: '/gallery',
    title: 'A closer look.',
    kicker: 'Gallery',
    lede: 'Open any frame to see it larger, then move through the set.',
    seoTitle: 'Gallery | J Homes Residences',
    seoDescription: 'A closer look at J Homes elevation studies. Open any frame to see it larger.',
    sections: [],
  },
  {
    slug: 'journal',
    path: '/blog',
    title: 'Notes on building a home.',
    kicker: 'Journal',
    lede: 'Practical writing about the J Homes process. No invented news, no awards, no borrowed projects.',
    seoTitle: 'Journal | Building a Home with J Homes',
    seoDescription:
      'Guides from J Homes on planning a house in Kochi, what turnkey construction includes, and the drawings behind a build.',
    sections: [],
  },
  {
    slug: 'contact',
    path: '/contact',
    title: 'Let’s build your home.',
    kicker: 'Contact',
    lede: 'Tell us where you are in your journey. We’ll help you understand the next step.',
    seoTitle: 'Start Your Project | J Homes Kochi',
    seoDescription:
      'Tell J Homes where you are in your home journey. Land, design, construction or a complete turnkey residence in Kochi and Kerala.',
    sections: [],
  },
]

const snapshot = {
  settings: {
    ...plain(companyMod.company),
    servicePlaces: plain(companyMod.servicePlaces),
    navigation: {
      main: plain(navMod.mainNav),
      mobile: plain(navMod.mobileNav),
      footer: plain(navMod.footerNav),
    },
  },
  pages,
  collections: {
    projects: plain(projectsMod.projects),
    services: plain(servicesMod.services),
    journal: plain(journalMod.articles),
    gallery: plain(mediaMod.gallery),
    comparisons: plain(mediaMod.comparisons),
    journey: plain(storyMod.journey).map((item, index) => ({
      ...item,
      image: plain(mediaMod.journeyMedia[index]?.photo || null),
    })),
    process: zip(plain(storyMod.processSteps), plain(mediaMod.processMedia)),
    land: plain(storyMod.landPoints),
    drawings: plain(storyMod.drawings),
    approvals: plain(storyMod.approvalFlow),
    construction: zip(plain(storyMod.constructionStages), [plain(mediaMod.constructionPhoto)]),
    interiors: zip(plain(storyMod.interiorScopes), plain(mediaMod.interiorMedia)),
    furniture: zip(plain(storyMod.furniturePieces), plain(mediaMod.furnitureMedia)),
    quality: plain(storyMod.qualityPoints),
    beyond: zip(plain(storyMod.beyondItems), plain(mediaMod.beyondMedia)),
    hero: plain(storyMod.heroFrames),
    design: [{ title: 'Design', text: '', image: plain(mediaMod.designPhoto) }],
  },
}

mkdirSync(new URL('../backend/src/seed/', import.meta.url), { recursive: true })
writeFileSync(new URL('../backend/src/seed/jhomes.json', import.meta.url), JSON.stringify(snapshot))
await vite.close()
console.log('Wrote backend/src/seed/jhomes.json')
