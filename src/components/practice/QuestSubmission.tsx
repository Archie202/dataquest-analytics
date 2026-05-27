"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Code2, ListChecks } from "lucide-react"
import type { Quest } from "@/types/curriculum"
import { validateAnswer } from "@/lib/quest-validation"
import { cn } from "@/lib/utils"

interface QuestSubmissionProps {
  quest: Quest
  onSubmit: (xp: number, retriesUsed: number) => void
  disabled?: boolean
  initialRetriesUsed?: number
}

export function QuestSubmission({ quest, onSubmit, disabled, initialRetriesUsed = 0 }: QuestSubmissionProps) {
  const [answer, setAnswer] = useState("")
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [retries, setRetries] = useState(2 - initialRetriesUsed)
  const [showError, setShowError] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [explanation, setExplanation] = useState<string | undefined>()
  const [isCorrect, setIsCorrect] = useState(false)
  const [exhausted, setExhausted] = useState(false)

  const answerType = quest.answerType || "text"

  const handleSubmit = () => {
    if (disabled || isCorrect || exhausted) return

    const submission = answerType === "multiple_choice" && selectedOption !== null
      ? String(selectedOption)
      : answer.trim()

    if (!submission) return

    const result = validateAnswer(quest.id, submission, answerType)
    const retriesUsed = 2 - retries

    if (result.isCorrect) {
      setIsCorrect(true)
      onSubmit(quest.xp_reward, retriesUsed)
    } else {
      const newRetries = retries - 1
      setRetries(newRetries)
      setShowError(true)
      setFeedback(result.feedback)
      setExplanation(result.expectedExplanation)
      if (newRetries <= 0) {
        setExhausted(true)
      }
    }
  }

  const handleRetry = () => {
    setShowError(false)
    setFeedback("")
  }

  if (disabled) {
    return (
      <div className="rounded-xl border border-muted-foreground/20 bg-muted/20 p-4 text-center text-sm text-muted-foreground">
        Complete the previous quest to unlock this one.
      </div>
    )
  }

  if (isCorrect) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center"
      >
        <div className="mb-1 text-lg font-bold text-emerald-500">Completed!</div>
        <p className="text-sm text-emerald-400">+{quest.xp_reward} XP earned</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Multiple choice */}
      {answerType === "multiple_choice" && quest.options && (
        <div className="space-y-2">
          {quest.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelectedOption(i)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition-all",
                selectedOption === i
                  ? "border-indigo-500/40 bg-indigo-500/10 text-foreground"
                  : "border-border/50 bg-background text-muted-foreground hover:border-indigo-500/20 hover:bg-indigo-500/5",
              )}
            >
              <div
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                  selectedOption === i
                    ? "border-indigo-500 bg-indigo-500 text-white"
                    : "border-muted-foreground/30 text-muted-foreground",
                )}
              >
                {String.fromCharCode(65 + i)}
              </div>
              <span>{opt}</span>
            </button>
          ))}
        </div>
      )}

      {/* Text answer */}
      {answerType === "text" && (
        <div>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full resize-none rounded-xl border border-border/50 bg-background p-4 text-sm leading-relaxed text-foreground outline-none transition-all focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 placeholder:text-muted-foreground/30"
            rows={4}
          />
          {quest.instructions && (
            <p className="mt-1.5 text-xs text-muted-foreground/60">
              <ListChecks className="mr-1 inline size-3" />
              Include key concepts from the lesson in your answer.
            </p>
          )}
        </div>
      )}

      {/* Code answer */}
      {answerType === "code" && (
        <div>
          <div className="flex items-center gap-2 rounded-t-xl border border-border/50 bg-muted/30 px-4 py-2">
            <Code2 className="size-3.5 text-muted-foreground" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {quest.practiceType?.toUpperCase() || "Code"} Answer
            </span>
          </div>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={quest.practiceType === "sql" ? "SELECT ..." : "# Write your code"}
            className="w-full resize-none border-x border-b border-border/50 bg-[#0a0a0f] p-4 font-mono text-sm leading-relaxed text-foreground outline-none transition-all focus:border-indigo-500/40 placeholder:text-muted-foreground/30"
            rows={6}
            spellCheck={false}
          />
        </div>
      )}

      {/* Error feedback */}
      {showError && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3"
        >
          <p className="text-sm text-orange-300">{feedback}</p>
          {retries > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-orange-400">Retries remaining: {retries}</span>
              <button
                onClick={handleRetry}
                className="rounded-lg bg-orange-600 px-3 py-1 text-xs font-medium text-white hover:bg-orange-500"
              >
                Try Again
              </button>
            </div>
          )}
          {exhausted && explanation && (
            <div className="mt-3 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-2.5">
              <p className="text-xs font-medium text-indigo-400">Expected approach:</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{explanation}</p>
              <p className="mt-1.5 text-xs text-muted-foreground/50">
                You can retry this quest after reviewing the material.
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={exhausted || (answerType === "multiple_choice" ? selectedOption === null : !answer.trim())}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all",
          exhausted
            ? "cursor-not-allowed bg-muted text-muted-foreground"
            : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-500 hover:to-blue-500",
        )}
      >
        <Send className="size-4" />
        {exhausted ? "Retries Exhausted" : "Submit Answer"}
      </button>
    </div>
  )
}
