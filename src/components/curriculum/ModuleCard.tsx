"use client"

import Link from "next/link"
import { Lock, CheckCircle2, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Module } from "@/types/curriculum"
import { cn } from "@/lib/utils"

interface ModuleCardProps {
  mod: Module
  userLevel: number
  completedTopics: number
}

export function ModuleCard({ mod, userLevel, completedTopics }: ModuleCardProps) {
  const unlocked = userLevel >= mod.unlock_level
  const progress = mod.topics.length > 0
    ? Math.round((completedTopics / mod.topics.length) * 100)
    : 0

  return (
    <Link href={unlocked ? `/modules/${mod.id}` : "#"}>
      <Card
        className={cn(
          "group relative border-border/50 transition-all",
          unlocked
            ? "cursor-pointer hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5"
            : "cursor-not-allowed opacity-50",
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex size-8 items-center justify-center rounded-lg text-sm font-bold",
                unlocked ? "bg-indigo-500/10 text-indigo-500" : "bg-muted text-muted-foreground",
              )}>
                {mod.order_index}
              </div>
              <CardTitle className={cn("text-base", !unlocked && "text-muted-foreground")}>
                {mod.title}
              </CardTitle>
            </div>
            {unlocked && completedTopics === mod.topics.length && (
              <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
            )}
            {!unlocked && <Lock className="size-4 text-muted-foreground shrink-0" />}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{mod.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>{mod.topics.length} topic{mod.topics.length !== 1 ? "s" : ""}</span>
            {unlocked && (
              <>
                <span className="flex items-center gap-2">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {progress}%
                </span>
                <span className="flex items-center gap-1 font-medium text-indigo-400 group-hover:gap-2 transition-all">
                  Start <ArrowRight className="size-3" />
                </span>
              </>
            )}
            {!unlocked && (
              <span className="font-medium text-indigo-400">Unlocks at Level {mod.unlock_level}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
