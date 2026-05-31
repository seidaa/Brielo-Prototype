import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/hooks/useRallies";
import { ArrowRight, ArrowUpRight, Users, Building2 } from "lucide-react";
import { BrioLogo } from "@/components/BrioLogo";
import type { LucideIcon } from "lucide-react";

interface Card {
  icon: LucideIcon;
  headline: string;
  sub: string;
  accent?: boolean;
}

const CARDS: Card[] = [
  {
    icon: ArrowUpRight,
    headline: "Make Moves.",
    sub: "Post something you're down to do and see who's in.",
    accent: true,
  },
  {
    icon: Users,
    headline: "Build your Circle.",
    sub: "Add people you'd actually move with again.",
  },
  {
    icon: Building2,
    headline: "Live More.",
    sub: "Turn free time into real life.",
  },
];

export default function Onboarding() {
  const { completeOnboarding } = useOnboarding();

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d0d] relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/8 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-48 h-48 bg-orange-500/6 rounded-full blur-[60px] pointer-events-none" />

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 relative z-10">

        {/* Brand stack */}
        <BrioLogo size="hero" className="mb-1" />
        <p className="text-2xl font-black text-primary mb-2">Live More</p>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-10">
          Less scrolling. More doing.
        </p>

        {/* Feature cards */}
        <div className="w-full space-y-3 mb-10">
          {CARDS.map(({ icon: Icon, headline, sub, accent }) => (
            <div
              key={headline}
              className="flex items-start gap-4 bg-white/3 border border-white/5 rounded-2xl px-4 py-4"
            >
              <div
                className={[
                  "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                  accent
                    ? "bg-primary/15 border border-primary/20"
                    : "bg-white/6 border border-white/8",
                ].join(" ")}
              >
                <Icon
                  className={accent ? "text-primary" : "text-white/70"}
                  size={16}
                  strokeWidth={1.75}
                />
              </div>
              <div>
                <p className="font-black text-white text-sm mb-0.5">{headline}</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Supporting copy */}
        <p className="text-xs text-gray-600 text-center max-w-[240px] leading-relaxed">
          Find people to do things with — once, weekly, or whenever you're down.
        </p>
      </div>

      {/* CTA */}
      <div className="relative z-10 w-full px-6 pb-10 space-y-3">
        <Link href="/interests" className="block" onClick={completeOnboarding}>
          <Button className="w-full bg-primary hover:bg-primary/90 text-black font-black text-base rounded-xl h-14 shadow-[0_0_24px_rgba(250,204,21,0.35)] flex items-center justify-center gap-2">
            Make Your First Move <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <Link href="/discover" className="block" onClick={completeOnboarding}>
          <Button variant="ghost" className="w-full text-gray-500 hover:text-gray-300 text-sm h-11">
            I already have an account
          </Button>
        </Link>
      </div>
    </div>
  );
}
