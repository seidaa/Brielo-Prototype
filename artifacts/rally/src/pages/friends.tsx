import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Search, UserPlus, Check, MessageCircle, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  { id: "s1", name: "Marcus L.",  level: 7, rally: "Leg Day at XSport",    initials: "ML", color: "bg-orange-500" },
  { id: "s2", name: "Priya S.",   level: 3, rally: "Sunday Coffee Run",    initials: "PS", color: "bg-pink-500" },
  { id: "s3", name: "Jordan K.",  level: 5, rally: "Pickup Basketball",    initials: "JK", color: "bg-blue-500" },
  { id: "s4", name: "Alex T.",    level: 4, rally: "Trivia Night",         initials: "AT", color: "bg-purple-500" },
  { id: "s5", name: "Sofia R.",   level: 6, rally: "Taco Spot in Pilsen",  initials: "SR", color: "bg-green-500" },
  { id: "s6", name: "Devon A.",   level: 8, rally: "Jazz at Green Mill",   initials: "DA", color: "bg-amber-500" },
];

const YOUR_FRIENDS = [
  { id: "f1", name: "Jamie K.",    level: 5, status: "Active 2h ago",  initials: "JK", color: "bg-cyan-500" },
  { id: "f2", name: "Taylor M.",   level: 3, status: "Active yesterday",initials: "TM", color: "bg-rose-500" },
  { id: "f3", name: "Riley S.",    level: 6, status: "Active now",      initials: "RS", color: "bg-emerald-500" },
];

export default function Friends() {
  const [search, setSearch] = useState("");
  const [added, setAdded] = useState<Record<string, boolean>>({});

  const toggleAdd = (id: string) => {
    setAdded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = SUGGESTIONS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.rally.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-28 pt-14">
      <header className="fixed top-0 left-0 right-0 max-w-sm mx-auto bg-[#0d0d0d]/95 backdrop-blur-xl z-40 px-4 h-14 flex items-center border-b border-white/5">
        <Link href="/profile" className="mr-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/5">
          <ChevronLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-lg font-black text-white flex-1">Friends</h1>
        <div className="flex items-center gap-1 bg-white/5 border border-white/5 px-2.5 py-1 rounded-full">
          <Users className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-bold text-gray-300">{YOUR_FRIENDS.length}</span>
        </div>
      </header>

      <div className="p-4">
        {/* Search */}
        <div className="relative mb-5">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or rally..."
            className="w-full bg-[#1a1a1a] border-white/8 text-white rounded-xl h-11 pl-10 placeholder:text-gray-600 focus-visible:border-primary/40"
          />
        </div>

        {/* Your Friends */}
        <div className="mb-6">
          <h2 className="text-[11px] font-black text-gray-500 mb-3 uppercase tracking-widest">Your Friends</h2>
          <div className="space-y-2">
            {YOUR_FRIENDS.map(friend => (
              <div key={friend.id} className="flex items-center justify-between bg-[#1a1a1a] border border-white/5 p-3 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm", friend.color)}>
                    {friend.initials}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">
                      {friend.name}
                      <span className="text-primary ml-1.5 text-xs font-bold">Lv {friend.level}</span>
                    </div>
                    <div className="text-[11px] text-gray-500">{friend.status}</div>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div>
          <h2 className="text-[11px] font-black text-gray-500 mb-3 uppercase tracking-widest">
            {search ? "Search Results" : "Met at Recent Rallies"}
          </h2>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="text-3xl mb-3">🔍</div>
              <p className="text-sm font-bold text-white mb-1">No results for "{search}"</p>
              <p className="text-xs text-gray-500">Try searching by a different name</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(user => (
                <div key={user.id} className="flex items-center justify-between bg-[#1a1a1a] border border-white/5 p-3 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm", user.color)}>
                      {user.initials}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">
                        {user.name}
                        <span className="text-primary ml-1.5 text-xs font-bold">Lv {user.level}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 truncate max-w-[140px]">
                        met at {user.rally}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => toggleAdd(user.id)}
                    className={cn(
                      "rounded-full h-8 px-3 text-xs font-bold transition-all",
                      added[user.id]
                        ? "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/8"
                        : "bg-primary text-black hover:bg-primary/90 shadow-[0_0_8px_rgba(250,204,21,0.2)]"
                    )}
                  >
                    {added[user.id]
                      ? <><Check className="w-3 h-3 mr-1" /> Pending</>
                      : <><UserPlus className="w-3 h-3 mr-1" /> Add</>
                    }
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
