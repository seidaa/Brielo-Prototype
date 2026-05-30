import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Users, Check, ChevronRight, Plus, UserPlus, Repeat, Globe, Lock, Calendar } from "lucide-react";
import { useCirclePersons, useCircles } from "@/hooks/useRallies";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { CAT_CONFIG, defaultCatConfig, CirclePerson } from "@/data/mockData";
import { cn } from "@/lib/utils";

type TabType = "my-circle" | "groups";

export default function Circles() {
  const [tab, setTab] = useState<TabType>("my-circle");
  const { myCircle, wouldMoveAgain, recentConnections, addToCircle, markWouldMoveAgain } = useCirclePersons();
  const { circles } = useCircles();

  const totalCircle = myCircle.length;

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-28 pt-14">
      <header className="fixed top-0 left-0 right-0 max-w-sm mx-auto bg-[#0d0d0d]/95 backdrop-blur-xl z-40 px-4 h-14 flex items-center border-b border-white/5">
        <Link href="/profile" className="mr-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/5">
          <ChevronLeft className="w-5 h-5 text-white" />
        </Link>
        <div className="flex-1">
          <h1 className="text-base font-black text-white leading-tight">Circles</h1>
          <p className="text-[10px] text-gray-600">Your trusted Brio people</p>
        </div>
        <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
          <Users className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-bold text-primary">{totalCircle}</span>
        </div>
      </header>

      <div className="px-4 pt-3">

        {/* Tab toggle */}
        <div className="flex bg-white/5 rounded-xl p-1 mb-5 border border-white/5">
          {([
            { id: "my-circle" as TabType, label: "My Circle" },
            { id: "groups"    as TabType, label: "Group Circles" },
          ]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                tab === t.id ? "bg-primary text-black shadow-[0_0_8px_rgba(250,204,21,0.25)]" : "text-gray-500"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── My Circle tab ────────────────────────────────────────── */}
        {tab === "my-circle" && (
          <div className="space-y-6">

            {/* What is a Circle? */}
            <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4">
              <p className="text-sm font-bold text-white mb-1">Your Circle = your people.</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                People you've moved with, would move with again, or trust enough to keep in your orbit. Circles are private.
              </p>
            </div>

            {/* Section 1: My Circle */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[11px] font-black text-gray-500 uppercase tracking-widest">My Circle</h2>
                <span className="text-xs text-primary font-bold">{myCircle.length} people</span>
              </div>
              {myCircle.length === 0 ? (
                <div className="text-center py-8 text-gray-600 text-sm">
                  <div className="text-3xl mb-2">🫂</div>
                  <p>Add people after a Move to build your Circle.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {myCircle.map(p => (
                    <PersonCard key={p.id} person={p} variant="in-circle" />
                  ))}
                </div>
              )}
            </section>

            {/* Section 2: Would Move Again */}
            {wouldMoveAgain.length > 0 && (
              <section>
                <div className="mb-3">
                  <h2 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Would Move With Again</h2>
                  <p className="text-[11px] text-gray-600">People you gave positive feedback after a Move</p>
                </div>
                <div className="space-y-2">
                  {wouldMoveAgain.map(p => (
                    <PersonCard key={p.id} person={p} variant="would-again" onAdd={() => addToCircle(p.id)} />
                  ))}
                </div>
              </section>
            )}

            {/* Section 3: Recent Move Connections */}
            {recentConnections.length > 0 && (
              <section>
                <div className="mb-3">
                  <h2 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Recent Move Connections</h2>
                  <p className="text-[11px] text-gray-600">People from recent Moves you can add</p>
                </div>
                <div className="space-y-2">
                  {recentConnections.map(p => (
                    <PersonCard
                      key={p.id}
                      person={p}
                      variant="recent"
                      onAdd={() => addToCircle(p.id)}
                      onWouldMoveAgain={() => markWouldMoveAgain(p.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Nudge */}
            <div className="rounded-2xl border border-dashed border-white/8 p-4 text-center">
              <p className="text-sm font-bold text-white mb-1">Build your Circle move by move.</p>
              <p className="text-xs text-gray-500 mb-3">After every Move, you can add people who showed up.</p>
              <Link href="/discover">
                <span className="text-xs font-bold text-primary">Find a Move →</span>
              </Link>
            </div>
          </div>
        )}

        {/* ── Group Circles tab ────────────────────────────────────── */}
        {tab === "groups" && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500 leading-relaxed mb-2">
              Recurring groups built around shared interests. Open to anyone nearby.
            </p>
            {circles.map(circle => {
              const cat = CAT_CONFIG[circle.category] ?? defaultCatConfig;
              return (
                <Link key={circle.id} href={`/circles/${circle.id}`}>
                  <div className="bg-[#161616] rounded-2xl border border-white/5 hover:border-white/10 transition-all active:scale-[0.99] overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start gap-3.5">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0", cat.color)}>
                          {circle.emoji}
                        </div>
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
                          <p className="text-[11px] text-gray-500 mb-2 line-clamp-1">{circle.description}</p>
                          <div className="flex items-center gap-3 text-[11px] text-gray-500">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {circle.membersCount}</span>
                            <span className="flex items-center gap-1 text-primary font-bold"><Calendar className="w-3 h-3" /> {circle.nextMoveTime}</span>
                            <span className="flex items-center gap-1"><Repeat className="w-3 h-3" /> {circle.schedule.split(" ").slice(0, 2).join(" ")}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 shrink-0 mt-1" />
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <Button className="w-full h-9 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-bold rounded-xl text-xs">
                          {circle.isPublic ? "Join Circle" : "View Circle"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Create CTA */}
            <div className="rounded-2xl border border-dashed border-white/10 p-5 flex flex-col items-center text-center gap-3 mt-2">
              <div className="text-3xl">🫂</div>
              <div>
                <p className="text-sm font-bold text-white mb-1">Start a new group circle</p>
                <p className="text-xs text-gray-500">Create a recurring group around something you love doing.</p>
              </div>
              <Button className="bg-white/8 hover:bg-white/12 border border-white/10 text-white font-bold rounded-xl px-5 h-9 text-sm">
                <Plus className="w-4 h-4 mr-1.5" /> Create Circle
              </Button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

// ── Person card sub-component ─────────────────────────────────────────────────
function PersonCard({
  person, variant, onAdd, onWouldMoveAgain,
}: {
  person: CirclePerson;
  variant: "in-circle" | "would-again" | "recent";
  onAdd?: () => void;
  onWouldMoveAgain?: () => void;
}) {
  const [added, setAdded] = useState(person.inCircle);
  const [markedWould, setMarkedWould] = useState(!!person.wouldMoveAgain);

  const handleAdd = () => { setAdded(true); onAdd?.(); };
  const handleWould = () => { setMarkedWould(true); onWouldMoveAgain?.(); };

  return (
    <div className="bg-[#161616] border border-white/5 rounded-2xl p-3.5">
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0", person.color)}>
          {person.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white text-sm">
            {person.name}
            <span className="text-primary ml-1.5 text-xs font-bold">Lv {person.level}</span>
          </div>
          <div className="text-[11px] text-gray-500 truncate">
            <Link href={`/rally/${person.lastMoveId}`}>
              <span className="hover:text-gray-300 transition-colors">met at <span className="text-gray-400">{person.lastMove}</span></span>
            </Link>
            {person.mutualMoves > 1 && <span className="text-primary ml-1">· {person.mutualMoves} moves</span>}
          </div>
        </div>
        {variant === "in-circle" && (
          <div className="flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
            <Check className="w-3 h-3" /> Circle
          </div>
        )}
        {(variant === "would-again" || variant === "recent") && (
          <div className="flex flex-col gap-1.5 shrink-0">
            {!added ? (
              <button
                onClick={handleAdd}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-primary/10 border border-primary/25 text-primary text-[11px] font-bold hover:bg-primary/20 transition-colors"
              >
                <UserPlus className="w-3 h-3" /> Add to Circle
              </button>
            ) : (
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold">
                <Check className="w-3 h-3" /> In Circle
              </div>
            )}
            {variant === "recent" && !markedWould && !added && (
              <button
                onClick={handleWould}
                className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/8 text-gray-400 text-[11px] font-bold hover:text-gray-200 transition-colors text-center"
              >
                Would again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
