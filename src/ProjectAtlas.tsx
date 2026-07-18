import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-50m.json'
import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import type { Group } from 'three'
import type { Project } from './data'

type Props = {
  projects: Project[]
  active: string
  onActive: (id: string) => void
  onOpen: (project: Project) => void
}

const digitalPositions: Record<string, [number, number]> = {
  floorplanner: [-4.75, 1.15],
  energyanalysis: [-3.95, -.45],
  vmspillet: [-5.05, -1.75],
}

function projectPoint(project: Project): [number, number] {
  if (project.coordinates) {
    const [lon, lat] = project.coordinates
    return [(lon - 13) * 0.32, (lat - 64.5) * 0.55]
  }
  return digitalPositions[project.id] ?? [6.3, 0]
}

function shapeFromRing(ring: number[][]) {
  const shape = new THREE.Shape()
  ring.forEach(([lon, lat], index) => {
    const x = (lon - 13) * 0.32
    const y = (lat - 64.5) * 0.55
    if (index === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  })
  shape.closePath()
  return shape
}

function NorwayGeometry() {
  const shapes = useMemo(() => {
    const topology = world as unknown as { objects: { countries: never } }
    const collection = feature(topology as never, topology.objects.countries) as unknown as {
      features: Array<{ id: string | number; geometry: { type: string; coordinates: number[][][][] | number[][][] } }>
    }
    const norway = collection.features.find((country) => String(country.id) === '578')
    if (!norway) return []
    const polygons = norway.geometry.type === 'MultiPolygon'
      ? norway.geometry.coordinates as number[][][][]
      : [norway.geometry.coordinates as number[][][]]

    return polygons
      .filter((polygon) => {
        const ring = polygon[0]
        const averageLatitude = ring.reduce((sum, point) => sum + point[1], 0) / ring.length
        const averageLongitude = ring.reduce((sum, point) => sum + point[0], 0) / ring.length
        return averageLatitude < 72 && averageLongitude > 0
      })
      .map((polygon) => shapeFromRing(polygon[0]))
  }, [])

  return (
    <group>
      {shapes.map((shape, index) => (
        <group key={index}>
          <mesh castShadow receiveShadow>
            <extrudeGeometry args={[shape, { depth: 0.32, bevelEnabled: true, bevelSize: 0.035, bevelThickness: 0.035, bevelSegments: 2 }]} />
            <meshStandardMaterial color="#e5dece" roughness={.95} metalness={0} />
          </mesh>
          <lineSegments position={[0, 0, .36]}>
            <edgesGeometry args={[new THREE.ShapeGeometry(shape)]} />
            <lineBasicMaterial color="#283028" transparent opacity={.7} />
          </lineSegments>
        </group>
      ))}
    </group>
  )
}

function DigitalIsland() {
  const shape = useMemo(() => {
    const island = new THREE.Shape()
    island.moveTo(-5.55, 1.8)
    island.bezierCurveTo(-5.0, 2.35, -3.75, 2.2, -3.35, 1.4)
    island.bezierCurveTo(-2.95, .45, -3.15, -.85, -3.8, -1.55)
    island.bezierCurveTo(-4.35, -2.2, -5.45, -2.45, -5.95, -1.65)
    island.bezierCurveTo(-6.45, -.8, -6.25, .05, -5.95, .65)
    island.bezierCurveTo(-5.75, 1.05, -5.95, 1.45, -5.55, 1.8)
    return island
  }, [])

  return (
    <group>
      <mesh receiveShadow castShadow>
        <extrudeGeometry args={[shape, { depth: .24, bevelEnabled: true, bevelSize: .04, bevelThickness: .04, bevelSegments: 2 }]} />
        <meshStandardMaterial color="#eadfca" roughness={1} />
      </mesh>
      <lineSegments position={[0, 0, .29]}>
        <edgesGeometry args={[new THREE.ShapeGeometry(shape)]} />
        <lineBasicMaterial color="#a4563f" transparent opacity={.8} />
      </lineSegments>
      <Html position={[-4.65, -.1, .46]} center distanceFactor={13} className="island-label">
        <span>digitalt</span><small>ingen fast adresse</small>
      </Html>
    </group>
  )
}

function Marker({ project, active, onActive, onOpen }: { project: Project; active: boolean; onActive: () => void; onOpen: () => void }) {
  const [x, y] = projectPoint(project)
  return (
    <group position={[x, y, .52]}>
      <mesh
        onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer'; onActive() }}
        onPointerOut={() => { document.body.style.cursor = '' }}
        onClick={(event) => { event.stopPropagation(); onOpen() }}
      >
        <sphereGeometry args={[active ? .16 : .12, 20, 20]} />
        <meshBasicMaterial color={project.color} />
      </mesh>
      <mesh position={[0, 0, -.02]}>
        <ringGeometry args={[active ? .23 : .19, active ? .25 : .205, 32]} />
        <meshBasicMaterial color="#283028" transparent opacity={active ? .8 : .35} side={THREE.DoubleSide} />
      </mesh>
      <Html position={[.18, .2, .2]} distanceFactor={12} className={`three-label ${active ? 'is-active' : ''}`}>
        <span className="three-label-number">{project.number}</span>
        {active && (
          <button onClick={onOpen}>
            <small>{project.eyebrow}</small>
            <strong>{project.title}</strong>
            <span>{project.description}</span>
            <em>Se prosjekt →</em>
          </button>
        )}
      </Html>
    </group>
  )
}

function MapScene({ projects, active, onActive, onOpen }: Props) {
  const group = useRef<Group>(null)
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, .12 + state.pointer.y * .025, .04)
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, -.08 + state.pointer.x * .04, .04)
  })

  return (
    <>
      <ambientLight intensity={2.1} />
      <directionalLight position={[-5, 8, 12]} intensity={2.7} castShadow />
      <group ref={group} position={[.15, 0, 0]}>
        <NorwayGeometry />
        <DigitalIsland />
        {projects.map((project) => (
          <Marker key={project.id} project={project} active={project.id === active} onActive={() => onActive(project.id)} onOpen={() => onOpen(project)} />
        ))}
      </group>
    </>
  )
}

export default function ProjectAtlas(props: Props) {
  const isCompact = typeof window !== 'undefined' && window.innerWidth <= 820
  return (
    <div className="three-atlas">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: isCompact ? [-.3, 0, 25] : [-.2, 0, 16.5], fov: isCompact ? 44 : 42 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <MapScene {...props} />
      </Canvas>
      <div className="map-note"><span>hold over et prosjekt</span><i>↘</i></div>
      <div className="map-legend"><span><i /> sted</span><span><i /> digital øy</span></div>
    </div>
  )
}
