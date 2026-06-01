import {
  Move, TrustLabel, WarningLabel, PersonTrust, TrustPerson,
  TRUST_PEOPLE, PEOPLE_TRUST,
} from "@/data/mockData";

// ── Spot accountability ──────────────────────────────────────────────────────
// A Move counts as "limited" when only a few open spots remain — that's where a
// no-show hurts most and where we ask the user to commit before joining.
export function isLimitedSpots(move: Pick<Move, "going" | "maxSpots">): boolean {
  const left = move.maxSpots - move.going;
  return left > 0 && left <= 3;
}

export function spotsLeft(move: Pick<Move, "going" | "maxSpots">): number {
  return Math.max(0, move.maxSpots - move.going);
}

// ── Stats formatting ─────────────────────────────────────────────────────────
// "Show-Up Rate" is a stat, never a label. -1 means not enough history yet.
export function formatShowUpRate(rate: number): string {
  return rate < 0 ? "—" : `${Math.round(rate)}%`;
}

export function computeShowUpRate(attended: number, missed: number): number {
  const total = attended + missed;
  if (total < 3) return -1; // not enough history
  return Math.round((attended / total) * 100);
}

// ── Fairness rules baked into computation ────────────────────────────────────
// One miss is never permanent. Recent, consistent attendance rebuilds standing.
// The only attendee warning label allowed is "Recently Missed Moves".
export function computeWarning(t: Pick<PersonTrust, "movesAttended" | "movesMissed" | "showUpRate">): WarningLabel | undefined {
  // A single miss does not trigger a warning.
  if (t.movesMissed >= 2 && t.showUpRate >= 0 && t.showUpRate < 80) {
    return "Recently Missed Moves";
  }
  return undefined;
}

export function computeTrustLabel(t: Pick<PersonTrust, "movesAttended" | "movesMissed" | "showUpRate" | "wouldMoveAgainCount" | "goodVibesCount">): TrustLabel {
  const total = t.movesAttended + t.movesMissed;
  if (total < 3) return "New / Limited History";
  if (t.showUpRate >= 0 && t.showUpRate >= 95) return "Reliable";
  if (t.goodVibesCount >= 12) return "Good Vibes";
  if (t.wouldMoveAgainCount >= 12) return "Would Move Again";
  return "Shows Up";
}

// ── Visual styling for labels (Lucide icons, no emoji) ───────────────────────
import {
  ShieldCheck, CheckCircle2, Sparkles, Crown, Repeat, UserPlus,
  AlertTriangle, Eye,
} from "lucide-react";

type LabelStyle = { Icon: import("react").ElementType; className: string };

export const TRUST_LABEL_STYLES: Record<TrustLabel, LabelStyle> = {
  "Reliable":              { Icon: ShieldCheck,  className: "bg-emerald-500/12 text-emerald-400 border-emerald-500/25" },
  "Shows Up":              { Icon: CheckCircle2, className: "bg-primary/12 text-primary border-primary/25" },
  "Good Vibes":            { Icon: Sparkles,     className: "bg-amber-500/12 text-amber-400 border-amber-500/25" },
  "Trusted Host":          { Icon: Crown,        className: "bg-violet-500/12 text-violet-300 border-violet-500/25" },
  "Would Move Again":      { Icon: Repeat,       className: "bg-blue-500/12 text-blue-400 border-blue-500/25" },
  "New / Limited History": { Icon: UserPlus,     className: "bg-white/5 text-gray-400 border-white/10" },
};

export const WARNING_LABEL_STYLES: Record<WarningLabel, LabelStyle> = {
  "Recently Missed Moves":  { Icon: AlertTriangle, className: "bg-amber-500/12 text-amber-400 border-amber-500/30" },
  "Host Review Recommended":{ Icon: Eye,           className: "bg-amber-500/12 text-amber-400 border-amber-500/30" },
};

// ── Attendee derivation ──────────────────────────────────────────────────────
// Deterministically pick the "Who's In" attendees for a Move from the shared
// people pool, seeded by the Move id so the list is stable per Move. The host is
// excluded from their own attendee list.
export type DerivedAttendee = TrustPerson & { trust: PersonTrust };

export function deriveAttendees(move: Pick<Move, "id" | "going" | "hostName">): DerivedAttendee[] {
  const pool = TRUST_PEOPLE.filter(p => p.name !== move.hostName);
  if (pool.length === 0 || move.going <= 0) return [];
  const seed = [...move.id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const count = Math.min(move.going, pool.length);
  const out: DerivedAttendee[] = [];
  for (let i = 0; i < count; i++) {
    const person = pool[(seed + i) % pool.length];
    out.push({ ...person, trust: PEOPLE_TRUST[person.name] });
  }
  return out;
}

// ── Copy (firm, fair, human — never shaming) ─────────────────────────────────
export const RECOVERY_COPY = {
  good: "You're in good standing. Keep showing up for the people who count on you.",
  oneMiss: "One missed Move isn't permanent. A couple of consistent shows will bring this right back up.",
  rebuilding: "Recent behavior matters most. Show up to your next few Moves and your standing rebuilds quickly.",
};

export const TRUST_INFO = {
  title: "How show-up trust works",
  intro: "When you tap I'm In, you're holding a limited spot someone else may have wanted. Show-up trust keeps Moves fair for everyone — it's about reliability, not judgment.",
  points: [
    { title: "Showing up builds trust", body: "Attending the Moves you join raises your Show-Up Rate and earns labels like Shows Up and Reliable." },
    { title: "Leaving early isn't a no-show", body: "Leave a Move ahead of time and your spot simply opens for someone else. No penalty." },
    { title: "One miss isn't permanent", body: "A single missed Move won't define you. Recent, consistent attendance matters most." },
    { title: "Trust recovers", body: "Standing rebuilds as you show up again. There are no permanent marks here." },
    { title: "Reports stay private", body: "Safety feedback like Felt Off or Report is private and only used to keep Brielo safe." },
  ],
};
