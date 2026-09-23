import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Grid } from '@react-three/drei'
import * as THREE from 'three'
import { smoothstep } from '../../lib/math'

const F_H = 0.26
const GF_H = 2.6
const SLAB_H = 0.16
const UF_H = 2.25
const GF_BOTTOM = F_H
const SLAB_BOTTOM = GF_BOTTOM + GF_H
const UF_BOTTOM = SLAB_BOTTOM + SLAB_H
const ROOF_BOTTOM = UF_BOTTOM + UF_H

interface Part {
  args: [number, number, number]
  position: [number, number, number]
  bottom: number
  height: number
  from: number
  to: number
  color: string
  roughness: number
}

function walls(bottom: number, height: number, from: number, to: number, color: string): Part[] {
  const y = bottom + height / 2
  return [
    { args: [0.16, height, 5.2], position: [-3.52, y, 0], bottom, height, from, to, color, roughness: 0.92 },
    { args: [0.16, height, 5.2], position: [3.52, y, 0], bottom, height, from, to, color, roughness: 0.92 },
    { args: [7.2, height, 0.16], position: [0, y, 2.52], bottom, height, from, to, color, roughness: 0.92 },
    { args: [7.2, height, 0.16], position: [0, y, -2.52], bottom, height, from, to, color, roughness: 0.92 },
  ]
}

const parts: Part[] = [
  {
    args: [7.9, F_H, 5.8],
    position: [0, F_H / 2, 0],
    bottom: 0,
    height: F_H,
    from: 0.1,
    to: 0.26,
    color: '#A39E96',
    roughness: 1,
  },
  ...walls(GF_BOTTOM, GF_H, 0.22, 0.46, '#E4DCD0'),
  {
    args: [7.35, SLAB_H, 5.35],
    position: [0, SLAB_BOTTOM + SLAB_H / 2, 0],
    bottom: SLAB_BOTTOM,
    height: SLAB_H,
    from: 0.4,
    to: 0.55,
    color: '#D2CBC0',
    roughness: 0.88,
  },
  ...walls(UF_BOTTOM, UF_H, 0.48, 0.66, '#E7E0D4'),
]

const openings: Part[] = [
  { args: [0.92, 2.1, 0.08], position: [0, 0, 2.68], bottom: GF_BOTTOM, height: 2.1, from: 0.62, to: 0.78, color: '#5C332C', roughness: 0.8 },
  { args: [0.85, 1.05, 0.05], position: [-1.75, 0, 2.66], bottom: GF_BOTTOM + 0.85, height: 1.05, from: 0.64, to: 0.8, color: '#243038', roughness: 0.18 },
  { args: [0.85, 1.05, 0.05], position: [1.75, 0, 2.66], bottom: GF_BOTTOM + 0.85, height: 1.05, from: 0.64, to: 0.8, color: '#243038', roughness: 0.18 },
  { args: [0.78, 0.95, 0.05], position: [-1.8, 0, 2.66], bottom: UF_BOTTOM + 0.68, height: 0.95, from: 0.66, to: 0.82, color: '#243038', roughness: 0.18 },
  { args: [0.78, 0.95, 0.05], position: [0, 0, 2.66], bottom: UF_BOTTOM + 0.68, height: 0.95, from: 0.66, to: 0.82, color: '#243038', roughness: 0.18 },
  { args: [0.78, 0.95, 0.05], position: [1.8, 0, 2.66], bottom: UF_BOTTOM + 0.68, height: 0.95, from: 0.66, to: 0.82, color: '#243038', roughness: 0.18 },
  { args: [0.05, 1, 0.7], position: [-3.66, 0, -1], bottom: GF_BOTTOM + 0.9, height: 1, from: 0.68, to: 0.84, color: '#243038', roughness: 0.18 },
  { args: [0.05, 1, 0.7], position: [3.66, 0, 1.05], bottom: GF_BOTTOM + 0.9, height: 1, from: 0.68, to: 0.84, color: '#243038', roughness: 0.18 },
  { args: [0.05, 0.9, 0.66], position: [-3.66, 0, 1.15], bottom: UF_BOTTOM + 0.68, height: 0.9, from: 0.68, to: 0.84, color: '#243038', roughness: 0.18 },
  { args: [0.05, 0.9, 0.66], position: [3.66, 0, -0.7], bottom: UF_BOTTOM + 0.68, height: 0.9, from: 0.68, to: 0.84, color: '#243038', roughness: 0.18 },
]

const treeSpots: [number, number, number][] = [
  [-5.5, 0, -2.1],
  [5.7, 0, -1.5],
  [-4.9, 0, 4.5],
  [5.3, 0, 4.7],
]

const cameraKeys = [
  { t: 0, p: new THREE.Vector3(0.15, 16.8, 0.05), l: new THREE.Vector3(0.15, 0, 0) },
  { t: 0.32, p: new THREE.Vector3(9.4, 8.4, 9.4), l: new THREE.Vector3(0.35, 1.8, 0) },
  { t: 0.68, p: new THREE.Vector3(0.2, 3.35, 13.6), l: new THREE.Vector3(0.15, 2.6, 0) },
  { t: 1, p: new THREE.Vector3(7.8, 3.8, 11.2), l: new THREE.Vector3(0.1, 2.35, 0) },
]

function sampleCamera(t: number, position: THREE.Vector3, look: THREE.Vector3) {
  let start = cameraKeys[0]
  let end = cameraKeys[cameraKeys.length - 1]
  for (let index = 0; index < cameraKeys.length - 1; index += 1) {
    if (t >= cameraKeys[index].t && t <= cameraKeys[index + 1].t) {
      start = cameraKeys[index]
      end = cameraKeys[index + 1]
      break
    }
  }
  const span = end.t - start.t || 1
  const amount = Math.min(1, Math.max(0, (t - start.t) / span))
  const eased = amount * amount * (3 - 2 * amount)
  position.lerpVectors(start.p, end.p, eased)
  look.lerpVectors(start.l, end.l, eased)
}

function rise(mesh: THREE.Mesh | null, from: number, to: number, bottom: number, height: number, t: number) {
  if (!mesh) return
  const amount = smoothstep(from, to, t)
  const scale = Math.max(0.001, amount)
  mesh.scale.y = scale
  mesh.position.y = bottom + (height * scale) / 2
  const material = mesh.material
  if (material instanceof THREE.MeshStandardMaterial) {
    material.opacity = amount
    material.depthWrite = amount > 0.9
  }
}

function Model({ progressRef, placeEnd }: { progressRef: RefObject<number>; placeEnd: boolean }) {
  const smooth = useRef(0)
  const position = useRef(new THREE.Vector3())
  const look = useRef(new THREE.Vector3())
  const anchor = useRef(new THREE.Vector3())
  const blocks = useRef<(THREE.Mesh | null)[]>([])
  const openingRefs = useRef<(THREE.Mesh | null)[]>([])
  const roofRef = useRef<THREE.Mesh>(null)
  const planRef = useRef<THREE.LineSegments>(null)
  const soilRef = useRef<THREE.Mesh>(null)
  const lawnRef = useRef<THREE.Mesh>(null)
  const pathRef = useRef<THREE.Mesh>(null)
  const trees = useRef<(THREE.Group | null)[]>([])
  const gridRef = useRef<THREE.Mesh>(null)

  const groundFade = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const context = canvas.getContext('2d')
    if (!context) return null
    const fade = context.createRadialGradient(64, 64, 20, 64, 64, 64)
    fade.addColorStop(0, '#ffffff')
    fade.addColorStop(0.62, '#ffffff')
    fade.addColorStop(1, '#000000')
    context.fillStyle = fade
    context.fillRect(0, 0, 128, 128)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.NoColorSpace
    return texture
  }, [])

  const roofGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-4.15, 0)
    shape.lineTo(0, 1.62)
    shape.lineTo(4.15, 0)
    shape.closePath()
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 6.15, bevelEnabled: false })
    geometry.translate(0, 0, -3.075)
    return geometry
  }, [])

  const planGeo = useMemo(() => {
    const y = 0.04
    const w = 3.6
    const d = 2.6
    const points = new Float32Array([
      -w, y, -d, w, y, -d,
      w, y, -d, w, y, d,
      w, y, d, -w, y, d,
      -w, y, d, -w, y, -d,
      -0.35, y, -d, -0.35, y, d,
      -w, y, 0.15, w, y, 0.15,
    ])
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(points, 3))
    return geometry
  }, [])

  useEffect(() => {
    return () => groundFade?.dispose()
  }, [groundFade])

  useDisposeGeometry(roofGeo, planGeo)

  useFrame((state, delta) => {
    const target = progressRef.current ?? 0
    smooth.current = THREE.MathUtils.damp(smooth.current, target, 2.8, delta)
    const t = smooth.current

    parts.forEach((part, index) => {
      rise(blocks.current[index], part.from, part.to, part.bottom, part.height, t)
    })
    openings.forEach((part, index) => {
      rise(openingRefs.current[index], part.from, part.to, part.bottom, part.height, t)
    })

    const roofAmount = smoothstep(0.56, 0.74, t)
    if (roofRef.current) {
      roofRef.current.scale.y = Math.max(0.001, roofAmount)
      roofRef.current.position.y = ROOF_BOTTOM
      const material = roofRef.current.material
      if (material instanceof THREE.MeshStandardMaterial) {
        material.opacity = roofAmount
        material.depthWrite = roofAmount > 0.9
      }
    }

    const planMaterial = planRef.current?.material
    if (planMaterial instanceof THREE.LineBasicMaterial) {
      planMaterial.opacity = smoothstep(0.08, 0.22, t) * (1 - smoothstep(0.72, 0.94, t) * 0.72)
    }

    const soilMaterial = soilRef.current?.material
    if (soilMaterial instanceof THREE.MeshStandardMaterial) {
      soilMaterial.opacity = smoothstep(0.04, 0.18, t)
    }
    const lawnMaterial = lawnRef.current?.material
    if (lawnMaterial instanceof THREE.MeshStandardMaterial) {
      lawnMaterial.opacity = smoothstep(0.78, 1, t)
    }
    const pathMaterial = pathRef.current?.material
    if (pathMaterial instanceof THREE.MeshStandardMaterial) {
      pathMaterial.opacity = smoothstep(0.8, 0.96, t)
    }

    trees.current.forEach((tree, index) => {
      if (!tree) return
      const scale = Math.max(0.001, smoothstep(0.8, 1, t)) * (0.82 + (index % 3) * 0.12)
      tree.scale.setScalar(scale)
    })

    const gridMaterial = gridRef.current?.material
    if (gridMaterial && !Array.isArray(gridMaterial)) {
      gridMaterial.transparent = true
      gridMaterial.opacity = 0.85 - smoothstep(0.2, 0.85, t) * 0.5
    }

    sampleCamera(t, position.current, look.current)
    const camera = state.camera
    const aspect = state.size.width / Math.max(state.size.height, 1)
    const narrow = aspect < 1.15
    if (camera instanceof THREE.PerspectiveCamera) {
      const fov = narrow ? 50 : 32
      if (camera.fov !== fov) {
        camera.fov = fov
        camera.updateProjectionMatrix()
      }
    }
    const fit = narrow ? THREE.MathUtils.clamp(1.2 / aspect, 1, 2.7) : 1.42
    const fitted = position.current.clone().sub(look.current).multiplyScalar(fit)
    if (placeEnd && fitted.lengthSq() > 0.001) {
      look.current.y += 0.9
      if (!narrow) {
        const forward = fitted.clone().normalize()
        const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), forward)
        if (right.lengthSq() > 0.04) {
          look.current.addScaledVector(right.normalize(), -2.4)
        } else {
          look.current.x -= 1.6
        }
      }
    }
    camera.position.copy(look.current).add(fitted)
    camera.lookAt(look.current)
    anchor.current.set(0.9, 1.5, 0)
    anchor.current.project(camera)
    const host = state.gl.domElement.closest<HTMLElement>('.hero-visual')
    if (host) {
      const x = (anchor.current.x * 0.5 + 0.5) * 100
      const y = (-anchor.current.y * 0.5 + 0.5) * 100
      host.style.setProperty('--model-x', `${x}%`)
      host.style.setProperty('--model-y', `${y}%`)
    }
  })

  return (
    <>
      <hemisphereLight args={['#F7F4EE', '#D9D0C4', 0.8]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[8, 12, 6]} intensity={1.25} color="#fff6ee" />
      <Grid
        ref={gridRef}
        args={[36, 36]}
        position={[0, 0.008, 0]}
        cellSize={0.55}
        cellThickness={0.55}
        cellColor="#D9D2C8"
        sectionSize={2.75}
        sectionThickness={1}
        sectionColor="#C9C1B6"
        fadeDistance={18}
        fadeStrength={2}
        infiniteGrid
      />
      <group position={[0.9, 0, 0]}>
        <mesh ref={soilRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0.4]}>
          <planeGeometry args={[28, 20]} />
          <meshStandardMaterial color="#E7E0D6" transparent opacity={0} roughness={1} alphaMap={groundFade ?? undefined} />
        </mesh>
        <mesh ref={lawnRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0.2]}>
          <planeGeometry args={[18, 13]} />
          <meshStandardMaterial color="#8F9B78" transparent opacity={0} roughness={1} alphaMap={groundFade ?? undefined} />
        </mesh>
        <mesh ref={pathRef} position={[0, 0.03, 4.35]}>
          <boxGeometry args={[1.15, 0.04, 3.3]} />
          <meshStandardMaterial color="#D9D2C6" transparent opacity={0} roughness={1} />
        </mesh>
        <lineSegments ref={planRef} geometry={planGeo}>
          <lineBasicMaterial color="#7A1218" transparent opacity={0} />
        </lineSegments>
        {parts.map((part, index) => (
          <mesh
            key={`part-${index}`}
            ref={(node) => {
              blocks.current[index] = node
            }}
            position={part.position}
            scale={[1, 0.001, 1]}
          >
            <boxGeometry args={part.args} />
            <meshStandardMaterial color={part.color} transparent opacity={0} roughness={part.roughness} metalness={0} />
          </mesh>
        ))}
        {openings.map((part, index) => (
          <mesh
            key={`opening-${index}`}
            ref={(node) => {
              openingRefs.current[index] = node
            }}
            position={part.position}
            scale={[1, 0.001, 1]}
          >
            <boxGeometry args={part.args} />
            <meshStandardMaterial color={part.color} transparent opacity={0} roughness={part.roughness} metalness={0.04} />
          </mesh>
        ))}
        <mesh ref={roofRef} geometry={roofGeo} position={[0, ROOF_BOTTOM, 0]} scale={[1, 0.001, 1]}>
          <meshStandardMaterial color="#7E1E24" transparent opacity={0} roughness={0.78} metalness={0} />
        </mesh>
        {treeSpots.map((spot, index) => (
          <group
            key={`tree-${index}`}
            ref={(node) => {
              trees.current[index] = node
            }}
            position={spot}
            scale={0.001}
          >
            <mesh position={[0, 0.38, 0]}>
              <cylinderGeometry args={[0.07, 0.1, 0.76, 6]} />
              <meshStandardMaterial color="#6A5144" roughness={1} />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <coneGeometry args={[0.62, 1.28, 7]} />
              <meshStandardMaterial color="#6E7C5A" roughness={1} />
            </mesh>
          </group>
        ))}
      </group>
    </>
  )
}

function useDisposeGeometry(roofGeo: THREE.BufferGeometry, planGeo: THREE.BufferGeometry) {
  useEffect(() => {
    return () => {
      roofGeo.dispose()
      planGeo.dispose()
    }
  }, [planGeo, roofGeo])
}

export default function ResidenceScene({
  progressRef,
  active,
  pixelRatio = 1.5,
  placeEnd = false,
}: {
  progressRef: RefObject<number>
  active: boolean
  pixelRatio?: number
  placeEnd?: boolean
}) {
  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, pixelRatio]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0.15, 16.8, 0.05], fov: 32, near: 0.1, far: 140 }}
      onCreated={({ gl, camera }) => {
        gl.toneMapping = THREE.NoToneMapping
        gl.setClearColor(0x000000, 0)
        camera.lookAt(0.15, 0, 0)
      }}
    >
      <Model progressRef={progressRef} placeEnd={placeEnd} />
    </Canvas>
  )
}
