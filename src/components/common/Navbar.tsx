"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X, Sword, LogOut, User, ChevronDown, Trophy, Medal, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { ProfileDropdown } from "@/components/gamification/ProfileDropdown"
import { NotificationBell } from "@/components/common/NotificationBell"
import { useAuthStore } from "@/store/useAuthStore"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Journey Map", href: "/phases" },
]

const labLinks = [
  { label: "SQL Lab", href: "/practice/sql" },
  { label: "Python Lab", href: "/practice/python" },
  { label: "Excel Lab", href: "/practice/excel" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [labsOpen, setLabsOpen] = useState(false)
  const { user, isAuthenticated, isLoading, initialize, signOut } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  const handleSignOut = async () => {
    await signOut()
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Sword className="size-7 text-indigo-500" />
          <span className="text-xl font-bold tracking-tight text-foreground">
            Data<span className="text-indigo-500">Quest</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
            </Link>
          ))}

          {/* Labs dropdown */}
          <div className="relative">
            <button
              onClick={() => setLabsOpen(!labsOpen)}
              onMouseEnter={() => setLabsOpen(true)}
              onMouseLeave={() => setLabsOpen(false)}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Practice Labs
              <ChevronDown className={cn("size-3.5 transition-transform", labsOpen && "rotate-180")} />
            </button>
            {labsOpen && (
              <div
                onMouseEnter={() => setLabsOpen(true)}
                onMouseLeave={() => setLabsOpen(false)}
                className="absolute top-full left-0 mt-1 w-40 rounded-xl border border-border/50 bg-background/95 p-1.5 shadow-xl backdrop-blur-xl"
              >
                {labLinks.map((lab) => (
                  <Link
                    key={lab.href}
                    href={lab.href}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {lab.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {/* Gaming links */}
          {isAuthenticated && (
            <>
              <Link href="/achievements" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground flex items-center gap-1">
                <Trophy className="size-3.5 text-yellow-500" /> Achievements
              </Link>
              <Link href="/leaderboard" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground flex items-center gap-1">
                <Medal className="size-3.5 text-indigo-400" /> Leaderboard
              </Link>
              <Link href="/skills" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground flex items-center gap-1">
                <Sparkles className="size-3.5 text-purple-400" /> Skills
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated && <NotificationBell />}
          <ThemeToggle />

          <div className="hidden items-center gap-2 md:flex">
            {isLoading ? (
              <div className="size-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            ) : isAuthenticated && user ? (
              <ProfileDropdown />
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex h-8 items-center justify-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-8 items-center justify-center rounded-lg bg-indigo-600 px-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden">
              {mobileOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                  Practice Labs
                </div>
                {labLinks.map((lab) => (
                  <Link
                    key={lab.href}
                    href={lab.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {lab.label}
                  </Link>
                ))}
                <hr className="my-2 border-border" />
                {isAuthenticated && user ? (
                  <>
                    <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                      Gamification
                    </div>
                    <Link href="/achievements" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                      <Trophy className="size-4 text-yellow-500" /> Achievements
                    </Link>
                    <Link href="/leaderboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                      <Medal className="size-4 text-indigo-400" /> Leaderboard
                    </Link>
                    <Link href="/skills" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                      <Sparkles className="size-4 text-purple-400" /> Skills
                    </Link>
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
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
                      <div className="text-sm">
                        <p className="font-medium">{user.full_name || user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      View Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      Dashboard
                    </Link>
                    <hr className="my-2 border-border" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <LogOut className="size-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex h-8 items-center justify-start rounded-lg px-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex h-8 items-center justify-center rounded-lg bg-indigo-600 px-3 text-base font-medium text-white transition-colors hover:bg-indigo-500"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
