import { Link, useParams } from "wouter";
import { ChevronLeft, MapPin, Clock, MessageCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRallies } from "@/hooks/useRallies";
import { useToast } from "@/hooks/use-toast";
import { ReportModal } from "@/components/ReportModal";
import { useState } from "react";

export default function RallyDetail() {
  const { id } = useParams<{ id: string }>();
  const { rallies, joinRally } = useRallies();
  const { toast } = useToast();
  const [reportOpen, setReportOpen] = useState(false);

  const rally = rallies.find(r => r.id === id);

  if (!rally) return <div className="p-8 text-white">Rally not found.</div>;

  const handleJoin = () => {
    joinRally(rally.id);
    toast({ title: "You're in!", description: "Chat unlocked." });
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-24 relative">
      {/* Fake map banner background */}
      <div className="h-48 w-full bg-gray-900 border-b border-gray-800 relative overflow-hidden flex items-center justify-center opacity-80">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30"></div>
         <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-primary rounded-full animate-ping"></div>
         </div>
      </div>

      <header className="absolute top-0 left-0 right-0 max-w-sm mx-auto p-4 z-40">
        <Link href="/discover">
          <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-white" />
          </div>
        </Link>
      </header>

      <div className="p-4 -mt-8 relative z-10">
        <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-gray-800 shadow-xl mb-4">
          <div className="flex justify-between items-start mb-3">
            <Badge className="bg-primary text-black hover:bg-primary/90 rounded-full px-3">{rally.category}</Badge>
            <span className="flex items-center gap-1 text-xs text-gray-400 font-bold bg-black/50 px-2 py-1 rounded-full"><MapPin className="w-3 h-3 text-primary"/> {rally.distance}</span>
          </div>
          
          <h1 className="text-3xl font-black text-white mb-4 leading-tight">{rally.title}</h1>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center"><Clock className="w-4 h-4 text-primary" /></div>
              <span className="font-medium">{rally.time}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center"><MapPin className="w-4 h-4 text-primary" /></div>
              <span className="font-medium">{rally.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-900 rounded-xl border border-gray-800 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-black font-bold text-lg">
                {rally.hostName.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-white text-sm">{rally.hostName} <span className="text-primary ml-1">Lv {rally.hostLevel}</span></div>
                <div className="text-xs text-gray-400">Host</div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-8 rounded-lg border-gray-700 bg-transparent text-gray-300">Ask</Button>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-400 mb-2">Vibe</h3>
            <div className="flex flex-wrap gap-2">
              {rally.vibeTags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-xs font-bold uppercase tracking-wider">{tag}</span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-400 mb-2">Details</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{rally.description}</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-sm font-bold text-gray-400">Who's Going</h3>
              <span className="text-xs font-bold text-primary">{rally.going} / {rally.maxSpots} spots</span>
            </div>
            <div className="flex -space-x-3">
              {Array.from({ length: rally.going }).map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1a1a1a] bg-gray-700 flex items-center justify-center text-xs font-bold text-white z-10">
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              {Array.from({ length: rally.maxSpots - rally.going }).map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1a1a1a] border-dashed border-gray-700 flex items-center justify-center text-gray-600 z-0">
                  ?
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto p-4 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d] to-transparent pt-12 pb-6 z-50">
          {rally.joined ? (
            <Link href={`/chat/${rally.id}`}>
              <Button className="w-full bg-primary hover:bg-primary/90 text-black font-bold text-lg rounded-xl h-14 shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                <MessageCircle className="w-5 h-5 mr-2" /> Open Chat
              </Button>
            </Link>
          ) : (
            <Button onClick={handleJoin} className="w-full bg-primary hover:bg-primary/90 text-black font-bold text-lg rounded-xl h-14 shadow-[0_0_15px_rgba(250,204,21,0.3)]">
              {rally.requiresApproval ? "Request to Join" : "Join Rally"}
            </Button>
          )}
        </div>

        <div className="text-center mt-8 pb-12">
          <button onClick={() => setReportOpen(true)} className="text-xs text-gray-600 hover:text-gray-400 flex items-center justify-center w-full gap-1">
            <AlertTriangle className="w-3 h-3" /> Report Rally
          </button>
        </div>
      </div>
      <ReportModal open={reportOpen} onOpenChange={setReportOpen} />
    </div>
  );
}