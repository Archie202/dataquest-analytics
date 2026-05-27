"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Zap, Swords, Target, BookOpen, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { QuestSubmission } from "@/components/practice/QuestSubmission"
import { SuccessPopup } from "@/components/practice/SuccessPopup"
import type { Quest } from "@/types/curriculum"
import { cn } from "@/lib/utils"

const typeIcons = {
  task: BookOpen,
  project: Target,
  boss_fight: Swords,
}

const typeColors = {
  task: { text: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  project: { text: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  boss_fight: { text: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
}

const difficultyBadge: Record<string, string> = {
  easy: "bg-emerald-500/10 text-emerald-500",
  medium: "bg-yellow-500/10 text-yellow-500",
  hard: "bg-red-500/10 text-red-500",
}

interface QuestPanelProps {
  quests: Quest[]
  completedQuests: string[]
  onComplete: (questId: string) => void
}

export function QuestPanel({ quests, completedQuests, onComplete }: QuestPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successXp, setSuccessXp] = useState(0)
  const [successTitle, setSuccessTitle] = useState("")

  const tasks = quests.filter((q) => q.type === "task")
  const projects = quests.filter((q) => q.type === "project")
  const bosses = quests.filter((q) => q.type === "boss_fight")

  const sections = [
    { label: "Tasks", quests: tasks, icon: BookOpen },
    { label: "Projects", quests: projects, icon: Target },
    { label: "Boss Fights", quests: bosses, icon: Swords },
  ]

  const handleQuestSubmitWithRetries = (questId: string, xp: number, retriesUsed: number) => {
    onComplete(questId)
    const quest = quests.find((q) => q.id === questId)
    setSuccessXp(xp)
    setSuccessTitle(quest?.title ?? "Quest")
    setShowSuccess(true)
  }

  return (
    <>
      <div className="space-y-4">
        {sections.map(
          (section) =>
            section.quests.length > 0 && (
              <div key={section.label}>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <section.icon className="size-4" />
                  {section.label}
                </h4>
                <div className="space-y-2">
                  {section.quests.map((quest, qIdx) => {
                    const isCompleted = completedQuests.includes(quest.id)
                    const colors = typeColors[quest.type]
                    const isExpanded = expandedId === quest.id
                    const hasPractice = !!quest.practiceType

                    return (
                      <Card
                        key={quest.id}
                        className={cn(
                          "border-border/50 transition-all",
                          isCompleted && "border-emerald-500/30 opacity-60",
                          isExpanded && "border-indigo-500/30",
                        )}
                      >
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                "mt-0.5 shrink-0 transition-colors",
                                isCompleted ? "text-emerald-500" : "text-muted-foreground",
                              )}
                            >
                              {isCompleted ? <CheckCircle2 className="size-5" /> : <Circle className="size-5" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  onClick={() => setExpandedId(isExpanded ? null : quest.id)}
                                  className={cn(
                                    "text-left text-sm font-medium hover:text-indigo-400 transition-colors",
                                    isCompleted && "line-through",
                                  )}
                                >
                                  {quest.title}
                                </button>
                                <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", difficultyBadge[quest.difficulty])}>
                                  {quest.difficulty}
                                </span>
                                <span className={cn("flex items-center gap-1 text-xs", colors.text)}>
                                  <Zap className="size-3" />
                                  {quest.xp_reward} XP
                                </span>
                                {hasPractice && (
                                  <span className="flex items-center gap-1 rounded-full bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-500">
                                    <Sparkles className="size-3" />
                                    {quest.practiceType?.toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 text-xs text-muted-foreground">{quest.description}</p>

                              {isExpanded && (
                                <div className="mt-3 space-y-3">
                                  <div className="rounded-lg bg-muted/50 p-3 text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
                                    {quest.instructions}
                                  </div>

                                  {!isCompleted && (
                                    <QuestSubmission
                                      quest={quest}
                                      onSubmit={(xp, retriesUsed) => handleQuestSubmitWithRetries(quest.id, xp, retriesUsed)}
                                    />
                                  )}

                                  {isCompleted && (
                                    <div className="flex items-center gap-2 text-xs text-emerald-500">
                                      <CheckCircle2 className="size-3.5" />
                                      Completed · +{quest.xp_reward} XP
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
        )}
      </div>

      <SuccessPopup
        show={showSuccess}
        xpEarned={successXp}
        questTitle={successTitle}
        onClose={() => setShowSuccess(false)}
      />
    </>
  )
}
