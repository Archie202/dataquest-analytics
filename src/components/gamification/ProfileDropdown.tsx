"use client"

import { useRouter } from "next/navigation"
import { User, LayoutDashboard, LogOut, Trophy, Zap } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/store/useAuthStore"
import { useGamificationStore } from "@/store/useGamificationStore"

export function ProfileDropdown() {
  const router = useRouter()
  const { user, signOut } = useAuthStore()
  const { totalXP, currentLevel, streak, coins } = useGamificationStore()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
    router.refresh()
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-indigo-500">
        <div className="flex size-8 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-500">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt=""
              className="size-8 rounded-full object-cover"
            />
          ) : (
            <User className="size-4" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">
                {user.full_name || user.username}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex items-center gap-1.5 text-xs">
            <Trophy className="size-3.5 text-yellow-500" />
            <span className="text-muted-foreground">Lvl {currentLevel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Zap className="size-3.5 text-yellow-500" />
            <span className="text-muted-foreground">{totalXP} XP</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-orange-500">🔥</span>
            <span className="text-muted-foreground">{streak} day{streak !== 1 ? "s" : ""}</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <User className="size-4" />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          <LayoutDashboard className="size-4" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleSignOut}
        >
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
