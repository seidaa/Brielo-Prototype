import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useRallies";
import { cn } from "@/lib/utils";

const INTERESTS = [
  { label: "Fitness",    emoji: "💪" },
  { label: "Coffee",     emoji: "☕" },
  { label: "Food",       emoji: "🍕" },
  { label: "Study",      emoji: "📚" },
  { label: "Sports",     emoji: "🏀" },
  { label: "Nightlife",  emoji: "🎵" },
  { label: "Outdoors",   emoji: "🌿" },
  { label: "Concerts",   emoji: "🎤" },
  { label: "Gaming",     emoji: "🎮" },
  { label: "Creative",   emoji: "🎨" },
  { label: "Networking", emoji: "🤝" },
  { label: "Errands",    emoji: "✅" },
];

export default function Interests() {
  const [, setLocation] = useLocation();
  const { user, updateInterests } = useUser();
  const [selected, setSelected] = useState<string[]>(user.interests ?? []);

  const toggleInterest = (interest: string) => {
    setSelected(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleNext = () => {
    updateInterests(selected);
    setLocation("/discover");
  };

  return (
    <div className="flex flex-col min-h-screen p-5 bg-[#0d0d0d] pt-14 pb-28">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-1 flex-1 bg-primary rounded-full" />
          <div className="h-1 flex-1 bg-primary rounded-full" />
        </div>
        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Step 2 of 2</p>
        <h1 className="text-3xl font-black text-white leading-tight mb-1">What are you into?</h1>
        <p className="text-sm text-gray-400">Pick your vibe — we'll show you the right moves.</p>
      </div>

      <div className="flex flex-wrap gap-2.5 mb-auto">
        {INTERESTS.map(({ label, emoji }) => {
          const isSelected = selected.includes(label);
          return (
            <button
              key={label}
              onClick={() => toggleInterest(label)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-150 border-2 active:scale-95",
                isSelected
                  ? "bg-primary border-primary text-black shadow-[0_0_12px_rgba(250,204,21,0.3)]"
                  : "bg-white/3 border-white/8 text-gray-300 hover:border-white/20"
              )}
            >
              <span className="text-base">{emoji}</span>
              {label}
            </button>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto p-5 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/95 to-transparent">
        {selected.length > 0 && (
          <p className="text-center text-xs text-gray-500 mb-3">
            {selected.length} {selected.length === 1 ? "interest" : "interests"} selected
          </p>
        )}
        <Button
          disabled={selected.length === 0}
          onClick={handleNext}
          className="w-full bg-primary hover:bg-primary/90 text-black font-black text-base rounded-xl h-14 disabled:opacity-30 disabled:shadow-none shadow-[0_0_20px_rgba(250,204,21,0.35)]"
        >
          Let's Go →
        </Button>
      </div>
    </div>
  );
}
