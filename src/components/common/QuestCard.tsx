import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Quest } from "@/types"
import { Trophy, Target, Flame } from "lucide-react"

const questIcons = {
  daily: Flame,
  weekly: Target,
  achievement: Trophy,
}

const questColors = {
  daily: "text-orange-500",
  weekly: "text-blue-500",
  achievement: "text-yellow-500",
}

interface QuestCardProps {
  quest: Quest
}

export function QuestCard({ quest }: QuestCardProps) {
  const Icon = questIcons[quest.type]
  const progressPct = Math.min((quest.progress / quest.target) * 100, 100)

  return (
    <Card className="group transition-all hover:shadow-lg hover:shadow-indigo-500/10">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-lg bg-muted",
            questColors[quest.type]
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-base">{quest.title}</CardTitle>
          <p className="text-xs text-muted-foreground">{quest.description}</p>
        </div>
        <div className="flex items-center gap-1 text-sm font-semibold text-indigo-500">
          <Trophy className="size-3.5" />
          {quest.xp_reward} XP
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full bg-indigo-500 transition-all duration-500",
                quest.completed && "bg-green-500"
              )}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {quest.progress}/{quest.target}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
