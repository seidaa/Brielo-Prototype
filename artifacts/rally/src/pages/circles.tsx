import { Link } from "wouter";
import { ChevronLeft, Users, Calendar, Lock, Globe, Plus, ChevronRight } from "lucide-react";
import { useCircles } from "@/hooks/useRallies";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Circles() {
  const { circles } = useCircles();

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-28 pt-14">
      <header className="fixed top-0 left-0 right-0 max-w-sm mx-auto bg-[#0d0d0d]/95 backdrop-blur-xl z-40 px-4 h-14 flex items-center border-b border-white/5">
        <Link href="/profile" className="mr-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/5">
          <ChevronLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-lg font-black text-white flex-1">Your Circles</h1>
        <button className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 border border-primary/20">
          <Plus className="w-4 h-4 text-primary" />
        </button>
      </header>

      <div className="p-4">
        <p className="text-xs text-gray-500 mb-4">Groups of people you rally with regularly.</p>

        <div className="space-y-3">
          {circles.map(circle => (
            <Link key={circle.id} href={`/circles/${circle.id}`}>
              <div className="bg-[#161616] rounded-2xl border border-white/5 hover:border-white/10 transition-all active:scale-[0.99] overflow-hidden">
                <div className="p-4 flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-2xl shrink-0">
                    {circle.emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h2 className="font-black text-white text-sm leading-snug truncate">{circle.name}</h2>
                      <span className={cn(
                        "shrink-0 flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full border",
                        circle.isPublic
                          ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                          : "text-amber-400 border-amber-500/30 bg-amber-500/10"
                      )}>
                        {circle.isPublic ? <Globe className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                        {circle.isPublic ? "Public" : "Private"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {circle.membersCount} members
                      </span>
                      <span className="flex items-center gap-1 text-primary">
                        <Calendar className="w-3 h-3" /> {circle.nextRallyTime}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Create circle CTA */}
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-5 flex flex-col items-center text-center gap-3">
          <div className="text-3xl">🫂</div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Start a new circle</p>
            <p className="text-xs text-gray-500">Group your regular crew for recurring rallies.</p>
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
