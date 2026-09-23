export const LOADER_COLORS = {
  ink: '#161412',
  inkSoft: '#3A3531',
  paper: '#F3F0EA',
  wall: '#E7E1D6',
  wallSide: '#D4CBBE',
  stone: '#CFC8BE',
  stoneDark: '#B7AFA3',
  line: '#C9C1B6',
  crimson: '#BC0000',
  crimsonDeep: '#7A1218',
  glass: '#D5DDE2',
  glow: '#F3E2C4',
  leaf: '#6E7A62',
  leafLight: '#8A9178',
  trunk: '#5C5148',
  drive: '#E3DCD2',
} as const

export const FOUNDATION_DURATION = 0.42
export const STRUCTURE_DURATION = 0.48
export const DETAIL_DURATION = 0.4
export const BUILD_DURATION = 4.7
export const LOADER_DURATION = 5
export const EXIT_DURATION = 0.85
export const MIN_DISPLAY_MS = 3200
export const MOBILE_MIN_DISPLAY_MS = 2500
export const REDUCED_MIN_DISPLAY_MS = 700
export const READY_FALLBACK_MS = 8000

export const STAGE = {
  site: 'Site',
  foundation: '01  /  Foundation',
  structure: '02  /  Structure',
  design: '03  /  Design',
  finish: '04  /  Finish',
  finale: 'finale',
} as const
