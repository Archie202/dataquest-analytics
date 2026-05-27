"use client"

import { motion } from "framer-motion"
import { AlertTriangle, RefreshCw, Lightbulb } from "lucide-react"

interface ErrorFeedbackProps {
  show: boolean
  retriesRemaining: number
  feedback: string
  explanation?: string
  onRetry: () => void
}

export function ErrorFeedback({ show, retriesRemaining, feedback, explanation, onRetry }: ErrorFeedbackProps) {
  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      className="overflow-hidden rounded-xl border border-orange-500/25 bg-gradient-to-r from-orange-500/5 to-red-500/5"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
            <AlertTriangle className="size-4 text-orange-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-orange-300">Not quite right</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{feedback}</p>

            {retriesRemaining > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full bg-orange-500/10 px-2.5 py-1">
                  <RefreshCw className="size-3 text-orange-400" />
                  <span className="text-xs font-medium text-orange-400">
                    Retries Remaining: {retriesRemaining}
                  </span>
                </div>
                <button
                  onClick={onRetry}
                  className="rounded-lg bg-orange-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-orange-500"
                >
                  Try Again
                </button>
              </div>
            )}

            {retriesRemaining === 0 && explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3"
              >
                <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-400">
                  <Lightbulb className="size-3" /> Expected Approach
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{explanation}</p>
                <p className="mt-2 text-xs text-muted-foreground/60">
                  You can retry this quest later after reviewing the material.
                </p>
                <button
                  onClick={onRetry}
                  className="mt-2 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-indigo-500"
                >
                  Retry Later
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
