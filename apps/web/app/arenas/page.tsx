import Link from "next/link";
import { getArenas } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Arenas" };
export default async function ArenasPage() {
  const arenas = await getArenas(50);
  return <div className="page-shell"><span className="eyebrow">Tournament archive</span><h1>Arenas</h1><p className="muted">Follow every bracket from the first battle to the final champion.</p><div className="grid" style={{marginTop:36}}>{arenas.map(arena=><Link className="arena-card" href={`/arenas/${arena.arena_number}`} key={arena.id}><div className="arena-card-head"><strong>Arena #{arena.arena_number}</strong><span className={`badge ${arena.status === "active"?"live":""}`}>{arena.status}</span></div><h3>{arena.champion ? `${arena.champion.name} won` : `${arena.arena_size} products`}</h3><span className="muted">{formatDate(arena.starts_at)} · {arena.arena_size} entries</span></Link>)}</div>{!arenas.length&&<div className="empty">No Arenas have been created yet.</div>}</div>;
}
