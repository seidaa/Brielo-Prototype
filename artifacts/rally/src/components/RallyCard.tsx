import { Rally } from "@/data/mockData";
import { Link } from "wouter";
import { MapPin, Clock, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RallyCardProps {
  rally: Rally;
  onJoin?: () => void;
}

export function RallyCard({ rally, onJoin }: RallyCardProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-5 shadow-sm border border-gray-800">
      <Link href={`/rally/${rally.id}`} className="block mb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge className="bg-primary text-black hover:bg-primary/90 rounded-full px-3">
            {rally.category}
          </Badge>
          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {rally.distance}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {rally.time}</span>
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-1 leading-tight">{rally.title}</h3>
        <p className="text-sm text-gray-400 mb-3 font-medium">
          <span className="text-white">{rally.going} going</span> · {rally.maxSpots - rally.going} spots left
        </p>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-bold">
            {rally.hostName.charAt(0)}
          </div>
          <span className="text-xs text-gray-400">by {rally.hostName} · Lv {rally.hostLevel}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {rally.vibeTags.map((tag) => (
            <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-gray-800 text-gray-300 rounded-md">
              {tag}
            </span>
          ))}
        </div>
      </Link>
      
      {rally.joined ? (
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex-1 bg-gray-800/50 border-gray-700 text-white rounded-xl pointer-events-none">
            Joined
          </Button>
          <Link href={`/chat/${rally.id}`} className="flex-none">
            <Button className="bg-primary hover:bg-primary/90 text-black rounded-xl aspect-square w-10 p-0 shadow-[0_0_10px_rgba(250,204,21,0.2)]">
              <MessageCircle className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      ) : (
        <Button 
          onClick={onJoin} 
          className="w-full bg-primary hover:bg-primary/90 text-black font-bold rounded-xl shadow-[0_0_10px_rgba(250,204,21,0.2)] transition-all"
        >
          {rally.requiresApproval ? "Request to Join" : "Join Rally"}
        </Button>
      )}
    </div>
  );
}
