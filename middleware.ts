import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    
    // If there's no token, redirect to sign in
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
    
    // For admin dashboard routes, ensure user is an admin
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      if (token.role !== 'ADMIN') {
        // Redirect regular users to homepage instead of user dashboard
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/reports/:path*',
  ]
};