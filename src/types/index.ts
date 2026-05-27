export interface User {
  id: string
  email: string
  username: string
  avatar_url?: string
  xp: number
  level: number
  created_at: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  xp_reward: number
  order: number
  category: string
  completed: boolean
  progress: number
}

export interface Quest {
  id: string
  title: string
  description: string
  type: "daily" | "weekly" | "achievement"
  xp_reward: number
  progress: number
  target: number
  completed: boolean
  expires_at?: string
}

export interface SkillTree {
  id: string
  name: string
  description: string
  icon: string
  nodes: SkillNode[]
}

export interface SkillNode {
  id: string
  name: string
  description: string
  unlocked: boolean
  xp_cost: number
  prerequisites: string[]
}
