import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  BadgeCheck, LogOut, Megaphone, CalendarX, Heart, BellOff,
  Hourglass, MessageCircleQuestion, ShieldCheck, Flag,
} from "lucide-react";
import { useNotifications } from "@/hooks/useRallies";
import { relativeTime, NotifKind } from "@/lib/notifications";
import { cn } from "@/lib/utils";

const KIND_META: Record<NotifKind, { icon: React.ElementType; color: string }> = {
  join:     { icon: BadgeCheck, color: "text-primary"      },
  leave:    { icon: LogOut,     color: "text-gray-400"     },
  create:   { icon: Megaphone,  color: "text-primary"      },
  cancel:   { icon: CalendarX,  color: "text-red-400"      },
  feedback: { icon: Heart,      color: "text-emerald-400"  },
  request:  { icon: Hourglass,  color: "text-primary"      },
  question: { icon: MessageCircleQuestion, color: "text-gray-300" },
  safety:   { icon: ShieldCheck, color: "text-primary"     },
  report:   { icon: Flag,       color: "text-red-400"      },
};

interface NotificationsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationsSheet({ open, onOpenChange }: NotificationsSheetProps) {
  const { notifications } = useNotifications();

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
              const meta = KIND_META[n.kind];
              const Icon = meta.icon;
              return (
                <div
                  key={n.id}
                  className={cn(
                    "flex items-center gap-3 px-2.5 py-3 rounded-xl transition-colors",
                    n.read ? "active:bg-white/5" : "bg-primary/[0.06]"
                  )}
                >
                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                    <Icon className={cn("w-4 h-4", meta.color)} strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-gray-200 leading-snug">{n.text}</p>
                    <p className="text-[10px] font-bold text-gray-600 mt-0.5">{relativeTime(n.createdAt)}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                </div>
              );
            })}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
