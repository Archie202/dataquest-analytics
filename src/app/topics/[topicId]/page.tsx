"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, BookOpen, Target, Zap, ChevronRight, Trophy, Terminal, Database, Calculator, ExternalLink } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { useGamificationStore } from "@/store/useGamificationStore"
import { useCurriculumStore } from "@/store/useCurriculumStore"
import { LessonPanel } from "@/components/curriculum/LessonPanel"
import { QuestPanel } from "@/components/curriculum/QuestPanel"
import { SqlLab } from "@/components/practice/SqlLab"
import { PythonLab } from "@/components/practice/PythonLab"
import { ExcelSimulator } from "@/components/practice/ExcelSimulator"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Tab = "lesson" | "quests" | "practice"

export default function TopicDetailPage() {
  const router = useRouter()
  const params = useParams()
  const topicId = params.topicId as string
  const { user, initialize: initAuth } = useAuthStore()
  const { addXP, setCoinsDelta, hydrate: hydrateGamification } = useGamificationStore()
  const { getTopic, getModule, progress, completeQuest, hydrateProgress } = useCurriculumStore()
  const [ready, setReady] = useState(false)
  const [tab, setTab] = useState<Tab>("lesson")
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => { initAuth() }, [initAuth])

  // Hydrate progress from Supabase when user is available
  useEffect(() => {
    if (user) {
      hydrateProgress(user.id)
      hydrateGamification(user.id, user.xp ?? 0, user.analytics_coins ?? 0, user.streak_days ?? 0)
      setReady(true)
    } else {
      const check = setTimeout(() => setReady(true), 500)
      return () => clearTimeout(check)
    }
  }, [user, hydrateProgress, hydrateGamification])

  const topic = getTopic(topicId)
  const mod = topic ? getModule(topic.module_id) : undefined

  const topicProgress = progress[topicId]
  const completedQuests = topicProgress?.completed_quests ?? []
  const allCompleted = topicProgress?.completed ?? false
  const totalQuests = topic?.quests.length ?? 0

  const practiceQuest = topic?.quests.find((q) => q.practiceType)
  const practiceType = practiceQuest?.practiceType
  const hasPractice = !!practiceType

  const handleCompleteQuest = (questId: string) => {
    if (completedQuests.includes(questId)) return
    const quest = topic?.quests.find((q) => q.id === questId)
    if (!quest) return
    completeQuest(topicId, questId)
    addXP(quest.xp_reward)
    setCoinsDelta(Math.round(quest.xp_reward / 5))
    setToast(`+${quest.xp_reward} XP earned!`)
    setTimeout(() => setToast(null), 2500)
  }

  const handlePracticeComplete = (xp: number) => {
    addXP(xp)
    setCoinsDelta(Math.round(xp / 5))
    setToast(`+${xp} XP from practice lab!`)
    setTimeout(() => setToast(null), 3000)
  }

  if (!ready) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  if (!topic || !mod) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <BookOpen className="mx-auto size-12 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-bold">Topic not found</h1>
        <p className="mt-2 text-muted-foreground">This topic doesn&apos;t exist.</p>
        <Link href="/phases" className="mt-6 inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300">
          <ArrowLeft className="size-4" /> Back to Journey Map
        </Link>
      </div>
    )
  }

  const xpEarned = topicProgress?.xp_earned ?? 0
  const questsCompleted = completedQuests.length

  const practiceIcons = { sql: Database, python: Terminal, excel: Calculator }
  const practiceColors = { sql: "text-indigo-400", python: "text-purple-400", excel: "text-emerald-400" }
  const PracticeIcon = practiceType ? practiceIcons[practiceType] : null

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right-4 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/phases" className="hover:text-foreground">Phases</Link>
        <ChevronRight className="size-3" />
        <Link href={`/phases/${mod.phase_id}`} className="hover:text-foreground truncate max-w-[120px]">Phase</Link>
        <ChevronRight className="size-3" />
        <Link href={`/modules/${mod.id}`} className="hover:text-foreground truncate max-w-[150px]">{mod.title}</Link>
        <ChevronRight className="size-3" />
        <span className="text-foreground font-medium truncate max-w-[200px]">{topic.title}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{topic.title}</h1>
          <p className="mt-1 text-muted-foreground">{mod.title} · Module {mod.order_index}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm">
            <Zap className="size-4 text-yellow-500" />
            <span className="font-medium text-yellow-500">{topic.xp_reward} XP</span>
          </div>
          {allCompleted && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
              <Trophy className="size-3" /> Completed
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 mb-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Quest Progress</span>
          <span>{questsCompleted}/{totalQuests} completed</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all duration-500", allCompleted ? "bg-emerald-500" : "bg-indigo-500")}
            style={{ width: `${totalQuests > 0 ? Math.round((questsCompleted / totalQuests) * 100) : 0}%` }}
          />
        </div>
      </div>

      {/* Tab switcher */}
      <div className="mb-6 flex gap-1 rounded-xl bg-muted p-1">
        {[
          { id: "lesson" as Tab, label: "Lesson", icon: BookOpen },
          { id: "quests" as Tab, label: "Quests", icon: Target },
          ...(hasPractice && PracticeIcon ? [{ id: "practice" as Tab, label: "Practice Lab", icon: PracticeIcon }] : []),
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              tab === t.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <t.icon className={cn("size-4", tab === t.id && practiceType && practiceColors[practiceType])} />
            {t.label}
            {t.id === "quests" && totalQuests > 0 && (
              <span className="ml-1 rounded-full bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-500">
                {totalQuests}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {tab === "lesson" ? (
            <LessonPanel content={topic.lesson_content} />
          ) : tab === "practice" && practiceQuest ? (
            practiceType === "sql" ? (
              <SqlLab
                questTitle={practiceQuest.title}
                questInstructions={practiceQuest.instructions}
                onComplete={handlePracticeComplete}
                xpReward={practiceQuest.xp_reward}
              />
            ) : practiceType === "python" ? (
              <PythonLab
                questTitle={practiceQuest.title}
                questInstructions={practiceQuest.instructions}
                onComplete={handlePracticeComplete}
                xpReward={practiceQuest.xp_reward}
              />
            ) : practiceType === "excel" ? (
              <ExcelSimulator
                questTitle={practiceQuest.title}
                questInstructions={practiceQuest.instructions}
                onComplete={handlePracticeComplete}
                xpReward={practiceQuest.xp_reward}
              />
            ) : null
          ) : (
            <QuestPanel
              quests={topic.quests}
              completedQuests={completedQuests}
              onComplete={handleCompleteQuest}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="border-indigo-500/20 bg-indigo-500/5">
            <CardContent className="p-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-indigo-400">
                <Trophy className="size-4" /> Rewards
              </h4>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Topic XP</span>
                  <span className="font-medium text-yellow-500">{topic.xp_reward} XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Earned</span>
                  <span className="font-medium text-emerald-500">{xpEarned} XP</span>
                </div>
                {totalQuests > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quests Done</span>
                    <span className="font-medium">{questsCompleted}/{totalQuests}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Practice lab shortcut */}
          {hasPractice && practiceQuest && (
            <Card
              className={cn(
                "border transition-all cursor-pointer hover:shadow-md",
                practiceType === "sql" && "border-indigo-500/20 bg-indigo-500/5",
                practiceType === "python" && "border-purple-500/20 bg-purple-500/5",
                practiceType === "excel" && "border-emerald-500/20 bg-emerald-500/5",
              )}
            >
              <CardContent
                className="p-4"
                onClick={() => setTab("practice")}
              >
                <div className="flex items-center gap-2">
                  {PracticeIcon && <PracticeIcon className={cn("size-4", practiceColors[practiceType])} />}
                  <h4 className={cn("text-sm font-semibold", practiceColors[practiceType])}>
                    Practice Lab
                  </h4>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{practiceQuest.title}</p>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Zap className="size-3 text-yellow-500" /> {practiceQuest.xp_reward} XP
                  <span className="flex items-center gap-0.5 ml-auto" style={{ color: practiceType ? practiceColors[practiceType].replace("text-", "") : undefined }}>
                    Open Lab <ExternalLink className="size-3" />
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {allCompleted && (
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardContent className="p-4 text-center">
                <Trophy className="mx-auto size-8 text-emerald-500" />
                <h4 className="mt-2 text-sm font-semibold text-emerald-500">Topic Complete!</h4>
                <p className="mt-1 text-xs text-muted-foreground">You&apos;ve mastered this topic.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
