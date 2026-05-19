import { Link } from "wouter";
import { Settings, Award, Users, ChevronRight, Lock, CheckCircle2, Zap, Star } from "lucide-react";
import { useUser, useRallies } from "@/hooks/useRallies";
import { BottomNav } from "@/components/BottomNav";
import { CAT_CONFIG } from "@/data/mockData";
import { cn } from "@/lib/utils";

const PERKS = [
  { level: 1, title: "New Rallier",     desc: "Join your first rally",            unlocked: true },
  { level: 3, title: "Social Starter",  desc: "Host up to 8 people",              unlocked: true },
  { level: 5, title: "FOMO Access",     desc: "See live nearby rallies",          unlocked: false },
  { level: 7, title: "Verified Host",   desc: "Priority visibility, bigger rallies", unlocked: false },
  { level: 10, title: "City Legend",    desc: "Custom profile badge + perks",     unlocked: false },
];

export default function Profile() {
  const { user } = useUser();
  const { rallies } = useRallies();
  const joinedRallies = rallies.filter(r => r.joined);
  const progress = Math.min(100, (user.xp / user.xpToNext) * 100);

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-28">
      {/* Header area */}
      <div className="px-4 pt-12 pb-4 border-b border-white/5">
        <div className="flex items-start justify-between mb-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-orange-500 p-[2.5px]">
            <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center border-2 border-[#0d0d0d]">
              <span className="text-xl font-black text-white">YR</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-gray-400">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-black text-white mb-1">@{user.username}</h1>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 bg-primary/15 text-primary rounded-full text-[11px] font-black uppercase tracking-wider border border-primary/20">
            Level {user.level}
          </span>
          <span className="text-sm font-bold text-gray-500">Social Starter</span>
        </div>
        <p className="text-sm text-gray-400 mb-4 leading-relaxed">{user.bio}</p>

        {/* Stats */}
        <div className="flex gap-6">
          <div className="text-center">
            <div className="font-black text-white text-xl">{user.rallyCount}</div>
            <div className="text-[10px] uppercase font-bold text-gray-600 tracking-wider">Attended</div>
          </div>
          <div className="text-center">
            <div className="font-black text-white text-xl">{user.hostedCount}</div>
            <div className="text-[10px] uppercase font-bold text-gray-600 tracking-wider">Hosted</div>
          </div>
          <Link href="/friends" className="text-center cursor-pointer group">
            <div className="font-black text-white text-xl group-hover:text-primary transition-colors">{user.friendsCount}</div>
            <div className="text-[10px] uppercase font-bold text-gray-600 tracking-wider">Friends</div>
          </Link>
        </div>
      </div>

      <div className="px-4 space-y-5 pt-5">
        {/* XP Bar */}
        <div className="bg-[#161616] rounded-2xl p-4 border border-white/5">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5 text-white">
              <Zap className="w-3.5 h-3.5 text-primary fill-primary" /> {user.xp} XP
            </span>
            <span className="text-gray-500">
              {user.xpToNext - user.xp} XP to Level {user.level + 1}
            </span>
          </div>
          <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-600 mt-1.5 font-medium">
            <span>Lv {user.level}</span>
            <span>Lv {user.level + 1}</span>
          </div>
        </div>

        {/* Badges */}
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
                <Star className="w-3.5 h-3.5 text-amber-400" /> 5 Rallies
              </span>
            </div>
          </div>
        )}

        {/* My Rallies */}
        {joinedRallies.length > 0 && (
          <div>
            <h3 className="text-[11px] font-black text-gray-500 mb-2.5 uppercase tracking-widest">My Rallies</h3>
            <div className="space-y-2">
              {joinedRallies.map(rally => {
                const cat = CAT_CONFIG[rally.category];
                return (
                  <Link key={rally.id} href={`/rally/${rally.id}`}>
                    <div className="flex items-center gap-3 bg-[#161616] border border-white/5 p-3 rounded-2xl active:scale-[0.99] transition-all">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0", cat?.color ?? "bg-primary/15")}>
                        {cat?.emoji ?? "📍"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{rally.title}</p>
                        <p className="text-[11px] text-gray-500">{rally.time} · {rally.location}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-700 shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="space-y-2">
          <Link href="/circles">
            <div className="bg-[#161616] rounded-2xl p-4 border border-white/5 flex items-center justify-between group active:scale-[0.99] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-base">
                  🫂
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Your Circles</div>
                  <div className="text-[11px] text-gray-500">5 circles</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors" />
            </div>
          </Link>

          <Link href="/friends">
            <div className="bg-[#161616] rounded-2xl p-4 border border-white/5 flex items-center justify-between group active:scale-[0.99] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-base">
                  👥
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Friends</div>
                  <div className="text-[11px] text-gray-500">{user.friendsCount} friends</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors" />
            </div>
          </Link>
        </div>

        {/* Perks */}
        <div>
          <h3 className="text-[11px] font-black text-gray-500 mb-2.5 uppercase tracking-widest">Perks & Unlocks</h3>
          <div className="bg-[#161616] rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
            {PERKS.map(perk => (
              <div key={perk.level} className={cn("p-3.5 flex items-center gap-3", !perk.unlocked && "opacity-40")}>
                {perk.unlocked
                  ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  : <Lock className="w-5 h-5 text-gray-600 shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-sm">Lv {perk.level}: {perk.title}</div>
                  <div className="text-[11px] text-gray-500">{perk.desc}</div>
                </div>
                {perk.unlocked && (
                  <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    ACTIVE
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
