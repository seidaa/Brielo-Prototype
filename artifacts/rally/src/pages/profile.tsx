import { Link } from "wouter";
import { Settings, Award, Users, ChevronRight, Lock, CheckCircle } from "lucide-react";
import { useUser } from "@/hooks/useRallies";
import { BottomNav } from "@/components/BottomNav";

export default function Profile() {
  const { user } = useUser();

  const progress = (user.xp / user.xpToNext) * 100;

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-24 pt-6">
      <div className="px-4 flex justify-between items-start mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-orange-500 p-1">
          <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center border-2 border-[#0d0d0d]">
            <span className="text-2xl font-black text-white">YR</span>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-gray-800 flex items-center justify-center text-gray-400">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 mb-6">
        <h1 className="text-2xl font-black text-white mb-1">@{user.username}</h1>
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs font-bold uppercase tracking-wider">Level {user.level}</span>
          <span className="text-sm font-bold text-gray-400">Social Starter</span>
        </div>
        <p className="text-sm text-gray-300 mb-4">{user.bio}</p>

        <div className="flex gap-4">
          <div className="text-center">
            <div className="font-black text-white text-lg">{user.rallyCount}</div>
            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Attended</div>
          </div>
          <div className="text-center">
            <div className="font-black text-white text-lg">{user.hostedCount}</div>
            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Hosted</div>
          </div>
          <Link href="/friends" className="text-center cursor-pointer group">
            <div className="font-black text-white text-lg group-hover:text-primary transition-colors">{user.friendsCount}</div>
            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Friends</div>
          </Link>
        </div>
      </div>

      <div className="px-4 mb-8">
        <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-gray-800">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className="text-white">{user.xp} / {user.xpToNext} XP</span>
            <span className="text-primary">Level {user.level + 1} in {user.xpToNext - user.xp} XP</span>
          </div>
          <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        <Link href="/circles">
          <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-gray-800 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-primary">
                <Users className="w-5 h-5" />
              </div>
              <div className="font-bold text-white">Your Circles</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
          </div>
        </Link>

        <div>
          <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Perks & Unlocks</h3>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 divide-y divide-gray-800">
            <div className="p-3 flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white text-sm">Lv 1: New Rallier</div>
                <div className="text-xs text-gray-400">Join your first rally</div>
              </div>
            </div>
            <div className="p-3 flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white text-sm">Lv 3: Social Starter</div>
                <div className="text-xs text-gray-400">Host up to 8 people</div>
              </div>
            </div>
            <div className="p-3 flex gap-3 opacity-50">
              <Lock className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white text-sm">Lv 5: FOMO Access</div>
                <div className="text-xs text-gray-400">See live nearby rallies</div>
              </div>
            </div>
            <div className="p-3 flex gap-3 opacity-50">
              <Lock className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white text-sm">Lv 7: Verified Host</div>
                <div className="text-xs text-gray-400">Priority visibility, bigger rallies</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}