"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calculator, Zap, Coins, BarChart3, Upload } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { useGamificationStore } from "@/store/useGamificationStore"
import { ExcelSimulator } from "@/components/practice/ExcelSimulator"
import Link from "next/link"

export default function ExcelPracticePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, initialize } = useAuthStore()
  const { addXP, setCoinsDelta } = useGamificationStore()
  const [ready, setReady] = useState(false)

  useEffect(() => { initialize() }, [initialize])
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login?redirect=/practice/excel")
    else if (!isLoading) setReady(true)
  }, [isLoading, isAuthenticated, router])

  const handleQuestComplete = (xp: number) => {
    addXP(xp)
    setCoinsDelta(Math.round(xp / 5))
  }

  if (!ready) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link href="/phases" className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Calculator className="size-5 text-emerald-500" />
              <h1 className="text-xl font-bold sm:text-2xl">Excel Spreadsheet Lab</h1>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Full-featured spreadsheet with formulas, charts, and analytics tools
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <Calculator className="size-3.5" /> {10}x{30} grid
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
            <BarChart3 className="size-3.5" /> Charts
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
            <Upload className="size-3.5" /> CSV Import
          </span>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Zap className="size-3 text-yellow-500" /> Earn XP per task</span>
        <span className="text-muted-foreground/30">·</span>
        <span className="flex items-center gap-1"><Coins className="size-3 text-emerald-500" /> Bonus coins for completing</span>
        <span className="text-muted-foreground/30">·</span>
        <span>Type <code className="rounded bg-muted px-1 text-emerald-400">=SUM(B2:E2)</code> to try a formula</span>
        <span className="text-muted-foreground/30">·</span>
        <span>Arrow keys to navigate</span>
      </div>

      <ExcelSimulator onComplete={handleQuestComplete} xpReward={40} />
    </div>
  )
}
