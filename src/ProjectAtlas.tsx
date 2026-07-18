import { ArrowUpRight, MapPin } from 'lucide-react'
import type { Project } from './data'

type Props = {
  projects: Project[]
  active: string
  onActive: (id: string) => void
  onOpen: (project: Project) => void
}

function NorwayMap() {
  return (
    <svg className="norway-map" viewBox="0 0 520 760" aria-hidden="true">
      <defs>
        <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d8ddcf" stopOpacity=".45" />
          <stop offset="1" stopColor="#9eaa98" stopOpacity=".08" />
        </linearGradient>
      </defs>
      <path
        className="norway-shape"
        d="M262 24 C300 32 333 49 355 75 L337 103 370 127 344 158 368 183 337 217 354 246 320 282 337 315 303 349 322 384 290 421 305 459 272 495 286 535 253 568 266 606 235 639 239 681 211 728 180 710 190 671 166 648 186 615 164 585 191 552 174 516 202 481 188 444 215 410 202 374 229 338 216 300 244 265 230 229 257 194 244 157 274 124 258 88 280 58 Z"
      />
      <path className="map-line" d="M259 88 L306 120 263 160 315 210 260 267 302 335 244 401 280 472 217 544 253 605 204 671" />
      <path className="map-line" d="M250 194 L337 217 M216 300 L303 349 M202 444 L272 495 M191 552 L253 568" />
      <circle cx="278" cy="585" r="3" className="map-city" />
      <text x="290" y="589" className="map-city-label">OSLO</text>
      <circle cx="254" cy="405" r="3" className="map-city" />
      <text x="267" y="409" className="map-city-label">TRONDHEIM</text>
      <text x="205" y="744" className="map-country-label">NORGE</text>
    </svg>
  )
}

export default function ProjectAtlas({ projects, active, onActive, onOpen }: Props) {
  return (
    <div className="project-atlas">
      <div className="atlas-grid" aria-hidden="true" />
      <NorwayMap />
      <div className="digital-zone" aria-hidden="true">
        <span>Digitalt</span>
        <small>uten sted</small>
      </div>
      <div className="atlas-key" aria-hidden="true">
        <span><i className="geo-key" /> Geografisk</span>
        <span><i className="digital-key" /> Digitalt</span>
      </div>

      {projects.map((project) => {
        const isActive = project.id === active
        return (
          <button
            key={project.id}
            className={`map-node ${project.kind} ${isActive ? 'is-active' : ''}`}
            style={{
              left: `${project.position.x}%`,
              top: `${project.position.y}%`,
              '--node-color': project.color,
            } as React.CSSProperties}
            onMouseEnter={() => onActive(project.id)}
            onFocus={() => onActive(project.id)}
            onClick={() => onOpen(project)}
            aria-label={`Åpne ${project.title}`}
          >
            <span className="map-node-ring" />
            <span className="map-node-dot" />
            <span className="map-node-label">{project.number}</span>

            <span className="map-tooltip">
              <span className="tooltip-top"><span>{project.eyebrow}</span><ArrowUpRight size={13} /></span>
              <strong>{project.title}</strong>
              <span className="tooltip-description">{project.description}</span>
              <span className="tooltip-meta"><MapPin size={11} /> {project.location} · {project.year}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
