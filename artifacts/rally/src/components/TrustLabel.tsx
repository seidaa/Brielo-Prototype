import { TrustLabel as TrustLabelType, WarningLabel } from "@/data/mockData";
import { TRUST_LABEL_STYLES, WARNING_LABEL_STYLES } from "@/lib/trust";
import { cn } from "@/lib/utils";

type Size = "xs" | "sm";

export function TrustChip({ label, size = "sm", className }: { label: TrustLabelType; size?: Size; className?: string }) {
  const style = TRUST_LABEL_STYLES[label];
  if (!style) return null;
  const { Icon } = style;
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full border font-bold whitespace-nowrap",
      style.className,
      size === "xs" ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]",
      className,
    )}>
      <Icon className={size === "xs" ? "w-2.5 h-2.5" : "w-3 h-3"} strokeWidth={2} />
      {label}
    </span>
  );
}

export function WarningChip({ label, size = "sm", className }: { label: WarningLabel; size?: Size; className?: string }) {
  const style = WARNING_LABEL_STYLES[label];
  if (!style) return null;
  const { Icon } = style;
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full border font-bold whitespace-nowrap",
      style.className,
      size === "xs" ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]",
      className,
    )}>
      <Icon className={size === "xs" ? "w-2.5 h-2.5" : "w-3 h-3"} strokeWidth={2} />
      {label}
    </span>
  );
}
