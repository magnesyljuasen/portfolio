import projectData from './data/projects.json'

export type Project = {
  id: string
  title: string
  eyebrow: string
  description: string
  longDescription: string
  year: string
  tags: string[]
  group: ProjectGroup
  kind: 'geographic' | 'digital'
  coordinates?: [number, number]
  mapOffset?: [number, number]
  metric: string
  status: string
  link?: string
  image?: string
}

export type ProjectGroup = 'analyse' | 'produkt' | 'prosjektering'

export const projectGroups: Record<ProjectGroup, { label: string; color: string }> = {
  analyse: { label: 'analyse', color: '#355744' },
  produkt: { label: 'digitalt produkt', color: '#a84f37' },
  prosjektering: { label: 'prosjektering', color: '#b68a3c' },
}

export const projects = projectData as unknown as Project[]
