"use client"

import Link from "next/link"
import { Lock, CheckCircle2, Circle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Topic } from "@/types/curriculum"
import type { UserProgressEntry } from "@/types/curriculum"
import { cn } from "@/lib/utils"

interface TopicCardProps {
  topic: Topic
  userLevel: number
  progress?: UserProgressEntry
}

export function TopicCard({ topic, userLevel, progress }: TopicCardProps) {
  const unlocked = userLevel >= topic.unlock_level
  const completed = progress?.completed ?? false
  const questCount = topic.quests.length
  const completedQuestCount = progress?.completed_quests.length ?? 0

  return (
    <Link href={unlocked ? `/topics/${topic.id}` : "#"}>
      <Card
        className={cn(
          "group border-border/50 transition-all",
          unlocked
            ? "cursor-pointer hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5"
            : "cursor-not-allowed opacity-50",
          completed && "border-emerald-500/30"
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {completed ? (
                <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
              ) : unlocked ? (
                <Circle className="size-5 text-muted-foreground shrink-0" />
              ) : (
                <Lock className="size-4 text-muted-foreground shrink-0" />
              )}
              <CardTitle className={cn("text-sm", !unlocked && "text-muted-foreground")}>
                {topic.title}
              </CardTitle>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
              <span className="font-medium text-indigo-400">{topic.xp_reward} XP</span>
              {unlocked && <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{questCount} quest{questCount !== 1 ? "s" : ""}</span>
            {unlocked && questCount > 0 && (
              <span className="flex items-center gap-1">
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full transition-all", completed ? "bg-emerald-500" : "bg-indigo-500")}
                    style={{ width: `${Math.round((completedQuestCount / questCount) * 100)}%` }}
                  />
                </div>
                {completedQuestCount}/{questCount}
              </span>
            )}
            {!unlocked && (
              <span className="font-medium text-indigo-400">Level {topic.unlock_level}+</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
