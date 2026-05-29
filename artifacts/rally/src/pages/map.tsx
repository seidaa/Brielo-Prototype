import { useState } from "react";
import { Link } from "wouter";
import { MapPin, Navigation, X } from "lucide-react";
import { useRallies } from "@/hooks/useRallies";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { CAT_CONFIG } from "@/data/mockData";
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

export default function Map() {
  const { rallies } = useRallies();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeMove = selectedId ? rallies.find(r => r.id === selectedId) : null;
  const nowMoves = rallies.filter(r => r.time === "Now");

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 max-w-sm mx-auto z-40 px-4 pt-12 flex items-center justify-between pointer-events-none">
        <div className="bg-[#0d0d0d]/90 backdrop-blur-xl border border-white/8 rounded-2xl px-4 py-2.5 pointer-events-auto shadow-xl">
          <h1 className="text-sm font-black text-white">Chicago</h1>
          <p className="text-[10px] text-primary font-bold">{nowMoves.length} live moves near you</p>
        </div>
        <button className="w-10 h-10 bg-[#0d0d0d]/90 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/8 pointer-events-auto shadow-xl">
          <Navigation className="w-4 h-4 text-primary fill-primary/20" />
        </button>
      </div>

      {/* Map Grid Background */}
      <div
        className="absolute inset-0 z-0"
        onClick={() => setSelectedId(null)}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#181818_1px,transparent_1px),linear-gradient(to_bottom,#181818_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_3px,transparent_3px),linear-gradient(to_bottom,#141414_3px,transparent_3px)] bg-[size:9rem_9rem] opacity-60" />

        <div className="absolute top-[22%] left-0 right-0 h-5 bg-[#0f0f0f] border-y border-[#1e1e1e]" />
        <div className="absolute top-[55%] left-0 right-0 h-5 bg-[#0f0f0f] border-y border-[#1e1e1e]" />
        <div className="absolute top-[78%] left-0 right-0 h-4 bg-[#0f0f0f] border-y border-[#1e1e1e]" />
        <div className="absolute left-[32%] top-0 bottom-0 w-5 bg-[#0f0f0f] border-x border-[#1e1e1e]" />
        <div className="absolute left-[68%] top-0 bottom-0 w-4 bg-[#0f0f0f] border-x border-[#1e1e1e]" />

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
        {rallies.map(move => {
          const pos = PIN_POSITIONS[move.id];
          if (!pos) return null;
          const cat = CAT_CONFIG[move.category];
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
                <span>{cat?.emoji ?? "📍"}</span>
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

      {/* Category legend */}
      <div className="absolute bottom-[140px] right-4 z-30">
        <div className="bg-[#0d0d0d]/90 backdrop-blur-xl border border-white/8 rounded-xl p-2 space-y-1.5 shadow-xl">
          {Object.entries(CAT_CONFIG).slice(0, 5).map(([cat, cfg]) => (
            <div key={cat} className="flex items-center gap-2">
              <span className="text-sm">{cfg.emoji}</span>
              <span className="text-[10px] font-bold text-gray-400">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Move slide-up card */}
      <div className={cn(
        "absolute bottom-24 left-4 right-4 z-40 transition-all duration-300",
        activeMove ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"
      )}>
        {activeMove && (
          <div className="bg-[#161616] rounded-2xl p-4 border border-white/10 shadow-2xl">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{CAT_CONFIG[activeMove.category]?.emoji}</span>
                  <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full", CAT_CONFIG[activeMove.category]?.color, CAT_CONFIG[activeMove.category]?.text)}>
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
                </div>
                <h3 className="font-black text-white text-base leading-snug">{activeMove.title}</h3>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mb-4">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {activeMove.distance}</span>
              <span>{activeMove.going} in · {activeMove.maxSpots - activeMove.going} spots left</span>
            </div>

            <Link href={`/rally/${activeMove.id}`}>
              <Button className="w-full bg-primary hover:bg-primary/90 text-black font-bold rounded-xl h-11 shadow-[0_0_12px_rgba(250,204,21,0.25)]">
                See the Move
              </Button>
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
