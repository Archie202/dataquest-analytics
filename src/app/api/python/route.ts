import { NextRequest, NextResponse } from "next/server"
import { execSync } from "child_process"
import { writeFileSync, unlinkSync, mkdtempSync, rmSync } from "fs"
import { join } from "path"

export async function POST(request: NextRequest) {
  const { code } = (await request.json()) as { code: string }

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "No code provided" }, { status: 400 })
  }

  const tmpDir = mkdtempSync("py-")
  const filePath = join(tmpDir, "script.py")

  try {
    writeFileSync(filePath, code, "utf-8")

    const stdout = execSync(`python "${filePath}"`, {
      timeout: 10_000,
      maxBuffer: 1024 * 1024,
      encoding: "utf-8",
      windowsHide: true,
    })

    return NextResponse.json({ stdout, stderr: "" })
  } catch (err: unknown) {
    const error = err as {
      stdout?: string
      stderr?: string
      message?: string
    }

    return NextResponse.json({
      stdout: error.stdout ?? "",
      stderr: error.stderr ?? error.message ?? "Unknown error",
    })
  } finally {
    try {
      unlinkSync(filePath)
      rmSync(tmpDir, { recursive: true, force: true })
    } catch {
      // ignore cleanup errors
    }
  }
}
