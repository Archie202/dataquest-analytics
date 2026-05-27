"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface LessonPanelProps {
  content: string
}

function renderLine(line: string, idx: number): React.ReactNode {
  if (line.startsWith("### ")) {
    return <h3 key={idx} className="mt-5 mb-2 text-base font-semibold text-foreground">{line.replace("### ", "")}</h3>
  }
  if (line.startsWith("## ")) {
    return <h2 key={idx} className="mt-6 mb-3 text-lg font-bold text-foreground">{line.replace("## ", "")}</h2>
  }
  if (line.startsWith("---")) {
    return <hr key={idx} className="my-4 border-border" />
  }
  if (line.startsWith("**") && line.endsWith("**")) {
    return <p key={idx} className="font-semibold text-foreground">{line.replace(/^\*\*|\*\*$/g, "")}</p>
  }
  if (line.startsWith("- ")) {
    return <li key={idx} className="ml-5 list-disc text-sm text-muted-foreground">{line.replace("- ", "")}</li>
  }
  if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ") || line.startsWith("5. ") || line.startsWith("6. ")) {
    return <li key={idx} className="ml-5 list-decimal text-sm text-muted-foreground">{line.replace(/^\d+\.\s*/, "")}</li>
  }
  if (line.trim() === "") {
    return <div key={idx} className="h-2" />
  }
  return <p key={idx} className="text-sm text-muted-foreground leading-relaxed">{line}</p>
}

export function LessonPanel({ content }: LessonPanelProps) {
  const lines = content.split("\n")
  const sections: { heading: string; body: string[] }[] = []
  let currentHeading = "Introduction"
  let currentBody: string[] = []

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (currentBody.length > 0) {
        sections.push({ heading: currentHeading, body: currentBody })
      }
      currentHeading = line.replace("## ", "")
      currentBody = []
    } else if (line.startsWith("---")) {
      if (currentBody.length > 0) {
        sections.push({ heading: currentHeading, body: currentBody })
      }
      sections.push({ heading: "separator", body: ["---"] })
      currentHeading = ""
      currentBody = []
    } else {
      currentBody.push(line)
    }
  }
  if (currentBody.length > 0) {
    sections.push({ heading: currentHeading, body: currentBody })
  }

  return (
    <div className="space-y-4">
      {sections.map((section, si) => {
        if (section.heading === "separator") {
          return <hr key={si} className="my-2 border-border" />
        }

        const isKeyInsights = section.heading === "Key Insights"

        return (
          <Card
            key={si}
            className={cn(
              "border-border/50",
              isKeyInsights && "border-indigo-500/20 bg-indigo-500/5",
              section.heading === "Real-World Example" && "border-blue-500/20 bg-blue-500/5",
              section.heading === "Simple Explanation" && "border-emerald-500/20 bg-emerald-500/5",
            )}
          >
            <CardContent className="p-4 sm:p-5">
              <h3 className={cn(
                "mb-3 text-sm font-semibold uppercase tracking-wider",
                isKeyInsights && "text-indigo-400",
                section.heading === "Real-World Example" && "text-blue-400",
                section.heading === "Simple Explanation" && "text-emerald-400",
                !isKeyInsights && section.heading !== "Real-World Example" && section.heading !== "Simple Explanation" && "text-foreground",
              )}>
                {section.heading}
              </h3>
              <div className="space-y-0.5">
                {section.body.map((line, li) => renderLine(line, li))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
