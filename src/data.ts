export type Project = {
  id: string
  number: string
  title: string
  eyebrow: string
  description: string
  longDescription: string
  location: string
  year: string
  tags: string[]
  color: string
  position: { x: number; y: number }
  kind: 'geographic' | 'digital'
  coordinates?: [number, number]
  metric: string
  status: string
  link?: string
}

export const projects: Project[] = [
  {
    id: 'energiplanlegging',
    number: '01',
    title: 'Energi\u00adplanlegging',
    eyebrow: 'Analyseverktøy',
    description: 'Fra tusenvis av bygg til konkrete energitiltak.',
    longDescription:
      'Et visuelt beslutningsverktøy som samler bygningsdata, energibehov og lokale forutsetninger i ett tydelig arbeidsrom.',
    location: 'Norge',
    year: '2024',
    tags: ['Python', 'GeoData', 'Energi'],
    color: '#355744',
    position: { x: 38, y: 31 },
    kind: 'geographic',
    coordinates: [10.4, 63.43],
    metric: '10k+ bygg',
    status: 'I bruk',
  },
  {
    id: 'klimaetaten',
    number: '02',
    title: 'Mål for Klimaetaten',
    eyebrow: 'Dataprodukt',
    description: 'Scenarioer som gjør klimatiltak målbare.',
    longDescription:
      'En prototype for å utforske hvordan ulike energi- og klimatiltak påvirker forbruk, kostnader og utslipp på områdenivå.',
    location: 'Oslo',
    year: '2024',
    tags: ['UX', 'Data', 'Klima'],
    color: '#b85c3d',
    position: { x: 35, y: 68 },
    kind: 'geographic',
    coordinates: [10.75, 59.91],
    metric: '6 scenarier',
    status: 'Prototype',
  },
  {
    id: 'floorplanner',
    number: '03',
    title: 'Floor Planner',
    eyebrow: 'Kreativt verktøy',
    description: 'Tegn rom i 2D. Opplev dem i 3D.',
    longDescription:
      'En nettbasert plantegner med sanntidsvisning, materialbibliotek og et enkelt grensesnitt for å forme rom uten CAD-erfaring.',
    location: 'Digitalt',
    year: '2026',
    tags: ['React', 'Three.js', 'Design'],
    color: '#d5a642',
    position: { x: 78, y: 31 },
    kind: 'digital',
    metric: '2D → 3D',
    status: 'Pågår',
  },
  {
    id: 'energyanalysis',
    number: '04',
    title: 'Energy Analysis',
    eyebrow: 'Åpen kildekode',
    description: 'Modulær motor for energiberegninger.',
    longDescription:
      'Et Python-bibliotek for analyser av energibehov, varmepumper, solceller, geoenergi og økonomi — laget for gjenbruk.',
    location: 'Open source',
    year: '2023–26',
    tags: ['Python', 'API', 'Modellering'],
    color: '#597b7b',
    position: { x: 84, y: 53 },
    kind: 'digital',
    metric: '15+ moduler',
    status: 'Aktivt',
  },
  {
    id: 'vmspillet',
    number: '05',
    title: 'VM-spillet',
    eyebrow: 'Side project',
    description: 'Et lite spill med stor konkurransefaktor.',
    longDescription:
      'En leken webopplevelse bygget for raske runder, tydelig feedback og den klassiske følelsen av “bare én gang til”.',
    location: 'Digitalt',
    year: '2026',
    tags: ['Game', 'React', 'Canvas'],
    color: '#7c6b51',
    position: { x: 75, y: 72 },
    kind: 'digital',
    metric: '60 fps',
    status: 'Eksperiment',
  },
]
