"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, safeNextPath, signupSchema } from "@/lib/auth/validation";
import { authErrorNotice, type NotificationCode } from "@/lib/notifications";

function authRedirect(path: "/login" | "/signup", notice: NotificationCode, next?: string) {
  const query = new URLSearchParams({ notice });
  if (next && next !== "/discover") query.set("next", next);
  redirect(`${path}?${query.toString()}`);
}

export async function signInWithOAuth(provider: "google" | "github", formData: FormData) {
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const next = safeNextPath(formData.get("next"));
  const callback = new URL("/auth/callback", siteUrl);
  callback.searchParams.set("next", next);
  const { data, error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: callback.toString() } });
  if (error) authRedirect("/login", authErrorNotice(error), next);
  if (data.url) redirect(data.url);
  authRedirect("/login", "oauth-start-failed", next);
}

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient();
  const next = safeNextPath(formData.get("next"));
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) authRedirect("/login", "invalid-input", next);
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) authRedirect("/login", authErrorNotice(error), next);
  redirect(next);
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const next = safeNextPath(formData.get("next"));
  const parsed = signupSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) authRedirect("/signup", "invalid-input", next);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { emailRedirectTo: `${siteUrl}/auth/callback` },
  });
  if (error) authRedirect("/signup", authErrorNotice(error), next);
  const query = new URLSearchParams({ notice: "account-created" });
  if (next !== "/discover") query.set("next", next);
  redirect(`/login?${query.toString()}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
