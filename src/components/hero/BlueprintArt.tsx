import { useEffect, useRef, type RefObject } from 'react'
import { smoothstep } from '../../lib/math'

function applyProgress(svg: SVGSVGElement, progress: number) {
  const opacity = (id: string, value: number) => {
    const node = svg.querySelector<SVGGElement>(`#${id}`)
    if (node) node.style.opacity = String(value)
  }
  const draw = (id: string, value: number) => {
    const node = svg.querySelector<SVGGeometryElement>(`#${id}`)
    if (node) node.style.strokeDashoffset = String(1 - value)
  }

  opacity('bp-grid', 1 - smoothstep(0.12, 0.62, progress) * 0.7)
  draw('bp-plan', smoothstep(0.05, 0.24, progress))
  draw('bp-walls', smoothstep(0.2, 0.5, progress))
  draw('bp-roof', smoothstep(0.46, 0.68, progress))
  opacity('bp-openings', smoothstep(0.6, 0.78, progress))
  opacity('bp-fills', smoothstep(0.68, 0.9, progress))
  opacity('bp-land', smoothstep(0.8, 1, progress))
}

export function BlueprintArt({
  progressRef,
  reduced = false,
  align = 'end',
}: {
  progressRef?: RefObject<number>
  reduced?: boolean
  align?: 'center' | 'end'
}) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    if (reduced) {
      applyProgress(svg, 1)
      return
    }
    let frame = 0
    const tick = () => {
      applyProgress(svg, progressRef?.current ?? 0)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [progressRef, reduced])

  const stroke = {
    fill: 'none',
    stroke: '#161412',
    strokeWidth: 1.6,
    pathLength: 1,
    style: { strokeDasharray: 1, strokeDashoffset: reduced ? 0 : 1 },
  } as const

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 860 980"
      role="img"
      aria-label="Architectural study of a residence, from plan lines to a finished elevation"
      className="h-full w-full"
      preserveAspectRatio={align === 'center' ? 'xMidYMid meet' : 'xMaxYMid meet'}
    >
      <g id="bp-grid">
        {Array.from({ length: 11 }, (_, index) => (
          <line
            key={`v-${index}`}
            x1={48 + index * 76}
            y1={36}
            x2={48 + index * 76}
            y2={944}
            stroke="#161412"
            strokeOpacity="0.08"
          />
        ))}
        {Array.from({ length: 12 }, (_, index) => (
          <line
            key={`h-${index}`}
            x1={36}
            y1={48 + index * 78}
            x2={824}
            y2={48 + index * 78}
            stroke="#161412"
            strokeOpacity="0.08"
          />
        ))}
        <text x="48" y="78" fill="#5E5852" fontFamily="Manrope, sans-serif" fontSize="13" letterSpacing="3">
          J HOMES  ·  RESIDENCE STUDY
        </text>
      </g>

      <g id="bp-plan-wrap">
        <path
          id="bp-plan"
          d="M80 120 H250 V230 H80 Z M140 120 V230 M80 175 H250"
          {...stroke}
        />
        <text x="80" y="108" fill="#5E5852" fontFamily="Manrope, sans-serif" fontSize="11" letterSpacing="2">
          PLAN
        </text>
      </g>

      <g id="bp-fills" style={{ opacity: reduced ? 1 : 0 }}>
        <rect x="250" y="500" width="360" height="250" fill="#E4DCD0" />
        <rect x="270" y="300" width="320" height="200" fill="#E7E0D4" />
        <path d="M220 300 L430 145 L640 300 Z" fill="#7E1E24" />
        <rect x="392" y="610" width="76" height="140" fill="#5C332C" />
      </g>

      <g id="bp-land" style={{ opacity: reduced ? 1 : 0 }}>
        <line x1="90" y1="750" x2="770" y2="750" stroke="#8F9B78" strokeWidth="8" />
        <path d="M120 750 L120 690 L150 640 L180 750 Z" fill="#6E7C5A" />
        <path d="M700 750 L700 700 L734 650 L768 750 Z" fill="#6E7C5A" />
        <rect x="116" y="730" width="8" height="20" fill="#6A5144" />
        <rect x="728" y="732" width="8" height="18" fill="#6A5144" />
      </g>

      <path id="bp-walls" d="M250 750 V500 H610 V750 M270 500 V300 H590 V500" {...stroke} />
      <path id="bp-roof" d="M220 300 L430 145 L640 300" {...stroke} stroke="#7A1218" />

      <g id="bp-openings" style={{ opacity: reduced ? 1 : 0 }}>
        <rect x="392" y="610" width="76" height="140" fill="none" stroke="#161412" strokeWidth="1.6" />
        <rect x="290" y="560" width="58" height="78" fill="none" stroke="#161412" strokeWidth="1.6" />
        <rect x="512" y="560" width="58" height="78" fill="none" stroke="#161412" strokeWidth="1.6" />
        <rect x="310" y="350" width="52" height="70" fill="none" stroke="#161412" strokeWidth="1.6" />
        <rect x="404" y="350" width="52" height="70" fill="none" stroke="#161412" strokeWidth="1.6" />
        <rect x="498" y="350" width="52" height="70" fill="none" stroke="#161412" strokeWidth="1.6" />
      </g>

      <g fill="#5E5852" fontFamily="Manrope, sans-serif" fontSize="12" letterSpacing="2">
        <text x="250" y="790">
          0.00  BLUEPRINT
        </text>
        <text x="520" y="790">
          1.00  RESIDENCE
        </text>
      </g>
    </svg>
  )
}
