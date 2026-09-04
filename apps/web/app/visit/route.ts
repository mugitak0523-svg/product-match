import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const input = new URL(request.url);
  const target = input.searchParams.get("url");
  if (!target || !/^https?:\/\//.test(target)) return NextResponse.redirect(new URL("/discover", input.origin));
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from("outbound_clicks").insert({ product_id: input.searchParams.get("product"), match_id: input.searchParams.get("match"), user_id:user?.id??null, source:"match" });
  return NextResponse.redirect(target);
}
