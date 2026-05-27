export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "achievement" | "quest" | "streak" | "level_up"
  read: boolean
  metadata?: Record<string, unknown>
  createdAt: string
}
