"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/login");
  const { data } = await client.from("profiles").select("role").eq("id", user.id).single();
  if (data?.role !== "admin") redirect("/discover");
  return user;
}

export async function moderateProduct(formData: FormData) {
  const adminUser = await requireAdmin();
  const productId = String(formData.get("productId"));
  const status = String(formData.get("status"));
  if (!["approved", "rejected", "archived"].includes(status)) redirect("/admin?notice=admin-action-failed");
  const admin = createAdminClient();
  const { data: before } = await admin.from("products").select("status").eq("id", productId).single();
  const { error: updateError } = await admin.from("products").update({ status }).eq("id", productId);
  if (updateError) redirect("/admin?notice=admin-action-failed");
  const { error: auditError } = await admin.from("audit_logs").insert({ admin_id: adminUser.id, action: `product.${status}`, entity_type: "product", entity_id: productId, before_data: before, after_data: { status } });
  if (auditError) redirect("/admin?notice=admin-action-failed");
  revalidatePath("/admin");
}

export async function generateArena() {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.rpc("create_arena_from_queue");
  if (error) redirect("/admin?notice=admin-action-failed");
  revalidatePath("/admin");
  revalidatePath("/arenas");
}
