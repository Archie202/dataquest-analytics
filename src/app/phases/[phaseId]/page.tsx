"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Compass } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { useGamificationStore } from "@/store/useGamificationStore"
import { useCurriculumStore } from "@/store/useCurriculumStore"
import { ModuleCard } from "@/components/curriculum/ModuleCard"
import Link from "next/link"

export default function PhaseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const phaseId = params.phaseId as string
  const { initialize } = useAuthStore()
  const { currentLevel } = useGamificationStore()
  const { getPhase, isPhaseUnlocked, progress } = useCurriculumStore()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    setReady(true)
  }, [])

  const phase = getPhase(phaseId)

  if (!ready) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  if (!phase) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Compass className="mx-auto size-12 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-bold">Phase not found</h1>
        <p className="mt-2 text-muted-foreground">This phase doesn&apos;t exist or hasn&apos;t been released yet.</p>
        <Link href="/phases" className="mt-6 inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300">
          <ArrowLeft className="size-4" /> Back to Learning Map
        </Link>
      </div>
    )
  }

  const unlocked = isPhaseUnlocked(phase, currentLevel)

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Compass className="mx-auto size-12 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-bold">Phase Locked</h1>
        <p className="mt-2 text-muted-foreground">
          Reach Level {phase.unlock_level} to unlock &ldquo;{phase.title}&rdquo;.
          Your current level is {currentLevel}.
        </p>
        <Link href="/phases" className="mt-6 inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300">
          <ArrowLeft className="size-4" /> Back to Learning Map
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/phases" className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent">
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Phase {phase.order_index}
          </p>
          <h1 className="text-2xl font-bold sm:text-3xl">{phase.title}</h1>
          <p className="mt-1 text-muted-foreground">{phase.description}</p>
        </div>
      </div>

      <div className="mt-2 mb-6 text-sm text-muted-foreground">
        <span className="font-medium text-indigo-400">{currentLevel} XP</span>
        <span className="mx-2">·</span>
        <span>{phase.modules.length} module{phase.modules.length !== 1 ? "s" : ""}</span>
      </div>

      {phase.modules.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <Compass className="mx-auto size-10 text-muted-foreground" />
          <h3 className="mt-3 text-base font-medium">Coming Soon</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Modules for this phase are being developed. Check back later.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {phase.modules.map((mod) => {
            const completedTopics = mod.topics.filter((t) => progress[t.id]?.completed).length
            return (
              <ModuleCard
                key={mod.id}
                mod={mod}
                userLevel={currentLevel}
                completedTopics={completedTopics}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
