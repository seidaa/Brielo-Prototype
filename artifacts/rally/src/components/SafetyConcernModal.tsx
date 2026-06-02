import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { pushNotification } from "@/lib/notifications";
import { saveSafetyReport, ReportContext } from "@/lib/safetyReports";

const OPTIONS = [
  "Move details seem misleading",
  "Location feels unsafe",
  "Host feels suspicious",
  "Spam or scam",
  "I'm uncomfortable with this Move",
  "Other",
];

// Softer, private "Something feels off" safety note. NOT a public report and NOT a
// penalty — it only saves a moderation-facing note (brio_safety_reports) plus a
// mock notification. Used pre-Move on Move Detail and as the gentle post-Move
// "Felt off" follow-up.
export function SafetyConcernModal({ open, onOpenChange, moveId, moveName, context = "preMove" }: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  moveId: string;
  moveName: string;
  context?: ReportContext;
}) {
  const { toast } = useToast();
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState("");

  const reset = () => { setReason(null); setDetails(""); };
  const close = () => { reset(); onOpenChange(false); };

  const handleSend = () => {
    if (!reason) return;
    saveSafetyReport({ moveId, moveName, reportContext: context, reportType: reason, details: details.trim() });
    pushNotification("safety", "Your safety note was sent for review.");
    toast({ title: "Thanks. We'll review this." });
    close();
  };

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) close(); }}>
      <DialogContent className="w-[90%] max-w-[340px] rounded-2xl bg-[#1a1a1a] border-white/10 text-white">
        <DialogHeader>
          <div className="w-11 h-11 rounded-xl bg-primary/12 border border-primary/25 flex items-center justify-center mb-1">
            <ShieldAlert className="w-5 h-5 text-primary" strokeWidth={1.75} />
          </div>
          <DialogTitle className="text-white">Something feels off?</DialogTitle>
          <DialogDescription className="text-gray-300 leading-relaxed">
            Tell us what's making you unsure. We'll use this to review the Move.
          </DialogDescription>
        </DialogHeader>

        {!reason ? (
          <div className="flex flex-col gap-2">
            {OPTIONS.map(o => (
              <Button
                key={o}
                variant="outline"
                className="justify-start bg-white/5 border-white/8 hover:bg-white/10 text-left rounded-xl text-gray-200 h-auto py-3 text-sm font-medium"
                onClick={() => setReason(o)}
              >
                {o}
              </Button>
            ))}
          </div>
        ) : (
          <>
            <button
              onClick={() => setReason(null)}
              className="flex items-center gap-1 text-[12px] font-bold text-gray-400 hover:text-white transition-colors -mt-1 self-start"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> {reason}
            </button>
            <div>
              <label className="text-[12px] font-bold text-gray-400 mb-1.5 block">Add a few details</label>
              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                rows={3}
                placeholder="What happened or what feels off?"
                className="w-full resize-none rounded-xl bg-black/30 border border-white/10 text-sm text-white placeholder:text-gray-600 px-3 py-2.5 leading-relaxed focus:outline-none focus:border-primary/40"
              />
            </div>
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
                className="flex-1 bg-primary hover:bg-primary/90 text-black font-black rounded-xl h-11"
              >
                Send for Review
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
