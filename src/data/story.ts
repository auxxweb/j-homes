export const journey = [
  {
    number: '01',
    title: 'Land',
    text: 'The plot is read before a plan is forced onto it. Access, the ground, and what the site can hold come first.',
  },
  {
    number: '02',
    title: 'Design',
    text: 'Plans, elevations and layouts turn the idea into a home that can be drawn, priced and built.',
  },
  {
    number: '03',
    title: 'Approvals',
    text: 'Drawings are coordinated for submission, including K-SMART where the local authority uses it.',
  },
  {
    number: '04',
    title: 'Engineering',
    text: 'Structure, electrical and plumbing are aligned with the design so the site is not guessing.',
  },
  {
    number: '05',
    title: 'Construction',
    text: 'Foundation, structure, masonry, roof, services and finishing, supervised stage by stage.',
  },
  {
    number: '06',
    title: 'Interiors',
    text: 'Kitchens, wardrobes, ceilings, lighting, flooring and the rooms you will actually use.',
  },
  {
    number: '07',
    title: 'Furniture',
    text: 'Sofas, dining, beds, storage, curtains and decor chosen for the rooms as they were built.',
  },
  {
    number: '08',
    title: 'Handover',
    text: 'A finished home, walked through and handed over. From first step to final finish.',
  },
] as const

export const processSteps = [
  {
    number: '01',
    title: 'Discover',
    text: 'We listen to how you want to live, and to where you are starting — land, a sketch, or a full brief.',
  },
  {
    number: '02',
    title: 'Plan',
    text: 'The site, the rooms and the sequence of work are set out so the later stages have something to follow.',
  },
  {
    number: '03',
    title: 'Design',
    text: 'Architectural plans, site plans, elevations and the drawings the build and the interiors will share.',
  },
  {
    number: '04',
    title: 'Engineer',
    text: 'Structural information and service layouts are coordinated with the design before execution gathers speed.',
  },
  {
    number: '05',
    title: 'Build',
    text: 'The house is constructed in stages, with supervision from foundation through finishing.',
  },
  {
    number: '06',
    title: 'Finish',
    text: 'Interiors, furniture and the smaller details are completed as part of the same project, not a separate afterthought.',
  },
  {
    number: '07',
    title: 'Handover',
    text: 'The home is reviewed and handed over, ready to live in.',
  },
] as const

export const landPoints = [
  {
    title: 'Site evaluation',
    text: 'A first reading of the plot: its shape, its edges, and whether it can carry the home you have in mind.',
  },
  {
    title: 'Soil and access assessment',
    text: 'How you reach the site, and what the ground suggests for the way the house should sit.',
  },
  {
    title: 'Feasibility',
    text: 'A clear view of what is realistic on that land before design work runs ahead of the site.',
  },
  {
    title: 'Planning',
    text: 'The sequence from plot to plan, so the next drawing has a reason to exist.',
  },
  {
    title: 'Development guidance',
    text: 'Practical direction on how the property can be taken forward, without inventing a shortcut around the process.',
  },
] as const

export const drawings = [
  { code: 'A-01', title: 'Architectural plans' },
  { code: 'A-02', title: 'Site plans' },
  { code: 'A-03', title: '3D elevation' },
  { code: 'L-01', title: 'Landscape drawings' },
  { code: 'S-01', title: 'Structural drawings' },
  { code: 'E-01', title: 'Electrical layouts' },
  { code: 'P-01', title: 'Plumbing layouts' },
  { code: 'F-01', title: 'Furniture layouts' },
  { code: 'W-01', title: 'Working drawings' },
] as const

export const approvalFlow = [
  {
    title: 'Plan',
    text: 'The brief and the site become a set of drawings the rest of the work can share.',
  },
  {
    title: 'Engineering',
    text: 'Structure and services are resolved against those drawings, not beside them.',
  },
  {
    title: 'Approval',
    text: 'Submissions are coordinated with the authority process, including K-SMART where that is the route.',
  },
  {
    title: 'Execution',
    text: 'Construction follows the coordinated set, stage by stage, through to finishing.',
  },
] as const

export const constructionStages = [
  { number: '01', title: 'Foundation', text: 'The house meets the ground and the levels are set.' },
  { number: '02', title: 'Structure', text: 'Columns, beams and slabs establish the frame.' },
  { number: '03', title: 'Masonry', text: 'Walls close the rooms and the volumes become readable.' },
  { number: '04', title: 'Roof', text: 'The building is covered and the weather is kept out.' },
  { number: '05', title: 'Electrical', text: 'Points, routes and lighting are installed with the plan.' },
  { number: '06', title: 'Plumbing', text: 'Water and waste are laid so the rooms can function.' },
  { number: '07', title: 'Finishing', text: 'Surfaces, fittings and the last layer of the build.' },
] as const

export const interiorScopes = [
  { title: 'Modular kitchen', text: 'Storage, worktop and the way the kitchen is actually used.' },
  { title: 'Wardrobes', text: 'Bedroom storage drawn to the room, not placed as an afterthought.' },
  { title: 'TV units', text: 'A composed wall for living rooms, with storage where it is needed.' },
  { title: 'False ceiling', text: 'Height, services and lighting brought into one plane.' },
  { title: 'Lighting', text: 'Layers of light for work, rest and the evening room.' },
  { title: 'Flooring', text: 'The surface you live on, chosen with the rooms in mind.' },
  { title: 'Wall finishes', text: 'Colour, texture and the quieter surfaces between features.' },
  { title: 'Bedroom interiors', text: 'Sleep, storage and a room that closes the day properly.' },
  { title: 'Living and dining', text: 'The shared rooms, planned as one sequence of use.' },
  { title: 'Custom furniture', text: 'Pieces made for a wall, a niche or a view that a catalogue cannot fit.' },
] as const

export const furniturePieces = [
  { title: 'Sofa', text: 'The piece the living room gathers around.' },
  { title: 'Dining', text: 'A table and chairs scaled to the room that was built.' },
  { title: 'Beds', text: 'Proportion, headboard and the calm of the bedroom.' },
  { title: 'Tables', text: 'Side tables and work surfaces that earn their place.' },
  { title: 'Storage', text: 'The things you own, given a deliberate home.' },
  { title: 'Curtains', text: 'Light, privacy and the edge of every window.' },
  { title: 'Decor', text: 'The last layer — objects, not clutter.' },
] as const

export const qualityPoints = [
  { title: 'Quality materials', text: 'Materials are chosen for the work they have to do, and specified before they reach the site.' },
  { title: 'Stage-wise supervision', text: 'The build is reviewed as it advances, not only at the end.' },
  { title: 'Skilled workmanship', text: 'The people on site are part of the quality of the finished room.' },
  { title: 'Quality control', text: 'Checks sit inside the sequence, from structure through finishing.' },
  { title: 'Inspection', text: 'Work is looked at before the next stage covers it.' },
  { title: 'Handover', text: 'The home is walked through and handed over as a complete place to live.' },
] as const

export const beyondItems = [
  { title: 'Landscape', text: 'The ground around the house, shaped so the building has a setting.' },
  { title: 'Gates', text: 'The threshold between the street and the home.' },
  { title: 'Furniture', text: 'Pieces selected for the rooms, not added in a hurry after handover.' },
  { title: 'Interiors', text: 'Kitchens, wardrobes, ceilings and finishes carried by the same team.' },
  { title: 'Lighting', text: 'Daylight and fittings considered while the sections are still open.' },
  { title: 'Finishing', text: 'The last surfaces, fitted with the same care as the frame.' },
  { title: 'Handover', text: 'You receive a home, not a structure waiting for someone else to finish.' },
] as const

export const heroFrames = [
  { key: '01', title: 'Canvas', text: 'A clear sheet. The site is still an idea.' },
  { key: '02', title: 'Lines', text: 'The first architectural lines are drawn.' },
  { key: '03', title: 'Plan', text: 'Walls and rooms find their measure on the plot.' },
  { key: '04', title: 'Foundation', text: 'The home meets the ground.' },
  { key: '05', title: 'Structure', text: 'Floors and the frame begin to rise.' },
  { key: '06', title: 'Roof', text: 'The roof closes the volume.' },
  { key: '07', title: 'Openings', text: 'Windows and the door are set in place.' },
  { key: '08', title: 'Materials', text: 'Surfaces take on weight and colour.' },
  { key: '09', title: 'Landscape', text: 'The ground around the house is shaped.' },
  { key: '10', title: 'Residence', text: 'From first step to final finish.' },
] as const
