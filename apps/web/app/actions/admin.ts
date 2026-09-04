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
  if (!["approved", "rejected", "archived"].includes(status)) return;
  const admin = createAdminClient();
  const { data: before } = await admin.from("products").select("status").eq("id", productId).single();
  await admin.from("products").update({ status }).eq("id", productId);
  await admin.from("audit_logs").insert({ admin_id: adminUser.id, action: `product.${status}`, entity_type: "product", entity_id: productId, before_data: before, after_data: { status } });
  revalidatePath("/admin");
}

export async function generateArena() {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.rpc("create_arena_from_queue");
  revalidatePath("/admin");
  revalidatePath("/arenas");
}
