import { cn } from "@/lib/utils";

type BrioLogoSize = "sm" | "md" | "lg" | "xl" | "hero";

const SIZE_MAP: Record<BrioLogoSize, string> = {
  sm:   "text-lg",
  md:   "text-2xl",
  lg:   "text-4xl",
  xl:   "text-5xl",
  hero: "text-[52px]",
};

/**
 * How this works:
 *
 * 1. Render "i" normally in white — the font's natural dot is white too.
 * 2. Stack a solid yellow circle directly on the dot → paints over it yellow.
 * 3. Stack a slightly-smaller circle in the background color on top → carves a
 *    hole in the middle, turning the yellow disc into a yellow ring.
 *
 * All sizes are in `em` so they scale with the font automatically.
 * The `bg` prop lets callers pass the local background colour for step 3.
 * Both the onboarding page and nav header are #0d0d0d, so the default works.
 */
interface BrioLogoProps {
  size?: BrioLogoSize;
  className?: string;
  /** Match the surface colour behind the logo so the ring cutout is invisible. */
  bg?: string;
}

export function BrioLogo({ size = "md", className, bg = "#0d0d0d" }: BrioLogoProps) {
  const fontSize = SIZE_MAP[size];

  // Ring geometry (em units, relative to the "i" span's font-size)
  const outerD   = "0.28em"; // yellow disc diameter — covers natural dot
  const innerD   = "0.13em"; // dark cutout diameter — creates the hole
  // Center the ring at the natural i-dot height (~0.81 em above baseline).
  // The inline-block span's bottom edge sits ~0.24 em below baseline (descender),
  // so target bottom = 0.81 + 0.24 - outerR = 0.81 + 0.24 - 0.14 = 0.91 em.
  const outerBot = "0.91em";
  const innerBot = "0.98em"; // outerBot + (outerR - innerR) = 0.91 + 0.07

  return (
    <span className={cn("inline-flex items-baseline select-none", className)}>
      {/* "Br" */}
      <span className={cn("font-black text-white tracking-tight leading-none", fontSize)}>
        Br
      </span>

      {/* "i" with yellow ring replacing the natural white dot */}
      <span className="relative inline-block leading-none">
        <span className={cn("font-black text-white tracking-tight leading-none", fontSize)}>
          i
        </span>

        {/* Layer 1 – yellow disc covers the natural white dot */}
        <span
          className="absolute left-1/2 rounded-full pointer-events-none bg-[#FACC15]"
          style={{
            width:     outerD,
            height:    outerD,
            bottom:    outerBot,
            transform: "translateX(-50%)",
            zIndex:    10,
          }}
        />

        {/* Layer 2 – dark cutout makes it a ring */}
        <span
          className="absolute left-1/2 rounded-full pointer-events-none"
          style={{
            width:           innerD,
            height:          innerD,
            bottom:          innerBot,
            transform:       "translateX(-50%)",
            backgroundColor: bg,
            zIndex:          11,
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
