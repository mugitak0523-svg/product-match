"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authErrorMessage, loginSchema, safeNextPath, signupSchema } from "@/lib/auth/validation";

function authRedirect(path: "/login" | "/signup", key: "error" | "message", value: string, next?: string) {
  const query = new URLSearchParams({ [key]: value });
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
  if (error) authRedirect("/login", "error", authErrorMessage(error), next);
  if (data.url) redirect(data.url);
  authRedirect("/login", "error", "ログインを開始できませんでした。", next);
}

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient();
  const next = safeNextPath(formData.get("next"));
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) authRedirect("/login", "error", parsed.error.issues[0]?.message ?? "入力内容を確認してください。", next);
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) authRedirect("/login", "error", authErrorMessage(error), next);
  redirect(next);
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const next = safeNextPath(formData.get("next"));
  const parsed = signupSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) authRedirect("/signup", "error", parsed.error.issues[0]?.message ?? "入力内容を確認してください。", next);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { emailRedirectTo: `${siteUrl}/auth/callback` },
  });
  if (error) authRedirect("/signup", "error", authErrorMessage(error), next);
  const query = new URLSearchParams({ message: "Check your email to confirm your account" });
  if (next !== "/discover") query.set("next", next);
  redirect(`/login?${query.toString()}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
