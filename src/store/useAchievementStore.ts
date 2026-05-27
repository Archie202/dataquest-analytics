import { create } from "zustand"
import { achievementDefs, type AchievementDef, type UserAchievementState } from "@/data/gamification/achievements"
import { getSupabaseClient } from "@/lib/supabase"

function getClient() {
  const client = getSupabaseClient()
  if (!client) throw new Error("Supabase client not initialized")
  return client
}

interface AchievementStore {
  userAchievements: Map<string, UserAchievementState>
  loading: boolean
  loadUserAchievements: (userId: string) => Promise<void>
  getAchievement: (id: string) => AchievementDef | undefined
  getAllAchievements: () => AchievementDef[]
  claimAchievement: (achievementId: string) => Promise<void>
  checkAndUnlock: (userId: string, criteria: Record<string, unknown>) => Promise<void>
}

export const useAchievementStore = create<AchievementStore>((set, get) => ({
  userAchievements: new Map(),
  loading: false,

  loadUserAchievements: async (userId: string) => {
    set({ loading: true })
    const { data } = await getClient()
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId)

    const map = new Map<string, UserAchievementState>()
    if (data) {
      for (const row of data) {
        map.set(row.achievement_id, {
          achievementId: row.achievement_id,
          progress: row.progress,
          target: row.target,
          unlocked: row.unlocked,
          claimed: row.claimed,
          unlockedAt: row.unlocked_at,
          claimedAt: row.claimed_at,
        })
      }
    }
    for (const def of achievementDefs) {
      if (!map.has(def.id)) {
        map.set(def.id, {
          achievementId: def.id,
          progress: 0,
          target: (def.criteria.target as number) || 1,
          unlocked: false,
          claimed: false,
        })
      }
    }
    set({ userAchievements: map, loading: false })
  },

  getAchievement: (id: string) => achievementDefs.find((a) => a.id === id),
  getAllAchievements: () => achievementDefs,

  claimAchievement: async (achievementId: string) => {
    const ua = get().userAchievements.get(achievementId)
    if (!ua || !ua.unlocked || ua.claimed) return

    const userId = (await getClient().auth.getUser()).data.user?.id
    if (!userId) return

    await getClient()
      .from("user_achievements")
      .update({ claimed: true, claimed_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("achievement_id", achievementId)

    const def = achievementDefs.find((a) => a.id === achievementId)
    if (def) {
      await getClient().rpc("add_xp", {
        p_user_id: userId,
        p_xp: def.xp_reward,
        p_reason: `achievement: ${def.title}`,
      })
    }

    set((s) => {
      const next = new Map(s.userAchievements)
      const existing = next.get(achievementId)
      if (existing) {
        next.set(achievementId, {
          ...existing,
          claimed: true,
          claimedAt: new Date().toISOString(),
        })
      }
      return { userAchievements: next }
    })
  },

  checkAndUnlock: async (userId: string, criteria: Record<string, unknown>) => {
    for (const def of achievementDefs) {
      const ua = get().userAchievements.get(def.id)
      if (!ua || ua.unlocked) continue

      let match = true
      for (const [key, value] of Object.entries(def.criteria)) {
        if (criteria[key] !== value) {
          match = false
          break
        }
      }
      if (!match) continue

      const { data: existing } = await getClient()
        .from("user_achievements")
        .select("id")
        .eq("user_id", userId)
        .eq("achievement_id", def.id)
        .maybeSingle()

      if (!existing) {
        await getClient().from("user_achievements").insert({
          user_id: userId,
          achievement_id: def.id,
          progress: (def.criteria.target as number) || 1,
          target: (def.criteria.target as number) || 1,
          unlocked: true,
          unlocked_at: new Date().toISOString(),
        })
        await getClient().from("notifications").insert({
          user_id: userId,
          title: "Achievement Unlocked!",
          message: `You unlocked "${def.title}"`,
          type: "achievement",
        })
      }

      set((s) => {
        const next = new Map(s.userAchievements)
        next.set(def.id, {
          achievementId: def.id,
          progress: (def.criteria.target as number) || 1,
          target: (def.criteria.target as number) || 1,
          unlocked: true,
          claimed: false,
          unlockedAt: new Date().toISOString(),
        })
        return { userAchievements: next }
      })
    }
  },
}))
