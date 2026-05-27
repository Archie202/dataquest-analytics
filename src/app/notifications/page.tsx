"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useAuthStore } from "@/store/useAuthStore"
import { useNotificationStore } from "@/store/useNotificationStore"
import { Bell, ArrowLeft, Check, Loader2, Trophy, Sparkles, Flame, Zap, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const typeIcons: Record<string, React.ElementType> = {
  info: Info,
  achievement: Trophy,
  quest: Sparkles,
  streak: Flame,
  level_up: Zap,
}

const typeColors: Record<string, string> = {
  info: "text-blue-400 bg-blue-400/10",
  achievement: "text-yellow-400 bg-yellow-400/10",
  quest: "text-purple-400 bg-purple-400/10",
  streak: "text-orange-400 bg-orange-400/10",
  level_up: "text-emerald-400 bg-emerald-400/10",
}

export default function NotificationsPage() {
  const { user } = useAuthStore()
  const { notifications, loading, loadNotifications, markAsRead, markAllAsRead } = useNotificationStore()

  useEffect(() => {
    if (user) loadNotifications(user.id)
  }, [user, loadNotifications])

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-400" />
            Notifications
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {notifications.filter((n) => !n.read).length} unread
          </p>
        </div>
        <button
          onClick={() => markAllAsRead()}
          className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
        >
          <Check className="w-3.5 h-3.5" /> Mark all read
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No notifications yet. Complete quests to earn achievements!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => {
            const Icon = typeIcons[notif.type] || Info
            const color = typeColors[notif.type] || typeColors.info
            return (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer",
                  notif.read ? "border-zinc-800 bg-zinc-900/30" : "border-indigo-500/20 bg-indigo-500/5"
                )}
              >
                <div className={cn("p-2 rounded-lg", color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium", !notif.read && "text-white")}>{notif.title}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{notif.message}</p>
                  <p className="text-[10px] text-zinc-600 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                </div>
                {!notif.read && <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />}
              </div>
            )
          })}
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
