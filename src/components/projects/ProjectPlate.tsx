import type { Project } from '../../data/projects'
import { formatCent, formatSqFt } from '../../data/projects'

type PlateView = 'elevation' | 'plan' | 'section'

export function ProjectPlate({
  project,
  view = 'elevation',
}: {
  project: Project
  view?: PlateView
}) {
  const plot = Math.min(1.45, Math.max(0.78, project.landCent / 16))
  const mass = Math.min(1.2, Math.max(0.7, project.builtUpSqFt / 2600))
  const floors = project.storeys
  const buildingWidth = 210 * mass
  const floorHeight = 72
  const ground = 318
  const left = 320 - buildingWidth / 2
  const plotWidth = 420 * plot
  const plotLeft = 320 - plotWidth / 2

  return (
    <svg viewBox="0 0 640 420" className="h-full w-full" aria-hidden="true">
      <rect x="16" y="16" width="608" height="388" fill="none" stroke="#D5CEC4" />
      <text x="32" y="42" fill="#5E5852" fontFamily="Manrope, sans-serif" fontSize="11" letterSpacing="2">
        {project.location.toUpperCase()} · {project.floors} · STUDY
      </text>
      <text x="32" y="390" fill="#5E5852" fontFamily="Manrope, sans-serif" fontSize="11" letterSpacing="1.5">
        {formatSqFt(project.builtUpSqFt)} · {formatCent(project.landCent)} · {view.toUpperCase()}
      </text>
      {view === 'plan' ? (
        <Plan plotLeft={plotLeft} plotWidth={plotWidth} left={left} buildingWidth={buildingWidth} floors={floors} />
      ) : view === 'section' ? (
        <Section left={left} buildingWidth={buildingWidth} floors={floors} floorHeight={floorHeight} ground={ground} />
      ) : (
        <Elevation
          plotLeft={plotLeft}
          plotWidth={plotWidth}
          left={left}
          buildingWidth={buildingWidth}
          floors={floors}
          floorHeight={floorHeight}
          ground={ground}
          land={project.landCent}
        />
      )}
    </svg>
  )
}

function Elevation({
  plotLeft,
  plotWidth,
  left,
  buildingWidth,
  floors,
  floorHeight,
  ground,
  land,
}: {
  plotLeft: number
  plotWidth: number
  left: number
  buildingWidth: number
  floors: number
  floorHeight: number
  ground: number
  land: number
}) {
  const top = ground - floors * floorHeight
  return (
    <g fill="none" stroke="#161412" strokeWidth="1.4">
      <line x1={plotLeft} y1={ground} x2={plotLeft + plotWidth} y2={ground} stroke="#8F9B78" strokeWidth="4" />
      {land > 8 && (
        <path d={`M${plotLeft + 28} ${ground} l18 -48 18 48`} fill="#6E7C5A" stroke="none" />
      )}
      {Array.from({ length: floors }, (_, index) => {
        const y = ground - (index + 1) * floorHeight
        return <rect key={index} x={left} y={y} width={buildingWidth} height={floorHeight} fill={index % 2 ? '#E7E0D4' : '#EFEAE3'} />
      })}
      <path d={`M${left - 18} ${top} L${left + buildingWidth / 2} ${top - 48} L${left + buildingWidth + 18} ${top}`} fill="#7E1E24" stroke="#7A1218" />
      {Array.from({ length: floors }, (_, level) =>
        Array.from({ length: 3 }, (_, bay) => (
          <rect
            key={`${level}-${bay}`}
            x={left + 18 + bay * ((buildingWidth - 36) / 3)}
            y={ground - (level + 1) * floorHeight + 16}
            width={Math.max(16, (buildingWidth - 70) / 3)}
            height={floorHeight * 0.42}
          />
        )),
      )}
    </g>
  )
}

function Plan({
  plotLeft,
  plotWidth,
  left,
  buildingWidth,
}: {
  plotLeft: number
  plotWidth: number
  left: number
  buildingWidth: number
  floors: number
}) {
  const depth = Math.min(180, plotWidth * 0.55)
  const plotTop = 150
  return (
    <g fill="none" stroke="#161412" strokeWidth="1.4">
      <rect x={plotLeft} y={plotTop} width={plotWidth} height={depth + 40} fill="#F7F4EE" />
      <rect x={left} y={plotTop + 28} width={buildingWidth} height={depth * 0.72} fill="#E7E0D4" />
      <line x1={left + buildingWidth * 0.42} y1={plotTop + 28} x2={left + buildingWidth * 0.42} y2={plotTop + 28 + depth * 0.72} />
      <line x1={left} y1={plotTop + 28 + depth * 0.4} x2={left + buildingWidth} y2={plotTop + 28 + depth * 0.4} />
      <text x={plotLeft} y={plotTop - 10} fill="#5E5852" fontFamily="Manrope, sans-serif" fontSize="11" letterSpacing="2">
        SCHEMATIC PLAN
      </text>
    </g>
  )
}

function Section({
  left,
  buildingWidth,
  floors,
  floorHeight,
  ground,
}: {
  left: number
  buildingWidth: number
  floors: number
  floorHeight: number
  ground: number
}) {
  return (
    <g fill="none" stroke="#161412" strokeWidth="1.4">
      <line x1="80" y1={ground} x2="560" y2={ground} />
      {Array.from({ length: floors }, (_, index) => (
        <rect
          key={index}
          x={left}
          y={ground - (index + 1) * floorHeight}
          width={buildingWidth}
          height={floorHeight}
          fill="#EFEAE3"
        />
      ))}
      <line x1={left + buildingWidth + 36} y1={ground - floors * floorHeight - 20} x2={left + buildingWidth + 36} y2={ground} stroke="#BC0000" />
      <text x={left + buildingWidth + 46} y={120} fill="#7A1218" fontFamily="Manrope, sans-serif" fontSize="11" letterSpacing="2">
        {floors} {floors === 1 ? 'LEVEL' : 'LEVELS'}
      </text>
    </g>
  )
}
