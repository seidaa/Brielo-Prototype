import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useRallies";
import { cn } from "@/lib/utils";

const INTERESTS = ["Fitness", "Coffee", "Food", "Study", "Sports", "Nightlife", "Outdoors", "Concerts", "Errands", "Gaming", "Creative", "Networking"];

export default function Interests() {
  const [, setLocation] = useLocation();
  const { user, updateInterests } = useUser();
  const [selected, setSelected] = useState<string[]>(user.interests || []);

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
    <div className="flex flex-col min-h-screen p-6 bg-[#0d0d0d] pt-12 pb-24">
      <div className="mb-8">
        <div className="text-sm font-bold text-gray-500 mb-2">Step 2 of 2</div>
        <h1 className="text-3xl font-black text-white mb-2">What are you into?</h1>
        <p className="text-gray-400">Pick your interests to see relevant rallies.</p>
      </div>
      
      <div className="flex flex-wrap gap-3 mb-auto">
        {INTERESTS.map(interest => {
          const isSelected = selected.includes(interest);
          return (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={cn(
                "px-5 py-3 rounded-full text-sm font-bold transition-all duration-200 border-2",
                isSelected 
                  ? "bg-primary border-primary text-black shadow-[0_0_10px_rgba(250,204,21,0.3)]" 
                  : "bg-transparent border-gray-800 text-gray-300 hover:border-gray-600"
              )}
            >
              {interest}
            </button>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto p-6 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d] to-transparent">
        <Button 
          disabled={selected.length === 0} 
          onClick={handleNext}
          className="w-full bg-primary hover:bg-primary/90 text-black font-bold text-lg rounded-xl h-14 disabled:opacity-50 disabled:shadow-none"
        >
          Let's Go
        </Button>
      </div>
    </div>
  );
}