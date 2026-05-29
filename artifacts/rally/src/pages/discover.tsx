import { useState, useEffect } from "react";
import { Link } from "wouter";
import { MapPin, Bell, Lock, ChevronRight, Search, Zap } from "lucide-react";
import { useRallies, useUser } from "@/hooks/useRallies";
import { RallyCard } from "@/components/RallyCard";
import { BottomNav } from "@/components/BottomNav";
import { CAT_CONFIG, friendsActivity } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "All", emoji: "✨" },
  { label: "Fitness",   emoji: CAT_CONFIG.Fitness.emoji },
  { label: "Coffee",    emoji: CAT_CONFIG.Coffee.emoji },
  { label: "Food",      emoji: CAT_CONFIG.Food.emoji },
  { label: "Sports",    emoji: CAT_CONFIG.Sports.emoji },
  { label: "Nightlife", emoji: CAT_CONFIG.Nightlife.emoji },
  { label: "Outdoors",  emoji: CAT_CONFIG.Outdoors.emoji },
  { label: "Concerts",  emoji: CAT_CONFIG.Concerts.emoji },
  { label: "Study",     emoji: CAT_CONFIG.Study.emoji },
];

const TABS = ["Live Now", "Coming Up", "Friends"] as const;
type Tab = typeof TABS[number];

const TICKER = [
  "Priya S. just joined Sunday Coffee Run",
  "Jordan K. is heading to Pickup Basketball",
  "Marcus L. made a move nearby",
  "Sofia R. just opened a spot — 1 left",
  "Alex T. needs 2 more for Trivia Night",
];

export default function Discover() {
  const { rallies, joinRally } = useRallies();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>("Live Now");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFomoModal, setShowFomoModal] = useState(false);
  const [tickerIdx, setTickerIdx] = useState(0);
  const [tickerVisible, setTickerVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerVisible(false);
      setTimeout(() => {
        setTickerIdx(i => (i + 1) % TICKER.length);
        setTickerVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nowMoves = rallies.filter(r => r.time === "Now");
  const laterMoves = rallies.filter(r => r.time !== "Now");

  const tabMoves = activeTab === "Live Now" ? nowMoves
    : activeTab === "Coming Up" ? laterMoves
    : rallies;

  const filteredMoves = tabMoves.filter(r =>
    activeCategory === "All" || r.category === activeCategory
  );

  const friendsMoves = activeTab === "Friends"
    ? rallies.filter(r => friendsActivity.some(fa => fa.moveId === r.id))
    : [];

  const displayMoves = activeTab === "Friends" ? friendsMoves : filteredMoves;

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-24">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 max-w-sm mx-auto bg-[#0d0d0d]/95 backdrop-blur-xl z-40 border-b border-white/5">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-primary tracking-tight">Brio</h1>
            <button className="flex items-center text-[11px] font-bold text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5 gap-1">
              <MapPin className="w-3 h-3 text-primary" /> Chicago
            </button>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/5">
              <Bell className="w-4 h-4 text-gray-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0d0d0d]" />
            </button>
            <Link href="/profile">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-orange-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center text-[11px] font-black text-white">
                  YB
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Live activity ticker */}
        <div className="px-4 py-1.5 flex items-center gap-2 border-t border-white/5">
          <span className="flex items-center gap-1 text-[10px] font-black text-primary shrink-0 uppercase tracking-wider">
            <Zap className="w-3 h-3 fill-primary" /> Live
          </span>
          <p className={cn(
            "text-[11px] text-gray-400 truncate transition-opacity duration-300",
            tickerVisible ? "opacity-100" : "opacity-0"
          )}>
            {TICKER[tickerIdx]}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 pt-1 pb-0">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 text-[12px] font-bold py-2 rounded-t-lg transition-all border-b-2",
                activeTab === tab
                  ? "text-white border-primary"
                  : "text-gray-500 border-transparent hover:text-gray-300"
              )}
            >
              {tab}
              {tab === "Live Now" && nowMoves.length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                  {nowMoves.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Scrollable content */}
      <div className="pt-[118px]">
        {/* Category filter */}
        {activeTab !== "Friends" && (
          <div className="flex overflow-x-auto px-4 gap-2 py-3 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={cn(
                  "whitespace-nowrap flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all shrink-0",
                  activeCategory === cat.label
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-gray-400 border-white/5 hover:border-white/15"
                )}
              >
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Section header */}
        <div className="px-4 mb-3">
          {activeTab === "Friends" ? (
            <div>
              <h2 className="text-lg font-black text-white">Friends Activity</h2>
              <p className="text-xs text-gray-500">See what your people are up to</p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white">
                  {activeTab === "Live Now" ? "Live Moves Nearby" : "Coming Up"}
                </h2>
                <p className="text-xs text-gray-500">
                  {displayMoves.length > 0
                    ? `${displayMoves.length} ${displayMoves.length === 1 ? "move" : "moves"} ${activeTab === "Live Now" ? "happening right now" : "later today"}`
                    : "Nothing in this category right now"}
                </p>
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/5">
                <Search className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          )}
        </div>

        {/* Friends activity feed */}
        {activeTab === "Friends" && (
          <div className="px-4 mb-4 space-y-2">
            {friendsActivity.map((fa, i) => (
              <Link key={i} href={`/rally/${fa.moveId}`}>
                <div className="flex items-center gap-3 bg-white/3 border border-white/5 rounded-2xl px-4 py-3">
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
        )}

        {/* Move cards */}
        <div className="px-4 space-y-3">
          {displayMoves.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-4xl mb-4">
                {activeTab === "Friends" ? "👯" : activeCategory === "All" ? "🗺️" : (CAT_CONFIG[activeCategory]?.emoji ?? "📍")}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {activeTab === "Friends" ? "No friend activity" :
                 activeTab === "Live Now" ? "Nothing live right now" :
                 `No ${activeCategory === "All" ? "" : activeCategory + " "}moves later today`}
              </h3>
              <p className="text-sm text-gray-500 max-w-[200px] mb-6">
                {activeTab === "Friends"
                  ? "Add friends to see what they're doing."
                  : "Be the first to make a move."}
              </p>
              <Link href="/create">
                <Button className="bg-primary text-black font-bold rounded-xl px-6">
                  Make a Move
                </Button>
              </Link>
            </div>
          ) : (
            displayMoves.map(move => (
              <RallyCard key={move.id} rally={move} onJoin={() => joinRally(move.id)} />
            ))
          )}
        </div>

        {/* Private Moves card */}
        {displayMoves.length > 0 && (
          <div className="mx-4 mt-6 mb-2 rounded-2xl p-4 bg-gradient-to-br from-[#1c1c1c] to-[#111] border border-white/8 relative overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-[10px] font-black text-primary uppercase tracking-wider">Live</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4 text-primary" />
              <h3 className="font-black text-white">Private Moves Nearby</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Unlock invite-only moves happening right now around you.
            </p>
            <Button
              variant="outline"
              onClick={() => setShowFomoModal(true)}
              className="w-full h-9 bg-transparent border-white/10 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl text-xs font-bold"
            >
              Unlock at Level 5 · {5 - user.level > 0 ? `${5 - user.level} levels away` : "Ready!"}
            </Button>
          </div>
        )}
      </div>

      {/* Private Moves Modal */}
      <Dialog open={showFomoModal} onOpenChange={setShowFomoModal}>
        <DialogContent className="w-[90%] max-w-[320px] rounded-2xl bg-[#161616] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              Happening Right Now
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Private moves around you — not listed publicly.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-2 select-none pointer-events-none">
            {[
              { title: "Rooftop Hang", dist: "0.6 mi", going: 9 },
              { title: "Coffee & Deep Talks", dist: "0.3 mi", going: 4 },
              { title: "Lakefront Bike Crew", dist: "0.9 mi", going: 8 },
            ].map((item, i) => (
              <div key={i} className={cn("bg-white/5 border border-white/5 p-3 rounded-xl flex justify-between items-center", i === 1 && "blur-[2px] opacity-60")}>
                <div>
                  <div className="font-bold text-sm text-white">{item.title}</div>
                  <div className="text-[11px] text-gray-500">{item.dist} away</div>
                </div>
                <div className="text-xs font-black text-primary">{item.going} in</div>
              </div>
            ))}
          </div>
          <div className="mt-3 bg-white/3 border border-white/8 rounded-xl p-3 space-y-1.5">
            <p className="text-[11px] text-gray-400 flex items-center gap-2"><ChevronRight className="w-3 h-3 text-primary"/> Moves last 30–60 min</p>
            <p className="text-[11px] text-gray-400 flex items-center gap-2"><ChevronRight className="w-3 h-3 text-primary"/> Host approves drop-ins</p>
            <p className="text-[11px] text-white font-bold flex items-center gap-2"><Lock className="w-3 h-3 text-primary"/> Unlocks at Level 5</p>
          </div>
          <Button onClick={() => setShowFomoModal(false)} className="w-full mt-2 bg-primary text-black font-bold rounded-xl h-11">
            Got it
          </Button>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
