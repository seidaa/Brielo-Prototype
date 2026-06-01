import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  UserPlus, MessageCircle, BadgeCheck, RotateCcw, CalendarX, BellOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationItem = {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  text: string;
  time: string;
};

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", icon: UserPlus,      iconColor: "text-primary",      text: "Marcus L. joined Leg Day at XSport",            time: "2m ago"  },
  { id: "n2", icon: MessageCircle, iconColor: "text-sky-400",      text: "Priya S. sent a message in Sunday Coffee Run", time: "18m ago" },
  { id: "n3", icon: BadgeCheck,    iconColor: "text-primary",      text: "Your spot is saved for Grocery run",           time: "1h ago"  },
  { id: "n4", icon: RotateCcw,     iconColor: "text-emerald-400",  text: "Jordan K. would move again",                   time: "3h ago"  },
  { id: "n5", icon: CalendarX,     iconColor: "text-gray-400",     text: "Move canceled. Chat closed.",                  time: "Yesterday" },
];

interface NotificationsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationsSheet({ open, onOpenChange }: NotificationsSheetProps) {
  const notifications = MOCK_NOTIFICATIONS;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-w-sm mx-auto rounded-t-3xl bg-[#161616] border-t border-white/10 p-0 pb-8"
      >
        <SheetHeader className="px-5 pt-5 pb-3 text-left">
          <SheetTitle className="text-white text-lg font-black">Notifications</SheetTitle>
        </SheetHeader>

        {notifications.length === 0 ? (
          <div className="px-5 py-12 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
              <BellOff className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-bold text-gray-400">You're all caught up.</p>
          </div>
        ) : (
          <div className="px-3 space-y-1 max-h-[60vh] overflow-y-auto no-scrollbar">
            {notifications.map(n => {
              const Icon = n.icon;
              return (
                <div
                  key={n.id}
                  className="flex items-center gap-3 px-2.5 py-3 rounded-xl active:bg-white/5 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                    <Icon className={cn("w-4 h-4", n.iconColor)} strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-gray-200 leading-snug">{n.text}</p>
                    <p className="text-[10px] font-bold text-gray-600 mt-0.5">{n.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
