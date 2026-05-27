import { create } from "zustand"
import type {
  SkillName,
  SkillProgress,
  DailyQuest,
} from "@/types/gamification"
import {
  calculateLevel,
  calculateXpInCurrentLevel,
  getSkillLevelFromProgress,
} from "@/types/gamification"
import { updateUserProfileProgress } from "@/lib/supabase-progress"

interface GamificationStore {
  totalXP: number
  currentLevel: number
  xpInCurrentLevel: number
  streak: number
  coins: number
  skillProgress: Record<SkillName, SkillProgress>
  dailyQuests: DailyQuest[]
  userId: string | null
  setUserId: (id: string) => void
  setXP: (xp: number) => void
  addXP: (amount: number) => void
  setStreak: (streak: number) => void
  setCoins: (coins: number) => void
  setCoinsDelta: (delta: number) => void
  setSkillProgress: (skill: SkillName, xp: number, lessonsCompleted: number) => void
  completeDailyQuest: (questId: string) => void
  recalculateLevel: () => void
  getXpForNextLevel: () => number
  hydrate: (userId: string, xp: number, coins: number, streak: number) => void
}

const defaultSkillProgress: Record<SkillName, SkillProgress> = {
  excel: {
    name: "excel",
    label: "Excel",
    xp: 0,
    level: "beginner",
    progress: 0,
    lessonsCompleted: 0,
    totalLessons: 12,
  },
  sql: {
    name: "sql",
    label: "SQL",
    xp: 0,
    level: "beginner",
    progress: 0,
    lessonsCompleted: 0,
    totalLessons: 24,
  },
  python: {
    name: "python",
    label: "Python",
    xp: 0,
    level: "beginner",
    progress: 0,
    lessonsCompleted: 0,
    totalLessons: 32,
  },
}

const defaultDailyQuests: DailyQuest[] = [
  {
    id: "dq-1",
    title: "Write 3 SQL Queries",
    description: "Practice your SELECT statements",
    xpReward: 50,
    coinReward: 10,
    progress: 0,
    target: 3,
    completed: false,
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: "dq-2",
    title: "Data Cleaning Sprint",
    description: "Clean a messy dataset with Python",
    xpReward: 75,
    coinReward: 15,
    progress: 0,
    target: 1,
    completed: false,
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: "dq-3",
    title: "Excel Formula Challenge",
    description: "Master 5 essential Excel formulas",
    xpReward: 40,
    coinReward: 8,
    progress: 0,
    target: 5,
    completed: false,
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  },
]

export const useGamificationStore = create<GamificationStore>((set, get) => ({
  totalXP: 0,
  currentLevel: 1,
  xpInCurrentLevel: 0,
  streak: 0,
  coins: 0,
  skillProgress: defaultSkillProgress,
  dailyQuests: defaultDailyQuests,
  userId: null,

  setUserId: (userId) => set({ userId }),

  hydrate: (userId, xp, coins, streak) => {
    set({
      userId,
      totalXP: xp,
      coins,
      streak,
      currentLevel: calculateLevel(xp),
      xpInCurrentLevel: calculateXpInCurrentLevel(xp),
    })
  },

  setXP: (xp) => {
    set({
      totalXP: xp,
      currentLevel: calculateLevel(xp),
      xpInCurrentLevel: calculateXpInCurrentLevel(xp),
    })
  },

  addXP: (amount) => {
    const { totalXP, userId } = get()
    const newXP = totalXP + amount
    set({
      totalXP: newXP,
      currentLevel: calculateLevel(newXP),
      xpInCurrentLevel: calculateXpInCurrentLevel(newXP),
    })
    // Persist to Supabase profiles table
    if (userId) {
      updateUserProfileProgress(userId, { xp: newXP })
    }
  },

  setStreak: (streak) => {
    set({ streak })
    const { userId } = get()
    if (userId) {
      updateUserProfileProgress(userId, { streak_days: streak })
    }
  },

  setCoins: (coins) => set({ coins }),

  setCoinsDelta: (delta) => {
    const { coins, userId } = get()
    const newCoins = Math.max(0, coins + delta)
    set({ coins: newCoins })
    if (userId) {
      updateUserProfileProgress(userId, { analytics_coins: newCoins })
    }
  },

  setSkillProgress: (skill, xp, lessonsCompleted) => {
    const { skillProgress } = get()
    const current = skillProgress[skill]
    const maxXp = skill === "excel" ? 120 : skill === "sql" ? 240 : 320
    const progress = Math.min(Math.round((xp / maxXp) * 100), 100)

    set({
      skillProgress: {
        ...skillProgress,
        [skill]: {
          ...current,
          xp,
          lessonsCompleted,
          progress,
          level: getSkillLevelFromProgress(progress),
        },
      },
    })
  },

  completeDailyQuest: (questId) => {
    const { dailyQuests } = get()
    const quest = dailyQuests.find((q) => q.id === questId)
    if (quest && !quest.completed) {
      set({
        dailyQuests: dailyQuests.map((q) =>
          q.id === questId ? { ...q, completed: true, progress: q.target } : q
        ),
      })
      get().addXP(quest.xpReward)
      get().setCoinsDelta(quest.coinReward)
    }
  },

  recalculateLevel: () => {
    const { totalXP } = get()
    set({
      currentLevel: calculateLevel(totalXP),
      xpInCurrentLevel: calculateXpInCurrentLevel(totalXP),
    })
  },

  getXpForNextLevel: () => {
    const { currentLevel } = get()
    return currentLevel * 100
  },
}))
