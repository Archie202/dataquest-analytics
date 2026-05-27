"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Compass, ArrowLeft, Map, Info } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { useGamificationStore } from "@/store/useGamificationStore"
import { useCurriculumStore } from "@/store/useCurriculumStore"
import { WorldMap } from "@/components/curriculum/WorldMap"
import Link from "next/link"

export default function PhasesPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading, initialize } = useAuthStore()
  const { currentLevel, hydrate: hydrateGamification } = useGamificationStore()
  const { phases, isLoading, hydrateProgress } = useCurriculumStore()

  const [ready, setReady] = useState(false)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login?redirect=/phases")
      } else {
        setReady(true)
      }
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      hydrateProgress(user.id)
      hydrateGamification(user.id, user.xp ?? 0, user.analytics_coins ?? 0, user.streak_days ?? 0)
    }
  }, [user, hydrateProgress, hydrateGamification])

  if (!ready) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="size-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          Loading your quest map...
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] flex-col px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link
            href="/dashboard"
            className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Map className="size-5 text-indigo-500" />
              <h1 className="text-2xl font-bold sm:text-3xl">Journey Map</h1>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Chart your course through the data analytics realm
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-400">
            <Compass className="size-3.5" />
            Lv.{currentLevel}
          </div>
          <span className="text-sm text-muted-foreground">{phases.length} regions</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-indigo-500/60" /> Topic
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full border-2 border-indigo-400" /> Module
        </span>
        <span className="flex items-center gap-1.5">
          <SwordsLegend className="size-3 text-indigo-400" /> Boss Challenge
        </span>
      </div>

      {/* Map */}
      <div className="flex-1 overflow-hidden rounded-2xl border border-border/50 bg-muted/20">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="size-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          </div>
        ) : (
          <WorldMap phases={phases} userLevel={currentLevel} />
        )}
      </div>

      {/* Footer hint */}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/60">
        <Info className="size-3" />
        Scroll horizontally to explore all regions · Hover nodes for details
      </div>
    </div>
  )
}

function SwordsLegend({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
      <path d="M13 19l6-6" />
      <path d="M16 16l-2 2" />
      <path d="M20 12l-2 2" />
    </svg>
  )
}
