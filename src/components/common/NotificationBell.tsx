"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useNotificationStore } from "@/store/useNotificationStore"
import { Bell } from "lucide-react"
import Link from "next/link"

export function NotificationBell() {
  const { user } = useAuthStore()
  const { unreadCount, loadNotifications } = useNotificationStore()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (user) loadNotifications(user.id)
  }, [user, loadNotifications])

  if (!user) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-border/50 bg-background/95 p-2 shadow-xl backdrop-blur-xl">
            <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Notifications
            </div>
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              View all notifications
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
