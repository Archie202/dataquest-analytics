"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import dynamic from "next/dynamic"
import {
  Play, RotateCcw, Table2, Terminal, ChevronDown, ChevronRight,
  Database, Loader2, AlertCircle, CheckCircle2, History,
  FileText, Plus, Trash2, Copy,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { editor } from "monaco-editor"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

interface SqlLabProps {
  questTitle?: string
  questInstructions?: string
  onComplete?: (xp: number) => void
  xpReward?: number
}

interface QueryResultData {
  type?: string
  columns?: string[]
  rows?: (string | number | boolean | null)[][]
  rowCount?: number
  error?: string
  changes?: number
}

interface SchemaTable {
  name: string
  columns: { name: string; type: string }[]
  rowCount: number
}

const STORAGE_KEY = "sql-lab-history"
const QUERY_KEY = "sql-lab-current-query"

const SAMPLE_QUERIES = [
  { label: "All sales", sql: "SELECT * FROM sales LIMIT 10;" },
  { label: "Sales by region", sql: "SELECT region, SUM(amount) as total, COUNT(*) as count FROM sales GROUP BY region ORDER BY total DESC;" },
  { label: "Top customers", sql: "SELECT c.name, c.city, SUM(s.amount) as total_spent FROM customers c JOIN sales s ON c.id = s.customer_id GROUP BY c.id ORDER BY total_spent DESC LIMIT 5;" },
  { label: "Product sales", sql: "SELECT p.name, p.category, SUM(s.amount) as revenue FROM products p JOIN sales s ON p.id = s.product_id GROUP BY p.id ORDER BY revenue DESC;" },
  { label: "Failed transactions", sql: "SELECT * FROM transactions WHERE success = 0;" },
  { label: "Monthly trend", sql: "SELECT substr(sale_date,1,7) as month, SUM(amount) as revenue, COUNT(*) as orders FROM sales GROUP BY month ORDER BY month;" },
  { label: "Premium customers", sql: "SELECT * FROM customers WHERE segment = 'Premium' AND is_active = 1;" },
  { label: "Create a table", sql: "-- Try creating your own table!\nCREATE TABLE my_analysis AS SELECT region, SUM(amount) as total FROM sales GROUP BY region;" },
]

const TABLES = ["sales", "customers", "products", "transactions"] as const

export function SqlLab({
  questTitle,
  questInstructions,
  onComplete,
  xpReward,
}: SqlLabProps) {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<QueryResultData | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSchema, setShowSchema] = useState(true)
  const [schema, setSchema] = useState<SchemaTable[]>([])
  const [showReward, setShowReward] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [queryHistory, setQueryHistory] = useState<string[]>([])
  const [statementHistory, setStatementHistory] = useState<string[]>([])
  const [executionTime, setExecutionTime] = useState<number | null>(null)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  // Load persisted state
  useEffect(() => {
    const savedQuery = localStorage.getItem(QUERY_KEY)
    if (savedQuery) setQuery(savedQuery)

    const savedHistory = localStorage.getItem(STORAGE_KEY)
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setQueryHistory(parsed.queries ?? [])
        setStatementHistory(parsed.statements ?? [])
      } catch { /* ignore */ }
    }
  }, [])

  // Persist current query
  useEffect(() => {
    if (query) localStorage.setItem(QUERY_KEY, query)
  }, [query])

  const persistHistory = useCallback((queries: string[], stmts: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ queries, statements: stmts }))
    } catch { /* ignore */ }
  }, [])

  const fetchSchema = useCallback(async () => {
    const tables = [...TABLES]
    const schemaInfo: SchemaTable[] = []

    for (const table of tables) {
      try {
        const res = await fetch("/api/sql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statements: [`PRAGMA table_info(${table})`, `SELECT COUNT(*) as cnt FROM ${table}`] }),
        })
        const data = await res.json()
        if (data.columns && data.rows) {
          const cols = data.rows.slice(0, -1).map((r: (string | number | boolean | null)[]) => ({
            name: String(r[1] ?? ""),
            type: String(r[2] ?? "TEXT"),
          }))
          const countRow = data.rows[data.rows.length - 1]
          schemaInfo.push({ name: table, columns: cols, rowCount: Number(countRow?.[0] ?? 0) })
        }
      } catch { /* ignore */ }
    }
    setSchema(schemaInfo)
  }, [])

  // Load schema on mount
  useEffect(() => {
    fetchSchema()
  }, [fetchSchema])

  const runQuery = useCallback(async () => {
    const cleaned = query.trim()
    if (!cleaned) return

    setIsRunning(true)
    setError(null)
    setResult(null)
    setExecutionTime(null)
    const start = performance.now()

    const newStatements = [...statementHistory, cleaned]

    try {
      const res = await fetch("/api/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statements: newStatements }),
      })

      const data: QueryResultData = await res.json()

      if (data.error) {
        setError(data.error)
        setResult({ error: data.error })
        setExecutionTime(Math.round((performance.now() - start) * 100) / 100)
      } else {
        setResult(data)
        setExecutionTime(Math.round((performance.now() - start) * 100) / 100)
        setStatementHistory(newStatements)
        setQueryHistory((prev) => [cleaned, ...prev.slice(0, 49)])
        persistHistory([cleaned, ...queryHistory.slice(0, 48)], newStatements)
        // Refresh schema if DDL/DML was executed
        if (/^\s*(CREATE|DROP|ALTER|INSERT|UPDATE|DELETE)/i.test(cleaned)) {
          setTimeout(() => fetchSchema(), 100)
        }
      }
    } catch (err) {
      const msg = (err as Error).message
      setError(msg)
      setResult({ error: msg })
      setExecutionTime(Math.round((performance.now() - start) * 100) / 100)
    } finally {
      setIsRunning(false)
    }
  }, [query, statementHistory, queryHistory, persistHistory, fetchSchema])

  const handleEditorMount = useCallback((ed: editor.IStandaloneCodeEditor) => {
    editorRef.current = ed
    ed.onDidChangeModelContent(() => {
      setQuery(ed.getValue())
    })
    // Ctrl/Cmd + Enter to run
    ed.addCommand(0, () => runQuery())
    // Re-map the execute command
    ed.addAction({
      id: "run-query",
      label: "Run Query",
      keybindings: [2048 | 13], // Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.Enter
      run: () => runQuery(),
    })
  }, [runQuery])

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined) setQuery(value)
  }, [])

  const clearOutput = useCallback(() => {
    setResult(null)
    setError(null)
    setExecutionTime(null)
  }, [])

  const reset = useCallback(() => {
    setQuery("SELECT * FROM sales LIMIT 5;")
    setResult(null)
    setError(null)
    setExecutionTime(null)
    setShowReward(false)
    setStatementHistory([])
    localStorage.removeItem(QUERY_KEY)
    localStorage.removeItem(STORAGE_KEY)
    setQueryHistory([])
  }, [])

  const insertSample = useCallback((sql: string) => {
    setQuery(sql)
  }, [])

  const copyToEditor = useCallback((sql: string) => {
    setQuery(sql)
    setShowHistory(false)
  }, [])

  const clearHistory = useCallback(() => {
    setQueryHistory([])
    setStatementHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const handleQuestSubmit = useCallback(() => {
    if (onComplete && xpReward) {
      onComplete(xpReward)
      setShowReward(true)
      setTimeout(() => setShowReward(false), 3000)
    }
  }, [onComplete, xpReward])

  const hasResult = result !== null
  const hasError = error !== null
  const isQuery = result?.type === "query" && result.columns && result.columns.length > 0

  return (
    <div className="flex flex-col gap-4">
      {/* Quest header */}
      {(questTitle || questInstructions) && (
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
          {questTitle && (
            <h3 className="flex items-center gap-2 text-sm font-semibold text-indigo-400">
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

      <div className="flex flex-col gap-4 xl:flex-row">
        {/* Left Panel - Schema */}
        <div className="order-2 xl:order-1 xl:w-64 xl:shrink-0">
          <div className="rounded-xl border border-border/50 bg-background">
            <button
              onClick={() => setShowSchema(!showSchema)}
              className="flex w-full items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              <span className="flex items-center gap-2">
                <Database className="size-3.5" /> Schema
              </span>
              {showSchema ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
            </button>
            {showSchema && (
              <div className="space-y-2 px-3 pb-4">
                {schema.length === 0 ? (
                  <p className="text-xs text-muted-foreground/50">Loading...</p>
                ) : (
                  schema.map((table) => (
                    <div
                      key={table.name}
                      className="rounded-lg border border-border/40 bg-muted/20 p-2.5 cursor-pointer hover:bg-muted/40 transition-colors"
                      onClick={() => insertSample(`SELECT * FROM ${table.name} LIMIT 10;`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                          <Table2 className="size-3" /> {table.name}
                        </div>
                        <span className="text-[10px] text-muted-foreground/50">{table.rowCount} rows</span>
                      </div>
                      <div className="mt-1.5 space-y-0.5">
                        {table.columns.map((col) => (
                          <div key={col.name} className="flex items-center gap-2 font-mono text-[10px] leading-relaxed">
                            <span className="text-foreground/80">{col.name}</span>
                            <span className="text-muted-foreground/40">{col.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}

                {/* Sample queries */}
                <div className="mt-3">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <FileText className="size-3" /> Sample Queries
                  </p>
                  <div className="space-y-1">
                    {SAMPLE_QUERIES.map((sq, i) => (
                      <button
                        key={i}
                        onClick={() => insertSample(sq.sql)}
                        className="w-full rounded-lg bg-muted/20 px-2.5 py-1.5 text-left text-[10px] leading-relaxed text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground font-mono"
                        title={sq.sql}
                      >
                        {sq.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* History */}
          <div className="mt-3 rounded-xl border border-border/50 bg-background">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex w-full items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              <span className="flex items-center gap-2">
                <History className="size-3.5" /> History
                {queryHistory.length > 0 && (
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px]">{queryHistory.length}</span>
                )}
              </span>
              {showHistory ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
            </button>
            {showHistory && (
              <div className="px-3 pb-4">
                {queryHistory.length === 0 ? (
                  <p className="text-xs text-muted-foreground/50">No queries yet</p>
                ) : (
                  <>
                    <button
                      onClick={clearHistory}
                      className="mb-2 flex items-center gap-1 rounded-md bg-muted/30 px-2 py-1 text-[10px] text-muted-foreground hover:bg-muted/50"
                    >
                      <Trash2 className="size-2.5" /> Clear
                    </button>
                    <div className="max-h-48 space-y-1 overflow-y-auto">
                      {queryHistory.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => copyToEditor(q)}
                          className="flex w-full items-start gap-1.5 rounded-md bg-muted/10 p-2 text-left font-mono text-[10px] leading-relaxed text-muted-foreground hover:bg-muted/30"
                        >
                          <Copy className="mt-0.5 size-2.5 shrink-0" />
                          <span className="line-clamp-2">{q}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center + Right: Editor + Results */}
        <div className="order-1 xl:order-2 flex-1 space-y-3 min-w-0">
          {/* Editor */}
          <div className="overflow-hidden rounded-xl border border-border/50">
            <div className="flex items-center justify-between border-b border-border/40 bg-muted/20 px-4 py-2">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Terminal className="size-3" />
                SQL Editor
                <span className="ml-1 text-muted-foreground/30 font-normal normal-case">(Ctrl+Enter to run)</span>
              </span>
              <div className="flex items-center gap-1.5">
                {executionTime !== null && (
                  <span className="text-[10px] text-muted-foreground/50">{executionTime}ms</span>
                )}
                <button
                  onClick={runQuery}
                  disabled={isRunning || !query.trim()}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1 text-[11px] font-medium transition-colors",
                    isRunning || !query.trim()
                      ? "bg-indigo-600/50 text-white/70 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-500",
                  )}
                >
                  {isRunning ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Play className="size-3" />
                  )}
                  {isRunning ? "Running..." : "Run"}
                </button>
                <button
                  onClick={clearOutput}
                  disabled={!hasResult && !hasError}
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
            <div className="h-[200px] w-full">
              <MonacoEditor
                height="100%"
                language="sql"
                theme="vs-dark"
                value={query}
                onChange={handleEditorChange}
                onMount={handleEditorMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  tabSize: 2,
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
          </div>

          {/* Results / Error panel */}
          <div className="overflow-hidden rounded-xl border border-border/50 bg-black/90">
            {/* Console header with status badges */}
            <div className="flex items-center justify-between border-b border-border/40 px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Table2 className="size-3" />
                  Results
                </span>
                {hasError && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-1.5 py-0.5 text-[9px] text-red-400">
                    <AlertCircle className="size-2.5" />
                    Error
                  </span>
                )}
                {isQuery && !hasError && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] text-emerald-400">
                    <CheckCircle2 className="size-2.5" />
                    {result?.rowCount ?? 0} row{(result?.rowCount ?? 0) !== 1 ? "s" : ""}
                  </span>
                )}
                {result?.type === "exec" && !hasError && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[9px] text-blue-400">
                    <CheckCircle2 className="size-2.5" />
                    Executed
                  </span>
                )}
              </div>
              {executionTime !== null && (
                <span className="text-[10px] text-muted-foreground/40">{executionTime}ms</span>
              )}
            </div>

            {/* Content */}
            <div className="max-h-[400px] overflow-auto">
              {!hasResult && !hasError ? (
                <div className="px-4 py-8 text-center font-mono text-xs text-muted-foreground/30 italic">
                  Write a SQL query and click Run to see results.
                  <br />
                  Try: <span className="cursor-pointer text-indigo-400/60 hover:text-indigo-400" onClick={() => insertSample("SELECT * FROM sales LIMIT 10;")}>SELECT * FROM sales LIMIT 10;</span>
                </div>
              ) : hasError ? (
                <div className="p-4 font-mono text-xs leading-relaxed">
                  <div className="flex items-center gap-2 text-sm font-medium text-red-400 mb-2">
                    <AlertCircle className="size-4" /> SQL Error
                  </div>
                  <div className="whitespace-pre-wrap text-red-300/90">{error}</div>
                </div>
              ) : isQuery ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border/30 bg-muted/20">
                        {(result.columns ?? []).map((col) => (
                          <th
                            key={col}
                            className="px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {((result.rows ?? []) as (string | number | boolean | null)[][]).map((row, ri) => (
                        <tr
                          key={ri}
                          className={cn(
                            "border-b border-border/20 transition-colors",
                            ri % 2 === 0 ? "bg-background" : "bg-muted/10",
                            "hover:bg-muted/20",
                          )}
                        >
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-4 py-2 font-mono text-[11px] text-foreground/80 whitespace-nowrap">
                              {cell !== null && cell !== undefined ? String(cell) : <span className="text-muted-foreground/30 italic">NULL</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(result.rows ?? []).length === 0 && (
                    <div className="px-4 py-6 text-center text-xs text-muted-foreground/50">Query returned no rows.</div>
                  )}
                </div>
              ) : result?.type === "exec" ? (
                <div className="px-4 py-6 text-center text-xs text-muted-foreground/70">
                  Statement executed successfully.
                  {result.changes !== undefined && result.changes > 0 && (
                    <span> ({result.changes} row{(result.changes ?? 0) !== 1 ? "s" : ""} affected)</span>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* Quest submit */}
          {onComplete && xpReward && (
            <button
              onClick={handleQuestSubmit}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 py-2.5 text-sm font-medium text-white transition-all hover:from-indigo-500 hover:to-blue-500"
            >
              Mark as Complete
            </button>
          )}
        </div>
      </div>

      {/* Reward popup */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-600 to-blue-600 px-6 py-4 text-white shadow-2xl shadow-indigo-500/20">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/20">
                  <Terminal className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">SQL Quest Complete!</p>
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
