import { NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt';

export async function middleware(request) {

  const { pathname } = request.nextUrl;

  // ===== PUBLIC ROUTES (LOGIN & REGISTER) =====
  // if (
  //   pathname.startsWith('/api/v1/users/login') ||
  //   pathname.startsWith('/api/v1/mechanic/login') ||
  //   pathname.startsWith('/api/v1/mechanic/register') || 
  //   pathname.startsWith('/api/v1/states') ||
  //   pathname.startsWith('/api/v1/cities')
  // ) {
  //   return NextResponse.next();
  // }
  if (
    pathname.startsWith('/api/v1/users/login') ||
    pathname.startsWith('/api/v1/mechanic/login') ||
    pathname.startsWith('/api/v1/mechanic/register') ||

    // ✅ Allow States & Cities
    pathname.startsWith('/api/v1/states') ||
    pathname.startsWith('/api/v1/cities') ||

    // ✅ Allow Mechanic Auth (Public)
    pathname.startsWith('/api/v1/mechanic/locations') ||
    pathname.startsWith('/api/v1/mechanic/verify-otp') ||
    pathname.startsWith('/api/v1/mechanic/resend-otp') ||
    pathname.startsWith('/api/v1/mechanic/forgot-password') ||
    pathname.startsWith('/api/v1/mechanic/reset-password') ||
    pathname.startsWith('/api/v1/mechanic/verify-reset-otp') ||
    pathname.startsWith('/api/v1/mechanic/seed-locations')
  ) {
    return NextResponse.next();
  }


  // ===== ONLY PROTECT API =====
  if (!pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // ===== GET TOKEN =====
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  // ===== NO TOKEN =====
  if (!token) {
    return NextResponse.json(
      { message: 'Unauthorized: No Token' },
      { status: 401 }
    );
  }

  // ===== VERIFY TOKEN =====
  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { message: 'Unauthorized: Invalid Token' },
      { status: 401 }
    );
  }

  // ===== PASS USER INFO =====
  const headers = new Headers(request.headers);

  headers.set('x-user-id', payload.id);
  headers.set('x-user-role', payload.role);

  return NextResponse.next({
    request: { headers }
  });
}

// ===== MATCHER =====
export const config = {
  matcher: [
    '/api/:path*',
  ],
};
