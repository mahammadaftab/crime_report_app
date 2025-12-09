import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

// Custom middleware function
async function customMiddleware(request: NextRequest) {
  // Allow access to the create, count and details endpoints for anonymous reporting
  if (request.nextUrl.pathname === '/api/reports/create' || 
      request.nextUrl.pathname === '/api/reports/count' ||
      request.nextUrl.pathname.endsWith('/details')) {
    return NextResponse.next();
  }
  
  const token = await getToken({ req: request });
  
  // If there's no token, redirect to sign in
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
  
  // For admin dashboard routes, ensure user is an admin
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (token.role !== 'ADMIN') {
      // Redirect regular users to homepage instead of user dashboard
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export default customMiddleware;

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/reports/:path*',
  ]
};