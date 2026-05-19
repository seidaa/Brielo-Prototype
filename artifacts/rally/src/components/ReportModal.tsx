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
    "Something feels off",
    "Fake rally / no one showed up",
    "Harassment or creepy behavior",
    "Spam/scam",
    "Other"
  ];

  const handleReport = (reason: string) => {
    onOpenChange(false);
    toast({
      title: "Report submitted",
      description: "We'll review shortly.",
      duration: 3000,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-[320px] rounded-2xl bg-[#1a1a1a] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Report Rally</DialogTitle>
          <DialogDescription className="text-gray-400">
            What's going on? Your report is anonymous.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-4">
          {options.map((opt) => (
            <Button 
              key={opt} 
              variant="outline" 
              className="justify-start bg-gray-800/50 border-gray-700 hover:bg-gray-800 text-left rounded-xl"
              onClick={() => handleReport(opt)}
            >
              {opt}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
