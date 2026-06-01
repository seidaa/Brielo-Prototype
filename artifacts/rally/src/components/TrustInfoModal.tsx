import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { ShieldCheck } from "lucide-react";
import { TRUST_INFO } from "@/lib/trust";

export function TrustInfoModal({ open, onOpenChange }: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-[360px] rounded-2xl bg-[#1a1a1a] border-white/10 text-white max-h-[82vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-11 h-11 rounded-xl bg-primary/12 border border-primary/25 flex items-center justify-center mb-1">
            <ShieldCheck className="w-5 h-5 text-primary" strokeWidth={1.75} />
          </div>
          <DialogTitle className="text-white">{TRUST_INFO.title}</DialogTitle>
          <DialogDescription className="text-gray-400 leading-relaxed">
            {TRUST_INFO.intro}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2.5 mt-1">
          {TRUST_INFO.points.map(p => (
            <div key={p.title} className="bg-[#161616] border border-white/5 rounded-xl p-3">
              <p className="text-sm font-bold text-white mb-0.5">{p.title}</p>
              <p className="text-[12px] text-gray-400 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
