import { Rally, CAT_CONFIG, defaultCatConfig } from "@/data/mockData";
import { Link } from "wouter";
import { MapPin, Clock, MessageCircle, Users, CheckCircle2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RallyCardProps {
  rally: Rally;
  onJoin?: () => void;
}

const AVATAR_COLORS = [
  "bg-orange-500", "bg-blue-500", "bg-emerald-500",
  "bg-purple-500", "bg-pink-500", "bg-amber-500", "bg-cyan-500"
];

export function RallyCard({ rally, onJoin }: RallyCardProps) {
  const cat = CAT_CONFIG[rally.category] ?? defaultCatConfig;
  const isLive = rally.time === "Now";
  const spotsLeft = rally.maxSpots - rally.going;
  const fillPct = Math.min(100, (rally.going / rally.maxSpots) * 100);
  const almostFull = spotsLeft <= 2 && spotsLeft > 0;
  const isFull = spotsLeft <= 0;

  return (
    <div className={cn(
      "rounded-2xl border overflow-hidden transition-all active:scale-[0.99]",
      isLive
        ? "bg-[#181818] border-white/8 shadow-lg"
        : "bg-[#141414] border-white/5"
    )}>
      {/* Live banner */}
      {isLive && (
        <div className="flex items-center gap-2 px-4 pt-3 pb-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-[10px] font-black text-red-400 tracking-widest uppercase">Live Now</span>
        </div>
      )}

      <Link href={`/rally/${rally.id}`} className="block p-4">
        {/* Top row: category + distance + time */}
        <div className="flex items-center justify-between mb-3">
          <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold",
            cat.color, cat.text
          )}>
            <span>{cat.emoji}</span>
            {rally.category}
          </span>
          <div className="flex items-center gap-3 text-[11px] text-gray-500 font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {rally.distance}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {rally.time}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-black text-white leading-snug mb-1">{rally.title}</h3>

        {/* Host */}
        <div className="flex items-center gap-2 mb-3">
          <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white", AVATAR_COLORS[rally.hostLevel % AVATAR_COLORS.length])}>
            {rally.hostName.charAt(0)}
          </div>
          <span className="text-[11px] text-gray-500">
            {rally.hostName}
            <span className="text-primary ml-1 font-bold">Lv {rally.hostLevel}</span>
          </span>
          {rally.requiresApproval && (
            <span className="ml-auto flex items-center gap-1 text-[10px] text-amber-400 font-bold">
              <Shield className="w-3 h-3" /> Approval
            </span>
          )}
        </div>

        {/* Vibe tags */}
        {rally.vibeTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {rally.vibeTags.map(tag => (
              <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-white/5 text-gray-400 rounded-md border border-white/5">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Spots */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {/* Overlap avatars */}
              <div className="flex -space-x-1.5">
                {Array.from({ length: Math.min(rally.going, 5) }).map((_, i) => (
                  <div
                    key={i}
                    className={cn("w-5 h-5 rounded-full border border-[#141414] flex items-center justify-center text-[8px] font-bold text-white", AVATAR_COLORS[i % AVATAR_COLORS.length])}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                {rally.going > 5 && (
                  <div className="w-5 h-5 rounded-full border border-[#141414] bg-gray-700 flex items-center justify-center text-[8px] font-bold text-gray-300">
                    +{rally.going - 5}
                  </div>
                )}
              </div>
              <span className="text-[11px] font-bold text-gray-300">
                <span className="text-white">{rally.going}</span> going
              </span>
            </div>
            <span className={cn("text-[11px] font-bold", isFull ? "text-red-400" : almostFull ? "text-amber-400" : "text-gray-500")}>
              {isFull ? "Full" : `${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left`}
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", isFull ? "bg-red-500" : almostFull ? "bg-amber-500" : "bg-primary")}
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>
      </Link>

      {/* CTA */}
      <div className="px-4 pb-4">
        {rally.joined ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-4 py-2.5">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-white">Joined</span>
            </div>
            <Link href={`/chat/${rally.id}`}>
              <Button className="bg-primary hover:bg-primary/90 text-black rounded-xl w-11 h-10 p-0 shadow-[0_0_12px_rgba(250,204,21,0.25)]">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <Button
            onClick={onJoin}
            disabled={isFull}
            className={cn(
              "w-full font-bold rounded-xl h-10 transition-all",
              isFull
                ? "bg-white/5 text-gray-500 cursor-not-allowed border border-white/8"
                : "bg-primary hover:bg-primary/90 text-black shadow-[0_0_12px_rgba(250,204,21,0.2)]"
            )}
          >
            {isFull ? "Rally is Full" : rally.requiresApproval ? "Request to Join" : "Join Rally"}
          </Button>
        )}
      </div>
    </div>
  );
}
