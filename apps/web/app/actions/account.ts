"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function deleteAccount(formData: FormData) {
  if (formData.get("confirmation") !== "DELETE") {
    redirect("/dashboard/account?notice=invalid-input");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error: retireError } = await supabase.rpc("retire_own_account");
  if (retireError) redirect("/dashboard/account?notice=account-deletion-failed");

  const admin = createAdminClient();
  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id, { shouldSoftDelete: true });
  if (deleteError) redirect("/login?notice=account-deletion-failed");

  await supabase.auth.signOut();
  redirect("/login?notice=account-deleted");
}
