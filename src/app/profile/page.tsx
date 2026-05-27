"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Trophy, Calendar, Medal, Mail, Edit2, Check, X, LogOut, Loader2, Award, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/store/useAuthStore"

const placeholderBadges = [
  { name: "First Login", earned: false },
  { name: "Quest Beginner", earned: false },
  { name: "Data Explorer", earned: false },
]

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, initialize, updateProfile, signOut } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => { initialize() }, [initialize])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login?redirect=/profile")
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (user?.full_name) setEditName(user.full_name)
  }, [user?.full_name])

  const handleSaveName = async () => {
    setSaveError(null)
    setIsSaving(true)
    const { error } = await updateProfile({ full_name: editName })
    if (error) setSaveError(error)
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditName(user?.full_name ?? "")
    setIsEditing(false)
    setSaveError(null)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="size-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          Loading profile...
        </div>
      </div>
    )
  }

  if (!user) return null

  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="relative">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.full_name || user.username} className="size-20 rounded-full border-2 border-indigo-500/30 object-cover sm:size-24" />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-full bg-indigo-500/10 sm:size-24">
              <User className="size-8 text-indigo-500 sm:size-10" />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
            {user.level}
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Label htmlFor="edit-name" className="sr-only">Full name</Label>
                  <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 w-48" autoFocus />
                </div>
                <button onClick={handleSaveName} disabled={isSaving} className="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
                  {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                </button>
                <button onClick={handleCancelEdit} className="flex size-7 items-center justify-center rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20">
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold">{user.full_name || user.username}</h1>
                <button onClick={() => setIsEditing(true)} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                  <Edit2 className="size-3.5" />
                </button>
              </>
            )}
          </div>
          {saveError && <p className="mt-1 text-sm text-destructive">{saveError}</p>}
          <div className="mt-1 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-3">
            <span className="flex items-center gap-1"><Mail className="size-3.5" />{user.email}</span>
            <span className="hidden sm:block">&middot;</span>
            <span className="flex items-center gap-1"><Calendar className="size-3.5" />Joined {joinedDate}</span>
          </div>
        </div>

        <button onClick={handleSignOut} className="flex h-8 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <LogOut className="size-4" /> Sign Out
        </button>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-sm font-medium text-muted-foreground">Level</CardTitle>
            <p className="text-3xl font-bold text-indigo-500">{user.level}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total XP</CardTitle>
            <p className="text-3xl font-bold text-yellow-500">{user.xp}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lessons</CardTitle>
            <p className="text-3xl font-bold text-emerald-500">{user.lessons_completed}</p>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Award className="size-5 text-yellow-500" /> Achievements & Badges
          </h2>
          <Link href="/achievements" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {placeholderBadges.map((badge) => (
            <Card key={badge.name} className={`transition-all ${badge.earned ? "border-yellow-500/30" : "opacity-40"}`}>
              <CardContent className="flex items-center gap-3 py-4">
                <Medal className={`size-8 ${badge.earned ? "text-yellow-500" : "text-muted-foreground"}`} />
                <div>
                  <p className="text-sm font-medium">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.earned ? "Earned" : "Not yet earned"}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-8" />
      <div className="text-center text-xs text-muted-foreground">
        DataQuest Analytics &middot; Level up your data skills
      </div>
    </div>
  )
}
