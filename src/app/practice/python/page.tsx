"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Terminal, Zap, Coins } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { useGamificationStore } from "@/store/useGamificationStore"
import { PythonLab } from "@/components/practice/PythonLab"
import Link from "next/link"

export default function PythonPracticePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, initialize } = useAuthStore()
  const { addXP, setCoinsDelta } = useGamificationStore()
  const [ready, setReady] = useState(false)

  useEffect(() => { initialize() }, [initialize])
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login?redirect=/practice/python")
    else if (!isLoading) setReady(true)
  }, [isLoading, isAuthenticated, router])

  const handleQuestComplete = (xp: number) => {
    addXP(xp)
    setCoinsDelta(Math.round(xp / 5))
  }

  if (!ready) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link href="/phases" className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="size-5 text-purple-500" />
              <h1 className="text-xl font-bold sm:text-2xl">Python Practice Lab</h1>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Write and run Python code for data analysis tasks
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Zap className="size-3 text-yellow-500" /> Earn XP per exercise</span>
        <span className="text-muted-foreground/30">·</span>
        <span className="flex items-center gap-1"><Coins className="size-3 text-emerald-500" /> Bonus coins for correct solutions</span>
        <span className="text-muted-foreground/30">·</span>
        <span>Write Python code and run it</span>
      </div>

      <PythonLab onComplete={handleQuestComplete} xpReward={75} />
    </div>
  )
}
