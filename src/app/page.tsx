import Link from "next/link"
import { ArrowRight, Sword, TreePine, Zap, BarChart3, Users, BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QuestCard } from "@/components/common/QuestCard"
import type { Quest } from "@/types"

const features = [
  {
    icon: TreePine,
    title: "Skill Trees",
    description: "Master SQL, Python, Statistics, and Visualization through structured skill trees.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Zap,
    title: "Daily Quests",
    description: "Complete daily challenges to earn XP and maintain your learning streak.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Visualize your learning journey with detailed analytics and achievements.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Users,
    title: "Community",
    description: "Compete on leaderboards, join study groups, and share achievements.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: BookOpen,
    title: "Real Projects",
    description: "Apply your skills to real-world datasets and build your portfolio.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
]

const demoQuests: Quest[] = [
  {
    id: "1",
    title: "SQL Basics",
    description: "Complete 5 SQL SELECT queries",
    type: "daily",
    xp_reward: 50,
    progress: 3,
    target: 5,
    completed: false,
  },
  {
    id: "2",
    title: "Python Warmup",
    description: "Solve 3 data manipulation exercises",
    type: "daily",
    xp_reward: 75,
    progress: 1,
    target: 3,
    completed: false,
  },
  {
    id: "3",
    title: "Stats Streak",
    description: "Complete 7 days of statistics lessons",
    type: "achievement",
    xp_reward: 500,
    progress: 4,
    target: 7,
    completed: false,
  },
]

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-400">
              <Sword className="size-4" />
              Gamified Learning Platform
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Master Data Analytics through{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                Gamified Quests
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Level up your data skills with interactive quests, real projects, and a
              supportive community. From SQL to machine learning — your adventure starts here.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-base font-medium text-white shadow-sm transition-colors hover:bg-indigo-500"
              >
                Start Your Quest <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/phases"
                className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-5 text-base font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Journey Map <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Your Learning Adventure Awaits
            </h2>
            <p className="mt-2 text-muted-foreground">
              Everything you need to go from beginner to data analyst.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group border-border/50 transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5"
              >
                <CardHeader>
                  <div
                    className={`flex size-12 items-center justify-center rounded-xl ${feature.bg} ${feature.color} mb-2`}
                  >
                    <feature.icon className="size-6" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/40 bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Today&apos;s Quests
            </h2>
            <p className="mt-2 text-muted-foreground">
              Complete daily quests to earn XP and build your streak.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {demoQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/phases"
              className="inline-flex h-8 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              View All Quests <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-background to-blue-500/10 p-8 sm:p-12 lg:p-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Ready to Begin Your Journey?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Join thousands of learners mastering data analytics through gamified quests.
                Start free, level up fast.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-base font-medium text-white shadow-sm transition-colors hover:bg-indigo-500"
                >
                  Get Started Free <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/phases"
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-5 text-base font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Start Learning <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
