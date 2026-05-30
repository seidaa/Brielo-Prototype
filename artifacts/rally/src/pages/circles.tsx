import { Link } from "wouter";
import { ChevronLeft, Users, Calendar, Lock, Globe, Plus, ChevronRight, Repeat } from "lucide-react";
import { useCircles } from "@/hooks/useRallies";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { CAT_CONFIG, defaultCatConfig } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function Circles() {
  const { circles } = useCircles();

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-28 pt-14">
      <header className="fixed top-0 left-0 right-0 max-w-sm mx-auto bg-[#0d0d0d]/95 backdrop-blur-xl z-40 px-4 h-14 flex items-center border-b border-white/5">
        <Link href="/profile" className="mr-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/5">
          <ChevronLeft className="w-5 h-5 text-white" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-black text-white leading-tight">Brio Circles</h1>
        </div>
        <button className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 border border-primary/20">
          <Plus className="w-4 h-4 text-primary" />
        </button>
      </header>

      <div className="p-4">
        {/* Hero copy */}
        <div className="mb-5 pt-1">
          <p className="text-sm text-gray-400 leading-relaxed">
            Recurring groups built around the things you actually like doing.
          </p>
        </div>

        {/* Category legend */}
        <div className="flex overflow-x-auto gap-2 mb-5 no-scrollbar">
          {["All", "Coffee", "Fitness", "Sports", "Nightlife", "Food", "Study", "Outdoors"].map(cat => {
            const cfg = cat !== "All" ? CAT_CONFIG[cat] : null;
            return (
              <button key={cat} className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold border bg-white/5 text-gray-400 border-white/5 whitespace-nowrap">
                {cfg ? <span>{cfg.emoji}</span> : <span>✨</span>} {cat}
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {circles.map(circle => {
            const cat = CAT_CONFIG[circle.category] ?? defaultCatConfig;
            return (
              <Link key={circle.id} href={`/circles/${circle.id}`}>
                <div className="bg-[#161616] rounded-2xl border border-white/5 hover:border-white/10 transition-all active:scale-[0.99] overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start gap-3.5">
                      {/* Icon */}
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0", cat.color)}>
                        {circle.emoji}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h2 className="font-black text-white text-sm leading-snug">{circle.name}</h2>
                          <span className={cn(
                            "shrink-0 flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full border",
                            circle.isPublic
                              ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                              : "text-amber-400 border-amber-500/30 bg-amber-500/10"
                          )}>
                            {circle.isPublic ? <Globe className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                            {circle.isPublic ? "Open" : "Private"}
                          </span>
                        </div>

                        <p className="text-[11px] text-gray-500 mb-2 leading-relaxed line-clamp-1">{circle.description}</p>

                        <div className="flex items-center gap-3 text-[11px] text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> {circle.membersCount}
                          </span>
                          <span className="flex items-center gap-1 text-primary font-bold">
                            <Calendar className="w-3 h-3" /> {circle.nextMoveTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Repeat className="w-3 h-3" /> {circle.schedule}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-gray-600 shrink-0 mt-1" />
                    </div>

                    {/* CTA row */}
                    <div className="mt-3 pt-3 border-t border-white/5 flex gap-2">
                      <Button className="flex-1 h-9 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-bold rounded-xl text-xs">
                        {circle.isPublic ? "Join Circle" : "View Circle"}
                      </Button>
                      <button className="px-3 h-9 rounded-xl bg-white/5 border border-white/8 text-xs font-bold text-gray-400 hover:text-gray-200 transition-colors">
                        More
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Create CTA */}
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-5 flex flex-col items-center text-center gap-3">
          <div className="text-3xl">🫂</div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Start a new circle</p>
            <p className="text-xs text-gray-500">Create a recurring group around something you love doing.</p>
          </div>
          <Button className="bg-white/8 hover:bg-white/12 border border-white/10 text-white font-bold rounded-xl px-5 h-9 text-sm">
            <Plus className="w-4 h-4 mr-1.5" /> Create Circle
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
