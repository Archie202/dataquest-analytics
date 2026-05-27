export type QuestType = "task" | "project" | "boss_fight"
export type Difficulty = "easy" | "medium" | "hard"

export interface Quest {
  id: string
  topic_id: string
  title: string
  description: string
  type: QuestType
  instructions: string
  xp_reward: number
  difficulty: Difficulty
  practiceType?: "sql" | "python" | "excel"
  answerType?: "text" | "multiple_choice" | "code"
  correctAnswer?: string
  options?: string[]
}

export interface Topic {
  id: string
  module_id: string
  title: string
  lesson_content: string
  order_index: number
  xp_reward: number
  unlock_level: number
  quests: Quest[]
}

export interface Module {
  id: string
  phase_id: string
  title: string
  description: string
  order_index: number
  unlock_level: number
  topics: Topic[]
}

export interface Phase {
  id: string
  title: string
  description: string
  order_index: number
  icon: string
  unlock_level: number
  modules: Module[]
}

export interface UserProgressEntry {
  user_id: string
  topic_id: string
  completed: boolean
  completed_quests: string[]
  xp_earned: number
  updated_at: string
}
