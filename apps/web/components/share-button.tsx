"use client";

import { Share2 } from "lucide-react";

export function ShareButton({ matchId, productA, productB }: { matchId: string; productA: string; productB: string }) {
  const share = async () => {
    const url = `${window.location.origin}/matches/${matchId}`;
    const text = `⚔️ ${productA} vs ${productB}\nWho gets your vote?`;
    if (navigator.share) await navigator.share({ title: `${productA} vs ${productB}`, text, url });
    else window.open(`https://x.com/intent/post?text=${encodeURIComponent(`${text}\n${url}`)}`, "_blank", "noopener,noreferrer");
  };
  return <button className="button button-ghost" onClick={share}><Share2 size={16}/> Share match</button>;
}
