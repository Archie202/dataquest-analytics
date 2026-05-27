import type { DatasetTable, QueryResult } from "@/types/practice"
import { allDatasets } from "@/data/seed-datasets"

function tokenize(sql: string): string[] {
  return sql
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .split(/\b/)
}

function extractTableName(fromClause: string): string | null {
  const m = fromClause.match(/from\s+(\w+)/i)
  return m ? m[1].toLowerCase() : null
}

function extractColumns(selectClause: string): string[] {
  const m = selectClause.match(/select\s+([\s\S]+?)(?:\s+from|$)/i)
  if (!m) return []
  const cols = m[1].trim()
  if (cols === "*") return []
  return cols.split(",").map((c) => c.trim().split(/\s+as\s+/i)[0].trim())
}

function extractConditions(whereClause: string): Record<string, string> {
  const conds: Record<string, string> = {}
  if (!whereClause) return conds
  const parts = whereClause.split(/\s+and\s+/i)
  for (const part of parts) {
    const m = part.match(/(\w+)\s*(=|>|<|>=|<=|!=|like)\s*(.+)/i)
    if (m) conds[m[1].toLowerCase()] = { op: m[2].toLowerCase(), val: m[3].trim().replace(/['"]/g, "") } as any
  }
  return conds
}

function extractGroupBy(sql: string): string | null {
  const m = sql.match(/group\s+by\s+(\w+)/i)
  return m ? m[1].toLowerCase() : null
}

function extractOrderBy(sql: string): { col: string; dir: "asc" | "desc" } | null {
  const m = sql.match(/order\s+by\s+(\w+)\s*(asc|desc)?/i)
  if (!m) return null
  return { col: m[1].toLowerCase(), dir: (m[2]?.toLowerCase() as "asc" | "desc") ?? "asc" }
}

function extractLimit(sql: string): number | null {
  const m = sql.match(/limit\s+(\d+)/i)
  return m ? parseInt(m[1]) : null
}

function extractJoinTable(sql: string): string | null {
  const m = sql.match(/join\s+(\w+)/i)
  return m ? m[1].toLowerCase() : null
}

function extractJoinCondition(sql: string): [string, string] | null {
  const m = sql.match(/on\s+(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/i)
  if (!m) return null
  return [`${m[1]}.${m[2]}`, `${m[3]}.${m[4]}`]
}

function evaluateCondition(
  rowVal: string | number | boolean | null,
  op: string,
  targetVal: string
): boolean {
  if (rowVal === null) return false
  const rv = String(rowVal).toLowerCase()
  const tv = targetVal.toLowerCase()

  switch (op) {
    case "=": return rv === tv
    case "!=": return rv !== tv
    case ">": return Number(rowVal) > Number(tv)
    case "<": return Number(rowVal) < Number(tv)
    case ">=": return Number(rowVal) >= Number(tv)
    case "<=": return Number(rowVal) <= Number(tv)
    case "like": return rv.includes(tv.replace(/%/g, ""))
    default: return true
  }
}

function extractAggregates(selectClause: string): { fn: string; col: string; alias?: string }[] {
  const aggs: { fn: string; col: string; alias?: string }[] = []
  const regex = /(sum|count|avg|min|max)\s*\(\s*(\*|\w+)\s*\)(?:\s+as\s+(\w+))?/gi
  let match
  while ((match = regex.exec(selectClause)) !== null) {
    aggs.push({
      fn: match[1].toLowerCase(),
      col: match[2].toLowerCase(),
      alias: match[3]?.toLowerCase(),
    })
  }
  return aggs
}

function hasAggregates(selectClause: string): boolean {
  return /(sum|count|avg|min|max)\s*\(/i.test(selectClause)
}

export function executeSQL(sql: string): QueryResult {
  const start = performance.now()

  try {
    const cleaned = sql.replace(/\s+/g, " ").trim()
    if (!cleaned) return { columns: [], rows: [], rowCount: 0, executionTime: 0, error: "No query provided" }

    const hasSelect = /select/i.test(cleaned)
    if (!hasSelect) return { columns: [], rows: [], rowCount: 0, executionTime: 0, error: "Only SELECT queries are supported" }

    const tableName = extractTableName(cleaned)
    if (!tableName || !allDatasets[tableName]) {
      return { columns: [], rows: [], rowCount: 0, executionTime: 0, error: `Table '${tableName}' not found. Available tables: ${Object.keys(allDatasets).join(", ")}` }
    }

    const table = allDatasets[tableName]
    let data = [...table.rows]

    const allColumns = table.columns.map((c) => c.name)

    // JOIN
    const joinTableName = extractJoinTable(cleaned)
    if (joinTableName && allDatasets[joinTableName]) {
      const joinTable = allDatasets[joinTableName]
      const joinCond = extractJoinCondition(cleaned)
      if (joinCond) {
        const [leftRef, rightRef] = joinCond
        const leftCol = leftRef.split(".")[1]
        const rightCol = rightRef.split(".")[1]
        const joined: Record<string, string | number | boolean | null>[] = []
        for (const leftRow of data) {
          for (const rightRow of joinTable.rows) {
            if (String(leftRow[leftCol]) === String(rightRow[rightCol])) {
              joined.push({ ...leftRow, ...rightRow })
            }
          }
        }
        data = joined
      }
    }

    // WHERE
    const whereMatch = cleaned.match(/where\s+(.+?)(?:\s+group\s+by|\s+order\s+by|\s+limit|$)/i)
    if (whereMatch) {
      const whereClause = whereMatch[1]
      // Handle multiple conditions
      const conditions = whereClause.split(/\s+and\s+/i)
      for (const cond of conditions) {
        const cm = cond.match(/(\w+)\s*(=|>|<|>=|<=|!=|like)\s*(.+)/i)
        if (cm) {
          const col = cm[1].toLowerCase()
          const op = cm[2].toLowerCase()
          const val = cm[3].trim().replace(/['"]/g, "")
          data = data.filter((row) => evaluateCondition(row[col] ?? null, op, val))
        }
      }
    }

    // GROUP BY
    const groupByCol = extractGroupBy(cleaned)
    const aggs = extractAggregates(cleaned)
    if (groupByCol && aggs.length > 0) {
      const groups: Record<string, Record<string, string | number | boolean | null>[]> = {}
      for (const row of data) {
        const key = String(row[groupByCol] ?? "NULL")
        if (!groups[key]) groups[key] = []
        groups[key].push(row)
      }
      data = Object.entries(groups).map(([key, rows]) => {
        const result: Record<string, string | number | boolean | null> = { [groupByCol]: key }
        for (const agg of aggs) {
          const values = agg.col === "*" ? rows.map(() => 1) : rows.map((r) => Number(r[agg.col] ?? 0))
          let val: number
          switch (agg.fn) {
            case "sum": val = values.reduce((a, b) => a + b, 0); break
            case "count": val = rows.length; break
            case "avg": val = Math.round((values.reduce((a, b) => a + b, 0) / rows.length) * 100) / 100; break
            case "min": val = Math.min(...values); break
            case "max": val = Math.max(...values); break
            default: val = rows.length
          }
          result[agg.alias || `${agg.fn}_${agg.col}`] = val
        }
        return result
      })

      // SELECT columns for grouped results
      const selectCols = extractColumns(cleaned)
      const resultCols = selectCols.length > 0 ? selectCols : [groupByCol, ...aggs.map((a) => a.alias || `${a.fn}_${a.col}`)]

      const end = performance.now()
      return {
        columns: resultCols,
        rows: data as any,
        rowCount: data.length,
        executionTime: Math.round((end - start) * 100) / 100,
      }
    }

    // ORDER BY
    const orderBy = extractOrderBy(cleaned)
    if (orderBy) {
      data.sort((a, b) => {
        const av = a[orderBy.col]
        const bv = b[orderBy.col]
        if (av == null) return 1
        if (bv == null) return -1
        const cmp = typeof av === "number" ? av - Number(bv) : String(av).localeCompare(String(bv))
        return orderBy.dir === "desc" ? -cmp : cmp
      })
    }

    // LIMIT
    const limit = extractLimit(cleaned)
    if (limit && limit > 0) data = data.slice(0, limit)

    // SELECT columns
    const selectCols = extractColumns(cleaned)
    const colsToShow = selectCols.length > 0 ? selectCols : allColumns

    const result = data.map((row) => {
      const out: Record<string, string | number | boolean | null> = {}
      for (const col of colsToShow) {
        out[col] = row[col] ?? null
      }
      return out
    })

    const end = performance.now()
    return {
      columns: colsToShow,
      rows: result,
      rowCount: result.length,
      executionTime: Math.round((end - start) * 100) / 100,
    }
  } catch (e) {
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      executionTime: 0,
      error: `Error: ${(e as Error).message}`,
    }
  }
}

export function validateSQLQuery(
  userSql: string,
  expectedPatterns: string[]
): { isCorrect: boolean; feedback: string } {
  const lower = userSql.toLowerCase()
  const missing: string[] = []
  for (const pattern of expectedPatterns) {
    if (!lower.includes(pattern.toLowerCase())) {
      missing.push(pattern)
    }
  }
  if (missing.length === 0) {
    return { isCorrect: true, feedback: "Query matches expected pattern! Well done." }
  }
  return {
    isCorrect: false,
    feedback: `Your query is missing expected elements: ${missing.join(", ")}. Review your query and try again.`,
  }
}
