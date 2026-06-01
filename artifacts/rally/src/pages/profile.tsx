import { useState } from "react";
import { Link } from "wouter";
import {
  Settings, Award, Users, ChevronRight, Lock, CheckCircle2, Zap, Star,
  History, ChevronDown, ChevronUp, Repeat, UsersRound, Calendar,
  RefreshCw, Sparkles, UserX, Minus, ShieldCheck, Info, Pencil,
  Dumbbell, Coffee, Utensils, BookOpen, Trophy, Music, Leaf, Mic2,
  Gamepad2, Handshake, Palette, CheckCheck, Footprints,
} from "lucide-react";
import { useUser, useRallies, useActivityHistory } from "@/hooks/useRallies";
import { BottomNav } from "@/components/BottomNav";
import { TrustChip, WarningChip } from "@/components/TrustLabel";
import { TrustInfoModal } from "@/components/TrustInfoModal";
import { Button } from "@/components/ui/button";
import { CAT_CONFIG, defaultCatConfig, FeedbackLabel } from "@/data/mockData";
import { formatShowUpRate, RECOVERY_COPY } from "@/lib/trust";
import { cn } from "@/lib/utils";

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

const PERKS = [
  { level: 1,  title: "Early Mover",        desc: "You were here from the start",            unlocked: true  },
  { level: 2,  title: "Shows Up",           desc: "Attended 3+ moves",                        unlocked: true  },
  { level: 3,  title: "Reliable Host",      desc: "Host up to 8 people per move",             unlocked: true  },
  { level: 5,  title: "Live Nearby Access", desc: "See private moves near you",               unlocked: false },
  { level: 7,  title: "Local Mover",        desc: "Expand your Circle",                       unlocked: false },
  { level: 10, title: "City Legend",        desc: "Custom profile badge + city features",     unlocked: false },
];

type FeedbackOpt = { label: FeedbackLabel; Icon: React.ElementType; color: string };
const FEEDBACK_OPTIONS: FeedbackOpt[] = [
  { label: "Good vibes",    Icon: Sparkles,   color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" },
  { label: "Would do again",Icon: RefreshCw,  color: "bg-blue-500/15 text-blue-400 border-blue-500/25" },
  { label: "No-show",       Icon: UserX,      color: "bg-gray-500/15 text-gray-400 border-gray-500/25" },
  { label: "Felt off",      Icon: Minus,      color: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
];

const TAG_STYLES: Record<string, string> = {
  "Hosted":       "bg-primary/15 text-primary border-primary/25",
  "Attended":     "bg-white/8 text-gray-400 border-white/10",
  "Weekly":       "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "Circle Move":  "bg-purple-500/15 text-purple-400 border-purple-500/25",
};

const TAG_ICONS: Record<string, React.ElementType> = {
  "Weekly":      Repeat,
  "Circle Move": UsersRound,
};

function FeedbackPicker({ current, onSelect }: { current?: FeedbackLabel; onSelect: (f: FeedbackLabel) => void }) {
  const [open, setOpen] = useState(false);
  const selected = FEEDBACK_OPTIONS.find(f => f.label === current);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all",
          selected ? selected.color : "bg-white/3 text-gray-600 border-white/8 hover:border-white/15 hover:text-gray-400"
        )}
      >
        {selected
          ? <><selected.Icon className="w-3 h-3" strokeWidth={2} /> {selected.label}</>
          : <>+ Rate it</>
        }
      </button>
      {open && (
        <div className="absolute bottom-full mb-2 right-0 bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 min-w-[160px]">
          {FEEDBACK_OPTIONS.map(opt => (
            <button
              key={opt.label}
              onClick={() => { onSelect(opt.label); setOpen(false); }}
              className={cn("w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-xs font-bold transition-colors hover:bg-white/5", current === opt.label ? "text-white" : "text-gray-400")}
            >
              <opt.Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
              {opt.label}
              {current === opt.label && <span className="ml-auto text-primary text-[10px]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  const { user, setMissNote } = useUser();
  const { rallies } = useRallies();
  const { history, setFeedback, attendedCount, hostedCount, circleCount } = useActivityHistory();
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [trustInfoOpen, setTrustInfoOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState(user.missNote ?? "");

  const joinedMoves = rallies.filter(r => r.joined);
  const progress = Math.min(100, (user.xp / user.xpToNext) * 100);
  const visibleHistory = showAllHistory ? history : history.slice(0, 4);

  const STATS_GRID = [
    { label: "Attended", value: attendedCount, Icon: Users       },
    { label: "Hosted",   value: hostedCount,   Icon: Star        },
    { label: "Circle",   value: circleCount,   Icon: UsersRound  },
    { label: "Level",    value: user.level,    Icon: Zap         },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-28">

      {/* ── Header / identity ──────────────────────────────────────── */}
      <div className="px-4 pt-12 pb-5 border-b border-white/5">
        <div className="flex items-start justify-between mb-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-orange-500 p-[2.5px]">
            <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center border-2 border-[#0d0d0d]">
              <span className="text-xl font-black text-white">YB</span>
            </div>
          </div>
          <button className="w-9 h-9 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-gray-400">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <h1 className="text-2xl font-black text-white mb-1">@{user.username}</h1>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 bg-primary/15 text-primary rounded-full text-[11px] font-black uppercase tracking-wider border border-primary/20">
            Level {user.level}
          </span>
          <span className="text-sm font-bold text-gray-500">Making Moves</span>
        </div>
        <p className="text-sm text-gray-400 mb-4 leading-relaxed">{user.bio}</p>

        <div className="flex gap-6">
          {[
            { label: "Moves",   value: user.rallyCount  },
            { label: "Hosted",  value: user.hostedCount },
            { label: "Circle",  value: user.friendsCount, href: "/circles" },
          ].map(stat => (
            stat.href
              ? <Link key={stat.label} href={stat.href} className="text-center group">
                  <div className="font-black text-white text-xl group-hover:text-primary transition-colors">{stat.value}</div>
                  <div className="text-[10px] uppercase font-bold text-gray-600 tracking-wider">{stat.label}</div>
                </Link>
              : <div key={stat.label} className="text-center">
                  <div className="font-black text-white text-xl">{stat.value}</div>
                  <div className="text-[10px] uppercase font-bold text-gray-600 tracking-wider">{stat.label}</div>
                </div>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-5 pt-5">

        {/* ── XP Bar ─────────────────────────────────────────────────── */}
        <div className="bg-[#161616] rounded-2xl p-4 border border-white/5">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5 text-white">
              <Zap className="w-3.5 h-3.5 text-primary fill-primary" /> {user.xp} XP
            </span>
            <span className="text-gray-500">{user.xpToNext - user.xp} XP to Level {user.level + 1}</span>
          </div>
          <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-gray-600 mt-1.5 font-medium">
            <span>Lv {user.level}</span><span>Lv {user.level + 1}</span>
          </div>
        </div>

        {/* ── Show-Up Trust ──────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Show-Up Trust
            </h3>
            <button
              onClick={() => setTrustInfoOpen(true)}
              className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-primary transition-colors"
            >
              <Info className="w-3 h-3" /> How trust works
            </button>
          </div>

          <div className="bg-[#161616] border border-white/5 rounded-2xl p-4">
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <TrustChip label={user.trustLabel} />
              {user.warningLabel && <WarningChip label={user.warningLabel} />}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-xl font-black text-white leading-none">{formatShowUpRate(user.showUpRate)}</div>
                <div className="text-[9px] font-bold text-gray-600 uppercase tracking-wider mt-1">Show-Up Rate</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-white leading-none">{user.movesAttended}</div>
                <div className="text-[9px] font-bold text-gray-600 uppercase tracking-wider mt-1">Showed Up</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-white leading-none">{user.movesMissed}</div>
                <div className="text-[9px] font-bold text-gray-600 uppercase tracking-wider mt-1">Missed</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-[12px] text-gray-400 leading-relaxed">
                {user.warningLabel
                  ? RECOVERY_COPY.rebuilding
                  : user.movesMissed > 0
                  ? RECOVERY_COPY.oneMiss
                  : RECOVERY_COPY.good}
              </p>
            </div>

            {/* Self note for a recent miss */}
            <div className="mt-3">
              {!noteOpen && !user.missNote && (
                <button
                  onClick={() => setNoteOpen(true)}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-primary transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Add context to a recent miss
                </button>
              )}
              {(noteOpen || user.missNote) && (
                <div className="bg-black/20 border border-white/5 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Your note</p>
                  {noteOpen ? (
                    <>
                      <textarea
                        value={noteDraft}
                        onChange={e => setNoteDraft(e.target.value)}
                        placeholder="Life happens. Add a quick note about a recent miss — just for you."
                        className="w-full bg-transparent text-sm text-gray-200 placeholder:text-gray-600 resize-none outline-none min-h-[48px]"
                      />
                      <div className="flex gap-2 mt-2">
                        <Button
                          onClick={() => { setMissNote(noteDraft); setNoteOpen(false); }}
                          className="h-8 px-3 bg-primary hover:bg-primary/90 text-black font-bold rounded-lg text-xs"
                        >
                          Save note
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => { setNoteDraft(user.missNote ?? ""); setNoteOpen(false); }}
                          className="h-8 px-3 bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 rounded-lg text-xs font-bold"
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-300 leading-relaxed">{user.missNote}</p>
                      <button
                        onClick={() => { setNoteDraft(user.missNote ?? ""); setNoteOpen(true); }}
                        className="text-gray-500 hover:text-primary shrink-0"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Badges ─────────────────────────────────────────────────── */}
        {user.badges.length > 0 && (
          <div>
            <h3 className="text-[11px] font-black text-gray-500 mb-2.5 uppercase tracking-widest">Badges</h3>
            <div className="flex gap-2 flex-wrap">
              {user.badges.map(badge => (
                <span key={badge} className="flex items-center gap-1.5 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full text-xs font-bold text-gray-300">
                  <Award className="w-3.5 h-3.5 text-primary" /> {badge}
                </span>
              ))}
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full text-xs font-bold text-gray-300">
                <Star className="w-3.5 h-3.5 text-amber-400" /> 5 Moves
              </span>
            </div>
          </div>
        )}

        {/* ── Active Moves ───────────────────────────────────────────── */}
        {joinedMoves.length > 0 && (
          <div>
            <h3 className="text-[11px] font-black text-gray-500 mb-2.5 uppercase tracking-widest">Active Moves</h3>
            <div className="space-y-2">
              {joinedMoves.map(move => {
                const cat = CAT_CONFIG[move.category] ?? defaultCatConfig;
                const CatIcon = CAT_ICONS[move.category];
                return (
                  <Link key={move.id} href={`/rally/${move.id}`}>
                    <div className="flex items-center gap-3 bg-[#161616] border border-white/5 p-3 rounded-2xl active:scale-[0.99] transition-all">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", cat.color)}>
                        {CatIcon
                          ? <CatIcon className={cat.text} strokeWidth={1.75} style={{ width: 18, height: 18 }} />
                          : <span className="text-lg">{cat.emoji}</span>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{move.title}</p>
                        <p className="text-[11px] text-gray-500">{move.time} · {move.location}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-700 shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Quick Links ─────────────────────────────────────────────── */}
        <div className="space-y-2">
          <Link href="/circles">
            <div className="bg-[#161616] rounded-2xl p-4 border border-white/5 flex items-center justify-between group active:scale-[0.99] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                  <UsersRound className="w-4.5 h-4.5 text-gray-400" style={{ width: 18, height: 18 }} strokeWidth={1.75} />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Your Circle</div>
                  <div className="text-[11px] text-gray-500">{user.friendsCount} people in your Circle</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors" />
            </div>
          </Link>

          <Link href="/friends">
            <div className="bg-[#161616] rounded-2xl p-4 border border-white/5 flex items-center justify-between group active:scale-[0.99] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                  <Users className="w-4.5 h-4.5 text-gray-400" style={{ width: 18, height: 18 }} strokeWidth={1.75} />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">People</div>
                  <div className="text-[11px] text-gray-500">{user.friendsCount} connections</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors" />
            </div>
          </Link>
        </div>

        {/* ── Activity History ────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" /> Activity History
            </h3>
            <span className="text-[10px] font-bold text-gray-600">{history.length} total</span>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {STATS_GRID.map(({ label, value, Icon }) => (
              <div key={label} className="bg-[#161616] border border-white/5 rounded-xl p-2.5 text-center">
                <div className="flex justify-center mb-1">
                  <Icon className="w-4 h-4 text-gray-500" strokeWidth={1.75} />
                </div>
                <div className="text-base font-black text-white leading-none">{value}</div>
                <div className="text-[9px] font-bold text-gray-600 uppercase tracking-wider mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {history.length === 0 ? (
            <div className="bg-[#161616] border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-1">No activity yet</p>
                <p className="text-xs text-gray-500">Join or make your first Move to see your history here.</p>
              </div>
              <Link href="/discover"><span className="text-xs font-bold text-primary">Find a Move →</span></Link>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-white/5 z-0" />
              <div className="space-y-1">
                {visibleHistory.map((item, idx) => {
                  const cat = CAT_CONFIG[item.category] ?? defaultCatConfig;
                  const CatIcon = CAT_ICONS[item.category];
                  return (
                    <div key={item.id} className="relative flex gap-3 pl-1">
                      <div className="relative z-10 flex flex-col items-center shrink-0 mt-3.5">
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border", cat.color, idx === 0 ? "border-white/15" : "border-white/5")}>
                          {CatIcon
                            ? <CatIcon className={cat.text} strokeWidth={1.75} style={{ width: 16, height: 16 }} />
                            : <span className="text-sm">{cat.emoji}</span>
                          }
                        </div>
                      </div>
                      <div className={cn("flex-1 min-w-0 bg-[#161616] border rounded-2xl px-3.5 py-3 mb-2", idx === 0 ? "border-white/10" : "border-white/5")}>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <p className="text-sm font-bold text-white leading-snug flex-1 min-w-0 truncate">{item.title}</p>
                          <span className={cn("shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full border capitalize", item.role === "hosted" ? TAG_STYLES["Hosted"] : TAG_STYLES["Attended"])}>
                            {item.role === "hosted" ? "Hosted" : "Attended"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className={cn("text-[11px] font-bold", cat.text)}>{item.category}</span>
                          <span className="text-gray-700 text-[11px]">·</span>
                          <span className="text-[11px] text-gray-500">{item.date}</span>
                          <span className="text-gray-700 text-[11px]">·</span>
                          <span className="text-[11px] text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" /> {item.attendeeCount}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {item.tags.map(tag => {
                              const TagIcon = TAG_ICONS[tag];
                              return (
                                <span key={tag} className={cn("flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border", TAG_STYLES[tag] ?? "bg-white/5 text-gray-500 border-white/8")}>
                                  {TagIcon && <TagIcon className="w-2.5 h-2.5" strokeWidth={2} />}
                                  {tag}
                                </span>
                              );
                            })}
                          </div>
                          <FeedbackPicker current={item.feedback} onSelect={f => setFeedback(item.id, f)} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {history.length > 4 && (
                <button onClick={() => setShowAllHistory(v => !v)} className="w-full mt-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-300 transition-colors">
                  {showAllHistory ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</> : <><ChevronDown className="w-3.5 h-3.5" /> Show {history.length - 4} more</>}
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Perks & Unlocks ─────────────────────────────────────────── */}
        <div>
          <h3 className="text-[11px] font-black text-gray-500 mb-2.5 uppercase tracking-widest">Perks & Unlocks</h3>
          <div className="bg-[#161616] rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
            {PERKS.map(perk => (
              <div key={perk.level} className={cn("p-3.5 flex items-center gap-3", !perk.unlocked && "opacity-40")}>
                {perk.unlocked ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> : <Lock className="w-5 h-5 text-gray-600 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-sm">Lv {perk.level}: {perk.title}</div>
                  <div className="text-[11px] text-gray-500">{perk.desc}</div>
                </div>
                {perk.unlocked && (
                  <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 shrink-0">ACTIVE</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <TrustInfoModal open={trustInfoOpen} onOpenChange={setTrustInfoOpen} />
      <BottomNav />
    </div>
  );
}
