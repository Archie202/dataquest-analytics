export interface UserProfile {
  id: string
  email: string
  username: string
  full_name?: string
  avatar_url?: string
  xp: number
  level: number
  streak_days: number
  analytics_coins: number
  lessons_completed: number
  badges: string[]
  onboarding_completed?: boolean
  primary_skill?: string | null
  experience_level?: string | null
  created_at: string
  updated_at?: string
}

export interface AuthState {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
}
