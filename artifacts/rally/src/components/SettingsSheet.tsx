import { useState } from "react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  UserCog, Lock, Bell, ShieldCheck, Ban, Flag,
  Sun, Moon, MonitorSmartphone, ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Row = { id: string; icon: React.ElementType; label: string };

const ACCOUNT_ROWS: Row[] = [
  { id: "edit",     icon: UserCog, label: "Edit Profile" },
  { id: "privacy",  icon: Lock,    label: "Privacy" },
  { id: "notifs",   icon: Bell,    label: "Notifications" },
];

const SAFETY_ROWS: Row[] = [
  { id: "trust",    icon: ShieldCheck, label: "Show-Up Trust" },
  { id: "blocked",  icon: Ban,         label: "Blocked users" },
  { id: "report",   icon: Flag,        label: "Report a problem" },
];

const THEME_OPTIONS = [
  { id: "auto",  icon: MonitorSmartphone, label: "Auto" },
  { id: "light", icon: Sun,               label: "Light" },
  { id: "dark",  icon: Moon,              label: "Dark" },
];

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsSheet({ open, onOpenChange }: SettingsSheetProps) {
  const { toast } = useToast();
  // The prototype is dark-only; Light/Auto aren't wired to a real theme system.
  const [theme] = useState("dark");

  const comingSoon = () => toast({ title: "Coming soon in the prototype." });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-w-sm mx-auto rounded-t-3xl bg-[#161616] border-t border-white/10 p-0 pb-8"
      >
        <SheetHeader className="px-5 pt-5 pb-3 text-left">
          <SheetTitle className="text-white text-lg font-black">Settings</SheetTitle>
        </SheetHeader>

        <div className="px-4 space-y-5 max-h-[68vh] overflow-y-auto no-scrollbar pb-2">
          {/* Account */}
          <Section title="Account">
            {ACCOUNT_ROWS.map(r => <SettingRow key={r.id} row={r} onTap={comingSoon} />)}
          </Section>

          {/* Appearance */}
          <Section title="Appearance">
            <div className="rounded-xl bg-white/[0.03] border border-white/8 p-3">
              <p className="text-[13px] font-bold text-gray-200 mb-2.5">Theme</p>
              <div className="grid grid-cols-3 gap-2">
                {THEME_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  const active = opt.id === theme;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => { if (!active) comingSoon(); }}
                      className={cn(
                        "flex flex-col items-center gap-1.5 py-2.5 rounded-lg border text-[11px] font-bold transition-colors active:scale-95",
                        active
                          ? "bg-primary/15 border-primary/30 text-primary"
                          : "bg-white/[0.03] border-white/8 text-gray-400"
                      )}
                    >
                      <Icon className="w-4 h-4" strokeWidth={1.75} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </Section>

          {/* Trust & Safety */}
          <Section title="Trust & Safety">
            {SAFETY_ROWS.map(r => <SettingRow key={r.id} row={r} onTap={comingSoon} />)}
          </Section>

          {/* About */}
          <Section title="About Brielo">
            <div className="rounded-xl bg-white/[0.03] border border-white/8 px-3.5 py-3 text-center">
              <p className="text-sm font-black text-white">Live More</p>
              <p className="text-[11px] font-bold text-gray-500 mt-0.5">Version 0.1 prototype</p>
            </div>
          </Section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-black text-gray-600 uppercase tracking-wider mb-2 px-1">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function SettingRow({ row, onTap }: { row: Row; onTap: () => void }) {
  const Icon = row.icon;
  return (
    <button
      onClick={onTap}
      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl bg-white/[0.03] border border-white/8 active:bg-white/[0.06] transition-colors"
    >
      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-gray-300" strokeWidth={1.75} />
      </div>
      <span className="text-[13px] font-bold text-gray-200 flex-1 text-left">{row.label}</span>
      <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
    </button>
  );
}
