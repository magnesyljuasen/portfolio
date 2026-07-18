import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDownToLine, ArrowUpRight, Github, LayoutList, Linkedin, Map, X } from 'lucide-react'
import { projects, type Project } from './data'

const ProjectAtlas = lazy(() => import('./ProjectAtlas'))

const githubUrl = 'https://github.com/magnesyljuasen'
const linkedinUrl = 'https://no.linkedin.com/in/magne-sylju%C3%A5sen-35235738'

function SiteLoader() {
  return (
    <div className="site-loader" role="status" aria-label="Laster portfoliosiden">
      <span className="loader-mark">MS</span>
      <span className="loader-line" />
    </div>
  )
}

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
          <span>{project.year}</span>
          <button onClick={onClose} aria-label="Lukk prosjekt"><X size={18} /></button>
        </header>
        <div className="detail-copy">
          {project.image && <img className="detail-image" src={project.image} alt="" />}
          <p className="kicker">{project.eyebrow}</p>
          <h2 id="detail-title">{project.title}</h2>
          <p>{project.longDescription}</p>
          <p className="detail-meta">{project.status} · {project.metric}</p>
          <div className="detail-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
      </article>
    </div>
  )
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [pageReady, setPageReady] = useState(false)
  const [mapReady, setMapReady] = useState(false)
  const [view, setView] = useState<'map' | 'list'>('map')
  const [activeId, setActiveId] = useState(projects[0].id)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const loaderStartedAt = useRef(performance.now())

  useEffect(() => {
    const handlePageReady = () => setPageReady(true)
    if (document.readyState === 'complete') handlePageReady()
    else window.addEventListener('load', handlePageReady, { once: true })
    const fallback = window.setTimeout(() => setIsLoading(false), 10000)
    return () => { window.removeEventListener('load', handlePageReady); window.clearTimeout(fallback) }
  }, [])

  useEffect(() => {
    if (!pageReady || !mapReady) return
    const minimumDuration = 1400
    const remaining = Math.max(0, minimumDuration - (performance.now() - loaderStartedAt.current))
    const timer = window.setTimeout(() => setIsLoading(false), remaining)
    return () => window.clearTimeout(timer)
  }, [pageReady, mapReady])

  return (
    <main className={`portfolio-shell ${selectedProject ? 'detail-open' : ''}`}>
      {isLoading && <SiteLoader />}
      <div className="landing-screen">
        <header className="topbar" aria-hidden={selectedProject ? true : undefined}>
          <a className="identity" href="./" aria-label="Magne Syljuåsen, forside">Magne Syljuåsen</a>
          <nav className="external-links" aria-label="Eksterne lenker">
            <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><Linkedin size={15} /></a>
            <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><Github size={15} /></a>
            <button disabled title="CV-fil kommer"><span>CV kommer</span><ArrowDownToLine size={14} /></button>
          </nav>
        </header>

        <section className="home-layout" aria-hidden={selectedProject ? true : undefined}>
          <article className="intro-panel">
            <div className="intro-copy">
              <h1>Jeg brenner for <strong>smartere måter å jobbe på.</strong></h1>
              <p className="intro-lead">Datadrevne beslutninger, koding, automatisering, effektivisering og struktur.</p>
            </div>
          </article>

          <section className="project-explorer" aria-label="Prosjektutforsker">
            <header className="explorer-header">
              {view === 'map' && <span className="map-hint"><span className="hint-desktop">hold over en prikk for å se prosjekt</span><span className="hint-touch">trykk på en prikk for å se prosjekt</span></span>}
              <div className="view-switch" role="group" aria-label="Velg prosjektvisning">
                <button className={view === 'map' ? 'is-active' : ''} onClick={() => setView('map')} aria-label="Kartvisning" title="Kartvisning" aria-pressed={view === 'map'}><Map size={14} /></button>
                <button className={view === 'list' ? 'is-active' : ''} onClick={() => setView('list')} aria-label="Listevisning" title="Listevisning" aria-pressed={view === 'list'}><LayoutList size={14} /></button>
              </div>
            </header>

            <div className="explorer-body">
              {view === 'map' ? (
                <Suspense fallback={<div className="map-loading"><span>tegner kartet...</span></div>}>
                  <ProjectAtlas projects={projects} active={activeId} onActive={setActiveId} onOpen={setSelectedProject} onReady={() => setMapReady(true)} />
                </Suspense>
              ) : (
                <div className="project-list" role="list">
                  {projects.map((project) => (
                    <button key={project.id} className="list-row" onMouseEnter={() => setActiveId(project.id)} onFocus={() => setActiveId(project.id)} onClick={() => setSelectedProject(project)} role="listitem">
                      <span className="list-main"><strong>{project.title}</strong><small>{project.description}</small></span>
                      <span className="list-year">{project.year}</span>
                      <ArrowUpRight size={17} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </section>
      </div>

      <footer className="site-footer">
        <div className="footer-note">
          <span className="scribble">helt nederst!</span>
          <p>Har du en idé, et vanskelig problem<br />eller bare lyst til å slå av en prat?</p>
        </div>
        <div className="footer-cta">
          <h2>La oss lage noe<br /><span>nyttig sammen.</span></h2>
          <a href={linkedinUrl} target="_blank" rel="noreferrer">Ta kontakt på LinkedIn <ArrowUpRight size={18} /></a>
        </div>
        <div className="footer-meta"><span>© 2026 Magne Syljuåsen</span></div>
      </footer>

      {selectedProject && <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </main>
  )
}
