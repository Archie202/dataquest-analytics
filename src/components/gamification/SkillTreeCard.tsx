"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SkillProgress } from "@/types/gamification"
import { cn } from "@/lib/utils"
import { BarChart3, BookOpen, Sword } from "lucide-react"

const skillIcons = {
  excel: BarChart3,
  sql: BookOpen,
  python: Sword,
}

const skillColors = {
  excel: { text: "text-emerald-500", bg: "bg-emerald-500/10", bar: "bg-emerald-500" },
  sql: { text: "text-blue-500", bg: "bg-blue-500/10", bar: "bg-blue-500" },
  python: { text: "text-yellow-500", bg: "bg-yellow-500/10", bar: "bg-yellow-500" },
}

const levelColors: Record<string, string> = {
  beginner: "text-xs rounded-full px-2 py-0.5 bg-muted text-muted-foreground",
  intermediate: "text-xs rounded-full px-2 py-0.5 bg-blue-500/10 text-blue-500",
  advanced: "text-xs rounded-full px-2 py-0.5 bg-purple-500/10 text-purple-500",
}

interface SkillTreeCardProps {
  skill: SkillProgress
  onClick?: () => void
}

export function SkillTreeCard({ skill, onClick }: SkillTreeCardProps) {
  const Icon = skillIcons[skill.name]
  const colors = skillColors[skill.name]

  return (
    <Card
      className={cn(
        "group cursor-pointer border-border/50 transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className={cn("flex size-10 items-center justify-center rounded-lg", colors.bg, colors.text)}>
            <Icon className="size-5" />
          </div>
          <span className={levelColors[skill.level]}>
            {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
          </span>
        </div>
        <CardTitle className="mt-2 text-base">{skill.label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all duration-700", colors.bar)}
            style={{ width: `${skill.progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{skill.progress}% complete</span>
          <span>{skill.lessonsCompleted}/{skill.totalLessons} lessons</span>
        </div>
      </CardContent>
    </Card>
  )
}
