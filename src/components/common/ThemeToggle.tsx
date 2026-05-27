"use client"

import { Moon, Sun } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore()

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="size-5 text-yellow-400" />
      ) : (
        <Moon className="size-5 text-indigo-400" />
      )}
    </Button>
  )
}
