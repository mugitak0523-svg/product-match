import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { safeNextPath } from "@/lib/auth/validation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNextPath(url.searchParams.get("next"));
  const response = NextResponse.redirect(new URL(next, url.origin));
  if (code) {
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, publishableKey!, {
      cookies: {
        getAll: () => request.headers.get("cookie")?.split(";").map((item) => {
          const [name, ...value] = item.trim().split("=");
          return { name, value: value.join("=") };
        }) ?? [],
        setAll: (cookiesToSet) => cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
      },
    });
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("ログインに失敗しました。もう一度お試しください。")}`, url.origin));
  }
  return response;
}
