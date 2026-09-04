import { notFound, redirect } from "next/navigation";
import { updateProduct } from "@/app/actions/products";
import { Dropdown } from "@/components/dropdown";
import { createClient } from "@/lib/supabase/server";

const pricing = [["free", "Free"], ["freemium", "Freemium"], ["paid", "Paid"], ["contact", "Contact sales"]].map(([value, label]) => ({ value, label }));

export default async function ManageProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: product } = await supabase.from("products").select("*").eq("id", id).eq("owner_id", user.id).maybeSingle();
  if (!product) notFound();
  return <div className="page-shell narrow"><span className="eyebrow">Maker dashboard</span><h1>Manage product</h1><p className="muted">Changes are sent back to the review queue.</p><form action={updateProduct} className="panel form"><input type="hidden" name="productId" value={product.id}/><div className="form-row"><div className="field"><label>Name</label><input name="name" defaultValue={product.name} required/></div><div className="field"><label>Website URL</label><input name="url" type="url" defaultValue={product.url} required/></div></div><div className="field"><label>Tagline</label><input name="tagline" maxLength={80} defaultValue={product.tagline} required/></div><div className="field"><label>Description</label><textarea name="description" maxLength={2000} defaultValue={product.description} required/></div><div className="form-row"><div className="field"><label>Category</label><input name="category" defaultValue={product.category} required/></div><div className="field"><label>Pricing</label><Dropdown ariaLabel="Pricing" name="pricingType" value={product.pricing_type ?? "free"} options={pricing}/></div></div><button className="button button-accent">Save and submit for review</button></form></div>;
}
