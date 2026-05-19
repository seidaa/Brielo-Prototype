import { useState } from "react";
import { Link } from "wouter";
import { MapPin, Navigation } from "lucide-react";
import { useRallies } from "@/hooks/useRallies";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";

// Color mapping based on categories
const CAT_COLORS: Record<string, string> = {
  Fitness: "bg-yellow-500",
  Coffee: "bg-blue-500",
  Food: "bg-green-500",
  Sports: "bg-orange-500",
  Nightlife: "bg-purple-500",
};

export default function Map() {
  const { rallies } = useRallies();
  const [selectedRally, setSelectedRally] = useState<string | null>(null);

  const activeRally = selectedRally ? rallies.find(r => r.id === selectedRally) : null;

  // Mock static positions
  const PINS = [
    { id: "r1", top: "40%", left: "25%", color: CAT_COLORS["Fitness"] || "bg-primary" },
    { id: "r2", top: "30%", left: "60%", color: CAT_COLORS["Coffee"] || "bg-primary" },
    { id: "r5", top: "65%", left: "45%", color: CAT_COLORS["Food"] || "bg-primary" },
    { id: "r3", top: "55%", left: "70%", color: CAT_COLORS["Sports"] || "bg-primary" },
    { id: "r4", top: "70%", left: "30%", color: CAT_COLORS["Nightlife"] || "bg-primary" },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-24 relative overflow-hidden">
      <header className="fixed top-0 left-0 right-0 max-w-sm mx-auto z-40 px-4 h-16 flex items-center justify-between pointer-events-none">
        <h1 className="text-xl font-bold text-white drop-shadow-md">Map</h1>
        <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-gray-800 pointer-events-auto shadow-lg">
          <Navigation className="w-5 h-5 text-primary" />
        </div>
      </header>

      {/* Map Background Grid */}
      <div className="absolute inset-0 z-0 bg-[#0d0d0d]" onClick={() => setSelectedRally(null)}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_2px,transparent_2px),linear-gradient(to_bottom,#1a1a1a_2px,transparent_2px)] bg-[size:4rem_4rem]"></div>
        
        {/* Fake streets */}
        <div className="absolute top-[20%] left-0 right-0 h-4 bg-[#111] border-y border-[#222]"></div>
        <div className="absolute top-[60%] left-0 right-0 h-4 bg-[#111] border-y border-[#222]"></div>
        <div className="absolute left-[35%] top-0 bottom-0 w-4 bg-[#111] border-x border-[#222]"></div>
        <div className="absolute left-[80%] top-0 bottom-0 w-4 bg-[#111] border-x border-[#222]"></div>

        {/* You are here dot */}
        <div className="absolute top-[50%] left-[50%] w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] z-10 transform -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-50"></div>
        </div>

        {/* Pins */}
        {PINS.map(pin => (
          <button
            key={pin.id}
            onClick={(e) => { e.stopPropagation(); setSelectedRally(pin.id); }}
            className={`absolute w-8 h-8 rounded-full border-2 shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-20 transition-transform ${selectedRally === pin.id ? 'scale-125 border-white z-30' : 'border-[#0d0d0d] hover:scale-110'} ${pin.color}`}
            style={{ top: pin.top, left: pin.left }}
          />
        ))}
      </div>

      {/* Bottom slide-up card */}
      <div className={`absolute bottom-24 left-4 right-4 z-40 transition-transform duration-300 ${activeRally ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        {activeRally && (
          <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-gray-800 shadow-2xl">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-white text-lg">{activeRally.title}</h3>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">{activeRally.category}</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mb-4">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {activeRally.distance}</span>
              <span>{activeRally.going} going</span>
            </div>
            <Link href={`/rally/${activeRally.id}`}>
              <Button className="w-full bg-primary hover:bg-primary/90 text-black font-bold rounded-xl h-12">
                View Rally
              </Button>
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}