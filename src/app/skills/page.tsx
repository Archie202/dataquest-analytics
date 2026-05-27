"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useAuthStore } from "@/store/useAuthStore"
import { useGamificationStore } from "@/store/useGamificationStore"
import { SkillTreeCard } from "@/components/gamification/SkillTreeCard"
import { BookOpen, ArrowLeft, Sparkles, Lock } from "lucide-react"

interface SkillNodeInfo {
  id: string
  name: string
  description: string
  skill: string
  requiredLevel: number
  children: string[]
}

const skillNodes: SkillNodeInfo[] = [
  { id: "sql-basics", name: "SQL Fundamentals", description: "SELECT, WHERE, JOIN basics", skill: "sql", requiredLevel: 0, children: ["sql-groupby", "sql-joins"] },
  { id: "sql-groupby", name: "Grouping & Aggregation", description: "GROUP BY, HAVING, window functions", skill: "sql", requiredLevel: 1, children: ["sql-subqueries"] },
  { id: "sql-joins", name: "Advanced Joins", description: "INNER, LEFT, RIGHT, FULL OUTER, CROSS", skill: "sql", requiredLevel: 1, children: ["sql-subqueries"] },
  { id: "sql-subqueries", name: "Subqueries & CTEs", description: "Nested queries and WITH clauses", skill: "sql", requiredLevel: 2, children: ["sql-optimization"] },
  { id: "sql-optimization", name: "Query Optimization", description: "Indexes, explain plans, performance tuning", skill: "sql", requiredLevel: 3, children: [] },

  { id: "python-basics", name: "Python Basics", description: "Variables, loops, functions", skill: "python", requiredLevel: 0, children: ["python-pandas"] },
  { id: "python-pandas", name: "Pandas & DataFrames", description: "Data manipulation with pandas", skill: "python", requiredLevel: 1, children: ["python-viz"] },
  { id: "python-viz", name: "Data Visualization", description: "Matplotlib, seaborn, plotly", skill: "python", requiredLevel: 2, children: ["python-ml"] },
  { id: "python-ml", name: "Machine Learning", description: "scikit-learn, regression, classification", skill: "python", requiredLevel: 3, children: ["python-deep"] },
  { id: "python-deep", name: "Deep Learning", description: "Neural networks with PyTorch/TensorFlow", skill: "python", requiredLevel: 4, children: [] },

  { id: "excel-basics", name: "Excel Fundamentals", description: "Formulas, references, basic functions", skill: "excel", requiredLevel: 0, children: ["excel-pivot"] },
  { id: "excel-pivot", name: "Pivot Tables", description: "Summarize data with pivot tables", skill: "excel", requiredLevel: 1, children: ["excel-charts"] },
  { id: "excel-charts", name: "Advanced Charts", description: "Dynamic charts, sparklines, dashboards", skill: "excel", requiredLevel: 2, children: ["excel-powerquery"] },
  { id: "excel-powerquery", name: "Power Query", description: "ETL workflows in Excel", skill: "excel", requiredLevel: 3, children: ["excel-macros"] },
  { id: "excel-macros", name: "VBA & Macros", description: "Automate Excel with VBA scripting", skill: "excel", requiredLevel: 4, children: [] },
]

const skillNodeColors: Record<string, string> = {
  sql: "border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20",
  python: "border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20",
  excel: "border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20",
}

export default function SkillsPage() {
  const { user } = useAuthStore()
  const { currentLevel, skillProgress } = useGamificationStore()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-indigo-400" />
            Skill Tree
          </h1>
          <p className="text-zinc-400 mt-1">Master each discipline by completing skill nodes</p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-300">
          Agent Level {currentLevel}
        </div>
      </div>

      {/* Skill overview cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Object.values(skillProgress).map((skill) => (
          <SkillTreeCard key={skill.name} skill={skill} />
        ))}
      </div>

      {/* Skill tree nodes */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Skill Nodes</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skillNodes.map((node) => {
            const skill = skillProgress[node.skill as keyof typeof skillProgress]
            const nodeLevel = node.requiredLevel
            const unlocksAtSkillLevel = nodeLevel
            const isLocked = skill ? skill.level === "beginner" && nodeLevel >= 2 : true
            const isCompleted = skill ? skill.lessonsCompleted >= (nodeLevel + 1) * 3 : false

            return (
              <div
                key={node.id}
                className={`rounded-xl border p-4 transition-all ${
                  isCompleted
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : isLocked
                    ? "border-zinc-800 bg-zinc-900/50 opacity-60"
                    : skillNodeColors[node.skill] || "border-zinc-800 bg-zinc-900/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <span className="text-emerald-400 text-lg">&#10003;</span>
                    ) : isLocked ? (
                      <Lock className="w-4 h-4 text-zinc-600" />
                    ) : (
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                    )}
                    <h3 className="font-medium text-sm">{node.name}</h3>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 mb-3">{node.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">
                    {isCompleted ? "Completed" : isLocked ? `Unlocks at higher skill level` : `Available`}
                  </span>
                  {node.children.length > 0 && (
                    <span className="text-zinc-600">{node.children.length} branches</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/dashboard"
          className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
