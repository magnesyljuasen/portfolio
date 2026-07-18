import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import type { Project } from './data'

type Props = {
  projects: Project[]
  active: string | null
  onActive: (id: string | null) => void
  onOpen: (project: Project) => void
}

function DotField() {
  const dots = Array.from({ length: 110 }, (_, i) => {
    const x = (i * 37 + (i % 7) * 11) % 100
    const y = (i * 61 + Math.floor(i / 5) * 7) % 100
    const opacity = 0.1 + ((i * 13) % 25) / 100
    return { x, y, opacity, size: i % 9 === 0 ? 2.3 : 1.2 }
  })

  return (
    <svg className="atlas-dots" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {dots.map((dot, i) => (
        <circle key={i} cx={dot.x} cy={dot.y} r={dot.size / 4} fill="#355744" opacity={dot.opacity} />
      ))}
      <path d="M-5 68 C 12 53, 18 25, 39 36 S 65 84, 108 48" fill="none" stroke="#355744" strokeOpacity=".12" strokeWidth=".25" strokeDasharray="1 1.5" />
      <path d="M5 20 C 27 5, 44 27, 58 17 S 83 7, 105 25" fill="none" stroke="#b85c3d" strokeOpacity=".12" strokeWidth=".25" />
    </svg>
  )
}

export default function ProjectAtlas({ projects, active, onActive, onOpen }: Props) {
  const atlasRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const reset = () => setTilt({ x: 0, y: 0 })
    window.addEventListener('blur', reset)
    return () => window.removeEventListener('blur', reset)
  }, [])

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    setTilt({
      x: ((event.clientY - rect.top) / rect.height - 0.5) * -2.2,
      y: ((event.clientX - rect.left) / rect.width - 0.5) * 2.2,
    })
  }

  return (
    <div
      ref={atlasRef}
      className="project-atlas"
      onPointerMove={handleMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
    >
      <DotField />
      <div className="atlas-glow" />
      <div className="atlas-label atlas-label-top">PROJECT ATLAS / 01—05</div>
      <div className="atlas-label atlas-label-bottom">ENERGY · DATA · DIGITAL</div>

      {projects.map((project) => {
        const isActive = active === project.id
        return (
          <button
            key={project.id}
            className={`project-node ${isActive ? 'is-active' : ''}`}
            style={{ left: `${project.position.x}%`, top: `${project.position.y}%`, '--node': project.color } as React.CSSProperties}
            onMouseEnter={() => onActive(project.id)}
            onMouseLeave={() => onActive(null)}
            onFocus={() => onActive(project.id)}
            onBlur={() => onActive(null)}
            onClick={() => onOpen(project)}
            aria-label={`Åpne ${project.title}`}
          >
            <span className="node-pulse" />
            <span className="node-core" />
            <span className="node-number">{project.number}</span>
            <span className="node-title">{project.title}</span>

            <span className="node-card">
              <span className="node-card-top">
                <span>{project.eyebrow}</span>
                <ArrowUpRight size={15} />
              </span>
              <strong>{project.title}</strong>
              <span className="node-description">{project.description}</span>
              <span className="node-meta"><MapPin size={13} /> {project.location} · {project.year}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
