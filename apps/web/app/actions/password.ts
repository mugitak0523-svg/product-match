"use server";

import { redirect } from "next/navigation";
import { resetPasswordRequestSchema, resetPasswordSchema } from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/server";

export async function requestPasswordReset(formData: FormData) {
  const parsed = resetPasswordRequestSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) redirect("/forgot-password?notice=invalid-input");

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  });

  // Always show the same result to avoid revealing whether an email is registered.
  redirect("/login?notice=password-reset-sent");
}

export async function resetPassword(formData: FormData) {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) redirect("/reset-password?notice=invalid-input");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/forgot-password?notice=password-reset-invalid");

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) redirect("/forgot-password?notice=password-reset-invalid");

  await supabase.auth.signOut();
  redirect("/login?notice=password-reset-complete");
}
