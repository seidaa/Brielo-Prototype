import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useRallies";
import { cn } from "@/lib/utils";
import {
  Dumbbell, Coffee, Utensils, BookOpen, Trophy,
  Headphones, Trees, Mic2, Gamepad2, Palette,
  Users, Footprints,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Interest {
  label: string;
  icon: LucideIcon;
}

const INTERESTS: Interest[] = [
  { label: "Fitness",    icon: Dumbbell   },
  { label: "Coffee",     icon: Coffee     },
  { label: "Food",       icon: Utensils   },
  { label: "Study",      icon: BookOpen   },
  { label: "Sports",     icon: Trophy     },
  { label: "Nightlife",  icon: Headphones },
  { label: "Outdoors",   icon: Trees      },
  { label: "Concerts",   icon: Mic2       },
  { label: "Gaming",     icon: Gamepad2   },
  { label: "Creative",   icon: Palette    },
  { label: "Social",     icon: Users      },
  { label: "Walks",      icon: Footprints },
];

export default function Interests() {
  const [, setLocation] = useLocation();
  const { user, updateInterests } = useUser();
  const [selected, setSelected] = useState<string[]>(user.interests ?? []);

  const toggleInterest = (label: string) => {
    setSelected(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };

  const handleNext = () => {
    updateInterests(selected);
    setLocation("/discover");
  };

  const hasSelection = selected.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d0d] pt-12 pb-32 px-5">

      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-1 flex-1 bg-primary rounded-full" />
          <div className="h-1 flex-1 bg-primary rounded-full" />
        </div>
        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Step 2 of 2</p>
        <h1 className="text-3xl font-black text-white leading-tight mb-1">What are you into?</h1>
        <p className="text-sm text-gray-400">Pick your vibe — we'll show you the right moves.</p>
      </div>

      {/* Interest chips */}
      <div className="flex flex-wrap gap-2.5">
        {INTERESTS.map(({ label, icon: Icon }) => {
          const isSelected = selected.includes(label);
          return (
            <button
              key={label}
              onClick={() => toggleInterest(label)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-150 active:scale-95",
                isSelected
                  ? "bg-primary/15 border-2 border-primary text-primary shadow-[0_0_14px_rgba(250,204,21,0.28)]"
                  : "bg-white/4 border border-white/8 text-gray-400 hover:border-white/20 hover:text-gray-300"
              )}
            >
              <Icon
                size={14}
                strokeWidth={isSelected ? 2.25 : 1.75}
                className="shrink-0"
              />
              {label}
            </button>
          );
        })}
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto px-5 pb-8 pt-6 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/95 to-transparent">
        {hasSelection && (
          <p className="text-center text-xs text-gray-500 mb-3">
            {selected.length} {selected.length === 1 ? "interest" : "interests"} selected
          </p>
        )}
        <Button
          disabled={!hasSelection}
          onClick={handleNext}
          className={cn(
            "w-full text-black font-black text-base rounded-xl h-14 transition-all duration-200",
            hasSelection
              ? "bg-primary hover:bg-primary/90 shadow-[0_0_24px_rgba(250,204,21,0.4)]"
              : "bg-white/10 text-white/30 shadow-none cursor-not-allowed"
          )}
        >
          Let's Go →
        </Button>
      </div>
    </div>
  );
}
