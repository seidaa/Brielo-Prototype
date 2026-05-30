import { Link, useParams } from "wouter";
import { ChevronLeft, Plus, Users, Calendar, Lock, Globe, Star, Repeat } from "lucide-react";
import { useCircles } from "@/hooks/useRallies";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { CAT_CONFIG, defaultCatConfig } from "@/data/mockData";
import { cn } from "@/lib/utils";

const MEMBER_COLORS = ["bg-orange-500", "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-pink-500", "bg-amber-500"];

const CIRCLE_MEMBERS: Record<string, { name: string; level: number; initials: string }[]> = {
  c1: [{ name: "Priya S.", level: 3, initials: "PS" }, { name: "Marcus L.", level: 7, initials: "ML" }, { name: "You", level: 3, initials: "YB" }, { name: "Taylor M.", level: 4, initials: "TM" }],
  c2: [{ name: "Marcus L.", level: 7, initials: "ML" }, { name: "Jordan K.", level: 5, initials: "JK" }, { name: "You", level: 3, initials: "YB" }, { name: "Alex T.", level: 4, initials: "AT" }],
  c3: [{ name: "Alex T.", level: 4, initials: "AT" }, { name: "You", level: 3, initials: "YB" }, { name: "Sofia R.", level: 6, initials: "SR" }],
  c4: [{ name: "Devon A.", level: 8, initials: "DA" }, { name: "You", level: 3, initials: "YB" }, { name: "Camille D.", level: 5, initials: "CD" }],
  c5: [{ name: "Jordan K.", level: 5, initials: "JK" }, { name: "Marcus L.", level: 7, initials: "ML" }, { name: "You", level: 3, initials: "YB" }, { name: "Riley S.", level: 6, initials: "RS" }],
  c6: [{ name: "Sofia R.", level: 6, initials: "SR" }, { name: "Priya S.", level: 3, initials: "PS" }, { name: "You", level: 3, initials: "YB" }],
  c7: [{ name: "Jamie K.", level: 5, initials: "JK" }, { name: "You", level: 3, initials: "YB" }, { name: "Taylor M.", level: 4, initials: "TM" }],
  c8: [{ name: "Riley S.", level: 6, initials: "RS" }, { name: "Camille D.", level: 5, initials: "CD" }, { name: "You", level: 3, initials: "YB" }],
};

export default function CircleDetail() {
  const { id } = useParams<{ id: string }>();
  const { circles } = useCircles();
  const circle = circles.find(c => c.id === id);

  if (!circle) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3">🫂</div>
        <p className="text-white font-bold mb-2">Circle not found</p>
        <Link href="/circles"><span className="text-primary text-sm">← Back to Circles</span></Link>
      </div>
    </div>
  );

  const cat = CAT_CONFIG[circle.category] ?? defaultCatConfig;
  const members = CIRCLE_MEMBERS[id] ?? [];

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-28 pt-14">
      <header className="fixed top-0 left-0 right-0 max-w-sm mx-auto bg-[#0d0d0d]/95 backdrop-blur-xl z-40 px-4 h-14 flex items-center border-b border-white/5">
        <Link href="/circles" className="mr-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/5">
          <ChevronLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-base font-black text-white flex-1 truncate">{circle.name}</h1>
        <span className="text-[10px] font-black text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-full">ADMIN</span>
      </header>

      <div className="p-4 space-y-5">
        {/* Hero */}
        <div className="flex flex-col items-center text-center pt-2">
          <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-3 border border-white/8", cat.color)}>
            {circle.emoji}
          </div>
          <h2 className="text-2xl font-black text-white mb-1">{circle.name}</h2>
          <p className="text-sm text-gray-400 mb-3 max-w-[240px]">{circle.description}</p>
          <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {circle.membersCount} members</span>
            <span>·</span>
            <span className={cn("flex items-center gap-1", circle.isPublic ? "text-emerald-400" : "text-amber-400")}>
              {circle.isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              {circle.isPublic ? "Open Circle" : "Private"}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Members", value: circle.membersCount, icon: Users },
            { label: "Moves",   value: 12,                  icon: Calendar },
            { label: "Rating",  value: "4.8",               icon: Star },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-[#161616] border border-white/5 rounded-xl p-3 text-center">
              <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
              <div className="text-lg font-black text-white">{value}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{label}</div>
            </div>
          ))}
        </div>

        {/* Schedule */}
        <div className="bg-[#161616] border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Repeat className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-black text-white">Schedule</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">{circle.schedule}</p>
              <p className="text-xs text-primary font-bold mt-0.5">Next: {circle.nextMoveTime}</p>
            </div>
            <Link href="/create">
              <Button className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-bold rounded-xl h-9 text-xs px-3">
                <Plus className="w-3.5 h-3.5 mr-1" /> Make a Move
              </Button>
            </Link>
          </div>
        </div>

        {/* Members */}
        <div>
          <h3 className="text-base font-black text-white mb-3">Members</h3>
          <div className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
            {members.map((m, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black", MEMBER_COLORS[i % MEMBER_COLORS.length])}>
                  {m.initials}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white">
                    {m.name}
                    <span className="text-primary ml-1.5 text-xs">Lv {m.level}</span>
                  </div>
                </div>
                {i === 0 && (
                  <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">ADMIN</span>
                )}
              </div>
            ))}
            {circle.membersCount > members.length && (
              <div className="px-4 py-3 text-center text-xs font-bold text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">
                + {circle.membersCount - members.length} more members
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
