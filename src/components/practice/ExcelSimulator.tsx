"use client"

import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import {
  Calculator, Sigma, ArrowUpDown, CheckCircle2, Download, Upload,
  BarChart3, LineChart, PieChart, Plus, Trash2, FileSpreadsheet,
  SplitSquareHorizontal, Lock,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  type CellData, type CellMap,
  evaluateFormula, getCellValue, getCellNumeric,
  parseCSV, csvToCells, datasetToCells, preloadedDatasets,
  COLUMNS, ROWS, expandRange, indexToCol,
} from "@/lib/spreadsheet-engine"
import {
  BarChart as ReBarChart, Bar, LineChart as ReLineChart, Line, PieChart as RPieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell,
} from "recharts"

interface ExcelSimulatorProps {
  questTitle?: string
  questInstructions?: string
  onComplete?: (xp: number) => void
  xpReward?: number
}

const STORAGE_KEY = "excel-lab-state"

type ChartType = "bar" | "line" | "pie"
type SortDir = "asc" | "desc" | null

interface SheetState {
  name: string
  cells: CellMap
}

export function ExcelSimulator({ questTitle, questInstructions, onComplete, xpReward }: ExcelSimulatorProps) {
  const [sheets, setSheets] = useState<SheetState[]>([{ name: "Sheet1", cells: {} }])
  const [activeSheet, setActiveSheet] = useState(0)
  const [selectedCell, setSelectedCell] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [showCharts, setShowCharts] = useState(false)
  const [chartType, setChartType] = useState<ChartType>("bar")
  const [chartRange, setChartRange] = useState("A1:B6")
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)
  const [filterText, setFilterText] = useState("")
  const [showFilter, setShowFilter] = useState(false)
  const [showDatasets, setShowDatasets] = useState(false)
  const [multiSelect, setMultiSelect] = useState<string[]>([])
  const cellRefs = useRef<Record<string, HTMLTableCellElement | null>>({})

  const currentSheet = sheets[activeSheet]
  const cells = currentSheet.cells

  const setCells = useCallback((fn: CellMap | ((prev: CellMap) => CellMap)) => {
    setSheets((prev) => {
      const updated = prev.map((s, i) =>
        i === activeSheet ? { ...s, cells: typeof fn === "function" ? fn(s.cells) : fn } : s
      )
      return updated
    })
  }, [activeSheet])

  // ── Persistence ──────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSheets(parsed.sheets ?? parsed)
      } catch { /* ignore */ }
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ sheets }))
    }, 500)
    return () => clearTimeout(timer)
  }, [sheets])

  // ── Loading dataset ──────────────────────────────────────────────────────
  const loadDataset = useCallback((name: string) => {
    const dataset = preloadedDatasets[name]
    if (!dataset) return
    const newCells = datasetToCells(dataset)
    setSheets((prev) => {
      const updated = [...prev]
      updated[activeSheet] = { ...updated[activeSheet], cells: { ...updated[activeSheet].cells, ...newCells } }
      return updated
    })
  }, [activeSheet])

  // ── CSV Import ───────────────────────────────────────────────────────────
  const handleCSVImport = useCallback(() => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".csv"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const text = await file.text()
      const rows = parseCSV(text)
      if (rows.length === 0) return
      const headers = rows[0]
      const data = rows.slice(1)
      const newCells = csvToCells(headers, data)
      setSheets((prev) => {
        const updated = [...prev]
        updated[activeSheet] = { ...updated[activeSheet], cells: { ...updated[activeSheet].cells, ...newCells } }
        return updated
      })
    }
    input.click()
  }, [activeSheet])

  // ── Formula Evaluation ───────────────────────────────────────────────────
  const resolveCell = useCallback((ref: string): string => {
    const upper = ref.toUpperCase()
    const cell = cells[upper]
    if (!cell) return ""
    if (cell.formula) {
      try {
        return evaluateFormula(cell.formula, cells)
      } catch {
        return "#ERROR"
      }
    }
    return cell.value
  }, [cells])

  const resolveCellNum = useCallback((ref: string): number => {
    return getCellNumeric(ref, cells)
  }, [cells])

  // ── Cell editing ─────────────────────────────────────────────────────────
  const handleCellClick = useCallback((ref: string, e?: React.MouseEvent) => {
    if (e?.shiftKey) {
      setMultiSelect((prev) => prev.includes(ref) ? prev : [...prev, ref])
      return
    }
    setMultiSelect([])
    setSelectedCell(ref)
    setShowFilter(false)
    const cell = cells[ref]
    setIsEditing(true)
    setEditValue(cell?.formula ? `=${cell.formula}` : (cell?.value ?? ""))
  }, [cells])

  const commitEdit = useCallback(() => {
    if (!selectedCell) return
    const val = editValue.trim()
    if (val.startsWith("=")) {
      const formula = val.substring(1)
      setCells((prev) => ({
        ...prev,
        [selectedCell]: { value: "", formula },
      }))
    } else {
      setCells((prev) => ({
        ...prev,
        [selectedCell]: { value: val },
      }))
    }
    setIsEditing(false)
  }, [selectedCell, editValue, setCells])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      commitEdit()
      if (selectedCell) {
        // Move down
        const m = selectedCell.match(/^([A-Z]+)(\d+)$/)
        if (m) {
          const next = `${m[1]}${parseInt(m[2]) + 1}`
          setSelectedCell(next)
          const nextCell = cells[next]
          setEditValue(nextCell?.formula ? `=${nextCell.formula}` : (nextCell?.value ?? ""))
          setIsEditing(true)
        }
      }
    }
    if (e.key === "Tab") {
      e.preventDefault()
      commitEdit()
      if (selectedCell) {
        const m = selectedCell.match(/^([A-Z]+)(\d+)$/)
        if (m) {
          const nextCol = indexToCol(colToIndex(m[1]) + 1)
          const next = `${nextCol}${m[2]}`
          setSelectedCell(next)
          const nextCell = cells[next]
          setEditValue(nextCell?.formula ? `=${nextCell.formula}` : (nextCell?.value ?? ""))
          setIsEditing(true)
        }
      }
    }
    if (e.key === "Escape") {
      setIsEditing(false)
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
      if (!isEditing) {
        e.preventDefault()
        if (selectedCell) {
          const m = selectedCell.match(/^([A-Z]+)(\d+)$/)
          if (m) {
            let col = m[1]
            let row = parseInt(m[2])
            if (e.key === "ArrowDown") row = Math.min(row + 1, ROWS)
            if (e.key === "ArrowUp") row = Math.max(row - 1, 1)
            if (e.key === "ArrowRight") col = indexToCol(Math.min(colToIndex(col) + 1, COLUMNS - 1))
            if (e.key === "ArrowLeft") col = indexToCol(Math.max(colToIndex(col) - 1, 0))
            const next = `${col}${row}`
            setSelectedCell(next)
            const nextCell = cells[next]
            setEditValue(nextCell?.formula ? `=${nextCell.formula}` : (nextCell?.value ?? ""))
            setIsEditing(true)
          }
        }
      }
    }
  }, [selectedCell, commitEdit, isEditing, cells])

  const colToIndexFn = (col: string): number => {
    let idx = 0
    for (let i = 0; i < col.length; i++) {
      idx = idx * 26 + (col.charCodeAt(i) - 64)
    }
    return idx - 1
  }

  const colToIndex = colToIndexFn

  // ── Sheets ──────────────────────────────────────────────────────────────
  const addSheet = useCallback(() => {
    setSheets((prev) => [...prev, { name: `Sheet${prev.length + 1}`, cells: {} }])
    setActiveSheet(sheets.length)
  }, [sheets.length])

  const switchSheet = useCallback((idx: number) => {
    setActiveSheet(idx)
    setSelectedCell(null)
    setIsEditing(false)
    setMultiSelect([])
  }, [])

  // ── Sort / Filter ───────────────────────────────────────────────────────
  const sortedCells = useMemo(() => {
    const entries = Object.entries(cells).filter(([ref]) => {
      if (!filterText) return true
      return resolveCell(ref).toLowerCase().includes(filterText.toLowerCase())
    })

    if (sortCol && sortDir) {
      entries.sort(([refA], [refB]) => {
        const vA = resolveCell(refA)
        const vB = resolveCell(refB)
        const nA = parseFloat(vA)
        const nB = parseFloat(vB)
        const cmp = !isNaN(nA) && !isNaN(nB) ? nA - nB : vA.localeCompare(vB)
        return sortDir === "desc" ? -cmp : cmp
      })
    }
    return entries
  }, [cells, sortCol, sortDir, filterText, resolveCell])

  // ── Charts ───────────────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    try {
      const rangeCells = expandRange(chartRange)
      const parsed = chartRange.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/i)
      if (!parsed) return []
      const colStartIdx = colToIndexFn(parsed[1])
      const rowStart = parseInt(parsed[2])
      const colEndIdx = colToIndexFn(parsed[3])
      const rowEnd = parseInt(parsed[4])

      const data: Record<string, string | number>[] = []
      const labelCol = indexToCol(colStartIdx)

      for (let r = rowStart + 1; r <= rowEnd; r++) {
        const row: Record<string, string | number> = { name: resolveCell(`${labelCol}${r}`) }
        for (let c = colStartIdx + 1; c <= colEndIdx; c++) {
          const col = indexToCol(c)
          const header = resolveCell(`${col}${rowStart}`) || `Col${c - colStartIdx}`
          const val = parseFloat(resolveCell(`${col}${r}`))
          row[header] = isNaN(val) ? 0 : val
        }
        data.push(row)
      }
      return data
    } catch {
      return []
    }
  }, [chartRange, resolveCell])

  const chartColors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#ec4899"]

  // ── Clear / Reset ────────────────────────────────────────────────────────
  const clearSheet = useCallback(() => {
    setSheets((prev) => {
      const updated = [...prev]
      updated[activeSheet] = { ...updated[activeSheet], cells: {} }
      return updated
    })
    setSelectedCell(null)
    setIsEditing(false)
  }, [activeSheet])

  const formulaBarValue = selectedCell && cells[selectedCell]
    ? (cells[selectedCell].formula ? `=${cells[selectedCell].formula}` : cells[selectedCell].value)
    : ""

  // ── Quest Complete ───────────────────────────────────────────────────────
  const handleComplete = useCallback(() => {
    if (onComplete && xpReward) {
      onComplete(xpReward)
      setShowReward(true)
      setTimeout(() => setShowReward(false), 3000)
    }
  }, [onComplete, xpReward])

  // ── Right panel tab ──────────────────────────────────────────────────────
  const [rightTab, setRightTab] = useState<"charts" | "datasets" | "filter">("charts")

  return (
    <div className="flex flex-col gap-4">
      {/* Quest header */}
      {(questTitle || questInstructions) && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          {questTitle && (
            <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
              <Calculator className="size-4" /> {questTitle}
            </h3>
          )}
          {questInstructions && (
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {questInstructions}
            </p>
          )}
        </div>
      )}

      {/* Formula bar + actions */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/50 bg-background px-4 py-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={clearSheet}
            className="rounded-lg border border-border/40 p-1.5 text-muted-foreground hover:bg-accent"
            title="Clear sheet"
          >
            <Trash2 className="size-3.5" />
          </button>
          <button
            onClick={handleCSVImport}
            className="rounded-lg border border-border/40 p-1.5 text-muted-foreground hover:bg-accent"
            title="Import CSV"
          >
            <Upload className="size-3.5" />
          </button>
        </div>
        <div className="h-5 w-px bg-border/50" />
        <span className="shrink-0 rounded bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground min-w-[40px] text-center">
          {selectedCell || ""}
        </span>
        <div className="flex items-center gap-2 text-muted-foreground/50">
          <Sigma className="size-3.5" />
        </div>
        <input
          value={isEditing ? editValue : formulaBarValue}
          onChange={(e) => { setIsEditing(true); setEditValue(e.target.value) }}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitEdit()
            if (e.key === "Escape") setIsEditing(false)
          }}
          onBlur={() => setTimeout(() => setIsEditing(false), 200)}
          className="min-w-0 flex-1 bg-transparent font-mono text-sm text-foreground outline-none"
          placeholder="Enter value or formula (=SUM(B2:B10))"
        />
        <div className="h-5 w-px bg-border/50" />
        <button
          onClick={handleComplete}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-emerald-500"
        >
          <CheckCircle2 className="size-3.5" /> Complete
        </button>
      </div>

      {/* Main area: Spreadsheet + Right panel */}
      <div className="flex flex-col gap-4 xl:flex-row">
        {/* Spreadsheet */}
        <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-border/50 bg-background">
          <div className="overflow-auto max-h-[500px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr>
                  <th className="sticky left-0 z-20 w-10 border-r border-b border-border/30 bg-muted/40 px-1 py-2 text-center font-mono text-[10px] font-semibold text-muted-foreground">
                    #
                  </th>
                  {Array.from({ length: COLUMNS }, (_, i) => indexToCol(i)).map((col) => (
                    <th
                      key={col}
                      className={cn(
                        "sticky top-0 z-10 border-r border-b border-border/30 bg-muted/40 px-2 py-2 text-center font-mono text-[10px] font-semibold text-muted-foreground last:border-r-0 min-w-[80px]",
                        sortCol === col && "bg-muted/60"
                      )}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{col}</span>
                        <button
                          onClick={() => {
                            if (sortCol === col) {
                              if (sortDir === "asc") setSortDir("desc")
                              else if (sortDir === "desc") { setSortCol(null); setSortDir(null) }
                            } else {
                              setSortCol(col)
                              setSortDir("asc")
                            }
                          }}
                          className="text-muted-foreground/30 hover:text-muted-foreground"
                        >
                          <ArrowUpDown className="size-2.5" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: ROWS }, (_, ri) => ri + 1).map((rowNum) => (
                  <tr key={rowNum}>
                    <td className="sticky left-0 z-10 border-r border-b border-border/20 bg-muted/20 px-1 py-1 text-center font-mono text-[10px] text-muted-foreground/50">
                      {rowNum}
                    </td>
                    {Array.from({ length: COLUMNS }, (_, i) => indexToCol(i)).map((col) => {
                      const ref = `${col}${rowNum}`
                      const cell = cells[ref]
                      const isSelected = selectedCell === ref || multiSelect.includes(ref)
                      const isBold = rowNum === 1
                      const displayVal = resolveCell(ref)
                      const hasFormula = !!cell?.formula

                      return (
                        <td
                          key={ref}
                          ref={(el) => { cellRefs.current[ref] = el }}
                          onClick={(e) => handleCellClick(ref, e)}
                          onDoubleClick={() => {
                            setSelectedCell(ref)
                            setIsEditing(true)
                            setEditValue(cell?.formula ? `=${cell.formula}` : (cell?.value ?? ""))
                          }}
                          className={cn(
                            "cursor-pointer border-r border-b border-border/20 px-2 py-1 text-[11px] transition-colors last:border-r-0 select-none",
                            isSelected && !isEditing && "ring-2 ring-inset ring-emerald-500 bg-emerald-500/5",
                            isSelected && isEditing && "ring-2 ring-inset ring-indigo-500 bg-indigo-500/5",
                            isBold && "font-semibold text-foreground",
                            !isBold && "text-foreground/70",
                            hasFormula && "text-cyan-400/80",
                            displayVal.startsWith("#") && "text-red-400",
                          )}
                          style={{ minWidth: 80, maxWidth: 200 }}
                        >
                          {isEditing && selectedCell === ref ? (
                            <input
                              autoFocus
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={handleKeyDown}
                              onBlur={commitEdit}
                              className="w-full min-w-[60px] bg-transparent font-mono text-[11px] text-foreground outline-none"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <div className="truncate">{displayVal}</div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sheet tabs */}
          <div className="flex items-center border-t border-border/30 bg-muted/20 px-2 py-1">
            <div className="flex items-center gap-0.5 overflow-x-auto">
              {sheets.map((sheet, i) => (
                <button
                  key={i}
                  onClick={() => switchSheet(i)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-t px-3 py-1.5 text-[11px] font-medium transition-colors",
                    i === activeSheet
                      ? "bg-background text-foreground border-t border-x border-border/40"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                  )}
                >
                  <FileSpreadsheet className="size-3" />
                  {sheet.name}
                </button>
              ))}
            </div>
            <button
              onClick={addSheet}
              className="ml-1 rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted/30"
              title="Add sheet"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Right Panel: Charts / Datasets / Filter */}
        <div className="xl:w-80 xl:shrink-0">
          <div className="rounded-xl border border-border/50 bg-background overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-border/40">
              {[
                { id: "charts", icon: BarChart3, label: "Charts" },
                { id: "datasets", icon: Download, label: "Data" },
                { id: "filter", icon: ArrowUpDown, label: "Filter" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setRightTab(tab.id as "charts" | "datasets" | "filter")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors",
                    rightTab === tab.id
                      ? "text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <tab.icon className="size-3" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-3 max-h-[400px] overflow-y-auto">
              {/* Charts Panel */}
              {rightTab === "charts" && (
                <div className="space-y-3">
                  <div className="flex gap-1">
                    {(["bar", "line", "pie"] as ChartType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setChartType(type)}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-colors",
                          chartType === type
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-muted/20 text-muted-foreground border border-transparent hover:bg-muted/40",
                        )}
                      >
                        {type === "bar" && <BarChart3 className="size-3" />}
                        {type === "line" && <LineChart className="size-3" />}
                        {type === "pie" && <PieChart className="size-3" />}
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">Range:</span>
                    <input
                      value={chartRange}
                      onChange={(e) => setChartRange(e.target.value)}
                      className="flex-1 rounded border border-border/30 bg-muted/20 px-2 py-1 font-mono text-[10px] text-foreground outline-none focus:border-emerald-500/40"
                      placeholder="A1:B6"
                    />
                  </div>

                  {chartData.length > 0 ? (
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        {                        chartType === "bar" ? (
                          <ReBarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} />
                            <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} />
                            <Tooltip
                              contentStyle={{
                                background: "rgba(0,0,0,0.9)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "8px",
                                fontSize: "11px",
                              }}
                            />
                            {Object.keys(chartData[0] ?? {})
                              .filter((k) => k !== "name")
                              .map((key, i) => (
                                <Bar key={key} dataKey={key} fill={chartColors[i % chartColors.length]} radius={[4, 4, 0, 0]} />
                              ))}
                          </ReBarChart>
                        ) : chartType === "line" ? (
                          <ReLineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} />
                            <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.5)" }} />
                            <Tooltip
                              contentStyle={{
                                background: "rgba(0,0,0,0.9)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "8px",
                                fontSize: "11px",
                              }}
                            />
                            {Object.keys(chartData[0] ?? {})
                              .filter((k) => k !== "name")
                              .map((key, i) => (
                                <Line key={key} type="monotone" dataKey={key} stroke={chartColors[i % chartColors.length]} strokeWidth={2} dot={{ r: 3 }} />
                              ))}
                          </ReLineChart>
                        ) : (
                          <RPieChart>
                            {Object.keys(chartData[0] ?? {})
                              .filter((k) => k !== "name")
                              .slice(0, 1)
                              .map((key) => (
                                <Pie
                                  key={key}
                                  data={chartData.map((d) => ({ name: d.name, value: Number(d[key]) }))}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                >
                                  {chartData.map((_, i) => (
                                    <Cell key={`cell-${i}`} fill={chartColors[i % chartColors.length]} />
                                  ))}
                                </Pie>
                              ))}
                          </RPieChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex h-[150px] items-center justify-center text-xs text-muted-foreground/50">
                      Select a data range to visualize
                    </div>
                  )}
                </div>
              )}

              {/* Datasets Panel */}
              {rightTab === "datasets" && (
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Preloaded Datasets
                  </p>
                  {Object.keys(preloadedDatasets).map((name) => (
                    <button
                      key={name}
                      onClick={() => loadDataset(name)}
                      className="w-full rounded-lg border border-border/30 bg-muted/20 p-2.5 text-left transition-colors hover:bg-muted/40"
                    >
                      <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                        <Download className="size-3" />
                        {name}
                      </div>
                      <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                        {preloadedDatasets[name].headers.length} columns · {preloadedDatasets[name].rows.length} rows
                      </p>
                    </button>
                  ))}
                  <div className="mt-3">
                    <button
                      onClick={handleCSVImport}
                      className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-border/40 bg-muted/10 p-3 text-[11px] text-muted-foreground transition-colors hover:bg-muted/30"
                    >
                      <Upload className="size-3.5" />
                      Import CSV File
                    </button>
                  </div>
                </div>
              )}

              {/* Filter Panel */}
              {rightTab === "filter" && (
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold text-muted-foreground">Search</label>
                    <input
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                      className="w-full rounded border border-border/30 bg-muted/20 px-2.5 py-1.5 font-mono text-[11px] text-foreground outline-none focus:border-emerald-500/40"
                      placeholder="Filter cells..."
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground mb-1">Quick Formulas</p>
                    <div className="flex flex-wrap gap-1">
                      {["=SUM(B2:B10)", "=AVERAGE(B2:B10)", "=MAX(B2:B10)", "=MIN(B2:B10)", "=COUNT(B2:B10)", "=IF(A1>100,\"High\",\"Low\")"].map((formula) => (
                        <button
                          key={formula}
                          onClick={() => {
                            if (selectedCell) {
                              setEditValue(formula)
                              setIsEditing(true)
                            }
                          }}
                          className="rounded-md border border-border/30 bg-muted/20 px-2 py-1 font-mono text-[9px] text-muted-foreground transition-colors hover:bg-muted/40"
                        >
                          {formula}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground mb-1">Cell References</p>
                    <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                      Type a formula starting with <code className="text-emerald-400">=</code> in any cell.
                      <br />
                      Examples: <code className="text-emerald-400">=A1+B2</code>, <code className="text-emerald-400">=SUM(A1:A10)</code>
                      <br />
                      Use <kbd className="rounded border border-border/30 px-1">Tab</kbd> <kbd className="rounded border border-border/30 px-1">Enter</kbd> to navigate
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
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
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-600 to-teal-600 px-6 py-4 text-white shadow-2xl shadow-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/20">
                  <Calculator className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Excel Task Complete!</p>
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
