import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportModal({ open, onOpenChange }: ReportModalProps) {
  const { toast } = useToast();

  const options = [
    { label: "Something feels off", emoji: "😶" },
    { label: "No one showed up", emoji: "👻" },
    { label: "Harassment or unsafe behavior", emoji: "🚫" },
    { label: "Spam or fake move", emoji: "⚠️" },
    { label: "Other", emoji: "📝" },
  ];

  const handleReport = (_reason: string) => {
    onOpenChange(false);
    toast({
      title: "Report submitted",
      description: "Thanks for letting us know. We'll look into it.",
      duration: 3000,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-[320px] rounded-2xl bg-[#1a1a1a] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Report this Move</DialogTitle>
          <DialogDescription className="text-gray-400">
            Your report is anonymous. What's going on?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-2">
          {options.map(({ label, emoji }) => (
            <Button
              key={label}
              variant="outline"
              className="justify-start bg-white/5 border-white/8 hover:bg-white/10 text-left rounded-xl text-gray-200 gap-2.5 h-auto py-3"
              onClick={() => handleReport(label)}
            >
              <span className="text-base shrink-0">{emoji}</span>
              <span className="text-sm font-medium">{label}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
