import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { ProductMark } from "@/components/product-mark";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("*,products(*)").eq("username", username).is("deleted_at", null).maybeSingle();
  if (!profile) notFound();
  const links = [profile.website_url && { href: profile.website_url, label: "Website" }, profile.x_handle && { href: `https://x.com/${profile.x_handle}`, label: "X" }, profile.github_url && { href: profile.github_url, label: "GitHub" }, profile.linkedin_url && { href: profile.linkedin_url, label: "LinkedIn" }].filter(Boolean) as { href: string; label: string }[];
  return <div className="page-shell"><section className="profile-hero"><ProductMark name={profile.display_name ?? username} src={profile.avatar_url} size={92}/><div><span className="eyebrow">Maker profile</span><h1 style={{ fontSize: 56, margin: "8px 0" }}>{profile.display_name ?? username}</h1><p className="muted">@{profile.username}</p><p>{profile.bio}</p>{links.length > 0 && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{links.map((link) => <a key={link.label} className="button button-ghost" href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div>}</div></section><h2>Products</h2><div className="grid">{profile.products?.filter((product: { status: string }) => product.status === "approved").map((product: { id: string; slug: string; name: string; logo_url: string; tagline: string }) => <Link className="product-card" href={`/products/${product.slug}`} key={product.id}><ProductMark name={product.name} src={product.logo_url}/><span className="product-card-copy"><strong>{product.name}</strong><span>{product.tagline}</span></span></Link>)}</div></div>;
}
