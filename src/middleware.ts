import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret =
  process.env.NEXTAUTH_SECRET || 'gigadrop-super-secret-jwt-key-2026-cairo-egypt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret });

  const isAdminRole =
    token?.role === 'ADMIN' ||
    token?.role === 'SUPER_ADMIN' ||
    token?.role === 'SUPPORT';

  // 1. Protect /admin routes: Only authenticated Admin / Support roles allowed
  if (pathname.startsWith('/admin')) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdminRole) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // 1b. Protect /api/admin routes: Reject with 403 JSON if not authenticated admin
  if (pathname.startsWith('/api/admin')) {
    if (!token || !isAdminRole) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin privileges required' },
        { status: 403 }
      );
    }
  }

  // 2. Protect /dashboard routes: Only authenticated Customer role allowed
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (isAdminRole) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  // 3. Protect /contact (Live Support Chat) and /track (Order Tracker): Requires login first
  if (pathname.startsWith('/contact') || pathname.startsWith('/track')) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (isAdminRole && pathname.startsWith('/contact')) {
      return NextResponse.redirect(new URL('/admin/tickets', req.url));
    }
    if (isAdminRole && pathname.startsWith('/track')) {
      return NextResponse.redirect(new URL('/admin/orders', req.url));
    }
  }

  // 4. Redirect already-authenticated users away from /login and /register
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      return NextResponse.redirect(
        new URL(isAdminRole ? '/admin' : '/dashboard', req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/dashboard/:path*',
    '/contact',
    '/track',
    '/login',
    '/register',
  ],
};
