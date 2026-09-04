import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Arena, Match } from "@/lib/types";
import { formatDate, roundLabel } from "@/lib/utils";

export default async function ArenaPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const supabase = await createClient();
  const { data: arenaData } = await supabase.from("arenas").select("*").eq("arena_number", Number(number)).maybeSingle();
  if (!arenaData) notFound();
  const arena = arenaData as Arena;
  const { data } = await supabase.from("matches_public").select(`*, product_a:products!matches_product_a_id_fkey(id,name,slug,logo_url), product_b:products!matches_product_b_id_fkey(id,name,slug,logo_url)`).eq("arena_id", arena.id).order("round_number").order("bracket_position");
  const matches = (data ?? []) as unknown as Match[];
  const rounds = Array.from({length:Math.log2(arena.arena_size)},(_,index)=>index+1);
  return <div className="page-shell"><span className="eyebrow">{arena.status} tournament</span><div className="section-head"><div><h1>Arena #{arena.arena_number}</h1><p className="muted">{arena.arena_size} products · {formatDate(arena.starts_at)} – {formatDate(arena.ends_at)}</p></div></div><div className="bracket">{rounds.map(round=><section className="bracket-round" key={round}><h3>{roundLabel(round,arena.arena_size)}</h3>{matches.filter(match=>match.round_number===round).map(match=><Link href={`/matches/${match.id}`} className="bracket-match" key={match.id}><div className={`bracket-team ${match.winner_product_id===match.product_a_id?"winner":""}`}><span>{match.product_a?.name??"TBD"}</span>{match.winner_product_id===match.product_a_id&&<span>W</span>}</div><div className={`bracket-team ${match.winner_product_id===match.product_b_id?"winner":""}`}><span>{match.product_b?.name??"TBD"}</span>{match.winner_product_id===match.product_b_id&&<span>W</span>}</div></Link>)}</section>)}</div></div>;
}
