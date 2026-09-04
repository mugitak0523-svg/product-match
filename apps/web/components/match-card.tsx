import { Link } from "@/i18n/navigation";
import type { Match } from "@/lib/types";
import { ProductMark } from "@/components/product-mark";
import { roundLabel } from "@/lib/utils";

export function MatchCard({ match, compact = false }: { match: Match; compact?: boolean }) {
  return (
    <Link href={`/matches/${match.id}`} className={`match-card ${compact ? "compact" : ""}`}>
      <div className="match-meta"><span className="live-dot" /> {match.status === "completed" ? "Final result" : "Live now"}<span>{roundLabel(match.round_number)}</span></div>
      <div className="duel-row">
        <div><ProductMark name={match.product_a.name} src={match.product_a.logo_url} /><strong>{match.product_a.name}</strong></div>
        <b className="versus">VS</b>
        <div><ProductMark name={match.product_b.name} src={match.product_b.logo_url} /><strong>{match.product_b.name}</strong></div>
      </div>
      <span className="card-cta">View match →</span>
    </Link>
  );
}
