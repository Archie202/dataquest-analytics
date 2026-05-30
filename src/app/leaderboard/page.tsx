"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuthStore } from "@/store/useAuthStore"
import { Medal, Crown, TrendingUp, ArrowLeft, Loader2, Trophy, Star, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface LeaderboardEntry {
  id: string
  username: string
  avatar_url: string | null
  xp: number
  level: number
  streak_days: number
}

const rankIcons = [
  <Crown key="1" className="size-5 text-yellow-500" />,
  <Medal key="2" className="size-5 text-zinc-300" />,
  <Medal key="3" className="size-5 text-amber-700" />,
]

export default function LeaderboardPage() {
  const { user } = useAuthStore()
  const [data, setData] = useState<{ leaderboard: LeaderboardEntry[]; currentUserRank: number; currentUserId: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error)
        setData(d)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <Link href="/dashboard" className="text-sm text-indigo-400 hover:text-indigo-300">Back to Dashboard</Link>
      </div>
    )
  }

  if (!data) return null

  const topThree = data.leaderboard.slice(0, 3)
  const rest = data.leaderboard.slice(3)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Leaderboard
          </h1>
          <p className="text-zinc-400 mt-1">Top data analysts this month</p>
        </div>
        <span className="text-sm text-zinc-500">Your rank: #{data.currentUserRank}</span>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4 items-end">
        {[1, 0, 2].map((idx) => {
          const entry = topThree[idx]
          if (!entry) {
            return <div key={idx} className="h-24 rounded-xl bg-zinc-900/50 border border-zinc-800" />
          }
          const heights = ["h-32", "h-40", "h-28"]
          const isCurrentUser = entry.id === data.currentUserId
          return (
            <div key={entry.id} className={cn("flex flex-col items-center gap-2", heights[idx])}>
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2",
                isCurrentUser ? "border-indigo-500 bg-indigo-500/20" : "border-zinc-700 bg-zinc-800"
              )}>
                {entry.avatar_url ? (
                  <img src={entry.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  entry.username?.charAt(0).toUpperCase() || "?"
                )}
              </div>
              <p className={cn("text-sm font-medium truncate max-w-[100px] text-center", isCurrentUser && "text-indigo-400")}>
                {entry.username || "Anonymous"}
              </p>
              <p className="text-xs text-zinc-400">Lv.{entry.level} &middot; {entry.xp} XP</p>
              {rankIcons[idx]}
            </div>
          )
        })}
      </div>

      {/* Full leaderboard */}
      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <div className="p-4 bg-zinc-900/50 border-b border-zinc-800">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            All Rankings
          </h2>
        </div>
        {data.leaderboard.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No data yet. Complete a quest to get on the board!</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {rest.map((entry, idx) => {
              const rank = idx + 4
              const isCurrentUser = entry.id === data.currentUserId
              return (
                <div
                  key={entry.id}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 transition-colors",
                    isCurrentUser ? "bg-indigo-500/5" : "hover:bg-zinc-900/50"
                  )}
                >
                  <span className={cn(
                    "w-8 text-center text-sm font-medium",
                    rank <= 10 ? "text-zinc-300" : "text-zinc-600"
                  )}>
                    #{rank}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
                    {entry.avatar_url ? (
                      <img src={entry.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      entry.username?.charAt(0).toUpperCase() || "?"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium truncate", isCurrentUser && "text-indigo-400")}>
                      {entry.username || "Anonymous"}
                    </p>
                    <p className="text-xs text-zinc-500">Level {entry.level}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 text-yellow-500">
                      <Zap className="w-3.5 h-3.5" /> {entry.xp}
                    </span>
                    {entry.streak_days > 0 && (
                      <span className="flex items-center gap-1 text-orange-500 text-xs">
                        <span className="text-orange-500">{entry.streak_days}d</span>
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="text-center">
        <Link
          href="/dashboard"
          className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
