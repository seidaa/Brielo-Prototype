import { Link, useLocation } from "wouter";
import { Home, Map as MapIcon, Plus, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRallies } from "@/hooks/useRallies";

export function BottomNav() {
  const [location] = useLocation();
  const { rallies } = useRallies();

  const joinedCount = rallies.filter(r => r.joined).length;
  const chatBadge = joinedCount > 0 ? joinedCount : 0;

  const isActive = (href: string) =>
    location === href || location.startsWith(href + "/");

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto z-50">
      <div className="bg-[#0d0d0d]/95 backdrop-blur-xl border-t border-white/5 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          {/* Discover */}
          <Link href="/discover" className="flex-1 flex flex-col items-center justify-center gap-1 py-2">
            <div className={cn("p-1.5 rounded-xl transition-all", isActive("/discover") && "bg-primary/15")}>
              <Home className={cn("w-5 h-5 transition-colors", isActive("/discover") ? "text-primary" : "text-gray-500")} />
            </div>
            <span className={cn("text-[10px] font-semibold tracking-wide transition-colors", isActive("/discover") ? "text-primary" : "text-gray-600")}>
              Discover
            </span>
          </Link>

          {/* Map */}
          <Link href="/map" className="flex-1 flex flex-col items-center justify-center gap-1 py-2">
            <div className={cn("p-1.5 rounded-xl transition-all", isActive("/map") && "bg-primary/15")}>
              <MapIcon className={cn("w-5 h-5 transition-colors", isActive("/map") ? "text-primary" : "text-gray-500")} />
            </div>
            <span className={cn("text-[10px] font-semibold tracking-wide transition-colors", isActive("/map") ? "text-primary" : "text-gray-600")}>
              Map
            </span>
          </Link>

          {/* Create — center FAB */}
          <div className="flex-1 flex justify-center -mt-5">
            <Link href="/create">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.45)] active:scale-95 transition-transform">
                <Plus className="w-7 h-7 text-black stroke-[2.5]" />
              </div>
            </Link>
          </div>

          {/* Chat */}
          <Link href="/chat" className="flex-1 flex flex-col items-center justify-center gap-1 py-2 relative">
            <div className={cn("p-1.5 rounded-xl transition-all relative", isActive("/chat") && "bg-primary/15")}>
              <MessageCircle className={cn("w-5 h-5 transition-colors", isActive("/chat") ? "text-primary" : "text-gray-500")} />
              {chatBadge > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 leading-none">
                  {chatBadge}
                </span>
              )}
            </div>
            <span className={cn("text-[10px] font-semibold tracking-wide transition-colors", isActive("/chat") ? "text-primary" : "text-gray-600")}>
              Chat
            </span>
          </Link>

          {/* Profile */}
          <Link href="/profile" className="flex-1 flex flex-col items-center justify-center gap-1 py-2">
            <div className={cn("p-1.5 rounded-xl transition-all", isActive("/profile") && "bg-primary/15")}>
              <User className={cn("w-5 h-5 transition-colors", isActive("/profile") ? "text-primary" : "text-gray-500")} />
            </div>
            <span className={cn("text-[10px] font-semibold tracking-wide transition-colors", isActive("/profile") ? "text-primary" : "text-gray-600")}>
              Profile
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
