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
    title: 'Interior design',
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
]

export function getService(slug: string) {
  return services.find((service) => service.slug === slug)
}
