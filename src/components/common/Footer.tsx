import { Sword } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <Sword className="size-5 text-indigo-500" />
            <span className="text-sm font-semibold">
              Data<span className="text-indigo-500">Quest</span>
            </span>
          </Link>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} DataQuest Analytics. Level up your data skills.
          </p>
        </div>
      </div>
    </footer>
  )
}
