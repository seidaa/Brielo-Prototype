import { cn } from "@/lib/utils";

type BrioLogoSize = "sm" | "md" | "lg" | "xl" | "hero";

const SIZE_MAP: Record<BrioLogoSize, string> = {
  sm:   "text-lg",
  md:   "text-2xl",
  lg:   "text-4xl",
  xl:   "text-5xl",
  hero: "text-[52px]",
};

interface BrioLogoProps {
  size?: BrioLogoSize;
  className?: string;
}

export function BrioLogo({ size = "md", className }: BrioLogoProps) {
  const fontSize = SIZE_MAP[size];

  return (
    <span className={cn("inline-flex items-baseline select-none", className)}>
      {/* "Br" */}
      <span className={cn("font-black text-white tracking-tight leading-none", fontSize)}>
        Br
      </span>

      {/* "i" with yellow ring above */}
      <span className="relative">
        <span className={cn("font-black text-white tracking-tight leading-none", fontSize)}>
          i
        </span>
        {/* Yellow i-dot ring — em-scaled so it fits every size */}
        <span
          className="absolute left-1/2 rounded-full border-[#FACC15] bg-transparent pointer-events-none"
          style={{
            width:       "0.34em",
            height:      "0.34em",
            borderWidth: "0.065em",
            top:         "-0.55em",
            transform:   "translateX(-50%)",
          }}
        />
      </span>

      {/* "o" */}
      <span className={cn("font-black text-white tracking-tight leading-none", fontSize)}>
        o
      </span>
    </span>
  );
}

/** Standalone i-dot ring — used as the app icon mark */
export function BrioMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-[22px] bg-white/5 border border-white/8 shadow-[0_0_50px_rgba(250,204,21,0.22)]",
        className
      )}
    >
      {/* ring */}
      <div className="w-[45%] h-[45%] rounded-full border-[#FACC15]"
        style={{ borderWidth: "12%" }} />
    </div>
  );
}
