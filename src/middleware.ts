import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase-middleware"

const protectedRoutes = ["/dashboard", "/profile", "/phases", "/modules", "/topics", "/practice", "/achievements", "/leaderboard", "/skills", "/projects", "/onboarding", "/notifications"]
const authRoutes = ["/login", "/signup"]

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const redirectUrl = new URL("/login", request.url)
      redirectUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
