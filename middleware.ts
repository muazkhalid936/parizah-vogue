import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/login?redirect=/admin', request.url));
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/login?redirect=/admin', request.url));
    }
  }

  // Protected user routes (profile, orders, etc.)
  if (pathname.startsWith('/profile') || pathname.startsWith('/orders') || pathname.startsWith('/checkout')) {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/login?redirect=' + pathname, request.url));
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL('/login?redirect=' + pathname, request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname === '/login' || pathname === '/register') {
    const token = request.cookies.get('token')?.value;
    
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/orders/:path*',
    '/checkout/:path*',
    '/login',
    '/register'
  ]
};