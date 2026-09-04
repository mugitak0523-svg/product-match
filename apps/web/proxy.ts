import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/submit"];

export async function proxy(request: NextRequest) {
  if (request.nextUrl.searchParams.has("error") || request.nextUrl.searchParams.has("message")) {
    const safeUrl = request.nextUrl.clone();
    safeUrl.searchParams.delete("error");
    safeUrl.searchParams.delete("message");
    safeUrl.searchParams.set("notice", "auth-failed");
    return NextResponse.redirect(safeUrl);
  }
  let response = NextResponse.next({ request });
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, publishableKey!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("deleted_at").eq("id", user.id).maybeSingle();
    if (profile?.deleted_at) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = "";
      loginUrl.searchParams.set("notice", "account-deleted");
      return NextResponse.redirect(loginUrl);
    }
  }
  if (!user && protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
