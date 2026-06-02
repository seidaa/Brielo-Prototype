import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircleQuestion } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { pushNotification } from "@/lib/notifications";

const PRESETS = [
  "Is this beginner friendly?",
  "Can I bring a friend?",
  "Where should we meet?",
  "What should I bring?",
];

// Lightweight prototype "ask a question before joining" sheet. This is NOT a join
// request — it never touches the Move's going count, spots, or chat. Front-end
// only: it just fires a toast + notification so the flow feels real.
export function AskHostModal({ open, onOpenChange, moveName }: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  moveName: string;
}) {
  const { toast } = useToast();
  const [question, setQuestion] = useState("");

  const close = () => { setQuestion(""); onOpenChange(false); };

  const handleSend = () => {
    if (!question.trim()) return;
    pushNotification("question", `Question sent to host for ${moveName}.`);
    toast({ title: "Question sent to host." });
    close();
  };

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) close(); }}>
      <DialogContent className="w-[90%] max-w-[340px] rounded-2xl bg-[#1a1a1a] border-white/10 text-white">
        <DialogHeader>
          <div className="w-11 h-11 rounded-xl bg-primary/12 border border-primary/25 flex items-center justify-center mb-1">
            <MessageCircleQuestion className="w-5 h-5 text-primary" strokeWidth={1.75} />
          </div>
          <DialogTitle className="text-white">Ask Host</DialogTitle>
          <DialogDescription className="text-gray-300 leading-relaxed">
            Send a quick question before joining.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-1.5 -mt-1">
          {PRESETS.map(p => (
            <button
              key={p}
              onClick={() => setQuestion(p)}
              className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:border-primary/40 hover:text-white transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          rows={3}
          placeholder="Type your question…"
          className="w-full resize-none rounded-xl bg-black/30 border border-white/10 text-sm text-white placeholder:text-gray-600 px-3 py-2.5 leading-relaxed focus:outline-none focus:border-primary/40"
        />

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={close}
            className="flex-1 bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 rounded-xl h-11 font-bold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={!question.trim()}
            className="flex-1 bg-primary hover:bg-primary/90 text-black font-black rounded-xl h-11 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
