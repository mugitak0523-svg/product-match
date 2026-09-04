import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MatchCard } from "@/components/match-card";
import { ProductMark } from "@/components/product-mark";
import { getActiveMatches, getArenas, getProducts } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function DiscoverPage() {
  const [matches, arenas, products] = await Promise.all([getActiveMatches(6), getArenas(3), getProducts(6)]);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/discover");
  const gate = (await cookies()).get("pm_gate");
  if (!gate && matches.length) {
    const { data: owned } = await supabase.from("products").select("id").eq("owner_id", user.id);
    const ownedIds = new Set((owned ?? []).map((product) => product.id));
    const eligible = matches.filter((match) => !ownedIds.has(match.product_a_id) && !ownedIds.has(match.product_b_id));
    if (eligible.length) redirect(`/matches/${eligible[Math.floor(Math.random() * eligible.length)].id}?gate=1`);
  }
  return <div className="page-shell"><div className="section-head"><div><span className="eyebrow">Today in the arena</span><h1>Discover</h1></div><Link className="button button-ghost" href="/submit">Submit a product</Link></div><section><div className="section-head"><h2>Live now</h2><Link href="/arenas">View arenas →</Link></div>{matches.length ? <div className="grid">{matches.map(match=><MatchCard key={match.id} match={match}/>)}</div>:<div className="empty">No active matches yet. The next Arena is filling up.</div>}</section><section style={{marginTop:80}}><div className="section-head"><h2>Current Arenas</h2></div><div className="grid">{arenas.map(arena=><Link className="arena-card" href={`/arenas/${arena.arena_number}`} key={arena.id}><div className="arena-card-head"><span>Arena #{arena.arena_number}</span><span className={`badge ${arena.status === "active" ? "live":""}`}>{arena.status}</span></div><h3>{arena.arena_size} products</h3><span className="muted">Started {formatDate(arena.starts_at)}</span><div className="arena-progress"><i style={{width:arena.status === "completed" ? "100%":"45%"}}/></div></Link>)}</div></section><section style={{marginTop:80}}><div className="section-head"><h2>New products</h2></div><div className="grid">{products.map(product=><Link className="product-card" href={`/products/${product.slug}`} key={product.id}><ProductMark name={product.name} src={product.logo_url}/><span className="product-card-copy"><strong>{product.name}</strong><span>{product.tagline}</span></span></Link>)}</div></section></div>;
}
