import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserX, EyeOff, Ban, AlertTriangle, Trash2, FileText, ShieldCheck } from "lucide-react";

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: "move" | "person";
}

export function ReportModal({ open, onOpenChange, context = "move" }: ReportModalProps) {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const options = [
    { label: "No-show",         icon: UserX },
    { label: "Creepy behavior", icon: EyeOff },
    { label: "Harassment",      icon: Ban },
    { label: "Fake Move",       icon: AlertTriangle },
    { label: "Spam / scam",     icon: Trash2 },
    { label: "Other",           icon: FileText },
  ];

  const handleReport = (_reason: string) => {
    setSubmitted(true);
    setTimeout(() => {
      onOpenChange(false);
      setSubmitted(false);
      toast({
        title: "Thanks. We'll review this.",
        description: "Your feedback is private and never shown publicly.",
        duration: 3000,
      });
    }, 1400);
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!submitted) onOpenChange(v); }}>
      <DialogContent className="w-[90%] max-w-[320px] rounded-2xl bg-[#1a1a1a] border-white/10 text-white">
        {submitted ? (
          <div className="py-6 flex flex-col items-center text-center gap-3">
            <ShieldCheck className="w-10 h-10 text-primary" strokeWidth={1.75} />
            <h3 className="font-black text-white text-base">Thanks. We'll review this.</h3>
            <p className="text-sm text-gray-400">Your feedback is private and never shown publicly.</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-white">
                {context === "person" ? "Report this person" : "Report this Move"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Tell us what happened. Your report is anonymous.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 mt-2">
              {options.map(({ label, icon: Icon }) => (
                <Button
                  key={label}
                  variant="outline"
                  className="justify-start bg-white/5 border-white/8 hover:bg-white/10 text-left rounded-xl text-gray-200 gap-2.5 h-auto py-3"
                  onClick={() => handleReport(label)}
                >
                  <Icon className="w-4 h-4 shrink-0 text-gray-400" strokeWidth={1.75} />
                  <span className="text-sm font-medium">{label}</span>
                </Button>
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
