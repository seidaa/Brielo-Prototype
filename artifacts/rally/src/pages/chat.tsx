import { Link } from "wouter";
import { MessageCircle } from "lucide-react";
import { useRallies } from "@/hooks/useRallies";
import { BottomNav } from "@/components/BottomNav";

export default function ChatList() {
  const { rallies } = useRallies();
  const joinedRallies = rallies.filter(r => r.joined);

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-24 pt-16">
      <header className="fixed top-0 left-0 right-0 max-w-sm mx-auto bg-[#0d0d0d]/90 backdrop-blur-md z-40 px-4 h-16 flex items-center border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Chat</h1>
      </header>

      <div className="p-4 space-y-4">
        {joinedRallies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-gray-600" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No Chats Yet</h2>
            <p className="text-sm text-gray-400 max-w-[200px]">Join a Rally to unlock its chat and coordinate with others.</p>
          </div>
        ) : (
          joinedRallies.map(rally => (
            <Link key={rally.id} href={`/chat/${rally.id}`}>
              <div className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-2xl border border-gray-800 hover:bg-gray-900 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-lg">{rally.title.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-white truncate">{rally.title}</h3>
                    <span className="text-[10px] text-gray-500 flex-shrink-0">{rally.time}</span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">Tap to open chat</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}