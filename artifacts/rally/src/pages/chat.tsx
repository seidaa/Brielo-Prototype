import { Link } from "wouter";
import { MessageCircle, ChevronRight, Zap } from "lucide-react";
import { useRallies } from "@/hooks/useRallies";
import { BottomNav } from "@/components/BottomNav";
import { CAT_CONFIG, defaultCatConfig } from "@/data/mockData";
import { cn } from "@/lib/utils";

const LAST_MESSAGES: Record<string, { text: string; sender: string; unread: number }> = {
  r1: { text: "Which entrance are you at?", sender: "Marcus L.", unread: 1 },
  r2: { text: "I grabbed the corner table 🙌", sender: "Priya S.", unread: 0 },
  r3: { text: "Yeah we need 1 more anyway", sender: "Marcus L.", unread: 2 },
};

export default function ChatList() {
  const { rallies } = useRallies();
  const joinedRallies = rallies.filter(r => r.joined);
  const totalUnread = joinedRallies.reduce((sum, r) => sum + (LAST_MESSAGES[r.id]?.unread ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-24 pt-14">
      <header className="fixed top-0 left-0 right-0 max-w-sm mx-auto bg-[#0d0d0d]/95 backdrop-blur-xl z-40 px-4 h-14 flex items-center border-b border-white/5">
        <h1 className="text-lg font-black text-white flex-1">Chat</h1>
        {totalUnread > 0 && (
          <span className="bg-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full">
            {totalUnread} new
          </span>
        )}
      </header>

      <div className="p-4">
        {joinedRallies.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mb-5">
              <MessageCircle className="w-9 h-9 text-gray-600" />
            </div>
            <h2 className="text-xl font-black text-white mb-2">No chats yet</h2>
            <p className="text-sm text-gray-500 max-w-[200px] mb-6">
              Join a rally to unlock its group chat and coordinate with others in real time.
            </p>
            <div className="flex flex-col items-center gap-2 bg-white/3 border border-white/8 rounded-2xl p-4 w-full text-left">
              <div className="flex items-center gap-2 text-xs text-gray-400 w-full">
                <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
                Chat unlocks when you join a rally
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 w-full">
                <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
                Chat expires when the rally ends
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 w-full">
                <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
                All conversations are ephemeral
              </div>
            </div>
            <Link href="/discover" className="mt-6">
              <span className="text-sm font-bold text-primary">Browse Rallies →</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {joinedRallies.map(rally => {
              const cat = CAT_CONFIG[rally.category] ?? defaultCatConfig;
              const lastMsg = LAST_MESSAGES[rally.id];
              const hasUnread = (lastMsg?.unread ?? 0) > 0;

              return (
                <Link key={rally.id} href={`/chat/${rally.id}`}>
                  <div className={cn(
                    "flex items-center gap-3 p-3.5 rounded-2xl border transition-all active:scale-[0.99]",
                    hasUnread
                      ? "bg-white/5 border-white/10"
                      : "bg-[#141414] border-white/5"
                  )}>
                    {/* Category avatar */}
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0", cat.color)}>
                      {cat.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className={cn("font-bold truncate text-sm", hasUnread ? "text-white" : "text-gray-300")}>
                          {rally.title}
                        </h3>
                        <span className="text-[10px] text-gray-600 shrink-0 ml-2">{rally.time}</span>
                      </div>
                      {lastMsg ? (
                        <p className={cn("text-xs truncate", hasUnread ? "text-gray-300" : "text-gray-600")}>
                          <span className="font-medium">{lastMsg.sender}:</span> {lastMsg.text}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-600">Tap to open chat</p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {hasUnread && (
                        <span className="min-w-[18px] h-[18px] bg-primary text-black text-[10px] font-black rounded-full flex items-center justify-center px-1">
                          {lastMsg.unread}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-700" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
