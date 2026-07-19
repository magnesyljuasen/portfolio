import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowDownToLine, ArrowUpRight, Github, Linkedin, Menu, X } from 'lucide-react'
import { projectGroups, projects, type Project } from './data'

const ProjectAtlas = lazy(() => import('./ProjectAtlas'))

const githubUrl = 'https://github.com/magnesyljuasen'
const linkedinUrl = 'https://no.linkedin.com/in/magne-sylju%C3%A5sen-35235738'

function SiteLoader({ exiting }: { exiting: boolean }) {
  return (
    <div className={`site-loader ${exiting ? 'is-exiting' : ''}`} role="status" aria-label="Laster portfoliosiden">
      <strong>Magne Syljuåsen</strong>
      <span className="loader-line" aria-hidden="true" />
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
          {project.link && <a className="detail-link" href={project.link} target="_blank" rel="noreferrer">Se prosjektet <ArrowUpRight size={16} /></a>}
        </div>
      </article>
    </div>
  )
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [loaderExiting, setLoaderExiting] = useState(false)
  const [pageReady, setPageReady] = useState(false)
  const [mapReady, setMapReady] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeId, setActiveId] = useState(projects[0].id)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const loaderStartedAt = useRef(performance.now())

  useEffect(() => {
    if (!isLoading) return
    const handlePageReady = () => setPageReady(true)
    if (document.readyState === 'complete') handlePageReady()
    else window.addEventListener('load', handlePageReady, { once: true })
    let finish = 0
    const fallback = window.setTimeout(() => {
      setLoaderExiting(true)
      finish = window.setTimeout(() => { setIsLoading(false); setLoaderExiting(false) }, 600)
    }, 10000)
    return () => { window.removeEventListener('load', handlePageReady); window.clearTimeout(fallback); window.clearTimeout(finish) }
  }, [isLoading])

  useEffect(() => {
    if (!pageReady || !mapReady) return
    const minimumDuration = 2600
    const remaining = Math.max(0, minimumDuration - (performance.now() - loaderStartedAt.current))
    let finish = 0
    const timer = window.setTimeout(() => {
      setLoaderExiting(true)
      finish = window.setTimeout(() => { setIsLoading(false); setLoaderExiting(false) }, 600)
    }, remaining)
    return () => { window.clearTimeout(timer); window.clearTimeout(finish) }
  }, [pageReady, mapReady])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.documentElement
    let frame = 0
    const updateParallax = () => {
      frame = 0
      const viewportHeight = window.innerHeight
      const heroProgress = Math.min(Math.max(window.scrollY / viewportHeight, 0), 1)
      root.style.setProperty('--hero-copy-y', `${heroProgress * -48}px`)
      root.style.setProperty('--hero-map-y', `${heroProgress * 24}px`)

      const about = document.querySelector<HTMLElement>('.about-screen')
      if (about) {
        const rect = about.getBoundingClientRect()
        const progress = Math.min(Math.max((viewportHeight - rect.top) / (viewportHeight + rect.height), 0), 1) - .5
        const range = window.innerWidth <= 960 ? 18 : 42
        root.style.setProperty('--about-photo-y', `${progress * -range}px`)
        root.style.setProperty('--about-content-y', `${progress * range * .62}px`)
      }

      const footer = document.querySelector<HTMLElement>('.site-footer')
      if (footer) {
        const rect = footer.getBoundingClientRect()
        const progress = Math.min(Math.max((viewportHeight - rect.top) / (viewportHeight + rect.height), 0), 1) - .5
        root.style.setProperty('--footer-y', `${progress * -28}px`)
      }
    }
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateParallax)
    }
    updateParallax()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      window.cancelAnimationFrame(frame)
      ;['--hero-copy-y', '--hero-map-y', '--about-photo-y', '--about-content-y', '--footer-y'].forEach((name) => root.style.removeProperty(name))
    }
  }, [])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && setMobileMenuOpen(false)
    const handleResize = () => window.innerWidth > 960 && setMobileMenuOpen(false)
    window.addEventListener('keydown', handleKey)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <main className={`portfolio-shell ${isLoading ? 'is-loading' : ''} ${loaderExiting ? 'loader-exiting' : ''} ${selectedProject ? 'detail-open' : ''}`}>
      {isLoading && <SiteLoader exiting={loaderExiting} />}
      <header className="topbar" aria-hidden={selectedProject ? true : undefined}>
        <a className="identity" href="./" aria-label="Magne Syljuåsen, forside">Magne Syljuåsen</a>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileMenuOpen ? 'Lukk meny' : 'Åpne meny'}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className={`top-actions ${mobileMenuOpen ? 'is-open' : ''}`} id="mobile-navigation">
          <nav className="site-nav" aria-label="På denne siden">
            <a href="#projects" onClick={() => setMobileMenuOpen(false)}>Prosjekter</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>Om meg</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Kontakt</a>
          </nav>
          <nav className="external-links" aria-label="Eksterne lenker">
            <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><Linkedin size={15} /></a>
            <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><Github size={15} /></a>
            <a className="cv-link" href={`${import.meta.env.BASE_URL}cv/magne-syljuasen-cv.pdf`} download><span>Last ned CV</span><ArrowDownToLine size={14} /></a>
          </nav>
        </div>
      </header>
      <div className="landing-screen">
        <section className="home-layout" aria-hidden={selectedProject ? true : undefined}>
          <article className="intro-panel">
            <div className="intro-copy">
              <h1>Jeg gjør komplekse valg <strong>enklere.</strong></h1>
              <p className="intro-lead">Med nysgjerrighet, kode og et ganske stort behov for struktur.</p>
            </div>
            <button className="scroll-cue" type="button" onClick={() => document.querySelector(window.innerWidth <= 960 ? '#projects' : '#about')?.scrollIntoView({ behavior: 'smooth' })}>mer nedenfor <ArrowDown size={13} /></button>
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
            <h2 id="about-title">Sivilingeniør og <span>utvikler.</span></h2>
          </div>
          <div className="about-copy">
            <p>Jeg er 29 år og utdannet innen geofag fra NTNU. I dag jobber jeg i Asplan Viak, først og fremst med energi og bergvarme.</p>
            <p>Jeg liker å kombinere fag, data og kode. Jeg har brukt Python i mange år og bruker nå KI aktivt i utviklingen.</p>
            <p>Jeg er opptatt av å se helheten og av å få fag, data, kode og KI til å spille sammen. Kanskje er det ikke tilfeldig at jeg alltid har vært midtbanespiller på fotballbanen.</p>
            <span className="about-note">fag + data + kode + KI</span>
          </div>
        </div>
      </section>

      <footer className="site-footer" id="contact">
        <div className="footer-cta">
          <h2>Trenger du hjelp til å finne essensen, gjøre noe enklere eller lage en <span>digital løsning?</span></h2>
          <a href={linkedinUrl} target="_blank" rel="noreferrer">Skal vi ta en prat? <ArrowUpRight size={18} /></a>
        </div>
        <div className="footer-meta"><span>© 2026 Magne Syljuåsen</span></div>
      </footer>

      {selectedProject && <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </main>
  )
}
