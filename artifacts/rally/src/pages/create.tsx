import { useState } from "react";
import { useLocation } from "wouter";
import {
  ChevronLeft, MapPin, Clock, Users, Zap,
  Dumbbell, Coffee, Utensils, BookOpen, Trophy, Music, Leaf, Mic2,
  Gamepad2, Handshake, Palette, CheckCheck, Footprints,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRallies, useUser } from "@/hooks/useRallies";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { CAT_CONFIG } from "@/data/mockData";

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

const CATEGORIES = ["Fitness", "Coffee", "Food", "Study", "Sports", "Nightlife", "Outdoors", "Concerts", "Gaming", "Creative", "Networking", "Walking", "Errands"];
const TIMES = ["Now", "In 30 min", "In 1 hour", "Later today", "Tomorrow"];
const VIBES = ["Chill", "Social", "First Timers Welcome", "Low Pressure", "Beginner Friendly", "Weekly", "Quick", "Hype", "Open to New People", "Productive"];

export default function CreateMove() {
  const [, setLoc] = useLocation();
  const { addRally } = useRallies();
  const { user } = useUser();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [time, setTime] = useState(TIMES[0]);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [maxSpots, setMaxSpots] = useState(4);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [requiresApproval, setRequiresApproval] = useState(false);

  const handleCreate = () => {
    if (!title.trim() || !location.trim()) {
      toast({ title: "Add a title and location to continue", variant: "destructive" });
      return;
    }
    addRally({
      id: "r" + Date.now(),
      title: title.trim(),
      category,
      time,
      location: location.trim(),
      maxSpots,
      going: 1,
      distance: "0.1 mi",
      hostName: user.username,
      hostLevel: user.level,
      vibeTags: selectedVibes,
      description: description.trim() || "Come join the move!",
      requiresApproval,
      joined: true,
    });
    toast({ title: "Move is live!", description: "You're hosting. Move Chat is open." });
    setLoc("/discover");
  };

  const toggleVibe = (v: string) =>
    setSelectedVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-36">

      {/* Header */}
      <header className="sticky top-0 bg-[#0d0d0d]/95 backdrop-blur-xl z-40 px-4 h-14 flex items-center border-b border-white/5">
        <Link href="/discover" className="mr-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/5">
          <ChevronLeft className="w-5 h-5 text-white" />
        </Link>
        <div>
          <h1 className="text-base font-black text-white leading-tight">Make a Move</h1>
          <p className="text-[10px] text-gray-500">Post something, see who's in</p>
        </div>
      </header>

      <div className="p-4 space-y-6">

        {/* What's the move? */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-primary" /> What's the move?
          </label>
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Coffee run at Intelligentsia"
            className="bg-[#1a1a1a] border-white/8 text-white rounded-xl h-12 text-base placeholder:text-gray-600 focus-visible:border-primary/50"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Category</label>
          <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1 px-0.5">
            {CATEGORIES.map(cat => {
              const cfg = CAT_CONFIG[cat];
              const CatIcon = CAT_ICONS[cat];
              const isSelected = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "whitespace-nowrap flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold border transition-all shrink-0",
                    isSelected ? "bg-primary text-black border-primary" : "bg-white/5 text-gray-400 border-white/5"
                  )}
                >
                  {CatIcon
                    ? <CatIcon style={{ width: 13, height: 13 }} strokeWidth={1.75} className={isSelected ? "text-black" : cfg?.text} />
                    : <span>{cfg?.emoji}</span>
                  }
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* When? */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> When?
          </label>
          <div className="flex flex-wrap gap-2">
            {TIMES.map(t => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold border transition-all",
                  time === t ? "bg-white text-black border-white" : "bg-white/5 text-gray-400 border-white/5"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Where? */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3 h-3" /> Where?
          </label>
          <Input
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="e.g. Intelligentsia Coffee, Randolph St"
            className="bg-[#1a1a1a] border-white/8 text-white rounded-xl h-12 placeholder:text-gray-600 focus-visible:border-primary/50"
          />
        </div>

        {/* Details */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Details (optional)</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What should people expect? What to bring?"
            rows={3}
            className="w-full bg-[#1a1a1a] border border-white/8 text-white rounded-xl px-3 py-3 text-sm placeholder:text-gray-600 focus:outline-none focus:border-primary/50 resize-none"
          />
        </div>

        {/* Who's coming? */}
        <div className="flex items-center justify-between bg-[#1a1a1a] border border-white/8 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <div className="text-sm font-bold text-white">Who's coming?</div>
              <div className="text-xs text-gray-500">Max spots (including you)</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-black/30 rounded-full border border-white/8 px-1 py-1">
            <button onClick={() => setMaxSpots(Math.max(2, maxSpots - 1))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white font-bold text-lg rounded-full hover:bg-white/5 transition-all">−</button>
            <span className="font-black text-white w-5 text-center">{maxSpots}</span>
            <button onClick={() => setMaxSpots(Math.min(50, maxSpots + 1))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white font-bold text-lg rounded-full hover:bg-white/5 transition-all">+</button>
          </div>
        </div>

        {/* What's the vibe? */}
        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-wider">What's the vibe?</label>
          <div className="flex flex-wrap gap-2">
            {VIBES.map(v => (
              <button
                key={v}
                onClick={() => toggleVibe(v)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold border transition-all",
                  selectedVibes.includes(v)
                    ? "bg-white/10 text-white border-white/20"
                    : "bg-white/3 text-gray-500 border-white/5"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Approval toggle */}
        <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl border border-white/8">
          <div>
            <div className="font-bold text-white text-sm">Host approval required</div>
            <div className="text-xs text-gray-500 mt-0.5">Review people before they join</div>
          </div>
          <Switch checked={requiresApproval} onCheckedChange={setRequiresApproval} />
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto px-4 pb-8 pt-4 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/95 to-transparent">
        <Button
          onClick={handleCreate}
          className="w-full bg-primary hover:bg-primary/90 text-black font-black text-base rounded-xl h-14 shadow-[0_0_20px_rgba(250,204,21,0.35)]"
        >
          <Zap className="w-5 h-5 mr-2 fill-black/30" /> Make It Live
        </Button>
      </div>
    </div>
  );
}
