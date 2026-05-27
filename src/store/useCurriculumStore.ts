import { create } from "zustand"
import type { Phase, Module, Topic, Quest, UserProgressEntry } from "@/types/curriculum"
import { seedPhases } from "@/data/seed-curriculum"
import { loadQuestSubmissions, loadTopicProgress, upsertQuestSubmission, upsertTopicProgress } from "@/lib/supabase-progress"

interface CurriculumStore {
  phases: Phase[]
  progress: Record<string, UserProgressEntry>
  questCompletions: Record<string, { completed: boolean; xp_earned: number; retries_used: number }>
  isLoading: boolean
  userId: string | null
  setPhases: (phases: Phase[]) => void
  setProgress: (progress: Record<string, UserProgressEntry>) => void
  getPhase: (id: string) => Phase | undefined
  getModule: (id: string) => Module | undefined
  getTopic: (id: string) => Topic | undefined
  getTopicsByModule: (moduleId: string) => Topic[]
  isTopicUnlocked: (topic: Topic, userLevel: number) => boolean
  isModuleUnlocked: (mod: Module, userLevel: number) => boolean
  isPhaseUnlocked: (phase: Phase, userLevel: number) => boolean
  completeQuest: (topicId: string, questId: string, retriesUsed?: number) => void
  hydrateProgress: (userId: string) => Promise<void>
  isQuestCompleted: (questId: string) => boolean
  getQuestXpEarned: (questId: string) => number
  getQuestRetriesUsed: (questId: string) => number
}

export const useCurriculumStore = create<CurriculumStore>((set, get) => ({
  phases: seedPhases,
  progress: {},
  questCompletions: {},
  isLoading: false,
  userId: null,

  setPhases: (phases) => set({ phases }),
  setProgress: (progress) => set({ progress }),

  getPhase: (id) => get().phases.find((p) => p.id === id),

  getModule: (id) => {
    for (const phase of get().phases) {
      const mod = phase.modules.find((m) => m.id === id)
      if (mod) return mod
    }
    return undefined
  },

  getTopic: (id) => {
    for (const phase of get().phases) {
      for (const mod of phase.modules) {
        const topic = mod.topics.find((t) => t.id === id)
        if (topic) return topic
      }
    }
    return undefined
  },

  getTopicsByModule: (moduleId) => {
    const mod = get().getModule(moduleId)
    return mod?.topics ?? []
  },

  isTopicUnlocked: (topic, userLevel) => userLevel >= topic.unlock_level,
  isModuleUnlocked: (mod, userLevel) => userLevel >= mod.unlock_level,
  isPhaseUnlocked: (phase, userLevel) => userLevel >= phase.unlock_level,

  isQuestCompleted: (questId) => {
    return get().questCompletions[questId]?.completed ?? false
  },

  getQuestXpEarned: (questId) => {
    return get().questCompletions[questId]?.xp_earned ?? 0
  },

  getQuestRetriesUsed: (questId) => {
    return get().questCompletions[questId]?.retries_used ?? 0
  },

  hydrateProgress: async (userId) => {
    set({ isLoading: true })
    try {
      const [submissions, topicProgress] = await Promise.all([
        loadQuestSubmissions(userId),
        loadTopicProgress(userId),
      ])

      // Build questCompletions from submissions
      const questCompletions: Record<string, { completed: boolean; xp_earned: number; retries_used: number }> = {}
      for (const sub of submissions) {
        questCompletions[sub.quest_id] = {
          completed: sub.completed,
          xp_earned: sub.xp_earned,
          retries_used: sub.retries_used,
        }
      }

      // Build progress from topic_progress
      const progress: Record<string, UserProgressEntry> = {}
      for (const tp of topicProgress) {
        const topic = getPhaseForTopic(tp.topic_id, get().phases)
        const allQuestIds = topic?.modules.flatMap((m) => m.topics).find((t) => t.id === tp.topic_id)?.quests.map((q) => q.id) ?? []
        const completedQuestIds = allQuestIds.filter((qid) => questCompletions[qid]?.completed)

        progress[tp.topic_id] = {
          user_id: userId,
          topic_id: tp.topic_id,
          completed: tp.completed,
          completed_quests: completedQuestIds,
          xp_earned: tp.xp_earned,
          updated_at: tp.updated_at,
        }
      }

      set({ questCompletions, progress, userId, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  completeQuest: (topicId, questId, retriesUsed = 0) => {
    set((state) => {
      const existing = state.progress[topicId]
      const completedQuests = existing?.completed_quests ?? []
      if (completedQuests.includes(questId)) return state

      const quest = getPhaseForTopic(topicId, state.phases)
        ?.modules.flatMap((m) => m.topics)
        .find((t) => t.id === topicId)
        ?.quests.find((q) => q.id === questId)

      const xpEarned = quest?.xp_reward ?? 0

      const newCompletedQuests = [...completedQuests, questId]
      const totalQuests = getPhaseForTopic(topicId, state.phases)
        ?.modules.flatMap((m) => m.topics)
        .find((t) => t.id === topicId)?.quests.length ?? 0
      const isTopicComplete = newCompletedQuests.length >= totalQuests

      // Persist to Supabase (fire and forget)
      const uid = state.userId
      if (uid) {
        upsertQuestSubmission(uid, questId, {
          is_correct: true,
          completed: true,
          xp_earned: xpEarned,
          retries_used: retriesUsed,
        })
        upsertTopicProgress(uid, topicId, {
          completed: isTopicComplete,
          quests_completed: newCompletedQuests.length,
          total_quests: totalQuests,
          xp_earned: (existing?.xp_earned ?? 0) + xpEarned,
        })
      }

      return {
        questCompletions: {
          ...state.questCompletions,
          [questId]: {
            completed: true,
            xp_earned: xpEarned,
            retries_used: 0,
          },
        },
        progress: {
          ...state.progress,
          [topicId]: {
            user_id: uid ?? "",
            topic_id: topicId,
            completed: isTopicComplete,
            completed_quests: newCompletedQuests,
            xp_earned: (existing?.xp_earned ?? 0) + xpEarned,
            updated_at: new Date().toISOString(),
          },
        },
      }
    })
  },
}))

function getPhaseForTopic(topicId: string, phases: Phase[]) {
  for (const phase of phases) {
    for (const mod of phase.modules) {
      if (mod.topics.some((t) => t.id === topicId)) return phase
    }
  }
  return undefined
}
