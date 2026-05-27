"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { useGamificationStore } from "@/store/useGamificationStore"
import { Sparkles, BarChart3, BookOpen, Sword, ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const skillOptions = [
  { id: "sql", label: "SQL", description: "Data querying and database management", icon: BookOpen, color: "text-blue-400 bg-blue-400/10 border-blue-400/30" },
  { id: "python", label: "Python", description: "Data analysis, scripting, and automation", icon: Sword, color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  { id: "excel", label: "Excel", description: "Spreadsheets, formulas, and business analysis", icon: BarChart3, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" },
]

const experienceLevels = [
  { id: "beginner", label: "Beginner", description: "New to data analytics" },
  { id: "intermediate", label: "Intermediate", description: "Some experience with tools" },
  { id: "advanced", label: "Advanced", description: "Comfortable with multiple tools" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user, updateProfile } = useAuthStore()
  const { addXP, setCoinsDelta } = useGamificationStore()

  const [step, setStep] = useState(0)
  const [name, setName] = useState(user?.full_name || "")
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [experience, setExperience] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleFinish = async () => {
    setSaving(true)
    await updateProfile({
      full_name: name || user?.username || "Analyst",
      onboarding_completed: true,
      primary_skill: selectedSkill,
      experience_level: experience,
      xp: 100,
    })
    addXP(100)
    setCoinsDelta(25)
    router.push("/dashboard")
  }

  if (!user) {
    router.push("/login?redirect=/onboarding")
    return null
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                step === s ? "bg-indigo-500 w-6" : step > s ? "bg-indigo-500/50" : "bg-zinc-700"
              )}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="p-3 rounded-2xl bg-indigo-500/10">
                <Sparkles className="w-8 h-8 text-indigo-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Welcome to DataQuest</h1>
            <p className="text-zinc-400">Gamified data analytics training. Let's set up your profile.</p>
            <div className="text-left space-y-2">
              <label className="text-sm font-medium text-zinc-300">What should we call you?</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={() => setStep(1)}
              disabled={!name.trim()}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
            >
              Continue <ArrowRight className="w-4 h-4 inline ml-1" />
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold">Pick your primary skill</h2>
              <p className="text-sm text-zinc-400 mt-1">You can learn others later</p>
            </div>
            <div className="space-y-3">
              {skillOptions.map((skill) => {
                const Icon = skill.icon
                const isSelected = selectedSkill === skill.id
                return (
                  <button
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                      isSelected ? skill.color + " border-opacity-100" : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                    )}
                  >
                    <div className={cn("p-2 rounded-lg", skill.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{skill.label}</p>
                      <p className="text-xs text-zinc-500">{skill.description}</p>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-indigo-400" />}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex-1 py-2.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white transition-colors">
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!selectedSkill}
                className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
              >
                Continue <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold">What's your experience level?</h2>
              <p className="text-sm text-zinc-400 mt-1">We'll tailor the curriculum for you</p>
            </div>
            <div className="space-y-3">
              {experienceLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setExperience(level.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all",
                    experience === level.id
                      ? "border-indigo-500/50 bg-indigo-500/10"
                      : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                  )}
                >
                  <p className="font-medium">{level.label}</p>
                  <p className="text-xs text-zinc-500">{level.description}</p>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white transition-colors">
                Back
              </button>
              <button
                onClick={handleFinish}
                disabled={!experience || saving}
                className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
              >
                {saving ? "Setting up..." : "Start Your Quest!"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
