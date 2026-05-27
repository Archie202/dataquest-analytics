"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import dynamic from "next/dynamic"
import { Play, RotateCcw, Terminal, Trash2, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { editor } from "monaco-editor"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

interface PythonLabProps {
  questTitle?: string
  questInstructions?: string
  onComplete?: (xp: number) => void
  xpReward?: number
  initialCode?: string
}

const STORAGE_KEY = "python-lab-code"
const OUTPUT_KEY = "python-lab-output"

export function PythonLab({
  questTitle,
  questInstructions,
  onComplete,
  xpReward,
  initialCode = "# Write your Python code here\nimport pandas as pd\n\nprint('Hello, DataQuest Agent!')",
}: PythonLabProps) {
  const [code, setCode] = useState("")
  const [output, setOutput] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showReward, setShowReward] = useState(false)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  // Load persisted code on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    setCode(saved ?? initialCode)
    const savedOutput = localStorage.getItem(OUTPUT_KEY)
    if (savedOutput) {
      try {
        setOutput(JSON.parse(savedOutput))
      } catch {
        // ignore
      }
    }
  }, [initialCode])

  // Persist code on change
  useEffect(() => {
    if (code) {
      localStorage.setItem(STORAGE_KEY, code)
    }
  }, [code])

  const persistOutput = useCallback((lines: string[]) => {
    try {
      localStorage.setItem(OUTPUT_KEY, JSON.stringify(lines))
    } catch {
      // ignore quota errors
    }
  }, [])

  const handleEditorMount = useCallback((ed: editor.IStandaloneCodeEditor) => {
    editorRef.current = ed
    ed.onDidChangeModelContent(() => {
      setCode(ed.getValue())
    })
  }, [])

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
    }
  }, [])

  const runCode = useCallback(async () => {
    setIsRunning(true)
    setError(null)

    try {
      const res = await fetch("/api/python", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })

      const data = await res.json()

      const lines: string[] = []
      if (data.stdout) {
        lines.push(...data.stdout.split("\n").filter((l: string) => l.length > 0))
      }
      if (data.stderr) {
        lines.push("")
        lines.push("Traceback (most recent call last):")
        lines.push(...data.stderr.split("\n").filter((l: string) => l.length > 0))
        setError(data.stderr)
      }
      if (lines.length === 0) {
        lines.push("(no output)")
      }

      setOutput(lines)
      persistOutput(lines)
    } catch (err) {
      const msg = (err as Error).message
      setOutput(["Error: Failed to execute code.", "", msg])
      setError(msg)
      persistOutput(["Error: Failed to execute code.", "", msg])
    } finally {
      setIsRunning(false)
    }
  }, [code, persistOutput])

  const clearOutput = useCallback(() => {
    setOutput([])
    setError(null)
    localStorage.removeItem(OUTPUT_KEY)
  }, [])

  const reset = useCallback(() => {
    setCode(initialCode)
    setOutput([])
    setError(null)
    setShowReward(false)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(OUTPUT_KEY)
  }, [initialCode])

  const handleQuestSubmit = useCallback(() => {
    if (onComplete && xpReward) {
      onComplete(xpReward)
      setShowReward(true)
      setTimeout(() => setShowReward(false), 3000)
    }
  }, [onComplete, xpReward])

  // Check if Python is available at the editor level (from output)
  const hasOutput = output.length > 0
  const hasError = error !== null

  return (
    <div className="flex flex-col gap-4">
      {/* Quest header */}
      {(questTitle || questInstructions) && (
        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
          {questTitle && (
            <h3 className="flex items-center gap-2 text-sm font-semibold text-purple-400">
              <Terminal className="size-4" /> {questTitle}
            </h3>
          )}
          {questInstructions && (
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {questInstructions}
            </p>
          )}
        </div>
      )}

      {/* Editor + Console */}
      <div className="flex flex-col gap-0 overflow-hidden rounded-xl border border-border/50">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border/40 bg-muted/20 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Terminal className="size-3" />
              Python Editor
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={runCode}
              disabled={isRunning}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1 text-[11px] font-medium transition-colors",
                isRunning
                  ? "bg-purple-600/50 text-white/70 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-500",
              )}
            >
              {isRunning ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Play className="size-3" />
              )}
              {isRunning ? "Running..." : "Run Code"}
            </button>
            <button
              onClick={clearOutput}
              disabled={!hasOutput}
              className="flex items-center gap-1 rounded-lg border border-border/50 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-accent disabled:opacity-30"
            >
              <Trash2 className="size-3" />
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-1 rounded-lg border border-border/50 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-accent"
            >
              <RotateCcw className="size-3" />
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="h-[350px] w-full border-b border-border/40">
          <MonacoEditor
            height="100%"
            language="python"
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              tabSize: 4,
              insertSpaces: true,
              automaticLayout: true,
              bracketPairColorization: { enabled: true },
              autoClosingBrackets: "always",
              autoClosingQuotes: "always",
              autoIndent: "full",
              formatOnPaste: true,
              matchBrackets: "always",
              renderWhitespace: "selection",
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              padding: { top: 12 },
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
            }}
          />
        </div>

        {/* Console output */}
        <div className="border-t border-border/40 bg-black/90">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Terminal className="size-3" />
              Console
              {hasError && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-1.5 py-0.5 text-[9px] text-red-400">
                  <AlertCircle className="size-2.5" />
                  Error
                </span>
              )}
              {!hasError && hasOutput && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] text-emerald-400">
                  <CheckCircle2 className="size-2.5" />
                  Success
                </span>
              )}
            </span>
          </div>
          <div className="h-[200px] overflow-y-auto px-4 pb-4 font-mono text-xs leading-relaxed">
            {!hasOutput ? (
              <span className="text-muted-foreground/30 italic">
                Press "Run Code" to execute your Python script.
                <br />
                Output will appear here...
              </span>
            ) : (
              output.map((line, i) => {
                const isErrorLine = line.startsWith("Traceback") || line.startsWith("  File") || line.startsWith("Error:") || line.startsWith("NameError") || line.startsWith("SyntaxError") || line.startsWith("IndentationError") || line.startsWith("TypeError") || line.startsWith("ValueError") || line.startsWith("KeyError") || line.startsWith("IndexError") || line.startsWith("AttributeError") || line.startsWith("ImportError") || line.startsWith("ModuleNotFoundError") || line.startsWith("ZeroDivisionError") || line.startsWith("FileNotFoundError") || line.startsWith("RuntimeError") || line.startsWith("KeyboardInterrupt") || line.startsWith("StopIteration") || line.startsWith("AssertionError") || line.startsWith("EOFError") || line.startsWith("MemoryError") || line.startsWith("RecursionError") || line.startsWith("SystemError") || line.startsWith("Warning") || line.startsWith("DeprecationWarning") || line.startsWith("PendingDeprecationWarning") || line.startsWith("UserWarning") || line.startsWith("SyntaxWarning") || line.startsWith("RuntimeWarning") || line.startsWith("FutureWarning") || line.startsWith("ImportWarning") || line.startsWith("UnicodeWarning") || line.startsWith("BytesWarning") || line.startsWith("ResourceWarning")

                return (
                  <div
                    key={i}
                    className={cn(
                      "py-0.5",
                      isErrorLine && "text-red-400",
                      !isErrorLine && "text-green-400/90",
                      line.trim() === "" && "h-2",
                    )}
                  >
                    {line}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Submit for quest mode */}
      {onComplete && xpReward && (
        <>
          <button
            onClick={handleQuestSubmit}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-2.5 text-sm font-medium text-white transition-all hover:from-purple-500 hover:to-pink-500"
          >
            Mark as Complete
          </button>
        </>
      )}

      {/* Reward popup */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-600 to-pink-600 px-6 py-4 text-white shadow-2xl shadow-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/20">
                  <Terminal className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Python Quest Complete!</p>
                  <p className="text-2xl font-bold">+{xpReward} XP</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
