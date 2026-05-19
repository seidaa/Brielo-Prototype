import { useState } from "react";
import { useLocation, Link } from "wouter";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRallies, useUser } from "@/hooks/useRallies";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

const CATEGORIES = ["Fitness", "Coffee", "Food", "Study", "Sports", "Nightlife", "Outdoors", "Concerts", "Errands", "Gaming", "Creative", "Networking"];
const TIMES = ["Now", "In 1 hour", "Later today", "Tomorrow", "Pick time"];
const VIBES = ["Chill", "Productive", "Social", "Hype", "Quick Hang", "First Timers Welcome"];

export default function CreateRally() {
  const [, setLocation] = useLocation();
  const { addRally } = useRallies();
  const { user } = useUser();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [time, setTime] = useState(TIMES[0]);
  const [location, setLoc] = useState("");
  const [maxSpots, setMaxSpots] = useState(4);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [requiresApproval, setRequiresApproval] = useState(false);

  const handleCreate = () => {
    if (!title || !location) {
      toast({ title: "Please fill out all fields", variant: "destructive" });
      return;
    }

    const newRally = {
      id: "r" + Date.now(),
      title,
      category,
      time,
      location,
      maxSpots,
      going: 1,
      distance: "0.1 mi",
      hostName: user.username,
      hostLevel: user.level,
      vibeTags: selectedVibes,
      description: "Come join my rally!",
      requiresApproval,
      joined: true
    };

    addRally(newRally);
    toast({ title: "Rally started!", description: "You are now hosting a rally." });
    setLocation("/discover");
  };

  const toggleVibe = (v: string) => {
    setSelectedVibes(prev => 
      prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
    );
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-24 pt-16">
      <header className="fixed top-0 left-0 right-0 max-w-sm mx-auto bg-[#0d0d0d]/90 backdrop-blur-md z-40 px-4 h-16 flex items-center border-b border-gray-800">
        <Link href="/discover" className="mr-4">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-xl font-bold text-white">Create Rally</h1>
      </header>

      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-400">Rally Title</label>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="What are we doing?" 
            className="bg-[#1a1a1a] border-gray-800 text-white rounded-xl h-12"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-400">Category</label>
          <div className="flex overflow-x-auto gap-2 no-scrollbar pb-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn("whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border", category === cat ? "bg-primary text-black border-primary" : "bg-transparent text-gray-400 border-gray-800")}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-400">When</label>
          <div className="flex flex-wrap gap-2">
            {TIMES.map(t => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={cn("px-4 py-2 rounded-full text-xs font-bold border", time === t ? "bg-white text-black border-white" : "bg-transparent text-gray-400 border-gray-800")}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-400">Location</label>
          <Input 
            value={location} 
            onChange={(e) => setLoc(e.target.value)} 
            placeholder="Where to meet?" 
            className="bg-[#1a1a1a] border-gray-800 text-white rounded-xl h-12"
          />
        </div>

        <div className="space-y-2 flex items-center justify-between">
          <label className="text-sm font-bold text-gray-400">Max Attendees (including you)</label>
          <div className="flex items-center gap-4 bg-[#1a1a1a] rounded-full border border-gray-800 px-2 py-1">
            <button onClick={() => setMaxSpots(Math.max(2, maxSpots - 1))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white">-</button>
            <span className="font-bold text-white w-4 text-center">{maxSpots}</span>
            <button onClick={() => setMaxSpots(maxSpots + 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white">+</button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-400">Vibe Tags</label>
          <div className="flex flex-wrap gap-2">
            {VIBES.map(v => (
              <button
                key={v}
                onClick={() => toggleVibe(v)}
                className={cn("px-3 py-1.5 rounded-md text-[10px] uppercase tracking-wider font-bold border", selectedVibes.includes(v) ? "bg-gray-800 text-white border-gray-600" : "bg-[#1a1a1a] text-gray-500 border-gray-800")}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl border border-gray-800">
          <div>
            <div className="font-bold text-white">Host approval required</div>
            <div className="text-xs text-gray-400">Review people before they join</div>
          </div>
          <Switch checked={requiresApproval} onCheckedChange={setRequiresApproval} />
        </div>

        <Button 
          onClick={handleCreate} 
          className="w-full bg-primary hover:bg-primary/90 text-black font-bold text-lg rounded-xl h-14 shadow-[0_0_15px_rgba(250,204,21,0.3)] mt-6"
        >
          Start Rally
        </Button>
      </div>
    </div>
  );
}