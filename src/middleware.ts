import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// List of public paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/icons',
  '/workbox-',
  '/sw.js',
  '/manifest.webmanifest'
];

// Check if a path is public
const isPublicPath = (pathname: string) => {
  return publicPaths.some(path => 
    pathname === path || 
    pathname.startsWith(`${path}/`) ||
    pathname.includes('.')
  );
};

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;
  const from = searchParams.get('from');
  const redirectPath = searchParams.get('redirect');
  
  // Debug log the request
  console.log(`[Middleware] Path: ${pathname}, Has Token: ${!!token}, From: ${from || 'none'}`);
  
  // Skip middleware for API routes, static files, and public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  
  // If user is trying to access a protected route without a token
  if (!token) {
    // Allow access to public paths
    if (isPublicPath(pathname)) {
      return NextResponse.next();
    }
    
    console.log(`[Middleware] No token found, redirecting to login from ${pathname}`);
    const loginUrl = new URL('/login', request.url);
    
    // Only set redirect if it's not a public path and not already going to login
    if (pathname !== '/' && pathname !== '/login') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    
    return NextResponse.redirect(loginUrl);
  }
    
  // If we have a token, verify it
  try {
    const decoded: any = jwtDecode(token as string);
    const isExpired = decoded.exp * 1000 < Date.now();
    
    if (isExpired) {
      console.log('[Middleware] Token expired, redirecting to login');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('expired', 'true');
      
      // Create a response that clears the expired token
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('access_token');
      return response;
    }
    
    // If user is on login/register page with a valid token, redirect to dashboard
    if (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password') {
      console.log(`[Middleware] User is authenticated, redirecting to ${redirectPath || '/dashboard'}`);
      const response = NextResponse.redirect(new URL(redirectPath || '/dashboard', request.url));
      response.headers.set('x-middleware-cache', 'no-cache');
      return response;
    }
    
    // Token is valid, allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    console.error('[Middleware] Error verifying token:', error);
    // If there's an error verifying the token, clear it and redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'invalid_token');
    
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('access_token');
    return response;
  }
  
  // This handles all other cases where the request should proceed
  return NextResponse.next();
}

// Configure which paths should be processed by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
