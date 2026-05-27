"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ExternalLink, BarChart3, BookOpen, Sword, FlaskConical, TrendingUp, Users, LineChart, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

interface Project {
  id: string
  title: string
  description: string
  skill: string
  difficulty: "beginner" | "intermediate" | "advanced"
  xpReward: number
  dataset: string
  href: string
}

const projects: Project[] = [
  { id: "p1", title: "Sales Dashboard", description: "Build an interactive sales dashboard in Excel with pivot tables and slicers", skill: "excel", difficulty: "beginner", xpReward: 100, dataset: "sales_data.xlsx", href: "#" },
  { id: "p2", title: "Customer Segmentation", description: "Segment customers using RFM analysis in Python", skill: "python", difficulty: "intermediate", xpReward: 200, dataset: "customers.csv", href: "#" },
  { id: "p3", title: "SQL Marketing Analysis", description: "Analyze marketing campaign performance with complex SQL queries", skill: "sql", difficulty: "intermediate", xpReward: 200, dataset: "marketing.db", href: "#" },
  { id: "p4", title: "Financial Forecasting", description: "Build a financial forecast model using Excel and regression", skill: "excel", difficulty: "advanced", xpReward: 350, dataset: "financials.xlsx", href: "#" },
  { id: "p5", title: "Web Analytics Pipeline", description: "Create a Python ETL pipeline for web analytics data", skill: "python", difficulty: "advanced", xpReward: 400, dataset: "webanalytics.csv", href: "#" },
  { id: "p6", title: "Database Migration Audit", description: "Write SQL scripts to audit and migrate legacy database schemas", skill: "sql", difficulty: "advanced", xpReward: 300, dataset: "legacy_schema.sql", href: "#" },
  { id: "p7", title: "HR Analytics Report", description: "Create an HR dashboard showing attrition trends and headcount metrics", skill: "excel", difficulty: "intermediate", xpReward: 150, dataset: "hr_data.xlsx", href: "#" },
  { id: "p8", title: "A/B Testing Analysis", description: "Analyze A/B test results with statistical significance in Python", skill: "python", difficulty: "intermediate", xpReward: 250, dataset: "ab_test.csv", href: "#" },
  { id: "p9", title: "Revenue Recognition SQL", description: "Write complex SQL queries for revenue recognition reporting", skill: "sql", difficulty: "advanced", xpReward: 350, dataset: "revenue.db", href: "#" },
]

const difficultyColor: Record<string, string> = {
  beginner: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  intermediate: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  advanced: "text-red-400 bg-red-400/10 border-red-400/20",
}

const skillIcons: Record<string, React.ElementType> = {
  excel: BarChart3,
  sql: BookOpen,
  python: Sword,
}

const skillColors: Record<string, string> = {
  excel: "text-emerald-400 bg-emerald-400/10",
  sql: "text-blue-400 bg-blue-400/10",
  python: "text-yellow-400 bg-yellow-400/10",
}

export default function ProjectsPage() {
  const [skillFilter, setSkillFilter] = useState<string>("all")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")

  const filtered = projects.filter((p) => {
    if (skillFilter !== "all" && p.skill !== skillFilter) return false
    if (difficultyFilter !== "all" && p.difficulty !== difficultyFilter) return false
    return true
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FlaskConical className="w-8 h-8 text-purple-400" />
            Projects & Portfolio
          </h1>
          <p className="text-zinc-400 mt-1">Hands-on data projects to build your portfolio</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
          <Filter className="w-4 h-4 text-zinc-400" />
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="bg-transparent text-sm text-zinc-300 outline-none"
          >
            <option value="all">All Skills</option>
            <option value="excel">Excel</option>
            <option value="sql">SQL</option>
            <option value="python">Python</option>
          </select>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
          <Search className="w-4 h-4 text-zinc-400" />
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="bg-transparent text-sm text-zinc-300 outline-none"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Project cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => {
          const Icon = skillIcons[project.skill]
          return (
            <Link
              key={project.id}
              href={project.href}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn("p-2 rounded-lg", skillColors[project.skill])}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={cn("text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full border", difficultyColor[project.difficulty])}>
                  {project.difficulty}
                </span>
              </div>
              <h3 className="font-semibold mb-1">{project.title}</h3>
              <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{project.description}</p>
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{project.xpReward} XP
                </span>
                <span className="flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  Start project
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          <p>No projects match the selected filters.</p>
        </div>
      )}

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
