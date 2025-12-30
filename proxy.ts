import { type NextRequest, NextResponse } from "next/server"
import { getSessionCookie, verifySession } from "@/lib/sessions"

const publicRoutes = ["/auth/login", "/auth/register", "/"]
const adminRoutes = ["/admin"]
const buyerRoutes = ["/buyer", "/checkout"]

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const sessionToken = await getSessionCookie()

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Verify session for protected routes
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  const session = await verifySession(sessionToken)
  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Check admin access
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (session.role !== "admin") {
      return NextResponse.redirect(new URL("/buyer", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}
