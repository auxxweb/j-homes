import { asset } from '../lib/assets'

export interface Frame {
  src: string
  alt: string
  width: number
  height: number
}

function frame(src: string, alt: string, width: number, height: number): Frame {
  return { src: asset(src), alt, width, height }
}

export const journeyMedia = [
  {
    glyph: 'land',
    photo: frame(
      '/images/journey/land.jpg',
      'A surveyor marking a cleared development plot with a satellite pole',
      1600,
      1134,
    ),
    credit: { name: 'Cvstr', href: 'https://commons.wikimedia.org/wiki/File:GNSS_surveyor_on_a_wet_development_site.jpg' },
  },
  {
    glyph: 'design',
    photo: frame(
      '/images/journey/design.jpg',
      'An architect drawing a house plan with a scale rule',
      1600,
      900,
    ),
  },
  {
    glyph: 'approvals',
    photo: frame(
      '/images/journey/approvals.jpg',
      'A set of documents being signed for approval',
      1600,
      1067,
    ),
  },
  {
    glyph: 'engineering',
    photo: frame(
      '/images/journey/engineering.jpg',
      'A worker checking a grid of steel reinforcement before concrete is poured',
      1600,
      1063,
    ),
  },
  {
    glyph: 'construction',
    photo: frame(
      '/images/journey/construction.jpg',
      'A house under construction, with ladders, framing and unfinished rooms',
      1600,
      1066,
    ),
  },
  {
    glyph: 'interiors',
    photo: frame(
      '/images/journey/interiors.jpg',
      'A finished living room opening to a kitchen, with a stair and daylight',
      1600,
      1028,
    ),
  },
  {
    glyph: 'furniture',
    photo: frame(
      '/images/journey/furniture.jpg',
      'A leather sofa placed in a finished room',
      1600,
      1200,
    ),
  },
  {
    glyph: 'handover',
    photo: frame(
      '/images/journey/handover.jpg',
      'House keys left in the lock of a front door',
      1600,
      1066,
    ),
  },
] as const

export const comparisons = [
  {
    title: 'The same house',
    beforeLabel: 'Construction',
    afterLabel: 'Finished',
    before: frame(
      '/images/compare/before.jpg',
      'The same residence during construction, with the concrete frame and block walls still open',
      976,
      1024,
    ),
    after: frame(
      '/images/compare/after.jpg',
      'The same residence finished, with stone, glazing, planting and the rooms lit',
      976,
      1024,
    ),
  },
  {
    title: 'Gabled residence',
    beforeLabel: 'Construction',
    afterLabel: 'Finished',
    before: frame(
      '/images/compare/gabled-before.jpg',
      'A residence under construction, drawn with block walls, timber frames and steel waiting on the roof',
      1024,
      849,
    ),
    after: frame(
      '/images/compare/gabled-after.jpg',
      'The same residence finished, with stone, timber screens, a car porch and the rooms lit',
      1024,
      849,
    ),
  },
  {
    title: 'Arched elevation',
    beforeLabel: 'Construction',
    afterLabel: 'Finished',
    before: frame(
      '/images/compare/arched-before.jpg',
      'A residence under construction, with block walls, round columns and roof tiles still being laid',
      1024,
      945,
    ),
    after: frame(
      '/images/compare/arched-after.jpg',
      'The same residence finished, with a terracotta roof, white walls and a timber porch',
      994,
      1024,
    ),
  },
  {
    title: 'Court residence',
    beforeLabel: 'Construction',
    afterLabel: 'Finished',
    before: frame(
      '/images/compare/court-before.jpg',
      'The same residence under construction, with block walls, open window frames and the roof slab in place',
      1024,
      954,
    ),
    after: frame(
      '/images/compare/court-after.jpg',
      'The finished residence, with a dark tiled roof, balconies, a front court and a pool',
      1024,
      954,
    ),
  },
] as const

export const interiorMedia = [
  frame('/images/interiors/kitchen.webp', 'A modular kitchen with timber cabinets, open shelving and a long worktop', 1200, 1800),
  frame('/images/interiors/wardrobe.webp', 'A fitted wardrobe interior with hanging space and organised shelves', 1200, 1800),
  frame('/images/interiors/living.webp', 'A living room arranged around a low cabinet and a composed seating wall', 1600, 844),
  frame('/images/interiors/ceiling.webp', 'An interior with a lowered ceiling plane and recessed lighting', 1600, 1200),
  frame('/images/interiors/lighting.webp', 'Pendant lights over a dining table, with layered evening illumination', 1600, 1067),
  frame('/images/interiors/flooring.webp', 'Close view of a timber floor, the surface a room is lived on', 1200, 1800),
  frame('/images/interiors/walls.webp', 'A quiet interior wall with texture, colour and a framed opening', 1600, 1600),
  frame('/images/interiors/bedroom.webp', 'A bedroom interior with a made bed, linen and soft side light', 1600, 1600),
  frame('/images/interiors/dining.webp', 'A living and dining room planned as one shared sequence', 1600, 900),
  frame('/images/interiors/furniture.webp', 'A custom sofa and side tables arranged for a living room', 1600, 1067),
] as const

export const processMedia = [
  frame('/images/process/discover.webp', 'A finished residence exterior, the kind of home a first conversation is aiming toward', 1400, 933),
  frame('/images/process/plan.webp', 'Architectural drawings spread on a table, the plan before the build', 1400, 788),
  frame('/images/process/design.webp', 'A composed building elevation, the idea resolved as architecture', 1400, 933),
  frame('/images/process/engineer.webp', 'A concrete structural frame, the engineered skeleton of a building', 1400, 933),
  frame('/images/process/build.webp', 'A house under construction, from the frame toward the finished shell', 1400, 933),
  frame('/images/process/finish.webp', 'A finished interior with furniture, light and the last layer of the room', 1400, 788),
  frame('/images/process/handover.webp', 'House keys held at the threshold, the moment a home is handed over', 1400, 1051),
] as const

export const furnitureMedia = [
  frame('/images/interiors/sofa.webp', 'A sofa and chairs arranged as the centre of a living room', 1400, 933),
  frame('/images/interiors/dining.webp', 'A dining table and chairs scaled to a shared room', 1600, 900),
  frame('/images/interiors/bed.webp', 'A bed dressed in linen, the calm centre of a bedroom', 1400, 933),
  frame('/images/interiors/table.webp', 'A timber table set for everyday use', 1202, 1800),
  frame('/images/interiors/storage.webp', 'Fitted storage with shelves and hanging space', 1200, 1800),
  frame('/images/interiors/curtains.webp', 'Curtains filtering daylight at the edge of a room', 1400, 935),
  frame('/images/interiors/decor.webp', 'A few objects on a sideboard, the last layer of a room', 1200, 1800),
] as const

export const beyondMedia = [
  frame('/images/studies/court-garden.webp', 'A residence set in a planted court, with lawn joints and tropical trees', 1000, 750),
  frame('/images/studies/slat-gate.webp', 'A dark slatted gate between the street and a white residence', 1024, 748),
  frame('/images/interiors/sofa.webp', 'Furniture arranged for a living room that has already been planned', 1400, 933),
  frame('/images/interiors/living.webp', 'An interior with seating, storage and a composed wall of finishes', 1600, 844),
  frame('/images/interiors/lighting.webp', 'Lighting considered as part of the room, not added at the end', 1600, 1067),
  frame('/images/studies/window-house.webp', 'A finished elevation with timber windows, stone and a planted edge', 1024, 627),
  frame('/images/studies/carport-side.webp', 'A completed white residence with its porch, court and landscape in place', 1024, 681),
] as const

export const designPhoto = frame(
  '/images/studies/arch-day.webp',
  'Daylight elevation of a cream residence with a balcony, timber doors and a patterned screen',
  1024,
  576,
)

export const gallery = [
  frame('/images/studies/carport-front.webp', 'Front elevation of a white residence with a car porch, brick screen and palm trees', 1024, 829),
  frame('/images/studies/carport-side.webp', 'Side view of a white residence with a car porch and a paved court', 1024, 681),
  frame('/images/studies/colonial-court.webp', 'A white residence with a front court, pool edge and planted boundary', 1024, 576),
  frame('/images/studies/linear-house.webp', 'A linear residence with a car porch, timber screens and a planted terrace', 960, 643),
  frame('/images/studies/arched-screen.webp', 'A cream residence with deep arches and a terracotta screen', 1024, 576),
  frame('/images/studies/arch-day.webp', 'Daylight elevation of a cream residence with a balcony and timber doors', 1024, 576),
  frame('/images/studies/arch-evening.webp', 'The cream residence after dusk, with warm light along the drive', 1024, 682),
  frame('/images/studies/slat-gate.webp', 'A white residence seen through a dark slatted front gate', 1024, 748),
  frame('/images/studies/timber-court.webp', 'A white residence with timber cladding, a stone pier and a shaded porch', 1024, 576),
  frame('/images/studies/compound-house.webp', 'A residence behind a compound wall, with a planted front garden', 1024, 767),
  frame('/images/studies/screen-house.webp', 'A symmetrical residence with screens, glazing and a formal front court', 1024, 526),
  frame('/images/studies/window-house.webp', 'A finished elevation with timber windows, stone and a planted edge', 1024, 627),
  frame('/images/studies/stone-day.webp', 'A grey residence in daylight, with a stone pier and slatted screens', 652, 440),
  frame('/images/studies/stone-evening.webp', 'The same grey residence after dusk, with the porch and garden lit', 1024, 768),
  frame('/images/studies/gable-day.webp', 'A residence in daylight with a brick base, timber gable and circular opening', 1024, 568),
  frame('/images/studies/gable-night.webp', 'The same gabled residence at night, with the court and rooms lit', 1024, 819),
  frame('/images/studies/stone-tower.webp', 'A tall residence with stone cladding, a glazed bay and a side balcony', 984, 960),
  frame('/images/studies/tower-rain.webp', 'The same tall residence in the rain at night', 768, 1024),
  frame('/images/studies/court-garden.webp', 'A residence with a planted court, timber soffit and a jointed drive', 1000, 750),
  frame('/images/studies/clay-roof.webp', 'A residence with a clay-tiled pitch over the upper floor', 1000, 750),
]

export const constructionPhoto = frame(
  '/images/process/build.webp',
  'A house during construction, the shell rising before finishes are applied',
  1400,
  933,
)
