import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
    if (request.nextUrl.pathname.startsWith('/api/v1/mechanic/login') || request.nextUrl.pathname.startsWith('/api/v1/mechanic/locations') || request.nextUrl.pathname.startsWith('/api/v1/mechanic/register')) {
        return NextResponse.next();
        // response.headers.set('X-Custom-Header', 'my custom header value');
    }
        
  return NextResponse.json({ message: 'Hello from middleware!' })
}
 
// See "Matching Paths" below to learn more
export const config = {
  // matcher: ['/api/:path*', /api/v1/mechanic/locations, /api/v1/mechanic/login]
  matcher: ['/api/:path*', ]
}