"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Trophy, Zap, Coins, ArrowRight, Sparkles, Shield,
  Map, Target, Flame, BookOpen, Swords, Medal, BarChart3,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/useAuthStore"
import { useGamificationStore } from "@/store/useGamificationStore"
import { useCurriculumStore } from "@/store/useCurriculumStore"
import { cn } from "@/lib/utils"

type Rank = "Novice" | "Apprentice" | "Analyst" | "Specialist" | "Master"

const rankData: { level: number; label: Rank; color: string }[] = [
  { level: 1, label: "Novice", color: "text-zinc-400" },
  { level: 5, label: "Apprentice", color: "text-blue-400" },
  { level: 10, label: "Analyst", color: "text-emerald-400" },
  { level: 20, label: "Specialist", color: "text-purple-400" },
  { level: 35, label: "Master", color: "text-yellow-400" },
]

function getRank(level: number): { label: Rank; color: string } {
  let current = rankData[0]
  for (const r of rankData) {
    if (level >= r.level) current = r
  }
  return current
}

function getCurrentMission(totalXP: number): { title: string; href: string; icon: React.ElementType } {
  if (totalXP < 100) return { title: "Begin Phase 1 — Data Foundations", href: "/phases/phase-1", icon: BookOpen }
  if (totalXP < 500) return { title: "Complete Module: Business Thinking", href: "/modules/mod-1-2", icon: Target }
  if (totalXP < 1000) return { title: "Master Problem Solving Quest", href: "/modules/mod-1-3", icon: Swords }
  return { title: "Explore Phase 2", href: "/phases/phase-2", icon: Map }
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, initialize } = useAuthStore()
  const {
    totalXP, currentLevel, xpInCurrentLevel, streak, coins,
    dailyQuests, setXP, setStreak, setCoins,
    completeDailyQuest, getXpForNextLevel,
  } = useGamificationStore()
  const { phases } = useCurriculumStore()
  const [ready, setReady] = useState(false)

  useEffect(() => { initialize() }, [initialize])

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) router.push("/login?redirect=/dashboard")
      else setReady(true)
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      setXP(user.xp)
      setStreak(user.streak_days)
      setCoins(user.analytics_coins)
    }
  }, [user, setXP, setStreak, setCoins])

  if (!ready) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="size-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          Initializing mission control...
        </div>
      </div>
    )
  }

  if (!user) return null

  const xpForNext = getXpForNextLevel()
  const levelProgress = Math.round((xpInCurrentLevel / xpForNext) * 100)
  const activeDQ = dailyQuests.filter((q) => !q.completed).length
  const rank = getRank(currentLevel)
  const mission = getCurrentMission(totalXP)
  const MissionIcon = mission.icon

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Commander's Briefing */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 via-background to-blue-950/40 p-6 sm:p-8">
        <div className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 size-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-indigo-400">
              <Shield className="size-3" /> Mission Control
            </div>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                {user.full_name || user.username}
              </span>
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className={cn("font-semibold", rank.color)}>
                {rank.label} Agent
              </span>
              <span className="text-muted-foreground/40">|</span>
              <span className="flex items-center gap-1">
                <Flame className="size-3.5 text-orange-500" />
                {streak} day streak
              </span>
              <span className="text-muted-foreground/40">|</span>
              <span className="flex items-center gap-1">
                <Coins className="size-3.5 text-emerald-500" />
                {coins} coins
              </span>
            </div>
          </div>
          <Link
            href={mission.href}
            className="group inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-2.5 text-sm font-medium text-indigo-300 transition-all hover:bg-indigo-500/20 hover:text-indigo-200"
          >
            <MissionIcon className="size-4" />
            <span className="hidden sm:inline">Current Mission:</span> {mission.title}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 transition-all hover:border-indigo-500/30">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <Trophy className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Level</p>
              <p className="text-xl font-bold">{currentLevel}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 transition-all hover:border-indigo-500/30">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-11 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-500">
              <Zap className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total XP</p>
              <p className="text-xl font-bold">{totalXP}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 transition-all hover:border-indigo-500/30">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Shield className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Rank</p>
              <p className={cn("text-xl font-bold", rank.color)}>{rank.label}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 transition-all hover:border-indigo-500/30">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
              <Target className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Active Quests</p>
              <p className="text-xl font-bold">{activeDQ}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* XP Progress + Continue Journey Row */}
      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 via-background to-blue-500/5">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Level {currentLevel} Progress
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {xpInCurrentLevel} / {xpForNext} XP to Level {currentLevel + 1}
                  </p>
                </div>
                <span className="text-lg font-bold text-indigo-400">{levelProgress}%</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-700"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <Link href="/phases">
          <Card className="group h-full cursor-pointer border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-blue-500/5 transition-all hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10">
            <CardContent className="flex h-full items-center justify-between p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">Continue Journey</p>
                <p className="mt-0.5 text-sm text-muted-foreground">Open the quest map</p>
              </div>
              <ArrowRight className="size-5 text-indigo-400 transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Phase Progress Cards */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Curriculum Progress</h2>
          <Link
            href="/phases"
            className="flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300"
          >
            View Journey Map <Map className="size-3.5" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {phases.map((phase, idx) => {
            const unlocked = currentLevel >= phase.unlock_level
            const moduleProgress = phase.modules.length > 0
              ? Math.round(
                  (phase.modules.filter((m) => currentLevel >= m.unlock_level).length /
                    phase.modules.length) *
                    100
                )
              : 0

            const phaseColors = [
              { from: "from-indigo-500/20", to: "to-blue-500/10", dot: "bg-indigo-500" },
              { from: "from-purple-500/20", to: "to-pink-500/10", dot: "bg-purple-500" },
              { from: "from-emerald-500/20", to: "to-teal-500/10", dot: "bg-emerald-500" },
              { from: "from-blue-500/20", to: "to-cyan-500/10", dot: "bg-blue-500" },
            ]
            const c = phaseColors[idx] ?? phaseColors[0]

            return (
              <Link key={phase.id} href={unlocked ? `/phases/${phase.id}` : "#"}>
                <Card
                  className={cn(
                    "group relative overflow-hidden border-border/50 transition-all",
                    unlocked
                      ? "cursor-pointer hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5"
                      : "cursor-not-allowed opacity-50",
                  )}
                >
                  <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-30", c.from, c.to)} />
                  <CardContent className="relative p-4">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2 w-2 rounded-full", unlocked ? c.dot : "bg-muted-foreground")} />
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Phase {phase.order_index}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm font-semibold leading-tight">{phase.title}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{phase.modules.length} module{phase.modules.length !== 1 ? "s" : ""}</span>
                      {phase.modules.length > 0 && (
                        <>
                          <span className="text-muted-foreground/30">·</span>
                          <span className="font-medium" style={{ color: unlocked ? undefined : undefined }}>
                            {moduleProgress}%
                          </span>
                        </>
                      )}
                    </div>
                    {unlocked && phase.modules.length > 0 && (
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn("h-full rounded-full transition-all", c.dot.replace("bg-", "bg-"))}
                          style={{ width: `${moduleProgress}%` }}
                        />
                      </div>
                    )}
                    {!unlocked && (
                      <p className="mt-2 text-[10px] font-medium text-indigo-400">
                        Unlocks Lv.{phase.unlock_level}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Daily Quests Row */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="size-4 text-orange-500" />
          <h2 className="text-lg font-semibold">Daily Quests</h2>
          {activeDQ > 0 && (
            <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-medium text-orange-500">
              {activeDQ} active
            </span>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dailyQuests.map((quest) => (
            <Card
              key={quest.id}
              className={cn(
                "transition-all",
                quest.completed ? "border-emerald-500/30 opacity-60" : "border-border/50 hover:border-indigo-500/30"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm font-medium", quest.completed && "line-through")}>{quest.title}</p>
                    <p className="text-xs text-muted-foreground">{quest.description}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Zap className="size-3 text-yellow-500" /> {quest.xpReward} XP
                      </span>
                      <span className="flex items-center gap-1">
                        <Coins className="size-3 text-emerald-500" /> {quest.coinReward}
                      </span>
                    </div>
                  </div>
                  {!quest.completed && (
                    <button
                      onClick={() => completeDailyQuest(quest.id)}
                      className="shrink-0 rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-indigo-500"
                    >
                      Complete
                    </button>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        quest.completed ? "bg-emerald-500" : "bg-indigo-500"
                      )}
                      style={{ width: `${Math.min((quest.progress / quest.target) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{quest.progress}/{quest.target}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Gamification Hub */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Gamification Hub</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/achievements">
            <Card className="group border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-transparent hover:border-yellow-500/40 transition-all h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <Trophy className="size-8 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Achievements</p>
                  <p className="text-xs text-muted-foreground">Track your progress</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/skills">
            <Card className="group border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent hover:border-purple-500/40 transition-all h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <BarChart3 className="size-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Skill Tree</p>
                  <p className="text-xs text-muted-foreground">Master each discipline</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/leaderboard">
            <Card className="group border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-transparent hover:border-indigo-500/40 transition-all h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <Medal className="size-8 text-indigo-500" />
                <div>
                  <p className="text-sm font-medium">Leaderboard</p>
                  <p className="text-xs text-muted-foreground">Compete with peers</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/projects">
            <Card className="group border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent hover:border-emerald-500/40 transition-all h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <Swords className="size-8 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium">Projects</p>
                  <p className="text-xs text-muted-foreground">Build your portfolio</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
