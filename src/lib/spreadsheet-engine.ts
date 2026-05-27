// ─── Spreadsheet Formula Engine ─────────────────────────────────────────────
// Supports: SUM, AVERAGE, MIN, MAX, COUNT, IF, AND, OR, CONCAT, LEFT, RIGHT,
// LEN, TODAY, NOW, cell references (A1, B2), ranges (A1:A10), arithmetic

export type CellData = {
  value: string
  formula?: string
}

export type CellMap = Record<string, CellData>

const colToIndex = (col: string): number => {
  let idx = 0
  for (let i = 0; i < col.length; i++) {
    idx = idx * 26 + (col.charCodeAt(i) - 64)
  }
  return idx - 1
}

export const indexToCol = (i: number): string => {
  let col = ""
  i++
  while (i > 0) {
    const rem = (i - 1) % 26
    col = String.fromCharCode(65 + rem) + col
    i = Math.floor((i - rem) / 26)
  }
  return col
}

const cellRegex = /\b([A-Z]+)(\d+)\b/g

export function expandRange(ref: string): string[] {
  const m = ref.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/i)
  if (!m) return [ref.toUpperCase()]
  const colStart = colToIndex(m[1].toUpperCase())
  const rowStart = parseInt(m[2])
  const colEnd = colToIndex(m[3].toUpperCase())
  const rowEnd = parseInt(m[4])
  const cells: string[] = []
  for (let r = rowStart; r <= rowEnd; r++) {
    for (let c = colStart; c <= colEnd; c++) {
      cells.push(`${indexToCol(c)}${r}`)
    }
  }
  return cells
}

export function getCellValue(ref: string, cells: CellMap, visited?: Set<string>): string {
  const upper = ref.toUpperCase()
  if (visited?.has(upper)) return "#REF!"
  const visit = visited ?? new Set()
  visit.add(upper)
  const cell = cells[upper]
  if (!cell) return ""
  if (cell.formula) {
    return evaluateFormula(cell.formula, cells, visit)
  }
  return cell.value
}

export function getCellNumeric(ref: string, cells: CellMap, visited?: Set<string>): number {
  const v = parseFloat(getCellValue(ref, cells, visited))
  return isNaN(v) ? 0 : v
}

function getRangeValues(range: string, cells: CellMap, visited?: Set<string>): number[] {
  const refs = expandRange(range)
  return refs
    .map((r) => getCellNumeric(r, cells, new Set(visited)))
    .filter((v, i) => v !== 0 || getCellValue(refs[i], cells, new Set(visited)) !== "")
}

function getRangeStringValues(range: string, cells: CellMap, visited?: Set<string>): string[] {
  return expandRange(range).map((r) => getCellValue(r, cells, new Set(visited)))
}

function resolveCellRefs(expr: string, cells: CellMap, visited?: Set<string>): string {
  return expr.replace(cellRegex, (_, col, row) => {
    const ref = `${col.toUpperCase()}${row}`
    const val = getCellValue(ref, cells, new Set(visited))
    const num = parseFloat(val)
    return isNaN(num) ? `"${val}"` : String(num)
  })
}

function evaluateArithmetic(expr: string): number {
  // Safely evaluate arithmetic expressions with +, -, *, /, (), and numbers
  const cleaned = expr.trim()
  if (!cleaned) return 0
  try {
    // Only allow digits, operators, parentheses, dots, and spaces
    const sanitized = cleaned.replace(/\s+/g, "")
    if (/^[0-9+\-*/().]+$/.test(sanitized)) {
      return Function(`"use strict"; return (${sanitized})`)()
    }
    // If it contains strings or non-numeric, try as boolean comparison
    if (/[<>!=]/.test(cleaned)) {
      return evaluateComparison(cleaned) ? 1 : 0
    }
    return 0
  } catch {
    return 0
  }
}

function evaluateComparison(expr: string): boolean {
  const cleaned = expr.trim()
  const operators = [
    { re: />=/, fn: (a: number, b: number) => a >= b },
    { re: /<=/, fn: (a: number, b: number) => a <= b },
    { re: /<>/, fn: (a: number, b: number) => a !== b },
    { re: /!=/, fn: (a: number, b: number) => a !== b },
    { re: /=/, fn: (a: number, b: number) => Math.abs(a - b) < 0.0001 },
    { re: />/, fn: (a: number, b: number) => a > b },
    { re: /</, fn: (a: number, b: number) => a < b },
  ]
  for (const op of operators) {
    const m = cleaned.match(new RegExp(`^(.+?)${op.re.source}(.+)$`))
    if (m) {
      const a = evaluateArithmetic(m[1].trim())
      const b = evaluateArithmetic(m[2].trim())
      return op.fn(a, b)
    }
  }
  return false
}

function evaluateStringExpr(expr: string): string {
  // Handle string concatenation with &
  const parts = expr.split("&").map((p) => p.trim())
  if (parts.length > 1) {
    return parts.map((p) => {
      if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
        return p.slice(1, -1)
      }
      const num = parseFloat(p)
      return isNaN(num) ? p : String(num)
    }).join("")
  }
  return expr
}

export function evaluateFormula(formula: string, cells: CellMap, visited?: Set<string>): string {
  const upper = formula.toUpperCase().trim()
  const visit = visited ?? new Set()

  // ── Helper to get range values ──────────────────────────────────────────
  const rangeVals = (range: string): number[] => getRangeValues(range, cells, visit)
  const rangeStrVals = (range: string): string[] => getRangeStringValues(range, cells, visit)

  // ── Function dispatch ───────────────────────────────────────────────────
  const funcs: Record<string, (args: string[]) => string> = {
    SUM: (args) => {
      const vals = args.flatMap((a) => /^[A-Z]+\d+:[A-Z]+\d+$/i.test(a) ? rangeVals(a) : [parseFloat(a) || 0])
      return String(vals.reduce((s, v) => s + v, 0))
    },
    AVERAGE: (args) => {
      const vals = args.flatMap((a) => /^[A-Z]+\d+:[A-Z]+\d+$/i.test(a) ? rangeVals(a) : [parseFloat(a) || 0])
      return vals.length > 0 ? String(Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 100) / 100) : "0"
    },
    MIN: (args) => {
      const vals = args.flatMap((a) => /^[A-Z]+\d+:[A-Z]+\d+$/i.test(a) ? rangeVals(a) : [parseFloat(a) || 0])
      return vals.length > 0 ? String(Math.min(...vals)) : "0"
    },
    MAX: (args) => {
      const vals = args.flatMap((a) => /^[A-Z]+\d+:[A-Z]+\d+$/i.test(a) ? rangeVals(a) : [parseFloat(a) || 0])
      return vals.length > 0 ? String(Math.max(...vals)) : "0"
    },
    COUNT: (args) => {
      const vals = args.flatMap((a) => /^[A-Z]+\d+:[A-Z]+\d+$/i.test(a) ? rangeStrVals(a) : [a])
      return String(vals.filter((v) => v !== "").length)
    },
    IF: (args) => {
      if (args.length < 3) return "#N/A"
      const cond = args[0].trim()
      const trueVal = args[1].trim()
      const falseVal = args.slice(2).join(",").trim()
      // Evaluate condition
      const result = evaluateCondition(cond, cells, visit)
      return result ? resolveCellRefOrString(trueVal, cells, visit) : resolveCellRefOrString(falseVal, cells, visit)
    },
    AND: (args) => {
      return args.every((a) => evaluateCondition(a.trim(), cells, visit)) ? "TRUE" : "FALSE"
    },
    OR: (args) => {
      return args.some((a) => evaluateCondition(a.trim(), cells, visit)) ? "TRUE" : "FALSE"
    },
    CONCAT: (args) => {
      return args.map((a) => resolveCellRefOrString(a.trim(), cells, visit)).join("")
    },
    LEFT: (args) => {
      if (args.length < 2) return "#N/A"
      const text = resolveCellRefOrString(args[0].trim(), cells, visit)
      const n = parseInt(args[1].trim()) || 1
      return text.slice(0, n)
    },
    RIGHT: (args) => {
      if (args.length < 2) return "#N/A"
      const text = resolveCellRefOrString(args[0].trim(), cells, visit)
      const n = parseInt(args[1].trim()) || 1
      return text.slice(-n)
    },
    LEN: (args) => {
      const text = resolveCellRefOrString(args[0].trim(), cells, visit)
      return String(text.length)
    },
    TODAY: () => {
      return new Date().toLocaleDateString("en-CA") // YYYY-MM-DD
    },
    NOW: () => {
      return new Date().toLocaleString("en-US", { hour12: false })
    },
    VLOOKUP: (args) => {
      if (args.length < 3) return "#N/A"
      const lookupVal = resolveCellRefOrString(args[0].trim(), cells, visit).toLowerCase()
      const range = args[1].trim()
      const colIdx = parseInt(args[2].trim()) || 1
      const cellsInRange = expandRange(range)
      // Group into rows
      const rows: string[][] = []
      const parsed = range.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/i)
      if (parsed) {
        const colStart = colToIndex(parsed[1].toUpperCase())
        const rowStart = parseInt(parsed[2])
        const colEnd = colToIndex(parsed[3].toUpperCase())
        const rowEnd = parseInt(parsed[4])
        for (let r = rowStart; r <= rowEnd; r++) {
          const row: string[] = []
          for (let c = colStart; c <= colEnd; c++) {
            row.push(getCellValue(`${indexToCol(c)}${r}`, cells, new Set(visit)))
          }
          rows.push(row)
        }
        const matchRow = rows.find((row) => row[0]?.toLowerCase() === lookupVal)
        if (matchRow && colIdx <= matchRow.length) {
          return matchRow[colIdx - 1] ?? "#N/A"
        }
      }
      return "#N/A"
    },
    HLOOKUP: (args) => {
      if (args.length < 3) return "#N/A"
      const lookupVal = resolveCellRefOrString(args[0].trim(), cells, visit).toLowerCase()
      const range = args[1].trim()
      const rowIdx = parseInt(args[2].trim()) || 1
      const parsed = range.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/i)
      if (parsed) {
        const colStart = colToIndex(parsed[1].toUpperCase())
        const rowStart = parseInt(parsed[2])
        const colEnd = colToIndex(parsed[3].toUpperCase())
        const rowEnd = parseInt(parsed[4])
        const columns: string[][] = []
        for (let c = colStart; c <= colEnd; c++) {
          const col: string[] = []
          for (let r = rowStart; r <= rowEnd; r++) {
            col.push(getCellValue(`${indexToCol(c)}${r}`, cells, new Set(visit)))
          }
          columns.push(col)
        }
        const matchCol = columns.find((col) => col[0]?.toLowerCase() === lookupVal)
        if (matchCol && rowIdx <= matchCol.length) {
          return matchCol[rowIdx - 1] ?? "#N/A"
        }
      }
      return "#N/A"
    },
    XLOOKUP: (args) => {
      if (args.length < 3) return "#N/A"
      const lookupVal = resolveCellRefOrString(args[0].trim(), cells, visit).toLowerCase()
      const lookupRange = args[1].trim()
      const returnRange = args[2].trim()
      const lookupCells = expandRange(lookupRange)
      const returnCells = expandRange(returnRange)
      const idx = lookupCells.findIndex((r) => {
        const v = getCellValue(r, cells, new Set(visit)).toLowerCase()
        if (v === lookupVal) {
          // If it's a number, also try numeric comparison
          return true
        }
        return false
      })
      if (idx >= 0 && idx < returnCells.length) {
        return getCellValue(returnCells[idx], cells, new Set(visit))
      }
      return "#N/A"
    },
  }

  // Check for function calls
  const funcMatch = upper.match(/^([A-Z_]+)\((.+)\)$/)
  if (funcMatch) {
    const fnName = funcMatch[1]
    const fn = funcs[fnName]
    if (fn) {
      // Split arguments by commas, respecting parentheses nesting
      const args = splitArgs(funcMatch[2])
      try {
        return fn(args)
      } catch {
        return "#ERROR"
      }
    }
    return "#NAME?"
  }

  // ── Arithmetic / direct reference ───────────────────────────────────────
  // Resolve cell references
  const resolved = resolveCellRefs(formula, cells, visit)

  // Check if it's a string expression (has & or quoted strings)
  if (resolved.includes("&") || /^".*"$/.test(resolved.trim())) {
    return evaluateStringExpr(resolved)
  }

  // Try arithmetic evaluation
  const num = evaluateArithmetic(resolved)
  if (!isNaN(num) && resolved.trim() !== "") {
    return String(num)
  }

  // Return as-is (string)
  const cellRefMatch = formula.match(cellRegex)
  if (cellRefMatch) {
    return getCellValue(cellRefMatch[0], cells, new Set(visit))
  }

  return formula
}

function splitArgs(args: string): string[] {
  const result: string[] = []
  let depth = 0
  let current = ""
  let inString = false
  let stringChar = ""

  for (let i = 0; i < args.length; i++) {
    const ch = args[i]
    if (inString) {
      current += ch
      if (ch === stringChar) inString = false
      continue
    }
    if (ch === '"' || ch === "'") {
      inString = true
      stringChar = ch
      current += ch
      continue
    }
    if (ch === "(") { depth++; current += ch; continue }
    if (ch === ")") { depth--; current += ch; continue }
    if (ch === "," && depth === 0) {
      result.push(current.trim())
      current = ""
      continue
    }
    current += ch
  }
  result.push(current.trim())
  return result
}

function evaluateCondition(cond: string, cells: CellMap, visited?: Set<string>): boolean {
  const resolved = resolveCellRefs(cond, cells, new Set(visited))
  // Check for comparison operators
  if (/[<>!=]/.test(resolved)) {
    return evaluateComparison(resolved)
  }
  // Check if it's a plain number
  const num = parseFloat(resolved)
  if (!isNaN(num)) return num !== 0
  // Check for TRUE/FALSE
  if (/^true$/i.test(resolved.trim())) return true
  if (/^false$/i.test(resolved.trim())) return false
  // Non-empty string is truthy
  return resolved.trim().length > 0
}

function resolveCellRefOrString(val: string, cells: CellMap, visited?: Set<string>): string {
  const trimmed = val.trim()
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1)
  }
  const cellMatch = trimmed.match(cellRegex)
  if (cellMatch) {
    return getCellValue(cellMatch[0], cells, new Set(visited))
  }
  return trimmed
}

// ─── CSV Parser ─────────────────────────────────────────────────────────────

export function parseCSV(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  return lines.map((line) => {
    const values: string[] = []
    let current = ""
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (inQuotes) {
        if (ch === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            current += '"'
            i++
          } else {
            inQuotes = false
          }
        } else {
          current += ch
        }
      } else {
        if (ch === '"') {
          inQuotes = true
        } else if (ch === ",") {
          values.push(current.trim())
          current = ""
        } else {
          current += ch
        }
      }
    }
    values.push(current.trim())
    return values
  })
}

export function csvToCells(headers: string[], dataRows: string[][]): CellMap {
  const cells: CellMap = {}
  // Headers in row 1
  headers.forEach((h, i) => {
    cells[`${indexToCol(i)}1`] = { value: h }
  })
  // Data starting row 2
  dataRows.forEach((row, ri) => {
    row.forEach((val, ci) => {
      const col = indexToCol(ci)
      const ref = `${col}${ri + 2}`
      const num = parseFloat(val)
      cells[ref] = { value: isNaN(num) || val.trim() === "" ? val : String(num) }
    })
  })
  return cells
}

// ─── Preloaded Datasets ─────────────────────────────────────────────────────

export const preloadedDatasets: Record<string, { headers: string[]; rows: string[][] }> = {
  "Sales Report": {
    headers: ["Product", "Q1", "Q2", "Q3", "Q4", "Total"],
    rows: [
      ["Widget Alpha", "12000", "15000", "18000", "22000"],
      ["Gadget Beta", "8500", "9200", "10500", "13000"],
      ["Component X", "5000", "5500", "6200", "7800"],
      ["Accessory Pack", "3200", "4100", "4800", "5600"],
      ["Premium Kit", "1800", "2200", "2800", "3500"],
    ],
  },
  "Marketing Data": {
    headers: ["Channel", "Spend", "Impressions", "Clicks", "Conversions", "Revenue"],
    rows: [
      ["Google Ads", "5000", "120000", "4800", "240", "36000"],
      ["Facebook", "3500", "85000", "3200", "180", "22500"],
      ["Email", "1200", "45000", "2800", "320", "28000"],
      ["LinkedIn", "2000", "32000", "950", "85", "12750"],
      ["Twitter", "800", "28000", "1400", "45", "5400"],
    ],
  },
  "Customer Data": {
    headers: ["Name", "Age", "City", "Segment", "Spend", "Satisfaction"],
    rows: [
      ["Alice Johnson", "32", "New York", "Premium", "4500", "4.8"],
      ["Bob Smith", "28", "Los Angeles", "Standard", "2200", "4.2"],
      ["Charlie Brown", "45", "Chicago", "Premium", "6100", "4.9"],
      ["Diana Prince", "35", "Houston", "Standard", "1800", "3.5"],
      ["Eve Davis", "24", "Phoenix", "Basic", "900", "4.0"],
      ["Frank Wilson", "38", "New York", "Premium", "5200", "4.7"],
    ],
  },
  "Expense Tracker": {
    headers: ["Category", "Budget", "Actual", "Variance", "Status"],
    rows: [
      ["Salaries", "50000", "48500"],
      ["Marketing", "15000", "16200"],
      ["Operations", "8000", "7500"],
      ["R&D", "12000", "11800"],
      ["Travel", "3000", "4200"],
      ["Software", "4500", "4300"],
    ],
  },
}

// ─── Special Formula Importer ───────────────────────────────────────────────

export function datasetToCells(dataset: { headers: string[]; rows: string[][] }): CellMap {
  const cells: CellMap = {}
  const { headers, rows } = dataset

  headers.forEach((h, i) => {
    cells[`${indexToCol(i)}1`] = { value: h }
  })

  rows.forEach((row, ri) => {
    row.forEach((val, ci) => {
      const col = indexToCol(ci)
      const ref = `${col}${ri + 2}`
      const num = parseFloat(val)
      cells[ref] = { value: isNaN(num) ? val : String(num) }
    })
    // Auto-add SUM formula in last column
    if (row.length <= headers.length - 1) {
      const lastCol = indexToCol(headers.length - 1)
      const ref = `${lastCol}${ri + 2}`
      const startCol = indexToCol(1)
      const endCol = indexToCol(Math.min(headers.length - 2, row.length - 1))
      // Only add SUM if there are numeric columns to sum
      const numericCols = headers.slice(1, -1).filter((_, i) => !isNaN(parseFloat(rows[0][i] ?? "")))
      if (numericCols.length > 0) {
        const firstDataCol = indexToCol(1)
        const lastDataCol = indexToCol(numericCols.length)
        cells[ref] = { value: "", formula: `SUM(${firstDataCol}${ri + 2}:${lastDataCol}${ri + 2})` }
      }
    }
  })

  // Add SUM row at the bottom for numeric columns
  if (rows.length > 0) {
    const totalRow = rows.length + 2
    headers.forEach((_, i) => {
      const col = indexToCol(i)
      const ref = `${col}${totalRow}`
      const firstRow = 2
      const lastRow = rows.length + 1
      if (i > 0 && !isNaN(parseFloat(rows[0][Math.min(i - 1, rows[0].length - 1)] ?? ""))) {
        cells[ref] = { value: "", formula: `SUM(${col}${firstRow}:${col}${lastRow})` }
      }
    })
  }

  return cells
}

export const COLUMNS = 10
export const ROWS = 30

export function getDefaultCells(): CellMap {
  return {}
}
