import { getUserById } from '@/lib/db/user-db'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  // const emailParam = request.nextUrl.searchParams.get('email')

  const publicRoutes = ['/login', '/register', '/', '/otp']

  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route))

  const currentUser = user?.id ? await getUserById(user.id) : null

  let isCompleteSetup = false

  if (currentUser) {
    isCompleteSetup = !!(
      currentUser.firstName.trim() &&
      currentUser.lastName.trim() &&
      currentUser.department?.trim() &&
      currentUser.role
    )
  }

  const url = request.nextUrl.clone()

  if (currentUser && isCompleteSetup && (pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === '/setup')) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }
  else if (currentUser && !isCompleteSetup && pathname !== '/setup') {
    url.pathname = '/setup'
    return NextResponse.redirect(url)
  }
  else if (!currentUser && !isPublicRoute) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}