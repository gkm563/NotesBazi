import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // PROTECTED ROUTES LOGIC
    if (
      !user &&
      (request.nextUrl.pathname.startsWith("/upload") ||
        request.nextUrl.pathname.startsWith("/dashboard"))
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Redirect logged-in users away from auth pages
    if (
      user &&
      (request.nextUrl.pathname.startsWith("/login") ||
        request.nextUrl.pathname.startsWith("/signup"))
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // ADMIN ROUTES PROTECTION
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }

      // We check for hardcoded admin email here for immediate access
      // Role check happens in the Layout for database verification
      const isHardcodedAdmin = user.email === "admin@notesbazi.com";
      
      // If not the specific admin email, we let it pass to the layout 
      // where the actual DB role check happens.
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Default to Next.js default behavior.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
