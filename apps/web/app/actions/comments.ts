"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createComment(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const productId = String(formData.get("productId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 2 || body.length > 2000) redirect(`/products/${slug}?notice=comment-invalid`);
  const { error } = await supabase.from("product_comments").insert({ product_id: productId, user_id: user.id, body });
  if (error) redirect(`/products/${slug}?notice=comment-failed`);
  revalidatePath(`/products/${slug}`);
}
