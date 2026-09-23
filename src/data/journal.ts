export interface JournalBlock {
  type: 'p' | 'h2'
  text: string
}

export interface JournalArticle {
  slug: string
  title: string
  description: string
  seoTitle: string
  kicker: string
  blocks: JournalBlock[]
}

export const articles: JournalArticle[] = [
  {
    slug: 'planning-a-home-in-kochi',
    title: 'Planning a home in Kochi, from the plot to handover',
    description:
      'How a J Homes residence moves from land and design through approvals, construction, interiors and handover in Kochi and Ernakulam.',
    seoTitle: 'Planning a Home in Kochi | J Homes',
    kicker: 'Guide',
    blocks: [
      {
        type: 'p',
        text: 'Most people begin with a picture of a finished house. The useful work starts earlier, with the land and a clear order of decisions. In and around Kochi and Ernakulam, that order is what keeps a residential project from splitting into unrelated contractors.',
      },
      {
        type: 'h2',
        text: 'Begin with the site',
      },
      {
        type: 'p',
        text: 'A plot in Mulanthuruthy is not a plot in Thiruvaniyoor. One of the houses in the J Homes record sits on 4.5 cents; another is a ground-floor home on 50 cents. Before plans are drawn, the site needs a reading: access, the ground, and whether the house you want is feasible there. If you do not yet have land, the same questions describe what you should be looking for.',
      },
      {
        type: 'h2',
        text: 'Then draw, then coordinate',
      },
      {
        type: 'p',
        text: 'Architectural plans, a site plan, elevations and working drawings give everyone the same picture. Structural information, electrical layouts and plumbing layouts belong with that set. Approvals, including K-SMART where the local body uses it, are coordinated from those drawings rather than invented at the counter.',
      },
      {
        type: 'h2',
        text: 'Build, finish, hand over',
      },
      {
        type: 'p',
        text: 'Construction is a sequence: foundation, structure, masonry, roof, electrical, plumbing, finishing. Interiors — kitchen, wardrobes, ceilings, lighting, floors — and furniture follow as part of the same project when the brief is turnkey. Handover is the point at which the home is ready to live in, not merely roofed.',
      },
      {
        type: 'p',
        text: 'If you are deciding where to start, say so plainly: you have land, you need land, you have a design, or you want the complete path. That single fact tells J Homes which drawing, or which site visit, should come next.',
      },
    ],
  },
  {
    slug: 'what-a-turnkey-home-includes',
    title: 'What a turnkey home with J Homes includes',
    description:
      'The scope of a J Homes turnkey residence: land, design, approvals, engineering, construction, interiors, furniture, landscape and handover.',
    seoTitle: 'What Turnkey Construction Includes | J Homes',
    kicker: 'Guide',
    blocks: [
      {
        type: 'p',
        text: 'Turnkey is an easy word to stretch. At J Homes it means a defined journey with one team: from the first step on the land to the final finish of the rooms.',
      },
      {
        type: 'h2',
        text: 'The full arc',
      },
      {
        type: 'p',
        text: 'The scope covers land selection, planning, architectural design, approvals, engineering, construction, interior design, furniture, furnishing, landscaping and handover. You may not need every chapter. Someone who already holds a design does not need to pretend they are starting from a blank sheet. Someone who wants the complete path should not be left to appoint a new team at the plaster stage.',
      },
      {
        type: 'h2',
        text: 'What stays together',
      },
      {
        type: 'p',
        text: 'The value is coordination. A furniture layout that ignores the electrical plan, or a ceiling that is decided after the slab, creates avoidable rework. One team keeps design, engineering, construction and interiors in a single sequence. Quality checks — materials, supervision, workmanship, inspection — sit inside that sequence.',
      },
      {
        type: 'h2',
        text: 'What it does not mean',
      },
      {
        type: 'p',
        text: 'It does not mean a fixed promise about another family’s plot, and it does not skip the authority’s process. Permits follow the local route. K-SMART is used where that is the authority’s system. The outcome of an application is not something a builder should guarantee in a brochure.',
      },
      {
        type: 'p',
        text: 'If you want this scope, start by naming your stage. The next meeting is more useful when J Homes knows whether the conversation is about land, drawings, or a house ready to be built and finished.',
      },
    ],
  },
  {
    slug: 'drawings-that-guide-a-build',
    title: 'The drawings that guide a residential build',
    description:
      'A plain-language guide to the plans, elevations and service layouts J Homes uses before and during house construction.',
    seoTitle: 'Residential Drawings Explained | J Homes',
    kicker: 'Guide',
    blocks: [
      {
        type: 'p',
        text: 'A house is built from drawings long before it is built from brick. These are the sheets J Homes uses, described without the jargon that makes a first-time client feel locked out of their own project.',
      },
      {
        type: 'h2',
        text: 'The architectural set',
      },
      {
        type: 'p',
        text: 'Architectural plans show the rooms, the walls and the levels. A site plan shows the building on the plot — setbacks, access, and how the house sits on the land. A 3D elevation shows the outside: the roof, the openings, the character of the front. Landscape drawings describe the ground around the building. Working drawings carry the dimensions and details the site needs day to day.',
      },
      {
        type: 'h2',
        text: 'Structure and services',
      },
      {
        type: 'p',
        text: 'Structural drawings describe the frame that holds the house up. Electrical layouts place lights, fans and points. Plumbing layouts trace water and waste. These are not optional extras on a serious house. If they disagree with the floor plan, the site will discover the disagreement at the worst moment.',
      },
      {
        type: 'h2',
        text: 'Furniture, before the rooms are full',
      },
      {
        type: 'p',
        text: 'A furniture layout checks that the dining table, the bed and the wardrobe actually fit the rooms that were drawn. It also tells the electrical plan where a bedside point or a television point wants to be. Custom furniture, later, has a wall to belong to.',
      },
      {
        type: 'p',
        text: 'You do not need to read every sheet like an engineer. You do need a team that is reading the same set. That is the standard J Homes works to, from the first plan to the final finish.',
      },
    ],
  },
]

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug)
}
