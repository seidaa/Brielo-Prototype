import { useState, useEffect } from "react";
import { Link } from "wouter";
import { MapPin, Bell, Zap, ChevronRight, Users, ArrowRight, Users2 } from "lucide-react";
import { useRallies, useUser, useCircles, useCirclePersons } from "@/hooks/useRallies";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { CAT_CONFIG, defaultCatConfig, friendsActivity } from "@/data/mockData";
import { cn } from "@/lib/utils";

const TICKER = [
  "Priya S. just joined Sunday Coffee Run",
  "Jordan K. is heading to Pickup Basketball",
  "Marcus L. made a move nearby",
  "Sofia R. just opened a spot — 1 left",
  "Alex T. needs 2 more for Trivia Night",
];

const LOW_PRESSURE_TAGS = ["Low Pressure", "First Timers Welcome", "Beginner Friendly", "Open to New People"];

type FilterType = "all" | "public" | "circle";

export default function Discover() {
  const { rallies, joinRally } = useRallies();
  const { user } = useUser();
  const { circles } = useCircles();
  const { myCircle } = useCirclePersons();

  const [tickerIdx, setTickerIdx] = useState(0);
  const [tickerVisible, setTickerVisible] = useState(true);
  const [joinedId, setJoinedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerVisible(false);
      setTimeout(() => { setTickerIdx(i => (i + 1) % TICKER.length); setTickerVisible(true); }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nowMoves    = rallies.filter(r => r.time === "Now");
  const circleMoves = rallies.filter(r => r.isCircleMove);
  const forYou      = rallies.filter(r =>
    user.interests.length === 0 || user.interests.includes(r.category)
  );
  const lowPressure = rallies.filter(r =>
    r.vibeTags.some(t => LOW_PRESSURE_TAGS.includes(t))
  );

  const circleNames = new Set(myCircle.map(p => p.name));

  const handleJoin = (id: string) => {
    joinRally(id);
    setJoinedId(id);
    setTimeout(() => setJoinedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-28">

      {/* ── Fixed Header ─────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 max-w-sm mx-auto bg-[#0d0d0d]/96 backdrop-blur-xl z-40 border-b border-white/5">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-primary tracking-tight">Brio</h1>
            <button className="flex items-center text-[11px] font-bold text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5 gap-1 active:scale-95 transition-transform">
              <MapPin className="w-3 h-3 text-primary" /> Chicago
            </button>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/5">
              <Bell className="w-4 h-4 text-gray-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0d0d0d]" />
            </button>
            <Link href="/profile">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-orange-500 p-[2px] cursor-pointer">
                <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center text-[11px] font-black text-white">YB</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Live ticker */}
        <div className="px-4 py-1.5 flex items-center gap-2 border-t border-white/5 bg-black/10">
          <span className="flex items-center gap-1 text-[10px] font-black text-primary shrink-0 uppercase tracking-wider">
            <Zap className="w-3 h-3 fill-primary" /> Live
          </span>
          <p className={cn("text-[11px] text-gray-400 truncate transition-opacity duration-300", tickerVisible ? "opacity-100" : "opacity-0")}>
            {TICKER[tickerIdx]}
          </p>
        </div>
      </header>

      {/* ── Scrollable Content ──────────────────────────────────────── */}
      <div className="pt-[86px]">

        {/* ── Greeting + Make a Move CTA ───────────────────────────── */}
        <div className="px-4 pt-5 pb-4">
          <p className="text-sm text-gray-500 mb-0.5">Good afternoon ☀️</p>
          <h2 className="text-2xl font-black text-white mb-4">What's the move?</h2>

          <Link href="/create">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-amber-500/10 to-orange-500/5 border border-primary/25 p-4 active:scale-[0.98] transition-transform cursor-pointer">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Zap className="w-4 h-4 text-primary fill-primary/30" />
                    <span className="text-xs font-black text-primary uppercase tracking-wider">Make a Move</span>
                  </div>
                  <p className="text-white font-bold text-sm leading-snug mb-3">
                    Post something you're down to do — see who's in.
                  </p>
                  <div className="inline-flex items-center gap-1.5 bg-primary text-black font-black text-sm px-4 py-2 rounded-xl shadow-[0_0_16px_rgba(250,204,21,0.4)]">
                    Post Move <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* ── Filter row ───────────────────────────────────────────── */}
        <div className="flex gap-2 px-4 mb-5 overflow-x-auto no-scrollbar">
          {([
            { id: "all"    as FilterType, label: "All Moves",         icon: null },
            { id: "public" as FilterType, label: "Public",            icon: null },
            { id: "circle" as FilterType, label: "From Your Circle",  icon: "🫂"  },
          ]).map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all",
                filter === f.id
                  ? "bg-primary text-black border-primary shadow-[0_0_8px_rgba(250,204,21,0.25)]"
                  : "bg-white/5 text-gray-400 border-white/5"
              )}
            >
              {f.icon && <span className="text-sm">{f.icon}</span>}
              {f.label}
            </button>
          ))}
        </div>

        {/* ── A: Live Moves Nearby ─────────────────────────────────── */}
        {(filter === "all" || filter === "public") && (
          <section className="mb-6">
            <div className="flex items-center justify-between px-4 mb-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  Live Moves Nearby
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative rounded-full h-2 w-2 bg-red-500" />
                  </span>
                </h3>
                <p className="text-[11px] text-gray-500">{nowMoves.length} happening right now</p>
              </div>
              <Link href="/map">
                <span className="text-[11px] font-bold text-primary flex items-center gap-1">Map <ChevronRight className="w-3 h-3" /></span>
              </Link>
            </div>

            {nowMoves.length === 0 ? (
              <div className="mx-4 bg-[#161616] border border-white/5 rounded-2xl p-5 text-center">
                <p className="text-sm text-gray-500">Nothing live right now.</p>
                <Link href="/create"><span className="text-xs font-bold text-primary mt-1 block">Be the first →</span></Link>
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto px-4 pb-1 no-scrollbar">
                {nowMoves.map(move => {
                  const cat = CAT_CONFIG[move.category] ?? defaultCatConfig;
                  const spotsLeft = move.maxSpots - move.going;
                  const fromCircle = move.isCircleMove && circleNames.has(move.hostName);
                  return (
                    <Link key={move.id} href={`/rally/${move.id}`}>
                      <div className="shrink-0 w-44 bg-[#181818] border border-white/8 rounded-2xl p-3.5 active:scale-[0.97] transition-transform cursor-pointer relative overflow-hidden">
                        {fromCircle && (
                          <div className="absolute top-2 right-2 bg-primary/15 border border-primary/25 text-primary text-[9px] font-black px-1.5 py-0.5 rounded-full">Circle</div>
                        )}
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2.5", cat.color)}>
                          {cat.emoji}
                        </div>
                        <p className="text-sm font-bold text-white leading-snug line-clamp-2 mb-2">{move.title}</p>
                        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-2.5">
                          <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {move.distance}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {move.going}</span>
                        </div>
                        <button
                          onClick={e => { e.preventDefault(); handleJoin(move.id); }}
                          className={cn(
                            "w-full text-[11px] font-black rounded-lg py-1.5 transition-all",
                            move.joined || joinedId === move.id
                              ? "bg-white/8 text-gray-400 border border-white/8"
                              : spotsLeft <= 0
                              ? "bg-white/5 text-gray-600"
                              : "bg-primary text-black shadow-[0_0_8px_rgba(250,204,21,0.3)]"
                          )}
                        >
                          {move.joined || joinedId === move.id ? "You're In ✓" : spotsLeft <= 0 ? "Full" : "I'm In"}
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ── B: Moves from your Circle ────────────────────────────── */}
        {(filter === "all" || filter === "circle") && circleMoves.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center justify-between px-4 mb-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Users2 className="w-4 h-4 text-primary" /> Moves from your Circle
                </h3>
                <p className="text-[11px] text-gray-500">People you've moved with before</p>
              </div>
              <Link href="/circles">
                <span className="text-[11px] font-bold text-primary flex items-center gap-1">Circle <ChevronRight className="w-3 h-3" /></span>
              </Link>
            </div>
            <div className="px-4 space-y-2.5">
              {circleMoves.slice(0, 3).map(move => (
                <MoveCard key={move.id} move={move} onJoin={handleJoin} highlight={joinedId === move.id} circleLabel />
              ))}
            </div>
          </section>
        )}

        {/* ── C: Moves For You ─────────────────────────────────────── */}
        {filter !== "circle" && (
          <section className="mb-6">
            <div className="flex items-center justify-between px-4 mb-3">
              <h3 className="text-base font-black text-white">Moves For You</h3>
              <span className="text-[11px] text-gray-600">{forYou.length} picks</span>
            </div>
            <div className="px-4 space-y-2.5">
              {forYou.slice(0, 5).map(move => (
                <MoveCard key={move.id} move={move} onJoin={handleJoin} highlight={joinedId === move.id} />
              ))}
            </div>
          </section>
        )}

        {/* ── D: Circles Near You ──────────────────────────────────── */}
        {filter !== "circle" && (
          <section className="mb-6">
            <div className="flex items-center justify-between px-4 mb-3">
              <div>
                <h3 className="text-base font-black text-white">Circles Near You</h3>
                <p className="text-[11px] text-gray-500">Recurring groups that meet regularly</p>
              </div>
              <Link href="/circles">
                <span className="text-[11px] font-bold text-primary flex items-center gap-1">All <ChevronRight className="w-3 h-3" /></span>
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto px-4 pb-1 no-scrollbar">
              {circles.slice(0, 6).map(circle => {
                const cat = CAT_CONFIG[circle.category] ?? defaultCatConfig;
                return (
                  <Link key={circle.id} href={`/circles/${circle.id}`}>
                    <div className="shrink-0 w-36 bg-[#161616] border border-white/5 rounded-2xl p-3 active:scale-[0.97] transition-transform cursor-pointer">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2", cat.color)}>
                        {circle.emoji}
                      </div>
                      <p className="text-xs font-bold text-white leading-snug mb-1 line-clamp-2">{circle.name}</p>
                      <p className="text-[10px] text-gray-600 flex items-center gap-1 mb-2">
                        <Users className="w-3 h-3" /> {circle.membersCount}
                      </p>
                      <p className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full text-center", cat.color, cat.text)}>
                        {circle.schedule.split(" ").slice(0, 2).join(" ")}
                      </p>
                    </div>
                  </Link>
                );
              })}
              <Link href="/circles">
                <div className="shrink-0 w-36 border border-dashed border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 active:scale-[0.97] transition-transform cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl">🫂</div>
                  <p className="text-[11px] font-bold text-gray-400 text-center">View all circles</p>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* ── E: Low-Pressure Picks ────────────────────────────────── */}
        {filter !== "circle" && lowPressure.length > 0 && (
          <section className="mb-6">
            <div className="px-4 mb-3">
              <h3 className="text-base font-black text-white">Low-Pressure Picks</h3>
              <p className="text-[11px] text-gray-500">First timers welcome · no expectations</p>
            </div>
            <div className="px-4 space-y-2.5">
              {lowPressure.slice(0, 3).map(move => (
                <MoveCard key={move.id} move={move} onJoin={handleJoin} highlight={joinedId === move.id} />
              ))}
            </div>
          </section>
        )}

        {/* ── Brio Livestreams teaser ───────────────────────────────── */}
        {filter === "all" && (
          <div className="mx-4 mb-6 rounded-2xl border border-white/8 bg-gradient-to-br from-[#1a1a1a] to-[#111] p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 pointer-events-none" />
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center text-lg shrink-0">📡</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-white text-sm">Brio Livestreams</span>
                  <span className="text-[9px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/25 px-2 py-0.5 rounded-full uppercase tracking-wider">Coming Soon</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Preview the vibe before you pull up. Live moments from Moves and Circles — before you join.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Friends Activity ─────────────────────────────────────── */}
        {filter === "all" && (
          <section className="mb-4">
            <div className="px-4 mb-3">
              <h3 className="text-base font-black text-white">Circle Activity</h3>
              <p className="text-[11px] text-gray-500">People you've moved with before</p>
            </div>
            <div className="px-4 space-y-2">
              {friendsActivity.map((fa, i) => (
                <Link key={i} href={`/rally/${fa.moveId}`}>
                  <div className="flex items-center gap-3 bg-white/3 border border-white/5 rounded-2xl px-4 py-3 active:scale-[0.99] transition-transform">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {fa.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white leading-snug">
                        <span className="font-bold">{fa.name}</span>
                        <span className="text-gray-400"> {fa.action} </span>
                        <span className="font-semibold text-primary">{fa.moveTitle}</span>
                      </p>
                      <p className="text-[11px] text-gray-600">{fa.time}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty state for circle filter with no moves */}
        {filter === "circle" && circleMoves.length === 0 && (
          <div className="mx-4 flex flex-col items-center text-center py-16 gap-3">
            <div className="text-4xl">🫂</div>
            <p className="font-black text-white">No Circle Moves yet</p>
            <p className="text-sm text-gray-500 max-w-[220px]">
              Once you add people to your Circle, their Moves will show up here.
            </p>
            <Link href="/circles">
              <span className="text-sm font-bold text-primary">Build your Circle →</span>
            </Link>
          </div>
        )}

      </div>

      <BottomNav />
    </div>
  );
}

// ── Inline Move Card ──────────────────────────────────────────────────────────
function MoveCard({ move, onJoin, highlight, circleLabel }: {
  move: { id: string; title: string; category: string; time: string; distance: string; going: number; maxSpots: number; hostName: string; hostLevel: number; vibeTags: string[]; requiresApproval: boolean; joined: boolean };
  onJoin: (id: string) => void;
  highlight: boolean;
  circleLabel?: boolean;
}) {
  const cat = CAT_CONFIG[move.category] ?? defaultCatConfig;
  const spotsLeft = move.maxSpots - move.going;
  const isFull = spotsLeft <= 0;
  const isJoined = move.joined || highlight;

  return (
    <div className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden active:scale-[0.99] transition-transform">
      <Link href={`/rally/${move.id}`} className="block p-4 pb-3">
        <div className="flex items-start gap-3">
          <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0", cat.color)}>
            {cat.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">{move.title}</h4>
              <div className="flex items-center gap-1.5 shrink-0">
                {circleLabel && (
                  <span className="text-[9px] font-black bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.5 rounded-full">Circle</span>
                )}
                <span className="text-[10px] text-gray-600 mt-0.5">{move.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-gray-500">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{move.distance}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{move.going} in</span>
              <span className={cn("font-bold", isFull ? "text-red-400" : spotsLeft <= 2 ? "text-amber-400" : "text-gray-500")}>
                {isFull ? "Full" : `${spotsLeft} left`}
              </span>
            </div>
          </div>
        </div>
        {move.vibeTags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-2.5">
            {move.vibeTags.slice(0, 3).map(t => (
              <span key={t} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white/5 text-gray-500 rounded-md border border-white/5">{t}</span>
            ))}
          </div>
        )}
      </Link>
      <div className="px-4 pb-3.5 flex gap-2">
        <button
          onClick={() => onJoin(move.id)}
          disabled={isFull || isJoined}
          className={cn(
            "flex-1 font-bold text-sm rounded-xl py-2 transition-all",
            isJoined ? "bg-white/5 text-gray-400 border border-white/8"
            : isFull  ? "bg-white/3 text-gray-600 cursor-not-allowed"
            : "bg-primary text-black shadow-[0_0_10px_rgba(250,204,21,0.2)] active:scale-95"
          )}
        >
          {isJoined ? "You're In ✓" : isFull ? "Move is Full" : move.requiresApproval ? "Request to Join" : "I'm In"}
        </button>
        <Link href={`/rally/${move.id}`}>
          <button className="px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-[11px] font-bold text-gray-400 hover:text-gray-200 transition-colors">
            Ask Host
          </button>
        </Link>
      </div>
    </div>
  );
}
