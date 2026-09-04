"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const productSchema = z.object({
  name: z.string().min(2).max(80),
  url: z.string().url(),
  tagline: z.string().min(3).max(80),
  description: z.string().min(20).max(2000),
  category: z.string().min(2).max(50),
  pricingType: z.string().max(30),
});

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function submitProduct(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const parsed = productSchema.safeParse({
    name: formData.get("name"), url: formData.get("url"), tagline: formData.get("tagline"),
    description: formData.get("description"), category: formData.get("category"), pricingType: formData.get("pricingType") ?? "unknown",
  });
  if (!parsed.success) redirect(`/submit?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);

  const logo = formData.get("logo") as File;
  const screenshot = formData.get("screenshot") as File;
  if (!logo?.size || !screenshot?.size) redirect("/submit?error=Logo and primary screenshot are required");

  const baseSlug = slugify(parsed.data.name);
  const uniqueSlug = `${baseSlug}-${crypto.randomUUID().slice(0, 6)}`;
  const upload = async (file: File, kind: string) => {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "webp";
    const path = `${user.id}/${uniqueSlug}/${kind}-${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("product-media").upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw error;
    return supabase.storage.from("product-media").getPublicUrl(path).data.publicUrl;
  };

  try {
    const [logoUrl, screenshotUrl] = await Promise.all([upload(logo, "logo"), upload(screenshot, "screenshot")]);
    const { pricingType, ...productFields } = parsed.data;
    const { data: product, error } = await supabase.from("products").insert({
      owner_id: user.id, slug: uniqueSlug, logo_url: logoUrl, status: "submitted", ...productFields,
      pricing_type: pricingType,
    }).select("id").single();
    if (error) throw error;
    await supabase.from("product_screenshots").insert({ product_id: product.id, image_url: screenshotUrl, sort_order: 0 });
  } catch (error) {
    redirect(`/submit?error=${encodeURIComponent(error instanceof Error ? error.message : "Submission failed")}`);
  }
  revalidatePath("/dashboard");
  redirect("/dashboard?submitted=1");
}

export async function joinArenaQueue(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const productId = String(formData.get("productId") ?? "");
  const { error } = await supabase.rpc("join_arena_queue", { target_product_id: productId });
  if (error) redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/dashboard");
}

export async function updateProduct(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const productId = String(formData.get("productId") ?? "");
  const parsed = productSchema.safeParse({
    name: formData.get("name"), url: formData.get("url"), tagline: formData.get("tagline"),
    description: formData.get("description"), category: formData.get("category"), pricingType: formData.get("pricingType") ?? "unknown",
  });
  if (!parsed.success) redirect(`/dashboard/products/${productId}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`);
  const { pricingType, ...fields } = parsed.data;
  const { error } = await supabase.from("products").update({ ...fields, pricing_type: pricingType, status: "submitted" }).eq("id", productId).eq("owner_id", user.id);
  if (error) redirect(`/dashboard/products/${productId}?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/dashboard");
  redirect("/dashboard?submitted=1");
}
