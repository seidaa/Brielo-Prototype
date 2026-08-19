import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "wouter";
import { ChevronLeft, Send, Users, Info, Lock, MessageCircle } from "lucide-react";
import { useRallies, useMessages } from "@/hooks/useRallies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AVATAR_COLORS: Record<string, string> = {
  "Marcus L.": "bg-orange-500",
  "Priya S.": "bg-pink-500",
  "Jordan K.": "bg-blue-500",
  "Alex T.": "bg-purple-500",
  "Sofia R.": "bg-green-500",
  "Devon A.": "bg-amber-500",
};

export default function ChatDetail() {
  const { id } = useParams<{ id: string }>();
  const { rallies } = useRallies();
  const move = rallies.find(r => r.id === id);
  const { messages, sendMessage } = useMessages(id ?? "");
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!move) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <div className="text-center">
        <p className="text-white font-bold mb-2">Move not found</p>
        <Link href="/chat"><span className="text-primary text-sm">â† Back to chats</span></Link>
      </div>
    </div>
  );

  if (!move.joined) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mx-auto mb-5">
          <Lock className="w-7 h-7 text-gray-500" strokeWidth={1.75} />
        </div>
        <p className="text-white font-bold mb-2">Move Chat is locked</p>
        <p className="text-sm text-gray-500 max-w-[240px] mx-auto mb-6">
          Move Chat opens after you join an active Move.
        </p>
        <div className="flex flex-col gap-3 items-center">
          <Link href={`/rally/${move.id}`}>
            <span className="text-primary text-sm font-bold">Open Move details</span>
          </Link>
          <Link href="/chat">
            <span className="text-gray-500 text-sm">Back to chats</span>
          </Link>
        </div>
      </div>
    </div>
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d0d]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 max-w-sm mx-auto bg-[#0d0d0d]/95 backdrop-blur-xl z-40 px-4 h-14 flex items-center gap-3 border-b border-white/5">
        <Link href="/chat" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/5 shrink-0">
          <ChevronLeft className="w-5 h-5 text-white" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-black text-white truncate leading-tight">{move.title}</h1>
          <p className="text-[11px] text-gray-500 flex items-center gap-1">
            <Users className="w-3 h-3" /> {move.going} in Â· {move.time}
          </p>
        </div>
        <Link href={`/rally/${move.id}`}>
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/5 shrink-0">
            <Info className="w-4 h-4 text-gray-400" />
          </button>
        </Link>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pt-16 pb-20 px-4 space-y-3">
        <div className="flex justify-center my-2">
          <span className="flex items-center gap-1 text-[10px] text-gray-600 bg-white/3 border border-white/5 px-3 py-1.5 rounded-full">
            <Lock className="w-3 h-3" /> Move Chat expires when the move ends
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="w-8 h-8 mb-3 text-gray-600" strokeWidth={1.75} />
            <p className="text-sm font-bold text-white mb-1">Start the conversation</p>
            <p className="text-xs text-gray-500">Let everyone know you're in!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const showName = !msg.isMe && (idx === 0 || messages[idx - 1]?.senderName !== msg.senderName);
            const avatarColor = AVATAR_COLORS[msg.senderName] ?? "bg-gray-600";

            return (
              <div key={msg.id} className={cn("flex gap-2", msg.isMe ? "flex-row-reverse" : "flex-row")}>
                {!msg.isMe && (
                  <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 mt-auto", avatarColor)}>
                    {msg.senderName.charAt(0)}
                  </div>
                )}
                <div className={cn("flex flex-col max-w-[75%]", msg.isMe ? "items-end" : "items-start")}>
                  {showName && (
                    <span className="text-[10px] text-gray-500 mb-1 mx-1">{msg.senderName}</span>
                  )}
                  <div className={cn(
                    "rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                    msg.isMe
                      ? "bg-primary text-black font-medium rounded-tr-sm"
                      : "bg-[#1e1e1e] text-white border border-white/5 rounded-tl-sm"
                  )}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-[#0d0d0d]/95 backdrop-blur-xl border-t border-white/5 p-3 pb-safe">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Message the group..."
            className="flex-1 bg-[#1a1a1a] border-white/8 text-white rounded-full h-11 text-sm placeholder:text-gray-600 focus-visible:border-primary/40"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!text.trim()}
            className="h-11 w-11 rounded-full bg-primary hover:bg-primary/90 text-black shrink-0 disabled:opacity-40 shadow-[0_0_12px_rgba(250,204,21,0.25)]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
