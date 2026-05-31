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

      {/*
        "i" rendered as dotless-ı (U+0131) so the natural white dot is gone,
        then a yellow ring is placed at exactly the dot position.
      */}
      <span className="relative inline-block leading-none">
        {/* Dotless i stem */}
        <span className={cn("font-black text-white tracking-tight leading-none", fontSize)}>
          ı
        </span>

        {/* Yellow ring — anchored from bottom so it lands at the natural i-dot height */}
        <span
          className="absolute left-1/2 rounded-full pointer-events-none"
          style={{
            width:           "0.38em",
            height:          "0.38em",
            border:          "0.072em solid #FACC15",
            backgroundColor: "transparent",
            // bottom: distance from container base (~descender) up to ring bottom
            // puts ring center at ~0.78em above baseline (natural i-dot position)
            bottom:    "0.86em",
            transform: "translateX(-50%)",
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

/** Standalone ring mark — app icon */
export function BrioMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-[22px] bg-white/5 border border-white/8 shadow-[0_0_50px_rgba(250,204,21,0.22)]",
        className
      )}
    >
      <div
        className="rounded-full"
        style={{ width: "44%", height: "44%", border: "11% solid #FACC15" }}
      />
    </div>
  );
}
