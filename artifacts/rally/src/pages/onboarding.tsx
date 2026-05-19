import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/hooks/useRallies";

export default function Onboarding() {
  const { completeOnboarding } = useOnboarding();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8 bg-[#0d0d0d]">
      <div className="w-16 h-16 grid grid-cols-4 gap-0 animate-pulse">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className={(i + Math.floor(i / 4)) % 2 === 0 ? "bg-white" : "bg-black"} />
        ))}
      </div>
      <div>
        <h1 className="text-5xl font-black text-white tracking-tight mb-2">Rally</h1>
        <p className="text-xl text-primary font-bold">Less scrolling. More doing.</p>
      </div>
      <p className="text-gray-400 max-w-[280px]">
        Find things to do and people to do them with — right now.
      </p>
      <div className="w-full space-y-4 pt-8">
        <Link href="/interests">
          <Button onClick={completeOnboarding} className="w-full bg-primary hover:bg-primary/90 text-black font-bold text-lg rounded-xl h-14 shadow-[0_0_15px_rgba(250,204,21,0.3)]">
            Get Started
          </Button>
        </Link>
        <Link href="/discover">
          <Button variant="ghost" onClick={completeOnboarding} className="w-full text-gray-400 hover:text-white">
            I already have an account
          </Button>
        </Link>
      </div>
    </div>
  );
}