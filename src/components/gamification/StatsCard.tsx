"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  sublabel?: string
  iconColor?: string
  iconBg?: string
  trend?: "up" | "down" | "neutral"
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  sublabel,
  iconColor = "text-indigo-500",
  iconBg = "bg-indigo-500/10",
  trend,
}: StatsCardProps) {
  return (
    <Card className="transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5">
      <CardContent className="flex items-center gap-4 p-4 sm:p-5">
        <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", iconBg, iconColor)}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium",
                  trend === "up" && "text-emerald-500",
                  trend === "down" && "text-red-500"
                )}
              >
                {trend === "up" ? "+" : trend === "down" ? "-" : ""}
              </span>
            )}
          </div>
          {sublabel && (
            <p className="text-xs text-muted-foreground">{sublabel}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
