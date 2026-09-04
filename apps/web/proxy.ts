import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const protectedPaths = ["/dashboard", "/submit"];
const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const isNonLocalizedRoute = ["/auth", "/visit"].some((path) => request.nextUrl.pathname.startsWith(path));
  let response = isNonLocalizedRoute ? NextResponse.next({ request }) : intlMiddleware(request);
  if (response.headers.get("location")) return response;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, publishableKey!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname.replace(/^\/(en|ja)(?=\/|$)/, "") || "/";
  if (!user && protectedPaths.some((path) => pathname.startsWith(path))) {
    const loginUrl = request.nextUrl.clone();
    const locale = request.nextUrl.pathname.split("/")[1] || routing.defaultLocale;
    loginUrl.pathname = `/${locale}/login`;
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
