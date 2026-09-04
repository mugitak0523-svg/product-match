import { Link } from "@/i18n/navigation";
import { redirect } from "next/navigation";
import { joinArenaQueue } from "@/app/actions/products";
import { signOut } from "@/app/actions/auth";
import { ProductMark } from "@/components/product-mark";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage({searchParams}:{searchParams:Promise<{submitted?:string;error?:string}>}){
  const query=await searchParams;const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
  const {data:products}=await supabase.from("products").select("*, arena_entries(status,arena:arenas(arena_number,status))").eq("owner_id",user.id).order("created_at",{ascending:false});
  return <div className="page-shell"><div className="dashboard-grid"><aside className="side-nav"><Link href="/dashboard">My products</Link><Link href="/submit">Submit product</Link><form action={signOut}><button className="button button-ghost">Sign out</button></form></aside><section><span className="eyebrow">Maker dashboard</span><div className="section-head"><h1 style={{fontSize:58}}>Your products</h1><Link className="button button-accent" href="/submit">Add product</Link></div>{query.submitted&&<p className="form-message">Product submitted for review.</p>}{query.error&&<p className="form-message">{query.error}</p>}<div className="stack">{products?.map(product=><article className="panel product-card" key={product.id}><ProductMark name={product.name} src={product.logo_url}/><div className="product-card-copy"><strong>{product.name}</strong><span>{product.tagline}</span><br/><span className="badge">{product.status}</span></div><div style={{marginLeft:"auto",display:"flex",gap:8}}><Link className="button button-ghost" href={`/dashboard/products/${product.id}`}>Manage</Link><Link className="button button-ghost" href={`/products/${product.slug}`}>View</Link>{product.status==="approved"&&!product.arena_entries?.some((entry:{status:string})=>["queued","active"].includes(entry.status))&&<form action={joinArenaQueue}><input type="hidden" name="productId" value={product.id}/><button className="button">Join Arena</button></form>}</div></article>)}</div>{!products?.length&&<div className="empty"><h3>No products yet</h3><p>Submit your first product to enter the Arena.</p></div>}</section></div></div>;
}
