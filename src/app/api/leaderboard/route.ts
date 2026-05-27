import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, xp, level, streak")
    .order("xp", { ascending: false })
    .limit(100)

  const currentUserRank =
    profiles?.findIndex((p) => p.id === user.id) ?? -1

  return NextResponse.json({
    leaderboard: profiles ?? [],
    currentUserRank: currentUserRank + 1,
    currentUserId: user.id,
  })
}
