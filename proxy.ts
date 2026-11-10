import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isJwtValid(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  try {
    const parts = token.trim().split('.');
    if (parts.length !== 3) return false;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    const payload = JSON.parse(json);
    if (!payload || typeof payload !== 'object') return false;
    if (typeof payload.exp !== 'number') return false;
    return Date.now() < payload.exp * 1000;
  } catch {
    return false;
  }
}

/**
 * Next.js Proxy / Middleware to protect routes from unauthorized access without an auth token.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Retrieve auth token from cookies or Authorization header
  const rawToken =
    request.cookies.get('auth_token')?.value ||
    request.cookies.get('token')?.value ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  const isValidToken = rawToken ? isJwtValid(rawToken) : false;
  const authToken = isValidToken ? rawToken : null;

  const isAuthPage = pathname.startsWith('/login');
  const isApiRoute = pathname.startsWith('/api/');

  // If request is for an internal API endpoint or rewrite, pass it through directly
  if (isApiRoute) {
    const response = NextResponse.next();
    if (authToken) {
      response.headers.set('x-user-authenticated', 'true');
      response.headers.set('x-forwarded-user-token', authToken);
    }
    return response;
  }

  // If user visits the login page
  if (isAuthPage) {
    // If user arrived with expired or logout query, enforce staying on /login and wipe cookies
    if (
      request.nextUrl.searchParams.has('expired') ||
      request.nextUrl.searchParams.has('logout')
    ) {
      const response = NextResponse.next();
      response.cookies.delete('auth_token');
      response.cookies.delete('token');
      return response;
    }

    // If user has a valid, non-expired token, redirect to dashboard root
    if (authToken) {
      const from = request.nextUrl.searchParams.get('from') || '/';
      const target = from.startsWith('/login') ? '/' : from;
      return NextResponse.redirect(new URL(target, request.url));
    }

    // Token is expired, invalid, or missing: allow login page and purge stale cookies
    const response = NextResponse.next();
    if (rawToken) {
      response.cookies.delete('auth_token');
      response.cookies.delete('token');
    }
    return response;
  }

  // If user does not have a valid token (missing or expired) and is accessing a protected route, redirect to /login
  if (!authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('expired', '1');
    if (pathname !== '/') {
      loginUrl.searchParams.set('from', `${pathname}${search}`);
    }
    const response = NextResponse.redirect(loginUrl);
    // Explicitly delete cookies on redirect to prevent browser loops
    response.cookies.delete('auth_token');
    response.cookies.delete('token');
    return response;
  }

  // Pass request forward with authentication header for proxy / downstream handlers
  const response = NextResponse.next();
  if (authToken) {
    response.headers.set('x-user-authenticated', 'true');
    response.headers.set('x-forwarded-user-token', authToken);
  }

  return response;
}

export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public asset files (png, svg, jpg, webp, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
