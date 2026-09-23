export interface ProjectImage {
  src: string
  alt: string
  width?: number
  height?: number
}

export interface Project {
  slug: string
  location: string
  region: string
  type: 'Residential'
  floors: string
  storeys: number
  builtUpSqFt: number
  landCent: number
  summary: string
  story: string
  design: string
  construction: string
  interior: string
  result: string
  images: ProjectImage[]
}

export const projects: Project[] = [
  {
    slug: 'mulanthuruthy-residence',
    location: 'Mulanthuruthy',
    region: 'Ernakulam, Kerala',
    type: 'Residential',
    floors: 'G+2',
    storeys: 3,
    builtUpSqFt: 2100,
    landCent: 4.5,
    summary:
      'A ground-plus-two residence of 2,100 sq.ft on 4.5 cents in Mulanthuruthy.',
    story:
      'This is a residential house in Mulanthuruthy: three levels, 2,100 sq.ft of built-up area, on 4.5 cents of land. On a compact plot, the plan has to be disciplined. The work moves floor by floor so structure, services and finishes stay in one sequence.',
    design:
      'Design for a house of this size starts with the plot. Architectural plans, a site plan and elevations have to account for three floors on 4.5 cents, with working drawings that the site can follow.',
    construction:
      'Construction runs from foundation through structure, masonry, roof, electrical, plumbing and finishing. On a G+2 house, each slab is a stage that has to be right before the next level begins.',
    interior:
      'Interiors cover the rooms the area allows: kitchen, storage, living, dining and bedrooms, with ceilings, lighting, flooring and wall finishes carried as part of the same project.',
    result:
      'The completed record is a three-storey residence of 2,100 sq.ft in Mulanthuruthy. Photography of the finished house can be added to this page when it is available.',
    images: [],
  },
  {
    slug: 'mulanthuruthy-g1-residence',
    location: 'Mulanthuruthy',
    region: 'Ernakulam, Kerala',
    type: 'Residential',
    floors: 'G+1',
    storeys: 2,
    builtUpSqFt: 2200,
    landCent: 10,
    summary: 'A ground-plus-one residence of 2,200 sq.ft on 10 cents in Mulanthuruthy.',
    story:
      'A second residential project in Mulanthuruthy: ground plus one, 2,200 sq.ft built, on 10 cents. The land is more generous than the 4.5-cent house nearby in the record, so the building and the ground around it can be planned together.',
    design:
      'Two floors and 2,200 sq.ft give the plans room for living spaces and bedrooms without stacking a third level. Site and landscape drawings matter here because the plot is larger than the footprint.',
    construction:
      'The build is a G+1 sequence: foundation, ground floor, slab, upper floor, roof, services and finishing, supervised as the structure rises.',
    interior:
      'Interior work follows the two floors — kitchen, wardrobes, living and dining, bedrooms, lighting and finishes — coordinated with the furniture layout.',
    result:
      'A completed G+1 residence of 2,200 sq.ft on 10 cents in Mulanthuruthy. Project photography can be added to the gallery without changing this record.',
    images: [],
  },
  {
    slug: 'eruveli-residence',
    location: 'Eruveli',
    region: 'Kerala',
    type: 'Residential',
    floors: 'G+1',
    storeys: 2,
    builtUpSqFt: 1200,
    landCent: 5,
    summary: 'A ground-plus-one residence of 1,200 sq.ft on 5 cents in Eruveli.',
    story:
      'The Eruveli house is residential, ground plus one, with 1,200 sq.ft of built-up area on 5 cents. It is the smallest built-up area in the current project record, which asks for a plan that is exact about every room.',
    design:
      'Architectural and working drawings for a compact G+1 house concentrate on clear rooms, a usable stair, and service layouts that do not waste the 1,200 sq.ft.',
    construction:
      'Construction follows the same stage-wise sequence as the larger houses, scaled to a two-level building on a 5-cent plot.',
    interior:
      'Interiors are planned tightly: kitchen, storage, living and bedrooms finished within the area that was built.',
    result:
      'A G+1 home of 1,200 sq.ft in Eruveli. The page is ready for photographs when they are added to the project record.',
    images: [],
  },
  {
    slug: 'thiruvaniyoor-residence',
    location: 'Thiruvaniyoor',
    region: 'Ernakulam, Kerala',
    type: 'Residential',
    floors: 'Ground',
    storeys: 1,
    builtUpSqFt: 2200,
    landCent: 50,
    summary: 'A single-storey residence of 2,200 sq.ft on 50 cents in Thiruvaniyoor.',
    story:
      'The Thiruvaniyoor residence is a ground-floor house of 2,200 sq.ft on 50 cents. The land is by far the largest plot in the record relative to the built area, so the house sits inside a site rather than filling it.',
    design:
      'A single level of 2,200 sq.ft can spread rooms in plan instead of stacking them. The site plan and landscape drawings carry as much weight as the floor plan.',
    construction:
      'Without an upper floor, the sequence is foundation, structure, masonry, roof, services and finishing across one storey, with the surrounding ground left as part of the work.',
    interior:
      'Living, dining, bedrooms, kitchen and storage are arranged on one level, with finishes and furniture planned for rooms that open toward the site.',
    result:
      'A ground-floor residence of 2,200 sq.ft on 50 cents in Thiruvaniyoor. Images of the house and its grounds can be added to this record later.',
    images: [],
  },
  {
    slug: 'changanassery-residence',
    location: 'Changanassery',
    region: 'Kerala',
    type: 'Residential',
    floors: 'G+1',
    storeys: 2,
    builtUpSqFt: 3500,
    landCent: 20,
    summary: 'A ground-plus-one residence of 3,500 sq.ft on 20 cents in Changanassery.',
    story:
      'The Changanassery project is the largest built-up area in the record: a residential G+1 of 3,500 sq.ft on 20 cents. The house has room for a fuller plan, and the plot is large enough to hold it without compressing every edge.',
    design:
      'Drawings for 3,500 sq.ft cover a wider plan: architectural layouts, elevations, structural drawings, electrical and plumbing, and furniture layouts for more than one living space.',
    construction:
      'A building of this size is still led stage by stage — foundation to structure, masonry, roof, services and finishing — with supervision keeping the two floors aligned to the drawings.',
    interior:
      'Interiors extend across both floors: kitchens, wardrobes, living and dining, bedrooms, ceilings, lighting, flooring and custom furniture where the rooms require it.',
    result:
      'A G+1 residence of 3,500 sq.ft in Changanassery. The gallery is structured so finished photography can be published with the same project facts.',
    images: [],
  },
  {
    slug: 'chottanikkara-residence',
    location: 'Chottanikkara',
    region: 'Ernakulam, Kerala',
    type: 'Residential',
    floors: 'G+1',
    storeys: 2,
    builtUpSqFt: 1300,
    landCent: 4.5,
    summary: 'A ground-plus-one residence of 1,300 sq.ft on 4.5 cents in Chottanikkara.',
    story:
      'The Chottanikkara house is residential, ground plus one, 1,300 sq.ft on 4.5 cents. Like the smaller Mulanthuruthy plot, the land is compact. The plan has to be precise, and the two floors have to work hard.',
    design:
      'Site and floor plans for 4.5 cents keep the footprint controlled. Working drawings, electrical and plumbing layouts, and the furniture layout are coordinated so the 1,300 sq.ft stays usable.',
    construction:
      'The build is a compact G+1: foundation, frame, masonry, roof and services, then finishing, with each stage checked before it is closed.',
    interior:
      'Kitchen, wardrobes, living and bedrooms are finished within a modest area, with storage doing as much work as the open rooms.',
    result:
      'A G+1 residence of 1,300 sq.ft in Chottanikkara. Photographs can be added to the project when they are ready.',
    images: [],
  },
]

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}

export function adjacentProjects(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug)
  if (index < 0) return { previous: undefined, next: undefined }
  return {
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  }
}

export function formatSqFt(value: number) {
  return `${value.toLocaleString('en-IN')} sq.ft`
}

export function formatCent(value: number) {
  const amount = Number.isInteger(value) ? value.toString() : value.toString()
  return `${amount} cent`
}
