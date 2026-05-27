"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, BookOpen } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { useGamificationStore } from "@/store/useGamificationStore"
import { useCurriculumStore } from "@/store/useCurriculumStore"
import { TopicCard } from "@/components/curriculum/TopicCard"
import Link from "next/link"

export default function ModuleDetailPage() {
  const router = useRouter()
  const params = useParams()
  const moduleId = params.moduleId as string
  const { initialize } = useAuthStore()
  const { currentLevel } = useGamificationStore()
  const { getModule, isModuleUnlocked, progress } = useCurriculumStore()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    setReady(true)
  }, [])

  const mod = getModule(moduleId)

  if (!ready) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  if (!mod) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <BookOpen className="mx-auto size-12 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-bold">Module not found</h1>
        <p className="mt-2 text-muted-foreground">This module doesn&apos;t exist or hasn&apos;t been released yet.</p>
        <Link href="/phases" className="mt-6 inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300">
          <ArrowLeft className="size-4" /> Back to Learning Map
        </Link>
      </div>
    )
  }

  const unlocked = isModuleUnlocked(mod, currentLevel)

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <BookOpen className="mx-auto size-12 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-bold">Module Locked</h1>
        <p className="mt-2 text-muted-foreground">
          Reach Level {mod.unlock_level} to unlock &ldquo;{mod.title}&rdquo;.
        </p>
        <Link href="/phases" className="mt-6 inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300">
          <ArrowLeft className="size-4" /> Back to Learning Map
        </Link>
      </div>
    )
  }

  const completedCount = mod.topics.filter((t) => progress[t.id]?.completed).length
  const totalCount = mod.topics.length
  const totalXp = mod.topics.reduce((sum, t) => sum + t.xp_reward, 0)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-2">
        <Link href={`/phases/${mod.phase_id}`} className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent">
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Module {mod.order_index}
          </p>
          <h1 className="text-2xl font-bold sm:text-3xl">{mod.title}</h1>
          <p className="mt-1 text-muted-foreground">{mod.description}</p>
        </div>
      </div>

      <div className="mt-4 mb-8 flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-muted/30 p-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Progress:</span>
          <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%` }}
            />
          </div>
          <span className="font-medium text-indigo-400">{completedCount}/{totalCount}</span>
        </div>
        <span className="text-sm text-muted-foreground">·</span>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <span className="font-medium text-yellow-500">{totalXp}</span> total XP
        </span>
      </div>

      <div className="space-y-3">
        {mod.topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            userLevel={currentLevel}
            progress={progress[topic.id]}
          />
        ))}
      </div>
    </div>
  )
}
