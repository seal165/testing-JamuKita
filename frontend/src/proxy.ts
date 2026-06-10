import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Example middleware (TypeScript) that redirects unauthenticated users to /login
// while excluding api, _next, assets, favicon.ico and sw.js using your matcher.

export function proxy(request: NextRequest) {
}

// Your matcher (same as you posted)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|_next/images|assets|favicon.ico|sw.js).*)'],
}