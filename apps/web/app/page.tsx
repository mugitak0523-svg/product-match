import Link from "next/link";
import { ArrowRight, Trophy, Users, Zap } from "lucide-react";
import { MatchCard } from "@/components/match-card";
import { getActiveMatches } from "@/lib/data";

export default async function LandingPage() {
  const matches = await getActiveMatches(1);
  return <>
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow">The product discovery arena</span><h1>Two products.<br/><em>One winner.</em></h1><p>Discover the products worth trying through head-to-head battles. Vote, follow the bracket, and crown the next champion.</p><div className="hero-actions"><Link className="button button-accent" href={matches[0] ? `/matches/${matches[0].id}` : "/discover"}>Enter the arena <ArrowRight size={17}/></Link><Link className="button button-ghost" href="/submit">Submit your product</Link></div></div>
      <div className="hero-card">{matches[0] ? <MatchCard match={matches[0]} /> : <div className="empty"><Zap size={30}/><h3>The next battle is forming</h3><p>Submit a product to join the first Arena.</p></div>}</div>
    </section>
    <section className="stat-strip"><div><strong>128</strong><span className="muted"><Users size={14}/> products per Arena</span></div><div><strong>7 days</strong><span className="muted"><Zap size={14}/> of head-to-head matches</span></div><div><strong>1</strong><span className="muted"><Trophy size={14}/> undisputed champion</span></div></section>
  </>;
}
