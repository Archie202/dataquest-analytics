import { create } from "zustand"
import type { UserProfile } from "@/types/user"
import { getSupabaseClient } from "@/lib/supabase"

let authListenerInitialized = false

interface AuthStore {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  initialize: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signUpWithEmail: (email: string, password: string, username: string) => Promise<{ error: string | null }>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: string | null }>
}

function mapUserToProfile(sessionUser: any): UserProfile {
  return {
    id: sessionUser.id,
    email: sessionUser.email ?? "",
    username: sessionUser.user_metadata?.username ?? "",
    full_name: sessionUser.user_metadata?.full_name ?? "",
    avatar_url: sessionUser.user_metadata?.avatar_url ?? "",
    xp: 0,
    level: 1,
    streak_days: 0,
    analytics_coins: 0,
    lessons_completed: 0,
    badges: [],
    created_at: sessionUser.created_at,
  }
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  setLoading: (isLoading) => set({ isLoading }),

  initialize: async () => {
    if (get().isAuthenticated && !get().isLoading) return

    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        set({ user: null, isAuthenticated: false, isLoading: false })
        return
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        set({
          user: (profile ?? mapUserToProfile(session.user)) as UserProfile,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false })
      }

      if (!authListenerInitialized) {
        authListenerInitialized = true
        supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single()

            set({
              user: (profile ?? mapUserToProfile(session.user)) as UserProfile,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false })
          }
        })
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  signInWithEmail: async (email, password) => {
    const supabase = getSupabaseClient()
    if (!supabase) return { error: "Supabase not configured" }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  },

  signUpWithEmail: async (email, password, username) => {
    const supabase = getSupabaseClient()
    if (!supabase) return { error: "Supabase not configured" }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, full_name: username },
      },
    })

    return { error: error?.message ?? null }
  },

  signInWithGoogle: async () => {
    const supabase = getSupabaseClient()
    if (!supabase) return

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error("Google sign-in error:", error.message)
      return
    }

    if (data.url) {
      window.location.href = data.url
    }
  },

  signOut: async () => {
    const supabase = getSupabaseClient()
    if (!supabase) return

    await supabase.auth.signOut()
    set({ user: null, isAuthenticated: false })
  },

  updateProfile: async (data) => {
    const supabase = getSupabaseClient()
    if (!supabase) return { error: "Supabase not configured" }

    const { user } = get()
    if (!user) return { error: "Not authenticated" }

    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", user.id)

    if (!error) {
      set({ user: { ...user, ...data } })
    }

    return { error: error?.message ?? null }
  },
}))
