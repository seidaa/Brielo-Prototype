import { useState } from "react";
import { Link } from "wouter";
import { MapPin, Bell, ChevronRight, Lock } from "lucide-react";
import { useRallies, useUser } from "@/hooks/useRallies";
import { RallyCard } from "@/components/RallyCard";
import { BottomNav } from "@/components/BottomNav";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["All", "Fitness", "Food", "Coffee", "Study", "Sports", "Nightlife", "Outdoors"];

export default function Discover() {
  const { rallies, joinRally } = useRallies();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("Happening Now");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFomoModal, setShowFomoModal] = useState(false);

  const filteredRallies = rallies.filter(r => 
    activeCategory === "All" || r.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-24 pt-16">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 max-w-sm mx-auto bg-[#0d0d0d]/90 backdrop-blur-md z-40 px-4 h-16 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black text-primary">Rally</h1>
          <div className="flex items-center text-xs font-bold text-gray-300 bg-gray-900 px-2 py-1 rounded-full">
            <MapPin className="w-3 h-3 mr-1 text-primary" /> Chicago
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative">
            <Bell className="w-6 h-6 text-gray-300" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <Link href="/profile">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-white border border-gray-700">
              YR
            </div>
          </Link>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 mt-4 mb-6">
        <div className="flex gap-6 border-b border-gray-800 pb-2">
          {["Happening Now", "Later Today", "Friends"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-bold pb-2 -mb-[9px] transition-colors ${activeTab === tab ? 'text-white border-b-2 border-primary' : 'text-gray-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto px-4 gap-2 mb-6 no-scrollbar pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${activeCategory === cat ? 'bg-white text-black' : 'bg-[#1a1a1a] text-gray-300 border border-gray-800'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="px-4">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white">Happening Now</h2>
          <p className="text-sm text-gray-400">Live rallies near you</p>
        </div>

        <div className="space-y-4">
          {filteredRallies.map(rally => (
            <RallyCard key={rally.id} rally={rally} onJoin={() => joinRally(rally.id)} />
          ))}
        </div>

        {/* FOMO Card */}
        <div className="mt-8 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl p-5 border border-gray-800 relative overflow-hidden">
          <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-primary animate-ping"></div>
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" /> Live Nearby Rallies
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Higher-level users can unlock active rallies happening around them right now.
          </p>
          <Button 
            variant="outline" 
            onClick={() => setShowFomoModal(true)}
            className="w-full bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl"
          >
            Unlock at Level 5
          </Button>
        </div>
      </div>

      {/* FOMO Modal */}
      <Dialog open={showFomoModal} onOpenChange={setShowFomoModal}>
        <DialogContent className="w-[90%] max-w-[320px] rounded-2xl bg-[#1a1a1a] border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Happening Right Now
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              See what's actively going on around you and request to drop in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4 filter blur-sm select-none opacity-50">
            <div className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
              <div><div className="font-bold">Rooftop Vibes</div><div className="text-xs">0.6 mi</div></div>
              <div className="text-xs font-bold text-primary">9 here</div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
              <div><div className="font-bold">Coffee Meetup</div><div className="text-xs">0.3 mi</div></div>
              <div className="text-xs font-bold text-primary">4 here</div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
              <div><div className="font-bold">Pickup Basketball</div><div className="text-xs">0.9 mi</div></div>
              <div className="text-xs font-bold text-primary">8 here</div>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-xs text-gray-400 bg-gray-900/50 p-3 rounded-xl border border-gray-800">
            <p className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-primary"/> Broadcast lasts 30–60 min</p>
            <p className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-primary"/> Host approves requests</p>
            <p className="flex items-center gap-2 text-white font-bold"><Lock className="w-3 h-3 text-primary"/> Unlock at Level 5</p>
          </div>
          <Button onClick={() => setShowFomoModal(false)} className="w-full mt-4 bg-primary text-black font-bold rounded-xl">
            Got it
          </Button>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}