export type SkillName = "excel" | "sql" | "python"

export type SkillLevel = "beginner" | "intermediate" | "advanced"

export interface SkillProgress {
  name: SkillName
  label: string
  xp: number
  level: SkillLevel
  progress: number
  lessonsCompleted: number
  totalLessons: number
}

export interface DailyQuest {
  id: string
  title: string
  description: string
  xpReward: number
  coinReward: number
  progress: number
  target: number
  completed: boolean
  expiresAt: string
}

export interface GamificationState {
  totalXP: number
  currentLevel: number
  xpForNextLevel: number
  xpInCurrentLevel: number
  streak: number
  coins: number
  skillProgress: Record<SkillName, SkillProgress>
  dailyQuests: DailyQuest[]
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1
}

export function calculateXpForLevel(level: number): number {
  return level * 100
}

export function calculateXpInCurrentLevel(xp: number): number {
  return xp % 100
}

export function getSkillLevelFromProgress(progress: number): SkillLevel {
  if (progress >= 66) return "advanced"
  if (progress >= 33) return "intermediate"
  return "beginner"
}
