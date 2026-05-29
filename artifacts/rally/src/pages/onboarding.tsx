import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/hooks/useRallies";

export default function Onboarding() {
  const { completeOnboarding } = useOnboarding();

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6 text-center bg-[#0d0d0d]">
      <div className="flex-1" />

      <div className="flex flex-col items-center gap-6">
        {/* Energy mark */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_40px_rgba(250,204,21,0.15)]" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/10" />
          <span className="relative text-4xl">⚡</span>
        </div>

        <div>
          <h1 className="text-5xl font-black text-white tracking-tight mb-1.5">Brio</h1>
          <p className="text-lg font-black text-primary">Less scrolling. More doing.</p>
        </div>

        <p className="text-sm text-gray-500 max-w-[260px] leading-relaxed">
          Find people to do things with — once, weekly, or whenever you're down.
        </p>

        <div className="flex flex-col gap-2 w-full max-w-[280px] mt-2">
          {[
            { emoji: "⚡", text: "Live moves happening near you" },
            { emoji: "👥", text: "Find people who actually show up" },
            { emoji: "🔒", text: "Move Chat expires when it's over" },
          ].map(({ emoji, text }) => (
            <div key={text} className="flex items-center gap-3 bg-white/3 border border-white/5 rounded-xl px-3 py-2">
              <span className="text-base">{emoji}</span>
              <span className="text-xs font-medium text-gray-400">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      <div className="w-full space-y-3 pb-2">
        <Link href="/interests" className="block">
          <Button
            onClick={completeOnboarding}
            className="w-full bg-primary hover:bg-primary/90 text-black font-black text-base rounded-xl h-14 shadow-[0_0_20px_rgba(250,204,21,0.35)]"
          >
            Make Your First Move
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
