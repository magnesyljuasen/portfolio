import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-50m.json'
import * as THREE from 'three'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Group, OrthographicCamera } from 'three'
import { projectGroups, type Project } from './data'

type Props = {
  projects: Project[]
  active: string
  onActive: (id: string) => void
  onOpen: (project: Project) => void
  onReady: () => void
}

const digitalPositions: [number, number][] = [
  [2.35, -1.2], [3.1, -1.45], [2.2, -2.15], [3.15, -2.35],
  [2.7, -.85], [3.55, -1.9], [1.85, -1.65], [2.65, -2.65],
]

const geographicOffsets: [number, number][] = [
  [0, 0], [.13, .02], [-.12, .05], [.16, -.12], [-.16, -.12], [.28, .1],
  [-.28, .12], [.24, -.24], [-.24, -.22], [0, .28], [0, -.3], [.36, -.05],
]

function projectPoint(project: Project, digitalIndex: number, geographicIndex: number): [number, number] {
  if (project.coordinates) {
    const [lon, lat] = project.coordinates
    const [offsetX, offsetY] = geographicOffsets[geographicIndex % geographicOffsets.length]
    return [(lon - 13) * 0.32 + offsetX, (lat - 64.5) * 0.55 + offsetY]
  }
  return digitalPositions[digitalIndex % digitalPositions.length]
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
    island.moveTo(2.05, -.7)
    island.bezierCurveTo(2.55, -.95, 3.35, -.75, 3.7, -1.2)
    island.bezierCurveTo(4.0, -1.65, 3.75, -2.45, 3.3, -2.8)
    island.bezierCurveTo(2.8, -3.1, 1.95, -2.9, 1.65, -2.35)
    island.bezierCurveTo(1.35, -1.8, 1.5, -1.05, 2.05, -.7)
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
      <Html position={[2.7, -.48, .46]} center className="island-label">
        <span>digitalt</span>
      </Html>
    </group>
  )
}

function Marker({ project, digitalIndex, geographicIndex, active, onActive, onOpen }: { project: Project; digitalIndex: number; geographicIndex: number; active: boolean; onActive: () => void; onOpen: () => void }) {
  const [x, y] = projectPoint(project, digitalIndex, geographicIndex)
  return (
    <group position={[x, y, .52]}>
      <mesh
        onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = 'pointer'; onActive() }}
        onPointerOut={() => { document.body.style.cursor = '' }}
        onClick={(event) => { event.stopPropagation(); onOpen() }}
      >
        <sphereGeometry args={[.2, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[active ? .12 : .085, 20, 20]} />
        <meshBasicMaterial color={projectGroups[project.group].color} />
      </mesh>
    </group>
  )
}

function MapScene({ projects, active, onActive, onOpen }: Props) {
  const group = useRef<Group>(null)
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * .012, .04)
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * .018, .04)
  })

  return (
    <>
      <ambientLight intensity={2.1} />
      <directionalLight position={[-5, 8, 12]} intensity={2.7} castShadow />
      <group ref={group} position={[-.6, 0, 0]}>
        <NorwayGeometry />
        <DigitalIsland />
        {projects.map((project) => (
          <Marker
            key={project.id}
            project={project}
            digitalIndex={projects.filter((item) => item.kind === 'digital').findIndex((item) => item.id === project.id)}
            geographicIndex={projects.filter((item) => item.kind === 'geographic').findIndex((item) => item.id === project.id)}
            active={project.id === active}
            onActive={() => onActive(project.id)}
            onOpen={() => onOpen(project)}
          />
        ))}
      </group>
    </>
  )
}

function ReadySignal({ onReady }: { onReady: () => void }) {
  const sent = useRef(false)
  useFrame(() => {
    if (sent.current) return
    sent.current = true
    onReady()
  })
  return null
}

function ResponsiveCamera({ zoom, offsetY = 0 }: { zoom: number; offsetY?: number }) {
  const camera = useThree((state) => state.camera) as OrthographicCamera
  useEffect(() => {
    camera.zoom = zoom
    camera.position.y = offsetY
    camera.updateProjectionMatrix()
  }, [camera, offsetY, zoom])
  return null
}

export default function ProjectAtlas(props: Props) {
  const [viewportWidth, setViewportWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1280)
  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])
  const isCompact = viewportWidth <= 960
  const desktopMapWidth = viewportWidth - Math.max(380, viewportWidth * .37)
  const mapZoom = isCompact ? Math.min(64, viewportWidth / 10.5) : Math.min(58, desktopMapWidth / 10.5)
  const activeProject = props.projects.find((project) => project.id === props.active) ?? props.projects[0]
  return (
    <div className="three-atlas">
      <Canvas
        dpr={[1, 1.75]}
        orthographic
        camera={{ position: [0, 0, 20], zoom: mapZoom, near: .1, far: 100 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <MapScene {...props} />
        <ResponsiveCamera zoom={mapZoom} offsetY={isCompact ? -2 : 0} />
        <ReadySignal onReady={props.onReady} />
      </Canvas>
      <button className="fixed-map-card" onClick={() => props.onOpen(activeProject)}>
        <strong>{activeProject.title}</strong>
        <span aria-hidden="true">↗</span>
      </button>
    </div>
  )
}
