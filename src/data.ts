import projectData from './data/projects.json'

export type Project = {
  id: string
  title: string
  eyebrow: string
  description: string
  longDescription: string
  year: string
  tags: string[]
  color: string
  kind: 'geographic' | 'digital'
  coordinates?: [number, number]
  metric: string
  status: string
  link?: string
  image?: string
}

export const projects = projectData as unknown as Project[]
