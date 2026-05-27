import { NextRequest, NextResponse } from "next/server"
import { execSync } from "child_process"
import { writeFileSync, unlinkSync, mkdtempSync, rmSync } from "fs"
import { join } from "path"

export async function POST(request: NextRequest) {
  const { statements } = (await request.json()) as { statements: string[] }

  if (!Array.isArray(statements) || statements.length === 0) {
    return NextResponse.json({ error: "No SQL statements provided" }, { status: 400 })
  }

  const tmpDir = mkdtempSync("sql-")
  const scriptPath = join(tmpDir, "script.py")
  const dataPath = join(tmpDir, "data.json")

  // Write statements as a JSON data file
  writeFileSync(dataPath, JSON.stringify(statements), "utf-8")

  const pythonScript = `
import sqlite3, json, sys

db = sqlite3.connect(":memory:")
db.row_factory = sqlite3.Row
cur = db.cursor()

with open(sys.argv[1], "r") as f:
  statements = json.load(f)

sample_data = """
CREATE TABLE IF NOT EXISTS sales (
  id INTEGER, product_id INTEGER, customer_id INTEGER,
  amount REAL, quantity INTEGER, sale_date TEXT,
  region TEXT, status TEXT
);
INSERT INTO sales VALUES
  (1,101,201,250.0,2,'2024-01-15','North','completed'),
  (2,102,202,180.5,1,'2024-01-16','South','completed'),
  (3,103,203,320.0,4,'2024-01-17','East','completed'),
  (4,101,204,125.0,1,'2024-01-18','West','pending'),
  (5,104,201,500.0,5,'2024-01-19','North','completed'),
  (6,102,205,90.25,1,'2024-01-20','South','completed'),
  (7,105,202,750.0,3,'2024-02-01','East','completed'),
  (8,103,203,160.0,2,'2024-02-02','West','failed'),
  (9,101,206,375.0,3,'2024-02-03','North','completed'),
  (10,106,204,210.0,2,'2024-02-04','South','completed'),
  (11,104,201,100.0,1,'2024-02-05','East','pending'),
  (12,102,205,540.0,3,'2024-02-10','North','completed'),
  (13,107,202,890.0,2,'2024-02-15','West','completed'),
  (14,105,206,420.0,4,'2024-02-20','South','completed'),
  (15,103,203,640.0,8,'2024-03-01','East','completed');

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER, name TEXT, email TEXT, age INTEGER,
  city TEXT, signup_date TEXT, segment TEXT, is_active INTEGER
);
INSERT INTO customers VALUES
  (201,'Alice Johnson','alice@email.com',32,'New York','2023-06-15','Premium',1),
  (202,'Bob Smith','bob@email.com',28,'Los Angeles','2023-07-20','Standard',1),
  (203,'Charlie Brown','charlie@email.com',45,'Chicago','2023-05-10','Premium',1),
  (204,'Diana Prince','diana@email.com',35,'Houston','2023-08-05','Standard',0),
  (205,'Eve Davis','eve@email.com',24,'Phoenix','2023-09-12','Basic',1),
  (206,'Frank Wilson','frank@email.com',38,'New York','2023-04-22','Premium',1);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER, name TEXT, category TEXT,
  price REAL, stock INTEGER, supplier TEXT
);
INSERT INTO products VALUES
  (101,'Widget Alpha','Electronics',125.0,500,'TechSupply Co'),
  (102,'Gadget Beta','Electronics',90.0,300,'GizmoWorks'),
  (103,'Component X','Hardware',80.0,1000,'BuildPart Inc'),
  (104,'Widget Pro','Electronics',100.0,200,'TechSupply Co'),
  (105,'Accessory Pack','Accessories',250.0,150,'AddOn Ltd'),
  (106,'Basic Connector','Hardware',105.0,750,'BuildPart Inc'),
  (107,'Premium Kit','Accessories',445.0,80,'AddOn Ltd');

CREATE TABLE IF NOT EXISTS transactions (
  txn_id INTEGER, sale_id INTEGER, payment_method TEXT,
  amount REAL, fee REAL, success INTEGER, txn_date TEXT
);
INSERT INTO transactions VALUES
  (1001,1,'Credit Card',250.0,7.5,1,'2024-01-15'),
  (1002,2,'Debit Card',180.5,2.7,1,'2024-01-16'),
  (1003,3,'PayPal',320.0,9.6,1,'2024-01-17'),
  (1004,4,'Credit Card',125.0,3.75,0,'2024-01-18'),
  (1005,5,'Bank Transfer',500.0,5.0,1,'2024-01-19'),
  (1006,6,'Debit Card',90.25,1.35,1,'2024-01-20'),
  (1007,7,'PayPal',750.0,22.5,1,'2024-02-01'),
  (1008,8,'Credit Card',160.0,4.8,0,'2024-02-02'),
  (1009,9,'Bank Transfer',375.0,3.75,1,'2024-02-03'),
  (1010,10,'Debit Card',210.0,3.15,1,'2024-02-04');
"""

cur.executescript(sample_data)

result = None
last_error = None

for stmt in statements:
  stmt = stmt.strip()
  if not stmt:
    continue
  try:
    stmt_upper = stmt.upper()
    is_query = stmt_upper.startswith("SELECT") or stmt_upper.startswith("PRAGMA") or stmt_upper.startswith("EXPLAIN")
    if is_query:
      cur.execute(stmt)
      cols = [d[0] for d in cur.description]
      rows = [list(r) for r in cur.fetchall()]
      result = {"type": "query", "columns": cols, "rows": rows, "rowCount": len(rows)}
    else:
      cur.execute(stmt)
      result = {"type": "exec", "changes": db.total_changes}
    last_error = None
  except Exception as e:
    last_error = str(e)
    break

if last_error:
  print(json.dumps({"error": last_error}))
elif result and result["type"] == "query":
  print(json.dumps(result))
elif result:
  print(json.dumps({"type": "exec", "changes": result["changes"]}))
else:
  print(json.dumps({"type": "exec", "changes": 0}))
`

  try {
    writeFileSync(scriptPath, pythonScript, "utf-8")

    const stdout = execSync(`python "${scriptPath}" "${dataPath}"`, {
      timeout: 15_000,
      maxBuffer: 1024 * 1024,
      encoding: "utf-8",
      windowsHide: true,
    })

    const parsed = JSON.parse(stdout.trim())
    return NextResponse.json(parsed)
  } catch (err: unknown) {
    const error = err as { stdout?: string; stderr?: string; message?: string }
    try {
      if (error.stdout) {
        const parsed = JSON.parse(error.stdout.trim())
        return NextResponse.json(parsed)
      }
    } catch {
      // ignore
    }
    return NextResponse.json({ error: error.stderr ?? error.message ?? "Unknown error" })
  } finally {
    try {
      unlinkSync(scriptPath)
      unlinkSync(dataPath)
      rmSync(tmpDir, { recursive: true, force: true })
    } catch {
      // ignore
    }
  }
}
