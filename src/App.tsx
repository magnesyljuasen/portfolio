import { useEffect, useState } from 'react'
import { ArrowDownToLine, ArrowUpRight, Github, LayoutList, Linkedin, Map, MapPin, X } from 'lucide-react'
import ProjectAtlas from './ProjectAtlas'
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
      <article className="detail-panel" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="detail-header">
          <span>{project.number} / {project.year}</span>
          <button onClick={onClose} aria-label="Lukk prosjekt"><X size={18} /></button>
        </header>
        <div className="detail-visual" style={{ '--project-color': project.color } as React.CSSProperties}>
          <span className="detail-orbit" /><span className="detail-number">{project.number}</span>
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
          <div className="detail-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
      </article>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState<'map' | 'list'>('map')
  const [activeId, setActiveId] = useState(projects[0].id)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const activeProject = projects.find((project) => project.id === activeId) ?? projects[0]

  return (
    <main className="portfolio-shell">
      <header className="topbar" aria-hidden={selectedProject ? true : undefined}>
        <a className="identity" href="./" aria-label="Magne Syljuåsen, forside">
          <span className="identity-mark">MS</span><span>Magne Syljuåsen</span>
        </a>
        <nav className="external-links" aria-label="Eksterne lenker">
          <a href={linkedinUrl} target="_blank" rel="noreferrer"><span>LinkedIn</span><Linkedin size={14} /></a>
          <a href={githubUrl} target="_blank" rel="noreferrer"><span>GitHub</span><Github size={14} /></a>
          <button disabled title="CV-fil kommer"><span>CV kommer</span><ArrowDownToLine size={14} /></button>
        </nav>
      </header>

      <section className="home-layout" aria-hidden={selectedProject ? true : undefined}>
        <article className="intro-panel">
          <p className="kicker"><i /> Hei, og velkommen</p>
          <div className="intro-copy">
            <h1>Jeg er<br /><strong>Magne.</strong></h1>
            <p className="intro-lead">29 år gammel sivilingeniør, energirådgiver og utvikler.</p>
            <p className="intro-body">Jeg kombinerer energi, data, KI og kreativ problemløsning for å gjøre komplekse ting enklere å forstå — og bedre å bruke.</p>
          </div>
          <div className="intro-bottom">
            <div className="discipline-list">
              <span>01 / Energi</span><span>02 / Utvikling</span><span>03 / KI</span><span>04 / Kreativitet</span>
            </div>
            <p><i /> Oslo, Norge<br /><span>Tilgjengelig for gode idéer</span></p>
          </div>
        </article>

        <section className="project-explorer" aria-label="Prosjektutforsker">
          <header className="explorer-header">
            <div>
              <p className="kicker">Arbeid / {projects.length.toString().padStart(2, '0')} prosjekter</p>
              <h2>{view === 'map' ? 'Prosjektkart' : 'Alle prosjekter'}</h2>
            </div>
            <div className="view-switch" role="group" aria-label="Velg prosjektvisning">
              <button className={view === 'map' ? 'is-active' : ''} onClick={() => setView('map')} aria-pressed={view === 'map'}><Map size={14} /><span>Kart</span></button>
              <button className={view === 'list' ? 'is-active' : ''} onClick={() => setView('list')} aria-pressed={view === 'list'}><LayoutList size={14} /><span>Liste</span></button>
            </div>
          </header>

          <div className="explorer-body">
            {view === 'map' ? (
              <ProjectAtlas projects={projects} active={activeId} onActive={setActiveId} onOpen={setSelectedProject} />
            ) : (
              <div className="project-list" role="list">
                {projects.map((project) => (
                  <button key={project.id} className="list-row" onMouseEnter={() => setActiveId(project.id)} onFocus={() => setActiveId(project.id)} onClick={() => setSelectedProject(project)} role="listitem">
                    <span className="list-number">{project.number}</span>
                    <span className="list-main"><strong>{project.title}</strong><small>{project.description}</small></span>
                    <span className="list-place"><MapPin size={12} /> {project.location}</span>
                    <span className="list-year">{project.year}</span>
                    <ArrowUpRight size={17} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <footer className="explorer-footer">
            <span style={{ '--active-color': activeProject.color } as React.CSSProperties}><i /> {activeProject.title}</span>
            <span>Hold over et punkt · klikk for å utforske</span>
          </footer>
        </section>
      </section>

      {selectedProject && <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </main>
  )
}
