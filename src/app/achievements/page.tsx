"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useAuthStore } from "@/store/useAuthStore"
import { useAchievementStore } from "@/store/useAchievementStore"
import { usePageTitle } from "@/lib/usePageTitle"
import { rarityColors, rarityStars, categoryIcons } from "@/data/gamification/achievements"
import { Loader2, Lock, ChevronRight, Award } from "lucide-react"

const categoryLabels: Record<string, string> = {
  curriculum: "Curriculum",
  social: "Social",
  speed: "Speed",
  special: "Special",
}

export default function AchievementsPage() {
  usePageTitle("Achievements")
  const { user } = useAuthStore()
  const { userAchievements, getAllAchievements, loadUserAchievements, claimAchievement, loading } = useAchievementStore()

  useEffect(() => {
    if (user) loadUserAchievements(user.id)
  }, [user, loadUserAchievements])

  const defs = getAllAchievements()
  const sorted = [...defs].sort((a, b) => a.category.localeCompare(b.category) || a.rarity.localeCompare(b.rarity))

  const unlockedCount = Array.from(userAchievements.values()).filter((ua) => ua.unlocked).length
  const totalCount = defs.length

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Award className="w-8 h-8 text-yellow-400" />
            Achievements
          </h1>
          <p className="text-zinc-400 mt-1">
            {unlockedCount} / {totalCount} unlocked
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {(["common", "uncommon", "rare", "epic", "legendary"] as const).map((r) => (
            <span key={r} className={`px-2 py-0.5 rounded text-xs font-medium ${rarityColors[r]}`}>
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
          style={{ width: `${totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0}%` }}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      ) : (
        <div className="grid gap-3">
          {sorted.map((def) => {
            const ua = userAchievements.get(def.id)
            if (!ua) return null

            return (
              <div
                key={def.id}
                className={`group relative rounded-xl border p-4 transition-all ${
                  ua.unlocked
                    ? rarityColors[def.rarity] + " border-opacity-50"
                    : "border-zinc-800 bg-zinc-900/50 opacity-60"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg ${
                    ua.unlocked ? "bg-zinc-800" : "bg-zinc-800/50"
                  }`}>
                    {ua.unlocked ? (
                      <span className={rarityColors[def.rarity].split(" ")[0]}>{rarityStars[def.rarity]}</span>
                    ) : (
                      <Lock className="w-5 h-5 text-zinc-600" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{def.title}</h3>
                      <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${rarityColors[def.rarity]}`}>
                        {def.rarity}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 truncate">{def.description}</p>
                  </div>

                  {/* Progress / Claim */}
                  <div className="flex items-center gap-4 shrink-0">
                    {!ua.unlocked ? (
                      <div className="text-right">
                        <div className="text-xs text-zinc-500">Progress</div>
                        <div className="text-sm font-medium">{ua.progress}/{ua.target}</div>
                        <div className="w-20 h-1.5 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-zinc-600 rounded-full"
                            style={{ width: `${ua.target > 0 ? (ua.progress / ua.target) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ) : ua.claimed ? (
                      <span className="text-xs text-emerald-400 font-medium">Claimed</span>
                    ) : (
                      <button
                        onClick={() => claimAchievement(def.id)}
                        className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-medium rounded-lg transition-colors"
                      >
                        Claim +{def.xp_reward} XP
                      </button>
                    )}
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="text-center pt-4">
        <Link
          href="/dashboard"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
