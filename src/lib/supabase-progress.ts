"use client"

import { getSupabaseClient } from "./supabase"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface QuestSubmissionRow {
  id: string
  user_id: string
  quest_id: string
  submitted_answer: string | null
  is_correct: boolean
  retries_used: number
  completed: boolean
  xp_earned: number
  created_at: string
  updated_at: string
}

export interface TopicProgressRow {
  id: string
  user_id: string
  topic_id: string
  completed: boolean
  quests_completed: number
  total_quests: number
  xp_earned: number
  updated_at: string
}

export interface ModuleProgressRow {
  id: string
  user_id: string
  module_id: string
  completed: boolean
  updated_at: string
}

// ─── Quest Submissions ──────────────────────────────────────────────────────

export async function loadQuestSubmissions(userId: string): Promise<QuestSubmissionRow[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data } = await supabase
    .from("quest_submissions")
    .select("*")
    .eq("user_id", userId)

  return (data ?? []) as QuestSubmissionRow[]
}

export async function upsertQuestSubmission(
  userId: string,
  questId: string,
  data: {
    submitted_answer?: string
    is_correct?: boolean
    retries_used?: number
    completed?: boolean
    xp_earned?: number
  }
): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) return false

  const { error } = await supabase.from("quest_submissions").upsert(
    {
      user_id: userId,
      quest_id: questId,
      submitted_answer: data.submitted_answer ?? "",
      is_correct: data.is_correct ?? false,
      retries_used: data.retries_used ?? 0,
      completed: data.completed ?? false,
      xp_earned: data.xp_earned ?? 0,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id, quest_id" }
  )

  return !error
}

// ─── Topic Progress ─────────────────────────────────────────────────────────

export async function loadTopicProgress(userId: string): Promise<TopicProgressRow[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data } = await supabase
    .from("topic_progress")
    .select("*")
    .eq("user_id", userId)

  return (data ?? []) as TopicProgressRow[]
}

export async function upsertTopicProgress(
  userId: string,
  topicId: string,
  data: {
    completed?: boolean
    quests_completed?: number
    total_quests?: number
    xp_earned?: number
  }
): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) return false

  const { error } = await supabase.from("topic_progress").upsert(
    {
      user_id: userId,
      topic_id: topicId,
      completed: data.completed ?? false,
      quests_completed: data.quests_completed ?? 0,
      total_quests: data.total_quests ?? 0,
      xp_earned: data.xp_earned ?? 0,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id, topic_id" }
  )

  return !error
}

// ─── Module Progress ────────────────────────────────────────────────────────

export async function loadModuleProgress(userId: string): Promise<ModuleProgressRow[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  const { data } = await supabase
    .from("module_progress")
    .select("*")
    .eq("user_id", userId)

  return (data ?? []) as ModuleProgressRow[]
}

export async function upsertModuleProgress(
  userId: string,
  moduleId: string,
  data: { completed?: boolean }
): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) return false

  const { error } = await supabase.from("module_progress").upsert(
    {
      user_id: userId,
      module_id: moduleId,
      completed: data.completed ?? false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id, module_id" }
  )

  return !error
}

// ─── User Profile (XP / Coins / Streak) ─────────────────────────────────────

export async function updateUserProfileProgress(
  userId: string,
  data: {
    xp?: number
    analytics_coins?: number
    streak_days?: number
    lessons_completed?: number
  }
): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) return false

  const { error } = await supabase
    .from("profiles")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  return !error
}
