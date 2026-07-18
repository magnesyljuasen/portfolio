import { useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Github, Linkedin, Mail, MapPin, X } from 'lucide-react'
import ProjectAtlas from './ProjectAtlas'
import { projects, type Project } from './data'

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className="project-modal" role="dialog" aria-modal="true" aria-label={project.title} onMouseDown={onClose}>
      <article className="modal-panel" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Lukk"><X size={20} /></button>
        <div className="modal-visual" style={{ '--project-color': project.color } as React.CSSProperties}>
          <span className="visual-number">{project.number}</span>
          <div className="visual-orbit"><span /></div>
          <span className="visual-caption">{project.eyebrow} / {project.year}</span>
        </div>
        <div className="modal-content">
          <p className="eyebrow">Utvalgt prosjekt</p>
          <h2>{project.title}</h2>
          <p className="modal-lead">{project.longDescription}</p>
          <div className="modal-stats">
            <div><span>Resultat</span><strong>{project.metric}</strong></div>
            <div><span>Status</span><strong>{project.status}</strong></div>
            <div><span>Sted</span><strong>{project.location}</strong></div>
          </div>
          <div className="modal-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <button className="btn btn-neutral rounded-full px-6">Se hele prosjektet <ArrowUpRight size={17} /></button>
        </div>
      </article>
    </div>
  )
}

export default function App() {
  const [activeProject, setActiveProject] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [view, setView] = useState<'atlas' | 'list'>('atlas')

  return (
    <main>
      <nav className="navbar-shell">
        <a className="brand" href="#top" aria-label="Til toppen">
          <span className="brand-mark">M</span>
          <span>Magne<br /><small>Developer &amp; problem solver</small></span>
        </a>
        <div className="nav-links">
          <a href="#projects">Prosjekter</a>
          <a href="#about">Om meg</a>
          <a href="mailto:hei@eksempel.no" className="contact-link">La oss snakke <ArrowUpRight size={16} /></a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Basert i Oslo · jobber overalt</p>
          <h1>Jeg gjør komplekse<br />ting <em>forståelige.</em></h1>
          <p className="hero-lead">Utvikler, analytiker og nysgjerrig problemløser i skjæringspunktet mellom energi, data og gode digitale opplevelser.</p>
        </div>
        <div className="hero-aside">
          <p>Et utvalg ting jeg har<br />designet, bygget og lært av.</p>
          <a href="#projects" className="round-link" aria-label="Se prosjekter"><ArrowDown /></a>
        </div>
      </section>

      <section className="projects-section" id="projects">
        <div className="section-header">
          <div>
            <p className="eyebrow">Utvalgte arbeider</p>
            <h2>Prosjekter som<br /><em>lever et sted.</em></h2>
          </div>
          <div className="section-tools">
            <p>Utforsk kartet. Hold over en prikk<br />for et raskt innblikk.</p>
            <div className="view-toggle" role="group" aria-label="Velg visning">
              <button className={view === 'atlas' ? 'active' : ''} onClick={() => setView('atlas')}>Atlas</button>
              <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>Liste</button>
            </div>
          </div>
        </div>

        {view === 'atlas' ? (
          <ProjectAtlas projects={projects} active={activeProject} onActive={setActiveProject} onOpen={setSelectedProject} />
        ) : (
          <div className="project-list">
            {projects.map((project) => (
              <button key={project.id} className="list-row" onClick={() => setSelectedProject(project)}>
                <span>{project.number}</span>
                <strong>{project.title}</strong>
                <span>{project.eyebrow}</span>
                <span><MapPin size={14} /> {project.location}</span>
                <ArrowUpRight size={20} />
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="about-section" id="about">
        <div className="about-index">A—01</div>
        <div className="about-copy">
          <p className="eyebrow">Litt om meg</p>
          <h2>Jeg liker problemer som krever både <em>logikk og intuisjon.</em></h2>
          <div className="about-columns">
            <p>Jeg jobber med å gjøre data, modeller og komplekse systemer til verktøy folk faktisk har lyst til å bruke.</p>
            <p>Bakgrunnen min er fra energi og analyse. Nysgjerrigheten trekker meg stadig mot design, kode og nye måter å formidle på.</p>
          </div>
          <a href="mailto:hei@eksempel.no" className="text-link">Mer om meg <ArrowRight size={18} /></a>
        </div>
      </section>

      <footer>
        <div>
          <p className="eyebrow">Har du en idé?</p>
          <h2>La oss lage noe<br /><em>som betyr noe.</em></h2>
        </div>
        <div className="footer-right">
          <a className="email" href="mailto:hei@eksempel.no">hei@eksempel.no <ArrowUpRight /></a>
          <div className="socials">
            <a href="#" aria-label="GitHub"><Github /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin /></a>
            <a href="mailto:hei@eksempel.no" aria-label="E-post"><Mail /></a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Magne</span>
          <span>Bygget med omtanke og litt for mye kaffe.</span>
          <a href="#top">Til toppen <ArrowLeft size={15} className="rotate-90" /></a>
        </div>
      </footer>

      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </main>
  )
}
