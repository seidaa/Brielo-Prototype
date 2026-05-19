import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/hooks/useRallies";

export default function Onboarding() {
  const { completeOnboarding } = useOnboarding();

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6 text-center bg-[#0d0d0d]">
      {/* Top spacer */}
      <div className="flex-1" />

      {/* Logo + Brand */}
      <div className="flex flex-col items-center gap-6">
        {/* Checkered flag */}
        <div className="w-20 h-20 grid grid-cols-4 gap-0 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(250,204,21,0.15)]">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className={(i + Math.floor(i / 4)) % 2 === 0 ? "bg-white" : "bg-[#111]"}
            />
          ))}
        </div>

        <div>
          <h1 className="text-5xl font-black text-white tracking-tight mb-1.5">Rally</h1>
          <p className="text-lg font-black text-primary">Less scrolling. More doing.</p>
        </div>

        <p className="text-sm text-gray-500 max-w-[260px] leading-relaxed">
          Find things to do and people to do them with — happening right now near you.
        </p>

        {/* Feature callouts */}
        <div className="flex flex-col gap-2 w-full max-w-[280px] mt-2">
          {[
            { emoji: "⚡", text: "Real-time rallies near you" },
            { emoji: "👥", text: "Meet new people IRL" },
            { emoji: "🔒", text: "Chats expire when rallies end" },
          ].map(({ emoji, text }) => (
            <div key={text} className="flex items-center gap-3 bg-white/3 border border-white/5 rounded-xl px-3 py-2">
              <span className="text-base">{emoji}</span>
              <span className="text-xs font-medium text-gray-400">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      {/* CTAs */}
      <div className="w-full space-y-3 pb-2">
        <Link href="/interests" className="block">
          <Button
            onClick={completeOnboarding}
            className="w-full bg-primary hover:bg-primary/90 text-black font-black text-base rounded-xl h-14 shadow-[0_0_20px_rgba(250,204,21,0.35)]"
          >
            Get Started
          </Button>
        </Link>
        <Link href="/discover" className="block">
          <Button
            variant="ghost"
            onClick={completeOnboarding}
            className="w-full text-gray-500 hover:text-gray-300 text-sm h-11"
          >
            I already have an account
          </Button>
        </Link>
      </div>
    </div>
  );
}
