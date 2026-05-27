import { create } from "zustand"
import type { UserProfile } from "@/types/user"

interface Lesson {
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

interface Quest {
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

interface AppState {
  theme: "dark" | "light"
  lessons: Lesson[]
  quests: Quest[]
  setTheme: (theme: "dark" | "light") => void
  toggleTheme: () => void
  setLessons: (lessons: Lesson[]) => void
  setQuests: (quests: Quest[]) => void
}

export const useAppStore = create<AppState>((set) => ({
  theme: "dark",
  lessons: [],
  quests: [],
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "dark" ? "light" : "dark",
    })),
  setLessons: (lessons) => set({ lessons }),
  setQuests: (quests) => set({ quests }),
}))
