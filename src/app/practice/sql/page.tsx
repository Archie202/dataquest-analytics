"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Database, Zap, Coins, Terminal } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { useGamificationStore } from "@/store/useGamificationStore"
import { SqlLab } from "@/components/practice/SqlLab"
import Link from "next/link"

export default function SqlPracticePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, initialize } = useAuthStore()
  const { addXP, setCoinsDelta } = useGamificationStore()
  const [ready, setReady] = useState(false)

  useEffect(() => { initialize() }, [initialize])
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login?redirect=/practice/sql")
    else if (!isLoading) setReady(true)
  }, [isLoading, isAuthenticated, router])

  const handleQuestComplete = (xp: number) => {
    addXP(xp)
    setCoinsDelta(Math.round(xp / 5))
  }

  if (!ready) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link href="/phases" className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Database className="size-5 text-indigo-500" />
              <h1 className="text-xl font-bold sm:text-2xl">SQL Practice Lab</h1>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Write real SQL queries against a production-style analytics database
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <span className="flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
            <Database className="size-3.5" /> 4 tables
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <Terminal className="size-3.5" /> SQLite
          </span>
        </div>
      </div>

      {/* Quick info */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Zap className="size-3 text-yellow-500" /> Earn XP per exercise</span>
        <span className="text-muted-foreground/30">·</span>
        <span className="flex items-center gap-1"><Coins className="size-3 text-emerald-500" /> Bonus coins for correct solutions</span>
        <span className="text-muted-foreground/30">·</span>
        <span>Ctrl+Enter to run</span>
        <span className="text-muted-foreground/30">·</span>
        <span className="flex items-center gap-1 text-indigo-400">
          <Database className="size-3" /> CREATE, INSERT, SELECT all supported
        </span>
      </div>

      {/* SQL Lab */}
      <SqlLab onComplete={handleQuestComplete} xpReward={50} />
    </div>
  )
}
