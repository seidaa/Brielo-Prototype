import { Link, useLocation } from "wouter";
import { Home, Map as MapIcon, Plus, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Discover", href: "/discover" },
    { icon: MapIcon, label: "Map", href: "/map" },
    { icon: MessageCircle, label: "Chat", href: "/chat" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-[#0d0d0d] border-t border-gray-800 pb-safe z-50">
      <div className="flex justify-around items-center h-20 px-2">
        {navItems.slice(0, 2).map((item) => {
          const isActive = location === item.href || location.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center justify-center gap-1">
              <item.icon className={cn("w-6 h-6", isActive ? "text-primary" : "text-gray-500")} />
              <span className={cn("text-xs font-medium", isActive ? "text-primary" : "text-gray-500")}>
                {item.label}
              </span>
            </Link>
          );
        })}

        <div className="flex-1 flex justify-center -mt-6">
          <Link href="/create" className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.4)]">
            <Plus className="w-8 h-8 text-black" />
          </Link>
        </div>

        {navItems.slice(2, 4).map((item) => {
          const isActive = location === item.href || location.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center justify-center gap-1">
              <item.icon className={cn("w-6 h-6", isActive ? "text-primary" : "text-gray-500")} />
              <span className={cn("text-xs font-medium", isActive ? "text-primary" : "text-gray-500")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
