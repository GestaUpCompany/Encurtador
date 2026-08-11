import { NextResponse, type NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Fast cookie check without network call to Supabase Auth.
  // The admin layout does the full getUser() validation.
  const hasSessionCookie = request.cookies
    .getAll()
    .some((c) => c.name.includes('-auth-token'))

  if (pathname.startsWith('/admin') && !hasSessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/login' && hasSessionCookie) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next({ request })
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
