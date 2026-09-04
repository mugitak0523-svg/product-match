"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function castVote(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const matchId = String(formData.get("matchId") ?? "");
  const productId = String(formData.get("productId") ?? "");
  if (!user) redirect(`/login?next=/matches/${matchId}`);
  const { error } = await supabase.rpc("cast_vote", { target_match_id: matchId, target_product_id: productId });
  if (error) redirect(`/matches/${matchId}?error=${encodeURIComponent(error.message)}`);
  const store = await cookies();
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 60 * 60 * 12 * 1000);
  await supabase.from("access_grants").insert({ user_id: user.id, session_id: sessionId, gate_vote_count: 1, expires_at: expiresAt.toISOString() });
  store.set("pm_gate", sessionId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 12, path: "/" });
  revalidatePath(`/matches/${matchId}`);
  redirect(`/matches/${matchId}?voted=1`);
}

export async function recordVisit(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from("outbound_clicks").insert({
    product_id: String(formData.get("productId")), match_id: formData.get("matchId") || null,
    user_id: user?.id ?? null, source: String(formData.get("source") ?? "match"),
  });
}
