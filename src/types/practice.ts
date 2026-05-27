import type { Quest } from "./curriculum"

export type PracticeType = "sql" | "python" | "excel"

export interface DatasetTable {
  name: string
  columns: { name: string; type: string }[]
  rows: Record<string, string | number | boolean | null>[]
}

export interface QueryResult {
  columns: string[]
  rows: Record<string, string | number | boolean | null>[]
  rowCount: number
  executionTime: number
  error?: string
}

export interface PracticeSubmission {
  id: string
  questId: string
  userId: string
  submission: string
  status: "pending" | "correct" | "incorrect"
  score: number
  xpEarned: number
  createdAt: string
}

export interface BossChallenge {
  id: string
  moduleId: string
  title: string
  description: string
  instructions: string
  xpReward: number
  unlocksPhase: string | null
  practiceType: PracticeType
}
