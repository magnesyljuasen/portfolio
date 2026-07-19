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
  metric: string
  status: string
  link?: string
  image?: string
}

export type ProjectGroup = 'fag' | 'verktoy' | 'lek'

export const projectGroups: Record<ProjectGroup, { label: string; color: string }> = {
  fag: { label: 'fag', color: '#355744' },
  verktoy: { label: 'verktøy', color: '#173b63' },
  lek: { label: 'lek', color: '#b68a3c' },
}

export const projects = projectData as unknown as Project[]
