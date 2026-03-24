import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — required for Server Components to read auth state
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Routes accessible without authentication
  const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/reset-password']
  const isPublicRoute = publicRoutes.some((route) => pathname === route)

  // Routes only for unauthenticated users (redirect away if logged in)
  const authOnlyRoutes = ['/login', '/signup', '/forgot-password']
  const isAuthOnlyRoute = authOnlyRoutes.some((route) => pathname === route)

  // Unauthenticated user trying to access protected route
  if (!user && !isPublicRoute) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Authenticated user trying to access auth pages
  if (user && isAuthOnlyRoute) {
    return NextResponse.redirect(new URL('/feed', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}