export type StationId = 
  | 'central'
  | 'about'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'achievements'
  | 'contact'

export interface StationConfig {
  id: StationId
  code: string
  title: string
  subtitle: string
  color: string
}

export interface ExperienceItem {
  company: string
  role: string
  period: string
  location: string
  badge: string
  color: string
  description: string
  bullets: string[]
  tags: string[]
}

export interface ProjectItem {
  id: string
  title: string
  subtitle: string
  category: string
  scale: string
  status: 'OPERATIONAL' | 'COMPLETED' | 'ONGOING'
  description: string
  tags: string[]
  highlights: string[]
  link?: string
}

export interface SkillCategory {
  title: string
  code: string
  description: string
  skills: {
    name: string
    level: string
    highlight?: boolean
  }[]
}

export interface MilestoneItem {
  id: string
  title: string
  issuer: string
  year: string
  desc: string
  badge: string
}
