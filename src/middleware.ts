import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname, searchParams } = request.nextUrl;
  const from = searchParams.get('from');
  const redirectPath = searchParams.get('redirect');
  
  // Debug log the request
  console.log(`[Middleware] Path: ${pathname}, Has Token: ${!!token}, From: ${from || 'none'}`);
  
  // Define public paths that don't require authentication
  const isPublicPath = pathname === '/login' || 
                     pathname === '/register' || 
                     pathname === '/forgot-password' ||
                     pathname.startsWith('/_next') ||
                     pathname.startsWith('/api') ||
                     pathname.includes('.');
  
  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_next') || 
      pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // If user is trying to access a protected route without a token
  if (!isPublicPath) {
    if (!token) {
      console.log(`[Middleware] No token found, redirecting to login from ${pathname}`);
      const loginUrl = new URL('/login', request.url);
      // Add the current path as a redirect parameter if it's not a public path
      if (pathname !== '/' && pathname !== '/login') {
        loginUrl.searchParams.set('redirect', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
    
    // If we have a token, verify it
    try {
      const decoded: any = jwtDecode(token);
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
  }
  
  // If user is logged in and tries to access login/register, redirect to dashboard
  if ((pathname === '/login' || pathname === '/register') && token) {
    // If coming from login after successful auth, allow it to proceed
    if (from === 'login') {
      if (redirectPath) {
        console.log(`[Middleware] Allowing redirect to ${redirectPath} after login`);
        return NextResponse.redirect(new URL(redirectPath, request.url));
      } else {
        // If no redirect path is specified, go to dashboard
        console.log('[Middleware] No redirect path specified, going to /dashboard');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    
    // If already logged in and trying to access login/register, redirect to dashboard
    console.log('[Middleware] Already authenticated, redirecting to /dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If user is on a public path with a valid token, redirect to dashboard
  if (isPublicPath && token && (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password')) {
    try {
      const decoded: any = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      
      if (!isExpired) {
        console.log('[Middleware] User is authenticated, redirecting to dashboard');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      console.error('[Middleware] Error verifying token on public path:', error);
      // If there's an error with the token, clear it and stay on the current page
      const response = NextResponse.next();
      response.cookies.delete('access_token');
      return response;
    }
  }
  
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
