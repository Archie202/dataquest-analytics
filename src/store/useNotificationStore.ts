import { create } from "zustand"
import type { Notification } from "@/types/notifications"
import { getSupabaseClient } from "@/lib/supabase"

function getClient() {
  const client = getSupabaseClient()
  if (!client) throw new Error("Supabase client not initialized")
  return client
}

interface NotificationStore {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  loadNotifications: (userId: string) => Promise<void>
  addNotification: (notif: Omit<Notification, "id" | "createdAt" | "read">) => void
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  loadNotifications: async (userId: string) => {
    set({ loading: true })
    const { data } = await getClient()
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50)

    if (data) {
      const mapped: Notification[] = data.map((n: any) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        read: n.read,
        metadata: n.metadata,
        createdAt: n.created_at,
      }))
      set({
        notifications: mapped,
        unreadCount: mapped.filter((n) => !n.read).length,
        loading: false,
      })
    } else {
      set({ loading: false })
    }
  },

  addNotification: (notif) => {
    const newNotif: Notification = {
      ...notif,
      id: crypto.randomUUID(),
      read: false,
      createdAt: new Date().toISOString(),
    }
    set((s) => ({
      notifications: [newNotif, ...s.notifications],
      unreadCount: s.unreadCount + 1,
    }))
  },

  markAsRead: async (id: string) => {
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, s.unreadCount - 1),
    }))
    await getClient().from("notifications").update({ read: true }).eq("id", id)
  },

  markAllAsRead: async () => {
    const userId = (await getClient().auth.getUser()).data.user?.id
    if (!userId) return
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }))
    await getClient()
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .is("read", false)
  },
}))
