import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();
  
  // Get auth token and user role from cookies
  const token = request.cookies.get('authToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;
  let selectedCollege = request.cookies.get('selectedCollege')?.value;
  
  // Check if college is selected in localStorage via URL parameter or header
  // Note: In Next.js middleware, we can't directly access localStorage, 
  // but we can check if user is trying to access login without college
  
  // Routes that don't require authentication
  const publicRoutes = ['/', '/auth/login', '/auth/register', '/coming-soon'];
  
  // Routes that require college selection
  const collegeProtectedRoutes = ['/auth/login', '/auth/register'];
  
  // Admin-only routes
  const adminRoutes = ['/admin'];
  
  // Student-only routes
  const studentRoutes = ['/dashboard'];
  
  // Check if accessing protected auth routes
  if (collegeProtectedRoutes.includes(pathname)) {
    // If accessing login/register without authentication, allow it
    // (college check will happen client-side in the page component)
    if (!token) {
      return response;
    }
  }
  
  // Check if accessing dashboard/admin without authentication
  if (studentRoutes.includes(pathname) || adminRoutes.includes(pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    // Enforce role-based access
    if (adminRoutes.includes(pathname) && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    if (studentRoutes.includes(pathname) && userRole !== 'student') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
