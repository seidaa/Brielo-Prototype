import { useState } from "react";
import { Link } from "wouter";
import {
  MapPin, Navigation, X, Users, Clock, ChevronRight, Check,
  Dumbbell, Coffee, Utensils, BookOpen, Trophy, Music, Leaf, Mic2,
  Gamepad2, Handshake, Palette, CheckCheck, Footprints, UsersRound,
} from "lucide-react";
import { useRallies, useCirclePersons, useJoinRequests } from "@/hooks/useRallies";
import { useToast } from "@/hooks/use-toast";
import { BottomNav } from "@/components/BottomNav";
import { JoinCommitmentModal } from "@/components/JoinCommitmentModal";
import { CAT_CONFIG, defaultCatConfig, Move } from "@/data/mockData";
import { isLimitedSpots } from "@/lib/trust";
import { cn } from "@/lib/utils";

const PIN_POSITIONS: Record<string, { top: string; left: string }> = {
  r1: { top: "38%", left: "22%" },
  r2: { top: "28%", left: "62%" },
  r3: { top: "58%", left: "72%" },
  r4: { top: "72%", left: "28%" },
  r5: { top: "65%", left: "48%" },
  r6: { top: "45%", left: "78%" },
  r7: { top: "80%", left: "65%" },
};

const CAT_ICONS: Record<string, React.ElementType> = {
  Fitness:    Dumbbell,
  Coffee:     Coffee,
  Food:       Utensils,
  Study:      BookOpen,
  Sports:     Trophy,
  Nightlife:  Music,
  Outdoors:   Leaf,
  Concerts:   Mic2,
  Gaming:     Gamepad2,
  Networking: Handshake,
  Creative:   Palette,
  Errands:    CheckCheck,
  Walking:    Footprints,
};

type MapFilter = "all" | "live" | "circle";

export default function Map() {
  const { rallies, joinRally } = useRallies();
  const { myCircle } = useCirclePersons();
  const { getStatus, requestToJoin } = useJoinRequests();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<MapFilter>("all");
  const [joinedId, setJoinedId] = useState<string | null>(null);
  const [pendingMove, setPendingMove] = useState<Move | null>(null);

  const circleHostNames = new Set(myCircle.map(p => p.name));

  const visibleRallies = rallies.filter(r => {
    if (!PIN_POSITIONS[r.id]) return false;
    if (filter === "live") return r.time === "Now";
    if (filter === "circle") return r.isCircleMove || circleHostNames.has(r.hostName);
    return true;
  });

  const activeMove = selectedId ? rallies.find(r => r.id === selectedId) : null;
  const nowMoves = rallies.filter(r => r.time === "Now");

  const doJoin = (id: string, savedSpot: boolean) => {
    joinRally(id);
    setPendingMove(null);
    setJoinedId(id);
    setTimeout(() => setJoinedId(null), 2000);
    if (savedSpot) toast({ title: "You're in. Your spot is saved." });
  };

  const handleJoin = (id: string) => {
    const move = rallies.find(r => r.id === id);
    if (!move) return;
    // Approval-required Moves request instead of joining — no join, no count/spot
    // change, no Move Chat.
    if (move.requiresApproval) {
      if (requestToJoin(move)) toast({ title: "Request sent. The host will review it." });
      return;
    }
    if (isLimitedSpots(move)) {
      setPendingMove(move);
      return;
    }
    doJoin(id, false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">

      {/* ── Map Grid Background ────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-0"
        onClick={() => setSelectedId(null)}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#181818_1px,transparent_1px),linear-gradient(to_bottom,#181818_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_3px,transparent_3px),linear-gradient(to_bottom,#141414_3px,transparent_3px)] bg-[size:9rem_9rem] opacity-60" />

        {/* Street lines */}
        <div className="absolute top-[22%] left-0 right-0 h-5 bg-[#0f0f0f] border-y border-[#1e1e1e]" />
        <div className="absolute top-[55%] left-0 right-0 h-5 bg-[#0f0f0f] border-y border-[#1e1e1e]" />
        <div className="absolute top-[78%] left-0 right-0 h-4 bg-[#0f0f0f] border-y border-[#1e1e1e]" />
        <div className="absolute left-[32%] top-0 bottom-0 w-5 bg-[#0f0f0f] border-x border-[#1e1e1e]" />
        <div className="absolute left-[68%] top-0 bottom-0 w-4 bg-[#0f0f0f] border-x border-[#1e1e1e]" />

        {/* Park blocks */}
        <div className="absolute top-[30%] left-[38%] w-16 h-16 bg-emerald-950/30 border border-emerald-900/20 rounded-sm" />
        <div className="absolute top-[60%] left-[50%] w-12 h-12 bg-emerald-950/20 border border-emerald-900/15 rounded-sm" />

        {/* You are here */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative w-5 h-5">
            <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
            <div className="absolute inset-1 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
          </div>
        </div>

        {/* Move Pins */}
        {visibleRallies.map(move => {
          const pos = PIN_POSITIONS[move.id];
          if (!pos) return null;
          const cat = CAT_CONFIG[move.category] ?? defaultCatConfig;
          const CatIcon = CAT_ICONS[move.category];
          const isLive = move.time === "Now";
          const isSelected = selectedId === move.id;

          return (
            <button
              key={move.id}
              style={{ top: pos.top, left: pos.left }}
              onClick={e => { e.stopPropagation(); setSelectedId(isSelected ? null : move.id); }}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-200",
                isSelected ? "scale-125 z-30" : "hover:scale-110"
              )}
            >
              <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border shadow-lg font-bold text-xs transition-all",
                isSelected
                  ? "bg-primary text-black border-primary shadow-[0_0_16px_rgba(250,204,21,0.5)]"
                  : "bg-[#161616] text-white border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
              )}>
                {CatIcon
                  ? <CatIcon
                      style={{ width: 11, height: 11 }}
                      strokeWidth={2}
                      className={isSelected ? "text-black" : cat.text}
                    />
                  : <span className="text-[10px]">{cat.emoji}</span>
                }
                <span className={cn("font-black text-[11px]", isSelected ? "text-black" : "text-gray-200")}>
                  {move.going}
                </span>
                {isLive && !isSelected && (
                  <span className="relative flex h-1.5 w-1.5 ml-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 max-w-sm mx-auto z-40 px-4 pt-12 flex items-start justify-between pointer-events-none">
        <div className="bg-[#0d0d0d]/90 backdrop-blur-xl border border-white/8 rounded-2xl px-4 py-2.5 pointer-events-auto shadow-xl">
          <h1 className="text-sm font-black text-white">Chicago</h1>
          <p className="text-[10px] text-primary font-bold">{nowMoves.length} live moves near you</p>
        </div>
        <button className="w-10 h-10 bg-[#0d0d0d]/90 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/8 pointer-events-auto shadow-xl">
          <Navigation className="w-4 h-4 text-primary fill-primary/20" />
        </button>
      </div>

      {/* ── Filter chips ─────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 max-w-sm mx-auto z-40 px-4 pt-28 pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          {([
            { id: "all"    as MapFilter, label: "All"              },
            { id: "live"   as MapFilter, label: "Live Now"         },
            { id: "circle" as MapFilter, label: "From Your Circle" },
          ]).map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border backdrop-blur-xl shadow-md transition-all",
                filter === f.id
                  ? "bg-primary text-black border-primary shadow-[0_0_8px_rgba(250,204,21,0.3)]"
                  : "bg-[#0d0d0d]/85 text-gray-400 border-white/8"
              )}
            >
              {f.id === "circle" && <UsersRound className="w-3 h-3" />}
              {f.id === "live" && filter === "live" && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-black opacity-60" />
                  <span className="relative rounded-full h-1.5 w-1.5 bg-black" />
                </span>
              )}
              {f.id === "live" && filter !== "live" && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative rounded-full h-1.5 w-1.5 bg-red-500" />
                </span>
              )}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Move preview bottom sheet ─────────────────────────────── */}
      <div className={cn(
        "absolute bottom-24 left-4 right-4 z-50 transition-all duration-300",
        activeMove ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
      )}>
        {activeMove && (() => {
          const cat = CAT_CONFIG[activeMove.category] ?? defaultCatConfig;
          const CatIcon = CAT_ICONS[activeMove.category];
          const spotsLeft = activeMove.maxSpots - activeMove.going;
          const isJoined = activeMove.joined || joinedId === activeMove.id;
          const isFull = spotsLeft <= 0;
          const approval = activeMove.requiresApproval;
          const isPending = getStatus(activeMove.id) === "pending";

          return (
            <div className="bg-[#161616] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Header row */}
              <div className="flex items-start gap-3 p-4 pb-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", cat.color)}>
                  {CatIcon
                    ? <CatIcon className={cat.text} strokeWidth={1.75} style={{ width: 18, height: 18 }} />
                    : <span className="text-lg">{cat.emoji}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full", cat.color, cat.text)}>
                      {activeMove.category}
                    </span>
                    {activeMove.time === "Now" && (
                      <span className="flex items-center gap-1 text-[10px] font-black text-red-400">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative rounded-full h-1.5 w-1.5 bg-red-500" />
                        </span>
                        Live
                      </span>
                    )}
                    {activeMove.time !== "Now" && (
                      <span className="flex items-center gap-1 text-[10px] text-gray-500">
                        <Clock className="w-3 h-3" /> {activeMove.time}
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-white text-base leading-snug">{activeMove.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5"
                >
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-4 px-4 pb-3 text-[12px] text-gray-500">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{activeMove.distance} away</span>
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{activeMove.going} going</span>
                {!isFull && spotsLeft <= 3 && (
                  <span className="font-bold text-amber-400">{spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left</span>
                )}
                {isFull && <span className="font-bold text-red-400">Full</span>}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 px-4 pb-4">
                <button
                  onClick={() => handleJoin(activeMove.id)}
                  disabled={isJoined || isPending || (isFull && !approval)}
                  className={cn(
                    "flex-1 font-black text-sm rounded-xl py-2.5 transition-all",
                    isJoined || isPending
                      ? "bg-white/8 text-gray-400 border border-white/8"
                      : isFull && !approval
                      ? "bg-white/3 text-gray-600 cursor-not-allowed"
                      : "bg-primary text-black shadow-[0_0_12px_rgba(250,204,21,0.3)] active:scale-95"
                  )}
                >
                  {isJoined ? <span className="inline-flex items-center justify-center gap-1"><Check className="w-3.5 h-3.5" strokeWidth={3} />You're In</span>
                    : isPending ? "Request Sent"
                    : approval ? "Request to Join"
                    : isFull ? "Move is Full" : "I'm In"}
                </button>
                <Link href={`/rally/${activeMove.id}`}>
                  <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm font-bold text-gray-300 active:scale-95 transition-all">
                    View Move <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          );
        })()}
      </div>

      <JoinCommitmentModal
        open={!!pendingMove}
        onOpenChange={o => { if (!o) setPendingMove(null); }}
        move={pendingMove}
        onConfirm={() => pendingMove && doJoin(pendingMove.id, true)}
      />

      <BottomNav />
    </div>
  );
}
