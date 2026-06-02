import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const REASONS = [
  "Plans changed",
  "Timing no longer works",
  "Location feels off",
  "Host communication felt unclear",
  "Something feels uncomfortable",
  "Other",
];

// Leave Move confirmation with an OPTIONAL reason. Leaving stays easy and fair —
// no reason is ever required, and leaving is never a no-show or trust penalty.
// Any reason given is private / moderation-facing (saved via the page's
// leaveRally) and is never shown publicly or used as a review.
export function LeaveMoveModal({ open, onOpenChange, onConfirm }: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: (reason: { reasonType: string; details: string } | null) => void;
}) {
  const [reasonType, setReasonType] = useState<string | null>(null);
  const [details, setDetails] = useState("");

  const reset = () => { setReasonType(null); setDetails(""); };
  const close = () => { reset(); onOpenChange(false); };

  const handleLeave = () => {
    const trimmed = details.trim();
    const hasReason = !!reasonType || trimmed.length > 0;
    onConfirm(hasReason ? { reasonType: reasonType ?? "", details: trimmed } : null);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) close(); }}>
      <DialogContent className="w-[90%] max-w-[340px] rounded-2xl bg-[#1a1a1a] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Leave this Move?</DialogTitle>
          <DialogDescription className="text-gray-400 leading-relaxed">
            Leaving ahead of time isn't a no-show — your spot simply opens back up for someone else.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-1">
          <p className="text-[13px] font-bold text-gray-200">Want to share why?</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Optional. This helps us understand what happened.</p>

          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {REASONS.map(r => {
              const active = reasonType === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReasonType(active ? null : r)}
                  className={cn(
                    "text-[12px] font-medium px-3 py-1.5 rounded-full border transition-colors active:scale-95",
                    active
                      ? "bg-primary/15 border-primary/40 text-primary"
                      : "bg-white/5 border-white/8 text-gray-300 hover:bg-white/10",
                  )}
                >
                  {r}
                </button>
              );
            })}
          </div>

          <textarea
            value={details}
            onChange={e => setDetails(e.target.value)}
            rows={2}
            placeholder="Add details if you want…"
            className="w-full resize-none rounded-xl bg-black/30 border border-white/10 text-sm text-white placeholder:text-gray-600 px-3 py-2.5 mt-2.5 leading-relaxed focus:outline-none focus:border-primary/40"
          />
        </div>

        <div className="flex gap-2 mt-1">
          <Button
            variant="outline"
            className="flex-1 bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 rounded-xl"
            onClick={close}
          >
            Stay In
          </Button>
          <Button
            className="flex-1 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-bold rounded-xl"
            onClick={handleLeave}
          >
            Leave Move
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
