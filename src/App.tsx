import { useEffect, useState } from 'react'
import {
  ArrowDownToLine,
  ArrowUpRight,
  Github,
  Linkedin,
  MapPin,
  X,
} from 'lucide-react'
import { projects, type Project } from './data'

const githubUrl = 'https://github.com/magnesyljuasen'
const linkedinUrl = 'https://no.linkedin.com/in/magne-sylju%C3%A5sen-35235738'

function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="detail-backdrop" role="presentation" onMouseDown={onClose}>
      <article
        className="detail-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="detail-header">
          <span>{project.number} / {project.year}</span>
          <button onClick={onClose} aria-label="Lukk prosjekt"><X size={18} /></button>
        </header>

        <div className="detail-visual" style={{ '--project-color': project.color } as React.CSSProperties}>
          <span className="detail-orbit" />
          <span className="detail-number">{project.number}</span>
        </div>

        <div className="detail-copy">
          <p className="kicker">{project.eyebrow}</p>
          <h2 id="detail-title">{project.title}</h2>
          <p>{project.longDescription}</p>

          <dl>
            <div><dt>Resultat</dt><dd>{project.metric}</dd></div>
            <div><dt>Status</dt><dd>{project.status}</dd></div>
            <div><dt>Sted</dt><dd>{project.location}</dd></div>
          </dl>

          <div className="detail-tags">
            {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
      </article>
    </div>
  )
}

function ExternalLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={`${label}, åpnes i ny fane`}>
      <span>{label}</span>{icon}
    </a>
  )
}

export default function App() {
  const [activeId, setActiveId] = useState(projects[0].id)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const activeProject = projects.find((project) => project.id === activeId) ?? projects[0]

  return (
    <main className="portfolio-shell">
      <header className="topbar" aria-hidden={selectedProject ? true : undefined}>
        <a className="identity" href="./" aria-label="Magne Syljuåsen, forside">
          <span className="identity-mark">MS</span>
          <span className="identity-name">Magne Syljuåsen</span>
        </a>

        <p className="role">Sivilingeniør · energirådgiver · KI-utvikler</p>

        <nav className="external-links" aria-label="Eksterne lenker">
          <ExternalLink href={linkedinUrl} label="LinkedIn" icon={<Linkedin size={14} />} />
          <ExternalLink href={githubUrl} label="GitHub" icon={<Github size={14} />} />
          <button className="cv-link" disabled title="Legg CV som PDF i public-mappen for å aktivere">
            <span>CV kommer</span><ArrowDownToLine size={14} />
          </button>
        </nav>
      </header>

      <section
        className="workbench"
        aria-label="Utvalgte prosjekter"
        aria-hidden={selectedProject ? true : undefined}
      >
        <div className="project-column">
          <header className="project-intro">
            <p className="kicker">Utvalgte arbeider / 2023—26</p>
            <div className="intro-line">
              <h1>Prosjekter.</h1>
              <p>Energi, data og KI<br />gjort anvendelig.</p>
            </div>
          </header>

          <div className="project-index" role="list">
            {projects.map((project) => {
              const isActive = project.id === activeProject.id
              return (
                <button
                  key={project.id}
                  className={`project-row ${isActive ? 'is-active' : ''}`}
                  onMouseEnter={() => setActiveId(project.id)}
                  onFocus={() => setActiveId(project.id)}
                  onClick={() => setSelectedProject(project)}
                  role="listitem"
                  aria-label={`Åpne ${project.title}`}
                >
                  <span className="row-number">{project.number}</span>
                  <span className="row-title">{project.title}</span>
                  <span className="row-type">{project.eyebrow}</span>
                  <span className="row-arrow"><ArrowUpRight size={17} /></span>
                </button>
              )
            })}
          </div>

          <footer className="project-footer">
            <span><i /> Tilgjengelig for gode idéer</span>
            <span>Oslo, Norge</span>
          </footer>
        </div>

        <article
          className="project-preview"
          style={{ '--project-color': activeProject.color } as React.CSSProperties}
          aria-live="polite"
        >
          <div className="preview-grid" aria-hidden="true" />
          <div className="preview-topline">
            <span>Aktivt prosjekt</span>
            <span>{activeProject.number} / {projects.length.toString().padStart(2, '0')}</span>
          </div>

          <div className="preview-mark" aria-hidden="true">
            <span>{activeProject.number}</span>
            <i />
          </div>

          <div className="preview-copy">
            <p className="kicker">{activeProject.eyebrow}</p>
            <h2>{activeProject.title}</h2>
            <p className="preview-description">{activeProject.description}</p>

            <div className="preview-meta">
              <span><MapPin size={13} /> {activeProject.location}</span>
              <span>{activeProject.year}</span>
              <span>{activeProject.status}</span>
            </div>

            <button className="open-project" onClick={() => setSelectedProject(activeProject)}>
              Se prosjektet <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="preview-tags">
            {activeProject.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </article>
      </section>

      {selectedProject && <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </main>
  )
}
