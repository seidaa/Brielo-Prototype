import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Search, UserPlus, Check, MessageCircle, Users, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  { id: "s1", name: "Marcus L.",  level: 7, move: "Leg Day at XSport",   initials: "ML", color: "bg-orange-500", sharedMoves: 2 },
  { id: "s2", name: "Priya S.",   level: 3, move: "Sunday Coffee Run",   initials: "PS", color: "bg-pink-500",   sharedMoves: 1 },
  { id: "s3", name: "Jordan K.",  level: 5, move: "Pickup Basketball",   initials: "JK", color: "bg-blue-500",   sharedMoves: 3 },
  { id: "s4", name: "Alex T.",    level: 4, move: "Trivia Night",         initials: "AT", color: "bg-purple-500", sharedMoves: 1 },
  { id: "s5", name: "Sofia R.",   level: 6, move: "Taco Spot in Pilsen", initials: "SR", color: "bg-green-500",  sharedMoves: 1 },
  { id: "s6", name: "Devon A.",   level: 8, move: "Jazz at Green Mill",  initials: "DA", color: "bg-amber-500",  sharedMoves: 1 },
];

const YOUR_FRIENDS = [
  { id: "f1", name: "Jamie K.",  level: 5, status: "Active 2h ago",   initials: "JK", color: "bg-cyan-500",    lastMove: "Study Session"     },
  { id: "f2", name: "Taylor M.", level: 3, status: "Active yesterday", initials: "TM", color: "bg-rose-500",    lastMove: "Coffee Run"         },
  { id: "f3", name: "Riley S.",  level: 6, status: "Making a move now",initials: "RS", color: "bg-emerald-500", lastMove: "Beginner-Friendly Walk" },
];

export default function Friends() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [added, setAdded] = useState<Record<string, boolean>>({});

  const toggleAdd = (id: string) => setAdded(prev => ({ ...prev, [id]: !prev[id] }));

  const filtered = SUGGESTIONS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.move.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-28 pt-14">
      <header className="fixed top-0 left-0 right-0 max-w-sm mx-auto bg-[#0d0d0d]/95 backdrop-blur-xl z-40 px-4 h-14 flex items-center border-b border-white/5">
        <Link href="/profile" className="mr-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/5">
          <ChevronLeft className="w-5 h-5 text-white" />
        </Link>
        <div className="flex-1">
          <h1 className="text-base font-black text-white leading-tight">Friends</h1>
          <p className="text-[10px] text-gray-600">People who show up</p>
        </div>
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
            placeholder="Search by name or move..."
            className="w-full bg-[#1a1a1a] border-white/8 text-white rounded-xl h-11 pl-10 placeholder:text-gray-600 focus-visible:border-primary/40"
          />
        </div>

        {/* Your Friends */}
        {!search && (
          <div className="mb-6">
            <h2 className="text-[11px] font-black text-gray-500 mb-3 uppercase tracking-widest">Your Friends</h2>
            <div className="space-y-2">
              {YOUR_FRIENDS.map(friend => (
                <div key={friend.id} className="flex items-center justify-between bg-[#161616] border border-white/5 p-3 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm", friend.color)}>
                        {friend.initials}
                      </div>
                      {friend.status.includes("now") && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#161616]" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">
                        {friend.name}
                        <span className="text-primary ml-1.5 text-xs font-bold">Lv {friend.level}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1">
                        {friend.status.includes("now") && <Zap className="w-2.5 h-2.5 text-primary" />}
                        {friend.status}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toast({ title: "Coming soon in the prototype." })}
                    aria-label="Message"
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Met at a Move — suggestions */}
        <div>
          <h2 className="text-[11px] font-black text-gray-500 mb-3 uppercase tracking-widest">
            {search ? "Search Results" : "Met at a Move"}
          </h2>
          <p className="text-xs text-gray-600 mb-3 -mt-1">People you've crossed paths with</p>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Search className="w-8 h-8 mb-3 text-gray-600" strokeWidth={1.75} />
              <p className="text-sm font-bold text-white mb-1">No results for "{search}"</p>
              <p className="text-xs text-gray-500">Try a different name or move</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(person => (
                <div key={person.id} className="flex items-center justify-between bg-[#161616] border border-white/5 p-3 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm", person.color)}>
                      {person.initials}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">
                        {person.name}
                        <span className="text-primary ml-1.5 text-xs font-bold">Lv {person.level}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 truncate max-w-[150px]">
                        met at <span className="text-gray-400 font-medium">{person.move}</span>
                        {person.sharedMoves > 1 && <span className="text-primary ml-1">· {person.sharedMoves} moves</span>}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => toggleAdd(person.id)}
                    className={cn(
                      "rounded-full h-8 px-3 text-xs font-bold transition-all",
                      added[person.id]
                        ? "bg-white/5 border border-white/10 text-gray-400"
                        : "bg-primary text-black hover:bg-primary/90 shadow-[0_0_8px_rgba(250,204,21,0.2)]"
                    )}
                  >
                    {added[person.id]
                      ? <><Check className="w-3 h-3 mr-1" /> Added</>
                      : <><UserPlus className="w-3 h-3 mr-1" /> Add to Circle</>
                    }
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lifestyle nudge */}
        {!search && (
          <div className="mt-6 rounded-2xl border border-dashed border-white/8 p-4 text-center">
            <p className="text-sm font-bold text-white mb-1">Do more together.</p>
            <p className="text-xs text-gray-500 mb-3">The more moves you join, the more people you meet.</p>
            <Link href="/discover">
              <span className="text-xs font-bold text-primary">Find a Move →</span>
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
