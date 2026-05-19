import { Link, useParams } from "wouter";
import { ChevronLeft, MapPin, Clock, MessageCircle, AlertTriangle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRallies } from "@/hooks/useRallies";
import { useToast } from "@/hooks/use-toast";
import { ReportModal } from "@/components/ReportModal";
import { CAT_CONFIG, defaultCatConfig } from "@/data/mockData";
import { useState } from "react";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
  "bg-orange-500", "bg-blue-500", "bg-emerald-500",
  "bg-purple-500", "bg-pink-500", "bg-amber-500", "bg-cyan-500"
];

const HOST_AVATAR_COLORS: Record<string, string> = {
  "Marcus L.": "bg-orange-500",
  "Priya S.": "bg-pink-500",
  "Jordan K.": "bg-blue-500",
  "Alex T.": "bg-purple-500",
  "Sofia R.": "bg-green-500",
  "Devon A.": "bg-amber-500",
  "Camille D.": "bg-cyan-500",
};

export default function RallyDetail() {
  const { id } = useParams<{ id: string }>();
  const { rallies, joinRally } = useRallies();
  const { toast } = useToast();
  const [reportOpen, setReportOpen] = useState(false);

  const rally = rallies.find(r => r.id === id);

  if (!rally) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-4xl mb-3">📍</div>
        <p className="text-white font-bold mb-2">Rally not found</p>
        <Link href="/discover"><span className="text-primary text-sm">← Back to Discover</span></Link>
      </div>
    </div>
  );

  const cat = CAT_CONFIG[rally.category] ?? defaultCatConfig;
  const isLive = rally.time === "Now";
  const spotsLeft = rally.maxSpots - rally.going;
  const fillPct = Math.min(100, (rally.going / rally.maxSpots) * 100);
  const hostColor = HOST_AVATAR_COLORS[rally.hostName] ?? "bg-gray-700";

  const handleJoin = () => {
    joinRally(rally.id);
    toast({ title: "🎉 You're in!", description: "Chat is now unlocked for this rally." });
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-32 relative">
      {/* Map banner */}
      <div className={cn("h-52 w-full relative overflow-hidden flex items-center justify-center", cat.color)}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a22_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a22_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-40" />
        {/* Gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0d0d0d] to-transparent" />

        {/* Category icon */}
        <div className="relative flex flex-col items-center gap-3 z-10">
          <div className="text-5xl drop-shadow-lg">{cat.emoji}</div>
          {isLive && (
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-[11px] font-black text-white uppercase tracking-wider">Happening Now</span>
            </div>
          )}
        </div>
      </div>

      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 max-w-sm mx-auto px-4 pt-12 z-40 flex items-center justify-between">
        <Link href="/discover">
          <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-white" />
          </div>
        </Link>
        <button className="w-9 h-9 rounded-full bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center">
          <Share2 className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Main content */}
      <div className="px-4 -mt-6 relative z-10 space-y-3">
        {/* Main card */}
        <div className="bg-[#161616] rounded-2xl p-5 border border-white/8 shadow-2xl">
          {/* Category + distance */}
          <div className="flex items-center justify-between mb-3">
            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold", cat.color, cat.text)}>
              {cat.emoji} {rally.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
              <MapPin className="w-3 h-3 text-primary" /> {rally.distance}
            </span>
          </div>

          <h1 className="text-2xl font-black text-white leading-tight mb-4">{rally.title}</h1>

          {/* Time + Location */}
          <div className="space-y-2.5 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium text-gray-200 text-sm">{rally.time}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium text-gray-200 text-sm">{rally.location}</span>
            </div>
          </div>

          {/* Host */}
          <div className="flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-white/5 mb-5">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0", hostColor)}>
              {rally.hostName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white">
                {rally.hostName}
                <span className="text-primary ml-2 text-xs">Lv {rally.hostLevel}</span>
              </div>
              <div className="text-[11px] text-gray-500">Host</div>
            </div>
            <Button variant="outline" size="sm" className="h-8 rounded-lg border-white/10 bg-transparent text-gray-300 hover:bg-white/5 text-xs">
              Ask
            </Button>
          </div>

          {/* Vibe tags */}
          {rally.vibeTags.length > 0 && (
            <div className="mb-5">
              <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Vibe</h3>
              <div className="flex flex-wrap gap-2">
                {rally.vibeTags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-white/5 border border-white/8 text-gray-300 rounded-lg text-[11px] font-bold uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-5">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Details</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{rally.description}</p>
          </div>

          {/* Who's Going */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Who's Going</h3>
              <span className="text-xs font-bold text-primary">{rally.going} / {rally.maxSpots}</span>
            </div>

            <div className="flex -space-x-2 mb-3">
              {Array.from({ length: Math.min(rally.going, 7) }).map((_, i) => (
                <div
                  key={i}
                  className={cn("w-9 h-9 rounded-full border-2 border-[#161616] flex items-center justify-center text-[11px] font-black text-white", AVATAR_COLORS[i % AVATAR_COLORS.length])}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              {Array.from({ length: Math.max(0, Math.min(rally.maxSpots - rally.going, 4)) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-9 h-9 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-gray-700 text-xs"
                >
                  ?
                </div>
              ))}
            </div>

            {/* Spot progress bar */}
            <div className="space-y-1">
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", spotsLeft <= 2 ? "bg-amber-500" : "bg-primary")}
                  style={{ width: `${fillPct}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-600">
                {spotsLeft <= 0 ? "Rally is full" : `${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} remaining`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto px-4 pb-8 pt-4 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/95 to-transparent z-50">
        {rally.joined ? (
          <Link href={`/chat/${rally.id}`}>
            <Button className="w-full bg-primary hover:bg-primary/90 text-black font-black text-base rounded-xl h-14 shadow-[0_0_20px_rgba(250,204,21,0.35)]">
              <MessageCircle className="w-5 h-5 mr-2" /> Open Chat
            </Button>
          </Link>
        ) : (
          <Button
            onClick={handleJoin}
            disabled={spotsLeft <= 0}
            className={cn(
              "w-full font-black text-base rounded-xl h-14",
              spotsLeft <= 0
                ? "bg-white/5 text-gray-500 border border-white/8 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 text-black shadow-[0_0_20px_rgba(250,204,21,0.35)]"
            )}
          >
            {spotsLeft <= 0 ? "Rally is Full" : rally.requiresApproval ? "Request to Join" : "Join Rally"}
          </Button>
        )}

        <button
          onClick={() => setReportOpen(true)}
          className="w-full mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-600 hover:text-gray-400 transition-colors"
        >
          <AlertTriangle className="w-3 h-3" /> Report this rally
        </button>
      </div>

      <ReportModal open={reportOpen} onOpenChange={setReportOpen} />
    </div>
  );
}
