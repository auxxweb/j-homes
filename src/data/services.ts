export interface ServicePoint {
  title: string
  text: string
}

export interface Service {
  slug: string
  title: string
  headline: string
  lede: string
  paragraphs: string[]
  points: ServicePoint[]
  includes: string[]
  seoTitle: string
  seoDescription: string
}

export const services: Service[] = [
  {
    slug: 'house-construction',
    title: 'House construction',
    headline: 'Built to last.',
    lede: 'Residential construction in Kochi, Ernakulam and across Kerala, carried stage by stage from foundation to finishing.',
    paragraphs: [
      'J Homes builds houses. The work is physical and sequential: foundation, structure, masonry, roof, electrical, plumbing and finishing. Each stage is supervised before the next one covers it.',
      'A home in Mulanthuruthy, Chottanikkara or a plot elsewhere in Kerala is still the same kind of responsibility. The drawings set the measure. The site follows them. Quality is checked in the work, not added as a slogan at handover.',
      'If you already have land, or you are ready to build, this is the part of the journey where the idea becomes a structure you can walk through.',
    ],
    points: [
      { title: 'Foundation to roof', text: 'The shell of the house, constructed in a clear order.' },
      { title: 'Services', text: 'Electrical and plumbing installed with the layouts, not improvised on site.' },
      { title: 'Finishing', text: 'Surfaces and fittings that close the construction stage.' },
      { title: 'Supervision', text: 'Stage-wise review so the next trade starts on sound work.' },
    ],
    includes: ['Foundation', 'Structure', 'Masonry', 'Roof', 'Electrical', 'Plumbing', 'Finishing'],
    seoTitle: 'House Construction in Kochi & Ernakulam | J Homes',
    seoDescription:
      'J Homes builds residences in Kochi, Ernakulam and Kerala, from foundation and structure through masonry, roof, services and finishing.',
  },
  {
    slug: 'architectural-design',
    title: 'Architectural design',
    headline: 'Turn your idea into a design.',
    lede: 'Plans, elevations and working drawings that give a house in Kerala a clear form before construction begins.',
    paragraphs: [
      'Design at J Homes is the set of drawings the rest of the project shares. Architectural plans, site plans, 3D elevation, landscape drawings, structural drawings, electrical and plumbing layouts, furniture layouts and working drawings.',
      'The aim is simple: your idea has to become a design the site can build and the interiors can finish. A compact plot in Chottanikkara and a large ground-floor house in Thiruvaniyoor do not want the same plan. The drawings start from the land and the way you want to live.',
      'Architectural design in and around Kochi is offered as part of the same team that can build and finish the house, so the elevation and the site are not handed to strangers.',
    ],
    points: [
      { title: 'Plans and elevations', text: 'The rooms, the form and the way the house sits on the plot.' },
      { title: 'Working drawings', text: 'Information the construction team can actually use.' },
      { title: 'Services layouts', text: 'Electrical, plumbing and furniture drawn with the architecture.' },
      { title: 'Site and landscape', text: 'The ground around the building, considered while the plan is still open.' },
    ],
    includes: [
      'Architectural plans',
      'Site plans',
      '3D elevation',
      'Landscape drawings',
      'Structural drawings',
      'Electrical layouts',
      'Plumbing layouts',
      'Furniture layouts',
      'Working drawings',
    ],
    seoTitle: 'Architectural Design in Kochi | J Homes',
    seoDescription:
      'J Homes prepares architectural plans, elevations, working drawings and service layouts for residences in Kochi, Ernakulam and Kerala.',
  },
  {
    slug: 'interior-design',
    title: 'Interior',
    headline: 'Rooms, finished properly.',
    lede: 'Interior design and execution for kitchens, wardrobes, ceilings, lighting, flooring and the rooms of the house.',
    paragraphs: [
      'J Homes carries interiors as part of the home, not as a separate trade that arrives after the building is abandoned. Modular kitchens, wardrobes, TV units, false ceilings, lighting, flooring, wall finishes, bedrooms, living and dining, and custom furniture.',
      'The drawings for furniture and ceilings are more useful when they know the structure. That is the advantage of one team: the socket, the ceiling and the wardrobe are allowed to agree.',
      'Interior design and execution is offered for homes in Kochi, Ernakulam and the wider project area in Kerala.',
    ],
    points: [
      { title: 'Kitchens and storage', text: 'Modular kitchens, wardrobes and TV units sized to the rooms.' },
      { title: 'Ceilings and light', text: 'False ceilings and lighting planned with the services above them.' },
      { title: 'Floors and walls', text: 'Finishes chosen for the way each room is used.' },
      { title: 'Living, dining, bedrooms', text: 'The main rooms composed, then furnished.' },
    ],
    includes: [
      'Modular kitchen',
      'Wardrobes',
      'TV units',
      'False ceiling',
      'Lighting',
      'Flooring',
      'Wall finishes',
      'Bedroom interiors',
      'Living and dining',
      'Custom furniture',
    ],
    seoTitle: 'Interior Design and Execution in Kochi | J Homes',
    seoDescription:
      'J Homes designs and executes residential interiors in Kochi and Kerala, including kitchens, wardrobes, ceilings, lighting, flooring and custom furniture.',
  },
  {
    slug: 'turnkey-construction',
    title: 'Turnkey construction',
    headline: 'One team. Every stage.',
    lede: 'A complete turnkey path from land and design through approvals, construction, interiors, furniture and handover.',
    paragraphs: [
      'Turnkey, for J Homes, means the journey stays with one coordinated team. Land selection, planning, architectural design, approvals, engineering, construction, interior design, furniture, furnishing, landscaping and final handover.',
      'You should not have to translate between a designer, a contractor and an interior firm who have never shared a drawing. The promise is your dream home, from first step to final finish.',
      'Turnkey construction is how J Homes works across Kochi, Ernakulam and other residential projects in Kerala. The scope of a particular house still depends on where you are starting — with land, without land, with a design, or from the beginning.',
    ],
    points: [
      { title: 'Single sequence', text: 'Design, engineering, construction and interiors planned as one project.' },
      { title: 'Approvals coordinated', text: 'Drawings prepared for the authority path, including K-SMART where it applies.' },
      { title: 'Through to furnishing', text: 'Furniture, landscape and handover included in the turnkey scope.' },
      { title: 'A clear starting point', text: 'Tell us whether you have land, need land, have a design, or want the full path.' },
    ],
    includes: [
      'Land selection',
      'Planning',
      'Architectural design',
      'Approvals',
      'Engineering',
      'Construction',
      'Interiors',
      'Furniture',
      'Landscaping',
      'Handover',
    ],
    seoTitle: 'Turnkey Construction in Kochi | J Homes',
    seoDescription:
      'J Homes delivers turnkey homes in Kochi and Kerala: design, approvals, construction, interiors, furniture and handover with one team.',
  },
  {
    slug: 'land-selection',
    title: 'Land selection',
    headline: 'Start with the right land.',
    lede: 'Site evaluation, access, feasibility and planning guidance before a house is drawn onto the wrong plot.',
    paragraphs: [
      'A good house starts with land that can hold it. J Homes looks at the site: its access, the ground, and whether the home you want is feasible there. From that reading comes a plan for how to develop the property.',
      'This is guidance and evaluation, not a promise that every plot will suit every brief. If you already have land, the work is to understand it. If you still need land, the work is to know what you are looking for before you commit.',
      'The same attention shows up in the project record — compact 4.5-cent plots and a 50-cent ground in Thiruvaniyoor are not interchangeable. Land selection is how that difference is respected.',
    ],
    points: [
      { title: 'Site evaluation', text: 'Shape, edges and whether the plot can carry the house.' },
      { title: 'Soil and access assessment', text: 'How the site is reached, and what the ground suggests.' },
      { title: 'Feasibility', text: 'An honest view of what is realistic before design begins.' },
      { title: 'Planning and development guidance', text: 'The next step, described clearly, for the land you have or the land you need.' },
    ],
    includes: [
      'Site evaluation',
      'Soil and access assessment',
      'Feasibility',
      'Planning',
      'Development guidance',
    ],
    seoTitle: 'Land Selection for Homes in Kerala | J Homes',
    seoDescription:
      'J Homes helps you evaluate residential land in and around Kochi: site, access, feasibility and planning before design begins.',
  },
  {
    slug: 'engineering',
    title: 'Engineering',
    headline: 'From drawing to a buildable house.',
    lede: 'Structural, electrical and plumbing information coordinated with the design, then taken through approval toward execution.',
    paragraphs: [
      'Engineering is the bridge between a design and a site. Structural drawings, electrical layouts and plumbing layouts are prepared so construction is following information, not memory.',
      'Approvals sit in the same chain. Drawings are coordinated for submission to the authority, including K-SMART where that is the local process. J Homes does not treat approval as a separate errand detached from the design.',
      'Plan, engineering, approval, execution. That is the order. The house in Kochi or elsewhere in Kerala is built from that chain, not from a stack of unrelated files.',
    ],
    points: [
      { title: 'Structure', text: 'Structural drawings aligned with the architectural set.' },
      { title: 'Electrical and plumbing', text: 'Service layouts resolved before the walls close.' },
      { title: 'Approval coordination', text: 'Submissions prepared for the authority route, including K-SMART where required.' },
      { title: 'Execution', text: 'The site builds from the coordinated set.' },
    ],
    includes: ['Structural drawings', 'Electrical layouts', 'Plumbing layouts', 'Approval coordination', 'K-SMART coordination'],
    seoTitle: 'Residential Engineering & Approvals | J Homes',
    seoDescription:
      'J Homes coordinates structural, electrical and plumbing design and authority approvals, including K-SMART, for homes in Kerala.',
  },
  {
    slug: 'budget-management',
    title: 'Budget management',
    headline: 'A budget you can follow.',
    lede: 'The cost of the house is set with the design and watched as each stage is built, so the project stays readable.',
    paragraphs: [
      'Budget management at J Homes sits inside the same sequence as the drawings and the site. The scope is priced against the design, then followed as foundation, structure, finishing and interiors move forward.',
      'Changes are easier to judge when they are visible. If a material, a room or a stage shifts, the effect on the budget is part of that conversation, not a surprise at the end.',
      'This is planning and tracking for a residence in Kochi, Ernakulam and Kerala. It is not a promise of a fixed figure before the land, the design and the brief are known.',
    ],
    points: [
      { title: 'Scope and estimate', text: 'The budget starts from what the house is actually going to include.' },
      { title: 'Stage by stage', text: 'Cost is followed as the build advances, not only at handover.' },
      { title: 'Changes made visible', text: 'A revision to the design or the specification is read against the budget.' },
      { title: 'One picture of the project', text: 'Design, construction and finishing are costed as parts of the same home.' },
    ],
    includes: ['Project budget', 'Stage-wise tracking', 'Material allowances', 'Variation review'],
    seoTitle: 'Home Construction Budget Management | J Homes',
    seoDescription:
      'J Homes plans and tracks the budget of a residence in Kochi and Kerala, from design through construction, interiors and handover.',
  },
  {
    slug: 'landscaping',
    title: 'Landscaping',
    headline: 'The ground around the house.',
    lede: 'Landscape, levels and the setting of the home, planned with the building rather than added after the walls are done.',
    paragraphs: [
      'Landscaping gives the house a ground to sit in. Levels, edges, planting and the approach are considered with the site, so the plot and the building belong to each other.',
      'A compact plot and a larger ground do not want the same treatment. The work starts from the land you have, and from how you arrive at the house and use the space around it.',
      'J Homes carries landscaping as part of the residential journey in Kochi, Ernakulam and Kerala, with the same team that designs and builds the home.',
    ],
    points: [
      { title: 'Levels and edges', text: 'The ground is shaped so the house meets the plot cleanly.' },
      { title: 'Approach', text: 'The way you arrive, including the threshold between the street and the home.' },
      { title: 'Planting', text: 'The landscape is chosen for the site and the way the ground will be used.' },
      { title: 'With the building', text: 'Drainage, levels and the plan are resolved together.' },
    ],
    includes: ['Site levels', 'Landscape', 'Approach', 'Planting', 'External ground'],
    seoTitle: 'Residential Landscaping in Kochi | J Homes',
    seoDescription:
      'J Homes shapes the ground around a home in Kochi and Kerala: levels, approach, planting and landscape planned with the house.',
  },
  {
    slug: 'loose-furniture',
    title: 'Loose furniture',
    headline: 'The pieces you live with.',
    lede: 'Movable furniture for the rooms — seating, dining, beds and the pieces that are not built in.',
    paragraphs: [
      'Loose furniture is the part of the home you can place, move and live with: sofas, dining tables, beds, chairs and the smaller pieces that complete a room. It is distinct from the built interior — kitchens, wardrobes and fitted storage.',
      'The pieces are chosen for the rooms that already exist in the plan, so scale, use and the way you sit or gather are decided with the house, not after it is empty.',
      'J Homes includes loose furniture in the residential sequence for homes in Kochi, Ernakulam and Kerala, carried through to the finished rooms.',
    ],
    points: [
      { title: 'Living and dining', text: 'Seating and tables sized to the rooms they occupy.' },
      { title: 'Bedrooms', text: 'Beds and the pieces around them, chosen for how the room is used.' },
      { title: 'Not built in', text: 'Movable furniture, separate from kitchens, wardrobes and fitted work.' },
      { title: 'With the handover', text: 'The rooms are furnished as part of finishing the home.' },
    ],
    includes: ['Seating', 'Dining furniture', 'Beds', 'Tables', 'Bedroom furniture'],
    seoTitle: 'Loose Furniture for Homes in Kochi | J Homes',
    seoDescription:
      'J Homes selects loose furniture for residences in Kochi and Kerala: seating, dining, beds and other movable pieces for the finished rooms.',
  },
]

const serviceStepSlugs = [
  'land-selection',
  'architectural-design',
  'budget-management',
  'house-construction',
  'interior-design',
  'landscaping',
  'loose-furniture',
] as const

export const serviceSteps = serviceStepSlugs.map((slug) => {
  const service = services.find((item) => item.slug === slug)
  if (!service) throw new Error(`Missing service: ${slug}`)
  return service
})

export function getService(slug: string) {
  return services.find((service) => service.slug === slug)
}
