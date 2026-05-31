import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BrioLogo } from "@/components/BrioLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center px-6 text-center">
      <div className="relative w-20 h-20 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-[22px] bg-white/5 border border-white/8 shadow-[0_0_40px_rgba(250,204,21,0.18)]" />
        <div className="relative w-9 h-9 rounded-full" style={{ border: "5px solid #FACC15" }} />
      </div>
      <BrioLogo size="lg" className="mb-1" />
      <p className="text-lg font-black text-primary mb-4">Live More</p>
      <p className="text-sm font-bold text-white mb-2">This page doesn't exist.</p>
      <p className="text-sm text-gray-500 mb-8 max-w-[220px] leading-relaxed">
        But there's probably a move happening near you right now.
      </p>
      <Link href="/discover">
        <Button className="bg-primary hover:bg-primary/90 text-black font-black rounded-xl h-12 px-8 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
          Find a Move
        </Button>
      </Link>
    </div>
  );
}
