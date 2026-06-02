import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarCheck } from "lucide-react";
import { Move } from "@/data/mockData";
import { spotsLeft } from "@/lib/trust";

export function JoinCommitmentModal({ open, onOpenChange, move, onConfirm }: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  move: Pick<Move, "title" | "going" | "maxSpots"> | null;
  onConfirm: () => void;
}) {
  if (!move) return null;
  const left = spotsLeft(move);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-[340px] rounded-2xl bg-[#1a1a1a] border-white/10 text-white">
        <DialogHeader>
          <div className="w-11 h-11 rounded-xl bg-primary/12 border border-primary/25 flex items-center justify-center mb-1">
            <CalendarCheck className="w-5 h-5 text-primary" strokeWidth={1.75} />
          </div>
          <DialogTitle className="text-white">Save your spot?</DialogTitle>
          <DialogDescription className="text-gray-300 leading-relaxed">
            {left} spot{left === 1 ? "" : "s"} left for{" "}
            <span className="text-white font-semibold">{move.title}</span>.
          </DialogDescription>
        </DialogHeader>
        <p className="text-[13px] text-gray-400 leading-relaxed -mt-1">
          Only join if you plan to show. When you save a spot, someone else may miss out.
        </p>
        <div className="flex flex-col gap-2 mt-2">
          <Button
            onClick={onConfirm}
            className="w-full bg-primary hover:bg-primary/90 text-black font-black rounded-xl h-12"
          >
            I'm In — Save My Spot
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 rounded-xl h-11 font-bold"
          >
            Not yet
          </Button>
        </div>
        <p className="text-[11px] text-gray-600 text-center mt-1 leading-relaxed">
          Things come up. Leaving before it starts opens your spot back up and does not count as a
          no-show.
        </p>
      </DialogContent>
    </Dialog>
  );
}
