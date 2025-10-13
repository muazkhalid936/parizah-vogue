import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get token from cookies
  const token = request.cookies.get('token')?.value

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    if (!token) {
      // Redirect to auth page if no token
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    try {
      const payload = verifyToken(token)
      
      // Check if user is admin
      if (payload.role !== 'admin') {
        // Redirect non-admin users to home page
        return NextResponse.redirect(new URL('/', request.url))
      }
      
      // Allow admin access
      return NextResponse.next()
    } catch (error) {
      // Invalid token, redirect to auth
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  // Allow all other routes (including /auth) to proceed normally
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}