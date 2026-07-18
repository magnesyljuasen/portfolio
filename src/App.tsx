import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowDownToLine, ArrowUpRight, Github, Linkedin, X } from 'lucide-react'
import { projectGroups, projects, type Project } from './data'

const ProjectAtlas = lazy(() => import('./ProjectAtlas'))

const githubUrl = 'https://github.com/magnesyljuasen'
const linkedinUrl = 'https://no.linkedin.com/in/magne-sylju%C3%A5sen-35235738'

function SiteLoader() {
  return (
    <div className="site-loader" role="status" aria-label="Laster portfoliosiden">
      <div className="loader-copy">
        <strong>Magne Syljuåsen</strong>
      </div>
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
    const minimumDuration = 2600
    const remaining = Math.max(0, minimumDuration - (performance.now() - loaderStartedAt.current))
    const timer = window.setTimeout(() => setIsLoading(false), remaining)
    return () => window.clearTimeout(timer)
  }, [pageReady, mapReady])

  return (
    <main className={`portfolio-shell ${isLoading ? 'is-loading' : ''} ${selectedProject ? 'detail-open' : ''}`}>
      {isLoading && <SiteLoader />}
      <div className="landing-screen">
        <header className="topbar" aria-hidden={selectedProject ? true : undefined}>
          <a className="identity" href="./" aria-label="Magne Syljuåsen, forside">Magne Syljuåsen</a>
          <div className="top-actions">
            <a className="about-link" href="#about">Om meg</a>
            <nav className="external-links" aria-label="Eksterne lenker">
              <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><Linkedin size={15} /></a>
              <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><Github size={15} /></a>
              <button className="cv-link" disabled title="CV-fil kommer"><span>CV kommer</span><ArrowDownToLine size={14} /></button>
            </nav>
          </div>
        </header>

        <section className="home-layout" aria-hidden={selectedProject ? true : undefined}>
          <article className="intro-panel">
            <div className="intro-copy">
              <h1>Jeg gjør komplekse valg <strong>enklere.</strong></h1>
              <p className="intro-lead">Med nysgjerrighet, kode og et ganske stort behov for struktur.</p>
              <p className="intro-note">helst ting som faktisk blir brukt</p>
            </div>
            <span className="scroll-cue" aria-hidden="true">mer nedenfor <ArrowDown size={13} /></span>
          </article>

          <section className="project-explorer" id="projects" aria-label="Prosjektutforsker">
            <header className="explorer-header">
              <span className="map-hint"><span className="hint-desktop">hold over en prikk for å se prosjekt</span><span className="hint-touch">trykk på en prikk</span></span>
              <div className="map-legend" aria-label="Prikkfarger">
                {Object.entries(projectGroups).map(([key, group]) => (
                  <span key={key}><i style={{ backgroundColor: group.color }} />{group.label}</span>
                ))}
              </div>
            </header>

            <div className="explorer-body">
              <Suspense fallback={<div className="map-loading"><span>tegner kartet...</span></div>}>
                <ProjectAtlas projects={projects} active={activeId} onActive={setActiveId} onOpen={setSelectedProject} onReady={() => setMapReady(true)} />
              </Suspense>
            </div>
          </section>
        </section>
      </div>

      <section className="about-screen" id="about" aria-labelledby="about-title">
        <figure className="about-photo">
          <img src={`${import.meta.env.BASE_URL}about/magne-syljuasen.png`} alt="Magne Syljuåsen arbeider ved en laptop" />
        </figure>
        <div className="about-content">
          <div className="about-heading">
            <span className="scribble">kort fortalt</span>
            <h2 id="about-title">Sivilingeniør med geofag i bunn og stadig mer <span>kode i verktøykassa.</span></h2>
          </div>
          <div className="about-copy">
            <p>Jeg er 29 år og utdannet innen geofag fra NTNU. I dag jobber jeg i Asplan Viak, først og fremst med energi og bergvarme.</p>
            <p>Jeg liker å kombinere fag, data og kode. Jeg har brukt Python i mange år og bruker nå KI aktivt i utviklingen.</p>
            <p>Jeg er ikke supernerd på én enkelt ting. Jeg er opptatt av helheten og av å få fag, data, kode og KI til å spille sammen. Kanskje er det ikke tilfeldig at jeg alltid har vært midtbanespiller på fotballbanen.</p>
            <span className="about-note">fag + data + kode + KI</span>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-note">
          <span className="scribble">en liten fotnote</span>
          <p>Jeg motiveres av problemer med litt motstand, der man må tenke nytt og kreativt.</p>
        </div>
        <div className="footer-cta">
          <a href={linkedinUrl} target="_blank" rel="noreferrer"><h2>Skal vi ta en <span>prat?</span></h2><ArrowUpRight size={30} /></a>
        </div>
        <div className="footer-meta"><span>© 2026 Magne Syljuåsen</span></div>
      </footer>

      {selectedProject && <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </main>
  )
}
