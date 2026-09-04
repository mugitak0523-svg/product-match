export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(value: string | null) {
  if (!value) return "TBD";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export function roundLabel(round: number, arenaSize = 128) {
  const remaining = arenaSize / 2 ** (round - 1);
  if (remaining === 2) return "Final";
  if (remaining === 4) return "Semifinal";
  if (remaining === 8) return "Quarterfinal";
  return `Round of ${remaining}`;
}

export function votePercent(value: number, total: number) {
  return total === 0 ? 50 : Math.round((value / total) * 100);
}
