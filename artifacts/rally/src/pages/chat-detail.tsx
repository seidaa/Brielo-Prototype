import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "wouter";
import { ChevronLeft, Send } from "lucide-react";
import { useRallies, useMessages } from "@/hooks/useRallies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChatDetail() {
  const { id } = useParams<{ id: string }>();
  const { rallies } = useRallies();
  const rally = rallies.find(r => r.id === id);
  const { messages, sendMessage } = useMessages(id || "");
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!rally) return <div className="p-8 text-white">Rally not found.</div>;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d0d]">
      <header className="fixed top-0 left-0 right-0 max-w-sm mx-auto bg-[#0d0d0d]/90 backdrop-blur-md z-40 px-4 h-16 flex items-center border-b border-gray-800">
        <Link href="/chat" className="mr-3">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-white truncate">{rally.title}</h1>
          <p className="text-xs text-gray-400 truncate">{rally.going} going</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pt-20 pb-20 px-4 space-y-4">
        {messages.map((msg, idx) => {
          const showName = !msg.isMe && (idx === 0 || messages[idx - 1].senderName !== msg.senderName);
          
          return (
            <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
              {showName && <span className="text-xs text-gray-500 mb-1 ml-1">{msg.senderName}</span>}
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  msg.isMe 
                    ? 'bg-primary text-black rounded-tr-sm' 
                    : 'bg-[#1a1a1a] text-white border border-gray-800 rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-[#0d0d0d] border-t border-gray-800 p-4 pb-safe">
        <div className="text-center mb-2">
          <span className="text-[10px] text-gray-600">This chat expires after the Rally ends.</span>
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          <Input 
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Message..." 
            className="flex-1 bg-[#1a1a1a] border-gray-800 text-white rounded-full h-12"
          />
          <Button type="submit" size="icon" className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-black shrink-0">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}